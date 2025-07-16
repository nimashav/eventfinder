import React from 'react';
import { Link } from 'react-router-dom';
import './RecommendedEvents.css';

const RecommendedEvents = () => {
  // Sample recommended event data
  const recommendedEvents = [
    {
      id: 1,
      title: 'An Evening of Smooth Jazz',
      category: 'Music',
      date: 'Nov 15, 2025',
      location: 'The Blue Note',
      image: '/images/jazz.jpg',
      price: '$40',
    },
    {
      id: 2,
      title: 'Urban Poetry Slam',
      category: 'Art & Culture',
      date: 'Dec 5, 2025',
      location: 'Community Hall',
      image: '/images/poetry-slam.jpg',
      price: '$15',
    },
    {
      id: 3,
      title: 'Code Innovators Hackathon',
      category: 'Tech & Innovation',
      date: 'Jan 10-12, 2026',
      location: 'Innovation Hub',
      image: '/images/hackathon.jpg',
      price: '$50',
    },
    {
      id: 4,
      title: 'Annual City Marathon',
      category: 'Sports',
      date: 'Feb 15, 2026',
      location: 'Downtown Loop',
      image: '/images/marathon.jpg',
      price: '$80',
    },
    {
      id: 5,
      title: 'Gourmet Pasta Workshop',
      category: 'Food & Drink',
      date: 'Nov 17, 2025',
      location: 'Culinary Institute',
      image: '/images/pasta-workshop.jpg',
      price: '$30',
    },
    {
      id: 6,
      title: 'Live Rock Show: The Thunderbolts',
      category: 'Music',
      date: 'Apr 27, 2026',
      location: 'The Arena',
      image: '/images/rock-show.jpg',
      price: '$60',
    },
    {
      id: 7,
      title: 'Advanced Photography Workshop',
      category: 'Art & Culture',
      date: 'May 10-11, 2026',
      location: 'Media Studio',
      image: '/images/photography.jpg',
      price: '$120',
    },
    {
      id: 8,
      title: 'AI in Everyday Life Webinar',
      category: 'Tech & Innovation',
      date: 'June 3, 2026',
      location: 'Online Event',
      image: '/images/ai-webinar.jpg',
      price: 'Free',
    },
  ];

  return (
    <section className="recommended-events section">
      <div className="container">
        <div className="section-header">
          <h2>Recommended Events</h2>
          <p>Hand-picked events we think you'll love, based on popular trends.</p>
        </div>
        
        <div className="event-grid">
          {recommendedEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <span className="event-category">{event.category}</span>
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <div className="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="meta-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {event.date}
                  </div>
                  <div className="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="meta-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
                <div className="event-footer">
                  <span className="event-price">{event.price}</span>
                  <Link to={`/event/${event.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="show-more-container">
          <Link to="/events" className="show-more-button">
            Show More Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendedEvents;
