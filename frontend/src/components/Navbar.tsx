import { FC } from 'react';

interface Props {
  onNavigate: (page: 'home' | 'analyze') => void;
  currentPage: 'home' | 'analyze';
}

export const Navbar: FC<Props> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="bg-white/50 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 gap-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <div 
              onClick={() => onNavigate('home')} 
              className="cursor-pointer"
            >
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MediaUnmask
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Unmask media bias with AI-powered analysis
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <NavLink 
              isActive={currentPage === 'home'}
              onClick={() => onNavigate('home')}
            >
              Our Mission
            </NavLink>
            <NavLink 
              isActive={currentPage === 'analyze'}
              onClick={() => onNavigate('analyze')}
            >
              Analyze Articles
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavLink: FC<NavLinkProps> = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium
        transition-colors duration-200
        ${isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }
      `}
    >
      {children}
    </button>
  );
}; 