import React from 'react';
import { BookOpen, Gamepad2, BrainCircuit } from 'lucide-react';
import { CardStatus } from '@type-schema/flashcard';
import StatsChart from '@components/StatsChart';
import { useNavigate } from '@tanstack/react-router';
import { useGetFlashcards } from '@apis/queries/flashcards';
import { CircularProgress } from '@mui/material';

const DashboardPage: React.FC = () => {
  const { data: flashcards, isLoading } = useGetFlashcards();
  const cards = flashcards ?? [];
  const navigate = useNavigate();

  const handleStartStudy = () => {
    navigate({ to: '/study' });
  };

  const handleStartPractice = () => {
    navigate({ to: '/practice' });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 flex flex-col items-center">
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-center w-full">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500 mt-2">You have {cards.length} words in your collection.</p>
        </div>
        <div className="flex gap-15 lg:gap-3">
          {cards.length > 0 && (
            <button
              onClick={handleStartStudy}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-transform hover:-translate-y-1 flex items-center gap-2"
            >
              <BookOpen size={20} />
              Start Review
            </button>
          )}
          {cards.length >= 4 && (
            <button
              onClick={handleStartPractice}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Gamepad2 size={20} />
              Practice Quiz
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px] md:max-w-full w-full">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Mastery Progress</h3>
          <StatsChart cards={cards} />
        </div>
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-1 opacity-90">Quick Stats</h3>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-indigo-500/30">
                <span className="text-indigo-100">Total Words</span>
                <span className="text-2xl font-bold">{cards.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-indigo-500/30">
                <span className="text-indigo-100">Mastered</span>
                <span className="text-2xl font-bold">
                  {cards.filter((c) => c.status === CardStatus.Mastered).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-100">To Review</span>
                <span className="text-2xl font-bold">
                  {cards.filter((c) => c.status === CardStatus.Learning).length}
                </span>
              </div>
            </div>
          </div>
          <BrainCircuit className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-500 opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
