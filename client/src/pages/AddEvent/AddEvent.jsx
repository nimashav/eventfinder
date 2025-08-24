import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './AddEvent.css';

const AddEvent = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    address: '',
    date: '',
    time: '',
    category: '',
    image: null,
    organizer: {
      name: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    pricing: {
      isFree: true,
      tickets: [
        { type: 'General', price: 0, description: '', available: true }
      ]
    }
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested organizer fields
    if (name.startsWith('organizer.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          [field]: value
        }
      }));
    } else if (name === 'isFree') {
      // Handle pricing free toggle
      const isFree = value === 'true';
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          isFree,
          tickets: isFree
            ? [{ type: 'General', price: 0, description: '', available: true }]
            : prev.pricing.tickets.map(ticket => ({ ...ticket, price: ticket.price || 0 }))
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage({
          type: 'error',
          message: 'Image size must be less than 5MB'
        });
        return;
      }

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

  const handleTicketChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        tickets: prev.pricing.tickets.map((ticket, i) =>
          i === index ? { ...ticket, [field]: value } : ticket
        )
      }
    }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        tickets: [
          ...prev.pricing.tickets,
          { type: '', price: 0, description: '', available: true }
        ]
      }
    }));
  };

  const removeTicketType = (index) => {
    if (formData.pricing.tickets.length > 1) {
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          tickets: prev.pricing.tickets.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!token) {
      setSubmitMessage({
        type: 'error',
        message: 'You must be logged in to add an event. Please log in and try again.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', message: '' });

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append('eventName', formData.eventName.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('category', formData.category);

      // Append organizer as JSON string
      formDataToSend.append('organizer', JSON.stringify({
        name: formData.organizer.name.trim() || 'Anonymous',
        email: formData.organizer.email.trim(),
        phone: formData.organizer.phone.trim()
      }));

      // Append pricing as JSON string
      formDataToSend.append('pricing', JSON.stringify({
        isFree: formData.pricing.isFree,
        tickets: formData.pricing.tickets.map(ticket => ({
          type: ticket.type.trim() || 'General',
          price: formData.pricing.isFree ? 0 : parseFloat(ticket.price) || 0,
          description: ticket.description.trim(),
          available: ticket.available
        }))
      }));

      // Append image file if exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('📤 Submitting event with token:', token ? 'Token present' : 'No token');

      // Send to backend using the new endpoint
      const response = await fetch('http://localhost:5002/api/events/with-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend // Don't set Content-Type header, let browser set it
      });

      console.log('📥 Response status:', response.status);

      const result = await response.json();
      console.log('📥 Server response:', result);

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          message: 'Event submitted successfully! It will be reviewed by admin before being published.'
        });

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            eventName: '',
            description: '',
            address: '',
            date: '',
            time: '',
            category: '',
            image: null,
            organizer: { name: '', email: '', phone: '' },
            pricing: {
              isFree: true,
              tickets: [
                { type: 'General', price: 0, description: '', available: true }
              ]
            }
          });
          setImagePreview(null);
          // Optionally navigate to success page
          // navigate('/events');
        }, 3000);
      } else {
        // Handle different error types
        if (response.status === 401) {
          setSubmitMessage({
            type: 'error',
            message: 'Authentication failed. Please log in again and try again.'
          });
        } else if (response.status === 403) {
          setSubmitMessage({
            type: 'error',
            message: 'You do not have permission to add events.'
          });
        } else {
          setSubmitMessage({
            type: 'error',
            message: result.message || 'Failed to submit event. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
      image: null,
      organizer: { name: '', email: '', phone: '' },
      pricing: {
        isFree: true,
        tickets: [
          { type: 'General', price: 0, description: '', available: true }
        ]
      }
    });
    setImagePreview(null);
    setSubmitMessage({ type: '', message: '' });
  };

  return (
    <div className="add-event-page">
      <Header />

      <div className="add-event-container">
        <div className="container">
          <div className="add-event-header">
            <h1>Add New Event</h1>
            {/* <div className="header-actions">
              <button className="btn-secondary">Previous Events</button>
              <button className="btn-outline">View Guidelines</button>
            </div> */}
          </div>

          {/* Success/Error Message */}
          {submitMessage.message && (
            <div className={`submit-message ${submitMessage.type}`}>
              <p>{submitMessage.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-event-form">
            <div className="form-columns">
              {/* Left Column */}
              <div className="left-column">
                {/* Event Details Section */}
                <div className="form-section">
                  <h2>Event Details</h2>
                  <p className="section-description">Provide the core information about your event.</p>

                  <div className="form-group">
                    <label htmlFor="eventName">Event Name *</label>
                    <input
                      type="text"
                      id="eventName"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      placeholder="e.g., Annual Tech Conference 2024"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your event in detail, including key activities and why attendees should join."
                      rows="6"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="textarea-actions">
                      <button type="button" className="format-btn" disabled={isSubmitting}>
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
                    <label htmlFor="address">Address / Venue Name *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g., Central Convention Center, Hall A"
                      required
                      disabled={isSubmitting}
                    />
                    <p className="field-note">
                      Tip: For online events, simply state "Online Event" or provide a meeting link here.
                    </p>
                  </div>
                </div>

                {/* Organizer Section */}
                <div className="form-section">
                  <h2>Organizer Information</h2>
                  <p className="section-description">Contact details for the event organizer.</p>

                  <div className="form-group">
                    <label htmlFor="organizer.name">Organizer Name</label>
                    <input
                      type="text"
                      id="organizer.name"
                      name="organizer.name"
                      value={formData.organizer.name}
                      onChange={handleInputChange}
                      placeholder="Your name or organization"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="organizer.email">Email</label>
                      <input
                        type="email"
                        id="organizer.email"
                        name="organizer.email"
                        value={formData.organizer.email}
                        onChange={handleInputChange}
                        placeholder="contact@example.com"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer.phone">Phone</label>
                      <input
                        type="tel"
                        id="organizer.phone"
                        name="organizer.phone"
                        value={formData.organizer.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        disabled={isSubmitting}
                      />
                    </div>
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
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Image Section */}
                <div className="form-section">
                  <h2>Category & Image</h2>
                  <p className="section-description">Help attendees discover your event easily.</p>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
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

                {/* Ticket Pricing Section */}
                <div className="form-section">
                  <h2>Ticket Pricing</h2>
                  <p className="section-description">Set up your event's ticket pricing and types.</p>

                  <div className="form-group">
                    <label>Event Type</label>
                    <div className="pricing-toggle">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="isFree"
                          value="true"
                          checked={formData.pricing.isFree}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        <span className="radio-label">Free Event</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="isFree"
                          value="false"
                          checked={!formData.pricing.isFree}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        <span className="radio-label">Paid Event</span>
                      </label>
                    </div>
                  </div>

                  {/* Ticket Types */}
                  <div className="form-group">
                    <label>Ticket Types</label>
                    <div className="ticket-types">
                      {formData.pricing.tickets.map((ticket, index) => (
                        <div key={index} className="ticket-type-item">
                          <div className="ticket-header">
                            <input
                              type="text"
                              placeholder={formData.pricing.isFree ? "General Admission" : "Ticket Type (e.g., Premium, VIP, Standard)"}
                              value={ticket.type}
                              onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                              disabled={isSubmitting}
                              className="ticket-type-input"
                            />
                            {formData.pricing.tickets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTicketType(index)}
                                disabled={isSubmitting}
                                className="remove-ticket-btn"
                                title="Remove ticket type"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>

                          <div className="ticket-details">
                            {!formData.pricing.isFree && (
                              <div className="price-input">
                                <label>Price (LKR)</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={ticket.price}
                                  onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                  disabled={isSubmitting}
                                />
                              </div>
                            )}

                            <div className="description-input">
                              <label>Description (Optional)</label>
                              <input
                                type="text"
                                placeholder={formData.pricing.isFree ? "Free admission for all attendees" : "What's included with this ticket type?"}
                                value={ticket.description}
                                onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!formData.pricing.isFree && (
                      <button
                        type="button"
                        onClick={addTicketType}
                        disabled={isSubmitting}
                        className="add-ticket-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Another Ticket Type
                      </button>
                    )}

                    <p className="field-note">
                      {formData.pricing.isFree
                        ? "Free events are great for community building and attracting larger audiences."
                        : "You can offer multiple ticket types like Early Bird, VIP, Standard, etc."
                      }
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
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Event'}
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
