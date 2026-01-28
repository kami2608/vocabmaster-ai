import { useQuery } from '@tanstack/react-query';
import { Flashcard } from '@type-schema/common';
import * as flashcardServices from '@services/flashcardServices';

export const useGetFlashcards = () => {
  return useQuery<Flashcard[], Error>({
    queryKey: ['flashcards'],
    queryFn: () => flashcardServices.getAllFlashcards(),
  });
};
