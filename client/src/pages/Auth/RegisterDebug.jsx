import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const RegisterDebug = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    firstName: 'Test',
    lastName: 'User',
    email: 'debug@test.com',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    phone: '1234567890'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Form submitted with data:', formData);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email + Math.random().toString(36).substr(2, 5), // Add random suffix to avoid duplicate emails
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone
      };

      console.log('📝 Sending registration data:', registrationData);

      const result = await register(registrationData);

      console.log('📥 Registration result:', result);

      if (result && result.success) {
        console.log('✅ Registration successful, navigating to home');
        navigate('/');
      } else {
        console.error('❌ Registration failed:', result?.error);
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Debug Registration</h1>
            <p>Testing registration functionality</p>
          </div>

          {error && (
            <div className="error-message" style={{ background: '#ffe6e6', color: '#d63031', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creating account...' : 'Test Registration'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Go back to <Link to="/register" className="auth-link">normal registration</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDebug;
