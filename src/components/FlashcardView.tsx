import React, { useEffect, useState } from 'react';
import { Flashcard } from '@type-schema/flashcard';
import { RotateCw, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { handleSpeech } from '@utils/hanleSpeech';

interface FlashcardViewProps {
  card: Flashcard;
  onResult: (id: string, success: boolean) => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  return (
    <div
      className="w-full max-w-md mx-auto perspective-1000 h-130 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">
            Word
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2 text-center">{card.word}</h2>
          {card.phonetic && (
            <span className="text-slate-500 font-mono text-lg mb-6">{card.phonetic}</span>
          )}
          <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
            <RotateCw size={14} /> Tap to flip
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeech(card.word);
            }}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 rounded-2xl shadow-xl text-white flex flex-col p-8">
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-indigo-200 text-xs uppercase tracking-wider font-bold">
                Definition
              </span>
              <p className="text-xl font-medium leading-relaxed">{card.definition}</p>
            </div>

            <div className="mb-6">
              <span className="text-indigo-200 text-xs uppercase tracking-wider font-bold">
                Example
              </span>
              <p className="text-indigo-100 italic">"{card.example}"</p>
            </div>

            <div>
              <span className="text-indigo-200 text-xs uppercase tracking-wider font-bold">
                Vietnamese
              </span>
              <p className="text-lg">{card.translation}</p>
            </div>
          </div>

          <div className="mt-auto flex gap-4 pt-4 border-t border-indigo-500/30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult(card.id, false);
              }}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20"
            >
              <XCircle size={18} />
              Forgot
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult(card.id, true);
              }}
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
            >
              <CheckCircle size={18} />
              Known
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardView;
