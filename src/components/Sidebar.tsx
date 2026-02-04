import React, { useState } from 'react';
import { LayoutDashboard, Library, BrainCircuit, Plus, Gamepad2, BookA, Upload } from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useAppContext } from '@context/AppContext';
import AddCardModal from './AddCardModal';
import HamburgerButton from './HamburgerButton';

const Sidebar: React.FC = () => {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { flashcards } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:h-screen flex flex-col sticky top-0 z-10">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BrainCircuit size={20} />
            </div>
            <span className="text-xl font-bold text-slate-800">VocabAI</span>
          </div>
          <div className="lg:hidden">
            <HamburgerButton
              isOpen={isMenuMobileOpen}
              setIsOpen={setIsMenuMobileOpen}
              isActive={isActive}
            />
          </div>
        </div>

        <nav className="hidden lg:block flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            to="/study"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/study') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <BookA size={20} />
            Study
          </Link>
          <Link
            to="/practice"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/practice') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Gamepad2 size={20} />
            Practice
          </Link>
          <Link
            to="/manage"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/manage') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Library size={20} />
            Word List
          </Link>
          <Link
            to="/import"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/import') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Upload size={20} />
            Import CSV
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Word
          </button>
        </div>
      </aside>

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={flashcards.addFlashcard}
      />
    </>
  );
};

export default Sidebar;
