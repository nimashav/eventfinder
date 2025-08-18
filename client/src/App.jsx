import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';
import './styles/globals.css';

// Pages
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AddEvent from './pages/AddEvent/AddEvent.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ApprovedEvents from './pages/Admin/ApprovedEvents.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import MyEvents from './pages/User/MyEvents.jsx';
import Profile from './pages/User/Profile.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/add-event"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-event"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approved"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ApprovedEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approved-events"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ApprovedEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pending"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Additional routes can be added here as the app expands */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

