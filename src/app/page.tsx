"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatedElement, ScrollProgress, ParticleBackground } from "@/utils/animations";
import Navbar from "@/components/Navbar";
import CustomCursor from '../components/cursor';
import Projects from '../components/projects';
import Team from '../components/teams';

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
      <CustomCursor />
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
      <Team />

      {/* Projects Section */}
      <Projects />

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