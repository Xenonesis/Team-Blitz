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