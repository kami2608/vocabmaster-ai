import React, { useState } from 'react';
import { X, Sparkles, Loader2, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CardStatus, Flashcard } from '@type-schema/common';
import { generateWordDetails } from '@services/geminiService';
import { SubmitHandler, useForm } from 'react-hook-form';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: Flashcard) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Omit<Flashcard, 'id' | 'status' | 'createdAt'>>({
    defaultValues: {
      word: '',
      definition: '',
      example: '',
      translation: '',
      phonetic: '',
    },
    mode: 'onSubmit',
  });

  const word = watch('word');

  if (!isOpen) return null;

  const handleAutoFill = async () => {
    if (!word.trim()) {
      setError('Please enter a word first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const data = await generateWordDetails(getValues('word'));
      if (data) {
        setValue('definition', data.definition);
        setValue('example', data.example);
        setValue('translation', data.translation);
        setValue('phonetic', data.phonetic);
      }
    } catch (err) {
      setError('Failed to fetch data from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<Omit<Flashcard, 'id' | 'status' | 'createdAt'>> = (data) => {
    const newCard: Flashcard = {
      id: uuidv4(),
      ...data,
      status: CardStatus.New,
      createdAt: Date.now(),
    };
    onAdd(newCard);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Card</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Word</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g., Ephemeral"
                  autoFocus
                  {...register('word', { required: 'Word is required!' })}
                />
                {errors.word && <p className="text-red-500 text-sm mt-1">{errors.word.message}</p>}
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isLoading || !word}
                className="bg-indigo-100 text-indigo-700 px-4 rounded-xl font-medium hover:bg-indigo-200 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                Auto-Fill
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IPA Phonetic</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="/əˈfem(ə)rəl/"
                {...register('phonetic')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Vietnamese Meaning
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Phù du, sớm nở tối tàn"
                {...register('translation')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Definition</label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
              placeholder="The meaning of the word..."
              {...register('definition', { required: 'Definition is required!' })}
            />
            {errors.definition && (
              <p className="text-red-500 text-sm mt-1">{errors.definition.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Example Sentence
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
              placeholder="Use it in a sentence..."
              {...register('example')}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
            >
              <Save size={18} />
              Save Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
