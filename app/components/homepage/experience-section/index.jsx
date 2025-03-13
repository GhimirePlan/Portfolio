import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineBriefcase } from "react-icons/hi";
import { FaRegBuilding, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { BsCalendarDate, BsArrowRight } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";
import Link from "next/link";
import { experiences as experienceData } from "@/utils/data/experience";

const experiences = experienceData.map(exp => ({
  title: exp.role,
  company: exp.company,
  duration: exp.duration,
  description: exp.highlights,
  skills: exp.technologies,
  color: "#60A5FA",
  links: exp.links
}));

function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 relative overflow-hidden min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#60A5FA12,transparent)]" />
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399] mb-16"
        >
          Professional Experience
        </motion.h2>

        {/* Experience Cards Container */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Timeline */}
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveIndex(index)}
                className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                  activeIndex === index ? "z-10" : "z-0"
                }`}
              >
                <div className={`w-full p-6 rounded-xl transition-all duration-300 ${
                  activeIndex === index 
                    ? "bg-[#1E293B] border border-[#60A5FA]/20 shadow-lg shadow-[#60A5FA]/5" 
                    : "bg-[#1E293B]/50 hover:bg-[#1E293B]/80"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r from-[${exp.color}]/20 to-[#34D399]/20 transform transition-transform duration-300 group-hover:scale-110`}>
                      <HiOutlineBriefcase 
                        className="text-2xl"
                        style={{ color: exp.color }} 
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#60A5FA] transition-colors duration-300">
                      {exp.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <FaRegBuilding className="text-[#34D399]" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BsCalendarDate className="text-[#34D399]" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  {/* Quick Skills Preview */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${exp.color}15`,
                          color: exp.color 
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {exp.skills.length > 3 && (
                      <span className="text-gray-400 text-xs">+{exp.skills.length - 3} more</span>
                    )}
                  </div>

                  {/* Hover Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/10 via-[#34D399]/10 to-[#60A5FA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 bg-[#1E293B] rounded-xl p-8 border border-[#60A5FA]/10 shadow-xl backdrop-blur-xl"
          >
            <div className="relative">
              {/* Title Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 bg-clip-text">
                  {experiences[activeIndex].title}
                </h3>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaRegBuilding className="text-[#34D399]" />
                    <span>{experiences[activeIndex].company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsCalendarDate className="text-[#34D399]" />
                    <span>{experiences[activeIndex].duration}</span>
                  </div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-[#60A5FA] to-[#34D399] mt-4 rounded-full" />
              </div>

              {/* Highlights Section */}
              <div className="space-y-4 mb-6">
                {experiences[activeIndex].description.map((desc, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#34D399] mt-2" />
                    <p>{desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Project Links Section - Enhanced Visibility */}
              {(experiences[activeIndex].links?.github || 
                experiences[activeIndex].links?.live || 
                experiences[activeIndex].links?.demo) && (
                <div className="mb-8 bg-[#1E293B]/50 p-4 rounded-lg border border-[#60A5FA]/10 hover:border-[#60A5FA]/20 transition-all duration-300">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BiLinkExternal className="text-[#34D399]" />
                    Project Links
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {experiences[activeIndex].links?.github && (
                      <Link
                        href={experiences[activeIndex].links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1E293B] border-2 border-[#60A5FA]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#60A5FA]/40 hover:scale-105 transition-all duration-300 group/link"
                      >
                        <FaGithub className="text-xl text-[#60A5FA]" />
                        <span className="font-medium">GitHub</span>
                        <FaExternalLinkAlt className="text-xs opacity-50 group-hover/link:opacity-100 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all duration-300" />
                      </Link>
                    )}
                    
                    {experiences[activeIndex].links?.live && (
                      <Link
                        href={experiences[activeIndex].links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white font-medium hover:shadow-lg hover:shadow-[#60A5FA]/20 hover:scale-105 transition-all duration-300 group/link"
                      >
                        <BiLinkExternal className="text-xl" />
                        <span className="font-medium">Live Site</span>
                        <FaExternalLinkAlt className="text-xs opacity-50 group-hover/link:opacity-100 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all duration-300" />
                      </Link>
                    )}

                    {experiences[activeIndex].links?.demo && (
                      <Link
                        href={experiences[activeIndex].links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1E293B] border-2 border-[#34D399]/20 text-white hover:bg-[#1E293B]/80 hover:border-[#34D399]/40 hover:scale-105 transition-all duration-300 group/link"
                      >
                        <BsArrowRight className="text-xl text-[#34D399]" />
                        <span className="font-medium">View Demo</span>
                        <FaExternalLinkAlt className="text-xs opacity-50 group-hover/link:opacity-100 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all duration-300" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {experiences[activeIndex].skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: `${experiences[activeIndex].color}20`,
                        color: experiences[activeIndex].color 
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#60A5FA]/5 to-[#34D399]/5 rounded-xl blur-xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection; 