
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StaffUser {
  id: string;
  name: string;
  role: string;
  email?: string;
  user_metadata?: any;
}

interface Session {
  token: string;
  expiresAt: string;
}

interface AuthState {
  user: StaffUser | null;
  session: Session | null;
}

const SESSION_KEY = 'staff_session';
const USER_KEY = 'staff_user';

export const useAuth = () => {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const loadStoredSession = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedSession = localStorage.getItem(SESSION_KEY);
        
        if (storedUser && storedSession) {
          const parsedUser = JSON.parse(storedUser);
          const parsedSession = JSON.parse(storedSession);
          
          // Check if session is still valid
          if (new Date(parsedSession.expiresAt) > new Date()) {
            setUser(parsedUser);
            setSession(parsedSession);
          } else {
            // Session expired, clear storage
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading stored session:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
      setIsLoading(false);
    };

    loadStoredSession();

    // Set up auto-logout timer
    const checkSessionValidity = () => {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          if (new Date(parsedSession.expiresAt) <= new Date()) {
            signOut();
          }
        } catch (error) {
          console.error('Error checking session validity:', error);
          signOut();
        }
      }
    };

    const interval = setInterval(checkSessionValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const signIn = async (pin: string) => {
    try {
      // Validate PIN format (exactly 4 digits)
      if (!/^\d{4}$/.test(pin)) {
        return { error: 'PIN must be exactly 4 digits' };
      }

      const { data, error } = await supabase.functions.invoke('pin-auth', {
        body: { pin }
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message || 'Authentication failed' };
      }

      if (data.success) {
        const userData = data.user;
        const sessionData = data.session;
        
        // Store in localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        
        // Update state
        setUser(userData);
        setSession(sessionData);
        
        return { error: null };
      }

      return { error: data.error || 'Authentication failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Authentication failed' };
    }
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    
    // Clear state
    setUser(null);
    setSession(null);
    
    return { error: null };
  };

  return {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!session,
    userProfile: user, // For compatibility with existing components
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isStaff: user?.role === 'staff'
  };
};
