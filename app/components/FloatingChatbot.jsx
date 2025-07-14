'use client';

import { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import ChatbotModal from './ChatbotModal';

export default function FloatingChatbot() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Show tooltip after a delay when component mounts
  useEffect(() => {
    // Only show tooltip if modal is not open
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 2000);
      
      // Hide tooltip after some time
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 6000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isModalOpen]);

  // Toggle the chatbot modal
  const toggleChatbot = () => {
    setIsModalOpen(!isModalOpen);
    // Hide tooltip when opening modal
    if (!isModalOpen) {
      setShowTooltip(false);
    }
  };
  
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative">
          {/* Tooltip */}
          {showTooltip && !isModalOpen && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm rounded-lg shadow-lg transition-opacity duration-300 whitespace-nowrap">
              <div className="flex items-center space-x-1">
                <span>Chat with PlanBot</span>
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white dark:bg-gray-800 transform rotate-45"></div>
              </div>
            </div>
          )}
          
          {/* Pulse animation using custom animations from tailwind config */}
          <div className="absolute inset-0 rounded-full bg-primary-400 opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-primary-500 opacity-30 animate-pulse-slow"></div>
          
          {/* Button */}
          <button
            onClick={toggleChatbot}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative bg-gradient-to-r from-blue-600 to-primary-600 hover:from-blue-700 hover:to-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 hover-glow"
            aria-label="Open chatbot"
          >
            <FaRobot size={24} />
          </button>
        </div>
      </div>
      
      {/* Chatbot Modal */}
      <ChatbotModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}