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

            {/* Pricing Details Section */}
            {event.pricing && event.pricing.tickets && event.pricing.tickets.length > 0 && (
              <div className="info-section">
                <h3>Ticket Information</h3>
                <div className="ticket-pricing-details">
                  {event.pricing.isFree ? (
                    <div className="free-event-notice">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="free-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5C5.25 5.671 4.328 6.75 3 6.75H2.25A2.25 2.25 0 010 4.5v-.264m5.25 0c1.161.024 2.298.093 3.32.211m2.679-.211a99.94 99.94 0 013.32-.211m-6.64 0a99.9 99.9 0 01-3.32.211m10.686-.211c.966.78 1.718 1.8 2.131 3.032a9.005 9.005 0 01-2.131 6.218l-1.17.195m1.17-.195a6.97 6.97 0 01-3.32.211M3.32 4.025C4.49 3.84 5.97 3.75 7.5 3.75s3.01.09 4.18.275" />
                      </svg>
                      <div>
                        <strong>Free Admission</strong>
                        <span>This is a free event - no tickets required!</span>
                      </div>
                    </div>
                  ) : (
                    <div className="ticket-types">
                      {event.pricing.tickets.map((ticket, index) => (
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
