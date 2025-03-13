'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import ExperienceCard3D from './ExperienceCard3D';
import { useInView } from 'react-intersection-observer';
import { experiences } from '@/utils/data/experience';
import Image from 'next/image';

export default function Experience() {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const detailsVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden min-h-screen">
      {/* Background Image */}
      <Image
        src="/hero.svg"
        alt="Background"
        width={1572}
        height={795}
        className="absolute -top-[100px] -z-10 opacity-80"
      />

      {/* Background Animated Nodes */}
      <div className="absolute inset-0 -z-20">
        <svg className="w-full h-full animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6ec7" />
              <stop offset="100%" stopColor="#5b68ff" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="200" fill="url(#grad)" opacity="0.1" />
        </svg>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={`absolute rounded-full blur-xl opacity-75 animate-pulse transition-transform duration-1000 ${
              index % 2 === 0 ? "bg-gradient-to-r from-pink-500 to-indigo-600" : "bg-gradient-to-r from-green-400 to-blue-500"
            } ${index === 0 ? "top-10 left-20 w-24 h-24" : index === 1 ? "top-40 left-10 w-20 h-20" : index === 2 ? "bottom-20 right-10 w-16 h-16" : index === 3 ? "bottom-30 left-10 w-18 h-18" : index === 4 ? "top-40 right-20 w-22 h-22" : index === 5 ? "top-60 left-60 w-28 h-28" : index === 6 ? "top-30 right-30 w-18 h-18" : index === 7 ? "bottom-30 left-50 w-14 h-14" : index === 8 ? "top-50 left-10 w-20 h-20" : index === 9 ? "bottom-10 right-20 w-16 h-16" : index === 10 ? "top-5 right-5 w-22 h-22" : "bottom-20 right-40 w-16 h-16"}`}
          ></div>
        ))}
      </div>

      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#60A5FA12,transparent)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399] mb-4">
              Professional Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore my professional experience through this interactive 3D timeline
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 3D Experience Cards */}
          <div className="h-[510px] relative bg-[#1E293B]/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-[#60A5FA]/10">
            <Canvas
              ref={canvasRef}
              dpr={[1, 2]}
              camera={{ position: [0, 0, 12], fov: 50 }}
              gl={{ antialias: true }}
            >
              <color attach="background" args={['#0f172a']} />
              <fog attach="fog" args={['#0f172a', 5, 25]} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={2}
                castShadow
              />

              <group position={[0, 0, 0]}>
                {experiences.map((exp, index) => (
                  <ExperienceCard3D
                    key={exp.company}
                    experience={exp}
                    position={[index * 4 - (experiences.length - 1) * 2, 0, 0]}
                    rotation={[0, 0, 0]}
                    onClick={() => {
                      setSelectedExperience(exp);
                      setActiveIndex(index);
                    }}
                  />
                ))}
              </group>

              <OrbitControls
                enableZoom={false}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI / 2.5}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
              />
              <Stars count={1000} depth={50} fade speed={1.5} />
              <Environment preset="city" />
            </Canvas>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {experiences.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-[#60A5FA] w-4'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Experience Details */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {selectedExperience && (
                <motion.div
                  key={selectedExperience.company}
                  variants={detailsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-8 bg-[#1E293B]/50 backdrop-blur-xl rounded-2xl border border-[#60A5FA]/10 shadow-xl"
                >
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedExperience.company}
                  </h3>
                  <p className="text-[#60A5FA] text-xl mb-4">{selectedExperience.role}</p>
                  <p className="text-gray-400 mb-6">{selectedExperience.duration}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Overview</h4>
                      <p className="text-gray-400">{selectedExperience.description}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Key Highlights</h4>
                      <ul className="space-y-2">
                        {selectedExperience.highlights.map((highlight, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-gray-400"
                          >
                            <span className="w-2 h-2 bg-[#60A5FA] rounded-full mr-2" />
                            {highlight}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExperience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[#60A5FA]/20 text-[#60A5FA] rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedExperience && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center text-gray-500"
              >
                👈 Select a card to view details
              </motion.div>
            )}
          </div>
        </div>

        {/* Interactive hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          ✨ Drag to rotate the view and click cards to explore
        </motion.p>
      </motion.div>
    </section>
  );
}