import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Phone, MapPin, Award, Activity, Search, Download, RefreshCw, Filter, TrendingUp, AlertCircle, Edit, Trash2, Eye, X, Check, Ban, Shield } from 'lucide-react';

export default function UsersManagement() {
  // Backend API Configuration
 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'delete'
  const [editForm, setEditForm] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    uniqueDomains: 0,
    newUsersToday: 0,
    healthcareUsers: 0,
    agricultureUsers: 0,
    environmentUsers: 0
  });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch all users from MongoDB backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        calculateStats(data.users);
      }
      */

      // ============ DUMMY DATA (Remove when API ready) ============
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dummyUsers = [
        {
          _id: '1',
          name: 'Dr. Sarah Chen',
          email: 'sarah.chen@hospital.org',
          role: 'Healthcare Specialist',
          domain: 'Healthcare',
          phone: '+1 555-0101',
          location: 'New York, USA',
          projects: 12,
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'SC',
          subscription: 'Premium',
          completedProjects: 8,
          ongoingProjects: 4,
          bio: 'Expert in AI-powered medical diagnostics'
        },
        {
          _id: '2',
          name: 'John Miller',
          email: 'j.miller@agritech.com',
          role: 'Agriculture Expert',
          domain: 'Agriculture',
          phone: '+1 555-0102',
          location: 'Iowa, USA',
          projects: 8,
          status: 'active',
          createdAt: '2024-03-20T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'JM',
          subscription: 'Standard',
          completedProjects: 5,
          ongoingProjects: 3,
          bio: 'Specializing in crop optimization AI'
        },
        {
          _id: '3',
          name: 'Dr. Emily Rodriguez',
          email: 'emily.r@enviro.org',
          role: 'Environmental Scientist',
          domain: 'Environment',
          phone: '+1 555-0103',
          location: 'California, USA',
          projects: 15,
          status: 'active',
          createdAt: '2023-11-10T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'ER',
          subscription: 'Premium',
          completedProjects: 10,
          ongoingProjects: 5,
          bio: 'Climate prediction and sustainability'
        },
        {
          _id: '4',
          name: 'Michael Brown',
          email: 'mbrown@health.com',
          role: 'Research Analyst',
          domain: 'Healthcare',
          phone: '+1 555-0104',
          location: 'Boston, USA',
          projects: 6,
          status: 'inactive',
          createdAt: '2024-05-12T00:00:00Z',
          lastLogin: '2024-09-01T00:00:00Z',
          avatar: 'MB',
          subscription: 'Free',
          completedProjects: 4,
          ongoingProjects: 2,
          bio: 'Healthcare data analysis specialist'
        }
      ];

      setUsers(dummyUsers);
      calculateStats(dummyUsers);
      setLastUpdate(new Date());
      showNotification('Users data refreshed successfully!');

    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (usersList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setStats({
      totalUsers: usersList.length,
      activeUsers: usersList.filter(u => u.status === 'active').length,
      totalProjects: usersList.reduce((sum, u) => sum + u.projects, 0),
      uniqueDomains: new Set(usersList.map(u => u.domain)).size,
      newUsersToday: usersList.filter(u => 
        new Date(u.createdAt) >= today
      ).length,
      healthcareUsers: usersList.filter(u => u.domain === 'Healthcare').length,
      agricultureUsers: usersList.filter(u => u.domain === 'Agriculture').length,
      environmentUsers: usersList.filter(u => u.domain === 'Environment').length
    });
  };

  // View user profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm(user);
    setModalType('edit');
    setShowModal(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        showNotification('User updated successfully!');
      }
      */

      // ============ DUMMY UPDATE (Remove when API ready) ============
      setUsers(users.map(u => u._id === editForm._id ? editForm : u));
      calculateStats(users.map(u => u._id === editForm._id ? editForm : u));
      setShowModal(false);
      showNotification('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  // Delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  // Confirm delete
  const confirmDeleteUser = async () => {
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        showNotification('User deleted successfully!');
      }
      */

      // ============ DUMMY DELETE (Remove when API ready) ============
      const updatedUsers = users.filter(u => u._id !== selectedUser._id);
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      setShowModal(false);
      showNotification('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user', 'error');
    }
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${user._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        showNotification(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      }
      */

      // ============ DUMMY UPDATE (Remove when API ready) ============
      const updatedUsers = users.map(u => 
        u._id === user._id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      showNotification(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('Error updating status', 'error');
    }
  };

  // Export users to CSV
  const handleExportCSV = () => {
    try {
      const csvData = [
        ['User Management Report'],
        ['Generated:', new Date().toLocaleString()],
        [],
        ['User Details'],
        ['Name', 'Email', 'Role', 'Domain', 'Phone', 'Location', 'Projects', 'Status', 'Join Date', 'Subscription'],
        ...users.map(u => [
          u.name,
          u.email,
          u.role,
          u.domain,
          u.phone || 'N/A',
          u.location || 'N/A',
          u.projects,
          u.status,
          new Date(u.createdAt).toLocaleDateString(),
          u.subscription || 'Free'
        ]),
        [],
        ['STATISTICS'],
        ['Total Users', stats.totalUsers],
        ['Active Users', stats.activeUsers],
        ['Total Projects', stats.totalProjects],
        ['Healthcare Users', stats.healthcareUsers],
        ['Agriculture Users', stats.agricultureUsers],
        ['Environment Users', stats.environmentUsers]
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('CSV exported successfully!');
    } catch (error) {
      console.error('CSV Export Error:', error);
      showNotification('Error exporting CSV', 'error');
    }
  };

  // Export filtered users
  const handleExportFiltered = () => {
    const filtered = filteredUsers;
    const csvData = [
      ['Filtered Users Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Filters:', `Domain: ${selectedRole}, Status: ${selectedStatus}, Search: ${searchTerm || 'None'}`],
      [],
      ['Name', 'Email', 'Domain', 'Status', 'Projects'],
      ...filtered.map(u => [u.name, u.email, u.domain, u.status, u.projects])
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `filtered-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Filtered users exported!');
  };

  const getDomainColor = (domain) => {
    const colors = {
      'Healthcare': '#ef4444',
      'Agriculture': '#10b981',
      'Environment': '#14b8a6',
      'Education': '#f59e0b',
      'Research': '#8b5cf6'
    };
    return colors[domain] || '#6b7280';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.domain === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Initial load
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="users-wrapper">
      <style>{`
        .users-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .users-container {
          max-width: 1800px;
          margin: 0 auto;
        }

        .notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #10b981;
        }

        .notification.error {
          border-left-color: #ef4444;
        }

        .notification-text {
          font-weight: 600;
          color: #1e293b;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease-out;
        }

        .modal {
          background: white;
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.3s ease-out;
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #1e293b;
        }

        .close-btn {
          background: #f8fafc;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e2e8f0;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 2px solid #e2e8f0;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          font-weight: 600;
          transition: all 0.3s;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .header-section {
          margin-bottom: 2.5rem;
          animation: fadeIn 0.6s ease-out;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-icon {
          padding: 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          animation: pulse 3s ease-in-out infinite;
        }

        .header-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #1e293b, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .header-subtitle {
          color: #64748b;
          font-size: 1.125rem;
          margin: 0.5rem 0 0 0;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.875rem 1.5rem;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          color: #1e293b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .action-btn:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
        }

        .action-btn.primary:hover {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .action-btn.danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
        }

        .action-btn.danger:hover {
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .refresh-icon {
          animation: ${isLoading ? 'spin 1s linear infinite' : 'none'};
        }

        .last-update {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.75rem;
          margin-bottom: 2.5rem;
          animation: fadeIn 0.6s ease-out 0.2s backwards;
        }

        .stat-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: scaleIn 0.6s ease-out backwards;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        .stat-card:hover {
          border-color: #3b82f6;
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.2);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 900;
          color: #1e293b;
          line-height: 1;
          margin: 0.5rem 0;
        }

        .stat-subtext {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .search-filter-section {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          animation: fadeIn 0.6s ease-out 0.4s backwards;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .search-filter-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3.5rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 1rem;
          color: #1e293b;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus {
          outline: none;
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .filter-btn {
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .filter-btn.inactive {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
        }

        .filter-btn.inactive:hover {
          background: white;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.75rem;
          animation: fadeIn 0.6s ease-out 0.6s backwards;
        }

        .user-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .user-card:hover {
          border-color: #3b82f6;
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.2);
        }

        .user-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 1.25rem;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .user-details h3 {
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .user-details p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-weight: 600;
        }

        .status-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-active {
          background: #10b981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        }

        .status-inactive {
          background: #6b7280;
          box-shadow: 0 0 12px rgba(107, 114, 128, 0.6);
        }

        .user-contact {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #475569;
          font-weight: 600;
        }

        .contact-item svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .projects-badge {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .projects-info p:first-child {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .projects-info p:last-child {
          color: #1e293b;
          font-weight: 900;
          font-size: 2rem;
          margin: 0;
        }

        .user-actions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .user-action-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .user-action-btn.view {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #3b82f6;
        }

        .user-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .user-action-btn.edit {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #10b981;
        }

        .user-action-btn.edit:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .user-action-btn.delete {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #ef4444;
        }

        .user-action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .user-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
        }

        .join-date {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .toggle-status-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .toggle-status-btn.active {
          background: #d1fae5;
          color: #059669;
          border-color: #10b981;
        }

        .toggle-status-btn.inactive {
          background: #fee2e2;
          color: #dc2626;
          border-color: #ef4444;
        }

        .toggle-status-btn:hover {
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          animation: fadeIn 0.6s ease-out;
        }

        .empty-icon {
          width: 6rem;
          height: 6rem;
          color: #cbd5e1;
          margin: 0 auto 2rem;
        }

        .empty-text {
          font-size: 1.5rem;
          color: #64748b;
          font-weight: 700;
        }

        .profile-detail {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }

        .profile-detail-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .profile-detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        @media (max-width: 1024px) {
          .users-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .users-wrapper {
            padding: 1rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
            text-align: center;
          }

          .user-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="users-container">
        {/* Notification */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? <Check size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
            <span className="notification-text">{notification.message}</span>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalType === 'view' && 'User Profile'}
                  {modalType === 'edit' && 'Edit User'}
                  {modalType === 'delete' && 'Delete User'}
                </h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {modalType === 'view' && selectedUser && (
                  <>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Full Name</p>
                      <p className="profile-detail-value">{selectedUser.name}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Email</p>
                      <p className="profile-detail-value">{selectedUser.email}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Role</p>
                      <p className="profile-detail-value">{selectedUser.role}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Domain</p>
                      <p className="profile-detail-value">{selectedUser.domain}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Phone</p>
                      <p className="profile-detail-value">{selectedUser.phone}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Location</p>
                      <p className="profile-detail-value">{selectedUser.location}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Projects</p>
                      <p className="profile-detail-value">{selectedUser.projects} total ({selectedUser.completedProjects} completed, {selectedUser.ongoingProjects} ongoing)</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Subscription</p>
                      <p className="profile-detail-value">{selectedUser.subscription}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Bio</p>
                      <p className="profile-detail-value">{selectedUser.bio}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Status</p>
                      <p className="profile-detail-value" style={{color: selectedUser.status === 'active' ? '#10b981' : '#ef4444', fontWeight: '800'}}>{selectedUser.status.toUpperCase()}</p>
                    </div>
                  </>
                )}

                {modalType === 'edit' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        className="form-input" 
                        type="text" 
                        value={editForm.name || ''} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        className="form-input" 
                        type="email" 
                        value={editForm.email || ''} 
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input 
                        className="form-input" 
                        type="text" 
                        value={editForm.role || ''} 
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Domain</label>
                      <select 
                        className="form-select" 
                        value={editForm.domain || ''} 
                        onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Environment">Environment</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input 
                        className="form-input" 
                        type="tel" 
                        value={editForm.phone || ''} 
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input 
                        className="form-input" 
                        type="text" 
                        value={editForm.location || ''} 
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select" 
                        value={editForm.status || ''} 
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'delete' && selectedUser && (
                  <div>
                    <p style={{fontSize: '1.125rem', color: '#64748b', marginBottom: '1.5rem'}}>
                      Are you sure you want to delete <strong style={{color: '#1e293b'}}>{selectedUser.name}</strong>?
                    </p>
                    <div style={{padding: '1rem', background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '12px'}}>
                      <p style={{fontSize: '0.875rem', color: '#dc2626', fontWeight: '600', margin: 0}}>
                        ⚠️ This action cannot be undone. All user data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="action-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                {modalType === 'edit' && (
                  <button className="action-btn primary" onClick={handleUpdateUser}>
                    <Check size={18} />
                    Save Changes
                  </button>
                )}
                {modalType === 'delete' && (
                  <button className="action-btn danger" onClick={confirmDeleteUser}>
                    <Trash2 size={18} />
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div>
              <div className="header-left">
                <div className="header-icon">
                  <Users style={{ width: '36px', height: '36px', color: 'white' }} />
                </div>
                <div>
                  <h1 className="header-title">User Management</h1>
                  <p className="header-subtitle">Track and manage registered users across all domains</p>
                  <p className="last-update">Last updated: {lastUpdate.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={handleExportCSV}>
                <Download size={20} />
                Export All
              </button>
              <button className="action-btn" onClick={handleExportFiltered}>
                <Download size={20} />
                Export Filtered
              </button>
              <button 
                className="action-btn primary" 
                onClick={fetchUsers}
                disabled={isLoading}
              >
                <RefreshCw className="refresh-icon" size={20} />
                {isLoading ? 'Updating...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <Users style={{ width: '36px', height: '36px', color: '#3b82f6' }} />
            </div>
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
            <p className="stat-subtext">
              <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px', color: '#10b981' }} />
              {stats.newUsersToday} new today
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Activity style={{ width: '36px', height: '36px', color: '#10b981' }} />
            </div>
            <p className="stat-label">Active Users</p>
            <p className="stat-value">{stats.activeUsers}</p>
            <p className="stat-subtext">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% active rate</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Award style={{ width: '36px', height: '36px', color: '#f59e0b' }} />
            </div>
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{stats.totalProjects}</p>
            <p className="stat-subtext">{(stats.totalProjects / stats.totalUsers).toFixed(1)} avg per user</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <MapPin style={{ width: '36px', height: '36px', color: '#8b5cf6' }} />
            </div>
            <p className="stat-label">Active Domains</p>
            <p className="stat-value">{stats.uniqueDomains}</p>
            <p className="stat-subtext">Healthcare, Agriculture, Environment</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="search-filter-section">
          <div className="search-filter-container">
            <div className="search-wrapper">
              <Search className="search-icon" style={{ width: '20px', height: '20px' }} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <p className="filter-label">
                <Filter size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Filter by Domain
              </p>
              <div className="filter-buttons">
                <button
                  onClick={() => setSelectedRole('all')}
                  className={`filter-btn ${selectedRole === 'all' ? 'active' : 'inactive'}`}
                >
                  All Domains
                </button>
                {['Healthcare', 'Agriculture', 'Environment'].map(domain => (
                  <button
                    key={domain}
                    onClick={() => setSelectedRole(domain)}
                    className={`filter-btn ${selectedRole === domain ? 'active' : 'inactive'}`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <p className="filter-label">Filter by Status</p>
              <div className="filter-buttons">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`filter-btn ${selectedStatus === 'all' ? 'active' : 'inactive'}`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setSelectedStatus('active')}
                  className={`filter-btn ${selectedStatus === 'active' ? 'active' : 'inactive'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedStatus('inactive')}
                  className={`filter-btn ${selectedStatus === 'inactive' ? 'active' : 'inactive'}`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <div className="user-info">
                    <div className="user-avatar" style={{ backgroundColor: getDomainColor(user.domain) }}>
                      {user.avatar || getInitials(user.name)}
                    </div>
                    <div className="user-details">
                      <h3>{user.name}</h3>
                      <p>{user.role}</p>
                    </div>
                  </div>
                  <div className={`status-indicator ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}></div>
                </div>

                <div className="user-contact">
                  <div className="contact-item">
                    <Mail style={{ width: '18px', height: '18px' }} />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="contact-item">
                      <Phone style={{ width: '18px', height: '18px' }} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="contact-item">
                      <MapPin style={{ width: '18px', height: '18px' }} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="projects-badge">
                  <div className="projects-info">
                    <p>Active Projects</p>
                    <p>{user.projects}</p>
                  </div>
                  <Award style={{ width: '44px', height: '44px', color: '#f59e0b' }} />
                </div>

                <div className="user-actions">
                  <button className="user-action-btn view" onClick={() => handleViewProfile(user)}>
                    <Eye size={16} />
                    View
                  </button>
                  <button className="user-action-btn edit" onClick={() => handleEditUser(user)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="user-action-btn delete" onClick={() => handleDeleteUser(user)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <div className="user-footer">
                  <span className="join-date">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    className={`toggle-status-btn ${user.status}`}
                    onClick={() => toggleUserStatus(user)}
                  >
                    {user.status === 'active' ? <Ban size={14} /> : <Check size={14} />}
                    {user.status === 'active' ? ' Deactivate' : ' Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AlertCircle className="empty-icon" />
            <p className="empty-text">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
