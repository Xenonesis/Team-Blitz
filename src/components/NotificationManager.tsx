'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationStatus {
  schedulerActive: boolean;
  totalHackathons: number;
  hackathons: Array<{
    hackathonId: string;
    name: string;
    status: string;
    currentStage: string;
    totalParticipants: number;
    uniqueEmailCount: number;
    roundDates: { [key: string]: string };
    endDate: string;
  }>;
  scheduleInfo: {
    dailyUpdate: string;
    eveningReminder: string;
    timezone: string;
  };
}

const NotificationManager: React.FC = () => {
  const { token } = useAuth();
  const [status, setStatus] = useState<NotificationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendResult, setSendResult] = useState<string>('');
  const [schedulerStatus, setSchedulerStatus] = useState<any>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [cleanupStatus, setCleanupStatus] = useState<any>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/notifications/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        console.error('Failed to fetch notification status');
      }
    } catch (error) {
      console.error('Error fetching notification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendManualNotification = async () => {
    setLoading(true);
    setSendResult('');

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSendResult(`✅ Notifications sent successfully! Sent: ${result.totalSent}, Failed: ${result.totalFailed}`);
      } else {
        setSendResult(`❌ Failed to send notifications: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending manual notification:', error);
      setSendResult('❌ Error sending notifications');
    } finally {
      setLoading(false);
    }
  };

  const initializeScheduler = async () => {
    setInitLoading(true);

    try {
      const response = await fetch('/api/scheduler/init', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setSchedulerStatus(result);

      if (response.ok) {
        setSendResult(`✅ Scheduler initialized successfully!`);
      } else {
        setSendResult(`❌ Failed to initialize scheduler: ${result.error}`);
      }
    } catch (error) {
      console.error('Error initializing scheduler:', error);
      setSendResult('❌ Error initializing scheduler');
    } finally {
      setInitLoading(false);
    }
  };

  const fetchSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/scheduler/init', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSchedulerStatus(result);
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    }
  };

  const fetchCleanupStatus = async () => {
    try {
      const response = await fetch('/api/cleanup/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCleanupStatus(result);
      }
    } catch (error) {
      console.error('Error fetching cleanup status:', error);
    }
  };

  const triggerManualCleanup = async () => {
    setCleanupLoading(true);

    try {
      const response = await fetch('/api/cleanup/manual', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSendResult(`✅ Cleanup completed! Deleted: ${result.deletedCount} hackathons`);
        // Refresh cleanup status
        await fetchCleanupStatus();
      } else {
        setSendResult(`❌ Cleanup failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error triggering cleanup:', error);
      setSendResult('❌ Error triggering cleanup');
    } finally {
      setCleanupLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchSchedulerStatus();
    fetchCleanupStatus();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-400 mb-2">❌ Notification System Error</h3>
        <p className="text-gray-300">Failed to load notification status</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-300 mb-4">📧 Email Notification System</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {status.schedulerActive ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-300">Scheduler Status</div>
            <div className="text-xs text-green-400">
              {status.schedulerActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{status.totalHackathons}</div>
            <div className="text-sm text-gray-300">Active Hackathons</div>
          </div>
          
          <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {status.hackathons.reduce((sum, h) => sum + h.uniqueEmailCount, 0)}
            </div>
            <div className="text-sm text-gray-300">Total Recipients</div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-200 mb-2">📅 Schedule Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-300">Daily Updates:</span>
              <span className="ml-2 text-gray-300">{status.scheduleInfo.dailyUpdate}</span>
            </div>
            <div>
              <span className="text-blue-300">Evening Reminders:</span>
              <span className="ml-2 text-gray-300">{status.scheduleInfo.eveningReminder}</span>
            </div>
            <div>
              <span className="text-red-300">Database Cleanup:</span>
              <span className="ml-2 text-gray-300">2:00 AM IST</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Timezone: {status.scheduleInfo.timezone} • All schedules run daily
          </div>
        </div>

        {/* Scheduler Controls */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-200 mb-3">🔧 Scheduler Controls</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={initializeScheduler}
              disabled={initLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
            >
              {initLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Initializing...
                </div>
              ) : (
                '🚀 Initialize Scheduler'
              )}
            </button>
            
            <button
              onClick={sendManualNotification}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                '📨 Send Manual Notification'
              )}
            </button>
            
            <button
              onClick={triggerManualCleanup}
              disabled={cleanupLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
            >
              {cleanupLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cleaning...
                </div>
              ) : (
                '🧹 Cleanup Expired'
              )}
            </button>
          </div>
          
          {schedulerStatus && (
            <div className="mt-3 text-sm">
              <span className="text-gray-300">Scheduler Status: </span>
              <span className={`font-medium ${
                schedulerStatus.initialized ? 'text-green-400' : 'text-red-400'
              }`}>
                {schedulerStatus.status}
              </span>
            </div>
          )}
        </div>

        {/* Cleanup Status */}
        {cleanupStatus && (
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-gray-200 mb-3">🧹 Database Cleanup Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-400">
                  {cleanupStatus.cleanupStats.expiredHackathonsCount}
                </div>
                <div className="text-xs text-gray-300">Expired Hackathons</div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-blue-400">
                  {cleanupStatus.cleanupStats.nextCleanupTime}
                </div>
                <div className="text-xs text-gray-300">Next Cleanup</div>
              </div>
              
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-green-400">
                  {cleanupStatus.systemInfo.currentTime.split(',')[1]}
                </div>
                <div className="text-xs text-gray-300">Current Time IST</div>
              </div>
            </div>
            
            {cleanupStatus.cleanupStats.expiredHackathons.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h5 className="text-sm font-bold text-orange-300 mb-2">Hackathons Ready for Cleanup:</h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {cleanupStatus.cleanupStats.expiredHackathons.map((hackathon: any, index: number) => (
                    <div key={index} className="text-xs text-gray-300 flex justify-between">
                      <span>{hackathon.name}</span>
                      <span className="text-orange-400">
                        Ended: {new Date(hackathon.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Messages */}
        {sendResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            sendResult.includes('❌') ? 'bg-red-900/20 border border-red-800' : 'bg-green-900/20 border border-green-800'
          }`}>
            <p className={sendResult.includes('❌') ? 'text-red-300' : 'text-green-300'}>
              {sendResult}
            </p>
          </div>
        )}
      </div>

      {/* Hackathon Details */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-200 mb-4">🏆 Hackathon Email Recipients</h4>
        
        {status.hackathons.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No active hackathons found</p>
        ) : (
          <div className="space-y-4">
            {status.hackathons.map((hackathon) => (
              <div key={hackathon.hackathonId} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-white">{hackathon.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    hackathon.status === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current Stage:</span>
                    <div className="text-blue-300 font-medium">{hackathon.currentStage}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Participants:</span>
                    <div className="text-green-300 font-medium">{hackathon.totalParticipants}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Email Recipients:</span>
                    <div className="text-purple-300 font-medium">{hackathon.uniqueEmailCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">End Date:</span>
                    <div className="text-orange-300 font-medium">
                      {new Date(hackathon.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
