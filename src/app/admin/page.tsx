'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PasswordManager from '@/components/PasswordManager';

export default function AdminPanel() {
  const { user, isLoading: authLoading, token, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // Check if user is super admin using the AuthContext
      if (isSuperAdmin) {
        setIsAuthorized(true);
        fetchAllowedEmails();
        fetchAllUsers();
      } else {
        router.push('/admin/login');
      }
    }
  }, [user, authLoading, router, isSuperAdmin]);

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

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users || []);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const grantAccess = async (email: string) => {
    if (!confirm(`Grant platform access to ${email}?`)) return;

    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'POST',
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
        setMessage('Access granted successfully!');
      } else {
        setMessage(data.error || 'Failed to grant access');
      }
    } catch (error) {
      setMessage('Error granting access');
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Allowed Emails ({allowedEmails.length})
              </h2>
              <div className="text-sm text-gray-400">
                These emails can access the platform
              </div>
            </div>
            
            {allowedEmails.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No allowed emails found</div>
                <div className="text-sm text-gray-500">
                  Add emails above to grant platform access
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {allowedEmails.map((email, index) => {
                  const isRegisteredUser = allUsers.includes(email);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white">{email}</span>
                        {isRegisteredUser && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                            REGISTERED
                          </span>
                        )}
                        {!isRegisteredUser && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            INVITED
                          </span>
                        )}
                      </div>
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
                  );
                })}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {allUsers.length}
                </div>
                <div className="text-gray-400">Registered Users</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {allowedEmails.length}
                </div>
                <div className="text-gray-400">Allowed Emails</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {blockedEmails.length}
                </div>
                <div className="text-gray-400">Blocked Emails</div>
              </div>
            </div>
          </div>

          {/* Registered Users */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Registered Users ({allUsers.length})
              </h2>
              <div className="text-sm text-gray-400">
                Users who have created accounts
              </div>
            </div>
            
            {allUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No registered users found</div>
                <div className="text-sm text-gray-500">
                  Users will appear here after they register
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {allUsers.map((email, index) => {
                  const isAllowed = allowedEmails.includes(email);
                  const isBlocked = blockedEmails.includes(email);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white">{email}</span>
                        {isAllowed && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                            ALLOWED
                          </span>
                        )}
                        {isBlocked && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                            BLOCKED
                          </span>
                        )}
                        {!isAllowed && !isBlocked && (
                          <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">
                            NO ACCESS
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isAllowed && !isBlocked && (
                          <button
                            onClick={() => grantAccess(email)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Grant Access
                          </button>
                        )}
                        {isAllowed && (
                          <button
                            onClick={() => blockEmail(email)}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Block
                          </button>
                        )}
                        {isBlocked && (
                          <button
                            onClick={() => unblockEmail(email)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blocked Emails List */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Blocked Emails ({blockedEmails.length})
              </h2>
              <div className="text-sm text-gray-400">
                Emails that are temporarily blocked
              </div>
            </div>
            
            {blockedEmails.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No blocked emails</div>
                <div className="text-sm text-gray-500">
                  Blocked emails will appear here
                </div>
              </div>
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
            {allUsers.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Password Management</h2>
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading users from database...</p>
                </div>
              </div>
            ) : (
              <PasswordManager 
                allowedEmails={allUsers} 
                onPasswordUpdate={() => {
                  fetchAllowedEmails();
                  fetchAllUsers();
                }}
              />
            )}
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