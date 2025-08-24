import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5002/api';

// Create Auth Context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.token]);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user from token
  const loadUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await axios.get(`${API_URL}/auth/me`);

      if (response.data.success) {
        dispatch({
          type: 'LOAD_USER_SUCCESS',
          payload: response.data.data.user
        });
      } else {
        dispatch({ type: 'LOAD_USER_FAIL' });
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Load user error:', error);
      dispatch({ type: 'LOAD_USER_FAIL' });
      localStorage.removeItem('token');
      setAuthToken(null);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('🚀 AuthContext: Sending registration request to:', `${API_URL}/auth/register`);
      console.log('📤 AuthContext: Registration data:', userData);
      console.log('🔗 AuthContext: API_URL is:', API_URL);

      const response = await axios.post(`${API_URL}/auth/register`, userData);

      console.log('📥 AuthContext: Registration response:', response.data);

      if (response.data.success) {
        const { user, token } = response.data.data;

        setAuthToken(token);
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { user, token }
        });

        return { success: true, user };
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Registration failed. Please try again.';

      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        setAuthToken(token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        });

        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error:', error);

      const errorMessage = error.response?.data?.message ||
        'Login failed. Please check your credentials.';

      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout endpoint (optional, for logging purposes)
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and token
      setAuthToken(null);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`${API_URL}/auth/profile`, userData);

      if (response.data.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.data.user
        });

        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      console.error('Update profile error:', error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Failed to update profile. Please try again.';

      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`${API_URL}/auth/change-password`, passwordData);

      if (response.data.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Change password error:', error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Failed to change password. Please try again.';

      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return state.isAuthenticated && state.user;
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAdmin,
    isAuthenticated: isAuthenticated(),
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
