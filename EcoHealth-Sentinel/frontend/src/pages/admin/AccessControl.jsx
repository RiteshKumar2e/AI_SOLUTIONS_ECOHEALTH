// src/pages/admin/AccessControl.jsx
import { useState, useEffect } from 'react';
import { Shield, User, Lock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Download, Search, Activity, Key, Clock, MapPin, LogIn, Edit, Trash2, UserPlus, Eye, Sun, Moon } from 'lucide-react';

export default function AccessControl() {
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [users, setUsers] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    activeUsers: 0,
    suspendedUsers: 0,
    securityEvents: 0,
    securityScore: 95,
    todayLogins: 0,
    failedAttempts: 0
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const [usersRes, logsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/access-control/users`, { headers }),
        fetch(`${API_BASE_URL}/admin/access-control/logs`, { headers })
      ]);

      const usersData = await usersRes.json();
      const logsData = await logsRes.json();

      if (usersData.success) {
        setUsers(usersData.users);
        setSecurityLogs(logsData.logs);
      }
      */

      // ============ DUMMY DATA (Remove when API ready) ============
      await new Promise(resolve => setTimeout(resolve, 800));

      const dummyUsers = [
        { _id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@hospital.org', role: 'Healthcare Admin', domain: 'Healthcare', status: 'active', permissions: ['read', 'write', 'approve', 'delete'], lastAccess: '2 hours ago', lastLogin: new Date().toISOString(), ipAddress: '192.168.1.45', loginCount: 342, failedAttempts: 0, createdAt: '2024-01-15T00:00:00Z', location: 'New York, USA', phone: '+1-555-0101' },
        { _id: '2', name: 'John Miller', email: 'j.miller@agritech.com', role: 'Agriculture Specialist', domain: 'Agriculture', status: 'active', permissions: ['read', 'write', 'approve'], lastAccess: '5 hours ago', lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), ipAddress: '192.168.1.46', loginCount: 287, failedAttempts: 0, createdAt: '2024-03-20T00:00:00Z', location: 'Iowa, USA', phone: '+1-555-0102' },
        { _id: '3', name: 'Emily Rodriguez', email: 'emily.r@enviro.org', role: 'Environment Monitor', domain: 'Environment', status: 'active', permissions: ['read', 'write'], lastAccess: '1 day ago', lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), ipAddress: '192.168.1.47', loginCount: 156, failedAttempts: 0, createdAt: '2023-11-10T00:00:00Z', location: 'California, USA', phone: '+1-555-0103' },
        { _id: '4', name: 'David Park', email: 'david.p@datalytics.com', role: 'Data Analyst', domain: 'All', status: 'suspended', permissions: ['read'], lastAccess: '3 days ago', lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), ipAddress: '192.168.1.48', loginCount: 89, failedAttempts: 3, createdAt: '2024-05-12T00:00:00Z', location: 'Boston, USA', phone: '+1-555-0104' },
        { _id: '5', name: 'Maria Garcia', email: 'maria.g@healthcare.com', role: 'Healthcare Specialist', domain: 'Healthcare', status: 'active', permissions: ['read', 'write'], lastAccess: '30 minutes ago', lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(), ipAddress: '192.168.1.49', loginCount: 423, failedAttempts: 0, createdAt: '2024-02-08T00:00:00Z', location: 'Miami, USA', phone: '+1-555-0105' },
        { _id: '6', name: 'Ahmed Hassan', email: 'ahmed.h@agriinnovate.com', role: 'Agriculture Researcher', domain: 'Agriculture', status: 'active', permissions: ['read'], lastAccess: '8 hours ago', lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), ipAddress: '192.168.1.50', loginCount: 198, failedAttempts: 1, createdAt: '2024-04-22T00:00:00Z', location: 'Dubai, UAE', phone: '+971-555-0106' }
      ];

      const dummyLogs = [
        { _id: '1', type: 'success', action: 'Admin login successful', user: 'Dr. Sarah Chen', time: new Date().toLocaleTimeString(), timestamp: new Date(), ip: '192.168.1.45', details: 'Web login via Chrome', domain: 'Healthcare' },
        { _id: '2', type: 'warning', action: 'Failed login attempt', user: 'Unknown', time: new Date(Date.now() - 75 * 60 * 1000).toLocaleTimeString(), timestamp: new Date(Date.now() - 75 * 60 * 1000), ip: '203.45.67.89', details: 'Invalid credentials', domain: 'N/A' },
        { _id: '3', type: 'info', action: 'Permission updated', user: 'Admin', time: new Date(Date.now() - 105 * 60 * 1000).toLocaleTimeString(), timestamp: new Date(Date.now() - 105 * 60 * 1000), ip: '192.168.1.1', details: 'John Miller - Added approve permission', domain: 'Agriculture' },
        { _id: '4', type: 'danger', action: 'User suspended', user: 'Admin', time: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString(), timestamp: new Date(Date.now() - 120 * 60 * 1000), ip: '192.168.1.1', details: 'David Park - Multiple failed attempts', domain: 'All' },
        { _id: '5', type: 'success', action: 'New user registered', user: 'System', time: new Date(Date.now() - 180 * 60 * 1000).toLocaleTimeString(), timestamp: new Date(Date.now() - 180 * 60 * 1000), ip: '192.168.1.1', details: 'Maria Garcia registered', domain: 'Healthcare' }
      ];

      setUsers(dummyUsers);
      setSecurityLogs(dummyLogs);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setStats({
        activeUsers: dummyUsers.filter(u => u.status === 'active').length,
        suspendedUsers: dummyUsers.filter(u => u.status === 'suspended').length,
        securityEvents: dummyLogs.length,
        securityScore: 95,
        todayLogins: dummyLogs.filter(l => l.type === 'success' && new Date(l.timestamp) >= today).length,
        failedAttempts: dummyLogs.filter(l => l.type === 'warning').length
      });

      setLastUpdate(new Date());
      showNotification('Security data updated successfully!');

    } catch (error) {
      console.error('Error:', error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      
      // API call here
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      
      const newLog = {
        _id: `log-${Date.now()}`,
        type: newStatus === 'active' ? 'success' : 'danger',
        action: `User ${newStatus === 'active' ? 'activated' : 'suspended'}`,
        user: 'Admin',
        time: new Date().toLocaleTimeString(),
        timestamp: new Date(),
        ip: '192.168.1.1',
        details: `${user.name} status changed to ${newStatus}`,
        domain: user.domain
      };
      setSecurityLogs([newLog, ...securityLogs]);
      
      showNotification(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error updating status', 'error');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // API call here
      setUsers(users.filter(u => u._id !== userId));
      showNotification('User deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error deleting user', 'error');
    }
  };

  const handleExportLogs = () => {
    try {
      const csvData = [
        ['Security Logs Export'],
        ['Generated:', new Date().toLocaleString()],
        [],
        ['Timestamp', 'Type', 'Action', 'User', 'Domain', 'IP', 'Details'],
        ...securityLogs.map(log => [
          new Date(log.timestamp).toLocaleString(),
          log.type,
          log.action,
          log.user,
          log.domain,
          log.ip,
          log.details || ''
        ])
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('Logs exported successfully!');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error exporting logs', 'error');
    }
  };

  const getDomainColor = (domain) => {
    const colors = {
      Healthcare: '#ef4444',
      Agriculture: '#10b981',
      Environment: '#14b8a6',
      All: '#8b5cf6'
    };
    return colors[domain] || '#6b7280';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.domain === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 60000);
    return () => clearInterval(interval);
  }, []);

  const theme = {
    bg: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
    cardBg: isDarkMode ? 'rgba(51,65,85,0.7)' : 'rgba(255,255,255,0.95)',
    cardBorder: isDarkMode ? 'rgba(71,85,105,0.8)' : 'rgba(226,232,240,0.8)',
    text: isDarkMode ? '#fff' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    inputBg: isDarkMode ? 'rgba(30,41,59,0.6)' : 'rgba(248,250,252,0.9)',
    inputBorder: isDarkMode ? '#475569' : '#cbd5e1',
    shadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: theme.bg, backgroundSize: '400% 400%', animation: 'gradientShift 15s ease infinite', fontFamily: 'Inter, sans-serif', color: theme.text, transition: 'all 0.3s ease' }}>
      <style>{`
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .user-item:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.3); }
        .log-item:hover { transform: translateX(4px); }
        .stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.3); }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); }
      `}</style>

      {/* Notification */}
      {notification.show && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', padding: '1rem 1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideIn 0.3s ease-out', borderLeft: `4px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}` }}>
          {notification.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : <AlertTriangle size={20} color="#ef4444" />}
          <span style={{ fontWeight: 700, color: '#1e293b' }}>{notification.message}</span>
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '2rem', animation: 'fadeInUp 0.3s ease-out' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'scaleIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{selectedUser.name}</h2>
                <p style={{ color: '#64748b', fontWeight: 600, margin: 0 }}>{selectedUser.role}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                <XCircle size={24} color="#64748b" />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{selectedUser.email}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Domain</p>
                  <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: `${getDomainColor(selectedUser.domain)}20`, color: getDomainColor(selectedUser.domain), borderRadius: '10px', fontSize: '0.875rem', fontWeight: 800, border: `2px solid ${getDomainColor(selectedUser.domain)}` }}>{selectedUser.domain}</span>
                </div>
                
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</p>
                  <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: selectedUser.status === 'active' ? '#d1fae5' : '#fee2e2', color: selectedUser.status === 'active' ? '#059669' : '#dc2626', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 800, border: `2px solid ${selectedUser.status === 'active' ? '#10b981' : '#ef4444'}`, textTransform: 'uppercase' }}>{selectedUser.status}</span>
                </div>
              </div>
              
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Phone</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{selectedUser.phone}</p>
              </div>
              
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Location</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} color="#64748b" />{selectedUser.location}</p>
              </div>
              
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Permissions</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedUser.permissions.map((perm, i) => (
                    <span key={i} style={{ padding: '0.5rem 0.875rem', background: '#dbeafe', color: '#0369a1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, border: '2px solid #93c5fd' }}>{perm}</span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Login Count</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedUser.loginCount}</p>
                </div>
                
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Failed Attempts</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: selectedUser.failedAttempts > 0 ? '#ef4444' : '#10b981', margin: 0 }}>{selectedUser.failedAttempts}</p>
                </div>
              </div>
              
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Last Access</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{selectedUser.lastAccess}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '20px', display: 'flex', boxShadow: '0 8px 20px rgba(59,130,246,0.4)', animation: 'pulse 3s ease-in-out infinite' }}>
                <Shield size={36} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '2.75rem', fontWeight: '900', margin: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Access Control & Security</h1>
                <p style={{ color: theme.textSecondary, fontSize: '1.125rem', marginTop: '0.5rem', fontWeight: 600 }}>Multi-domain user permissions and security monitoring</p>
                <p style={{ fontSize: '0.875rem', color: theme.textSecondary, marginTop: '0.25rem', fontWeight: 600 }}>Last updated: {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="action-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button onClick={handleExportLogs} className="action-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                <Download size={20} /> Export
              </button>
              <button onClick={fetchSecurityData} disabled={loading} className="action-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'all 0.3s', fontSize: '0.95rem' }}>
                <RefreshCw size={20} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {loading ? 'Updating...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem', animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
          {[
            { label: 'Active Users', value: stats.activeUsers, icon: User, color: '#10b981' },
            { label: 'Suspended', value: stats.suspendedUsers, icon: XCircle, color: '#ef4444' },
            { label: 'Security Events', value: stats.securityEvents, icon: AlertTriangle, color: '#facc15' },
            { label: 'Security Score', value: `${stats.securityScore}%`, icon: Shield, color: '#3b82f6' }
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(16px)', border: `2px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.4s', boxShadow: theme.shadow, animation: `scaleIn 0.6s ease-out ${i * 0.1}s backwards` }}>
              <div>
                <p style={{ color: theme.textSecondary, fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.75px', marginBottom: '0.5rem' }}>{stat.label}</p>
                <p style={{ fontSize: '2.75rem', fontWeight: '900', color: theme.text, margin: 0 }}>{stat.value}</p>
              </div>
              <stat.icon size={44} color={stat.color} />
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(16px)', border: `2px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '2rem', marginBottom: '1.75rem', animation: 'fadeInUp 0.6s ease-out 0.4s backwards', boxShadow: theme.shadow }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary, pointerEvents: 'none' }} />
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '1rem 1.25rem 1rem 3.5rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '14px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ flex: 1, minWidth: '220px', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontWeight: 700, cursor: 'pointer' }}>
                <option value="all">All Domains</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Environment">Environment</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, minWidth: '220px', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontWeight: 700, cursor: 'pointer' }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users & Logs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.75rem' }}>
          {/* Users */}
          <div style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(16px)', border: `2px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '2rem', animation: 'fadeInUp 0.6s ease-out 0.5s backwards', boxShadow: theme.shadow }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: '800', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: theme.text }}><User size={26} /> User Management</h2>
            <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
              {filteredUsers.map((user) => (
                <div key={user._id} className="user-item" style={{ backgroundColor: theme.inputBg, borderRadius: '18px', padding: '1.75rem', marginBottom: '1.25rem', transition: 'all 0.3s', border: `2px solid ${theme.cardBorder}`, animation: 'scaleIn 0.4s ease-out' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {user.status === 'active' ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
                      <div>
                        <h3 style={{ fontWeight: '800', fontSize: '1.125rem', color: theme.text, margin: 0 }}>{user.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: theme.textSecondary, fontWeight: 700, margin: '0.25rem 0' }}>{user.role}</p>
                        <p style={{ fontSize: '0.75rem', color: theme.textSecondary, fontWeight: 600 }}>{user.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '0.5rem 0.875rem', background: `${getDomainColor(user.domain)}20`, color: getDomainColor(user.domain), borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, border: `2px solid ${getDomainColor(user.domain)}`, textTransform: 'uppercase' }}>{user.domain}</span>
                      <button onClick={() => handleViewUser(user)} style={{ padding: '0.625rem', fontSize: '0.875rem', fontWeight: '800', borderRadius: '10px', cursor: 'pointer', color: '#3b82f6', border: '2px solid #3b82f6', background: 'transparent', transition: 'all 0.3s' }}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => toggleUserStatus(user._id)} style={{ padding: '0.625rem 1.125rem', fontSize: '0.875rem', fontWeight: '800', borderRadius: '12px', cursor: 'pointer', color: '#fff', border: 'none', background: user.status === 'active' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', textTransform: 'uppercase' }}>
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} style={{ padding: '0.625rem', fontSize: '0.875rem', fontWeight: '800', borderRadius: '10px', cursor: 'pointer', color: '#ef4444', border: '2px solid #ef4444', background: 'transparent', transition: 'all 0.3s' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', paddingTop: '1rem', borderTop: `2px solid ${theme.cardBorder}`, fontSize: '0.8rem', color: theme.textSecondary, fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={15} /> {user.lastAccess}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={15} /> {user.permissions.length} perms</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LogIn size={15} /> {user.loginCount}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={15} /> {user.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(16px)', border: `2px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '2rem', animation: 'fadeInUp 0.6s ease-out 0.6s backwards', boxShadow: theme.shadow }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: '800', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: theme.text }}><Lock size={26} /> Security Logs</h2>
            <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
              {securityLogs.map((log) => (
                <div key={log._id} className="log-item" style={{ display: 'flex', gap: '1rem', backgroundColor: theme.inputBg, borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', transition: 'all 0.3s', border: `2px solid ${theme.cardBorder}`, animation: 'fadeInUp 0.3s ease-out' }}>
                  {log.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : log.type === 'warning' ? <AlertTriangle size={20} color="#facc15" /> : log.type === 'danger' ? <XCircle size={20} color="#ef4444" /> : <Shield size={20} color="#3b82f6" />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.95rem', color: theme.text }}>
                      <span>{log.action}</span>
                      <span style={{ fontSize: '0.75rem', color: theme.textSecondary, fontWeight: 700 }}>{log.time}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: theme.textSecondary, margin: '0.25rem 0', fontWeight: 600 }}><User size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />{log.user}</p>
                    <p style={{ fontSize: '0.875rem', color: theme.textSecondary, margin: '0.25rem 0', fontWeight: 600 }}><Activity size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />{log.ip}</p>
                    {log.domain && <span style={{ display: 'inline-block', padding: '0.25rem 0.625rem', background: `${getDomainColor(log.domain)}20`, color: getDomainColor(log.domain), borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, border: `1px solid ${getDomainColor(log.domain)}`, marginTop: '0.5rem' }}>{log.domain}</span>}
                    {log.details && <p style={{ fontSize: '0.875rem', color: theme.textSecondary, marginTop: '0.5rem', fontStyle: 'italic' }}>{log.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
