import React from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizFooterProps {
  isCorrect: boolean;
  isLast: boolean;
  onNext: () => void;
}

const QuizFooter: React.FC<QuizFooterProps> = ({ isCorrect, isLast, onNext }) => (
  <div
    className={`p-4 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} animate-in slide-in-from-bottom-4`}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <CheckCircle /> Correct!
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <XCircle /> Incorrect
          </div>
        )}
      </div>
      <button
        onClick={onNext}
        className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5
          ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        `}
      >
        {isLast ? 'Finish' : 'Next Question'}
        <ArrowRight size={18} />
      </button>
    </div>
  </div>
);

export default QuizFooter;
