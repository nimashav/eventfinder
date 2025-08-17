import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import ApprovedEventModal from '../../components/ApprovedEventModal/ApprovedEventModal.jsx';
import './AdminBase.css';
import './ApprovedEvents.css';

const ApprovedEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, featured: 0, recommended: 0, categories: [] });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch approved events from backend
  const fetchApprovedEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedPriority) params.append('priority', selectedPriority);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`http://localhost:5001/api/events/approved?${params}`);
      const result = await response.json();

      if (result.success) {
        setApprovedEvents(result.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch approved events' });
      }
    } catch (error) {
      console.error('Error fetching approved events:', error);
      setMessage({ type: 'error', text: 'Network error while fetching approved events' });
    }
  };

  // Fetch approved events statistics
  const fetchApprovedStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events/admin/approved-stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching approved stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApprovedEvents(), fetchApprovedStats()]);
      setLoading(false);
    };

    loadData();
  }, [selectedCategory, selectedPriority, searchQuery]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdatePriority = async (eventId, priority) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Event priority updated to ${priority} successfully!` });
        setIsModalOpen(false);
        // Refresh data
        await Promise.all([fetchApprovedEvents(), fetchApprovedStats()]);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update event priority' });
      }
    } catch (error) {
      console.error('Error updating event priority:', error);
      setMessage({ type: 'error', text: 'Network error while updating event priority' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Event deleted successfully!' });
        setIsModalOpen(false);
        // Refresh data
        await Promise.all([fetchApprovedEvents(), fetchApprovedStats()]);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete event' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage({ type: 'error', text: 'Network error while deleting event' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter events (client-side filtering for better UX)
  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.organizer?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    const matchesPriority = selectedPriority === '' || event.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Pagination
  const eventsPerPage = 10;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriority, searchQuery]);

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
                <h2>Approved Events Overview</h2>
                <p>Manage and monitor all approved events with comprehensive analytics and insights.</p>
              </div>

              {/* Event Metrics */}
              <div className="metrics-section">
                <h3>Event Metrics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon total">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Total Approved Events</h4>
                      <span className="stat-number">{stats.total}</span>
                      <p>All approved events</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon upcoming">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 715.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Upcoming Events</h4>
                      <span className="stat-number">{stats.upcoming}</span>
                      <p>Events scheduled for future dates</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon featured">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Featured Events</h4>
                      <span className="stat-number">{stats.featured}</span>
                      <p>High priority events</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon recommended">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.109 3.194 2.676 3.707a2.25 2.25 0 01-.659 4.416L5.25 21a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 3.75 3.75 0 015.25-3.456c0-1.455.728-2.765 1.935-3.545A3.751 3.751 0 0112 5.25a3.751 3.751 0 014.265 1.199 3.751 3.751 0 011.935 3.545 3.75 3.75 0 015.25 3.456.75.75 0 01-.75.75h-4.132A15.838 15.838 0 0117.618 21H16.5a.75.75 0 01-.75-.75v-4.131a2.25 2.25 0 01-.659-4.416 3.751 3.751 0 012.676-3.707c0-1.691-1.109-3.194-2.676-3.707z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Recommended Events</h4>
                      <span className="stat-number">{stats.recommended}</span>
                      <p>Standard priority events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approved Events List */}
              <div className="events-section">
                <div className="section-header">
                  <h3>Approved Events List</h3>
                  <div className="section-actions">
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
                        <option value="featured">Featured</option>
                        <option value="recommended">Recommended</option>
                      </select>
                    </div>
                    <div className="view-controls">
                      <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      </button>
                      <Link to="/add-event" className="add-event-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Event
                      </Link>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading approved events...</p>
                  </div>
                ) : (
                  <div className="events-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date & Time</th>
                          <th>Location</th>
                          <th>Category</th>
                          <th>Organizer</th>
                          <th>Priority</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEvents.length > 0 ? (
                          paginatedEvents.map(event => (
                            <tr key={event._id}>
                              <td>
                                <div className="event-info">
                                  <div className="event-avatar">
                                    {event.image ? (
                                      <img src={`/images/${event.image}`} alt="Event" />
                                    ) : (
                                      <div className="event-placeholder">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 715.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="event-details">
                                    <span className="event-title">{event.eventName}</span>
                                    <span className="event-organizer">by {event.organizer?.name || 'Anonymous'}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="event-date">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 712.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 715.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                  </svg>
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                <div className="event-time">{event.time}</div>
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
                                <span className="organizer-name">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                  </svg>
                                  {event.organizer?.name || 'Anonymous'}
                                </span>
                              </td>
                              <td>
                                <span className={`priority-badge priority-${event.priority}`}>
                                  {event.priority ? event.priority.charAt(0).toUpperCase() + event.priority.slice(1) : 'Recommended'}
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
                            <td colSpan="7" className="no-events">
                              <div className="no-events-message">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4>No approved events found</h4>
                                <p>No events match your current filters or no events have been approved yet.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages} ({filteredEvents.length} events total)
                    </span>
                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                <div className="admin-actions">
                  <Link to="/admin/dashboard" className="admin-action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pending Events
                  </Link>
                  <Link to="/add-event" className="admin-action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Event
                  </Link>
                  <Link to="/admin/users" className="admin-action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    User Management
                  </Link>
                </div>
              </div>

              {/* Event Categories */}
              <div className="admin-sidebar-section sidebar-section">
                <h3>Event Categories</h3>
                <div className="category-stats">
                  {stats.categories && stats.categories.length > 0 ? (
                    stats.categories.map((category, index) => (
                      <div key={index} className="category-stat">
                        <span className="category-name">
                          {category._id ? category._id.charAt(0).toUpperCase() + category._id.slice(1).replace('-', ' ') : 'Uncategorized'}
                        </span>
                        <span className="category-count">{category.count}</span>
                      </div>
                    ))
                  ) : (
                    <p>No categories available</p>
                  )}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="admin-sidebar-section sidebar-section">
                <h3>Priority Distribution</h3>
                <div className="priority-stats">
                  <div className="priority-stat">
                    <span className="priority-name featured">Featured</span>
                    <span className="priority-count">{stats.featured}</span>
                  </div>
                  <div className="priority-stat">
                    <span className="priority-name recommended">Recommended</span>
                    <span className="priority-count">{stats.recommended}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <ApprovedEventModal
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdatePriority={handleUpdatePriority}
          onDelete={handleDeleteEvent}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ApprovedEvents;
