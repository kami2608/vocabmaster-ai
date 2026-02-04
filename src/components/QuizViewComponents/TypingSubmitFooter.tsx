import React from 'react';

interface TypingSubmitFooterProps {
  onCheck: (e: React.FormEvent) => void;
  disabled: boolean;
}

const TypingSubmitFooter: React.FC<TypingSubmitFooterProps> = ({ onCheck, disabled }) => (
  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
    <button
      onClick={onCheck}
      disabled={disabled}
      className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
    >
      Check Answer
    </button>
  </div>
);

export default TypingSubmitFooter;
