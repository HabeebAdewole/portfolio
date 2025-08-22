import { Mail, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Habeeb.<span className="text-purple-400">dev</span>
          </h2>
          <p>Computer Science Student |</p>
          <p>Software Developer | Academic</p>
          <p>Tutor</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:text-purple-400">Home</a></li>
            <li><a href="#about" className="hover:text-purple-400">About Me</a></li>
            <li><a href="#projects" className="hover:text-purple-400">Projects</a></li>
            <li><a href="#blog" className="hover:text-purple-400">Blog</a></li>
            <li><a href="#contact" className="hover:text-purple-400">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <Mail size={18} />
              <a href="mailto:brightopeyemi4@gmail.com" className="hover:text-purple-400">
                brightopeyemi4@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Github size={18} />
              <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                GitHub Profile
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Linkedin size={18} />
              <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                LinkedIn Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div>
        <span className="text-sm font-">
          © 2025 Habeeb Adewole. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
