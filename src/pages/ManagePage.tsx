import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CardStatus, cardStatusOptions } from '@type-schema/common';
import { Checkbox, FormControlLabel } from '@mui/material';
import VocabTable from '@components/VocabTable';
import { useGetFlashcards } from '@apis/queries/flashcards';
import { useDeleteFlashcard } from '@apis/mutations/flashcards';

const ManagePage: React.FC = () => {
  const { data: cards, isLoading } = useGetFlashcards();
  const { mutate } = useDeleteFlashcard();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewFiltered, setIsNewFiltered] = useState(true);
  const [isLearningFiltered, setIsLearningFiltered] = useState(true);
  const [isMasteredFiltered, setIsMasteredFiltered] = useState(true);

  const filteredCards = cards
    ? cards.filter(
        (c) =>
          ((isNewFiltered && c.status === CardStatus.New) ||
            (isLearningFiltered && c.status === CardStatus.Learning) ||
            (isMasteredFiltered && c.status === CardStatus.Mastered)) &&
          (c.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.translation.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search words, words's translation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          {cardStatusOptions.map((status) => (
            <FormControlLabel
              control={
                <Checkbox
                  value={status.value}
                  checked={
                    status.value === 'NEW'
                      ? isNewFiltered
                      : status.value === 'LEARNING'
                        ? isLearningFiltered
                        : isMasteredFiltered
                  }
                />
              }
              label={status.label}
              onChange={() =>
                status.value === 'NEW'
                  ? setIsNewFiltered(!isNewFiltered)
                  : status.value === 'LEARNING'
                    ? setIsLearningFiltered(!isLearningFiltered)
                    : setIsMasteredFiltered(!isMasteredFiltered)
              }
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <VocabTable data={filteredCards} onDeleteCard={mutate} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
