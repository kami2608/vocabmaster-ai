import React from 'react';
import { Flashcard } from '@type-schema/flashcard';
import FlashcardView from '@components/FlashcardView';

interface StudyPageProps {
  studyQueue: Flashcard[];
  currentCardIndex: number;
  onResult: (id: string, success: boolean) => void;
}

const StudyPage: React.FC<StudyPageProps> = ({ studyQueue, currentCardIndex, onResult }) => {
  if (studyQueue.length === 0 || currentCardIndex >= studyQueue.length) {
    return null;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="text-slate-400 font-medium">
          Card {currentCardIndex + 1} of {studyQueue.length}
        </div>
      </div>

      <FlashcardView card={studyQueue[currentCardIndex]} onResult={onResult} />

      <p className="mt-8 text-slate-400 text-sm text-center">
        Reviewing helps transfer memory from short-term to long-term.
      </p>
    </div>
  );
};

export default StudyPage;
