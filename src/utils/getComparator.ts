import { Flashcard, Order } from '@type-schema/flashcard';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T | undefined) {
  if (orderBy === undefined) {
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const getComparator = <Key extends keyof Flashcard>(
  order: Order | undefined,
  orderBy: Key | undefined
): ((a: Flashcard, b: Flashcard) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};
