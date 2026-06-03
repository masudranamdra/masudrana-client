// Client-side authentication utilities
// All authentication is handled by the backend API
// This file provides helper functions for frontend authentication

export const auth = {
  // Helper to check if user is authenticated
  async getSession() {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  },
  
  // Helper to sign out
  async signOut() {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
      return true;
    } catch (error) {
      console.error('Failed to sign out:', error);
      return false;
    }
  },
};

export const getAuth = () => auth;
