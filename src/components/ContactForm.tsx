"use client";

import { useState } from "react";
import { AnimatedElement } from "@/utils/animations";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    website: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      website: "",
      subject: "",
      message: ""
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Website validation (optional)
    if (formData.website.trim() && !/^https?:\/\/.+\..+/.test(formData.website.trim())) {
      newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
      valid = false;
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      valid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        website: "",
        subject: "",
        message: ""
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#2a3080] p-6 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[#3a4095] border ${
              errors.name ? "border-red-500" : "border-[#4a50a5]"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
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
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[#3a4095] border ${
              errors.email ? "border-red-500" : "border-[#4a50a5]"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Website Field (Optional) */}
      <div className="mb-6">
        <label htmlFor="website" className="block text-sm font-medium mb-2 text-white">
          Website <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-[#3a4095] border ${
            errors.website ? "border-red-500" : "border-[#4a50a5]"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white`}
          placeholder="https://www.example.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-500">{errors.website}</p>
        )}
      </div>

      {/* Subject Field */}
      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-[#3a4095] border ${
            errors.subject ? "border-red-500" : "border-[#4a50a5]"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white`}
          placeholder="What is this regarding?"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-3 bg-[#3a4095] border ${
            errors.message ? "border-red-500" : "border-[#4a50a5]"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white`}
          placeholder="Your message here..."
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all duration-300
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <AnimatedElement animation="fade-in" className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200">
          Your message has been sent successfully! We'll get back to you soon.
        </AnimatedElement>
      )}

      {/* Error Message */}
      {submitError && (
        <AnimatedElement animation="fade-in" className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
          {submitError}
        </AnimatedElement>
      )}
    </form>
  );
}
