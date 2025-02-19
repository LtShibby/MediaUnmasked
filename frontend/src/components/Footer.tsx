import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 text-center text-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="mb-2 md:mb-0">
          © {new Date().getFullYear()}{" "}
          <a 
            href="https://wozwize.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            WozWize
          </a>. All Rights Reserved.
        </p>
        
        <div className="flex space-x-4">
          <a 
            href="https://wozwize.com/privacy-policy" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Privacy Policy
          </a>
          <a 
            href="https://wozwize.com/terms-of-service"
            target="_blank"
            rel="noopener noreferrer" 
            className="hover:text-white transition"
          >
            Terms of Service
          </a>
          <a 
            href="https://wozwize.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            About Us
          </a>
        </div>
      </div>
    </footer>
  );
}; 