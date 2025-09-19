import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from "sonner";

const SupabaseAuthContext = createContext();

/**
 * @typedef {Object} SupabaseAuthProviderProps
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A provider for the Supabase authentication context.
 * @param {SupabaseAuthProviderProps} props - The props for the component.
 * @returns {JSX.Element}
 */
export const SupabaseAuthProvider = ({ children }) => {
  return (
    <SupabaseAuthProviderInner>
      {children}
    </SupabaseAuthProviderInner>
  );
}

/**
 * @typedef {Object} SupabaseAuthProviderInnerProps
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The inner provider for the Supabase authentication context.
 * @param {SupabaseAuthProviderInnerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
export const SupabaseAuthProviderInner = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          toast.error('Authentication error. Please try logging in again.');
        }
        setSession(session);
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication error. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      queryClient.invalidateQueries('user');
      
      if (event === 'SIGNED_OUT') {
        toast.info('You have been signed out');
      } else if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in');
      }
    });

    getSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  /**
   * Logs in a user with the given email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} A promise that resolves with the user's session data.
   */
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSession(data.session);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  /**
   * Logs out the current user.
   * @returns {Promise<void>} A promise that resolves when the user is logged out.
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      queryClient.invalidateQueries('user');
      setLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

/**
 * A hook for accessing the Supabase authentication context.
 * @returns {{session: object, loading: boolean, login: function, logout: function}} The Supabase authentication context.
 */
export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

/**
 * A component that displays the Supabase authentication UI.
 * @returns {JSX.Element}
 */
export const SupabaseAuthUI = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="default"
    providers={[]}
  />
);