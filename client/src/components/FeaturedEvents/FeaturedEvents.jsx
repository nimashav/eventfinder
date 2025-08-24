import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedEvents.css';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal.jsx';
import { useCategoryFilter } from '../../context/CategoryFilterContext';

const FeaturedEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { selectedCategory, getCategoryFilter } = useCategoryFilter();

  useEffect(() => {
    fetchFeaturedEvents();
  }, [selectedCategory]); // Re-fetch when category changes

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);

      // Build the API URL with category filter
      const categoryFilter = getCategoryFilter(selectedCategory);
      let apiUrl = 'http://localhost:5002/api/events/approved?priority=featured&limit=8';

      if (categoryFilter) {
        apiUrl += `&category=${categoryFilter}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch featured events');
      }

      const data = await response.json();
      const featuredEvents = data.data || [];

      console.log('Featured events fetched:', featuredEvents); // Debug log
      setApprovedEvents(featuredEvents);
    } catch (error) {
      console.error('Error fetching featured events:', error);
      setError('Failed to load featured events');
      setApprovedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEventTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCategory = (category) => {
    const categoryMap = {
      'music': 'Music',
      'art-culture': 'Art & Culture',
      'tech-innovation': 'Tech & Innovation',
      'sports': 'Sports',
      'food-drink': 'Food & Drink',
      'business': 'Business',
      'education': 'Education',
      'health': 'Health',
      'other': 'Other'
    };
    return categoryMap[category] || category;
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

  // Display featured events from database, no fallback to hardcoded events
  const displayEvents = approvedEvents.length > 0
    ? approvedEvents.map(event => ({
      id: event._id,
      title: event.eventName || event.title,
      category: formatCategory(event.category),
      date: formatEventDate(event.date),
      time: formatEventTime(event.time),
      location: event.address || event.location,
      image: event.image ? `http://localhost:5002/uploads/${event.image}` : '/images/art-exhibition.png',
      price: formatPricing(event.pricing),
      description: event.description,
      organizer: event.organizer?.name || 'Event Organizer',
      organizerEmail: event.organizer?.email,
      expectedAttendees: event.expectedAttendees,
      priority: event.priority,
      pricing: event.pricing,
      highlights: event.highlights || [
        'Professionally organized event',
        'Quality experience guaranteed',
        'Safe and secure venue',
        'Community focused',
        'Great networking opportunities'
      ]
    }))
    : []; // No fallback to hardcoded events

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <section className="featured-events section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Events</h2>
            <p>Loading featured events from database...</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-events section">
      <div className="container">
        <div className="section-header">
          <h2>
            Featured Events
            {selectedCategory !== 'All' && (
              <span className="category-filter-badge"> - {selectedCategory}</span>
            )}
          </h2>
          <p>
            {approvedEvents.length > 0
              ? `Discover our specially selected featured events${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''} happening soon.`
              : `No featured events available${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''} at the moment. Check back soon for amazing events!`
            }
          </p>
          {error && (
            <div className="error-notice">
              <small>{error}</small>
            </div>
          )}
        </div>

        <div className="event-grid">
          {displayEvents.length > 0 ? (
            displayEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <span className="event-category">{event.category}</span>
                  <img src={event.image} alt={event.title} onError={(e) => {
                    e.target.src = '/images/art-exhibition.png';
                  }} />
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="meta-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {event.date} {event.time && `at ${event.time}`}
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="meta-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {event.location}
                    </div>
                    {event.organizer && (
                      <div className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="meta-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        {event.organizer}
                      </div>
                    )}
                  </div>
                  <div className="event-footer">
                    <span className="event-price">{event.price}</span>
                    <button
                      onClick={() => openModal(event)}
                      className="view-details"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-recommended-events">
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <h3>No Recommended Events</h3>
                <p>We're curating the best recommended events for you. Check back soon!</p>
                <Link to="/add-event" className="submit-event-link">
                  Submit Your Event
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default FeaturedEvents;
