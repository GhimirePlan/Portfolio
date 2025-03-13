'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FaWifi, FaGamepad, FaTrophy, FaHistory } from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';

// Dynamically import the game component
const DinoGame3D = dynamic(() => import('../components/404/DinoGame3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-bounce text-[#60A5FA]">Loading Game...</div>
    </div>
  ),
});

export default function OfflinePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [lastOnline, setLastOnline] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load high score and game history from localStorage
    const savedHighScore = localStorage.getItem('dinoGameHighScore');
    const savedHistory = localStorage.getItem('dinoGameHistory');
    const lastOnlineTime = localStorage.getItem('lastOnlineTime');

    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
    if (lastOnlineTime) {
      const timeAgo = getTimeAgo(new Date(lastOnlineTime));
      setLastOnline(timeAgo);
    }
  }, []);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'just now';
  };

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('dinoGameHighScore', newScore.toString());
    }
  };

  const handleStartGame = () => {
    setIsPlaying(true);
    setShowInstructions(false);
    setScore(0);
    setShowHistory(false);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    // Save game to history
    const newHistory = [
      { score, date: new Date().toISOString() },
      ...gameHistory.slice(0, 9) // Keep only last 10 games
    ];
    setGameHistory(newHistory);
    localStorage.setItem('dinoGameHistory', JSON.stringify(newHistory));
  };

  const handleRetryConnection = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#60A5FA12,transparent)]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <FaWifi className="text-6xl text-[#60A5FA] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">You're Offline</h1>
          <p className="text-gray-400 mb-2">But don't worry, you can still play the game!</p>
          {lastOnline && (
            <p className="text-sm text-gray-500">Last online: {lastOnline}</p>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-6 mb-6"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <FaTrophy className="text-yellow-500" />
            <span>High Score: {highScore}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FaGamepad className="text-[#60A5FA]" />
            <span>Games Played: {gameHistory.length}</span>
          </div>
        </motion.div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden border border-[#60A5FA]/20 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          {showHistory ? (
            <div className="p-6 h-full overflow-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Game History</h2>
              <div className="space-y-4">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 rounded-lg bg-[#1E293B] border border-[#60A5FA]/20"
                  >
                    <span className="text-gray-300">Score: {game.score}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(game.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DinoGame3D
              isPlaying={isPlaying}
              onScoreUpdate={handleScoreUpdate}
              onGameOver={handleGameOver}
            />
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={handleRetryConnection}
            className="px-6 py-3 rounded-full bg-[#1E293B] border-2 border-[#60A5FA]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#60A5FA]/40 transition-all duration-300 flex items-center gap-2"
          >
            <BiRefresh className="text-[#60A5FA]" />
            Retry Connection
          </button>
          {!isPlaying && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-6 py-3 rounded-full bg-[#1E293B] border-2 border-[#34D399]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#34D399]/40 transition-all duration-300 flex items-center gap-2"
            >
              <FaHistory className="text-[#34D399]" />
              {showHistory ? 'Back to Game' : 'View History'}
            </button>
          )}
          {!isPlaying && !showHistory && (
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white font-bold hover:shadow-lg hover:shadow-[#60A5FA]/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaGamepad />
              Start Game
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
} 