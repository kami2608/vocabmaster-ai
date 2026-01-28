import { createFileRoute } from '@tanstack/react-router';
import PracticePage from '@pages/PracticePage';

export const Route = createFileRoute('/_app/practice')({
  component: PracticePage,
});
