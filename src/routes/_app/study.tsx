import { createFileRoute } from '@tanstack/react-router';
import StudyPage from '@pages/StudyPage';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { CardStatus } from '@type-schema/common';
import { setStudyQueue } from '@utils/setStudyQueue';
import { useGetFlashcards } from '@apis/queries/flashcards';
import { useUpdateFlashcard } from '@apis/mutations/flashcards';
import { CircularProgress } from '@mui/material';

export const Route = createFileRoute('/_app/study')({
  component: StudyComponent,
});

function StudyComponent() {
  const { data, isLoading } = useGetFlashcards();
  const flashcards = data ?? [];
  const { mutate } = useUpdateFlashcard();
  const navigate = useNavigate();

  const studyQueue = setStudyQueue(flashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const nextCard = () => {
    if (currentCardIndex < studyQueue.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const handleResult = (id: string, success: boolean) => {
    mutate({
      id: id,
      updates: {
        status: success ? CardStatus.Mastered : CardStatus.Learning,
        lastReviewedAt: Date.now(),
      },
    });

    if (nextCard()) {
      // Continue to next card
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  if (isLoading) return <CircularProgress />;

  if (studyQueue.length === 0) {
    return <p className="text-center">No cards available to study! Add some new cards first.</p>;
  }

  return (
    <StudyPage
      studyQueue={studyQueue}
      currentCardIndex={currentCardIndex}
      onResult={handleResult}
    />
  );
}
