import { BrainCircuit } from 'lucide-react';

export default function RightSideHero() {
  return (
    <div className="md:w-1/2 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VocabAI</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 leading-tight">Start Your Journey.</h2>
        <p className="text-slate-400 leading-relaxed">
          Create an account to save your progress, access your flashcards from anywhere, and track
          your learning milestones.
        </p>
      </div>

      <div className="relative z-10 mt-12 md:mt-0">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          <div className="h-px bg-slate-700 w-8"></div>
          Join for free
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-10 -right-10 w-64 h-64 bg-indigo-900 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-10 left-10 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-2xl"></div>
    </div>
  );
}
