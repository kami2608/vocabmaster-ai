import React from 'react';
import { ListChecks } from 'lucide-react';

interface QuizResultProps {
  score: number;
  total: number;
  onExit: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, total, onExit }) => (
  <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95">
    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
      <ListChecks size={40} />
    </div>
    <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Complete!</h2>
    <p className="text-slate-500 mb-8">Here is how you performed</p>
    <div className="bg-slate-50 rounded-xl p-6 mb-8">
      <div className="text-4xl font-bold text-indigo-600 mb-1">
        {Math.round((score / total) * 100)}%
      </div>
      <div className="text-slate-400 font-medium">
        {score} out of {total} correct
      </div>
    </div>
    <button
      onClick={onExit}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200"
    >
      Back to Dashboard
    </button>
  </div>
);

export default QuizResult;
