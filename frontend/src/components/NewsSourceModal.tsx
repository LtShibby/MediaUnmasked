import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
}

export const NewsSourceModal: React.FC<NewsSourceModalProps> = ({ isOpen, onClose, domain }) => {
  const handleContactClick = () => {
    window.open('https://wozwize.com/contact', '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Top Pattern */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="p-6">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Unrecognized News Source
              </h3>

              {/* Message */}
              <p className="text-gray-600 text-center mb-4">
                {domain && <span className="font-medium text-indigo-600 block mb-2">{domain}</span>}
                We currently support major news outlets like BBC, NYTimes, Reuters, and many more trusted sources.
              </p>
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Think this source should be added? Let us know via our Contact page!
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg 
                           transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={handleContactClick}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                           hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg 
                           transition-all duration-200"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 