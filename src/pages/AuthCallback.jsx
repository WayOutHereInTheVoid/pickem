import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

/**
 * A component that handles authentication callbacks from Supabase.
 * @returns {JSX.Element}
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { session, loading } = useSupabaseAuth();

  useEffect(() => {
    /**
     * Handles the authentication callback.
     */
    const handleAuthCallback = async () => {
      try {
        // Check URL for auth tokens
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const type = urlParams.get('type');

        if (type === 'recovery') {
          // Password reset flow
          toast.success('Password reset successful! You can now set a new password.');
          navigate('/manager');
        } else if (session) {
          // User is logged in, redirect to manager dashboard
          toast.success('Successfully authenticated!');
          navigate('/manager');
        } else if (!loading) {
          // No session and not loading, redirect to login
          navigate('/manager');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication error. Please try again.');
        navigate('/manager');
      }
    };

    // Wait a moment for session to be established
    const timer = setTimeout(handleAuthCallback, 1000);
    return () => clearTimeout(timer);
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">🔐 Authenticating...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            Processing your authentication request...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You'll be redirected shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;