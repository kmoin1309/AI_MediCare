// components/patient/analytics/MedicalRecordsAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Download, Activity, Filter, X, CheckCircle, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import { config } from '../../../config/config';

interface UserRecord {
  id: string;
  date: string;
  type: 'consultation' | 'test' | 'prescription';
  description: string;
  doctor: string;
}

interface DiagnosticRecord {
  id: string;
  date: string;
  diagnosis: string;
  testResults: string;
  severity: 'low' | 'medium' | 'high';
  doctor: string;
  notes?: string;
}

interface UserInfo {
  name: string;
  age: number;
  gender: string;
}

// Add the searchQuery prop to the component interface
interface MedicalRecordsAnalyticsProps {
  searchQuery: string;
}

const mockUserInfo: UserInfo = {
  name: 'Arjun Patel',
  age: 34,
  gender: 'Male',
};

const mockUserRecords: UserRecord[] = [
  { id: '1', date: '2025-03-01', type: 'consultation', description: 'Annual checkup', doctor: 'Dr. Ravi Sharma' },
  { id: '2', date: '2025-03-10', type: 'test', description: 'Blood work results', doctor: 'Dr. Priya Mehta' },
  { id: '3', date: '2025-03-15', type: 'prescription', description: 'Antibiotics for infection', doctor: 'Dr. Ravi Sharma' },
  { id: '4', date: '2025-02-20', type: 'consultation', description: 'Follow-up on blood pressure', doctor: 'Dr. Priya Mehta' },
];

const mockDiagnosticRecords: DiagnosticRecord[] = [
  { id: '1', date: '2025-03-10', diagnosis: 'Hypertension', testResults: 'Blood pressure: 140/90 mmHg', severity: 'medium', doctor: 'Dr. Priya Mehta', notes: 'Monitor for 2 weeks' },
  { id: '2', date: '2025-03-01', diagnosis: 'Upper Respiratory Infection', testResults: 'Positive for bacterial infection', severity: 'low', doctor: 'Dr. Ravi Sharma', notes: 'Prescribed antibiotics' },
  { id: '3', date: '2025-02-20', diagnosis: 'Pre-diabetes', testResults: 'A1C: 6.2%', severity: 'medium', doctor: 'Dr. Priya Mehta', notes: 'Dietary changes recommended' },
];

const chartData = [
  { month: 'Jan', consultations: 1, tests: 0, prescriptions: 0 },
  { month: 'Feb', consultations: 1, tests: 0, prescriptions: 0 },
  { month: 'Mar', consultations: 1, tests: 1, prescriptions: 1 },
];

const mockPatientDetails = {
  patientId: "P123456",
  bloodGroup: "B+",
  weight: "75 kg",
  height: "175 cm",
  allergies: "None",
  emergencyContact: "+91 98765 43210"
};

// Add mock doctors data
const mockDoctors = {
  'General Practitioner': [
    { _id: 'gp1', name: 'Dr. Ravi Sharma', availability: true },
    { _id: 'gp2', name: 'Dr. Priya Mehta', availability: true }
  ],
  'Specialist': [
    { _id: 'sp1', name: 'Dr. Anjali Singh', specialty: 'Cardiologist', availability: true },
    { _id: 'sp2', name: 'Dr. Rahul Verma', specialty: 'Neurologist', availability: true }
  ]
};

export const MedicalRecordsAnalytics: React.FC<MedicalRecordsAnalyticsProps> = ({ searchQuery }) => {
  const [userRecords, setUserRecords] = useState<UserRecord[]>(mockUserRecords);
  const [diagnosticRecords, setDiagnosticRecords] = useState<DiagnosticRecord[]>(mockDiagnosticRecords);
  const [activeTab, setActiveTab] = useState<'user' | 'diagnostic'>('user');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'doctor'>('date-desc');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticRecord | null>(null);
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/medical-records`, {
          headers: {
            ...config.DEFAULT_HEADERS,
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          timeout: config.API_TIMEOUT
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }

        const data = await response.json();
        if (data && data.length > 0) {
          // Process and set records
        }
      } catch (error) {
        console.error('Error fetching records:', error);
        // Use mock data on error
      }
    };

    fetchRecords();
  }, []);

  // Add filtering by search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = mockUserRecords.filter(record => 
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserRecords(filtered);
      
      const filteredDiagnostic = mockDiagnosticRecords.filter(record => 
        record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setDiagnosticRecords(filteredDiagnostic);
    } else {
      setUserRecords(mockUserRecords);
      setDiagnosticRecords(mockDiagnosticRecords);
    }
  }, [searchQuery]);

  const filteredUserRecords = userRecords
    .filter(record => filterType === 'all' || record.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.doctor.localeCompare(b.doctor);
    });

  const filteredDiagnosticRecords = diagnosticRecords
    .sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.doctor.localeCompare(b.doctor);
    });

  const exportData = () => {
    if (activeTab === 'user') {
      const csv = [
        'ID,Date,Type,Description,Doctor',
        ...filteredUserRecords.map(r => `${r.id},${r.date},${r.type},${r.description},${r.doctor}`).join('\n'),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user_records.csv';
      link.click();
    } else {
      const csv = [
        'ID,Date,Diagnosis,Test Results,Severity,Doctor,Notes',
        ...filteredDiagnosticRecords.map(r => `${r.id},${r.date},${r.diagnosis},${r.testResults},${r.severity},${r.doctor},${r.notes || ''}`).join('\n'),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagnostic_records.csv';
      link.click();
    }
  };

  const downloadDiagnosticPDF = () => {
    if (!selectedDiagnostic) return;

    const doc = new jsPDF();
    const lineHeight = 10;
    let yPos = 20;

    // Add hospital info
    doc.setFontSize(20);
    doc.text('Terna Medical Hospital', 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.text('123 Healthcare Avenue, Bangalore - 560001', 20, yPos);
    doc.text('Phone: +91 80 1234 5678', 20, yPos + lineHeight);
    yPos += lineHeight * 3;

    // Add title
    doc.setFontSize(16);
    doc.text('Diagnostic Report', 20, yPos);
    yPos += lineHeight * 2;

    // Add patient information
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.text(`Name: ${mockUserInfo.name}`, 20, yPos);
    doc.text(`Patient ID: ${mockPatientDetails.patientId}`, 120, yPos);
    yPos += lineHeight;
    doc.text(`Age: ${mockUserInfo.age}`, 20, yPos);
    doc.text(`Gender: ${mockUserInfo.gender}`, 120, yPos);
    yPos += lineHeight;
    doc.text(`Blood Group: ${mockPatientDetails.bloodGroup}`, 20, yPos);
    doc.text(`Weight: ${mockPatientDetails.weight}`, 120, yPos);
    yPos += lineHeight * 2;

    // Add diagnostic details with a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos - 5, 190, yPos - 5);
    doc.setFontSize(14);
    doc.text('Diagnostic Details:', 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);

    const details = [
      { label: 'Diagnosis', value: selectedDiagnostic.diagnosis },
      { label: 'Date', value: selectedDiagnostic.date },
      { label: 'Test Results', value: selectedDiagnostic.testResults },
      { label: 'Severity', value: selectedDiagnostic.severity.toUpperCase() },
      { label: 'Doctor', value: selectedDiagnostic.doctor },
      { label: 'Notes', value: selectedDiagnostic.notes || 'N/A' }
    ];

    details.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += lineHeight;
    });

    // Add recommendations section
    yPos += lineHeight;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos - 5, 190, yPos - 5);
    doc.setFontSize(14);
    doc.text('Recommendations:', 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.text('1. Follow prescribed medication schedule', 25, yPos);
    yPos += lineHeight;
    doc.text('2. Schedule follow-up in 2 weeks', 25, yPos);
    yPos += lineHeight;
    doc.text('3. Maintain healthy diet and exercise routine', 25, yPos);

    // Add footer
    doc.setFontSize(10);
    doc.text('This is a computer-generated document.', 20, 280);
    doc.text('For any queries, contact: support@medicalavalon.com', 20, 285);

    doc.save(`diagnostic-report-${selectedDiagnostic.id}.pdf`);
  };

  const handleBookAppointment = async (doctorType: string) => {
    setIsBookingAppointment(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/appointments/book`, {
        method: 'POST',
        headers: {
          ...config.DEFAULT_HEADERS,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorType,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      const doctor = data.doctor;
      const appointmentDate = new Date(data.date);

      setBookingSuccess(
        `Appointment booked successfully with ${doctor.name} for ${appointmentDate.toLocaleDateString()} at 10:00 AM`
      );
    } catch (error: any) {
      setBookingError(error.message || 'Failed to book appointment');
    } finally {
      setIsBookingAppointment(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 text-blue-600" /> Patient Information
        </h3>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {mockUserInfo.name}</p>
          <p><span className="font-medium">Age:</span> {mockUserInfo.age}</p>
          <p><span className="font-medium">Gender:</span> {mockUserInfo.gender}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Activity className="mr-2 text-blue-600" /> Records Trend
          </h3>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
          >
            <Download size={20} /> Export {activeTab === 'user' ? 'User Records' : 'Diagnostic Records'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="consultations" stroke="#0088FE" name="Consultations" />
            <Line type="monotone" dataKey="tests" stroke="#00C49F" name="Tests" />
            <Line type="monotone" dataKey="prescriptions" stroke="#FFBB28" name="Prescriptions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-4 py-2 rounded-full ${activeTab === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all`}
            >
              User Records
            </button>
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`px-4 py-2 rounded-full ${activeTab === 'diagnostic' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all`}
            >
              Diagnostic Records
            </button>
          </div>
          <div className="flex gap-3">
            {activeTab === 'user' && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultations</option>
                <option value="test">Tests</option>
                <option value="prescription">Prescriptions</option>
              </select>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date-asc' | 'date-desc' | 'doctor')}
              className="border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">Sort by Date (Newest)</option>
              <option value="date-asc">Sort by Date (Oldest)</option>
              <option value="doctor">Sort by Doctor</option>
            </select>
          </div>
        </div>

        {/* User Records Tab */}
        {activeTab === 'user' && (
          <div className="space-y-4">
            {filteredUserRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No records found.</p>
            ) : (
              filteredUserRecords.map(record => (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <p className="font-medium capitalize">{record.type} - {record.doctor}</p>
                  <p className="text-gray-600">{record.date}</p>
                  <p className="text-sm text-gray-500">{record.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Diagnostic Records Tab */}
        {activeTab === 'diagnostic' && (
          <div className="space-y-4">
            {filteredDiagnosticRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No diagnostic records found.</p>
            ) : (
              filteredDiagnosticRecords.map(record => (
                <div
                  key={record.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => setSelectedDiagnostic(record)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{record.diagnosis} - {record.doctor}</p>
                      <p className="text-gray-600">{record.date}</p>
                      <p className="text-sm text-gray-500">{record.testResults}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.severity === 'low' ? 'bg-green-100 text-green-800' :
                        record.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Diagnostic Details Modal */}
      {selectedDiagnostic && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Diagnostic Details</h4>
              <button onClick={() => setSelectedDiagnostic(null)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <p><span className="font-medium">Diagnosis:</span> {selectedDiagnostic.diagnosis}</p>
              <p><span className="font-medium">Date:</span> {selectedDiagnostic.date}</p>
              <p><span className="font-medium">Test Results:</span> {selectedDiagnostic.testResults}</p>
              <p><span className="font-medium">Severity:</span> {selectedDiagnostic.severity.charAt(0).toUpperCase() + selectedDiagnostic.severity.slice(1)}</p>
              <p><span className="font-medium">Doctor:</span> {selectedDiagnostic.doctor}</p>
              {selectedDiagnostic.notes && <p><span className="font-medium">Notes:</span> {selectedDiagnostic.notes}</p>}
              
              <div className="mt-6 space-y-4">
                {bookingSuccess && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span>{bookingSuccess}</span>
                  </div>
                )}
                
                {bookingError && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
                    <X size={20} className="text-red-600" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={downloadDiagnosticPDF}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
                  >
                    <Download size={20} /> Download PDF
                  </button>
                  
                  <button
                    onClick={() => handleBookAppointment('General Practitioner')}
                    disabled={isBookingAppointment}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all"
                  >
                    {isBookingAppointment ? (
                      <>
                        <span>Booking...</span>
                        <div className="animate-spin h-4 w-4 border-2 border-t-white rounded-full"></div>
                      </>
                    ) : (
                      <>
                        <Calendar size={20} /> Book Appointment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};