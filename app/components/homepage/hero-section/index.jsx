import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import Typed from "react-typed";
import { useEffect } from 'react';

function HeroSection({ onLoad }) {
  useEffect(() => {
    // Call onLoad when the component mounts
    const handleLoad = () => {
      if (onLoad) onLoad();
    };

    // Check if the hero image is loaded
    const heroImage = document.querySelector('img[src="/hero.svg"]');
    
    if (heroImage) {
      if (heroImage.complete) {
        handleLoad();
      } else {
        heroImage.addEventListener('load', handleLoad);
        return () => heroImage.removeEventListener('load', handleLoad);
      }
    } else {
      // If no hero image found, just call onLoad
      handleLoad();
    }
  }, [onLoad]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full mt-10">
      {/* Background Image */}
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        priority
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
            className={`absolute rounded-full blur-xl opacity-75 animate-pulse-slow transition-transform duration-500 ${
              index % 2 === 0 ? "bg-gradient-to-r from-pink-500 to-indigo-600" : "bg-gradient-to-r from-green-400 to-blue-500"
            } ${index === 0 ? "top-10 left-20 w-32 h-32" : index === 1 ? "top-40 left-10 w-28 h-28" : index === 2 ? "bottom-20 right-10 w-24 h-24" : index === 3 ? "bottom-30 left-10 w-26 h-26" : index === 4 ? "top-40 right-20 w-30 h-30" : index === 5 ? "top-60 left-60 w-36 h-36" : index === 6 ? "top-30 right-30 w-26 h-26" : index === 7 ? "bottom-30 left-50 w-22 h-22" : index === 8 ? "top-50 left-10 w-28 h-28" : index === 9 ? "bottom-10 right-20 w-24 h-24" : index === 10 ? "top-5 right-5 w-30 h-30" : "bottom-20 right-40 w-24 h-24"}`}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        {/* Text Content */}
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center px-4 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white/95 md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399] font-black">
              {personalData.name}
            </span>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#60A5FA]/80 via-[#34D399]/80 to-[#3730A3]/80 my-4 rounded-full"></div>
            {`ECE `}
            <span className="text-[#34D399] font-semibold"> Student</span>
            <span className="text-[#60A5FA] font-semibold">  from Nepal</span>
          </h1>

          {/* Social Links */}
          <div className="my-8 flex items-center gap-5">
            {[
              { href: personalData.linkedIn, icon: <BsLinkedin size={28} /> },
              { href: personalData.github, icon: <BsGithub size={28} /> },
              { href: personalData.facebook, icon: <FaFacebook size={28} /> },
              { href: personalData.twitter, icon: <FaTwitterSquare size={28} /> },
            ].map(({ href, icon }, idx) => (
              <Link
                key={idx}
                href={href}
                target="_blank"
                className="transition-transform transform hover:scale-125 duration-400 text-red-300"
              >
                {icon}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="#contact">
              <button className="flex items-center gap-2 bg-gradient-to-r from-[#60A5FA] to-[#34D399] px-6 py-3 rounded-lg text-white font-medium tracking-wide hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300">
                Contact Me <RiContactsFill size={20} />
              </button>
            </Link>

            <Link href={personalData.resume} target="_blank">
              <button className="flex items-center gap-2 bg-[#1E293B] border border-[#60A5FA]/20 px-6 py-3 rounded-lg text-white/90 font-medium tracking-wide hover:bg-[#1E293B]/80 hover:border-[#60A5FA]/30 hover:shadow-lg hover:shadow-[#60A5FA]/10 transition-all duration-300">
                Get Resume <MdDownload size={20} />
              </button>
            </Link>
          </div>
        </div>

        {/* Code-like Section */}
        <div className="order-1 lg:order-2 relative bg-gradient-to-r from-[#0d1224] to-[#0a0d37] rounded-lg p-3 sm:p-4 md:p-6 w-full overflow-x-auto shadow-xl border border-[#60A5FA]/10">
          <div className="flex items-center mb-2 sm:mb-4 space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full hover:bg-red-500 transition-colors"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full hover:bg-orange-500 transition-colors"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full hover:bg-green-500 transition-colors"></div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 text-gray-500 select-none text-[10px] xs:text-xs sm:text-sm lg:text-base">
              <div className="flex flex-col items-end pr-2 space-y-[0.3rem]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>

            <pre className="text-[10px] xs:text-xs sm:text-sm lg:text-base font-mono leading-relaxed text-white pl-10">
              <code className="block">
                <span className="text-[#60A5FA]">class</span>{" "}
                <span className="text-[#34D399]">Coder</span>:
                <br />
                <span className="text-[#60A5FA]">    def</span>{" "}
                <span className="text-[#34D399]">__init__</span>(
                <span className="text-[#FCD34D]">self</span>, name, skills, hard_worker, quick_learner,
                <br />
                {"     problem_solver"})<span>:</span>
                <br />
                <span className="text-[#60A5FA]">        self</span>.name ={" "}
                <span className="text-[#FCD34D]">Plan Ghimire</span>
                <br />
                <span className="text-[#60A5FA]">        self</span>.skills = [
                <span className="text-[#FCD34D]">'JavaScript'</span>,{" "}
                <span className="text-[#FCD34D]">'React'</span>,{" "}
                <span className="text-[#FCD34D]">'Python'</span>,{" "}
                <span className="text-[#FCD34D]">'C++'</span>,{" "}
                <span className="text-[#FCD34D]">'C'</span>]
                <br />
                <span className="text-[#60A5FA]">        self</span>.hard_worker ={" "}
                <span className="text-[#34D399]">true</span>
                <br />
                <span className="text-[#60A5FA]">        self</span>.quick_learner ={" "}
                <span className="text-[#34D399]">true</span>
                <br />
                <span className="text-[#60A5FA]">        self</span>.problem_solver ={" "}
                <span className="text-[#34D399]">true</span>
                <br />
                <br />
                <span className="text-[#60A5FA]">    def</span>{" "}
                <span className="text-[#34D399]">is_hireable</span>(
                <span className="text-[#FCD34D]">self</span>):
                <br />
                <span className="text-[#60A5FA]">        return</span>{" "}
                <span className="text-[#60A5FA]">self</span>.hard_worker{" "}
                <span className="text-[#60A5FA]">and</span>{" "}
                <span className="text-[#60A5FA]">self</span>.problem_solver{" "}
                <span className="text-[#60A5FA]">&gt;=</span>{" "}
                <span className="text-[#FCD34D]">5</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

