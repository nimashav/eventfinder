
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecommendedEvents.css';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal.jsx';

const RecommendedEvents = () => {
  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API state
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample recommended event data with expanded details for fallback
  const fallbackEvents = [
    {
      id: 1,
      title: 'Fun-Festa Carnival',
      category: 'Music',
      date: 'Nov 15, 2025',
      location: 'The Blue Note',
      image: '/images/Fun-Festa-carnival.jpg',
      price: '$40',
      description: 'A vibrant music carnival with live performances, food stalls, and fun activities for all ages.',
      organizer: 'City Events Group',
      highlights: [
        'Live bands and DJs',
        'Carnival games and prizes',
        'Street food and drinks',
        'Family-friendly atmosphere',
        'Fireworks show at night'
      ]
    },
    {
      id: 2,
      title: 'Nimnada-Concert',
      category: 'Art & Culture',
      date: 'Dec 5, 2025',
      location: 'Community Hall',
      image: '/images/Nimnada-Concert.jpg',
      price: '$15',
      description: 'A cultural concert featuring traditional and modern performances by local artists.',
      organizer: 'Nimnada Arts Foundation',
      highlights: [
        'Traditional music and dance',
        'Artisan market',
        'Meet the performers',
        'Cultural workshops',
        'Refreshments included'
      ]
    },
    {
      id: 3,
      title: 'Code Innovators Hackathon',
      category: 'Tech & Innovation',
      date: 'Jan 10-12, 2026',
      location: 'Innovation Hub',
      image: '/images/hackathon.png',
      price: '$50',
      description: 'A 48-hour hackathon for developers, designers, and entrepreneurs to build innovative tech solutions.',
      organizer: 'Tech Innovators',
      highlights: [
        'Team and solo tracks',
        'Mentorship sessions',
        'Prizes for top projects',
        'Networking opportunities',
        'Free swag and meals'
      ]
    },
    {
      id: 4,
      title: 'Annual City Marathon',
      category: 'Sports',
      date: 'Feb 15, 2026',
      location: 'Downtown Loop',
      image: '/images/annual marathon.png',
      price: '$80',
      description: 'Join thousands of runners in the city’s biggest marathon event. All skill levels welcome!',
      organizer: 'City Sports League',
      highlights: [
        'Full and half marathon options',
        'Finisher medals',
        'Hydration stations',
        'Live music along the route',
        'Charity fundraising'
      ]
    },
    {
      id: 5,
      title: 'Gourmet Pasta Workshop',
      category: 'Food & Drink',
      date: 'Nov 17, 2025',
      location: 'Culinary Institute',
      image: '/images/pasta workshop.jpg',
      price: '$30',
      description: 'Learn to make authentic pasta from scratch with expert chefs. Includes tasting session.',
      organizer: 'Culinary Institute',
      highlights: [
        'Hands-on pasta making',
        'Recipe booklet included',
        'Tasting session',
        'Certificate of completion',
        'All skill levels welcome'
      ]
    },
    {
      id: 6,
      title: 'Live Rock Show: The Thunderbolts',
      category: 'Music',
      date: 'Apr 27, 2026',
      location: 'The Arena',
      image: '/images/rock-show.jpg',
      price: '$60',
      description: 'Experience an electrifying live rock concert by The Thunderbolts with special guests.',
      organizer: 'Arena Live',
      highlights: [
        'Opening acts',
        'Merchandise stalls',
        'Meet & greet passes',
        'Food and drinks available',
        'After-party event'
      ]
    },
    {
      id: 7,
      title: 'Advanced Photography Workshop',
      category: 'Art & Culture',
      date: 'May 10-11, 2026',
      location: 'Media Studio',
      image: '/images/tech-summit.png',
      price: '$120',
      description: 'Take your photography skills to the next level with hands-on training and expert tips.',
      organizer: 'Media Studio',
      highlights: [
        'Studio and outdoor sessions',
        'Portfolio review',
        'Equipment provided',
        'Small group sizes',
        'Certificate included'
      ]
    },
    {
      id: 8,
      title: 'AI in Everyday Life Webinar',
      category: 'Tech & Innovation',
      date: 'June 3, 2026',
      location: 'Online Event',
      image: '/images/webinar.png',
      price: 'Free',
      description: 'A free online webinar exploring the impact of AI on daily life, with expert speakers.',
      organizer: 'AI Insights',
      highlights: [
        'Live Q&A session',
        'Downloadable resources',
        'Certificate of attendance',
        'Networking lounge',
        'Giveaways for attendees'
      ]
    },
  ];

  useEffect(() => {
    fetchRecommendedEvents();
  }, []);

  const fetchRecommendedEvents = async () => {
    try {
      setLoading(true);
      // Fetch only recommended events for this section
      const response = await fetch('http://localhost:5001/api/events?status=approved&priority=recommended&limit=8');

      if (!response.ok) {
        throw new Error('Failed to fetch recommended events');
      }

      const data = await response.json();
      setApprovedEvents(data.data || []);
    } catch (error) {
      console.error('Error fetching recommended events:', error);
      setError('Failed to load recommended events');
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

  // Display recommended events from database, no fallback to hardcoded events
  const displayEvents = approvedEvents.length > 0
    ? approvedEvents.map(event => ({
      id: event._id,
      title: event.eventName || event.title,
      category: formatCategory(event.category),
      date: formatEventDate(event.date),
      time: formatEventTime(event.time),
      location: event.address || event.location,
      image: event.image ? `http://localhost:5001/uploads/${event.image}` : '/images/art-exhibition.png',
      price: event.price || 'Free',
      description: event.description,
      organizer: event.organizer?.name || 'Event Organizer',
      organizerEmail: event.organizer?.email,
      expectedAttendees: event.expectedAttendees,
      priority: event.priority,
      highlights: event.highlights || [
        'Professionally organized event',
        'Quality experience guaranteed',
        'Safe and secure venue',
        'Community focused',
        'Great networking opportunities'
      ]
    }))
    : []; // Remove fallback to hardcoded events

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
      <section className="recommended-events section">
        <div className="container">
          <div className="section-header">
            <h2>Recommended Events</h2>
            <p>Loading the latest approved events...</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recommended-events section">
      <div className="container">
        <div className="section-header">
          <h2>Recommended Events</h2>
          <p>
            {approvedEvents.length > 0
              ? 'Hand-picked recommended events we think you\'ll love, based on popular trends.'
              : 'No recommended events available at the moment. Check back soon for amazing events!'
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

        <div className="show-more-container">
          {displayEvents.length > 0 && (
            <Link to="/events" className="show-more-button">
              Show More Events
            </Link>
          )}
        </div>



        {/* Event Details Modal */}
        {isModalOpen && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
};

export default RecommendedEvents;
