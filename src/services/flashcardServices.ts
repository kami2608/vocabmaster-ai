import { CardStatus, Flashcard } from '@type-schema/flashcard';
import { supabase } from './supabase';

// Convert DB timestamp to JS timestamp
const dbToApp = (dbCard: any): Flashcard => ({
  id: dbCard.id,
  word: dbCard.word,
  phonetic: dbCard.phonetic,
  definition: dbCard.definition,
  example: dbCard.example,
  translation: dbCard.translation,
  status: dbCard.status,
  createdAt: new Date(dbCard.created_at).getTime(),
  lastReviewedAt: dbCard.last_reviewed_at ? new Date(dbCard.last_reviewed_at).getTime() : undefined,
});

export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(dbToApp);
};

export const createFlashcard = async (
  flashcard: Omit<Flashcard, 'id' | 'createdAt'>
): Promise<Flashcard> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      user_id: user.id,
      word: flashcard.word,
      phonetic: flashcard.phonetic || null,
      definition: flashcard.definition,
      example: flashcard.example,
      translation: flashcard.translation,
      status: flashcard.status || 'new',
      last_reviewed_at: flashcard.lastReviewedAt
        ? new Date(flashcard.lastReviewedAt).toISOString()
        : null,
    })
    .select()
    .single();

  if (error) throw error;
  return dbToApp(data);
};

export const updateFlashcard = async (
  id: string,
  updates: Partial<Omit<Flashcard, 'id' | 'createdAt'>>
): Promise<Flashcard> => {
  const dbUpdates: any = {};

  if (updates.word !== undefined) dbUpdates.word = updates.word;
  if (updates.phonetic !== undefined) dbUpdates.phonetic = updates.phonetic;
  if (updates.definition !== undefined) dbUpdates.definition = updates.definition;
  if (updates.example !== undefined) dbUpdates.example = updates.example;
  if (updates.translation !== undefined) dbUpdates.translation = updates.translation;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.lastReviewedAt !== undefined) {
    dbUpdates.last_reviewed_at = new Date(updates.lastReviewedAt).toISOString();
  }

  const { data, error } = await supabase
    .from('flashcards')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return dbToApp(data);
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  const { error } = await supabase.from('flashcards').delete().eq('id', id);

  if (error) throw error;
};

export const getFlashcardsByStatus = async (status: CardStatus): Promise<Flashcard[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(dbToApp);
};

export const getFlashcardsForReview = async (): Promise<Flashcard[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .order('last_reviewed_at', { ascending: true, nullsFirst: true });

  if (error) throw error;
  return data.map(dbToApp);
};

/**
 * Bulk insert flashcards for CSV import
 * Returns the number of successfully inserted rows
 */
export const bulkInsertFlashcards = async (
  flashcards: Array<Omit<Flashcard, 'id' | 'createdAt' | 'lastReviewedAt'>>
): Promise<number> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const insertData = flashcards.map((flashcard) => ({
    user_id: user.id,
    word: flashcard.word,
    phonetic: flashcard.phonetic || null,
    definition: flashcard.definition,
    example: flashcard.example || null,
    translation: flashcard.translation,
    status: flashcard.status || CardStatus.New,
    last_reviewed_at: null,
  }));

  const { data, error } = await supabase.from('flashcards').insert(insertData).select();

  if (error) throw error;
  return data?.length || 0;
};
