'use client';

import React, { useState } from 'react';

import { Hackathon } from '@/types/hackathon';

interface HackathonDateDetailsProps {
  hackathon: Hackathon;
  formatDateTime: (date: string) => string;
  daysRemaining: (date: string) => number;
  onUpdate?: (updatedHackathon: Hackathon) => void;
}

const HackathonDateDetails: React.FC<HackathonDateDetailsProps> = ({ 
  hackathon, 
  formatDateTime,
  daysRemaining,
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    startDate: hackathon.startDate,
    endDate: hackathon.endDate,
    technologies: hackathon.technologies || '',
    prize: hackathon.prize || '',
    totalTasks: hackathon.totalTasks || 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the payload
      const payload = {
        id: hackathon.id,
        name: hackathon.name,
        description: hackathon.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leader: hackathon.leader,
        participants: hackathon.participants,
        location: hackathon.location || 'Remote',
        technologies: formData.technologies,
        prize: formData.prize,
        totalTasks: Number(formData.totalTasks),
        website: hackathon.website || '',
        currentStage: hackathon.currentStage,
        status: hackathon.status
      };

      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update hackathon');
      }

      onUpdate?.(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating hackathon:', error);
      alert(error instanceof Error ? error.message : 'Failed to update hackathon');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Event Timeline */}
      <div className="bg-gray-900/30 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-blue-300 mb-2">Event Timeline</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Start:</span>
            <span className="font-medium">{formatDateTime(hackathon.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">End:</span>
            <span className="font-medium">{formatDateTime(hackathon.endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration:</span>
            <span className="font-medium">
              {daysRemaining(hackathon.endDate) > 0 
                ? `${daysRemaining(hackathon.endDate)} days remaining` 
                : 'Completed'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Participants */}
      <div className="bg-gray-900/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-blue-300">Participants</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Details'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                title="Start Date"
                aria-label="Start Date"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                title="End Date"
                aria-label="End Date"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Prize</label>
              <input
                type="text"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                placeholder="$50,000"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Total Tasks</label>
              <input
                type="number"
                name="totalTasks"
                value={formData.totalTasks}
                onChange={handleInputChange}
                min="0"
                title="Total Tasks"
                placeholder="Enter number of tasks"
                aria-label="Total Tasks"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hackathon.participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full"
              >
                <div className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-blue-300">
                    {participant.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm">{participant.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonDateDetails;