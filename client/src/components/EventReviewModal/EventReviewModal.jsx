import React, { useState } from 'react';
import './EventReviewModal.css';

const EventReviewModal = ({ event, onClose, onApprove, onReject, isSubmitting }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('recommended');

  const handleApprove = () => {
    if (!selectedPriority) {
      alert('Please select a priority for this event');
      return;
    }
    onApprove(event._id, selectedPriority);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(event._id, rejectionReason);
  };

  const resetForms = () => {
    setShowRejectForm(false);
    setShowApprovalForm(false);
    setRejectionReason('');
    setSelectedPriority('recommended');
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
                  <span className={`priority-badge ${event.priority || 'none'}`}>
                    {event.priority ? event.priority.charAt(0).toUpperCase() + event.priority.slice(1) : 'Not Set'}
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
                    <img
                      src={event.image.startsWith('http') ? event.image : `http://localhost:5001/uploads/${event.image}`}
                      alt={event.eventName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<p>Image failed to load</p>';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Approval Form */}
          {showApprovalForm && (
            <div className="approval-form">
              <h3>Set Event Priority</h3>
              <p>Choose the priority level for this event when it gets approved:</p>
              <div className="priority-selection">
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="recommended"
                    checked={selectedPriority === 'recommended'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="priority-card recommended">
                    <div className="priority-header">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      <h4>Recommended</h4>
                    </div>
                    <p>Regular event that will appear in standard listings and search results.</p>
                  </div>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="featured"
                    checked={selectedPriority === 'featured'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="priority-card featured">
                    <div className="priority-header">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      <h4>Featured</h4>
                    </div>
                    <p>High-priority event that will be prominently displayed in featured sections and homepage.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

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

          {!showRejectForm && !showApprovalForm ? (
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
                onClick={() => setShowApprovalForm(true)}
                disabled={isSubmitting}
              >
                Approve Event
              </button>
            </>
          ) : showApprovalForm ? (
            <>
              <button
                className="btn-secondary"
                onClick={resetForms}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                className="btn-approve"
                onClick={handleApprove}
                disabled={isSubmitting || !selectedPriority}
              >
                {isSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={resetForms}
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
