// src/hooks/useFlashcards.ts
import { Flashcard } from '@type-schema/common';
import * as flashcardServices from '@services/flashcardServices';
import { useState, useEffect } from 'react';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const data = await flashcardServices.getAllFlashcards();
      setFlashcards(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const addFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => {
    try {
      const newCard = await flashcardServices.createFlashcard(flashcard);
      setFlashcards((prev) => [newCard, ...prev]);
      return newCard;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateFlashcard = async (
    id: string,
    updates: Partial<Omit<Flashcard, 'id' | 'createdAt'>>
  ) => {
    try {
      const updated = await flashcardServices.updateFlashcard(id, updates);
      setFlashcards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      await flashcardServices.deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    flashcards,
    loading,
    error,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refetch: fetchFlashcards,
  };
};
