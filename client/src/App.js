import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import LandingPage from './pages/LandingPage/LandingPage';
import AddEvent from './pages/AddEvent/AddEvent';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ApprovedEvents from './pages/Admin/ApprovedEvents';
import UserManagement from './pages/Admin/UserManagement';

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

