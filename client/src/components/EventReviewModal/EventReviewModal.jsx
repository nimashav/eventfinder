import React, { useState } from 'react';
import './EventReviewModal.css';

const EventReviewModal = ({ event, onClose, onApprove, onReject, isSubmitting }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = () => {
    onApprove(event._id);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(event._id, rejectionReason);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review Event Details</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="event-details-grid">
            {/* Left Column - Event Info */}
            <div className="event-info-section">
              <div className="detail-group">
                <h3>Event Information</h3>
                <div className="detail-item">
                  <label>Event Name:</label>
                  <span>{event.eventName}</span>
                </div>
                <div className="detail-item">
                  <label>Description:</label>
                  <p className="description-text">{event.description}</p>
                </div>
                <div className="detail-item">
                  <label>Category:</label>
                  <span className={`category-badge ${event.category}`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="detail-group">
                <h3>Date & Location</h3>
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="detail-item">
                  <label>Time:</label>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span>{event.address}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Organizer & Status */}
            <div className="organizer-section">
              <div className="detail-group">
                <h3>Organizer Details</h3>
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{event.organizer?.name || 'Anonymous'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{event.organizer?.email || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{event.organizer?.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="detail-group">
                <h3>Event Status</h3>
                <div className="detail-item">
                  <label>Current Status:</label>
                  <span className={`status-badge ${event.status}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Priority:</label>
                  <span className={`priority-badge ${event.priority}`}>
                    {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Submitted:</label>
                  <span>{formatDate(event.submittedAt)}</span>
                </div>
              </div>

              {/* Image Section */}
              {event.image && (
                <div className="detail-group">
                  <h3>Event Image</h3>
                  <div className="event-image">
                    <img src={`/images/${event.image}`} alt={event.eventName} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="rejection-form">
              <h3>Rejection Reason</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejecting this event..."
                rows="4"
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          {!showRejectForm ? (
            <>
              <button
                className="btn-reject"
                onClick={() => setShowRejectForm(true)}
                disabled={isSubmitting}
              >
                Reject Event
              </button>
              <button
                className="btn-approve"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve Event'}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                className="btn-reject"
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason.trim()}
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventReviewModal;
