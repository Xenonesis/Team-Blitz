"use client";

import { useState, useEffect } from 'react';
import ProfileCard from '../components/ui/profilecard';
import adityaImage from '@/assets/team/1.png';
import swatiImage from '@/assets/team/swati.jpg';
import aayushImage from '@/assets/team/ayush.jpg';
import shivamImage from '@/assets/team/ashwani.jpg';
import prachiImage from '@/assets/team/prachi.jpg';
import ehshanImage from '@/assets/team/shivam.jpg';
import muneerImage from '@/assets/team/muneerali.jpg';

export default function Team() {
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    const tokenRefreshInterval = setInterval(() => {
      setRefreshToken(Date.now());
    }, 5 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshToken(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(tokenRefreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <section id="team" className="py-20 relative overflow-hidden" key={refreshToken}>
      <div className="absolute top-40 left-10 w-60 h-60 rounded-full bg-blue-500/5 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-indigo-500/5 animate-float delay-300"></div>

      <div className="container mx-auto px-6 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="text-gradient">Meet Our Team</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Team Member 1 - Aditya */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Aditya Kumar Tiwari"
                title="Team Leader & Developer"
                handle="Xenonesis"
                status="Online"
                contactText="Contact Me"
                avatarUrl={adityaImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/itisaddy/', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/itisaddy/', icon: 'linkedin' },
                  { url: 'https://github.com/Xenonesis', icon: 'github' },
                  { url: 'https://iaddy.netlify.app/', icon: 'portfolio' }
                ]}
              />
            </div>

            {/* Team Member 2 - Swati */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Swati Mishra"
                title="Developer"
                handle="SwatiMishra01"
                status="Online"
                contactText="Contact Me"
                avatarUrl={swatiImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/swati-mishra-8a5a18259', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/swati-mishra-8a5a18259', icon: 'linkedin' },
                  { url: 'https://github.com/SwatiMishra01', icon: 'github' }
                ]}
              />
            </div>

            {/* Team Member 3 - Aayush */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Aayush Tonk"
                title="Backend Engineer"
                handle="Amaayu"
                status="Online"
                contactText="Contact Me"
                avatarUrl={aayushImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/aayush-tonk/', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/aayush-tonk/', icon: 'linkedin' },
                  { url: 'https://github.com/Amaayu', icon: 'github' }
                ]}
              />
            </div>

            {/* Team Member 4 - Shivam */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Ashwani"
                title="UI/UX Developer"
                handle="Ashwani"
                status="Online"
                contactText="Contact Me"
                avatarUrl={shivamImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/shivam-verma-818222270', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/shivam-verma-818222270', icon: 'linkedin' }
                ]}
              />
            </div>

            {/* Team Member 5 - Prachi */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Prachi Upadhyay"
                title="Web Developer"
                handle="prachiupadhyay"
                status="Online"
                contactText="Contact Me"
                avatarUrl={prachiImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/prachi-upadhyay-926487301/', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/prachi-upadhyay-926487301/', icon: 'linkedin' }
                ]}
              />
            </div>

            {/* Team Member 6 - Mohammad */}
            <div className="flex justify-center px-4">
              <ProfileCard
                name="Mohammad Ehshan"
                title="UI/UX Designer"
                handle="Mohammad-Ehshan"
                status="Online"
                contactText="Contact Me"
                avatarUrl={ehshanImage.src}
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.open('https://www.linkedin.com/in/mohammad-ehshan-4362a0298/', '_blank')}
                socialLinks={[
                  { url: 'https://www.linkedin.com/in/mohammad-ehshan-4362a0298/', icon: 'linkedin' },
                  { url: 'https://github.com/Mohammad-Ehshan', icon: 'github' }
                ]}
              />
            </div>

            {/* Team Member 7 - Muneer */}
            <div className="flex justify-center px-4 col-span-full md:col-span-2">
              <div className="text-center">
                <ProfileCard
                  name="Muneer Ali"
                  title="Full Stack Developer"
                  handle="Muneerali199"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl={muneerImage.src}
                  showUserInfo={true}
                  enableTilt={true}
                  onContactClick={() => window.open('https://www.linkedin.com/in/muneer-ali', '_blank')}
                  socialLinks={[
                    { url: 'https://www.linkedin.com/in/muneer-ali', icon: 'linkedin' },
                    { url: 'https://github.com/Muneerali199', icon: 'github' }
                  ]}
                  className="text-center"
                />
                {/* Custom styling applied via parent div */}
                <style jsx>{`
                  .profile-card :global(.name) {
                    font-weight: bold;
                    font-size: 1.25rem;
                    color: #3b82f6;
                  }
                  .profile-card :global(.title) {
                    font-weight: medium;
                    font-size: 1.125rem;
                    color: #4b5563;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}