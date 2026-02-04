import React from 'react';
import { HelpCircle } from 'lucide-react';

interface NotEnoughCardsProps {
  onExit: () => void;
}

const NotEnoughCards: React.FC<NotEnoughCardsProps> = ({ onExit }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <HelpCircle size={48} className="text-slate-300 mb-4" />
    <h2 className="text-xl font-bold text-slate-800 mb-2">Not Enough Cards</h2>
    <p className="text-slate-500 mb-6">
      You need at least 4 words in your collection to start a practice session (to generate multiple
      choice options).
    </p>
    <button onClick={onExit} className="text-indigo-600 font-semibold hover:underline">
      Go back and add more words
    </button>
  </div>
);

export default NotEnoughCards;
