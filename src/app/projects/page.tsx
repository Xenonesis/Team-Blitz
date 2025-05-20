"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatedElement, ParticleBackground, ScrollProgress } from "@/utils/animations";
import ProjectCard from "@/components/ProjectCard";
import Card3D from "@/components/Card3D";
import Navbar from "@/components/Navbar";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Projects() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white transition-colors duration-500">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Back to Top Button - appears when scrolling down */}
      {scrollPosition > 500 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg animate-fade-in hover-scale"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Navigation */}
      <Navbar activeSection="projects" />

      {/* Projects Header Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-60 h-60 rounded-full bg-blue-500/5 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-indigo-500/5 animate-float delay-300"></div>
        
        <div className="container mx-auto px-6 relative">
          <AnimatedElement animation="fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
              <span className="text-gradient">Our Projects</span>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6"></div>
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-center mb-8 opacity-90">
              Explore our innovative solutions built during hackathons and beyond. Each project demonstrates our team's technical skills and creative problem-solving abilities.
            </p>
            
            {/* Project Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <button className="glass-effect px-5 py-2 rounded-full text-blue-300 hover:text-white hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 transform hover:-translate-y-1 active:scale-95">
                All Projects
              </button>
              <button className="glass-effect px-5 py-2 rounded-full text-blue-300 hover:text-white hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 transform hover:-translate-y-1 active:scale-95">
                Web Apps
              </button>
              <button className="glass-effect px-5 py-2 rounded-full text-blue-300 hover:text-white hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 transform hover:-translate-y-1 active:scale-95">
                Mobile
              </button>
              <button className="glass-effect px-5 py-2 rounded-full text-blue-300 hover:text-white hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 transform hover:-translate-y-1 active:scale-95">
                AI/ML
              </button>
              <button className="glass-effect px-5 py-2 rounded-full text-blue-300 hover:text-white hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 transform hover:-translate-y-1 active:scale-95">
                IoT
              </button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-blue-500/5 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-indigo-500/5 animate-spin-slow"></div>
          
          <AnimatedElement animation="fade-in">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="text-gradient">Featured Project</span>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4"></div>
            </h2>
          </AnimatedElement>

          {/* Featured Project - SwiftDrop */}
          <AnimatedElement animation="slide-up" delay={200}>
            <Card3D className="max-w-5xl mx-auto mb-20 glass-effect rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500" intensity={15}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm mb-4 animate-pulse-subtle">
                    Featured Project
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gradient">SwiftDrop</h3>
                  <p className="text-lg mb-6">
                    A modern file sharing platform that allows users to upload and share files easily with anyone. Features include secure transfers, no account required to download, and a sleek user interface.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="glass-effect px-3 py-1 rounded-full text-sm hover:bg-blue-500/20 transition-colors cursor-pointer hover:scale-105 transform duration-300">React</span>
                    <span className="glass-effect px-3 py-1 rounded-full text-sm hover:bg-blue-500/20 transition-colors cursor-pointer hover:scale-105 transform duration-300">TypeScript</span>
                    <span className="glass-effect px-3 py-1 rounded-full text-sm hover:bg-blue-500/20 transition-colors cursor-pointer hover:scale-105 transform duration-300">Supabase</span>
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href="https://swiftdropio.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center bg-blue-500/20 hover:bg-blue-500/40 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                    >
                      Visit Project
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center glass-effect hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-8 flex items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-1000"></div>
                  <div className="w-full h-64 bg-blue-800/30 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-300/50 group-hover:text-blue-300/80 transition-colors duration-500 group-hover:scale-110 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card3D>
          </AnimatedElement>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-16 bg-black/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            Our Projects
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4"></div>
          </h2>
          
          <ProjectsGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-950 to-black py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-500/5 animate-spin-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 animate-spin-slow"></div>

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="text-3xl font-bold text-gradient">Team Blitz</div>
                <div className="ml-2 text-2xl">⚡</div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Led by Aditya Kumar Tiwari, we're a team of passionate developers, designers, and innovators who come together to create amazing solutions during hackathons.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-900/30 hover:bg-blue-800/50 p-3 rounded-full transition-colors" aria-label="Twitter" title="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 hover:bg-blue-800/50 p-3 rounded-full transition-colors" aria-label="GitHub" title="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="https://iaddy.netlify.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 hover:bg-blue-800/50 p-3 rounded-full transition-colors" aria-label="Portfolio" title="Portfolio">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-blue-300">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/#about" className="text-gray-300 hover:text-blue-300 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/#team" className="text-gray-300 hover:text-blue-300 transition-colors">Our Team</Link>
                </li>
                <li>
                  <Link href="/#projects" className="text-gray-300 hover:text-blue-300 transition-colors">Projects</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-blue-300 transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-blue-300">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">itisaddy7@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-8"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Team Blitz. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}