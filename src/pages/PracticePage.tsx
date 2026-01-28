import React from 'react';
import QuizView from '@components/QuizView';
import { useGetFlashcards } from '@apis/queries/flashcards';
import { CircularProgress } from '@mui/material';

const PracticePage: React.FC = () => {
  const { data: flashcards, isLoading } = useGetFlashcards();

  if (!flashcards || (flashcards && flashcards.length < 4)) {
    return <p className="text-center">You need at least 4 cards to practice!</p>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
      {isLoading ? <CircularProgress /> : <QuizView cards={flashcards} />}
    </div>
  );
};

export default PracticePage;
