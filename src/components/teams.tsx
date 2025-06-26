"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/ui/profilecard';
import adityaImage from '@/assets/team/1.png';
import swatiImage from '@/assets/team/swati.jpg';
import aayushImage from '@/assets/team/ayush.jpg';
import shivamImage from '@/assets/team/ashwani.jpg';
import prachiImage from '@/assets/team/prachi.jpg';
import ehshanImage from '@/assets/team/joker.jpg';
import muneerImage from '@/assets/team/muneerali.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hoverHidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export default function Team() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(loadTimer);
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

  const renderAnimatedText = (text: string, custom: number, cardId: number) => (
    <motion.span 
      custom={custom}
      initial="hidden"
      animate={hoveredCard === cardId ? "hoverHidden" : "visible"}
      variants={textVariants}
    >
      {text}
    </motion.span>
  );

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      <div className="absolute top-40 left-10 w-60 h-60 rounded-full bg-blue-500/5 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-indigo-500/5 animate-float delay-300"></div>

      <div className="container mx-auto px-6 relative">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gradient">Meet Our Team</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Team Member 1 - Aditya */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Aditya Kumar Tiwari", 0, 1)}
                title={renderAnimatedText("Team Leader & Developer", 1, 1)}
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
            </motion.div>

            {/* Team Member 2 - Swati */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Swati Mishra", 0.2, 2)}
                title={renderAnimatedText("Developer", 0.3, 2)}
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
            </motion.div>

            {/* Team Member 3 - Aayush */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Aayush Tonk", 0.4, 3)}
                title={renderAnimatedText("Backend Engineer", 0.5, 3)}
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
            </motion.div>

            {/* Team Member 4 - Shivam */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Ashwani", 0.6, 4)}
                title={renderAnimatedText("UI/UX Developer", 0.7, 4)}
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
            </motion.div>

            {/* Team Member 5 - Prachi */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(5)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Prachi Upadhyay", 0.8, 5)}
                title={renderAnimatedText("Web Developer", 0.9, 5)}
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
            </motion.div>

            {/* Team Member 6 - Mohammad */}
            <motion.div 
              className="flex justify-center px-4" 
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(6)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProfileCard
                name={renderAnimatedText("Mohammad Ehshan", 1.0, 6)}
                title={renderAnimatedText("UI/UX Designer", 1.1, 6)}
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
            </motion.div>

            {/* Team Member 7 - Muneer */}
            <motion.div 
              className="flex justify-center px-4 col-span-full md:col-span-2" 
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.6
                  }
                }
              }}
              onMouseEnter={() => setHoveredCard(7)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center">
                <ProfileCard
                  name={renderAnimatedText("Muneer Ali", 1.2, 7)}
                  title={renderAnimatedText("Full Stack Developer", 1.3, 7)}
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
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}