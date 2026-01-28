import { useMutation } from '@tanstack/react-query';
import { Flashcard } from '@type-schema/common';
import * as flashcardServices from '@services/flashcardServices';
import { queryClient } from '@apis/queryClient';

export const useAddFlashcard = () => {
  return useMutation<Flashcard, Error, Omit<Flashcard, 'id' | 'createdAt'>>({
    mutationFn: (flashcard) => flashcardServices.createFlashcard(flashcard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
};

export const useUpdateFlashcard = () => {
  return useMutation<
    Flashcard,
    Error,
    { id: string; updates: Partial<Omit<Flashcard, 'id' | 'createdAt'>> }
  >({
    mutationFn: ({ id, updates }) => flashcardServices.updateFlashcard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
};

export const useDeleteFlashcard = () => {
  return useMutation<void, Error, string>({
    mutationFn: (id) => flashcardServices.deleteFlashcard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
};
