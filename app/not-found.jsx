'use client';

// @flow strict

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FaHome, FaKeyboard, FaMobileAlt } from 'react-icons/fa';
import { BiGame } from 'react-icons/bi';

// Dynamically import the 3D game component with no SSR
const DinoGame3D = dynamic(() => import('./components/404/DinoGame3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-bounce text-[#60A5FA]">Loading Game...</div>
    </div>
  ),
});

export default function NotFound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('dinoGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

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
    setGameOver(false);
  };

  const handleRestartGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setTimeout(() => {
      setScore(0);
      setIsPlaying(true);
    }, 100);
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#60A5FA12,transparent)]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399]"
        >
          404
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-300 mb-8"
        >
          Oops! Looks like you've ventured into the digital desert
        </motion.p>

        {/* Game Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden border border-[#60A5FA]/20 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <DinoGame3D 
            isPlaying={isPlaying} 
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
          />
          
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm">
              {showInstructions && !gameOver && (
                <div className="mb-8 text-gray-300">
                  <h3 className="text-xl font-semibold mb-4 text-white">How to Play</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <FaKeyboard className="text-[#60A5FA]" />
                      <span>Space / Up Arrow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMobileAlt className="text-[#60A5FA]" />
                      <span>Tap Screen</span>
                    </div>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="mb-8 text-gray-300">
                  <h3 className="text-3xl font-bold mb-2 text-[#60A5FA]">Game Over!</h3>
                  <p className="text-xl mb-4">Score: {score}</p>
                  <p className="text-sm">High Score: {highScore}</p>
                </div>
              )}
              
              <button
                onClick={gameOver ? handleRestartGame : handleStartGame}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white font-bold text-xl hover:shadow-lg hover:shadow-[#60A5FA]/20 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <BiGame className="text-2xl" />
                {gameOver ? 'Try Again' : 'Start Game'}
              </button>
            </div>
          )}

          {/* Score Display */}
          {isPlaying && !gameOver && (
            <div className="absolute top-4 right-4 flex gap-4">
              <div className="px-4 py-2 rounded-full bg-[#1E293B] border border-[#60A5FA]/20 text-white">
                Score: {score}
              </div>
              <div className="px-4 py-2 rounded-full bg-[#1E293B] border border-[#34D399]/20 text-white">
                Best: {highScore}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Link 
            href="/"
            className="px-6 py-3 rounded-full bg-[#1E293B] border-2 border-[#60A5FA]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#60A5FA]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <FaHome className="text-[#60A5FA]" />
            Return Home
          </Link>
          
          {isPlaying && !gameOver && (
            <button
              onClick={handleRestartGame}
              className="px-6 py-3 rounded-full bg-[#1E293B] border-2 border-[#34D399]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#34D399]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <BiGame className="text-[#34D399]" />
              Restart Game
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}