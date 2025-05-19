"use client";

import { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";

interface NavbarProps {
  activeSection: string;
}

interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Handle scroll position for animations and navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setScrollPosition(currentScrollPos);

      // Detect scroll direction
      setIsScrollingUp(currentScrollPos < lastScrollTop || currentScrollPos < 50);
      setLastScrollTop(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Add a class to the body to prevent any background interaction
      document.body.classList.add('menu-open');
    } else {
      // Use a small timeout to allow the closing animation to complete
      setTimeout(() => {
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const navLinks: NavLink[] = [
    { href: "#about", label: "About" },
    { href: "#team", label: "Team" },
    { href: "#projects", label: "Projects" },
    { href: "/contact", label: "Contact", isExternal: true }
  ];

  return (
    <>
      {/* Modern Navigation Bar */}
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ${
          scrollPosition > 50
            ? 'modern-nav-scrolled py-4 shadow-xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-md'
            : 'py-5 bg-transparent backdrop-blur-sm'
        } translate-y-0 border-b-[0.5px] border-blue-500/5 dark:border-blue-400/10 transition-all duration-500 hover:border-blue-500/10 dark:hover:border-blue-400/15`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo with Modern Design - Improved for Mobile */}
            <a href="#" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-35 group-hover:opacity-85 transition duration-500"></div>
                <div className="relative flex items-center bg-blue-600/20 dark:bg-blue-800/30 backdrop-blur-sm px-5 py-3 rounded-full border border-blue-400/30 dark:border-blue-500/30 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-gradient-enhanced group-hover:scale-105 transition-transform duration-300">
                    <span className="hidden xs:inline">Team</span> <span className="text-blue-500 dark:text-blue-400 font-extrabold">Blitz</span>
                  </div>
                  <div className="animate-pulse ml-2 group-hover:animate-bounce text-yellow-500 dark:text-yellow-400 text-xl">⚡</div>
                </div>
              </div>
            </a>

            {/* Desktop Navigation - Modern Style */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-full p-2 flex items-center shadow-md border border-blue-400/20 dark:border-blue-500/20 hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all duration-300 animate-float-subtle">
                {navLinks.map((link, index) => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link-enhanced relative px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-blue-500/10 dark:hover:bg-blue-600/20 group ${
                        activeSection === link.href.substring(1)
                          ? "nav-active text-white font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30 border animate-pulse-subtle shadow-md"
                          : "text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white"
                      }`}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('animate-nav-hover');
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('animate-nav-hover');
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span className="flex items-center">
                        {link.label === "Contact" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {link.label}
                      </span>
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-white/10 dark:hover:bg-gray-700/50 group ${
                        activeSection === link.href.substring(1)
                          ? "nav-active text-white font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30 border animate-pulse-subtle shadow-md"
                          : "text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white"
                      }`}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('animate-nav-hover');
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('animate-nav-hover');
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span className="flex items-center">
                        {link.label === "About" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {link.label === "Team" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                        {link.label === "Projects" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        )}
                        {link.label}
                      </span>
                    </a>
                  )
                ))}
              </div>

              {/* Theme Switcher with enhanced styling */}
              <div className="ml-4">
                <ThemeSwitcher className="transform hover:scale-110 transition-all duration-300 shadow-lg" />
              </div>
            </div>

            {/* Mobile Menu Button - Improved Modern Style */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="scale-95">
                <ThemeSwitcher className="transform hover:scale-110 transition-all duration-300 shadow-md" />
              </div>

              {/* Mobile Menu Button - Enhanced with Animation */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 focus:outline-none border border-blue-400/30 dark:border-blue-500/30 shadow-lg transform hover:scale-110 active:scale-95 animate-pulse-subtle"
                aria-label="Toggle menu"
              >
                <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}>
                  <span className="bg-blue-500 dark:bg-blue-400"></span>
                  <span className="bg-indigo-500 dark:bg-indigo-400"></span>
                  <span className="bg-purple-500 dark:bg-purple-400"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Modern Mobile Menu with Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-md animate-fade-in">
          <div
            className="mobile-menu-container absolute right-0 top-0 h-full w-[80%] max-w-[300px] modern-mobile-menu animate-slide-right"
          >
            <div className="flex flex-col h-full">
              {/* Enhanced Header with Brand Identity */}
              <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-900/50 to-indigo-600/30">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                      <div className="animate-pulse text-xl">⚡</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gradient">Team Blitz</div>
                </div>
              </div>

              {/* Improved Navigation Links */}
              <div className="flex-1 overflow-y-auto py-5 px-4">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link, index) => (
                    link.href.startsWith('/') ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-300 flex items-center p-3 rounded-xl animate-slide-right menu-delay-${index} ${
                          activeSection === link.href.substring(1)
                            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white font-medium border-l-2 border-blue-500"
                            : "hover:bg-white/5 text-white/80 hover:text-white hover:border-l-2 hover:border-blue-500/50"
                        } hover:translate-x-1`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {/* Enhanced icons with subtle animation */}
                        <span className="w-9 h-9 mr-3 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30">
                          {link.label === "Contact" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-300 flex items-center p-3 rounded-xl animate-slide-right menu-delay-${index} ${
                          activeSection === link.href.substring(1)
                            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white font-medium border-l-2 border-blue-500"
                            : "hover:bg-white/5 text-white/80 hover:text-white hover:border-l-2 hover:border-blue-500/50"
                        } hover:translate-x-1`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {/* Enhanced icons with subtle animation */}
                        <span className="w-9 h-9 mr-3 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30">
                          {link.label === "About" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {link.label === "Team" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                          {link.label === "Projects" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                          )}
                        </span>
                        <span className="font-medium">{link.label}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                <div className="flex justify-between items-center">
                  <div className="text-xs opacity-70">© 2025 Team Blitz</div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/50 to-indigo-600/50 hover:from-blue-600/70 hover:to-indigo-600/70 transition-all duration-300 text-sm font-medium border border-white/10 flex items-center"
                  >
                    <span>Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
