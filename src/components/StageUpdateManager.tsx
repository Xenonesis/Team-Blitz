'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface StageUpdateStatus {
  totalHackathons: number;
  needsUpdate: number;
  upToDate: number;
  hackathons: Array<{
    id: string;
    name: string;
    currentStage: string;
    calculatedStage: string;
    isCorrect: boolean;
    roundDates: { [key: string]: string };
    status: string;
  }>;
  lastChecked: string;
}

interface UpdateResult {
  totalChecked: number;
  totalUpdated: number;
  duration: number;
  results: Array<{
    hackathonName: string;
    oldStage?: string;
    newStage?: string;
    currentStage?: string;
    updated: boolean;
    error?: string;
  }>;
  timestamp: string;
}

const StageUpdateManager: React.FC = () => {
  const { token, isAdmin, isSuperAdmin } = useAuth();
  const [status, setStatus] = useState<StageUpdateStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchStatus = async () => {
    if (!token) {
      console.log('No token available, skipping status fetch');
      return;
    }

    try {
      console.log('Fetching stage update status...');
      const response = await fetch('/api/stage-update/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        setStatus(data.data);
        console.log('Stage update status fetched successfully');
      } else {
        console.error('Failed to fetch stage update status:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error || data.message,
          data: data
        });
        // Set empty status to show no data available
        setStatus({
          totalHackathons: 0,
          needsUpdate: 0,
          upToDate: 0,
          hackathons: [],
          lastChecked: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Network error fetching stage update status:', error);
      // Set empty status on network error
      setStatus({
        totalHackathons: 0,
        needsUpdate: 0,
        upToDate: 0,
        hackathons: [],
        lastChecked: new Date().toISOString()
      });
    }
  };

  const triggerManualUpdate = async () => {
    if (!token) {
      console.error('No token available for manual update');
      return;
    }

    setUpdateLoading(true);
    setUpdateResult(null);
    
    try {
      console.log('Triggering manual stage update...');
      const response = await fetch('/api/stage-update/manual', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Manual update response status:', response.status);
      const data = await response.json();
      console.log('Manual update response data:', data);
      
      if (response.ok && data.success) {
        setUpdateResult(data.data);
        console.log('Manual update completed successfully');
        // Refresh status after successful update
        await fetchStatus();
      } else {
        console.error('Manual update failed:', {
          status: response.status,
          error: data.error || data.message,
          data: data
        });
        setUpdateResult({
          totalChecked: 0,
          totalUpdated: 0,
          duration: 0,
          results: [{ hackathonName: 'Error', updated: false, error: data.error || data.message || 'Update failed' }],
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Network error triggering manual update:', error);
      setUpdateResult({
        totalChecked: 0,
        totalUpdated: 0,
        duration: 0,
        results: [{ hackathonName: 'Error', updated: false, error: `Network error: ${error instanceof Error ? error.message : String(error)}` }],
        timestamp: new Date().toISOString()
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      fetchStatus();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [token, isAdmin, isSuperAdmin]);

  // Don't render for non-admin users
  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStageColor = (stage: string) => {
    const colors = {
      ppt: 'bg-blue-100 text-blue-800',
      round1: 'bg-green-100 text-green-800',
      round2: 'bg-yellow-100 text-yellow-800',
      semifinal: 'bg-orange-100 text-orange-800',
      final: 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            🔄 Stage Update Manager
          </h2>
          <p className="text-gray-600 mt-1">
            Automatically updates hackathon stages based on round dates (runs every 6 hours)
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Status Overview */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{status.totalHackathons}</div>
            <div className="text-sm text-blue-700">Total Active Hackathons</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{status.upToDate}</div>
            <div className="text-sm text-green-700">Stages Up to Date</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{status.needsUpdate}</div>
            <div className="text-sm text-orange-700">Need Stage Updates</div>
          </div>
        </div>
      )}

      {/* Manual Update Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Manual Stage Update</h3>
            <p className="text-sm text-gray-600">
              Trigger an immediate stage update for all hackathons
            </p>
          </div>
          <button
            onClick={triggerManualUpdate}
            disabled={updateLoading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              '🔄 Update Stages Now'
            )}
          </button>
        </div>

        {/* Update Results */}
        {updateResult && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Update Results</h4>
              <span className="text-sm text-gray-500">
                {formatDate(updateResult.timestamp)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{updateResult.totalChecked}</div>
                <div className="text-xs text-gray-600">Checked</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{updateResult.totalUpdated}</div>
                <div className="text-xs text-gray-600">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">{updateResult.duration}ms</div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
            </div>
            
            {updateResult.results.length > 0 && (
              <div className="max-h-40 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700 mb-2">Details:</div>
                {updateResult.results.map((result, index) => (
                  <div key={index} className="text-sm py-1 flex items-center justify-between">
                    <span className="font-medium">{result.hackathonName}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.updated 
                        ? 'bg-green-100 text-green-800' 
                        : result.error 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.updated 
                        ? `${result.oldStage} → ${result.newStage}`
                        : result.error 
                          ? result.error
                          : `${result.currentStage} (no change)`
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hackathon Stage Status */}
      {status && status.hackathons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hackathon Stage Status</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hackathon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calculated Stage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Round
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {status.hackathons.map((hackathon) => {
                  const nextRoundDate = Object.entries(hackathon.roundDates || {})
                    .find(([key, date]) => new Date(date) > new Date());
                  
                  return (
                    <tr key={hackathon.id} className={hackathon.isCorrect ? '' : 'bg-orange-50'}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hackathon.name}</div>
                        <div className="text-sm text-gray-500">{hackathon.status}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(hackathon.currentStage)}`}>
                          {hackathon.currentStage}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(hackathon.calculatedStage)}`}>
                          {hackathon.calculatedStage}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hackathon.isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hackathon.isCorrect ? '✓ Up to date' : '⚠ Needs update'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nextRoundDate ? (
                          <div>
                            <div className="font-medium">{nextRoundDate[0]}</div>
                            <div className="text-xs">{formatDate(nextRoundDate[1])}</div>
                          </div>
                        ) : (
                          'No upcoming rounds'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Last Checked Info */}
      {status && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Last checked: {formatDate(status.lastChecked)} | Auto-refresh every 30 seconds
        </div>
      )}
    </div>
  );
};

export default StageUpdateManager;
