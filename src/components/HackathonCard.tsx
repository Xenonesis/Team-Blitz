import React from 'react';
import { Hackathon } from '@/types/hackathon';

interface HackathonCardProps {
  hackathon: Hackathon;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => Promise<void>;
  formatDate: (date: string) => string;
  getStatusBadge: (status: string) => string;
  hackathonStages: Array<{ id: string; name: string; description: string; }>;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  isSelected,
  onSelect,
  onDelete,
  formatDate,
  getStatusBadge,
  hackathonStages
}) => {
  const progressPercent = Math.round(
    (hackathon.progress.completedTasks / hackathon.progress.totalTasks) * 100
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    if (hackathon.status !== 'completed') {
      alert('Only completed hackathons can be deleted');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      try {
        await onDelete(hackathon.id);
      } catch (error) {
        alert('Failed to delete hackathon. Please try again.');
      }
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 
        cursor-pointer hover:scale-[1.03] ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
          : 'border-gray-700 hover:border-blue-400'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <span className="font-bold text-blue-300">{hackathon.leader.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{hackathon.leader.name}</h3>
            <p className="text-xs text-blue-300">{hackathon.leader.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(hackathon.status)}`}>
            {hackathon.status}
          </span>
          
          {hackathon.status === 'completed' && (
            <button
              onClick={handleDelete}
              title="Delete hackathon"
              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <h4 className="font-bold text-lg mb-2 truncate">{hackathon.name}</h4>
      
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">Stage:</span>
        <span className="font-medium text-blue-300">
          {hackathonStages.find(s => s.id === hackathon.currentStage)?.name}
        </span>
      </div>
      
      <div className="flex justify-between text-sm mb-3">
        <span className="text-gray-400">Progress:</span>
        <span className="font-medium">{progressPercent}%</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-400 flex justify-between">
        <span>{formatDate(hackathon.startDate)}</span>
        <span>{formatDate(hackathon.endDate)}</span>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {hackathon.participants.length} participant{hackathon.participants.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};