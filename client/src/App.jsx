import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import AddEvent from './pages/AddEvent/AddEvent.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ApprovedEvents from './pages/Admin/ApprovedEvents.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/submit-event" element={<AddEvent />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approved" element={<ApprovedEvents />} />
          <Route path="/admin/pending" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          {/* Additional routes can be added here as the app expands */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

