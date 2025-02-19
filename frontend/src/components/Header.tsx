import { FC } from 'react';
import { Navbar } from './Navbar';

interface Props {
  onNavigate: (page: 'home' | 'analyze') => void;
  currentPage: 'home' | 'analyze';
}

export const Header: FC<Props> = ({ onNavigate, currentPage }) => {
  return (
    <header className="mb-4 sm:mb-8 sticky top-0 z-50">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
    </header>
  );
}; 