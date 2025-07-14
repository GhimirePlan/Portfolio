'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

export default function PlanBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hey! PlanBot here 😏 Powered by Plan Ghimire’s brain and way too many late nights. Ask me anything — I dare you.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the PlanBot API
      const response = await axios.post('/api/planbot', {
        message: input,
      });

      // Add bot response to chat
      const botMessage = {
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
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
                  <p className="text-sm">{message.text}</p>
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