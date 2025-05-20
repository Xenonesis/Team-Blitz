"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatedElement, ScrollProgress, ParticleBackground } from "@/utils/animations";
import ProjectCard from "@/components/ProjectCard";
import Card3D from "@/components/Card3D";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll position for animations and active section detection
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Update active section based on scroll position
      const sections = ["home", "about", "team", "projects"];
      const sectionElements = sections.map(id =>
        id === "home" ? document.querySelector("section") : document.getElementById(id)
      );

      const currentSectionIndex = sectionElements.findIndex((section, index) => {
        if (!section) return false;
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        return scrollPosition >= sectionTop && scrollPosition < sectionBottom;
      });

      if (currentSectionIndex !== -1) {
        setActiveSection(sections[currentSectionIndex]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

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
      <Navbar activeSection={activeSection} />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 py-20 text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500/20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-indigo-500/20 animate-float delay-300"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-purple-500/20 animate-float delay-500"></div>

          {/* Hero content with animations */}
          <AnimatedElement animation="fade-in" duration={1200}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
              <span className="text-gradient">Team Blitz</span>
              <span className="block mt-2">Innovative Hackathon Team</span>
              <div className="absolute -top-10 right-1/2 transform translate-x-1/2 text-4xl animate-pulse">⚡</div>
            </h1>

            <AnimatedElement animation="slide-up" delay={300} duration={1000}>
              <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Led by Aditya Kumar Tiwari, we build innovative solutions that solve real-world problems.
                <span className="block mt-2">Fast, efficient, and always ahead of the curve.</span>
              </p>
            </AnimatedElement>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a
                href="#projects"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 hover-scale"
              >
                Our Projects
              </a>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce mt-20 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 animate-spin-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-indigo-500/10 animate-spin-slow"></div>

        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">About Us</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="glass-effect p-8 rounded-xl mb-12 transform hover:scale-[1.01] transition-transform duration-300">
              <p className="text-lg md:text-xl mb-6 leading-relaxed">
                Team Blitz is a group of passionate developers, designers, and innovators who come together to create amazing solutions during hackathons. We believe in the power of technology to transform lives and businesses.
              </p>
              <p className="text-lg md:text-xl leading-relaxed">
                Our team has participated in numerous hackathons across the country, consistently delivering high-quality projects that stand out for their creativity, technical excellence, and real-world applicability.
              </p>
            </div>

            {/* Timeline */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Journey</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/30"></div>

                {/* Timeline items */}
                <div className="grid grid-cols-1 gap-12">
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <div className="bg-blue-500 rounded-full w-4 h-4 z-10"></div>
                    </div>
                    <div className="glass-effect p-6 rounded-lg mt-4 hover-scale">
                      <h4 className="text-xl font-bold mb-2">2025</h4>
                      <p>Team Blitz was formed by a group of passionate developers looking to make an impact through hackathons.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats with animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="glass-effect p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-gradient mb-2 animate-pulse">15+</div>
                <div className="text-lg">Hackathons</div>
              </div>
              <div className="glass-effect p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-gradient mb-2 animate-pulse">8</div>
                <div className="text-lg">First Place Wins</div>
              </div>
              <div className="glass-effect p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-gradient mb-2 animate-pulse">20+</div>
                <div className="text-lg">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-60 h-60 rounded-full bg-blue-500/5 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-indigo-500/5 animate-float delay-300"></div>

        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Meet Our Team</span>
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-blue-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Hacker with team leader look */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Aditya Kumar Tiwari</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/itisaddy/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="GitHub profile" title="GitHub profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a href="https://iaddy.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="Portfolio website" title="Portfolio website">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="sr-only">Portfolio</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Aditya Kumar Tiwari</h3>
                  <p className="text-blue-300 mb-4">Team Leader & Developer</p>
                  <p className="text-sm">Passionate about creating clean, efficient code and solving complex problems through innovative solutions.</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-purple-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Cute girl avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Swati Mishra</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/swati-mishra-8a5a18259" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="https://github.com/SwatiMishra01" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="GitHub profile" title="GitHub profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="sr-only">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Swati Mishra</h3>
                  <p className="text-blue-300 mb-4">Developer</p>
                  <p className="text-sm">Skilled developer with expertise in creating efficient and innovative solutions for complex problems.</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-green-500/20 to-teal-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-green-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Thinking guy avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path d="M12 .75a8.25 8.25 0 00-8.25 8.25c0 4.56 3.69 8.25 8.25 8.25 2.31 0 4.46-.87 6.08-2.32l.84 1.68a.75.75 0 001.34-.67l-.92-1.83a8.222 8.222 0 001.9-5.11A8.25 8.25 0 0012 .75z" />
                          <path fillRule="evenodd" d="M12.06 5.25a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Aayush Tonk</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/aayush-tonk/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="https://github.com/Amaayu" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="GitHub profile" title="GitHub profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="sr-only">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Aayush Tonk</h3>
                  <p className="text-blue-300 mb-4">Backend Engineer</p>
                  <p className="text-sm">Expert in building scalable, secure backend systems and APIs with a focus on performance and reliability.</p>
                </div>
              </div>

              {/* Team Member 4 - Shivam Verma */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-orange-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Cool guy avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Shivam Verma</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/shivam-verma-818222270" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Shivam Verma</h3>
                  <p className="text-blue-300 mb-4">Android Developer</p>
                  <p className="text-sm">Specialized in creating intuitive and high-performance Android applications with a focus on user experience.</p>
                </div>
              </div>

              {/* Team Member 5 - Prachi Upadhyay */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-pink-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Tech girl avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Prachi Upadhyay</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/prachi-upadhyay-926487301/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Prachi Upadhyay</h3>
                  <p className="text-blue-300 mb-4">Web Developer</p>
                  <p className="text-sm">Skilled in creating modern, responsive web applications with a focus on clean code and user-friendly interfaces.</p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-amber-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                      {/* Glass wearing guy avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                          <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
                          <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">Mohammad Ehshan</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/in/mohammad-ehshan-4362a0298/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="https://github.com/Mohammad-Ehshan" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="GitHub profile" title="GitHub profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="sr-only">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Mohammad Ehshan</h3>
                  <p className="text-blue-300 mb-4">Frontend Developer</p>
                  <p className="text-sm">Talented developer with a passion for creating beautiful, responsive user interfaces and engaging user experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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

          {/* Featured Project - SwiftDrop */}
          <AnimatedElement animation="slide-up" delay={200}>
            <Card3D className="max-w-5xl mx-auto mb-20 glass-effect rounded-xl overflow-hidden" intensity={10}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm mb-4">
                    Featured Project
                  </div>
                  <h3 className="text-2xl font-bold mb-4">SwiftDrop</h3>
                  <p className="text-lg mb-6">
                    A modern file sharing platform that allows users to upload and share files easily with anyone. Features include secure transfers, no account required to download, and a sleek user interface.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="glass-effect px-3 py-1 rounded-full text-sm">React</span>
                    <span className="glass-effect px-3 py-1 rounded-full text-sm">TypeScript</span>
                    <span className="glass-effect px-3 py-1 rounded-full text-sm">Supabase</span>
                  </div>
                  <a href="https://swiftdropio.netlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors">
                    Visit Project
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-8 flex items-center justify-center">
                  <div className="w-full h-64 bg-blue-800/30 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card3D>
          </AnimatedElement>

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
            />
            
            {/* Project 4 - Budget Buddy AI */}
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

          {/* View All Projects Button */}
          <AnimatedElement animation="fade-in" delay={600}>
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center glass-effect hover:bg-blue-700/30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-white/20 hover:border-white/50 hover:-translate-y-1"
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </AnimatedElement>
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
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/itisaddy/" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 hover:bg-blue-800/50 p-3 rounded-full transition-colors" aria-label="LinkedIn" title="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
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
                  <a href="#about" className="text-gray-300 hover:text-blue-300 transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#team" className="text-gray-300 hover:text-blue-300 transition-colors">Our Team</a>
                </li>
                <li>
                  <a href="#projects" className="text-gray-300 hover:text-blue-300 transition-colors">Projects</a>
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
