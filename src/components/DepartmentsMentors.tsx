import React, { useState } from 'react';
import { Users, UserPlus, Edit3, Search, Plus, Trash2 } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  experience: string;
  mode: 'On-site' | 'Remote' | 'Hybrid';
}

const DepartmentsMentors: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assign');
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      department: 'Engineering',
      email: 'rajesh.kumar@iocl.in',
      phone: '9876543210',
      availability: 'Available',
      experience: '15 years',
      mode: 'On-site'
    },
    {
      id: '2',
      name: 'Ms. Priya Sharma',
      department: 'Human Resources',
      email: 'priya.sharma@iocl.in',
      phone: '9876543211',
      availability: 'Busy',
      experience: '12 years',
      mode: 'Remote'
    },
    {
      id: '3',
      name: 'Mr. Amit Patel',
      department: 'Information Technology',
      email: 'amit.patel@iocl.in',
      phone: '9876543212',
      availability: 'Available',
      experience: '10 years',
      mode: 'Hybrid'
    },
  ]);

  const departments = [
    'Human Resources',
    'Information Technology',
    'Marketing',
    'Finance',
    'Operations',
    'Engineering',
    'Research & Development',
    'Quality Assurance',
    'Pipelines Division',
    'Refineries',
  ];

  const [assignForm, setAssignForm] = useState({
    internId: '',
    department: '',
    mentor: '',
    mode: 'On-site' as const,
  });

  const [updateForm, setUpdateForm] = useState({
    name: '',
    department: '',
    email: '',
    phone: '',
    availability: 'Available' as const,
    experience: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignForm.internId && assignForm.department && assignForm.mentor && assignForm.mode) {
      alert(`Mentor assigned successfully!\nIntern ID: ${assignForm.internId}\nMentor: ${assignForm.mentor}\nMode: ${assignForm.mode}`);
      setAssignForm({ internId: '', department: '', mentor: '', mode: 'On-site' });
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateForm.name && updateForm.department && updateForm.email) {
      const newMentor: Mentor = {
        id: Date.now().toString(),
        name: updateForm.name,
        department: updateForm.department,
        email: updateForm.email,
        phone: updateForm.phone,
        availability: updateForm.availability,
        experience: updateForm.experience,
        mode: 'On-site',
      };
      setMentors(prev => [...prev, newMentor]);
      setUpdateForm({
        name: '',
        department: '',
        email: '',
        phone: '',
        availability: 'Available',
        experience: '',
      });
      alert('Mentor added successfully!');
    }
  };

  const handleDeleteMentor = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      setMentors(prev => prev.filter(mentor => mentor.id !== id));
    }
  };

  const getAvailableMentors = (department: string) => {
    return mentors.filter(mentor => 
      mentor.department === department && mentor.availability === 'Available'
    );
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Departments & Mentors</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('assign')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'assign'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Assign Mentors</span>
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'update'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Update Mentors</span>
          </button>
        </div>

        {/* Assign Mentors Tab */}
        {activeTab === 'assign' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Assign Mentors</h3>
              <p className="text-blue-700">
                Select an intern and assign them to an available mentor based on their department preference.
              </p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intern ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assignForm.internId}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, internId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Intern ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignForm.department}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, department: e.target.value, mentor: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Mentor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignForm.mentor}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, mentor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!assignForm.department}
                  >
                    <option value="">Select Mentor</option>
                    {getAvailableMentors(assignForm.department).map(mentor => (
                      <option key={mentor.id} value={mentor.name}>
                        {mentor.name} - {mentor.experience}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode of Internship
                  </label>
                  <select
                    value={assignForm.mode}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, mode: e.target.value as 'On-site' | 'Remote' | 'Hybrid' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Assign Mentor</span>
                </button>
              </div>
            </form>

            {assignForm.department && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Available Mentors in {assignForm.department}
                </h4>
                <div className="space-y-2">
                  {getAvailableMentors(assignForm.department).map(mentor => (
                    <div key={mentor.id} className="flex items-center justify-between bg-white p-3 rounded-md">
                      <div>
                        <p className="font-medium text-gray-800">{mentor.name}</p>
                        <p className="text-sm text-gray-600">{mentor.email} • {mentor.experience}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {mentor.availability}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update Mentors Tab */}
        {activeTab === 'update' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Update Mentors</h3>
              <p className="text-orange-700">
                Add new mentors or update existing mentor information. To be filled by Department HOD.
              </p>
            </div>

            {/* Add New Mentor Form */}
            <form onSubmit={handleUpdateSubmit} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Add New Mentor</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mentor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={updateForm.department}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={updateForm.email}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={updateForm.phone}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={updateForm.availability}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, availability: e.target.value as 'Available' | 'Busy' | 'Unavailable' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={updateForm.experience}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10 years"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Mentor</span>
                </button>
              </div>
            </form>

            {/* Existing Mentors List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-700">Current Mentors</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search mentors..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-800">{mentor.name}</h5>
                        <p className="text-sm text-gray-600">{mentor.department}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          mentor.availability === 'Available' 
                            ? 'bg-green-100 text-green-800'
                            : mentor.availability === 'Busy'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mentor.availability}
                        </span>
                        <button
                          onClick={() => handleDeleteMentor(mentor.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{mentor.email}</p>
                      <p>{mentor.phone}</p>
                      <p>Mode: {mentor.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode Descriptions */}
            {assignForm.mode && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Selected Internship Mode: {assignForm.mode}</h4>
                <div className="text-blue-700">
                  {assignForm.mode === 'On-site' && (
                    <p><strong>On-site:</strong> Intern works physically at IOCL office premises with direct supervision and hands-on experience with equipment and processes.</p>
                  )}
                  {assignForm.mode === 'Remote' && (
                    <p><strong>Remote:</strong> Intern works from their location using digital tools and virtual meetings for project collaboration and mentorship.</p>
                  )}
                  {assignForm.mode === 'Hybrid' && (
                    <p><strong>Hybrid:</strong> Combination of on-site and remote work, allowing flexibility while maintaining essential in-person interactions for critical learning experiences.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsMentors;