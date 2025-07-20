// API Configuration and Utilities
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
  email?: string;
  department?: string;
}

export interface InternApplication {
  id: string;
  internId: string;
  name: string;
  email: string;
  phone: string;
  collegeName: string;
  course: string;
  semester: string;
  rollNumber: string;
  department: string;
  startDate: string;
  endDate: string;
  address: string;
  referredBy: string;
  referredByEmpId: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string;
  lastUpdated: string;
  mentor?: string;
  documents: {
    photo?: string;
    resume?: string;
    collegeId?: string;
    lastSemesterResult?: string;
    noc?: string;
    idProof?: string;
    otherDocument?: string;
  };
}

export interface Mentor {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  experience: string;
  mode: 'On-site' | 'Remote' | 'Hybrid';
}

export interface Task {
  id: string;
  internId: string;
  internName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignedBy: string;
  createdDate: string;
}

export interface ProjectSubmission {
  id: string;
  internId: string;
  internName: string;
  department: string;
  projectTitle: string;
  description?: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  fileUrl?: string;
  feedback?: string;
  grade?: string;
}

export interface Review {
  id: string;
  internId: string;
  mentor: string;
  rating: number;
  communication: number;
  technical: number;
  teamwork: number;
  initiative: number;
  comments: string;
  date: string;
}

export interface Meeting {
  id: string;
  internId: string;
  mentor: string;
  title: string;
  date: string;
  time: string;
  type: 'Weekly Review' | 'Project Discussion' | 'Feedback Session';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  agenda?: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Authentication APIs
export const authAPI = {
  login: async (credentials: { empId: string; password: string; role: string }): Promise<ApiResponse<User>> => {
    // Demo implementation - replace with actual API call
    const demoUsers = [
      // Regular employees
      { empId: 'EMP001', password: 'password123', role: 'employee', name: 'Rajesh Kumar' },
      { empId: 'EMP002', password: 'password123', role: 'employee', name: 'Priya Sharma' },
      { empId: 'EMP003', password: 'password123', role: 'employee', name: 'Amit Patel' },
      
      // L&D Team members
      { empId: 'IOCLAdmin', password: 'admin123', role: 'ld_team', name: 'Dr. Suresh Gupta' },
      { empId: 'L&DAdmin', password: 'admin123', role: 'ld_team', name: 'Ms. Kavita Singh' },
      { empId: 'AdminLD', password: 'admin123', role: 'ld_team', name: 'Mr. Vikram Mehta' },
      
      // Interns
      { empId: 'IOCL-123456', password: 'intern123', role: 'intern', name: 'Rahul Sharma' },
      { empId: 'IOCL-123457', password: 'intern123', role: 'intern', name: 'Priya Patel' },
      { empId: 'IOCL-123458', password: 'intern123', role: 'intern', name: 'Amit Singh' },
      
      // Mentors
      { empId: 'MENTOR001', password: 'mentor123', role: 'mentor', name: 'Dr. Rajesh Kumar' },
      { empId: 'MENTOR002', password: 'mentor123', role: 'mentor', name: 'Ms. Priya Sharma' },
      { empId: 'MENTOR003', password: 'mentor123', role: 'mentor', name: 'Mr. Amit Patel' },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = demoUsers.find(u => 
      u.empId === credentials.empId && 
      u.password === credentials.password &&
      u.role === credentials.role
    );

    if (user) {
      return {
        success: true,
        data: {
          empId: user.empId,
          role: user.role as 'employee' | 'ld_team' | 'intern',
          name: user.name
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return {
      success: true
    };
  },

  verifyToken: async (token: string): Promise<ApiResponse<User>> => {
    // Demo implementation
    if (token.startsWith('demo-token-')) {
      const empId = token.replace('demo-token-', '');
      const demoUsers = [
        { empId: 'EMP001', role: 'employee', name: 'Rajesh Kumar' },
        { empId: 'EMP002', role: 'employee', name: 'Priya Sharma' },
        { empId: 'EMP003', role: 'employee', name: 'Amit Patel' },
        { empId: 'IOCLAdmin', role: 'ld_team', name: 'Dr. Suresh Gupta' },
        { empId: 'L&DAdmin', role: 'ld_team', name: 'Ms. Kavita Singh' },
        { empId: 'AdminLD', role: 'ld_team', name: 'Mr. Vikram Mehta' },
        { empId: 'IOCL-123456', role: 'intern', name: 'Rahul Sharma' },
        { empId: 'IOCL-123457', role: 'intern', name: 'Priya Patel' },
        { empId: 'IOCL-123458', role: 'intern', name: 'Amit Singh' },
        { empId: 'MENTOR001', role: 'mentor', name: 'Dr. Rajesh Kumar' },
        { empId: 'MENTOR002', role: 'mentor', name: 'Ms. Priya Sharma' },
        { empId: 'MENTOR003', role: 'mentor', name: 'Mr. Amit Patel' },
      ];

      const user = demoUsers.find(u => u.empId === empId);
      if (user) {
        return {
          success: true,
          data: {
            empId: user.empId,
            role: user.role as 'employee' | 'ld_team' | 'intern' | 'mentor',
            name: user.name
          }
        };
      }
    }
    
    return {
      success: false,
      error: 'Invalid token'
    };
  },
};

// Intern Management APIs
export const internAPI = {
  createApplication: async (applicationData: Partial<InternApplication>): Promise<ApiResponse<InternApplication>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newApplication: InternApplication = {
      id: Date.now().toString(),
      internId: `IOCL-${Date.now().toString().slice(-6)}`,
      name: applicationData.name || '',
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      collegeName: applicationData.collegeName || '',
      course: applicationData.course || '',
      semester: applicationData.semester || '',
      rollNumber: applicationData.rollNumber || '',
      department: applicationData.department || '',
      startDate: applicationData.startDate || '',
      endDate: applicationData.endDate || '',
      address: applicationData.address || '',
      referredBy: applicationData.referredBy || '',
      referredByEmpId: applicationData.referredByEmpId || '',
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      documents: {}
    };

    return {
      success: true,
      data: newApplication
    };
  },

  getApplications: async (filters?: { status?: string; department?: string }): Promise<ApiResponse<InternApplication[]>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoApplications: InternApplication[] = [
      {
        id: '1',
        internId: 'IOCL-123456',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@college.edu',
        phone: '9876543210',
        collegeName: 'IIT Delhi',
        course: 'B.Tech Computer Science',
        semester: '6th',
        rollNumber: 'CS2021001',
        department: 'Engineering',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        address: 'New Delhi',
        referredBy: 'Rajesh Kumar',
        referredByEmpId: 'EMP001',
        status: 'Approved',
        submittedDate: '2025-01-15',
        lastUpdated: '2025-01-18',
        mentor: 'Dr. Rajesh Kumar',
        documents: {}
      }
    ];

    let filteredApplications = demoApplications;
    
    if (filters?.status && filters.status !== 'All') {
      filteredApplications = filteredApplications.filter(app => app.status === filters.status);
    }
    
    if (filters?.department) {
      filteredApplications = filteredApplications.filter(app => app.department === filters.department);
    }

    return {
      success: true,
      data: filteredApplications
    };
  },

  getApplicationById: async (id: string): Promise<ApiResponse<InternApplication>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id,
        internId: 'IOCL-123456',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@college.edu',
        phone: '9876543210',
        collegeName: 'IIT Delhi',
        course: 'B.Tech Computer Science',
        semester: '6th',
        rollNumber: 'CS2021001',
        department: 'Engineering',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        address: 'New Delhi',
        referredBy: 'Rajesh Kumar',
        referredByEmpId: 'EMP001',
        status: 'Approved',
        submittedDate: '2025-01-15',
        lastUpdated: '2025-01-18',
        mentor: 'Dr. Rajesh Kumar',
        documents: {}
      }
    };
  },

  updateApplicationStatus: async (id: string, status: string, mentorId?: string): Promise<ApiResponse<InternApplication>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id,
        internId: 'IOCL-123456',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@college.edu',
        phone: '9876543210',
        collegeName: 'IIT Delhi',
        course: 'B.Tech Computer Science',
        semester: '6th',
        rollNumber: 'CS2021001',
        department: 'Engineering',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        address: 'New Delhi',
        referredBy: 'Rajesh Kumar',
        referredByEmpId: 'EMP001',
        status: status as any,
        submittedDate: '2025-01-15',
        lastUpdated: new Date().toISOString().split('T')[0],
        mentor: mentorId,
        documents: {}
      }
    };
  },

  uploadDocument: async (applicationId: string, documentType: string, file: File): Promise<ApiResponse<{ fileUrl: string }>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        fileUrl: `/uploads/${applicationId}/${documentType}/${file.name}`
      }
    };
  },
};

// Mentor Management APIs
export const mentorAPI = {
  getMentors: async (department?: string): Promise<ApiResponse<Mentor[]>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoMentors: Mentor[] = [
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
      }
    ];

    let filteredMentors = demoMentors;
    if (department) {
      filteredMentors = demoMentors.filter(mentor => mentor.department === department);
    }

    return {
      success: true,
      data: filteredMentors
    };
  },

  createMentor: async (mentorData: Partial<Mentor>): Promise<ApiResponse<Mentor>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMentor: Mentor = {
      id: Date.now().toString(),
      name: mentorData.name || '',
      department: mentorData.department || '',
      email: mentorData.email || '',
      phone: mentorData.phone || '',
      availability: mentorData.availability || 'Available',
      experience: mentorData.experience || '',
      mode: mentorData.mode || 'On-site'
    };

    return {
      success: true,
      data: newMentor
    };
  },

  updateMentor: async (id: string, mentorData: Partial<Mentor>): Promise<ApiResponse<Mentor>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id,
        name: mentorData.name || '',
        department: mentorData.department || '',
        email: mentorData.email || '',
        phone: mentorData.phone || '',
        availability: mentorData.availability || 'Available',
        experience: mentorData.experience || '',
        mode: mentorData.mode || 'On-site'
      }
    };
  },

  deleteMentor: async (id: string): Promise<ApiResponse<void>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true
    };
  },

  assignMentor: async (internId: string, mentorId: string, mode: string): Promise<ApiResponse<void>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true
    };
  },
};

// Task Management APIs
export const taskAPI = {
  getTasks: async (internId?: string): Promise<ApiResponse<Task[]>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoTasks: Task[] = [
      {
        id: '1',
        internId: 'IOCL-123456',
        internName: 'Rahul Sharma',
        title: 'Pipeline Safety Analysis',
        description: 'Analyze safety protocols for oil pipeline systems',
        dueDate: '2025-01-25',
        status: 'In Progress',
        priority: 'High',
        assignedBy: 'Dr. Rajesh Kumar',
        createdDate: '2025-01-15'
      }
    ];

    let filteredTasks = demoTasks;
    if (internId) {
      filteredTasks = demoTasks.filter(task => task.internId === internId);
    }

    return {
      success: true,
      data: filteredTasks
    };
  },

  createTask: async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTask: Task = {
      id: Date.now().toString(),
      internId: taskData.internId || '',
      internName: taskData.internName || '',
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate || '',
      status: 'Pending',
      priority: taskData.priority || 'Medium',
      assignedBy: taskData.assignedBy || '',
      createdDate: new Date().toISOString().split('T')[0]
    };

    return {
      success: true,
      data: newTask
    };
  },

  updateTaskStatus: async (id: string, status: string): Promise<ApiResponse<Task>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id,
        internId: 'IOCL-123456',
        internName: 'Rahul Sharma',
        title: 'Pipeline Safety Analysis',
        description: 'Analyze safety protocols for oil pipeline systems',
        dueDate: '2025-01-25',
        status: status as any,
        priority: 'High',
        assignedBy: 'Dr. Rajesh Kumar',
        createdDate: '2025-01-15'
      }
    };
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true
    };
  },
};

// Project Submission APIs
export const projectAPI = {
  getSubmissions: async (internId?: string): Promise<ApiResponse<ProjectSubmission[]>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoSubmissions: ProjectSubmission[] = [
      {
        id: '1',
        internId: 'IOCL-123456',
        internName: 'Rahul Sharma',
        department: 'Engineering',
        projectTitle: 'Pipeline Safety Analysis System',
        description: 'Comprehensive analysis of pipeline safety protocols',
        submissionDate: '2025-01-18',
        status: 'Approved',
        fileUrl: '/reports/pipeline-safety-analysis.pdf',
        feedback: 'Excellent work on safety protocols analysis.',
        grade: 'A+'
      }
    ];

    let filteredSubmissions = demoSubmissions;
    if (internId) {
      filteredSubmissions = demoSubmissions.filter(submission => submission.internId === internId);
    }

    return {
      success: true,
      data: filteredSubmissions
    };
  },

  createSubmission: async (submissionData: Partial<ProjectSubmission>): Promise<ApiResponse<ProjectSubmission>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSubmission: ProjectSubmission = {
      id: Date.now().toString(),
      internId: submissionData.internId || '',
      internName: submissionData.internName || '',
      department: submissionData.department || '',
      projectTitle: submissionData.projectTitle || '',
      description: submissionData.description,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      fileUrl: submissionData.fileUrl
    };

    return {
      success: true,
      data: newSubmission
    };
  },

  uploadProjectFile: async (submissionId: string, file: File): Promise<ApiResponse<{ fileUrl: string }>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        fileUrl: `/uploads/projects/${submissionId}/${file.name}`
      }
    };
  },

  updateSubmissionStatus: async (id: string, status: string, feedback?: string, grade?: string): Promise<ApiResponse<ProjectSubmission>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id,
        internId: 'IOCL-123456',
        internName: 'Rahul Sharma',
        department: 'Engineering',
        projectTitle: 'Pipeline Safety Analysis System',
        submissionDate: '2025-01-18',
        status: status as any,
        fileUrl: '/reports/pipeline-safety-analysis.pdf',
        feedback,
        grade
      }
    };
  },
};

// Document Generation APIs
export const documentAPI = {
  generateApprovalLetter: async (applicationId: string): Promise<ApiResponse<{ documentUrl: string }>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        documentUrl: `/documents/approval-letter-${applicationId}.pdf`
      }
    };
  },

  generateCompletionCertificate: async (submissionId: string): Promise<ApiResponse<{ documentUrl: string }>> => {
    // Demo implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        documentUrl: `/documents/completion-certificate-${submissionId}.pdf`
      }
    };
  },
};

// Utility functions
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-IN');
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Submitted': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Pending': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
    'Available': 'bg-green-100 text-green-800',
    'Busy': 'bg-yellow-100 text-yellow-800',
    'Unavailable': 'bg-red-100 text-red-800',
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800',
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
};