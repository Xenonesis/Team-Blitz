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
      document.body.classList.add('menu-open');
    } else {
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

  // State to track if we're on the home page
  const [isHomePage, setIsHomePage] = useState(true);
  
  // Check if we're on the home page or another page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      setIsHomePage(pathname === '/' || pathname === '');
    }
  }, []);

  const navLinks: NavLink[] = [
    { 
      href: isHomePage ? "#about" : "/#about", 
      label: "About" 
    },
    { 
      href: isHomePage ? "#team" : "/#team", 
      label: "Team" 
    },
    { 
      href: isHomePage ? "#projects" : "/#projects", 
      label: "Projects" 
    },
    { 
      href: "/contact", 
      label: "Contact", 
      isExternal: true 
    }
  ];

  return (
    <>
      {/* Enhanced Modern Navigation Bar */}
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${
          scrollPosition > 50
            ? 'modern-nav-scrolled py-3 shadow-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-lg'
            : 'py-4 bg-transparent backdrop-blur-sm'
        } ${
          isScrollingUp ? 'translate-y-0' : '-translate-y-full'
        } border-b border-blue-500/10 dark:border-blue-400/15 hover:border-blue-500/20 dark:hover:border-blue-400/25 transition-all duration-500`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo with Modern Design */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500 group-hover:-inset-2"></div>
                <div className="relative flex items-center bg-white/5 dark:bg-blue-900/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-blue-400/30 dark:border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="text-xl sm:text-2xl font-bold text-gradient-enhanced group-hover:scale-105 transition-transform duration-300">
                    <span className="hidden xs:inline">Team</span> <span className="text-blue-500 dark:text-blue-400 font-extrabold">Blitz</span>
                  </div>
                  <div className="ml-2 text-yellow-500 dark:text-yellow-400 text-xl transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110">⚡</div>
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-full p-1.5 flex items-center shadow-lg border border-blue-400/20 dark:border-blue-500/20 hover:border-blue-400/40 dark:hover:border-blue-500/40 transition-all duration-300 animate-float-subtle">
                {navLinks.map((link, index) => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2 rounded-full transition-all duration-300 group ${
                        (activeSection === link.href.substring(1) || 
                         (activeSection === "projects" && link.label === "Projects"))
                          ? "text-white font-medium bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/40 shadow-md"
                          : "text-gray-700 dark:text-white/80 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center relative z-10">
                        {link.label === "Contact" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {link.label}
                      </span>
                      {/* Enhanced hover/active effect */}
                      <span className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300 ${
                        (activeSection === link.href.substring(1) || 
                         (activeSection === "projects" && link.label === "Projects"))
                          ? "opacity-100"
                          : "opacity-0"
                      }`}></span>
                      {/* Animated underline effect */}
                      <span className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-400 dark:bg-blue-300 rounded-full transform -translate-x-1/2 transition-all duration-300 ${
                        (activeSection === link.href.substring(1) || 
                        (activeSection === "projects" && link.label === "Projects"))
                          ? "w-3/4 group-hover:w-full"
                          : "w-0 group-hover:w-3/4"
                      }`}></span>
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2 rounded-full transition-all duration-300 group ${
                        (activeSection === link.href.substring(1) || 
                         (activeSection === "projects" && link.label === "Projects"))
                          ? "text-white font-medium bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/40 shadow-md"
                          : "text-gray-700 dark:text-white/80 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center relative z-10">
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
                      {/* Enhanced hover/active effect */}
                      <span className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300 ${
                        (activeSection === link.href.substring(1) || 
                         (activeSection === "projects" && link.label === "Projects"))
                          ? "opacity-100"
                          : "opacity-0"
                      }`}></span>
                      {/* Animated underline effect */}
                      <span className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-400 dark:bg-blue-300 rounded-full transform -translate-x-1/2 transition-all duration-300 ${
                        (activeSection === link.href.substring(1) || 
                        (activeSection === "projects" && link.label === "Projects"))
                          ? "w-3/4 group-hover:w-full"
                          : "w-0 group-hover:w-3/4"
                      }`}></span>
                    </a>
                  )
                ))}
              </div>

              {/* Enhanced Theme Switcher */}
              <div className="ml-4">
                <ThemeSwitcher className="transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/20" />
              </div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="scale-95">
                <ThemeSwitcher className="transform hover:scale-110 transition-all duration-300 shadow-md hover:shadow-blue-500/20" />
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 focus:outline-none border border-blue-400/30 dark:border-blue-500/30 shadow-lg transform hover:scale-110 active:scale-95"
                aria-label="Toggle menu"
              >
                <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}>
                  <span className="bg-blue-500 dark:bg-blue-400 transition-all duration-300"></span>
                  <span className="bg-indigo-500 dark:bg-indigo-400 transition-all duration-300"></span>
                  <span className="bg-purple-500 dark:bg-purple-400 transition-all duration-300"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Modern Mobile Menu with Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-lg animate-fade-in">
          <div
            className="mobile-menu-container absolute right-0 top-0 h-full w-[85%] max-w-[320px] modern-mobile-menu animate-slide-right"
          >
            <div className="flex flex-col h-full bg-gradient-to-b from-blue-900/50 to-indigo-900/30">
              {/* Enhanced Header with Brand Identity */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/60 to-indigo-600/40">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="text-xl animate-pulse-slow">⚡</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white">Team Blitz</div>
                </div>
              </div>

              {/* Improved Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-5">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link, index) => (
                    link.href.startsWith('/') ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-300 flex items-center p-4 rounded-xl slide-right menu-delay-${index} ${
                          activeSection === link.href.substring(1)
                            ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white font-medium border-l-4 border-blue-400 shadow-md"
                            : "hover:bg-white/10 text-white/90 hover:text-white"
                        } hover:translate-x-2 hover:shadow-lg`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="w-10 h-10 mr-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                          {link.label === "Contact" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </span>
                        <span className="font-medium text-lg">{link.label}</span>
                        <span className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`transition-all duration-300 flex items-center p-4 rounded-xl animate-slide-right menu-delay-${index} ${
                          (activeSection === link.href.substring(1) || 
                           (activeSection === "projects" && link.label === "Projects"))
                            ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white font-medium border-l-4 border-blue-400 shadow-md"
                            : "hover:bg-white/10 text-white/90 hover:text-white"
                        } hover:translate-x-2 hover:shadow-lg`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="w-10 h-10 mr-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                          {link.label === "About" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {link.label === "Team" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                          {link.label === "Projects" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                          )}
                        </span>
                        <span className="font-medium text-lg">{link.label}</span>
                        <span className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="p-5 border-t border-white/10 bg-gradient-to-r from-blue-900/40 to-indigo-900/30">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-80">© 2025 Team Blitz</div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600/60 to-indigo-600/60 hover:from-blue-600/80 hover:to-indigo-600/80 transition-all duration-300 text-sm font-medium border border-white/20 flex items-center hover:shadow-lg"
                  >
                    <span>Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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