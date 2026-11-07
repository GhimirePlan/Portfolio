"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/utils/data/experience";
import {
  FaCode,
  FaMicrochip,
  FaNetworkWired,
  FaCog,
  FaLayerGroup,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";

const iconMap = {
  code: FaCode,
  chip: FaMicrochip,
  network: FaNetworkWired,
};

const getOffset = (index, active, total) => {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

export default function Experience() {
  const [active, setActive] = useState(1);
  const total = experiences.length;
  const selected = experiences[active];

  const goPrev = () => setActive((a) => (a - 1 + total) % total);
  const goNext = () => setActive((a) => (a + 1) % total);

  const dragX = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    didDrag.current = false;
    dragX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    setDragOffset(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 60;
    if (dragOffset > threshold) {
      goPrev();
    } else if (dragOffset < -threshold) {
      goNext();
    }
    setDragOffset(0);
  };

  const handlePointerLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setDragOffset(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#070b16]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-20 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-teal-500/70" />
            <span className="text-teal-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
              Experience & Journey
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-teal-500/70" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            What I{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
              Work With
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">
            Exploring software, electronics, and computer systems through hands-on development, academic work, and independent learning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Carousel panel */}
          <div className="relative bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/40 p-5 sm:p-8 shadow-2xl min-h-[460px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            {/* Glow under center card */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-8 bg-teal-400/40 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-3 bg-emerald-400/30 blur-2xl rounded-full pointer-events-none" />

            {/* 3D stage */}
            <div
              className="relative w-full h-[380px] flex items-center justify-center select-none touch-pan-y cursor-grab active:cursor-grabbing"
              style={{ perspective: "1200px" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            >
              {experiences.map((exp, index) => {
                const offset = getOffset(index, active, total);
                const isCenter = offset === 0;
                const Icon = iconMap[exp.icon] || FaCode;

                let tx = 0;
                let rotY = 0;
                let scale = 1;
                let opacity = 1;
                let zIndex = 1;

                if (offset === 0) {
                  tx = 0;
                  rotY = 0;
                  scale = 1;
                  zIndex = 10;
                } else if (offset === -1 || offset === total - 1) {
                  tx = -125;
                  rotY = 30;
                  scale = 0.84;
                  opacity = 0.6;
                  zIndex = 5;
                } else if (offset === 1 || offset === -(total - 1)) {
                  tx = 125;
                  rotY = -30;
                  scale = 0.84;
                  opacity = 0.6;
                  zIndex = 5;
                } else {
                  opacity = 0;
                  zIndex = 0;
                }

                const dragInfluence = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.4 : 0;
                const draggedX = tx + dragOffset * dragInfluence;

                return (
                  <motion.div
                    key={exp.id}
                    onClick={(e) => {
                      if (didDrag.current) return;
                      if (!isCenter) setActive(index);
                    }}
                    className="absolute"
                    style={{
                      width: "240px",
                      height: "340px",
                      transformStyle: "preserve-3d",
                      zIndex,
                    }}
                    animate={{
                      x: draggedX,
                      rotateY: rotY,
                      scale,
                      opacity,
                    }}
                    transition={
                      Math.abs(dragOffset) > 0
                        ? { duration: 0 }
                        : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ${
                        isCenter
                          ? "bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 border-2 border-teal-400 shadow-[0_0_50px_-8px_rgba(45,212,191,0.6),0_20px_60px_-15px_rgba(0,0,0,0.5)]"
                          : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/40 backdrop-blur-sm hover:border-teal-500/30"
                      }`}
                    >
                      {/* Top highlight line on center card */}
                      {isCenter && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                      )}

                      {/* Subtle inner glow for center card */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                          isCenter
                            ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/40"
                            : "bg-slate-700/40 text-slate-500"
                        }`}
                      >
                        {isCenter && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/30 to-transparent animate-pulse" />
                        )}
                        <Icon size={30} className="relative z-10" />
                      </div>

                      <h3
                        className={`font-bold text-xl mb-2.5 leading-tight tracking-tight transition-colors duration-300 ${
                          isCenter ? "text-white" : "text-slate-400"
                        }`}
                      >
                        {exp.title}
                      </h3>

                      <div
                        className={`w-10 h-0.5 rounded-full mb-3 transition-all duration-300 ${
                          isCenter ? "bg-gradient-to-r from-teal-400 to-emerald-400" : "bg-slate-700/50"
                        }`}
                      />

                      <p
                        className={`text-sm leading-relaxed mb-5 px-1 transition-colors duration-300 ${
                          isCenter ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {exp.tagline}
                      </p>

                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                          isCenter
                            ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                            : "bg-slate-700/40 text-slate-500 border border-slate-700/30"
                        }`}
                      >
                        {exp.duration}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Arrows */}
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 flex items-center justify-center hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-300 hover:scale-110 transition-all duration-200 backdrop-blur-sm shadow-lg"
            >
              <FaChevronLeft size={15} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 flex items-center justify-center hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-300 hover:scale-110 transition-all duration-200 backdrop-blur-sm shadow-lg"
            >
              <FaChevronRight size={15} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
              {experiences.map((exp, index) => (
                <button
                  key={exp.id}
                  onClick={() => setActive(index)}
                  aria-label={`Go to ${exp.title}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === active
                      ? "bg-teal-400 w-7 shadow-md shadow-teal-400/50"
                      : "bg-slate-600/70 w-2.5 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div className="relative bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/40 p-5 sm:p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
                    {(() => {
                      const Icon = iconMap[selected.icon] || FaCode;
                      return <Icon size={30} />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                      {selected.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaCalendarAlt size={13} className="text-teal-400" />
                      <span>{selected.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {selected.description}
                </p>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mb-6" />

                {/* Two columns */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Key Activities */}
                  <div>
                    <h4 className="flex items-center gap-2 text-teal-400 font-semibold mb-3">
                      <FaCog size={14} />
                      Key Activities
                    </h4>
                    <ul className="space-y-2.5">
                      {selected.activities.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.07 }}
                          className="flex items-start gap-2.5"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="flex items-center gap-2 text-teal-400 font-semibold mb-3">
                      <FaLayerGroup size={14} />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-slate-800/70 border border-teal-500/20 text-teal-200 rounded-full text-xs font-medium hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-100 transition-all duration-200 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Hint */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <span className="text-teal-400">👆</span>
          <p className="text-slate-500 text-sm">
            Drag or use arrows to explore different phases of my journey
          </p>
        </div>
      </div>
    </section>
  );
}
