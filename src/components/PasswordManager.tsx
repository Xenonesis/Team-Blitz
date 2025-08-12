'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PasswordManagerProps {
  allowedEmails: string[];
  onPasswordUpdate?: () => void;
}

export default function PasswordManager({ allowedEmails, onPasswordUpdate }: PasswordManagerProps) {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'own' | 'others'>('own');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Own password form
  const [ownPasswordForm, setOwnPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Other user password form
  const [otherPasswordForm, setOtherPasswordForm] = useState({
    targetEmail: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleOwnPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ownPasswordForm.newPassword !== ownPasswordForm.confirmPassword) {
      showMessage('New passwords do not match', true);
      return;
    }

    if (ownPasswordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters long', true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: ownPasswordForm.currentPassword,
          newPassword: ownPasswordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message);
        setOwnPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onPasswordUpdate?.();
      } else {
        showMessage(data.error || 'Failed to update password', true);
      }
    } catch (error) {
      showMessage('Error updating password', true);
    }
    setIsLoading(false);
  };

  const handleOtherPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otherPasswordForm.newPassword !== otherPasswordForm.confirmPassword) {
      showMessage('New passwords do not match', true);
      return;
    }

    if (otherPasswordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters long', true);
      return;
    }

    if (!otherPasswordForm.targetEmail) {
      showMessage('Please select a user', true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetEmail: otherPasswordForm.targetEmail,
          newPassword: otherPasswordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message);
        setOtherPasswordForm({ targetEmail: '', newPassword: '', confirmPassword: '' });
        onPasswordUpdate?.();
      } else {
        showMessage(data.error || 'Failed to update password', true);
      }
    } catch (error) {
      showMessage('Error updating password', true);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Password Management</h2>

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

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('own')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'own'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Update My Password
        </button>
        <button
          onClick={() => setActiveTab('others')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'others'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Update User Password
        </button>
      </div>

      {/* Own Password Tab */}
      {activeTab === 'own' && (
        <form onSubmit={handleOwnPasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={ownPasswordForm.currentPassword}
              onChange={(e) => setOwnPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={ownPasswordForm.newPassword}
              onChange={(e) => setOwnPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter new password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={ownPasswordForm.confirmPassword}
              onChange={(e) => setOwnPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update My Password'}
          </button>
        </form>
      )}

      {/* Other Users Password Tab */}
      {activeTab === 'others' && (
        <form onSubmit={handleOtherPasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select User
            </label>
            <select
              value={otherPasswordForm.targetEmail}
              onChange={(e) => setOtherPasswordForm(prev => ({ ...prev, targetEmail: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Choose a user to update password</option>
              {allowedEmails.filter(email => email !== user?.email).map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={otherPasswordForm.newPassword}
              onChange={(e) => setOtherPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter new password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={otherPasswordForm.confirmPassword}
              onChange={(e) => setOtherPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update User Password'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            ⚠️ This will update the password for the selected user without requiring their current password
          </p>
        </form>
      )}
    </div>
  );
}