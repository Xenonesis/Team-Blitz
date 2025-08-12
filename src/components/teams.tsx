"use client"

export default function Team() {
  return (
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
                        <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.98 0 47.876 47.876 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 15.473v1.827a1.5 1.5 0 002.147 1.338c.135-.066.34-.087.524-.087h6.658c.183 0 .389.021.524.087A1.5 1.5 0 0018 16.8v-1.827zm0 0a48.4 48.4 0 01-7.666 3.282.75.75 0 01-.692-.124 49.902 49.902 0 01-2.997-2.15.75.75 0 01-.117-.825 49.742 49.742 0 012.997-2.15.75.75 0 01.692-.124 48.4 48.4 0 017.666 3.282.75.75 0 01.117.825 49.902 49.902 0 01-2.997 2.15.75.75 0 01-.692.124 48.4 48.4 0 01-7.666-3.282.75.75 0 01-.117-.825 49.902 49.902 0 012.997-2.15.75.75 0 01.692-.124 48.4 48.4 0 017.666 3.282.75.75 0 01.117.825 49.902 49.902 0 01-2.997 2.15z" />
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

            {/* Team Member 6 - Mohammad Ehshan */}
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
                <p className="text-blue-300 mb-4">UI/UX Designer</p>
                <p className="text-sm">Expert in designing intuitive and visually appealing user interfaces, with a focus on enhancing user experience.</p>
              </div>
            </div>

            {/* Team Member 7 - Muneer Ali */}
            <div className="glass-effect rounded-xl overflow-hidden group hover-scale">
              <div className="h-64 relative overflow-hidden bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-teal-500/30 mb-2 flex items-center justify-center overflow-hidden border-2 border-white/30">
                    {/* Web developer avatar */}
                    <div className="w-full h-full flex items-center justify-center text-white opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                        <path d="M16.5 6a3 3 0 00-3-3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V10.5a3 3 0 00-3-3H9a3 3 0 01-3-3zm1.5 12a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V6A1.5 1.5 0 016 4.5h7.5A1.5 1.5 0 0115 6v1.5h3a1.5 1.5 0 011.5 1.5V18z" />
                        <path fillRule="evenodd" d="M7.5 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75v-4.5zm1.5.75v3h6v-3H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm opacity-70">Muneer Ali</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex space-x-3">
                    <a href="https://www.linkedin.com/in/muneer-ali" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="LinkedIn profile" title="LinkedIn profile">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="https://github.com/Muneerali199" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors" aria-label="GitHub profile" title="GitHub profile">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Muneer Ali</h3>
                <p className="text-blue-300 mb-4">Full Stack Developer</p>
                <p className="text-sm">Web3 enthusiast skilled in building dynamic, responsive applications with expertise in front-end and back-end development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}