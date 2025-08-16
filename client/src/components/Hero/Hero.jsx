import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Next Unforgettable Experience</h1>
        <p>From concerts to workshops, find experiences that ignite your passions</p>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for concerts, workshops, festivals..."
            className="hero-search"
          />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
        
        <Link to="/add-event" className="add-event-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="add-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Your Event
        </Link>
      </div>
    </section>
  );
};

export default Hero;
