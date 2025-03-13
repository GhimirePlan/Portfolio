"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GlowCard from "../../helper/glow-card";
import { personalData } from "@/utils/data/personal-data";
import { FaUser } from "react-icons/fa";

function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      id="about"
      className="relative z-50 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="relative group">
          {/* Interactive gradient border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#60A5FA] rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#60A5FA] rounded-lg opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          
          <GlowCard key={1} identifier={1}>
            <div className="relative p-6 sm:p-8 lg:p-12">
              {/* About Me Ribbon */}
              <motion.div
                className="hidden lg:flex flex-col items-center absolute top-10 -right-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-gradient-to-b from-[#1a1443] to-[#2a1f5d] text-white rotate-90 p-2 px-5 text-xl rounded-md shadow-lg flex items-center gap-2">
                  <FaUser className="text-[#16f2b3]" />
                  <span>ABOUT ME</span>
                </div>
                <div className="h-36 w-[2px] bg-gradient-to-b from-[#1a1443] to-[#2a1f5d]"></div>
              </motion.div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Text Section */}
                <motion.div
                  className="order-2 lg:order-1"
                  variants={textVariants}
                >
                  <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="w-12 h-[2px] bg-gradient-to-r from-[#16f2b3] to-transparent"></div>
                    <h2 className="font-bold text-[#16f2b3] text-lg sm:text-xl uppercase tracking-wider">
                      Who I am?
                    </h2>
                  </motion.div>
                  <motion.p
                    className="text-gray-300 text-sm sm:text-base md:text-lg text-justify leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {personalData.description}
                  </motion.p>
                </motion.div>

                {/* Profile Image Section */}
                <motion.div
                  className="flex justify-center order-1 lg:order-2"
                  variants={imageVariants}
                >
                  <div className="relative group">
                    {/* Image glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#60A5FA] to-[#34D399] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#60A5FA] to-[#34D399] rounded-lg opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <Image
                        src={personalData.profile}
                        width={280}
                        height={280}
                        alt="Plan Ghimire"
                        className="rounded-lg transition-all duration-700 grayscale hover:grayscale-0 group-hover:scale-105 no-drag shadow-xl"
                        onDragStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        priority
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutSection;
