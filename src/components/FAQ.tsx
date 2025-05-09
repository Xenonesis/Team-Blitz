"use client";

import { useState } from "react";
import { AnimatedElement } from "@/utils/animations";

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  delay: number;
}

const FAQItem = ({ question, answer, isOpen, onClick, delay }: FAQItemProps) => {
  return (
    <AnimatedElement animation="slide-up" delay={delay} className="mb-4">
      <div
        className={`bg-[#3a4095] rounded-xl overflow-hidden transition-all duration-300 ${
          isOpen ? "shadow-lg shadow-blue-500/10" : ""
        }`}
      >
        <button
          onClick={onClick}
          className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
        >
          <h3 className="text-lg font-medium">{question}</h3>
          <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-5 pt-0 border-t border-[#4a50a5]">
            {typeof answer === "string" ? (
              <p className="text-white/90">{answer}</p>
            ) : (
              answer
            )}
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What services does Team Blitz offer?",
      answer: "Team Blitz specializes in developing innovative solutions for hackathons and real-world problems. Our services include web and mobile app development, UI/UX design, backend engineering, and AI/ML integration. We focus on creating high-quality, scalable, and user-friendly applications."
    },
    {
      question: "How can I collaborate with Team Blitz?",
      answer: "We're always open to collaboration opportunities! You can reach out to us through our contact form or directly via email. Whether you're looking for a team to join your hackathon, need technical expertise for your project, or want to discuss potential partnerships, we'd love to hear from you."
    },
    {
      question: "What technologies does Team Blitz work with?",
      answer: (
        <div>
          <p className="mb-3">We work with a wide range of modern technologies, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Frontend: React, Next.js, TypeScript, Tailwind CSS</li>
            <li>Backend: Node.js, Express, Python, Django, Java</li>
            <li>Mobile: React Native, Flutter</li>
            <li>Database: MongoDB, PostgreSQL, Firebase</li>
            <li>Cloud: AWS, Google Cloud, Azure</li>
            <li>AI/ML: TensorFlow, PyTorch, scikit-learn</li>
          </ul>
        </div>
      )
    },
    {
      question: "How does the hackathon team formation process work?",
      answer: "Our team formation process is based on complementary skills and shared interests. We typically assemble a balanced team with expertise in frontend, backend, design, and project management. If you're interested in joining us for a hackathon, reach out with your skills and interests, and we'll see if there's a good fit for upcoming events."
    },
    {
      question: "What has been Team Blitz's most successful project?",
      answer: "Our most successful project to date has been the SmartCity Platform, which won first place at the Urban Innovation Hackathon. This integrated platform connects various IoT devices across urban environments to create smarter, more efficient cities. The project was praised for its innovative approach to solving real urban challenges and its potential for scalability."
    },
    {
      question: "Does Team Blitz offer internship or learning opportunities?",
      answer: "Yes, we occasionally offer mentorship and learning opportunities for aspiring developers. These are typically project-based and allow participants to gain hands-on experience while working with our team. If you're interested, please reach out through our contact form with details about your background and learning goals."
    }
  ];

  return (
    <div className="w-full">
      <div className="space-y-2">
        {faqItems.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => toggleFAQ(index)}
            delay={100 + index * 50}
          />
        ))}
      </div>
    </div>
  );
}
