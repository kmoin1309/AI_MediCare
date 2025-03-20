// components/doctor/analytics/DemographicAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line 
} from 'recharts';
import { 
  Users, Download, Filter, Search, ChevronDown, ChevronUp, 
  Calendar, MapPin, Activity, FileText 
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc107'];

interface PatientDemographic {
  id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  condition: string;
  visitCount: number;
  lastVisit: string;
}

interface DemographicAnalyticsProps {
  searchQuery: string;
}

export const DemographicAnalytics: React.FC<DemographicAnalyticsProps> = ({ searchQuery }) => {
  const [patients, setPatients] = useState<PatientDemographic[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 100],
    gender: [] as string[],
    location: [] as string[],
    condition: [] as string[],
  });
  const [selectedPatient, setSelectedPatient] = useState<PatientDemographic | null>(null);

  // Derived data for charts
  const ageDistribution = [
    { name: '18-25', value: patients.filter(p => p.age >= 18 && p.age <= 25).length },
    { name: '26-35', value: patients.filter(p => p.age > 25 && p.age <= 35).length },
    { name: '36-45', value: patients.filter(p => p.age > 35 && p.age <= 45).length },
    { name: '46-60', value: patients.filter(p => p.age > 45 && p.age <= 60).length },
    { name: '60+', value: patients.filter(p => p.age > 60).length },
  ].filter(d => d.value > 0);

  const genderDistribution = [
    { name: 'Male', value: patients.filter(p => p.gender === 'male').length },
    { name: 'Female', value: patients.filter(p => p.gender === 'female').length },
    { name: 'Other', value: patients.filter(p => p.gender === 'other').length },
  ].filter(d => d.value > 0);

  const locationDistribution = [
    { name: 'Urban', value: patients.filter(p => p.location === 'Urban').length },
    { name: 'Suburban', value: patients.filter(p => p.location === 'Suburban').length },
    { name: 'Rural', value: patients.filter(p => p.location === 'Rural').length },
  ].filter(d => d.value > 0);

  const conditionTrends = [
    { month: 'Jan', Chronic: 5, Acute: 3, Preventive: 2 },
    { month: 'Feb', Chronic: 6, Acute: 4, Preventive: 3 },
    { month: 'Mar', Chronic: 4, Acute: 5, Preventive: 2 },
  ];

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const params = new URLSearchParams();
        if (timeRange !== 'all') params.append('timeRange', timeRange.replace('d', ''));
        if (filters.gender.length) params.append('gender', filters.gender.join(','));
        if (filters.location.length) params.append('location', filters.location.join(','));
        if (filters.condition.length) params.append('condition', filters.condition.join(','));
        params.append('ageRange', `${filters.ageRange[0]},${filters.ageRange[1]}`);

        const response = await fetch(`/api/demographics?${params}`);
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch demographics:', error);
      }
    };

    fetchDemographics();
  }, [searchQuery, filters, timeRange]);

  const exportData = () => {
    const csvContent = [
      'ID,Age,Gender,Location,Condition,Visit Count,Last Visit',
      ...patients.map(p => `${p.id},${p.age},${p.gender},${p.location},${p.condition},${p.visitCount},${p.lastVisit}`).join('\n'),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demographics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg ${timeRange === '7d' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg ${timeRange === '30d' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-4 py-2 rounded-lg ${timeRange === '90d' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 rounded-lg ${timeRange === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              All Time
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter size={20} /> Filters {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Download size={20} /> Export
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age Range</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange('ageRange', [Number(e.target.value), filters.ageRange[1]])}
                  className="w-20 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min={18}
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], Number(e.target.value)])}
                  className="w-20 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  max={100}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1 space-y-2">
                {['male', 'female', 'other'].map(g => (
                  <label key={g} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.gender.includes(g)}
                      onChange={(e) => {
                        const newGender = e.target.checked
                          ? [...filters.gender, g]
                          : filters.gender.filter(x => x !== g);
                        handleFilterChange('gender', newGender);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1 space-y-2">
                {['Urban', 'Suburban', 'Rural'].map(l => (
                  <label key={l} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(l)}
                      onChange={(e) => {
                        const newLocation = e.target.checked
                          ? [...filters.location, l]
                          : filters.location.filter(x => x !== l);
                        handleFilterChange('location', newLocation);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <div className="mt-1 space-y-2">
                {['Chronic', 'Acute', 'Preventive'].map(c => (
                  <label key={c} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.condition.includes(c)}
                      onChange={(e) => {
                        const newCondition = e.target.checked
                          ? [...filters.condition, c]
                          : filters.condition.filter(x => x !== c);
                        handleFilterChange('condition', newCondition);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-blue-600" /> Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {ageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} patients`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-blue-600" /> Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value} patients`} />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600" /> Location Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={locationDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {locationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} patients`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-blue-600" /> Condition Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conditionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Chronic" stroke="#0088FE" />
              <Line type="monotone" dataKey="Acute" stroke="#00C49F" />
              <Line type="monotone" dataKey="Preventive" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="mr-2 text-blue-600" /> Patient Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">Visits</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{patient.id}</td>
                  <td className="px-4 py-3">{patient.age}</td>
                  <td className="px-4 py-3 capitalize">{patient.gender}</td>
                  <td className="px-4 py-3">{patient.location}</td>
                  <td className="px-4 py-3">{patient.condition}</td>
                  <td className="px-4 py-3">{patient.visitCount}</td>
                  <td className="px-4 py-3">{patient.lastVisit}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FileText size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Patient #{selectedPatient.id}</h3>
              <button onClick={() => setSelectedPatient(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium">{selectedPatient.age}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-medium capitalize">{selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium">{selectedPatient.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Condition</p>
                  <p className="font-medium">{selectedPatient.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600">Visit Count</p>
                  <p className="font-medium">{selectedPatient.visitCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Visit</p>
                  <p className="font-medium">{selectedPatient.lastVisit}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                  Contact Patient
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
                  View Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};