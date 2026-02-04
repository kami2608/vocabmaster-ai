import { Link } from '@tanstack/react-router';
import { BookA, Gamepad2, LayoutDashboard, Library, Upload } from 'lucide-react';
import { FC } from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: (path: string) => boolean;
}

const HamburgerButton: FC<HamburgerButtonProps> = ({ isOpen, setIsOpen, isActive }) => {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
          <span
            className={`block h-0.5 w-full bg-[rgba(74,35,64,0.8)] transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-[rgba(74,35,64,0.8)] transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-[rgba(74,35,64,0.8)] transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <nav className="flex-1 px-4 space-y-2 fixed top-20 left-0 right-0 bg-white shadow-md pb-2">
          <Link
            onClick={() => setIsOpen(false)}
            to="/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/study"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/study') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <BookA size={20} />
            Study
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/practice"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/practice') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Gamepad2 size={20} />
            Practice
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/manage"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/manage') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Library size={20} />
            Word List
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/import"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/import') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Upload size={20} />
            Import CSV
          </Link>
        </nav>
      )}
    </>
  );
};

export default HamburgerButton;
