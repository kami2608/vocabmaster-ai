export enum CardStatus {
  New = 'NEW',
  Learning = 'LEARNING',
  Mastered = 'MASTERED',
}

export const cardStatusOptions = [
  { value: CardStatus.New, label: 'New' },
  { value: CardStatus.Mastered, label: 'Mastered' },
  { value: CardStatus.Learning, label: 'Learning' },
];
export interface Flashcard {
  id: string;
  word: string;
  phonetic?: string;
  definition: string;
  example: string;
  translation: string; // Vietnamese translation
  status: CardStatus;
  createdAt: number;
  lastReviewedAt?: number;
}

export interface GeneratedContent {
  definition: string;
  example: string;
  translation: string;
  phonetic: string;
}

export type Order = 'asc' | 'desc';

export interface DatabaseFlashcard {
  id: string;
  user_id: string;
  word: string;
  phonetic: string | null;
  definition: string;
  example: string;
  translation: string;
  status: CardStatus;
  created_at: string;
  last_reviewed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: DatabaseFlashcard;
        Insert: Omit<DatabaseFlashcard, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DatabaseFlashcard, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}
