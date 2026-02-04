import { BrainCircuit } from 'lucide-react';

export default function LeftSideHero() {
  return (
    <div className="md:w-1/2 bg-indigo-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VocabAI</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 leading-tight">Master English Vocabulary Faster.</h2>
        <p className="text-indigo-100 leading-relaxed">
          Use AI-powered flashcards and spaced repetition to remember words forever. Join thousands
          of learners today.
        </p>
      </div>
      <div className="relative z-10 mt-12 md:mt-0">
        <div className="flex items-center gap-4 text-sm font-medium text-indigo-200">
          <div className="h-px bg-indigo-400 w-8"></div>
          Welcome Back
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-0 -left-10 w-40 h-40 bg-indigo-400 rounded-full opacity-30 blur-2xl"></div>
    </div>
  );
}
