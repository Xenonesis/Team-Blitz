'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PasswordManager from '@/components/PasswordManager';

export default function AdminPanel() {
  const { user, isLoading: authLoading, token } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // Check if user is super admin - ONLY these two emails allowed
      const superAdminEmails = [
        'itisaddy7@gmail.com',
        'aayushtonk@02@gmail.com'
      ];
      
      if (superAdminEmails.includes(user.email?.toLowerCase())) {
        setIsAuthorized(true);
        fetchAllowedEmails();
      } else {
        router.push('/admin/login');
      }
    }
  }, [user, authLoading, router]);

  const fetchAllowedEmails = async () => {
    try {
      const response = await fetch('/api/admin/allowed-emails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAllowedEmails(data.allowedEmails);
        setBlockedEmails(data.blockedEmails || []);
      } else {
        console.error('Failed to fetch emails:', response.status);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail.trim() })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setBlockedEmails(data.blockedEmails || []);
        setNewEmail('');
        setMessage('Email added successfully!');
      } else {
        setMessage(data.error || 'Failed to add email');
      }
    } catch (error) {
      setMessage('Error adding email');
    }
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const removeEmail = async (email: string) => {
    if (!confirm(`Remove ${email} from allowed list?`)) return;

    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setBlockedEmails(data.blockedEmails || []);
        setMessage('Email removed successfully!');
      } else {
        setMessage(data.error || 'Failed to remove email');
      }
    } catch (error) {
      setMessage('Error removing email');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const blockEmail = async (email: string) => {
    if (!confirm(`Temporarily block ${email} from accessing the platform?`)) return;

    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, action: 'block' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setBlockedEmails(data.blockedEmails || []);
        setMessage('Email blocked successfully!');
      } else {
        setMessage(data.error || 'Failed to block email');
      }
    } catch (error) {
      setMessage('Error blocking email');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const unblockEmail = async (email: string) => {
    if (!confirm(`Unblock ${email} and restore their access?`)) return;

    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, action: 'unblock' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setBlockedEmails(data.blockedEmails || []);
        setMessage('Email unblocked successfully!');
      } else {
        setMessage(data.error || 'Failed to unblock email');
      }
    } catch (error) {
      setMessage('Error unblocking email');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage hackathon platform access</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-900 text-green-200' 
                : 'bg-red-900 text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Add Email Form */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Email</h2>
            <form onSubmit={addEmail} className="flex gap-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Adding...' : 'Add Email'}
              </button>
            </form>
          </div>

          {/* Email List */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Allowed Emails ({allowedEmails.length})
            </h2>
            
            {allowedEmails.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No allowed emails found</p>
            ) : (
              <div className="space-y-3">
                {allowedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <span className="text-white">{email}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => blockEmail(email)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Block
                      </button>
                      <button
                        onClick={() => removeEmail(email)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blocked Emails List */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Blocked Emails ({blockedEmails.length})
            </h2>
            
            {blockedEmails.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No blocked emails</p>
            ) : (
              <div className="space-y-3">
                {blockedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-red-900/20 border border-red-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-400">🚫</span>
                      <span className="text-white">{email}</span>
                      <span className="text-xs text-red-400 bg-red-900/50 px-2 py-1 rounded">BLOCKED</span>
                    </div>
                    <button
                      onClick={() => unblockEmail(email)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Management */}
          <div className="mt-6">
            <PasswordManager 
              allowedEmails={[...allowedEmails, 'admin@teamblitz.com', 'itisaddy7@gmail.com', 'aayushtonk@02@gmail.com']} 
              onPasswordUpdate={fetchAllowedEmails}
            />
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}