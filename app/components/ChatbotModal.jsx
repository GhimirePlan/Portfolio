'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Function to get or create a session ID
const getSessionId = () => {
  // Check if we have a session ID in localStorage
  const storedSessionId = localStorage.getItem('chatSessionId');
  if (storedSessionId) {
    return storedSessionId;
  }
  
  // If not, create a new one
  const newSessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  localStorage.setItem('chatSessionId', newSessionId);
  return newSessionId;
};

// Typing animation component
const TypingAnimation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 15); // Speed of typing
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  
  return displayedText || ' ';
};

export default function ChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageId, setNewMessageId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session and load chat history when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentSessionId = getSessionId();
      setSessionId(currentSessionId);
      
      // Load chat history if we have a session ID
      if (currentSessionId && messages.length === 0) {
        fetchChatHistory(currentSessionId);
      } else if (messages.length === 0) {
        // Add welcome message if no history
        const welcomeMessageId = Date.now();
        setMessages([
          {
            id: welcomeMessageId,
            text: "Hey! PlanBot here 😏 Powered by Plan Ghimire's brain and way too many late nights. Ask me anything — I dare you.",
            sender: 'bot',
            timestamp: new Date(),
            animate: true,
          },
        ]);
        setNewMessageId(welcomeMessageId);
        
        // After animation completes, remove the animation flag
        const welcomeText = "Hey! PlanBot here 😏 Powered by Plan Ghimire's brain and way too many late nights. Ask me anything — I dare you.";
        setTimeout(() => {
          setNewMessageId(null);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === welcomeMessageId ? {...msg, animate: false} : msg
            )
          );
        }, welcomeText.length * 15 + 500);
      }
    }
  }, [isOpen, messages.length]);
  
  // Function to fetch chat history
  const fetchChatHistory = async (sid) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/chatbot/history?sessionId=${sid}`);
      const data = response.data;
      
      if (data.success && data.data.messages && data.data.messages.length > 0) {
        // Convert messages from DB format to component format
        const formattedMessages = data.data.messages.map((msg, index) => ({
          id: index + 1,
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp || Date.now()),
          animate: false
        }));
        setMessages(formattedMessages);
      } else {
        // If no history, add welcome message
        const welcomeMessageId = Date.now();
        setMessages([
          {
            id: welcomeMessageId,
            text: "Hey! PlanBot here 😏 Powered by Plan Ghimire's brain and way too many late nights. Ask me anything — I dare you.",
            sender: 'bot',
            timestamp: new Date(),
            animate: true,
          },
        ]);
        setNewMessageId(welcomeMessageId);
        
        // After animation completes, remove the animation flag
        const welcomeText = "Hey! PlanBot here 😏 Powered by Plan Ghimire's brain and way too many late nights. Ask me anything — I dare you.";
        setTimeout(() => {
          setNewMessageId(null);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === welcomeMessageId ? {...msg, animate: false} : msg
            )
          );
        }, welcomeText.length * 15 + 500);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Add welcome message if history fetch fails
      const welcomeMessageId = Date.now();
      setMessages([
        {
          id: welcomeMessageId,
          text: "Hey! PlanBot here 😏 Powered by Plan Ghimire's brain and way too many late nights. Ask me anything — I dare you.",
          sender: 'bot',
          timestamp: new Date(),
          animate: true,
        },
      ]);
      setNewMessageId(welcomeMessageId);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      animate: false, // User messages don't need typing animation
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the PlanBot API with session ID
      const response = await axios.post('/api/planbot', {
        message: input,
        sessionId: sessionId
      });

      // Store the session ID if it was returned
      if (response.data.data.sessionId) {
        setSessionId(response.data.data.sessionId);
        localStorage.setItem('chatSessionId', response.data.data.sessionId);
      }
      
      // Add bot response to chat
      const botMessageId = Date.now();
      const botMessage = {
        id: botMessageId,
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date(),
        animate: true, // Bot messages use typing animation
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setNewMessageId(botMessageId); // Set the new message ID for animation
      
      // After animation completes, remove the animation flag
      setTimeout(() => {
        setNewMessageId(null);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId ? {...msg, animate: false} : msg
          )
        );
      }, botMessage.text.length * 15 + 500); // Animation duration based on text length
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessageId = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMessageId,
          text: 'Sorry, I encountered an error. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
          animate: true,
        },
      ]);
      setNewMessageId(errorMessageId);
      
      // After animation completes, remove the animation flag
      setTimeout(() => {
        setNewMessageId(null);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === errorMessageId ? {...msg, animate: false} : msg
          )
        );
      }, 'Sorry, I encountered an error. Please try again later.'.length * 15 + 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-in-out]">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-xl h-[600px] flex flex-col transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 15px 5px rgba(96, 165, 250, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-600 to-primary-600 text-white">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FaRobot className="text-white" size={20} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-lg font-semibold">PlanBot</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none transition-transform duration-300 hover:scale-110"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-in-out]`}
            >
              <div
                className={`
                  max-w-xs sm:max-w-md p-3 rounded-lg shadow-md transition-all duration-300 
                  ${message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none transform hover:-translate-y-1' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none border-l-4 border-primary-500 transform hover:-translate-y-1'}
                `}
              >
                <p className="text-sm">
                  {message.animate && message.id === newMessageId 
                    ? <TypingAnimation text={message.text} /> 
                    : message.text}
                </p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md rounded-tl-none border-l-4 border-primary-500">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pl-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-gray-900 transition-all duration-300 shadow-sm"
              disabled={isLoading}
              autoFocus
            />
            {input.trim() && (
              <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-primary-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (input.length / 100) * 100)}%` }}>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-primary-600 hover:from-blue-700 hover:to-primary-700 text-white p-3 rounded-r-lg disabled:opacity-50 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md"
            disabled={!input.trim() || isLoading}
          >
            <FaPaperPlane size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </form>
      </div>
    </div>
  );
}