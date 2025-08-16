import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx';
import './AdminBase.css';
import './ApprovedEvents.css';

const ApprovedEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Sample data for approved events
  const approvedEvents = [
    {
      id: 1,
      title: 'Annual Tech Conference',
      date: '2024-08-15',
      location: 'Virtual',
      category: 'Conference',
      organizer: 'John Doe',
      status: 'Live',
      attendees: 1250,
      revenue: '$45,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 2,
      title: 'Data Science Workshop',
      date: '2024-08-01',
      location: 'New York',
      category: 'Workshop',
      organizer: 'Jane Smith',
      status: 'Completed',
      attendees: 320,
      revenue: '$12,500',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 3,
      title: 'Future of AI Webinar',
      date: '2024-09-10',
      location: 'Online',
      category: 'Webinar',
      organizer: 'Mike Johnson',
      status: 'Upcoming',
      attendees: 850,
      revenue: '$25,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 4,
      title: 'Leadership Summit',
      date: '2024-09-22',
      location: 'London',
      category: 'Seminar',
      organizer: 'Sarah Wilson',
      status: 'Live',
      attendees: 580,
      revenue: '$32,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 5,
      title: 'Community Hackathon',
      date: '2024-10-05',
      location: 'San Francisco',
      category: 'Community',
      organizer: 'David Brown',
      status: 'Upcoming',
      attendees: 200,
      revenue: '$8,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 6,
      title: 'Digital Marketing Bootcamp',
      date: '2024-07-20',
      location: 'Chicago',
      category: 'Workshop',
      organizer: 'Emily Davis',
      status: 'Completed',
      attendees: 450,
      revenue: '$18,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 7,
      title: 'Startup Pitch Competition',
      date: '2024-08-30',
      location: 'Austin',
      category: 'Community',
      organizer: 'Robert Chen',
      status: 'Live',
      attendees: 750,
      revenue: '$35,000',
      image: 'https://via.placeholder.com/40x40'
    },
    {
      id: 8,
      title: 'Cloud Computing Seminar',
      date: '2024-09-15',
      location: 'Seattle',
      category: 'Seminar',
      organizer: 'Lisa Wang',
      status: 'Upcoming',
      attendees: 400,
      revenue: '$15,000',
      image: 'https://via.placeholder.com/40x40'
    }
  ];

  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === '' || event.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalApprovedEvents = approvedEvents.length;
  const upcomingEvents = approvedEvents.filter(event => event.status === 'Upcoming').length;
  const totalRevenue = approvedEvents.reduce((sum, event) => {
    return sum + parseInt(event.revenue.replace('$', '').replace(',', ''));
  }, 0);
  const totalAttendees = approvedEvents.reduce((sum, event) => sum + event.attendees, 0);

  const eventsPerPage = 10;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  return (
    <div className=" admin-page admin-dashboard">
      {/* Header */}
      <AdminHeader title="EventWave Admin Dashboard" />

      <div className="admin-dashboard-container">
        <div className="container">
          <div className="admin-dashboard-layout">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="admin-main-content main-content">
              <div className="admin-content-header content-header">
                <h2>Approved Events Overview</h2>
                <p>Manage and monitor all approved events with comprehensive analytics and insights.</p>
              </div>

              {/* Event Metrics */}
              <div className="metrics-section">
                <h3>Event Metrics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon total">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Total Approved Events</h4>
                      <span className="stat-number">{totalApprovedEvents}</span>
                      <p>+17% from last month</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon upcoming">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Upcoming Events</h4>
                      <span className="stat-number">{upcomingEvents}</span>
                      <p>Next 30 days</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon revenue">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Total Revenue</h4>
                      <span className="stat-number">${totalRevenue.toLocaleString()}</span>
                      <p>+8% vs previous period</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon attendees">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h4>Total Attendees</h4>
                      <span className="stat-number">{totalAttendees.toLocaleString()}</span>
                      <p>Across all events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approved Events List */}
              <div className="events-section">
                <div className="section-header">
                  <h3>Approved Events List</h3>
                  <div className="section-actions">
                    <div className="filters">
                      <div className="search-box">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search events..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Categories</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Community">Community</option>
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Status</option>
                        <option value="Live">Live</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="view-controls">
                      <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      </button>
                      <button className="add-event-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Event
                      </button>
                    </div>
                  </div>
                </div>

                <div className="events-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date & Time</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Attendees</th>
                        <th>Revenue</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEvents.map(event => (
                        <tr key={event.id}>
                          <td>
                            <div className="event-info">
                              <div className="event-avatar">
                                <img src={event.image} alt="Event" />
                              </div>
                              <div className="event-details">
                                <span className="event-title">{event.title}</span>
                                <span className="event-organizer">by {event.organizer}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="event-date">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <span className="event-location">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {event.location}
                            </span>
                          </td>
                          <td>
                            <span className={`category-badge ${event.category.toLowerCase()}`}>
                              {event.category}
                            </span>
                          </td>
                          <td>
                            <span className="attendees-count">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                              </svg>
                              {event.attendees.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span className="revenue-amount">{event.revenue}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${event.status.toLowerCase()}`}>
                              {event.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn edit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              <button className="action-btn view">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              <button className="action-btn delete">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Showing {startIndex + 1} to {Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                  </span>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </main>

            {/* Right Sidebar - Calendar View */}
            <aside className="admin-right-sidebar right-sidebar">
              <div className="admin-sidebar-section sidebar-section">
                <h3>Calendar View</h3>
                <div className="calendar-container">
                  <div className="calendar-header">
                    <button className="calendar-nav">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <h4>July 2025</h4>
                    <button className="calendar-nav">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="calendar-grid">
                    <div className="calendar-days">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-dates">
                      {/* Previous month dates */}
                      <div className="calendar-date other-month">29</div>
                      <div className="calendar-date other-month">30</div>
                      {/* Current month dates */}
                      {Array.from({ length: 31 }, (_, i) => (
                        <div key={i + 1} className={`calendar-date ${i + 1 === 16 ? 'today' : ''}`}>
                          {i + 1}
                        </div>
                      ))}
                      {/* Next month dates */}
                      <div className="calendar-date other-month">1</div>
                      <div className="calendar-date other-month">2</div>
                    </div>
                  </div>
                </div>
                <div className="calendar-actions">
                  <button className="calendar-action-btn">View All Events</button>
                </div>
              </div>

              {/* Event Categories */}
              <div className="admin-sidebar-section sidebar-section">
                <h3>Event Categories</h3>
                <div className="category-stats">
                  <div className="category-stat">
                    <span className="category-name">Conference</span>
                    <span className="category-count">2</span>
                  </div>
                  <div className="category-stat">
                    <span className="category-name">Workshop</span>
                    <span className="category-count">2</span>
                  </div>
                  <div className="category-stat">
                    <span className="category-name">Webinar</span>
                    <span className="category-count">1</span>
                  </div>
                  <div className="category-stat">
                    <span className="category-name">Seminar</span>
                    <span className="category-count">2</span>
                  </div>
                  <div className="category-stat">
                    <span className="category-name">Community</span>
                    <span className="category-count">1</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedEvents;
