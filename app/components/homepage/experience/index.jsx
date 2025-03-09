'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import ExperienceCard3D from './ExperienceCard3D';
import { useInView } from 'react-intersection-observer';
import { experiences } from '@/utils/data/experience';

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
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Professional Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore my professional experience through this interactive 3D timeline
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 3D Experience Cards */}
          <div className="h-[510px] relative bg-black/20 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
            <Canvas
              ref={canvasRef}
              dpr={[1, 2]}
              camera={{ position: [0, 0, 12], fov: 50 }}
              gl={{ antialias: true }}
            >
              <color attach="background" args={['#000']} />
              <fog attach="fog" args={['#000', 5, 25]} />
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
                      ? 'bg-indigo-500 w-4'
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
                  className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
                >
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedExperience.company}
                  </h3>
                  <p className="text-indigo-400 text-xl mb-4">{selectedExperience.role}</p>
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
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2" />
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
                            className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
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