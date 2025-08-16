import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import './UserManagement.css';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-07-28 10:30 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2024-07-28 08:15 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 3,
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      role: 'Member',
      status: 'Inactive',
      lastLogin: '2024-07-27 04:00 PM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      role: 'Member',
      status: 'Active',
      lastLogin: '2024-07-28 11:00 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 5,
      name: 'Michael White',
      email: 'michael.white@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-07-28 08:45 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 6,
      name: 'Sarah Green',
      email: 'sarah.green@example.com',
      role: 'Editor',
      status: 'Pending',
      lastLogin: '2024-07-26 02:30 PM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 7,
      name: 'David Black',
      email: 'david.black@example.com',
      role: 'Member',
      status: 'Active',
      lastLogin: '2024-07-28 07:00 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 8,
      name: 'Laura King',
      email: 'laura.king@example.com',
      role: 'Member',
      status: 'Inactive',
      lastLogin: '2024-07-25 01:00 PM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 9,
      name: 'Chris Evans',
      email: 'chris.evans@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-07-28 11:30 AM',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: 10,
      name: 'Emily Clark',
      email: 'emily.clark@example.com',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2024-07-28 09:00 AM',
      avatar: 'https://via.placeholder.com/40x40'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const newRegistrations = users.filter(user => user.status === 'Pending').length;
  const adminRoles = users.filter(user => user.role === 'Admin').length;

  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleRoleChange = (userId, newRole) => {
    console.log(`Changing role for user ${userId} to ${newRole}`);
    // Handle role change logic here
  };

  const handleStatusChange = (userId, newStatus) => {
    console.log(`Changing status for user ${userId} to ${newStatus}`);
    // Handle status change logic here
  };

  const handleDeleteUser = (userId) => {
    console.log(`Deleting user ${userId}`);
    // Handle delete user logic here
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader title="Event Admin Dashboard" />

      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-layout">
            <AdminSidebar />

            {/* Main Content */}
            <main className="main-content">
              <div className="content-header">
                <h2>User Management</h2>
                <p>Manage user accounts, roles, and permissions across the platform.</p>
              </div>

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
                    <span className="stat-number">{totalUsers}</span>
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
                    <span className="stat-number">{activeUsers}</span>
                    <p>Users with recent activity</p>
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
                    <span className="stat-number">{newRegistrations}</span>
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
                    <span className="stat-number">{adminRoles}</span>
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
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <select
                        className="filter-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Member">Member</option>
                      </select>
                    </div>
                    <button className="export-btn">Export</button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="users-table">
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
                      {paginatedUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                <img src={user.avatar} alt={user.name} />
                              </div>
                              <div className="user-details">
                                <div className="user-name">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.lastLogin}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn edit" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button className="action-btn delete" title="Delete">
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
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="right-sidebar">
              <div className="sidebar-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Add New User</span>
                  </button>
                  <button className="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Import Users</span>
                  </button>
                  <button className="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>User Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://via.placeholder.com/32x32" alt="User" />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">John Doe logged in</div>
                      <div className="activity-time">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://via.placeholder.com/32x32" alt="User" />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Jane Smith updated profile</div>
                      <div className="activity-time">1 hour ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://via.placeholder.com/32x32" alt="User" />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">New user registered</div>
                      <div className="activity-time">3 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
