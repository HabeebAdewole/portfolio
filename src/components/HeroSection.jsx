import React from 'react';
import { FaGithub, FaLinkedinIn, FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-purple-50 to-white">
      <div className="relative mb-6 ">
        <img
          src="/profile.jpg" //replace this with the actual image path
          alt="Adewole Habeeb Adebola"
          className="w-75 h-75 rounded-full border-4 border-white shadow-xl"
        />
        <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs font-medium w-35 h-10 px-2 py-1 rounded-full">
          Developer
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        ADEWOLE HABEEB ADEBOLA
      </h1>

      <p className="text-purple-700 font-semibold text-sm sm:text-base mb-4">
        Computer Science Student | Software Developer | Academic Tutor
      </p>

      <p className="max-w-xl text-gray-600 text-sm sm:text-base mb-6">
        Passionate about building innovative software solutions and sharing knowledge through teaching.
        Constantly exploring new technologies and striving for excellence in every project.
      </p>

      <div className="flex gap-4">
        <a
          href="#projects"
          className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm hover:bg-purple-700 transition"
        >
          View My Work
        </a>
        <a
          href="#contact"
          className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full text-sm hover:bg-purple-50 transition"
        >
          Get In Touch
        </a>
      </div>
      
      

        {/* Inside return: */}
        <div className="mt-6 flex flex-col items-center space-y-6">
            <div className="flex space-x-6 text-2xl text-gray-700">
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="hover:text-purple-600 transition" />
                </a>
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                    <FaLinkedinIn className="hover:text-purple-600 transition" />
                </a>
            </div>
            <div>
                <a href="#about">
                    <FaArrowDown className="text-purple-600 text-lg animate-bounce" />
                </a>
            </div>
        </div>

    </section>
  );
};

export default Hero;
