import SignupPage from '@pages/SignupPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});
