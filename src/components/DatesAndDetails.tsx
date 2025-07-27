'use client';

import { ChangeEvent } from 'react';

interface DatesAndDetailsProps {
  newHackathon: {
    startDate: string;
    endDate: string;
    prize: string;
    technologies: string;
    totalTasks: number;
    roundDates: { [key: string]: string }; // Add roundDates object
  };
  handleHackathonChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRoundDateChange: (stageId: string, date: string) => void; // New handler for round dates
  hackathonStages: Array<{ id: string; name: string; description: string }>;
}

export const DatesAndDetails: React.FC<DatesAndDetailsProps> = ({ 
  newHackathon, 
  handleHackathonChange,
  handleRoundDateChange,
  hackathonStages
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Start Date*</label>
          <input
            type="date"
            name="startDate"
            value={newHackathon.startDate}
            onChange={handleHackathonChange}
            required
            title="Start Date"
            placeholder="Select start date"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Start Date"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">End Date*</label>
          <input
            type="date"
            name="endDate"
            value={newHackathon.endDate}
            onChange={handleHackathonChange}
            required
            title="End Date"
            placeholder="Select end date"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="End Date"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Prize*</label>
        <input
          type="text"
          name="prize"
          value={newHackathon.prize}
          onChange={handleHackathonChange}
          required
          title="Prize Amount"
          placeholder="$50,000"
          aria-label="Prize Amount"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-1">Technologies*</label>
        <input
          type="text"
          name="technologies"
          value={newHackathon.technologies}
          onChange={handleHackathonChange}
          required
          title="Required Technologies"
          placeholder="React, Node.js, MongoDB"
          aria-label="Required Technologies"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-1">Total Tasks*</label>
        <input
          type="number"
          name="totalTasks"
          value={newHackathon.totalTasks}
          onChange={handleHackathonChange}
          required
          min="1"
          title="Total Number of Tasks"
          placeholder="Enter total number of tasks"
          aria-label="Total Number of Tasks"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Round Dates Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-blue-300 mb-3">Round Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathonStages.map(stage => (
            <div key={stage.id}>
              <label className="block text-sm text-gray-300 mb-1">
                {stage.name} Date*
              </label>
              <input
                type="date"
                value={newHackathon.roundDates[stage.id] || ''}
                onChange={(e) => handleRoundDateChange(stage.id, e.target.value)}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${stage.name} Date`}
              />
              <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};