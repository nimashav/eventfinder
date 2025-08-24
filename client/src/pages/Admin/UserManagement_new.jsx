import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import UserModal from '../../components/UserModal/UserModal.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import './AdminBase.css'
import './UserManagement.css';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    newRegistrations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const usersPerPage = 10;

  // Fetch users from API
  const fetchUsers = async (page = 1, search = '', role = '', status = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status })
      });

      const response = await fetch(`/api/auth/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setFilteredUsers(data.data.users);
        setTotalPages(data.data.pagination.pages);
        setCurrentPage(data.data.pagination.current);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/user-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setRecentActivity(data.data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchUsers(1, searchQuery, selectedRole, selectedStatus);
    fetchUserStats();
  }, [searchQuery, selectedRole, selectedStatus]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchUsers(page, searchQuery, selectedRole, selectedStatus);
  };

  // Handle create user
  const handleCreateUser = async (userData) => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
        await fetchUserStats();
        setIsUserModalOpen(false);
        // You might want to show a success message here
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle update user role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
        await fetchUserStats();
      } else {
        throw new Error(data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error.message);
    }
  };

  // Handle toggle user status
  const handleToggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
        await fetchUserStats();
      } else {
        throw new Error(data.message || 'Failed to toggle user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError(error.message);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
        await fetchUserStats();
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle export users
  const handleExportUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/users/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Convert to CSV and download
        const csvContent = convertToCSV(data.data.users);
        downloadCSV(csvContent, `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        throw new Error(data.message || 'Failed to export users');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      setError(error.message);
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  // Helper function to download CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page admin-dashboard">
      <AdminHeader title="EventWave Admin Dashboard" />

      <div className="admin-dashboard-container">
        <div className="container">
          <div className="admin-dashboard-layout">
            <AdminSidebar />

            {/* Main Content */}
            <main className="admin-main-content main-content">
              <div className="admin-content-header content-header">
                <h2>User Management</h2>
                <p>Manage user accounts, roles, and permissions across the platform.</p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                  <button onClick={() => setError('')} className="error-close">×</button>
                </div>
              )}

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon total">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <span className="stat-number">{stats.totalUsers}</span>
                    <p>Overall registered users</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon active">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Active Users</h3>
                    <span className="stat-number">{stats.activeUsers}</span>
                    <p>Users with active accounts</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon new">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-9-3h3.5m-3.5 0a1.5 1.5 0 00-1.5 1.5v3A1.5 1.5 0 005.5 13h3A1.5 1.5 0 0010 11.5V8.5A1.5 1.5 0 008.5 7H5.5zm7.5 6.5h3.5a1.5 1.5 0 001.5-1.5v-3a1.5 1.5 0 00-1.5-1.5H13a1.5 1.5 0 00-1.5 1.5v3a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>New Registrations</h3>
                    <span className="stat-number">{stats.newRegistrations}</span>
                    <p>Today's sign-ups</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon admin">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Admin Roles</h3>
                    <span className="stat-number">{stats.adminUsers}</span>
                    <p>Users with administrative access</p>
                  </div>
                </div>
              </div>

              {/* User Directory Section */}
              <div className="users-section">
                <div className="section-header">
                  <h3>User Directory</h3>
                  <div className="section-actions">
                    <div className="filters">
                      <div className="search-box">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                      <select
                        className="filter-select"
                        value={selectedRole}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                      <select
                        className="filter-select"
                        value={selectedStatus}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <button className="export-btn" onClick={handleExportUsers}>
                      Export
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="users-table">
                  {isLoading ? (
                    <div className="loading">Loading users...</div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar">
                                  <div className="avatar-placeholder">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                  </div>
                                </div>
                                <div className="user-details">
                                  <div className="user-name">{user.fullName}</div>
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <select
                                className={`role-select ${user.role}`}
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                disabled={user.id === currentUser?.id}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                                onClick={() => handleToggleUserStatus(user.id)}
                                disabled={user.id === currentUser?.id}
                              >
                                {user.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td>{formatDate(user.lastLogin)}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn delete"
                                  title="Delete"
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setIsConfirmModalOpen(true);
                                  }}
                                  disabled={user.id === currentUser?.id}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="admin-right-sidebar right-sidebar">
              <div className="admin-sidebar-section sidebar-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    className="action-card"
                    onClick={() => {
                      setModalMode('create');
                      setSelectedUser(null);
                      setIsUserModalOpen(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Add New User</span>
                  </button>
                  <button className="action-card" onClick={handleExportUsers}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              <div className="admin-sidebar-section sidebar-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-avatar">
                          <div className="avatar-placeholder">
                            {activity.firstName?.charAt(0)}{activity.lastName?.charAt(0)}
                          </div>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.firstName} {activity.lastName} logged in</div>
                          <div className="activity-time">{formatDate(activity.lastLogin)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-activity">No recent activity</div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleCreateUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default UserManagement;
