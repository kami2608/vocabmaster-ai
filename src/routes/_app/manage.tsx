import { createFileRoute } from '@tanstack/react-router';
import ManagePage from '@pages/ManagePage';

export const Route = createFileRoute('/_app/manage')({
  component: ManagePage,
});
