"use client";

import ProjectCard from "@/components/ProjectCard";

export default function ProjectsGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Project 1 - SmartCity */}
      <ProjectCard
        title="SmartCity Platform"
        subtitle="IoT Urban Management"
        description="An integrated platform that connects various IoT devices across urban environments to create smarter, more efficient cities."
        technologies={["React", "Node.js", "IoT", "AI"]}
        bgGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        delay={300}
        projectUrl="https://smartcity-platform.netlify.app/"
      />

      {/* Project 2 */}
      <ProjectCard
        title="EcoTrack"
        subtitle="Environmental Monitoring App"
        description="An IoT-based solution for monitoring air quality and environmental metrics in urban areas. Provides real-time data visualization and alerts for environmental hazards."
        technologies={["React", "Node.js", "IoT"]}
        bgGradient="bg-gradient-to-br from-green-500/20 to-blue-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        }
        delay={400}
        projectUrl="https://ecotrack-monitor.netlify.app/"
      />

      {/* Project 3 */}
      <ProjectCard
        title="MediConnect"
        subtitle="Healthcare Platform"
        description="A telemedicine platform connecting patients with healthcare providers in underserved areas. Features include video consultations, appointment scheduling, and secure medical record sharing."
        technologies={["Next.js", "WebRTC", "MongoDB"]}
        bgGradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
        delay={500}
        projectUrl="https://mediconnect-health.netlify.app/"
      />

      {/* Project 4 */}
      <ProjectCard
        title="CodeCollab"
        subtitle="Collaborative Coding Platform"
        description="A real-time collaborative coding environment for teams to write, review, and debug code together. Includes features like syntax highlighting, version control, and integrated chat."
        technologies={["React", "Socket.io", "Express", "MongoDB"]}
        bgGradient="bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
        delay={300}
        projectUrl="https://codecollab-platform.netlify.app/"
      />

      {/* Project 5 */}
      <ProjectCard
        title="FinTrack"
        subtitle="Personal Finance Manager"
        description="A comprehensive personal finance management application that helps users track expenses, set budgets, and visualize spending patterns with intuitive charts and reports."
        technologies={["Vue.js", "Firebase", "Chart.js"]}
        bgGradient="bg-gradient-to-br from-green-500/20 to-teal-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        delay={400}
        projectUrl="https://fintrack-manager.netlify.app/"
      />

      {/* Project 6 */}
      <ProjectCard
        title="AI Study Buddy"
        subtitle="Educational AI Assistant"
        description="An AI-powered study assistant that helps students learn more effectively by providing personalized explanations, practice questions, and study schedules based on individual learning patterns."
        technologies={["Python", "TensorFlow", "React", "FastAPI"]}
        bgGradient="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
        delay={500}
        projectUrl="https://aistudybuddy-edu.netlify.app/"
      />
      
      {/* Project 7 - Budget Buddy AI */}
      <ProjectCard
        title="Budget Buddy AI"
        subtitle="Smart Money Management"
        description="An intuitive financial management tool that helps users track expenses, create budgets, set savings goals, and gain insights into spending patterns with AI-powered analytics."
        technologies={["React", "TailwindCSS", "Firebase", "AI Analytics"]}
        bgGradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        delay={600}
        projectUrl="https://budgetbuddyai.netlify.app/"
      />
      </div>
    </div>
  );
}
