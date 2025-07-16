import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedEvents.css';

const FeaturedEvents = () => {
  // Sample featured event data
  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival',
      category: 'Music',
      date: 'July 15-17, 2025',
      location: 'Central Park, NY',
      image: '/images/music-festival.jpg',
      price: '$75',
    },
    {
      id: 2,
      title: 'Modern Art Exhibition',
      category: 'Art & Culture',
      date: 'Aug 7-20, 2025',
      location: 'Metropolitan Gallery',
      image: '/images/art-exhibition.jpg',
      price: '$25',
    },
    {
      id: 3,
      title: 'Future Tech Summit',
      category: 'Tech & Innovation',
      date: 'Sept 9-10, 2025',
      location: 'Innovation Hub',
      image: '/images/tech-summit.jpg',
      price: '$399',
    },
    {
      id: 4,
      title: 'International Food Fair',
      category: 'Food & Drink',
      date: 'Oct 15-18, 2025',
      location: 'Harbor Plaza',
      image: '/images/food-fair.jpg',
      price: 'Free',
    },
  ];

  return (
    <section className="featured-events section">
      <div className="container">
        <div className="section-header">
          <h2>Featured Events</h2>
          <p>Explore the most popular and highly anticipated events happening soon.</p>
        </div>
        
        <div className="event-cards">
          {featuredEvents.map(event => (
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
      </div>
    </section>
  );
};

export default FeaturedEvents;
