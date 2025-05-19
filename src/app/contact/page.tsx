"use client"

import { useState, useEffect } from "react";
import { AnimatedElement, ScrollProgress, ParticleBackground } from "@/utils/animations";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import Navbar from "@/components/Navbar";

export default function Contact() {
  const [activeSection, setActiveSection] = useState("contact");
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll events
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
      <Navbar activeSection={activeSection} />

      {/* Contact Section */}
      <section className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#2a3080] to-[#1e2464]">
        <div className="container mx-auto px-6 relative">

          <AnimatedElement animation="fade-in" duration={1000}>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              <span className="text-white">Get in Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 text-white/90">
              Have a question or want to work with us? We'd love to hear from you. Fill out the form below or use our contact information.
            </p>
          </AnimatedElement>

          {/* Main content - Two column layout */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Left Column - Contact Form */}
            <div className="w-full lg:w-7/12 order-2 lg:order-1">
              <AnimatedElement animation="slide-up" delay={200}>
                <div className="bg-[#2a3080] p-6 rounded-xl shadow-lg">
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-[#3a4095] border border-[#4a50a5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-[#3a4095] border border-[#4a50a5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                      />
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What is this regarding?"
                        className="w-full px-4 py-3 bg-[#3a4095] border border-[#4a50a5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Your message here..."
                        className="w-full px-4 py-3 bg-[#3a4095] border border-[#4a50a5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>

            {/* Right Column - Contact Information and Social Links */}
            <div className="w-full lg:w-5/12 order-1 lg:order-2">
              {/* Contact Information */}
              <AnimatedElement animation="slide-left" delay={400} className="mb-8">
                <div className="bg-[#3a4095] p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-6 text-white">Contact Information</h3>
                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#2d3277] p-3 rounded-full mr-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-1 text-white">Email</h4>
                        <p className="text-sm text-white/80">itisaddy7@gmail.com</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#2d3277] p-3 rounded-full mr-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-1 text-white">Location</h4>
                        <p className="text-sm text-white/80">Delhi, India</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#2d3277] p-3 rounded-full mr-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-1 text-white">Phone</h4>
                        <p className="text-sm text-white/80">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedElement>

              {/* Social Links */}
              <AnimatedElement animation="slide-left" delay={600}>
                <div className="bg-[#3a4095] p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-6 text-white">Connect With Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://github.com/Xenonesis/Team-Blitz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#2d3277] hover:bg-[#252a66] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-sm text-white">GitHub</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/itisaddy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#2d3277] hover:bg-[#252a66] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="text-sm text-white">LinkedIn</span>
                    </a>
                    <a
                      href="https://iaddy.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#2d3277] hover:bg-[#252a66] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="text-sm text-white">Portfolio</span>
                    </a>
                    <a
                      href="mailto:itisaddy7@gmail.com"
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#2d3277] hover:bg-[#252a66] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-white">Email</span>
                    </a>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto mt-24 px-6">
          <AnimatedElement animation="fade-in" duration={1000}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="text-white">Frequently Asked Questions</span>
            </h2>
            <p className="text-lg text-center max-w-3xl mx-auto mb-12 text-white/90">
              Find answers to common questions about Team Blitz and our services.
            </p>
          </AnimatedElement>

          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-950 to-black py-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Team Blitz. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Back to Top
              </a>
              <a href="#faq" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
