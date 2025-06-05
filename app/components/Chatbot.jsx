'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaVolumeUp, FaLanguage } from 'react-icons/fa';
import axios from 'axios';
import { initSpeechSupport } from '../../utils/chatbot-nlp';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [feedback, setFeedback] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupport, setSpeechSupport] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  // Initialize speech support on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const speech = initSpeechSupport();
      setSpeechSupport(speech);
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chatbot open/closed
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time
      setMessages([
        {
          text: "Hi there! I'm Plan's AI assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (!speechSupport || !speechSupport.browserSupport.speechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    setIsListening(true);
    const recognition = speechSupport.recognition;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  // Toggle voice output
  const toggleVoiceOutput = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  // Cycle through available languages
  const cycleLanguage = () => {
    const languages = ['english', 'spanish', 'french'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  // Provide feedback on a bot message
  const provideFeedback = (messageIndex, isHelpful) => {
    // Find the user query that preceded this bot message
    const botMessage = messages[messageIndex];
    let userQuery = '';
    
    // Look for the most recent user message before this bot message
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        userQuery = messages[i].text;
        break;
      }
    }
    
    if (userQuery && botMessage) {
      setFeedback({
        previousQuery: userQuery,
        previousResponse: botMessage.text,
        isHelpful
      });
      
      // Update the message to show feedback was given
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...botMessage,
        feedback: isHelpful ? 'helpful' : 'not-helpful'
      };
      setMessages(updatedMessages);
    }
  };

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
      // Call the chatbot API with session ID and any feedback
      const response = await axios.post('/api/chatbot', {
        query: input,
        sessionId,
        feedback: feedback
      });

      // Reset feedback after it's been sent
      setFeedback(null);

      // Add bot response to chat
      const botMessage = {
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date(),
        language: response.data.data.language || 'english'
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      // If voice output is enabled, speak the response
      if (voiceEnabled && speechSupport && speechSupport.browserSupport.speechSynthesis) {
        speechSupport.speak(botMessage.text);
      }
      
      // Update detected language
      if (response.data.data.language) {
        setLanguage(response.data.data.language);
      }
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
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRobot size={20} />
              <h3 className="font-medium">Plan's Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language toggle */}
              <button
                onClick={cycleLanguage}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Change language"
                title={`Current language: ${language}`}
              >
                <FaLanguage size={20} />
              </button>
              
              {/* Voice output toggle */}
              <button
                onClick={toggleVoiceOutput}
                className={`text-white hover:text-gray-200 transition-colors ${voiceEnabled ? 'opacity-100' : 'opacity-50'}`}
                aria-label={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
                title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              >
                <FaVolumeUp size={18} />
              </button>
              
              {/* Close button */}
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chatbot"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50 dark:bg-gray-900">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {message.language && message.language !== 'english' && (
                      <span className="ml-2 italic">{message.language}</span>
                    )}
                  </p>
                  
                  {/* Feedback buttons for bot messages */}
                  {message.sender === 'bot' && !message.feedback && (
                    <div className="flex space-x-2 mt-1">
                      <button 
                        onClick={() => provideFeedback(index, true)}
                        className="text-xs text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                      >
                        👍 Helpful
                      </button>
                      <button 
                        onClick={() => provideFeedback(index, false)}
                        className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        👎 Not helpful
                      </button>
                    </div>
                  )}
                  
                  {/* Show feedback status if given */}
                  {message.feedback && (
                    <div className="text-xs mt-1">
                      {message.feedback === 'helpful' ? (
                        <span className="text-green-500">👍 Marked as helpful</span>
                      ) : (
                        <span className="text-red-500">👎 Marked as not helpful</span>
                      )}
                    </div>
                  )}
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
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white text-gray-900"
              disabled={isLoading || isListening}
            />
            
            {/* Voice input button */}
            {speechSupport && speechSupport.browserSupport.speechRecognition && (
              <button
                type="button"
                onClick={startListening}
                className={`p-2 ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white disabled:opacity-50`}
                disabled={isLoading}
                title="Voice input"
              >
                <FaMicrophone size={16} />
              </button>
            )}
            
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-2 rounded-r-lg disabled:opacity-50"
              disabled={!input.trim() || isLoading}
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;