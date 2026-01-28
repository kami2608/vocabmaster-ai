import { supabase } from '@services/supabase';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        throw redirect({ to: '/dashboard' });
      }
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-slate-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
