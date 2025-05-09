"use client";

import { useState } from "react";
import { AnimatedElement } from "@/utils/animations";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  icon: React.ReactNode;
  bgGradient: string;
  delay?: number;
}

export default function ProjectCard({
  title,
  subtitle,
  description,
  technologies,
  icon,
  bgGradient,
  delay = 0,
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <AnimatedElement animation="fade-in" delay={delay} className="h-full">
      <div 
        className="relative h-full perspective-1000 group"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div 
          className={`relative w-full h-full duration-700 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <div className={`glass-effect rounded-xl overflow-hidden absolute w-full h-full backface-hidden ${
            isFlipped ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}>
            <div className={`h-48 ${bgGradient} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                {icon}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-blue-300 mb-4">{subtitle}</p>
              <p className="text-sm mb-4 line-clamp-2">{description}</p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span key={index} className="glass-effect px-2 py-1 rounded-full text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className={`glass-effect rounded-xl overflow-hidden absolute w-full h-full backface-hidden rotate-y-180 ${
            isFlipped ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-blue-300 mb-4">{subtitle}</p>
              <p className="text-sm mb-6 flex-grow">{description}</p>
              <div className="mt-auto">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}
