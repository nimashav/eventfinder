// Example of how multi-session authentication COULD work
// (This is just an example - not implemented)

const multiSessionState = {
  sessions: {
    admin: {
      user: { id: 1, role: 'admin', email: 'admin@example.com' },
      token: 'admin_jwt_token',
      isActive: true
    },
    user: {
      user: { id: 2, role: 'user', email: 'user@example.com' },
      token: 'user_jwt_token',
      isActive: false
    }
  },
  activeSession: 'admin' // Currently acting as admin
};

// Switch active session without logging out
const switchSession = (sessionKey) => {
  dispatch({ type: 'SWITCH_SESSION', payload: sessionKey });
};

// This would require:
// 1. Multiple token storage
// 2. Session switching UI
// 3. Complex state management
// 4. Potential security considerations
