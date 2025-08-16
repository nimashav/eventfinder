import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import EventReviewModal from '../../components/EventReviewModal/EventReviewModal.jsx';
import './AdminBase.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingEvents, setPendingEvents] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch pending events from backend
  const fetchPendingEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events?status=pending');
      const result = await response.json();

      if (result.success) {
        setPendingEvents(result.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch pending events' });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Network error while fetching events' });
    }
  };

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events/admin/stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingEvents(), fetchStats()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleApprove = async (eventId, priority) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          priority: priority,
          reviewedBy: 'Admin', // In real app, this would be the logged-in admin
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Event approved successfully with ${priority} priority!` });
        setIsModalOpen(false);
        // Refresh data
        await Promise.all([fetchPendingEvents(), fetchStats()]);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to approve event' });
      }
    } catch (error) {
      console.error('Error approving event:', error);
      setMessage({ type: 'error', text: 'Network error while approving event' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (eventId, rejectionReason) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          reviewedBy: 'Admin', // In real app, this would be the logged-in admin
          rejectionReason: rejectionReason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Event rejected successfully!' });
        setIsModalOpen(false);
        // Refresh data
        await Promise.all([fetchPendingEvents(), fetchStats()]);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to reject event' });
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
      setMessage({ type: 'error', text: 'Network error while rejecting event' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = pendingEvents.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    const matchesPriority = selectedPriority === '' || event.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Calculate priority stats
  const featuredCount = pendingEvents.filter(event => event.priority === 'featured').length;

  return (
    <div className="admin-page admin-dashboard">
      {/* Header */}
      <AdminHeader title="EventWave Admin Dashboard" />

      <div className="admin-dashboard-container">
        <div className="container">
          {/* Message Display */}
          {message.text && (
            <div className={`admin-message ${message.type}`}>
              <p>{message.text}</p>
              <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
            </div>
          )}

          <div className="admin-dashboard-layout">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="admin-main-content main-content">
              <div className="admin-content-header content-header">
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
                    <span className="stat-number">{stats.pending}</span>
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
                    <h3>Featured Events</h3>
                    <span className="stat-number">{featuredCount}</span>
                    <p>Events marked as featured priority</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon review">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Total Approved</h3>
                    <span className="stat-number">{stats.approved}</span>
                    <p>Events approved and published</p>
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
                      <option value="">All Categories</option>
                      <option value="music">Music</option>
                      <option value="art-culture">Art & Culture</option>
                      <option value="tech-innovation">Tech & Innovation</option>
                      <option value="sports">Sports</option>
                      <option value="food-drink">Food & Drink</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="health">Health & Wellness</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Priorities</option>
                      <option value="recommended">Recommended</option>
                      <option value="featured">Featured</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading pending events...</p>
                  </div>
                ) : (
                  <div className="events-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.length > 0 ? (
                          filteredEvents.map(event => (
                            <tr key={event._id}>
                              <td>
                                <div className="event-info">
                                  <div className="event-avatar">
                                    {event.image ? (
                                      <img src={`/images/${event.image}`} alt="Event" />
                                    ) : (
                                      <div className="event-placeholder">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="event-details">
                                    <span className="event-title">{event.eventName}</span>
                                    <span className="event-organizer">{event.organizer?.name || 'Anonymous'}</span>
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
                                  {event.address}
                                </span>
                              </td>
                              <td>
                                <span className={`category-badge ${event.category}`}>
                                  {event.category.charAt(0).toUpperCase() + event.category.slice(1).replace('-', ' ')}
                                </span>
                              </td>
                              <td>
                                <span className={`priority-badge ${event.priority || 'none'}`}>
                                  {event.priority ? event.priority.charAt(0).toUpperCase() + event.priority.slice(1) : 'Not Set'}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="btn-view"
                                    onClick={() => handleViewDetails(event)}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="no-events">
                              <div className="no-events-message">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <h4>No pending events found</h4>
                                <p>All events have been reviewed or no events match your filters.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>

            {/* Right Sidebar with Recent Activity */}
            <aside className="admin-right-sidebar right-sidebar">
              <div className="admin-sidebar-section sidebar-section">
                <h3>Quick Stats</h3>
                <div className="quick-stats">
                  <div className="quick-stat-item">
                    <span className="stat-label">Total Events</span>
                    <span className="stat-value">{stats.total}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="stat-label">Approved</span>
                    <span className="stat-value approved">{stats.approved}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="stat-label">Rejected</span>
                    <span className="stat-value rejected">{stats.rejected}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value pending">{stats.pending}</span>
                  </div>
                </div>
              </div>

              <div className="admin-sidebar-section sidebar-section">
                <h3>Admin Actions</h3>
                <div className="admin-actions">
                  <Link to="/admin/approved-events" className="admin-action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Approved Events
                  </Link>
                  <Link to="/admin/user-management" className="admin-action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    User Management
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Event Review Modal */}
      {isModalOpen && selectedEvent && (
        <EventReviewModal
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
