import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './MyEvents.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const MyEvents = () => {
  const { token, user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if user is authenticated
      if (!token || !isAuthenticated) {
        setError('You must be logged in to view your events.');
        setLoading(false);
        return;
      }

      // Fetch user's events using the correct endpoint and authentication
      const response = await fetch(`http://localhost:5002/api/events/user/my-events`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch events`);
      }

      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
        console.log('📥 My Events loaded:', data.data.length, 'events');
      } else {
        throw new Error(data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge pending',
      approved: 'status-badge approved',
      rejected: 'status-badge rejected'
    };

    const statusText = {
      pending: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected'
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {statusText[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;

    return (
      <span className={`priority-badge ${priority}`}>
        {priority === 'featured' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPricing = (pricing) => {
    if (!pricing || pricing.isFree) {
      return 'Free';
    }

    const tickets = pricing.tickets || [];
    if (tickets.length === 0) {
      return 'Free';
    }

    if (tickets.length === 1) {
      return `$${tickets[0].price}`;
    }

    // Multiple ticket types - show range
    const prices = tickets.map(ticket => ticket.price).filter(price => price > 0);
    if (prices.length === 0) {
      return 'Free';
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`http://localhost:5002/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: Failed to delete event`);
      }

      if (result.success) {
        setEvents(events.filter(event => event._id !== eventId));
        setShowModal(false);
        alert('Event deleted successfully!');
        console.log('✅ Event deleted:', eventId);
      } else {
        throw new Error(result.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(`Failed to delete event: ${error.message}`);
    }
  };

  const getStatsCounts = () => {
    return {
      total: events.length,
      pending: events.filter(e => e.status === 'pending').length,
      approved: events.filter(e => e.status === 'approved').length,
      rejected: events.filter(e => e.status === 'rejected').length
    };
  };

  const stats = getStatsCounts();

  if (loading) {
    return (
      <div className="my-events-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your events...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <Header />

      <div className="my-events-container">
        <div className="my-events-header">
          <div className="header-content">
            <h1>My Events</h1>
            <p>Manage and track your submitted events</p>
          </div>

          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-number pending">{stats.pending}</span>
              <span className="stat-label">Under Review</span>
            </div>
            <div className="stat-item">
              <span className="stat-number approved">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number rejected">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events ({stats.total})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Under Review ({stats.pending})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({stats.approved})
            </button>
            <button
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>No Events Found</h3>
              <p>
                {filter === 'all'
                  ? "You haven't submitted any events yet."
                  : `No ${filter} events found.`
                }
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event._id} className="event-card">
                  <div className="event-image">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} />
                    ) : (
                      <div className="event-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="event-status-overlay">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>

                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">{event.eventName}</h3>
                      {getPriorityBadge(event.priority)}
                    </div>

                    <div className="event-details">
                      <div className="event-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="event-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(event.time)}</span>
                      </div>

                      <div className="event-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.address}</span>
                      </div>
                    </div>

                    <div className="event-category">
                      <span className={`category-badge ${event.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1).replace('-', ' ')}
                      </span>
                    </div>

                    {event.status === 'rejected' && event.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong>
                        <p>{event.rejectionReason}</p>
                      </div>
                    )}

                    <div className="event-actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewDetails(event)}
                      >
                        View Details
                      </button>
                      {event.status === 'pending' && (
                        <button
                          className="btn-delete"
                          onClick={() => deleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.eventName}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="event-detail-grid">
                <div className="detail-item">
                  <strong>Status:</strong>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                <div className="detail-item">
                  <strong>Priority:</strong>
                  {getPriorityBadge(selectedEvent.priority)}
                </div>

                <div className="detail-item">
                  <strong>Category:</strong>
                  <span className={`category-badge ${selectedEvent.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1).replace('-', ' ')}
                  </span>
                </div>

                <div className="detail-item">
                  <strong>Date:</strong>
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>

                <div className="detail-item">
                  <strong>Time:</strong>
                  <span>{formatTime(selectedEvent.time)}</span>
                </div>

                <div className="detail-item">
                  <strong>Location:</strong>
                  <span>{selectedEvent.address}</span>
                </div>

                <div className="detail-item">
                  <strong>Price:</strong>
                  <span className="price-display">{formatPricing(selectedEvent.pricing)}</span>
                </div>

                <div className="detail-item full-width">
                  <strong>Description:</strong>
                  <p>{selectedEvent.description}</p>
                </div>

                {/* Pricing Details Section */}
                {selectedEvent.pricing && selectedEvent.pricing.tickets && selectedEvent.pricing.tickets.length > 0 && (
                  <div className="detail-item full-width">
                    <strong>Ticket Information:</strong>
                    <div className="ticket-pricing-details">
                      {selectedEvent.pricing.isFree ? (
                        <div className="free-event-notice">
                          <span>This is a free event - no tickets required!</span>
                        </div>
                      ) : (
                        <div className="ticket-types">
                          {selectedEvent.pricing.tickets.map((ticket, index) => (
                            <div key={index} className="ticket-type">
                              <div className="ticket-info">
                                <h4>{ticket.type || 'General Admission'}</h4>
                                <div className="ticket-price">${ticket.price}</div>
                              </div>
                              {ticket.description && (
                                <p className="ticket-description">{ticket.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedEvent.status === 'rejected' && selectedEvent.rejectionReason && (
                  <div className="detail-item full-width rejection-detail">
                    <strong>Rejection Reason:</strong>
                    <p className="rejection-text">{selectedEvent.rejectionReason}</p>
                  </div>
                )}

                <div className="detail-item full-width">
                  <strong>Submitted:</strong>
                  <span>{formatDate(selectedEvent.submittedAt)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedEvent.status === 'pending' && (
                <button
                  className="btn-delete"
                  onClick={() => deleteEvent(selectedEvent._id)}
                >
                  Delete Event
                </button>
              )}
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyEvents;
