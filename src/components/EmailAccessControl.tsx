'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isEmailAllowed } from '@/config/allowedEmails';

interface EmailAccessControlProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function EmailAccessControl({ 
  children, 
  fallbackMessage = "Access Restricted" 
}: EmailAccessControlProps) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const allowed = isEmailAllowed(user.email);
      setHasAccess(allowed);
    } else {
      setHasAccess(false);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a3080] to-[#1e2464] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a3080] to-[#1e2464] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/30">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-2">{fallbackMessage}</h1>
            <p className="text-gray-300 mb-4">
              Your email address is not authorized to access the hackathon dashboard.
            </p>
            <div className="text-sm text-gray-400 mb-6">
              Current email: <span className="text-blue-300">{user?.email || 'Not logged in'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              If you believe this is an error, please contact the team administrator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go to Homepage
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}