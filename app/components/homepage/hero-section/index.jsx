import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import Typed from "react-typed";

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between py-6 lg:py-14 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero.svg"
        alt="Hero"
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

      {/* Main Content */}
    {/* Main Content */}
    <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        {/* Text Content */}
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center px-4 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is <span className="text-pink-500">{personalData.name}</span>, <br />
            <span className="text-[#16f2b3]">
              Student 
            </span>
          </h1>
          {/* Social Links */}
          <div className="my-8 flex items-center gap-5">
            {[ 
              { href: personalData.linkedIn, icon: <BsLinkedin size={30} /> },
              { href: personalData.github, icon: <BsGithub size={30} /> },
              { href: personalData.facebook, icon: <FaFacebook size={30} /> },
              { href: personalData.twitter, icon: <FaTwitterSquare size={30} /> },
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
              <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 rounded-full text-white text-sm font-semibold uppercase hover:shadow-lg transition-transform transform hover:scale-105">
                Contact Me <RiContactsFill size={20} />
              </button>
            </Link>

            <Link href={personalData.resume} target="_blank">
              <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 rounded-full text-white text-sm font-semibold uppercase hover:shadow-lg transition-transform transform hover:scale-105">
                Get Resume <MdDownload size={20} />
              </button>
            </Link>
          </div>
        </div>

        {/* Code-like Section */}
        <div className="order-1 lg:order-2 relative bg-gradient-to-r from-[#0d1224] to-[#0a0d37] rounded-lg p-6">
          <div className="flex items-center mb-4 space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>

          <pre className="text-xs md:text-sm lg:text-base font-mono leading-relaxed text-white">
    <code>
        {`class Coder:
    def __init__(self, name, skills, hard_worker, quick_learner,
     problem_solver):
        self.name = Plan Ghimire
        self.skills = ['JavaScript', 'React', 'Python', 'C++', 'C']
        self.hard_worker = true
        self.quick_learner = true
        self.problem_solver = true

    def is_hireable(self):
        return self.hard_worker and self.problem_solver >= 5
`}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
