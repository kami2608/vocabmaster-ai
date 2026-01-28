import { CardStatus, Flashcard } from '@type-schema/common';

export const setStudyQueue = (cards: Flashcard[]) => {
  const learning = cards.filter((c) => c.status === CardStatus.Learning);
  const newCards = cards.filter((c) => c.status === CardStatus.New);
  const mastered = cards.filter((c) => c.status === CardStatus.Mastered);

  // Shuffle helper
  const shuffle = (array: Flashcard[]) => array.sort(() => Math.random() - 0.5);

  const queue = [...shuffle(learning), ...shuffle(newCards), ...shuffle(mastered)];

  return queue;
};
