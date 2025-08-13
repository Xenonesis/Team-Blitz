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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter functions for search
  const filteredAllowedEmails = allowedEmails.filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllUsers = allUsers.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlockedEmails = blockedEmails.filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Role-based styling functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'from-purple-500 to-pink-500';
      case 'admin':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'SUPER ADMIN';
      case 'admin':
        return 'ADMIN';
      default:
        return 'USER';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 animate-pulse"></div>
          </div>
          <p className="mt-4 text-indigo-200 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl bg-white/5">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-indigo-200 opacity-80">You don't have permission to access this admin panel.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                        Admin Dashboard
                      </h1>
                      <p className="text-indigo-200 opacity-80 text-lg">Team Blitz Platform Management</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-indigo-200 opacity-60">Logged in as</p>
                    <p className="text-indigo-300 font-medium">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/10"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${message.includes('successfully')
                ? 'bg-green-500/10 border-green-500/20 text-green-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                <div className="flex items-center">
                  {message.includes('successfully') ? (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {message}
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 opacity-60 text-sm font-medium">Registered Users</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">{allUsers.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 opacity-60 text-sm font-medium">Allowed Emails</p>
                    <p className="text-3xl font-bold text-blue-400 mt-1">{allowedEmails.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 opacity-60 text-sm font-medium">Blocked Emails</p>
                    <p className="text-3xl font-bold text-red-400 mt-1">{blockedEmails.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 opacity-60 text-sm font-medium">Pending Invites</p>
                    <p className="text-3xl font-bold text-purple-400 mt-1">{allowedEmails.length - allUsers.filter(user => allowedEmails.includes(user.email)).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl bg-white/5 inline-flex">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'users', label: 'Users', icon: '👥' },
                  { id: 'blocked', label: 'Blocked', icon: '🚫' },
                  { id: 'passwords', label: 'Passwords', icon: '🔑' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-indigo-200 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            {(activeTab === 'overview' || activeTab === 'users' || activeTab === 'blocked') && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm transition-all duration-300"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Add Email Form */}
                <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">Add New Email</h2>
                  </div>
                  <form onSubmit={addEmail} className="flex gap-4">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        'Add Email'
                      )}
                    </button>
                  </form>
                </div>

                {/* Allowed Emails */}
                <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white">
                        Allowed Emails ({filteredAllowedEmails.length})
                      </h2>
                    </div>
                    <p className="text-sm text-indigo-200 opacity-60">
                      These emails can access the platform
                    </p>
                  </div>

                  {filteredAllowedEmails.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-indigo-200 opacity-80 mb-2">No allowed emails found</div>
                      <div className="text-sm text-indigo-200 opacity-50">
                        Add emails above to grant platform access
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAllowedEmails.map((email, index) => {
                        const isRegisteredUser = allUsers.some(user => user.email === email);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{email}</span>
                              {isRegisteredUser ? (
                                <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-medium">
                                  REGISTERED
                                </span>
                              ) : (
                                <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full font-medium">
                                  INVITED
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => blockEmail(email)}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Block
                              </button>
                              <button
                                onClick={() => removeEmail(email)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
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
              </div>
            )}

            {activeTab === 'users' && (
              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Registered Users ({filteredAllUsers.length})
                    </h2>
                  </div>
                  <p className="text-sm text-indigo-200 opacity-60">
                    Users who have created accounts
                  </p>
                </div>

                {filteredAllUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="text-indigo-200 opacity-80 mb-2">No registered users found</div>
                    <div className="text-sm text-indigo-200 opacity-50">
                      Users will appear here after they register
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAllUsers.map((user, index) => {
                      const isAllowed = allowedEmails.includes(user.email);
                      const isBlocked = blockedEmails.includes(user.email);

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white text-sm font-medium`}>
                              {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{user.email}</span>
                              <span className="text-indigo-200 text-sm opacity-70">{user.username}</span>
                            </div>
                            <span className={`text-xs bg-gradient-to-r ${getRoleColor(user.role)} text-white px-3 py-1 rounded-full font-medium`}>
                              {getRoleLabel(user.role)}
                            </span>
                            {isAllowed && (
                              <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-medium">
                                ALLOWED
                              </span>
                            )}
                            {isBlocked && (
                              <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium">
                                BLOCKED
                              </span>
                            )}
                            {!isAllowed && !isBlocked && (
                              <span className="text-xs bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 rounded-full font-medium">
                                NO ACCESS
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!isAllowed && !isBlocked && (
                              <button
                                onClick={() => grantAccess(user.email)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Grant Access
                              </button>
                            )}
                            {isAllowed && user.role !== 'super_admin' && (
                              <button
                                onClick={() => blockEmail(user.email)}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Block
                              </button>
                            )}
                            {isBlocked && (
                              <button
                                onClick={() => unblockEmail(user.email)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
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
            )}

            {activeTab === 'blocked' && (
              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Blocked Emails ({filteredBlockedEmails.length})
                    </h2>
                  </div>
                  <p className="text-sm text-indigo-200 opacity-60">
                    Emails that are temporarily blocked
                  </p>
                </div>

                {filteredBlockedEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-indigo-200 opacity-80 mb-2">No blocked emails</div>
                    <div className="text-sm text-indigo-200 opacity-50">
                      Blocked emails will appear here
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBlockedEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-sm font-medium">
                            🚫
                          </div>
                          <span className="text-white font-medium">{email}</span>
                          <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium">
                            BLOCKED
                          </span>
                        </div>
                        <button
                          onClick={() => unblockEmail(email)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'passwords' && (
              <div className="backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl bg-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Password Management</h2>
                </div>

                {allUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                    <p className="text-indigo-200 opacity-80">Loading users from database...</p>
                  </div>
                ) : (
                  <PasswordManager
                    allowedEmails={allUsers.map(user => user.email).filter(email => email)}
                    onPasswordUpdate={() => {
                      fetchAllowedEmails();
                      fetchAllUsers();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}