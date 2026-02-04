import { Modal } from '@mui/material';
import { Flashcard } from '@type-schema/flashcard';
import { handleSpeech } from '@utils/hanleSpeech';
import { Volume2, X } from 'lucide-react';
import { FC } from 'react';

interface CardDetailProps {
  isOpen: boolean;
  onClose: () => void;
  word: Flashcard;
}

const CardDetailModal: FC<CardDetailProps> = ({ isOpen, onClose, word }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-10">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800 w-fit">{word.word}</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeech(word.word);
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Volume2 size={24} />
            </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">IPA Phonetic</label>
              <p className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                {word.phonetic}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Vietnamese Meaning
              </label>
              <p className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                {word.translation}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Definition</label>
            <p className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none">
              {word.definition}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Example Sentence</label>
            <p className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none">
              {word.example}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardDetailModal;
