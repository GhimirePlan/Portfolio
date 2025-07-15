'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
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

export default function PlanBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageId, setNewMessageId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session and load chat history when component mounts
  useEffect(() => {
    const currentSessionId = getSessionId();
    setSessionId(currentSessionId);
    
    // Load chat history if we have a session ID
    if (currentSessionId && messages.length === 0) {
      fetchChatHistory(currentSessionId);
    }
  }, [messages.length]);
  
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PlanBot</h1>
          <p className="text-gray-600 dark:text-gray-300">Don’t be shy — I can handle your weirdest questions and still keep my circuits cool. ❄️🤖</p>
        </div>
        
        {/* Chat container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="p-4 h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.map((message, index) => (
               <div
                 key={index}
                 className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div
                   className={`max-w-xs sm:max-w-md p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                 >
                   <p className="text-sm">
                     {message.animate && message.id === newMessageId ? (
                       <TypingAnimation text={message.text} />
                     ) : (
                       message.text
                     )}
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
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg disabled:opacity-50 flex items-center justify-center"
              disabled={!input.trim() || isLoading}
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mt-1">Created by Plan Ghimire</p>
        </div>
      </div>
    </div>
  );
}