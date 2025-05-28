"use client";

import { useState } from "react";
import { cn } from "./utils";
import { ReactNode } from "react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  icon: ReactNode;
  bgGradient: string;
  delay?: number;
  projectUrl?: string;
  githubUrl?: string;
  linkWrapper?: (children: ReactNode, url: string) => ReactNode;
}

export default function ProjectCard({
  title,
  subtitle,
  description,
  technologies,
  icon,
  bgGradient,
  delay,
  projectUrl,
  githubUrl,
  linkWrapper = (children: ReactNode, _url: string) => children,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = () => (
    <div
      className={cn(
        "relative h-full group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/10 hover:border-blue-400/30 bg-white/5 backdrop-blur-sm"
      )}
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
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {projectUrl && (
            linkWrapper(
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors"
                title={`Visit ${title} - ${subtitle}`}
              >
                <span className="inline-flex items-center">
                  Visit Project
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </a>,
              projectUrl
            )
          )}
          {githubUrl && (
            linkWrapper(
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                title={`View ${title} on GitHub`}
              >
                <span className="inline-flex items-center">
                  GitHub
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </span>
              </a>,
              githubUrl
            )
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <CardContent />
    </div>
  );
}