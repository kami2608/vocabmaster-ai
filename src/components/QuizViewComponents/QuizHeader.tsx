import React from 'react';

interface QuizHeaderProps {
  currentIndex: number;
  total: number;
  onExit: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ currentIndex, total, onExit }) => (
  <div className="flex justify-between items-center mb-8">
    <button onClick={onExit} className="text-slate-400 hover:text-slate-600 font-medium">
      Cancel
    </button>
    <div className="flex items-center gap-2">
      <span className="text-slate-400 text-sm font-medium">
        Question {currentIndex + 1}/{total}
      </span>
      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  </div>
);

export default QuizHeader;
