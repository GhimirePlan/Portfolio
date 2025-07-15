// @flow strict
import { personalData } from '@/utils/data/personal-data';
import Link from 'next/link';
import { BiLogoLinkedin } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { FaFacebook, FaCalendarAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub, IoMdCall } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import { useState } from 'react';
import ContactForm from './contact-form';

function ContactSectionContent() {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  
  // Function to generate Google Calendar event URL
  const createGoogleCalendarEvent = () => {
    const title = encodeURIComponent('Meeting with Plan Ghimire');
    const details = encodeURIComponent('Discuss project opportunities and collaboration');
    const location = encodeURIComponent('Google Meet');
    
    // Use current date + 30 minutes for the meeting start time
    const now = new Date();
    const startTime = new Date(now.getTime() + 30*60000);
    startTime.setMinutes(Math.ceil(startTime.getMinutes() / 30) * 30);
    startTime.setSeconds(0);
    
    // Set meeting duration to 30 minutes
    const endTime = new Date(startTime.getTime() + 30*60000);
    
    // Format dates for Google Calendar
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startTimeStr = formatDate(startTime);
    const endTimeStr = formatDate(endTime);
    
    // Add Plan Ghimire's email as a guest
    const guests = encodeURIComponent(personalData.email);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTimeStr}/${endTimeStr}&add=${guests}`;
  };
  
  return (
    <div id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
      <div className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      
      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-blue-500 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Meeting with Plan Ghimire</h3>
            
            <div className="space-y-4">
              <a 
                href={createGoogleCalendarEvent()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-all duration-300"
              >
                <FaCalendarAlt size={20} />
                Schedule via Google
              </a>
            </div>
            
            <button 
              onClick={() => {
                setShowMeetingModal(false);
              }}
              className="mt-6 w-full border border-gray-400 text-gray-300 hover:bg-gray-700 py-2 px-4 rounded-md transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <ContactForm />
          <div className="lg:w-3/4">
            <div className="flex flex-col gap-5 lg:gap-9">
              <p className="text-sm md:text-xl flex items-center gap-3">
                <MdAlternateEmail
                  className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={36}
                />
                <span>{personalData.email}</span>
              </p>
              <p className="text-sm md:text-xl flex items-center gap-3">
                <IoMdCall
                  className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={36}
                />
                <span>
                  {personalData.phone}
                </span>
              </p>
              <p className="text-sm md:text-xl flex items-center gap-3">
                <CiLocationOn
                  className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={36}
                />
                <span>
                  {personalData.address}
                </span>
              </p>
              <button 
                onClick={() => setShowMeetingModal(true)}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
              >
                <FaCalendarAlt size={20} />
                <span className="font-medium">Schedule a meeting</span>
              </button>
            </div>
            <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
              <Link target="_blank" href={personalData.github}>
                <IoLogoGithub
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
              <Link target="_blank" href={personalData.linkedIn}>
                <BiLogoLinkedin
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
              <Link target="_blank" href={personalData.twitter}>
                <FaXTwitter
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
              {/* <Link target="_blank" href={personalData.stackOverflow}>
                <FaStackOverflow
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                /> */}
              {/* </Link> */}
              <Link target="_blank" href={personalData.facebook}>
                <FaFacebook
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSectionContent;