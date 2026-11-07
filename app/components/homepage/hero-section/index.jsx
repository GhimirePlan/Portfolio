import { mergePersonalData } from "@/utils/data/personal-data";
import { useGithubData } from "@/utils/use-github-data";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import Typed from "react-typed";
import { useEffect } from 'react';

function HeroSection({ onLoad }) {
  const { data } = useGithubData();
  const profile = mergePersonalData(data?.profile);

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
    <div className="relative flex flex-col items-center justify-between w-full">
      {/* ── Hero background: deep navy engineering workspace ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Deep navy foundation with layered gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070c18] via-[#080e1e] to-[#0f172a]" />

        {/* Handcrafted PCB traces, network nodes, ambient light and subtle workspace detail */}
        <div className="absolute inset-0 bg-[url('/svg/hero-bg.svg')] bg-cover bg-bottom bg-no-repeat" />

        {/* Faint aura behind the code editor (preserves the original identity) */}
        <div className="absolute right-[6%] top-[22%] h-[26rem] w-[26rem] rounded-full bg-cyan-400/5 blur-[120px]" />
        <div className="absolute right-[22%] top-1/3 h-64 w-64 rounded-full bg-violet-500/5 blur-[130px]" />

        {/* Readability: keep the left text column dark and high-contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/85 to-transparent" />

        {/* Fade the top into the navbar area and the bottom into the page background */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070c18] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent" />
      </div>

      {/* Main Content */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-y-10 px-4 pt-10 pb-6 sm:px-6 sm:pt-12 sm:pb-8 lg:grid-cols-[45fr_55fr] lg:gap-12 lg:px-8 lg:pt-16 lg:pb-10 xl:gap-16">
        {/* Text Content */}
        <div className="order-2 flex flex-col items-start justify-center lg:order-1">
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-white/95 md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399] font-black">
              {profile.name}
            </span>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#60A5FA]/80 via-[#34D399]/80 to-[#3730A3]/80 my-4 rounded-full"></div>
            {`ECE `}
            <span className="text-[#34D399] font-semibold"> Student</span>
            <span className="text-[#60A5FA] font-semibold">  from Nepal</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
            {profile.description}
          </p>

          {/* Social Links */}
          <div className="my-8 flex items-center gap-5">
            {[
              { href: profile.linkedIn, icon: <BsLinkedin size={28} /> },
              { href: profile.github, icon: <BsGithub size={28} /> },
              { href: profile.facebook, icon: <FaFacebook size={28} /> },
              { href: profile.twitter, icon: <FaTwitterSquare size={28} /> },
            ].map(({ href, icon }, idx) => (
              <Link
                key={idx}
                href={href}
                target="_blank"
                className="text-slate-400 hover:text-[#34D399] transition-all duration-300 transform hover:scale-110"
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

            <Link href={profile.resume} target="_blank">
              <button className="flex items-center gap-2 bg-[#1E293B] border border-[#60A5FA]/20 px-6 py-3 rounded-lg text-white/90 font-medium tracking-wide hover:bg-[#1E293B]/80 hover:border-[#60A5FA]/30 hover:shadow-lg hover:shadow-[#60A5FA]/10 transition-all duration-300">
                Get Resume <MdDownload size={20} />
              </button>
            </Link>
          </div>
        </div>

        {/* Code-like Section */}
        <div className="order-1 relative w-full overflow-hidden rounded-lg border border-[#60A5FA]/10 bg-gradient-to-r from-[#0d1224] to-[#0a0d37] p-3 shadow-xl sm:p-4 md:p-6 lg:order-2">
          <div className="mb-3 flex items-center space-x-2 sm:mb-4">
            <div className="h-2 w-2 rounded-full bg-red-400 transition-colors hover:bg-red-500 sm:h-3 sm:w-3"></div>
            <div className="h-2 w-2 rounded-full bg-orange-400 transition-colors hover:bg-orange-500 sm:h-3 sm:w-3"></div>
            <div className="h-2 w-2 rounded-full bg-green-400 transition-colors hover:bg-green-500 sm:h-3 sm:w-3"></div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex items-start font-mono text-[11px] leading-relaxed sm:text-xs md:text-sm lg:text-[13px]">
              {/* Line numbers */}
              <div className="flex select-none flex-col items-end pr-3 text-gray-500 sm:pr-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>

              {/* Code */}
              <pre className="flex-1 text-white">
                <code className="block">
                  <span className="text-[#60A5FA]">class</span>{" "}
                  <span className="text-[#34D399]">Engineer</span>:
                  <br />
                  <span className="text-[#60A5FA]">    def</span>{" "}
                  <span className="text-[#34D399]">__init__</span>(
                  <span className="text-[#FCD34D]">self</span>):
                  <br />
                  <span className="text-[#60A5FA]">        self</span>.name ={" "}
                  <span className="text-[#FCD34D]">"Plan Ghimire"</span>
                  <br />
                  <span className="text-[#60A5FA]">        self</span>.role ={" "}
                  <span className="text-[#FCD34D]">"ECE Student"</span>
                  <br />
                  <span className="text-[#60A5FA]">        self</span>.interests = [
                  <br />
                  {"            "}
                  <span className="text-[#FCD34D]">"Embedded Systems"</span>,{" "}
                  <span className="text-[#FCD34D]">"Networking"</span>,
                  <br />
                  {"            "}
                  <span className="text-[#FCD34D]">"Machine Learning"</span>,{" "}
                  <span className="text-[#FCD34D]">"AI (Applied)"</span>]
                  <br />
                  <span className="text-[#60A5FA]">        self</span>.goal ={" "}
                  <span className="text-[#FCD34D]">"Build, Learn, and Solve"</span>
                  <br />
                  <br />
                  <span className="text-[#60A5FA]">    def</span>{" "}
                  <span className="text-[#34D399]">is_hirable</span>(
                  <span className="text-[#FCD34D]">self</span>):
                  <br />
                  <span className="text-[#60A5FA]">        return</span>{" "}
                  <span className="text-[#60A5FA]">self</span>.goal{" "}
                  <span className="text-[#60A5FA]">and</span>{" "}
                  <span className="text-[#60A5FA]">len</span>(
                  <span className="text-[#60A5FA]">self</span>.interests){" "}
                  <span className="text-[#60A5FA]">&gt;=</span>{" "}
                  <span className="text-[#FCD34D]">3</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

