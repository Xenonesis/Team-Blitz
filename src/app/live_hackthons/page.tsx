"use client";

import { useState, useEffect, useCallback } from 'react';
import { Member, Hackathon } from '@/types/hackathon';
import FAQ from "@/components/FAQ";
import { AnimatedElement, ScrollProgress, ParticleBackground } from "@/utils/animations";
import Navbar from "@/components/Navbar";
import { DatesAndDetails } from "@/components/DatesAndDetails";
import HackathonDateDetails from '@/components/HackathonDateDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import NotificationManager from '@/components/NotificationManager';
import StageUpdateManager from '@/components/StageUpdateManager';
import EmailAccessControl from '@/components/EmailAccessControl';
import EmailManagement from '@/components/EmailManagement';
import UserManagement from '@/components/UserManagement';

// Constants
const initialTeamMembers = [
  { id: 'member1', name: 'Aayush Tonk', role: 'TeamBlitz Backend Developer', email: 'aayushtonk02@gmail.com', skills: 'System Architect, Backend Developer' },
  { id: 'member2', name: 'Aditya Tiwari', role: 'TeamBlitz CEO & Cybersecurity mentor', email: 'itisaddy7@gmail.com', skills: 'Cybersecurity, Full Stack Development , DevOps' },
  { id: 'member3', name: 'Ashwini Jaiswal', role: 'TeamBlitz UI/UX designer', email: 'ashwinisj2005@gmail.com', skills: 'UI/UX Designer , Frontend Developer' },
  { id: 'member4', name: 'Prachi Upadhyay', role: 'Team-Follow Up', email: 'officialprachi1211@gmail.com', skills: 'AI/ML Engineer , Data Scientist' },
  { id: 'member5', name: 'Muneer Ali', role: 'TeamBlitz Senior Developer', email: 'alimuneerali245@gmail.com', skills: 'Full Stack Developer , AI/ML Engineer' },
  { id: 'member6', name: 'Mohammad Ehshan', role: 'TeamBlitz Junior Developer', email: 'ashmes16@gmail.com', skills: 'Frontend Developer , React.js' },
  { id: 'member7', name: 'Vishupal Goyal', role: 'TeamBlitz Junior Developer', email: 'jordan@team.com', skills: 'Frontend Developer ' },
  { id: 'member8', name: 'Swati Mishra', role: 'TeamBlitz DSA Instructor', email: ' swati01mishra01@gmail.com', skills: 'Frontend Developer , DSA Expert' },
];

const hackathonStages = [
  { id: 'ppt', name: 'PPT Round', description: 'Initial presentation of project idea' },
  { id: 'round1', name: 'Round 1', description: 'Prototype development phase' },
  { id: 'round2', name: 'Round 2', description: 'Feature implementation' },
  { id: 'semifinal', name: 'Semifinal', description: 'Advanced development & testing' },
  { id: 'final', name: 'Final', description: 'Demo presentation to judges' }
];

// Enhanced UI Components
interface HackathonCardProps {
  hackathon: Hackathon;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
  getStatusBadge: (status: string) => string;
}

const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  formatDate,
  getStatusBadge
}) => {
  const progressPercent = Math.round(
    hackathon.progress && hackathon.progress.totalTasks > 0 
      ? (hackathon.progress.completedTasks / hackathon.progress.totalTasks) * 100
      : 0
  );

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-button')) {
      return; // Don't select card if clicking action buttons
    }
    onSelect();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-500 
        cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${isSelected
          ? 'border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30'
          : 'border-gray-700/50 hover:border-blue-400/50'
        }`}
    >
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="action-button p-2 bg-blue-600/80 hover:bg-blue-500 rounded-lg transition-colors"
          title="Edit Hackathon"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="action-button p-2 bg-red-600/80 hover:bg-red-500 rounded-lg transition-colors"
          title="Delete Hackathon"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
              <span className="font-bold text-white text-lg">{hackathon.leader?.name?.charAt(0) || 'N'}</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
              hackathon.status === 'active' ? 'bg-green-500' : 
              hackathon.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{hackathon.leader?.name || 'No Leader'}</h3>
            <p className="text-sm text-blue-300">{hackathon.leader?.role || ''}</p>
          </div>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(hackathon.status)}`}>
          {hackathon.status.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-bold text-xl mb-3 text-white leading-tight">{hackathon.name}</h4>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{hackathon.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Current Stage</div>
          <div className="font-medium text-blue-300 text-sm">
            {hackathonStages.find(s => s.id === hackathon.currentStage)?.name || 'Not Started'}
          </div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Progress</div>
          <div className="font-medium text-green-300 text-sm">{progressPercent}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Tasks: {hackathon.progress.completedTasks}/{hackathon.progress.totalTasks}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>Start: {formatDate(hackathon.startDate)}</span>
        <span>End: {formatDate(hackathon.endDate)}</span>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {hackathon.participants.slice(0, 3).map((participant, index) => (
            <div
              key={participant.id}
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-gray-800 text-xs font-bold text-white"
              title={participant.name}
            >
              {participant.name.charAt(0)}
            </div>
          ))}
          {hackathon.participants.length > 3 && (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-800 text-xs font-bold text-white">
              +{hackathon.participants.length - 3}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {hackathon.participants.length} member{hackathon.participants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Prize Badge */}
      {hackathon.prize && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          {hackathon.prize}
        </div>
      )}
    </div>
  );
};

// Types
type HackathonState = Omit<Hackathon, 'id' | 'currentStage' | 'progress'> & {
  leader: Member | null;
  participants: Member[];
  totalTasks: number;
  roundDates: { [key: string]: string };
};

export default function Page() {
  // Auth context
  const { token } = useAuth();

  // State declarations
  const [activeSection, setActiveSection] = useState("progress");
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [teamMembers] = useState<Member[]>(initialTeamMembers);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [showNewHackathonForm, setShowNewHackathonForm] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form states
  const [newHackathon, setNewHackathon] = useState<HackathonState>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    leader: initialTeamMembers[0],
    participants: [],
    location: '',
    website: '',
    prize: '',
    technologies: '',
    totalTasks: 10,
    status: 'upcoming',
    roundDates: {},
  });

  // Enhanced notification system
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Effects
  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/hackathons', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch hackathons');
        }
        const data = await response.json();
        setHackathons(data);
        if (data && data.length > 0) {
          setSelectedHackathon(data[0]);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        showNotification('error', 'Failed to load hackathons. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, [token, showNotification]);

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const progressSection = document.getElementById('progress');
      const faqSection = document.getElementById('faq');

      if (progressSection && faqSection) {
        const progressTop = progressSection.offsetTop;
        const faqTop = faqSection.offsetTop;

        if (window.scrollY + 200 >= faqTop) {
          setActiveSection("faq");
        } else if (window.scrollY + 200 >= progressTop) {
          setActiveSection("progress");
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  };

  const daysRemaining = (endDate: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0;
    const diff = end.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  // Event handlers
  const handleHackathonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHackathon(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantSelection = (memberId: string, isSelected: boolean) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    setNewHackathon(prev => ({
      ...prev,
      participants: isSelected
        ? [...prev.participants, member]
        : prev.participants.filter(p => p.id !== memberId)
    }));
  };

  const handleRoundDateChange = (stageId: string, date: string) => {
    setNewHackathon(prev => ({
      ...prev,
      roundDates: {
        ...prev.roundDates,
        [stageId]: date
      }
    }));
  };

  const handleLeaderSelection = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    setNewHackathon(prev => ({
      ...prev,
      leader: member,
      participants: prev.participants.some(p => p.id === memberId)
        ? prev.participants
        : [...prev.participants, member]
    }));
  };

  const handleHackathonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEditing = !!editingHackathon;
      const hackathonId = isEditing ? editingHackathon.id : `hack_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

      const hackathonData: Hackathon = {
        id: hackathonId,
        name: newHackathon.name,
        description: newHackathon.description,
        leader: newHackathon.leader || teamMembers[0],
        currentStage: isEditing ? editingHackathon.currentStage : 'ppt',
        progress: isEditing ? editingHackathon.progress : { completedTasks: 0, totalTasks: newHackathon.totalTasks },
        startDate: newHackathon.startDate,
        endDate: newHackathon.endDate,
        participants: newHackathon.participants,
        status: new Date(newHackathon.startDate) > new Date() ? 'upcoming' : 'active',
        location: newHackathon.location,
        website: newHackathon.website,
        prize: newHackathon.prize,
        technologies: newHackathon.technologies,
        totalTasks: newHackathon.totalTasks,
        roundDates: newHackathon.roundDates
      };

      const url = isEditing ? `/api/hackathons/${hackathonId}` : '/api/hackathons';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(hackathonData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} hackathon`);
      }

      const savedHackathon = await response.json();
      
      if (isEditing) {
        setHackathons(prev => prev.map(h => h.id === savedHackathon.id ? savedHackathon : h));
        setSelectedHackathon(savedHackathon);
        showNotification('success', 'Hackathon updated successfully!');
      } else {
        setHackathons(prev => [...prev, savedHackathon]);
        showNotification('success', 'Hackathon created successfully!');
      }

      // Reset form
      setNewHackathon({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        leader: initialTeamMembers[0],
        participants: [],
        location: '',
        website: '',
        prize: '',
        technologies: '',
        totalTasks: 10,
        status: 'upcoming',
        roundDates: {}
      });

      setShowNewHackathonForm(false);
      setEditingHackathon(null);
    } catch (error) {
      console.error('Error saving hackathon:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to save hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHackathon = (hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setNewHackathon({
      name: hackathon.name,
      description: hackathon.description,
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
      leader: hackathon.leader,
      participants: hackathon.participants,
      location: hackathon.location,
      website: hackathon.website,
      prize: hackathon.prize,
      technologies: hackathon.technologies,
      totalTasks: hackathon.totalTasks,
      status: hackathon.status,
      roundDates: hackathon.roundDates || {}
    });
    setShowNewHackathonForm(true);
  };

  const handleDeleteHackathon = async (hackathon: Hackathon) => {
    if (!confirm(`Are you sure you want to delete "${hackathon.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/hackathons?id=${hackathon.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete hackathon');
      }

      setHackathons(prev => prev.filter(h => h.id !== hackathon.id));
      if (selectedHackathon?.id === hackathon.id) {
        setSelectedHackathon(hackathons.find(h => h.id !== hackathon.id) || null);
      }
      showNotification('success', 'Hackathon deleted successfully!');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to delete hackathon');
    }
  };

  // Calculate derived values
  const currentStageIndex = selectedHackathon
    ? hackathonStages.findIndex(stage => stage.id === selectedHackathon.currentStage)
    : 0;

  const progressPercentage = selectedHackathon && selectedHackathon.progress.totalTasks > 0
    ? (selectedHackathon.progress.completedTasks / selectedHackathon.progress.totalTasks) * 100
    : 0; 
 // Render
  return (
    <ProtectedRoute>
      <EmailAccessControl fallbackMessage="Hackathon Dashboard Access Restricted">
        <div className="min-h-screen text-white transition-colors duration-500">
          <ParticleBackground />
          <ScrollProgress />
          <Navbar activeSection={activeSection} />

          <main className="flex-1 bg-gradient-to-b from-[#2a3080] to-[#1e2464] py-20">
            <div className="container mx-auto px-4">
              <div id="progress" className="max-w-6xl mx-auto px-6">
                <AnimatedElement animation="fade-in" duration={1000}>
                  <h1 className="text-4xl mt-6 md:text-5xl font-bold mb-4 text-center">
                    Hackathon Progress Tracker
                  </h1>
                  <p className="text-xl text-center max-w-3xl mx-auto mb-12 text-blue-200">
                    Track our team's progress across multiple competitions
                  </p>
                </AnimatedElement>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <button
                    onClick={() => setShowNewHackathonForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    Create New Hackathon
                  </button>
                </div>

                {/* Progress Cards */}
                {!isLoading && selectedHackathon && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                      <h3 className="text-xl font-bold text-blue-300">Tasks Completed</h3>
                      <p className="text-2xl font-bold mt-2">
                        {selectedHackathon.progress.completedTasks}/{selectedHackathon.progress.totalTasks}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-300">Days Remaining</h3>
                      <p className="text-2xl font-bold mt-2">
                        {daysRemaining(selectedHackathon.endDate)}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-green-900/30 rounded-lg">
                      <h3 className="text-xl font-bold text-green-300">Overall Progress</h3>
                      <p className="text-2xl font-bold mt-2">
                        {Math.round(progressPercentage)}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Notification System */}
                {notification && (
                  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
                    notification.type === 'success' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    <div className="flex items-center">
                      {notification.type === 'success' ? (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span>{notification.message}</span>
                      <button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-white hover:text-gray-200"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Hackathon Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {!isLoading && hackathons
                    .filter((hackathon, index, self) =>
                      index === self.findIndex(h => h.id === hackathon.id)
                    )
                    .map((hackathon, index) => (
                      <HackathonCard
                        key={`${hackathon.id}_${index}`}
                        hackathon={hackathon}
                        isSelected={selectedHackathon?.id === hackathon.id}
                        onSelect={() => setSelectedHackathon(hackathon)}
                        onEdit={() => handleEditHackathon(hackathon)}
                        onDelete={() => handleDeleteHackathon(hackathon)}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                </div>

                {/* Empty State */}
                {!isLoading && hackathons.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-gray-800/30 rounded-2xl p-12 max-w-md mx-auto">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-300 mb-2">No Hackathons Yet</h3>
                      <p className="text-gray-400 mb-6">Get started by creating your first hackathon!</p>
                      <button
                        onClick={() => setShowNewHackathonForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Create Hackathon
                      </button>
                    </div>
                  </div>
                )}          
      {/* Selected Hackathon Details */}
                {selectedHackathon && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-16 border border-blue-500/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                      <div>
                        <div className="flex items-center mb-2">
                          <h2 className="text-3xl font-bold text-white mr-4">
                            {selectedHackathon.name}
                          </h2>
                          <span className={`text-sm px-2 py-1 rounded-full border ${getStatusBadge(selectedHackathon.status)}`}>
                            {selectedHackathon.status}
                          </span>
                        </div>

                        <p className="text-blue-200 mb-3">{selectedHackathon.description}</p>

                        <div className="flex items-center">
                          <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <span className="font-bold text-blue-300">
                              {selectedHackathon.leader?.name?.charAt(0) || 'N'}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-300">Led by </span>
                            <span className="font-medium">{selectedHackathon.leader?.name || 'No Leader Assigned'}</span>
                            <span className="text-gray-400 ml-2">{selectedHackathon.leader?.role || ''}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 bg-blue-900/30 px-4 py-2 rounded-lg">
                        <span className="text-blue-300">Current Stage: </span>
                        <span className="font-bold text-white">
                          {hackathonStages[currentStageIndex]?.name || 'Not Started'}
                        </span>
                      </div>
                    </div>

                    <HackathonDateDetails
                      hackathon={selectedHackathon}
                      formatDateTime={formatDateTime}
                      daysRemaining={daysRemaining}
                      onUpdate={(updatedHackathon) => {
                        setSelectedHackathon(updatedHackathon);
                        setHackathons(prev =>
                          prev.map(h => h.id === updatedHackathon.id ? updatedHackathon : h)
                        );
                      }}
                    />
                  </div>
                )}

                {/* Enhanced Stage Timeline */}
                {selectedHackathon && (
                  <div className="relative mt-16">
                    <div className="absolute left-4 md:left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2 z-0 rounded-full"></div>

                    <div className="space-y-12 relative z-10">
                      {hackathonStages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <div className="md:w-1/2 mb-4 md:mb-0">
                            <AnimatedElement animation="fade-in" duration={500} delay={index * 200}>
                              <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${selectedHackathon.currentStage === stage.id
                                ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]'
                                : index < currentStageIndex
                                  ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30'
                                  : 'bg-gray-800/30 border-gray-700'
                                }`}>
                                <div className="flex items-center mb-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${selectedHackathon.currentStage === stage.id
                                    ? 'bg-blue-500'
                                    : index < currentStageIndex
                                      ? 'bg-green-500'
                                      : 'bg-gray-600'
                                    }`}>
                                    <span className="text-white font-bold text-sm">{index + 1}</span>
                                  </div>
                                  <h3 className={`text-2xl font-bold ${selectedHackathon.currentStage === stage.id
                                    ? 'text-blue-300'
                                    : index < currentStageIndex
                                      ? 'text-green-300'
                                      : 'text-gray-400'
                                    }`}>
                                    {stage.name}
                                  </h3>
                                </div>
                                <p className="text-blue-100 mb-3">{stage.description}</p>
                                {selectedHackathon.currentStage === stage.id && (
                                  <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-400 animate-ping mr-2"></div>
                                    <span className="text-blue-300 font-medium">Current Stage</span>
                                  </div>
                                )}
                                {index < currentStageIndex && (
                                  <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-300 font-medium">Completed</span>
                                  </div>
                                )}
                              </div>
                            </AnimatedElement>
                          </div>

                          <div className="md:w-1/2 flex justify-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 ${selectedHackathon.currentStage === stage.id
                              ? 'border-blue-500 bg-gradient-to-br from-blue-900/50 to-purple-900/50 shadow-blue-500/30 scale-110'
                              : index < currentStageIndex
                                ? 'border-green-500 bg-gradient-to-br from-green-900/20 to-emerald-900/20'
                                : 'border-gray-600 bg-gray-800/30'
                              }`}>
                              {index < currentStageIndex ? (
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className={`text-2xl font-bold ${selectedHackathon.currentStage === stage.id
                                  ? 'text-blue-300'
                                  : 'text-gray-400'
                                  }`}>
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Section */}
              <section id="faq" className="max-w-4xl mx-auto mt-24 px-6">
                <FAQ />
              </section>
            </div>
          </main>

          {/* Email Notification System */}
          <section className="bg-gray-900/30 backdrop-blur-sm border-t border-gray-800 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <AnimatedElement animation="fade-in" duration={1000}>
                  <NotificationManager />
                </AnimatedElement>
                <AnimatedElement animation="fade-in" duration={1000} delay={200}>
                  <StageUpdateManager />
                </AnimatedElement>
                <AnimatedElement animation="fade-in" duration={1000} delay={400}>
                  <EmailManagement />
                </AnimatedElement>
                <AnimatedElement animation="fade-in" duration={1000} delay={600}>
                  <UserManagement />
                </AnimatedElement>
              </div>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  {new Date().getFullYear()} Team Blitz. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                    className="text-gray-400 hover:text-blue-300 text-sm transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Back to Top
                  </button>
                  <a href="#faq" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                    FAQ
                  </a>
                </div>
              </div>
            </div>
          </footer>        
  {/* Enhanced Hackathon Form Modal */}
          {showNewHackathonForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-[#1e2464] to-[#2a3080] rounded-2xl p-8 max-w-4xl w-full border border-blue-500/30 overflow-y-auto max-h-[90vh] shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {editingHackathon ? 'Edit Hackathon' : 'Create New Hackathon'}
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {editingHackathon ? 'Update hackathon details' : 'Set up a new hackathon competition'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewHackathonForm(false);
                      setEditingHackathon(null);
                      setNewHackathon({
                        name: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                        leader: initialTeamMembers[0],
                        participants: [],
                        location: '',
                        website: '',
                        prize: '',
                        technologies: '',
                        totalTasks: 10,
                        status: 'upcoming',
                        roundDates: {}
                      });
                    }}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleHackathonSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Hackathon Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={newHackathon.name}
                          onChange={handleHackathonChange}
                          required
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tech Innovators 2024"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location*</label>
                        <input
                          type="text"
                          name="location"
                          value={newHackathon.location}
                          onChange={handleHackathonChange}
                          required
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="San Francisco, CA"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description*</label>
                        <textarea
                          name="description"
                          value={newHackathon.description}
                          onChange={handleHackathonChange}
                          required
                          rows={3}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Brief description of the hackathon..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={newHackathon.website}
                          onChange={handleHackathonChange}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Prize</label>
                        <input
                          type="text"
                          name="prize"
                          value={newHackathon.prize}
                          onChange={handleHackathonChange}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="$50,000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates & Details Section */}
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Dates & Details
                    </h3>
                    <DatesAndDetails
                      newHackathon={newHackathon}
                      handleHackathonChange={handleHackathonChange}
                      handleRoundDateChange={handleRoundDateChange}
                      hackathonStages={hackathonStages}
                    />
                  </div>

                  {/* Team Selection Section */}
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Team Selection
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Leader Selection */}
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-blue-300 mb-3">Select Leader*</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {teamMembers.map(member => (
                            <div
                              key={member.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                newHackathon.leader?.id === member.id
                                  ? 'bg-blue-600/30 border border-blue-500'
                                  : 'bg-gray-600/30 hover:bg-gray-600/50'
                              }`}
                              onClick={() => handleLeaderSelection(member.id)}
                            >
                              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                <span className="font-bold text-white text-sm">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-white">{member.name}</h5>
                                <p className="text-sm text-blue-300">{member.role}</p>
                                <p className="text-xs text-gray-400">{member.email}</p>
                              </div>
                              {newHackathon.leader?.id === member.id && (
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Participants Selection */}
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3">Select Participants*</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {teamMembers.map(member => (
                            <div
                              key={member.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                newHackathon.participants.some(p => p.id === member.id)
                                  ? 'bg-purple-600/30 border border-purple-500'
                                  : 'bg-gray-600/30 hover:bg-gray-600/50'
                              }`}
                              onClick={() => handleParticipantSelection(
                                member.id,
                                !newHackathon.participants.some(p => p.id === member.id)
                              )}
                            >
                              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                <span className="font-bold text-white text-sm">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-white">{member.name}</h5>
                                <p className="text-sm text-purple-300">{member.role}</p>
                                <p className="text-xs text-gray-400">{member.skills}</p>
                              </div>
                              {newHackathon.participants.some(p => p.id === member.id) && (
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selected Team Summary */}
                    <div className="mt-6 p-4 bg-gray-700/20 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Selected Team Summary</h4>
                      <div className="flex flex-wrap gap-2">
                        {newHackathon.leader && (
                          <div className="bg-blue-600/20 border border-blue-500/50 px-3 py-1 rounded-full flex items-center">
                            <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                            </svg>
                            <span className="text-blue-300 text-sm">Leader: {newHackathon.leader.name}</span>
                          </div>
                        )}
                        {newHackathon.participants.map(participant => (
                          <div key={participant.id} className="bg-purple-600/20 border border-purple-500/50 px-3 py-1 rounded-full flex items-center">
                            <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-purple-300 text-sm">{participant.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewHackathonForm(false);
                        setEditingHackathon(null);
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingHackathon ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {editingHackathon ? 'Update Hackathon' : 'Create Hackathon'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </EmailAccessControl>
    </ProtectedRoute>
  );
}