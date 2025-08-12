"use client";

import { useState, useEffect } from 'react';
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

// Constants
const initialTeamMembers = [
  { id: 'member1', name: 'Aayush Tonk', role: 'TeamBltiz Founder', email: 'aayushtonk@02@gmail.com', skills: 'System Architect, Backend Developer' },
  { id: 'member2', name: 'Aditya Tiwari', role: 'TeamBltiz CEO & CO-Founder', email: 'itisaddy7@gmail.com', skills: 'Cybersecurity, Full Stack Development , DevOps' },
  { id: 'member3', name: 'Ashwini Jaiswal', role: 'Team-Managent', email: 'ashwinisj2005@gmail.com', skills: 'UI/UX Designer , Frontend Developer' },
  { id: 'member4', name: 'Prachi Upadhyay', role: 'Team-Follow Up', email: 'officialprachi1211@gmail.com', skills: 'AI/ML Engineer , Data Scientist' },
  { id: 'member5', name: 'Muneer Ali', role: 'Senior Developer', email: 'alimuneerali245@gmail.com', skills: 'Full Stack Developer , AI/ML Engineer' },
  { id: 'member6', name: 'Mohammad Ehshan', role: 'Junior Developer', email: 'ashmes16@gmail.com', skills: 'Frontend Developer , React.js' },
  { id: 'member7', name: 'Vishupal Goyal', role: 'Junior Developer', email: 'jordan@team.com', skills: 'Frontend Developer ' },
  { id: 'member8', name: 'Swati Mishra', role: 'DSA Instructor', email: ' swati01mishra01@gmail.com', skills: 'Frontend Developer , DSA Expert' },
  
];

const hackathonStages = [
  { id: 'ppt', name: 'PPT Round', description: 'Initial presentation of project idea' },
  { id: 'round1', name: 'Round 1', description: 'Prototype development phase' },
  { id: 'round2', name: 'Round 2', description: 'Feature implementation' },
  { id: 'semifinal', name: 'Semifinal', description: 'Advanced development & testing' },
  { id: 'final', name: 'Final', description: 'Demo presentation to judges' }
];

// Helper types and components
interface HackathonCardProps {
  hackathon: Hackathon;
  isSelected: boolean;
  onSelect: () => void;
  formatDate: (date: string) => string;
  getStatusBadge: (status: string) => string;
}

const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  isSelected,
  onSelect,
  formatDate,
  getStatusBadge
}) => {
  const progressPercent = Math.round(
    (hackathon.progress.completedTasks / hackathon.progress.totalTasks) * 100
  );

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
            <span className="font-bold text-blue-300">{hackathon.leader?.name?.charAt(0) || 'N'}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{hackathon.leader?.name || 'No Leader'}</h3>
            <p className="text-xs text-blue-300">{hackathon.leader?.role || ''}</p>
          </div>
        </div>
        
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(hackathon.status)}`}>
          {hackathon.status}
        </span>
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

// Types
type HackathonState = Omit<Hackathon, 'id' | 'currentStage' | 'progress'> & {
  leader: Member | null;
  participants: Member[];
  totalTasks: number;
  roundDates: { [key: string]: string };
};

export default function Page() {
  // Auth context
  const { token, user, logout } = useAuth();
  
  // State declarations
  const [activeSection, setActiveSection] = useState("progress");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [teamMembers, setTeamMembers] = useState<Member[]>(initialTeamMembers);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [showNewHackathonForm, setShowNewHackathonForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    roundDates: {} ,
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    skills: '',
    selectedHackathon: ''
  });

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
        alert('Failed to load hackathons. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
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
    switch(status) {
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
    
    try {
      // Generate a unique ID using timestamp, random string, and counter
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 12); // Longer random string
      const counter = Math.floor(Math.random() * 10000); // Additional randomness
      let hackathonId = `hack_${timestamp}_${random}_${counter}`;
      
      // Ensure uniqueness by checking against existing hackathons
      while (hackathons.some(h => h.id === hackathonId)) {
        const newRandom = Math.random().toString(36).substring(2, 12);
        const newCounter = Math.floor(Math.random() * 10000);
        hackathonId = `hack_${new Date().getTime()}_${newRandom}_${newCounter}`;
      }
      
      const newHackathonObj: Hackathon = {
        id: hackathonId,
        name: newHackathon.name,
        description: newHackathon.description,
        leader: newHackathon.leader || teamMembers[0],
        currentStage: 'ppt',
        progress: { completedTasks: 0, totalTasks: newHackathon.totalTasks },
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

      console.log('Sending hackathon data:', newHackathonObj);
      console.log('roundDates being sent:', newHackathon.roundDates);

      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newHackathonObj),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create hackathon');
      }

      const createdHackathon = await response.json();
      setHackathons(prev => {
        // Check if hackathon already exists to prevent duplicates
        const exists = prev.some(h => h.id === createdHackathon.id);
        if (exists) {
          return prev;
        }
        return [...prev, createdHackathon];
      });
      
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
    } catch (error) {
      console.error('Error creating hackathon:', error);
      alert(error instanceof Error ? error.message : 'Failed to create hackathon');
    }
  };

  // Calculate derived values
  const currentStageIndex = selectedHackathon 
    ? hackathonStages.findIndex(stage => stage.id === selectedHackathon.currentStage)
    : 0;

  const progressPercentage = selectedHackathon 
    ? (selectedHackathon.progress.completedTasks / selectedHackathon.progress.totalTasks) * 100
    : 0;

  // Render
  return (
    <ProtectedRoute requireAdmin={true}>
      <EmailAccessControl fallbackMessage="Hackathon Dashboard Access Restricted">
        <div className="min-h-screen text-white transition-colors duration-500">
      <ParticleBackground />
      <ScrollProgress />
      <Navbar activeSection={activeSection} />
      
      {/* Admin Info Bar
      <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-300">
            Welcome, <span className="font-medium text-blue-300">{user?.username}</span>
            <span className="ml-2 px-2 py-1 bg-blue-600 text-xs rounded-full">{user?.role}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded border border-gray-600 hover:border-gray-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div> */}
      
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

            {/* Hackathon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>

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

            {/* Stage Timeline */}
            {selectedHackathon && (
              <div className="relative mt-16">
                <div className="absolute left-4 md:left-1/2 top-10 bottom-10 w-1 bg-blue-500/30 transform -translate-x-1/2 z-0"></div>
                
                <div className="space-y-12 relative z-10">
                  {hackathonStages.map((stage, index) => (
                    <div 
                      key={stage.id} 
                      className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      <div className="md:w-1/2 mb-4 md:mb-0">
                        <AnimatedElement animation="fade-in" duration={500} delay={index * 200}>
                          <div className={`p-6 rounded-xl backdrop-blur-sm border ${
                            selectedHackathon.currentStage === stage.id 
                              ? 'bg-blue-900/30 border-blue-500 shadow-lg scale-[1.02] transition-transform' 
                              : index < currentStageIndex 
                                ? 'bg-green-900/20 border-green-500/30' 
                                : 'bg-gray-800/30 border-gray-700'
                          }`}>
                            <h3 className={`text-2xl font-bold ${
                              selectedHackathon.currentStage === stage.id 
                                ? 'text-blue-300' 
                                : index < currentStageIndex 
                                  ? 'text-green-300' 
                                  : 'text-gray-400'
                            }`}>
                              {stage.name}
                            </h3>
                            <p className="mt-2 text-blue-100">{stage.description}</p>
                            {selectedHackathon.currentStage === stage.id && (
                              <div className="mt-4 flex items-center">
                                <div className="h-3 w-3 rounded-full bg-blue-400 animate-ping mr-2"></div>
                                <span className="text-blue-300 font-medium">Current Stage</span>
                              </div>
                            )}
                          </div>
                        </AnimatedElement>
                      </div>
                      
                      <div className="md:w-1/2 flex justify-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                          selectedHackathon.currentStage === stage.id 
                            ? 'border-blue-500 bg-blue-900/50 shadow-lg' 
                            : index < currentStageIndex 
                              ? 'border-green-500 bg-green-900/20' 
                              : 'border-gray-600 bg-gray-800/30'
                        }`}>
                          <span className={`text-xl font-bold ${
                            selectedHackathon.currentStage === stage.id 
                              ? 'text-blue-300' 
                              : index < currentStageIndex 
                                ? 'text-green-300' 
                                : 'text-gray-400'
                          }`}>
                            {index + 1}
                          </span>
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {new Date().getFullYear()} Team Blitz. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Back to Top
              </button>
              <a href="#faq" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* New Hackathon Form Modal */}
      {showNewHackathonForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1e2464] to-[#2a3080] rounded-xl p-6 max-w-3xl w-full border border-blue-500/30 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Hackathon</h2>
              <button 
                onClick={() => setShowNewHackathonForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleHackathonSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Hackathon Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newHackathon.name}
                    onChange={handleHackathonChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tech Innovators 2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={newHackathon.description}
                    onChange={handleHackathonChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of the hackathon..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={newHackathon.location}
                    onChange={handleHackathonChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={newHackathon.website}
                    onChange={handleHackathonChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              {/* Dates & Details */}
              <DatesAndDetails 
                 newHackathon={newHackathon} 
                 handleHackathonChange={handleHackathonChange}
                  handleRoundDateChange={handleRoundDateChange}
                   hackathonStages={hackathonStages}
              />
              
              {/* Team Selection */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leader Selection */}
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-300 mb-3">Select Leader*</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {teamMembers.map(member => (
                        <div 
                          key={member.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                            newHackathon.leader?.id === member.id
                              ? 'bg-blue-900/50 border border-blue-500'
                              : 'bg-gray-800/50 hover:bg-gray-700/50'
                          }`}
                          onClick={() => handleLeaderSelection(member.id)}
                        >
                          <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <span className="font-bold text-blue-300">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold">{member.name}</h4>
                            <p className="text-sm text-blue-300">{member.role}</p>
                            <p className="text-xs text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Participants Selection */}
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-300 mb-3">Select Participants*</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {teamMembers.map(member => (
                        <div 
                          key={member.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                            newHackathon.participants.some(p => p.id === member.id)
                              ? 'bg-purple-900/50 border border-purple-500'
                              : 'bg-gray-800/50 hover:bg-gray-700/50'
                          }`}
                          onClick={() => handleParticipantSelection(
                            member.id, 
                            !newHackathon.participants.some(p => p.id === member.id)
                          )}
                        >
                          <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <span className="font-bold text-purple-300">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold">{member.name}</h4>
                            <p className="text-sm text-purple-300">{member.role}</p>
                            <p className="text-xs text-gray-400">{member.skills}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {newHackathon.leader && (
                    <div className="bg-blue-900/30 px-3 py-1 rounded-full flex items-center">
                      <span className="text-blue-300">Leader: </span>
                      <span className="ml-1 font-medium">{newHackathon.leader.name}</span>
                    </div>
                  )}
                  
                  {newHackathon.participants.map(participant => (
                    <div key={participant.id} className="bg-purple-900/30 px-3 py-1 rounded-full flex items-center">
                      <span className="text-purple-300">Participant: </span>
                      <span className="ml-1 font-medium">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition-all"
                >
                  Create Hackathon
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