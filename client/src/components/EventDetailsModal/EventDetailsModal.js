import React from 'react';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="modal-header">
          <div className="modal-image">
            <img src={event.image} alt={event.title} />
            <div className="modal-category">{event.category}</div>
          </div>
        </div>
        
        <div className="modal-body">
          <h2 className="modal-title">{event.title}</h2>
          
          <div className="modal-info">
            <div className="info-section">
              <h3>Event Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="info-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <strong>Date</strong>
                    <span>{event.date}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="info-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <strong>Location</strong>
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="info-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong>Price</strong>
                    <span className="price-highlight">{event.price}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="info-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <div>
                    <strong>Organizer</strong>
                    <span>{event.organizer || 'EventWave Team'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <h3>Description</h3>
              <p className="event-description">
                {event.description || `Join us for an incredible ${event.category.toLowerCase()} experience at ${event.title}. This event promises to be an unforgettable gathering of like-minded individuals passionate about ${event.category.toLowerCase()}. Don't miss out on this amazing opportunity to connect, learn, and enjoy!`}
              </p>
            </div>
            
            <div className="info-section">
              <h3>What to Expect</h3>
              <ul className="event-highlights">
                <li>Engaging activities and entertainment</li>
                <li>Networking opportunities with fellow attendees</li>
                <li>Professional organization and management</li>
                <li>Memorable experiences and lasting connections</li>
                <li>High-quality facilities and amenities</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
