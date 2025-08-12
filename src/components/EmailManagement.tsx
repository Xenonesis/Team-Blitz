'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailManagement() {
  const { token } = useAuth();
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    if (showManager) {
      fetchAllowedEmails();
    }
  }, [showManager]);

  const fetchAllowedEmails = async () => {
    try {
      const response = await fetch('/api/admin/allowed-emails', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllowedEmails(data.allowedEmails);
      }
    } catch (error) {
      console.error('Error fetching allowed emails:', error);
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setNewEmail('');
        setMessage('Email added successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to add email');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding email');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const removeEmail = async (email: string) => {
    if (!confirm(`Remove ${email} from allowed list?`)) return;

    try {
      const response = await fetch('/api/admin/allowed-emails', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAllowedEmails(data.allowedEmails);
        setMessage('Email removed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to remove email');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error removing email');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Email Access Management</h3>
        <button
          onClick={() => setShowManager(!showManager)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          {showManager ? 'Hide' : 'Manage Emails'}
        </button>
      </div>

      {showManager && (
        <div className="space-y-6">
          {/* Add Email Form */}
          <form onSubmit={addEmail} className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Adding...' : 'Add Email'}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('successfully') 
                ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                : 'bg-red-900/30 text-red-300 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* Allowed Emails List */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Allowed Emails ({allowedEmails.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allowedEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <span className="text-gray-300">{email}</span>
                  <button
                    onClick={() => removeEmail(email)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {allowedEmails.length === 0 && (
                <p className="text-gray-400 text-center py-4">No allowed emails found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}