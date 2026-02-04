import React, { useState, useEffect } from 'react';
import { Flashcard } from '@type-schema/flashcard';
import QuizHeader from './QuizViewComponents/QuizHeader';
import QuestionCard from './QuizViewComponents/QuestionCard';
import QuizFooter from './QuizViewComponents/QuizFooter';
import TypingSubmitFooter from './QuizViewComponents/TypingSubmitFooter';
import QuizResult from './QuizViewComponents/QuizResult';
import NotEnoughCards from './QuizViewComponents/NotEnoughCards';
import { useNavigate } from '@tanstack/react-router';

interface QuizViewProps {
  cards: Flashcard[];
}

type QuestionType = 'mcq' | 'typing';

interface Question {
  id: string;
  type: QuestionType;
  targetCard: Flashcard;
  options?: Flashcard[]; // For MCQ: 1 correct + 3 distractors
}

const QuizView: React.FC<QuizViewProps> = ({ cards }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate Quiz on mount
  useEffect(() => {
    if (cards.length < 4) return;

    const generateQuestions = () => {
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5); // Max 10 questions

      const newQuestions: Question[] = shuffledCards.map((card, index) => {
        // Randomize question type (50/50)
        const type: QuestionType = Math.random() > 0.5 ? 'mcq' : 'typing';

        let options: Flashcard[] | undefined;

        if (type === 'mcq') {
          // Find 3 distractors
          const otherCards = cards.filter((c) => c.id !== card.id);
          const distractors = otherCards.sort(() => Math.random() - 0.5).slice(0, 3);
          // Combine and shuffle options
          options = [card, ...distractors].sort(() => Math.random() - 0.5);
        }

        return {
          id: `q-${index}`,
          type,
          targetCard: card,
          options,
        };
      });

      setQuestions(newQuestions);
    };

    generateQuestions();
  }, [cards]);

  const handleMCQSelect = (optionId: string) => {
    if (isAnswered) return;

    setSelectedOption(optionId);
    const correct = optionId === questions[currentIndex].targetCard.id;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((prev) => prev + 1);
  };

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !textInput.trim()) return;

    const correct =
      textInput.trim().toLowerCase() === questions[currentIndex].targetCard.word.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((prev) => prev + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      // Reset state
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setTextInput('');
    } else {
      setQuizFinished(true);
    }
  };

  const navigate = useNavigate();

  const handleExit = () => {
    navigate({ to: '/dashboard' });
  };

  if (cards.length < 4) {
    return <NotEnoughCards onExit={handleExit} />;
  }

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading quiz...</div>;
  }

  if (quizFinished) {
    return <QuizResult score={score} total={questions.length} onExit={handleExit} />;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <QuizHeader currentIndex={currentIndex} total={questions.length} onExit={handleExit} />
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 pb-4 flex-1">
          <QuestionCard
            type={currentQuestion.type}
            word={currentQuestion.targetCard.word}
            translation={currentQuestion.targetCard.translation}
          />
          {/* MCQ Options */}
          {currentQuestion.type === 'mcq' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option) => {
                let btnClass =
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ';
                if (isAnswered) {
                  if (option.id === currentQuestion.targetCard.id) {
                    btnClass += 'border-green-500 bg-green-50 text-green-700';
                  } else if (option.id === selectedOption) {
                    btnClass += 'border-red-500 bg-red-50 text-red-700';
                  } else {
                    btnClass += 'border-slate-100 bg-slate-50 opacity-50';
                  }
                } else {
                  btnClass +=
                    'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700';
                }
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMCQSelect(option.id)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    {option.translation}
                  </button>
                );
              })}
            </div>
          )}
          {/* Typing Input */}
          {currentQuestion.type === 'typing' && (
            <form onSubmit={handleTypingSubmit} className="space-y-4">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isAnswered}
                autoFocus
                placeholder="Type word here..."
                className={`w-full text-2xl p-4 border-b-2 outline-none font-bold text-center bg-transparent
                    ${
                      isAnswered
                        ? isCorrect
                          ? 'border-green-500 text-green-600'
                          : 'border-red-500 text-red-600'
                        : 'border-slate-300 focus:border-indigo-600 text-slate-800'
                    }`}
              />
              {isAnswered && !isCorrect && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  Correct answer:{' '}
                  <span className="font-bold">{currentQuestion.targetCard.word}</span>
                </div>
              )}
            </form>
          )}
        </div>
        {/* Footer / Next Button */}
        {isAnswered && (
          <QuizFooter
            isCorrect={isCorrect}
            isLast={currentIndex === questions.length - 1}
            onNext={nextQuestion}
          />
        )}
        {/* Submit button for Typing only before answer */}
        {!isAnswered && currentQuestion.type === 'typing' && (
          <TypingSubmitFooter onCheck={handleTypingSubmit} disabled={!textInput.trim()} />
        )}
      </div>
    </div>
  );
};

export default QuizView;
