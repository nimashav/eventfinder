import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './AddEvent.css';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    address: '',
    date: '',
    time: '',
    category: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event data:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
      eventName: '',
      description: '',
      address: '',
      date: '',
      time: '',
      category: '',
      image: null
    });
    setImagePreview(null);
  };

  return (
    <div className="add-event-page">
      <Header />

      <div className="add-event-container">
        <div className="container">
          <div className="add-event-header">
            <h1>Add New Event</h1>
            <div className="header-actions">
              <button className="btn-secondary">Previous Events</button>
              <button className="btn-outline">View Guidelines</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="add-event-form">
            <div className="form-columns">
              {/* Left Column */}
              <div className="left-column">
                {/* Event Details Section */}
                <div className="form-section">
                  <h2>Event Details</h2>
                  <p className="section-description">Provide the core information about your event.</p>

                  <div className="form-group">
                    <label htmlFor="eventName">Event Name</label>
                    <input
                      type="text"
                      id="eventName"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      placeholder="e.g., Annual Tech Conference 2024"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your event in detail, including key activities and why attendees should join."
                      rows="6"
                      required
                    />
                    <div className="textarea-actions">
                      <button type="button" className="format-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="form-section">
                  <h2>Location</h2>
                  <p className="section-description">Where will your event be held?</p>

                  <div className="form-group">
                    <label htmlFor="address">Address / Venue Name</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g., Central Convention Center, Hall A"
                      required
                    />
                    <p className="field-note">
                      Tip: For online events, simply state "Online Event" or provide a meeting link here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                {/* Date & Time Section */}
                <div className="form-section">
                  <h2>Date & Time</h2>
                  <p className="section-description">Specify when the event will take place.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="time">Time</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Image Section */}
                <div className="form-section">
                  <h2>Category & Image</h2>
                  <p className="section-description">Help attendees discover your event easily.</p>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="music">Music</option>
                      <option value="art-culture">Art & Culture</option>
                      <option value="tech-innovation">Tech & Innovation</option>
                      <option value="sports">Sports</option>
                      <option value="food-drink">Food & Drink</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="health">Health & Wellness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Feature Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input"
                      />
                      <div className="image-preview">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Event preview" />
                        ) : (
                          <div className="image-placeholder">
                            <div className="placeholder-content">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                              <p>Click to upload image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="field-note">
                      Upload a high-quality image that represents your event. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="form-footer">
              <p className="footer-note">
                All submitted events are subject to administrator review and approval.
              </p>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Event
                </button>
              </div>
            </div>
          </form>

          <div className="page-footer">
            <p>© 2025 EventWave. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
