import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 text-center text-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 space-y-3 sm:space-y-0">
        <p className="mb-2 sm:mb-0 text-xs sm:text-sm">
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
        
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm">
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