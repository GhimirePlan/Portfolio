import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, Suspense } from "react";
import { FaGraduationCap, FaUniversity } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { educations } from "@/utils/data/educations";
import Education3D from "./Education3D";

function EducationSection() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section className="py-20 relative overflow-hidden min-h-screen" ref={containerRef}>
      {/* Animated Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#60A5FA12,transparent)]" />
      
      {/* Content Container */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ scale, opacity }}
      >
        {/* Section Title with 3D Element */}
        <div className="relative mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399]"
          >
            Educational Journey
          </motion.h2>
          
          {/* 3D Element Container */}
          <div 
            className="w-full h-[400px] my-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Canvas
              camera={{ position: [0, 2, 5], fov: 45 }}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Education3D isHovered={isHovered} />
                <Environment preset="city" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 2.5}
                  maxPolarAngle={Math.PI / 2}
                  autoRotate
                  autoRotateSpeed={4}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Education Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {educations.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-8 border border-[#60A5FA]/10 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Card Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#60A5FA]/20 to-[#34D399]/20 text-[#60A5FA] transform group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#60A5FA] transition-colors duration-300">
                      {edu.title}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1">
                        <FaUniversity className="text-[#34D399]" />
                        <span>{edu.institution}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BsCalendarDate className="text-[#34D399]" />
                        <span>{edu.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/10 via-[#34D399]/10 to-[#60A5FA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#60A5FA] to-[#34D399] rounded-xl opacity-0 group-hover:opacity-15 blur transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default EducationSection; 