import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedEvents.css';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';

const FeaturedEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample featured event data with expanded details
  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival',
      category: 'Music',
      date: 'July 15-17, 2025',
      location: 'Central Park, NY',
      image: '/images/music-festival.png',
      price: '$75',
      description: 'Experience the ultimate summer music festival featuring world-class artists across multiple genres. From rock to pop, electronic to indie, this three-day musical journey will captivate your senses.',
      organizer: 'Summer Events Co.',
      highlights: [
        'Over 50 artists across 4 stages',
        'Food trucks and local vendors',
        'Interactive art installations',
        'VIP experiences available',
        'Eco-friendly festival grounds'
      ]
    },
    {
      id: 2,
      title: 'Modern Art Exhibition',
      category: 'Art & Culture',
      date: 'Aug 7-20, 2025',
      location: 'Metropolitan Gallery',
      image: '/images/art-exhibition.png',
      price: '$25',
      description: 'Discover contemporary masterpieces from renowned artists worldwide. This curated exhibition showcases the evolution of modern art through interactive displays and immersive experiences.',
      organizer: 'Metropolitan Gallery',
      highlights: [
        'Works from 30+ international artists',
        'Interactive digital displays',
        'Guided tours available',
        'Artist meet & greet sessions',
        'Student discounts available'
      ]
    },
    {
      id: 3,
      title: 'Future Tech Summit',
      category: 'Tech & Innovation',
      date: 'Sept 9-10, 2025',
      location: 'Innovation Hub',
      image: '/images/tech-summit.png',
      price: '$399',
      description: 'Join industry leaders and innovators for two days of cutting-edge technology discussions, networking opportunities, and hands-on workshops covering AI, blockchain, and emerging technologies.',
      organizer: 'Tech Innovation Group',
      highlights: [
        'Keynote speakers from Fortune 500 companies',
        'Hands-on workshops and demos',
        'Networking opportunities',
        'Startup pitch competition',
        'Latest tech product showcases'
      ]
    },
    {
      id: 4,
      title: 'International Food Fair',
      category: 'Food & Drink',
      date: 'Oct 15-18, 2025',
      location: 'Harbor Plaza',
      image: '/images/food-fair.png',
      price: 'Free',
      description: 'Embark on a culinary journey around the world without leaving the city. Sample authentic dishes from different cultures, watch cooking demonstrations, and participate in food-related activities.',
      organizer: 'Cultural Food Alliance',
      highlights: [
        'Cuisine from 20+ countries',
        'Live cooking demonstrations',
        'Food competitions and contests',
        'Family-friendly activities',
        'Cultural performances'
      ]
    },
  ];

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
                  <button 
                    onClick={() => openModal(event)}
                    className="view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Event Details Modal */}
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
