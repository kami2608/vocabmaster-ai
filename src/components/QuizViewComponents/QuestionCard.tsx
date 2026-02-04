import React from 'react';
import { ListChecks, Keyboard } from 'lucide-react';
import { Flashcard } from '@type-schema/flashcard';

interface QuestionCardProps {
  type: 'mcq' | 'typing';
  word: string;
  translation: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ type, word, translation }) => (
  <>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
      {type === 'mcq' ? (
        <>
          <ListChecks size={14} /> Multiple Choice
        </>
      ) : (
        <>
          <Keyboard size={14} /> Typing
        </>
      )}
    </div>
    <h3 className="text-xl text-slate-600 font-medium mb-2">
      {type === 'mcq'
        ? 'What is the meaning of this word?'
        : 'Type the English word for this meaning:'}
    </h3>
    <div className="text-3xl font-bold text-slate-800 mb-8">
      {type === 'mcq' ? (
        <span className="text-indigo-600">{word}</span>
      ) : (
        <span className="text-slate-700">"{translation}"</span>
      )}
    </div>
  </>
);

export default QuestionCard;
