"use client";

import Link from "next/link";
import { AnimatedElement } from "@/utils/animations";
import ProjectCard from "@/components/ProjectCard";
import Card3D from "@/components/Card3D";
import { LinkPreview } from "../components/linkpreview";
import { ReactNode } from "react";

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-black/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-blue-500/5 animate-spin-slow"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-indigo-500/5 animate-spin-slow"></div>

      <div className="container mx-auto px-6 relative">
        <AnimatedElement animation="fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Our Projects</span>
          </h2>
        </AnimatedElement>

        {/* Featured Project - Omni.AI */}
        <AnimatedElement animation="slide-up" delay={200}>
          <Card3D className="max-w-5xl mx-auto mb-20 glass-effect rounded-xl overflow-hidden" intensity={10}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm mb-4">
                  Featured Project
                </div>
                <h3 className="text-2xl font-bold mb-4">Omni.AI</h3>
                <p className="text-lg mb-6">
                  A cutting-edge AI platform that provides powerful natural language processing capabilities.
                  Omni.AI can understand, generate, and analyze text with human-like proficiency.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="glass-effect px-3 py-1 rounded-full text-sm">Next.js</span>
                  <span className="glass-effect px-3 py-1 rounded-full text-sm">TailwindCSS</span>
                  <span className="glass-effect px-3 py-1 rounded-full text-sm">OpenAI API</span>
                </div>
                <div className="flex gap-4">
                  <LinkPreview url="https://omniverseai.netlify.app/" width={300} height={200}>
                    <a
                      href="https://omniverseai.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors"
                      title="Visit Omni.AI"
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
                    </a>
                  </LinkPreview>
                  <LinkPreview url="https://github.com/Xenonesis/omni.AI" width={300} height={200}>
                    <a
                      href="https://github.com/Xenonesis/omni.AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                      title="View Omni.AI on GitHub"
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
                    </a>
                  </LinkPreview>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-8 flex items-center justify-center">
                <div className="w-full h-64 bg-blue-800/30 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-blue-300/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card3D>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 - Zenflow */}
          <ProjectCard
            title="Zenflow"
            subtitle="Mindfulness & Productivity"
            description="A meditation and productivity app that combines mindfulness techniques with task management to help users stay focused and reduce stress."
            technologies={["React", "Node.js", "MongoDB", "TailwindCSS"]}
            bgGradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-purple-300/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
            delay={300}
            projectUrl="https://github.com/Xenonesis/Zenflow"
            githubUrl="https://github.com/Xenonesis/Zenflow"
            linkWrapper={(children: ReactNode, url: string) => (
              <LinkPreview url={url} width={300} height={200}>
                {children}
              </LinkPreview>
            )}
          />

          {/* Project 2 - SwiftDrop */}
          <ProjectCard
            title="SwiftDrop"
            subtitle="File Sharing Platform"
            description="A modern file sharing platform that allows users to upload and share files easily with anyone. Features include secure transfers and no account required."
            technologies={["React", "TypeScript", "Supabase"]}
            bgGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-300/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            }
            delay={400}
            projectUrl="https://swiftdropio.netlify.app/"
            linkWrapper={(children: ReactNode, url: string) => (
              <LinkPreview url={url} width={300} height={200}>
                {children}
              </LinkPreview>
            )}
          />

          {/* Project 3 - Budget Buddy AI */}
          <ProjectCard
            title="Budget Buddy AI"
            subtitle="Smart Money Management"
            description="An intuitive financial management tool that helps users track expenses, create budgets, set savings goals, and gain insights into spending patterns."
            technologies={["React", "TailwindCSS", "Firebase", "AI Analytics"]}
            bgGradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-300/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            delay={500}
            projectUrl="https://budgetbuddyai.netlify.app/"
            linkWrapper={(children: ReactNode, url: string) => (
              <LinkPreview url={url} width={300} height={200}>
                {children}
              </LinkPreview>
            )}
          />
        </div>

        {/* View All Projects Button */}
        <AnimatedElement animation="fade-in" delay={600}>
          <div className="text-center mt-12">
            <LinkPreview url="/projects" width={300} height={200}>
              <Link
                href="/projects"
                className="inline-flex items-center glass-effect hover:bg-blue-700/30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-white/20 hover:border-white/50 hover:-translate-y-1"
              >
                <span className="inline-flex items-center">
                  View All Projects
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
              </Link>
            </LinkPreview>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
}