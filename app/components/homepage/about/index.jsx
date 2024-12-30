"use client";

import Image from "next/image";
import GlowCard from "../../helper/glow-card";
import { personalData } from "@/utils/data/personal-data";

function Experience() {
  return (
    <div id="about" className="relative z-50 mt-8">
      
      <div>
        <GlowCard key={1} identifier={1}>
          <div className="relative p-4 sm:p-6 lg:p-8 my-10 lg:my-16">
            {/* About Me Ribbon */}
            <div className="hidden lg:flex flex-col items-center absolute top-10 -right-8">
              <span className="bg-[#1a1443] text-white rotate-90 p-2 px-5 text-xl rounded-md shadow-lg">
                ABOUT ME
              </span>
              <span className="h-36 w-[2px] bg-[#1a1443]"></span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text Section */}
              <div className="order-2 lg:order-1">
                <p className="font-medium text-[#16f2b3] text-lg sm:text-xl uppercase mb-5">
                  Who I am?
                </p>
                <p className="text-gray-200 text-sm sm:text-base md:text-lg text-justify animate__animated animate__fadeInRight">
                  {personalData.description}
                </p>
              </div>

              {/* Profile Image Section */}
              <div className="flex justify-center order-1 lg:order-2 animate__animated animate__fadeInRight"> 
    <Image
        src={personalData.profile}
        width={240}
        height={240}
        alt="Plan Ghimire"
        className="hover:grayscale rounded-lg transition-transform duration-700 hover:grayscale hover:scale-105 no-drag"
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
    />
</div>


            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

export default Experience;
