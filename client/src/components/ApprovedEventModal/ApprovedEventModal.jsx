import React, { useState } from 'react';
import './ApprovedEventModal.css';

const ApprovedEventModal = ({ event, onClose, onUpdatePriority, onDelete, isSubmitting }) => {
  const [showPriorityForm, setShowPriorityForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(event?.priority || 'recommended');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdatePriority = () => {
    if (!selectedPriority) {
      alert('Please select a priority for this event');
      return;
    }
    onUpdatePriority(event._id, selectedPriority);
    setShowPriorityForm(false);
  };

  const handleDelete = () => {
    onDelete(event._id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getOrganizerName = (organizer) => {
    if (!organizer) return 'Unknown';
    return typeof organizer === 'object' ? (organizer.name || 'Unknown') : organizer;
  };

  const getOrganizerEmail = (organizer) => {
    if (!organizer) return '';
    return typeof organizer === 'object' ? (organizer.email || '') : '';
  };

  const getOrganizerPhone = (organizer) => {
    if (!organizer) return '';
    return typeof organizer === 'object' ? (organizer.phone || '') : '';
  };

  const getEventTitle = (event) => {
    return event.title || event.eventName || 'Untitled Event';
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="approved-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Event Details</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          {/* Event Image */}
          <div className="event-image-section">
            {event.image ? (
              <img
                src={event.image.startsWith('http') ? event.image : `/images/${event.image}`}
                alt={getEventTitle(event)}
                className="event-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="image-placeholder" style={{ display: event.image ? 'none' : 'flex' }}>
              📅
            </div>
          </div>

          {/* Event Details */}
          <div className="event-details-section">
            <h3>{getEventTitle(event)}</h3>

            <div className="details-grid">
              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 715.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Date & Time:
                </span>
                <span className="value">
                  {formatDate(event.date)} at {formatTime(event.time)}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Location:
                </span>
                <span className="value">{event.location || 'Not specified'}</span>
              </div>

              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  Category:
                </span>
                <span className="value category-badge">{event.category || 'Uncategorized'}</span>
              </div>

              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  Priority:
                </span>
                <span className={`value priority-badge priority-${event.priority}`}>
                  {event.priority || 'recommended'}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Organizer:
                </span>
                <span className="value">{getOrganizerName(event.organizer)}</span>
              </div>

              {getOrganizerEmail(event.organizer) && (
                <div className="detail-row">
                  <span className="label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Email:
                  </span>
                  <span className="value">{getOrganizerEmail(event.organizer)}</span>
                </div>
              )}

              {getOrganizerPhone(event.organizer) && (
                <div className="detail-row">
                  <span className="label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Phone:
                  </span>
                  <span className="value">{getOrganizerPhone(event.organizer)}</span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status:
                </span>
                <span className="value status-badge status-approved">Approved</span>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="description-section">
                <h4>Description</h4>
                <p>{event.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          {!showPriorityForm && !showDeleteConfirm && (
            <>
              <button
                className="btn-secondary"
                onClick={() => setShowPriorityForm(true)}
                disabled={isSubmitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Update Priority
              </button>
              <button
                className="btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete Event
              </button>
            </>
          )}

          {/* Priority Update Form */}
          {showPriorityForm && (
            <div className="priority-form">
              <h4>Update Event Priority</h4>
              <div className="priority-options">
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="featured"
                    checked={selectedPriority === 'featured'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label featured">Featured</span>
                  <small>High visibility, appears at the top</small>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="recommended"
                    checked={selectedPriority === 'recommended'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label recommended">Recommended</span>
                  <small>Standard visibility, appears in normal order</small>
                </label>
              </div>
              <div className="form-actions">
                <button
                  className="btn-primary"
                  onClick={handleUpdatePriority}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Priority'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowPriorityForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="delete-confirm">
              <h4>Delete Event</h4>
              <p>Are you sure you want to delete "{getEventTitle(event)}"? This action cannot be undone.</p>
              <div className="form-actions">
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedEventModal;
