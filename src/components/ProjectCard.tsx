"use client";

import { useState } from "react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  icon: React.ReactNode;
  bgGradient: string;
  delay?: number;
  projectUrl?: string;
}

export default function ProjectCard({
  title,
  subtitle,
  description,
  technologies,
  icon,
  bgGradient,
  projectUrl,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = () => (
    <div 
      className="relative h-full group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/10 hover:border-blue-400/30 bg-white/5 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-48 ${bgGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-blue-300 mb-3">{subtitle}</p>
        <p className="text-sm mb-4 text-gray-300 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {projectUrl ? (
        <a 
          href={projectUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block h-full" 
          title={`Visit ${title} - ${subtitle}`}
        >
          <CardContent />
        </a>
      ) : (
        <CardContent />
      )}
    </div>
  );
}
