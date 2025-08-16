import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Want to host an event?</h2>
          <p>Share your unique experience with the world. Submit your event for review and reach thousands of potential attendees!</p>
          
          <Link to="/submit-event" className="cta-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="cta-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit Your Event
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
