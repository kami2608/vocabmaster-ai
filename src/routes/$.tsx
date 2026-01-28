import { createFileRoute, Link } from '@tanstack/react-router';
import { LayoutDashboard, Library } from 'lucide-react';

export const Route = createFileRoute('/$')({
  component: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-6xl font-bold text-indigo-600">404</div>
      <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="text-slate-500 max-w-md">
        The page you're looking for doesn't exist. Please navigate to one of the available pages.
      </p>
      <div className="flex gap-4 mt-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link
          to="/manage"
          className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
        >
          <Library size={20} />
          Word List
        </Link>
      </div>
    </div>
  );
}
