import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import Sidebar from '@components/Sidebar';
import { AppProvider } from '@context/AppContext';
import { LogOut } from 'lucide-react';
import { supabase } from '@services/supabase';
import { useAuth } from '@context/AuthContext';
import { queryClient } from '@apis/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        throw redirect({ to: '/login' });
      }
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-y-auto h-screen">
            <div className="max-w-5xl mx-auto p-6 lg:p-10">
              <Outlet />
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: '/login' });
                }}
                className="w-fit px-2 py-1 bg-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent text-slate-600 rounded-md font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 fixed z-10 bottom-2 lg:bottom-8 right-6"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </main>
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}
