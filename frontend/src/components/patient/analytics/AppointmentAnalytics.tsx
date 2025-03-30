// components/patient/analytics/AppointmentAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Clock, Video, X, Trash2, Edit, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  purpose?: string;
  location?: string;
  notes?: string;
}

// Update mock appointments with Indian names
const mockAppointments: Appointment[] = [
  { 
    _id: '1', 
    date: '2025-03-21', 
    time: '10:00', 
    doctor: 'Dr. Priya Verma', 
    status: 'scheduled', 
    purpose: 'Follow-up on knee injury', 
    location: 'https://meet.example.com/abc123', 
    notes: 'Bring recent X-ray reports' 
  },
  { 
    _id: '2', 
    date: '2025-03-15', 
    time: '14:00', 
    doctor: 'Dr. Rajesh Kumar', 
    status: 'completed', 
    purpose: 'Annual health check-up', 
    location: 'Clinic A', 
    notes: 'Blood test results reviewed' 
  },
  { 
    _id: '3', 
    date: '2025-03-18', 
    time: '09:30', 
    doctor: 'Dr. Ananya Singh', 
    status: 'completed', 
    purpose: 'Skin allergy consultation', 
    location: 'Clinic B', 
    notes: '' 
  },
  { 
    _id: '4', 
    date: '2025-03-25', 
    time: '11:00', 
    doctor: 'Dr. Arun Patel', 
    status: 'scheduled', 
    purpose: 'Diabetes check-up', 
    location: 'https://meet.example.com/def456', 
    notes: 'Bring glucose monitoring records' 
  },
  { 
    _id: '5', 
    date: '2025-03-20', 
    time: '16:30', 
    doctor: 'Dr. Meera Sharma', 
    status: 'cancelled', 
    purpose: 'General consultation', 
    location: 'Clinic C', 
    notes: 'Rescheduling needed' 
  }
];

export const AppointmentAnalytics: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments); // Initialize with mock data
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('scheduled');
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState<string | null>(null);
  const [newNotes, setNewNotes] = useState<string>('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAppointments(response.data);
        } else {
          // Use mock data if API returns empty or invalid data
          setAppointments(mockAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Use mock data on error
        setAppointments(mockAppointments);
        setError('Failed to fetch appointments, using mock data');
      }
    };

    fetchAppointments();
  }, []);

  // Add event listener for new appointments
  useEffect(() => {
    const handleNewAppointment = (event: CustomEvent) => {
      setAppointments(prev => [event.detail, ...prev]);
    };

    window.addEventListener('appointmentBooked', handleNewAppointment as EventListener);
    return () => {
      window.removeEventListener('appointmentBooked', handleNewAppointment as EventListener);
    };
  }, []);

  // Update event listener for new appointments
  useEffect(() => {
    const handleNewAppointment = (event: CustomEvent<Appointment>) => {
      const newAppointment = event.detail;
      setAppointments(prev => [newAppointment, ...prev]);
      // Reset filter to show scheduled appointments
      setFilter('scheduled');
    };

    window.addEventListener('appointmentBooked', handleNewAppointment as EventListener);
    return () => {
      window.removeEventListener('appointmentBooked', handleNewAppointment as EventListener);
    };
  }, []);

  const chartData = React.useMemo(() => [
    { name: 'Scheduled', value: appointments?.filter(a => a.status === 'scheduled')?.length || 0 },
    { name: 'Completed', value: appointments?.filter(a => a.status === 'completed')?.length || 0 },
    { name: 'Cancelled', value: appointments?.filter(a => a.status === 'cancelled')?.length || 0 },
  ].filter(d => d.value > 0), [appointments]);

  const exportData = () => {
    const csv = [
      'ID,Date,Time,Doctor,Status,Purpose,Location,Notes',
      ...appointments.map(a => `${a._id},${a.date},${a.time},${a.doctor},${a.status},${a.purpose || ''},${a.location || ''},${a.notes || ''}`).join('\n')
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appointments.csv';
    link.click();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleJoinMeet = (location: string) => {
    setShowJoinPopup(true);
    setTimeout(() => setShowJoinPopup(false), 2000); // Static popup for 2 seconds
    // Uncomment for real functionality
    // window.open(location, '_blank');
  };

  const handleCancel = async (id: string) => {
    try {
      // Try to update via API first
      try {
        await axios.patch(`/api/appointment/${id}`,
          { status: 'cancelled' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (apiError) {
        console.log('API error, updating mock data instead:', apiError);
      }

      // Update local state regardless of API success
      setAppointments(prev => prev.map(a =>
        a._id === id ? { ...a, status: 'cancelled' } : a
      ));
      setShowCancelConfirm(null);
      setSelectedAppointment(null);

    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Show error message to user
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const handleReschedule = async (id: string, newDate: string, newTime: string) => {
    try {
      const response = await axios.patch(`/api/appointment/${id}`,
        { date: newDate, time: newTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setAppointments(prev => prev.map(a =>
        a._id === id ? response.data as Appointment : a
      ));
      setShowReschedule(null);
      setSelectedAppointment(prev => prev && { ...prev, date: newDate, time: newTime });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleAddNotes = async (id: string) => {
    try {
      const response = await axios.patch(`/api/appointment/${id}`,
        { notes: newNotes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setAppointments(prev => prev.map(a =>
        a._id === id ? response.data as Appointment : a
      ));
      setSelectedAppointment(prev => prev && { ...prev, notes: newNotes });
      setNewNotes('');
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  // Add error display in the JSX
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Appointment Overview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold flex items-center text-gray-800">
            <Calendar className="mr-2 text-blue-600" size={28} /> Appointment Overview
          </h3>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <Download size={20} /> Export
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" fill="#0088FE" name="Appointments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Appointments List Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <Clock className="mr-2 text-blue-600" size={28} /> {filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments
        </h3>
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-6 italic">No {filter} appointments found.</p>
          ) : (
            filteredAppointments.map(appointment => (
              <div
                key={appointment._id}
                className="p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">{appointment.doctor}</p>
                  <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                  <p className="text-sm text-gray-500 mt-1">{appointment.purpose}</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinMeet(appointment.location!);
                      }}
                      className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all shadow-md"
                    >
                      <Video size={18} /> Join Video Meeting
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h4>
            <div className="space-y-3">
              <p><span className="font-medium text-gray-700">Doctor:</span> {selectedAppointment.doctor}</p>
              <p><span className="font-medium text-gray-700">Date:</span> {selectedAppointment.date}</p>
              <p><span className="font-medium text-gray-700">Time:</span> {selectedAppointment.time}</p>
              <p><span className="font-medium text-gray-700">Purpose:</span> {selectedAppointment.purpose || 'Not specified'}</p>
              <p><span className="font-medium text-gray-700">Location:</span> {selectedAppointment.location || 'Not specified'}</p>
              <p><span className="font-medium text-gray-700">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${selectedAppointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedAppointment.status}
                </span>
              </p>
              <div>
                <span className="font-medium text-gray-700">Notes:</span>
                <p className="text-gray-600 mt-1">{selectedAppointment.notes || 'No notes added'}</p>
                {selectedAppointment.status === 'scheduled' && (
                  <div className="mt-2">
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Add or edit notes..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddNotes(selectedAppointment._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-all"
                    >
                      Save Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
            {selectedAppointment.status === 'scheduled' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleJoinMeet(selectedAppointment.location!)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 rounded-full hover:bg-indigo-600 transition-all shadow-md"
                >
                  <Video size={20} /> Join Video Meeting
                </button>
                <button
                  onClick={() => setShowReschedule(selectedAppointment._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-full hover:bg-yellow-600 transition-all shadow-md"
                >
                  <Edit size={20} /> Reschedule
                </button>
                <button
                  onClick={() => setShowCancelConfirm(selectedAppointment._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-all shadow-md"
                >
                  <Trash2 size={20} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Join Meeting Popup */}
      {showJoinPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-500" size={32} />
              <h4 className="text-xl font-semibold text-gray-800">You have joined the video meeting</h4>
            </div>
            <p className="text-gray-600">Enjoy your consultation!</p>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-fade-in">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h4>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleCancel(showCancelConfirm)}
                className="flex-1 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-all"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full hover:bg-gray-400 transition-all"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-fade-in">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Reschedule Appointment</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Date</label>
                <input
                  type="date"
                  defaultValue={appointments.find(a => a._id === showReschedule)?.date}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleReschedule(showReschedule, e.target.value, appointments.find(a => a._id === showReschedule)?.time || '10:00')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Time</label>
                <input
                  type="time"
                  defaultValue={appointments.find(a => a._id === showReschedule)?.time}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleReschedule(showReschedule, appointments.find(a => a._id === showReschedule)?.date || '', e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setShowReschedule(null)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};