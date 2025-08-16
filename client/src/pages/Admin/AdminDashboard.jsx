import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for pending events
  const pendingEvents = [
    {
      id: 1,
      title: 'Annual Tech Conference',
      date: '2024-08-15',
      location: 'Virtual',
      category: 'Conference',
      organizer: 'John Doe',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Data Science Workshop',
      date: '2024-08-01',
      location: 'New York',
      category: 'Workshop',
      organizer: 'Jane Smith',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Future of AI Webinar',
      date: '2024-09-10',
      location: 'Online',
      category: 'Webinar',
      organizer: 'Mike Johnson',
      status: 'pending',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Leadership Summit',
      date: '2024-09-22',
      location: 'London',
      category: 'Seminar',
      organizer: 'Sarah Wilson',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 5,
      title: 'Community Hackathon',
      date: '2024-10-05',
      location: 'San Francisco',
      category: 'Community',
      organizer: 'David Brown',
      status: 'pending',
      priority: 'medium'
    }
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      title: 'Employee Onboarding Session',
      status: 'Approved',
      time: '2 hours ago',
      type: 'approval'
    },
    {
      id: 2,
      title: 'Q3 Financial Review Meeting',
      status: 'Rejected',
      time: 'Yesterday',
      type: 'rejection'
    },
    {
      id: 3,
      title: 'Client Pitch Presentation',
      status: 'Approved',
      time: '2 days ago',
      type: 'approval'
    },
    {
      id: 4,
      title: 'Team Building Workshop',
      status: 'Approved',
      time: '3 days ago',
      type: 'approval'
    },
    {
      id: 5,
      title: 'Annual Security Audit',
      status: 'Rejected',
      time: '3 days ago',
      type: 'rejection'
    }
  ];

  const handleApprove = (eventId) => {
    console.log('Approving event:', eventId);
    // Handle approval logic here
  };

  const handleReject = (eventId) => {
    console.log('Rejecting event:', eventId);
    // Handle rejection logic here
  };

  const filteredEvents = pendingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    const matchesPriority = selectedPriority === '' || event.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <AdminHeader title="Event Admin Dashboard" />

      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-layout">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="main-content">
              <div className="content-header">
                <h2>Pending Events Overview</h2>
                <p>Review and manage all event requests awaiting your approval.</p>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon total">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Total Pending Events</h3>
                    <span className="stat-number">10</span>
                    <p>Events awaiting review and action</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon priority">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>High Priority Events</h3>
                    <span className="stat-number">3</span>
                    <p>Urgent events requiring immediate attention</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon review">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Requires Further Review</h3>
                    <span className="stat-number">4</span>
                    <p>Events that need detailed examination</p>
                  </div>
                </div>
              </div>

              {/* Events Table Section */}
              <div className="events-section">
                <div className="section-header">
                  <h3>Pending Event Requests</h3>
                  <div className="filters">
                    <div className="search-box">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Category</option>
                      <option value="Conference">Conference</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Community">Community</option>
                    </select>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="events-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map(event => (
                        <tr key={event.id}>
                          <td>
                            <div className="event-info">
                              <div className="event-avatar">
                                <img src={`https://via.placeholder.com/40x40`} alt="Event" />
                              </div>
                              <div className="event-details">
                                <span className="event-title">{event.title}</span>
                                <span className="event-organizer">{event.organizer}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="event-date">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <span className="event-location">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {event.location}
                            </span>
                          </td>
                          <td>
                            <span className={`category-badge ${event.category.toLowerCase()}`}>
                              {event.category}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-approve"
                                onClick={() => handleApprove(event.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(event.id)}
                              >
                                Reject
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
                  <button className="pagination-btn">Previous</button>
                  <span className="pagination-info">Page 1 of 2</span>
                  <button className="pagination-btn">Next</button>
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="right-sidebar">
              <div className="sidebar-section">
                <h3>Recent Event Activity</h3>
                <div className="activity-list">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-avatar">
                        <img src="https://via.placeholder.com/32x32" alt="User" />
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">{activity.title}</div>
                        <div className={`activity-status ${activity.type}`}>
                          {activity.status}
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Event Categories Overview</h3>
                <p>Distribution of pending events by category</p>
                <div className="category-chart">
                  <div className="donut-chart">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#921A40" strokeWidth="10" strokeDasharray="94 314" strokeDashoffset="25" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#C75B7A" strokeWidth="10" strokeDasharray="63 314" strokeDashoffset="-69" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#D9ABAB" strokeWidth="10" strokeDasharray="47 314" strokeDashoffset="-132" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#2D2D2D" strokeWidth="10" strokeDasharray="110 314" strokeDashoffset="-179" />
                    </svg>
                    <div className="chart-center">
                      <span className="chart-total">24%</span>
                      <span className="chart-label">Conference</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: '#921A40' }}></span>
                      <span>Conference</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: '#C75B7A' }}></span>
                      <span>Workshop</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: '#D9ABAB' }}></span>
                      <span>Webinar</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: '#2D2D2D' }}></span>
                      <span>Community</span>
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

export default AdminDashboard;
