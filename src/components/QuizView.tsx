import React, { useState, useEffect } from 'react';
import { Flashcard } from '@type-schema/common';
import { CheckCircle, XCircle, ArrowRight, Keyboard, ListChecks, HelpCircle } from 'lucide-react';
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
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <HelpCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Not Enough Cards</h2>
        <p className="text-slate-500 mb-6">
          You need at least 4 words in your collection to start a practice session (to generate
          multiple choice options).
        </p>
        <button onClick={handleExit} className="text-indigo-600 font-semibold hover:underline">
          Go back and add more words
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading quiz...</div>;
  }

  if (quizFinished) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <ListChecks size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Complete!</h2>
        <p className="text-slate-500 mb-8">Here is how you performed</p>

        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <div className="text-4xl font-bold text-indigo-600 mb-1">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <div className="text-slate-400 font-medium">
            {score} out of {questions.length} correct
          </div>
        </div>

        <button
          onClick={handleExit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={handleExit} className="text-slate-400 hover:text-slate-600 font-medium">
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">
            Question {currentIndex + 1}/{questions.length}
          </span>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
        {/* Question Area */}
        <div className="p-8 pb-4 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
            {currentQuestion.type === 'mcq' ? (
              <>
                <ListChecks size={14} /> Multiple Choice
              </>
            ) : (
              <>
                <Keyboard size={14} /> Typing
              </>
            )}
          </div>

          <h3 className="text-xl text-slate-600 font-medium mb-2">
            {currentQuestion.type === 'mcq'
              ? 'What is the meaning of this word?'
              : 'Type the English word for this meaning:'}
          </h3>

          <div className="text-3xl font-bold text-slate-800 mb-8">
            {currentQuestion.type === 'mcq' ? (
              <span className="text-indigo-600">{currentQuestion.targetCard.word}</span>
            ) : (
              <span className="text-slate-700">"{currentQuestion.targetCard.translation}"</span>
            )}
          </div>

          {/* MCQ Options */}
          {currentQuestion.type === 'mcq' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option) => {
                let btnClass =
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ';

                if (isAnswered) {
                  if (option.id === currentQuestion.targetCard.id) {
                    btnClass += 'border-green-500 bg-green-50 text-green-700'; // Correct answer shown always
                  } else if (option.id === selectedOption) {
                    btnClass += 'border-red-500 bg-red-50 text-red-700'; // Wrong selection
                  } else {
                    btnClass += 'border-slate-100 bg-slate-50 opacity-50'; // Others
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
          <div
            className={`p-4 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} animate-in slide-in-from-bottom-4`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    <CheckCircle /> Correct!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 font-bold">
                    <XCircle /> Incorrect
                  </div>
                )}
              </div>
              <button
                onClick={nextQuestion}
                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5
                    ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  `}
              >
                {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Submit button for Typing only before answer */}
        {!isAnswered && currentQuestion.type === 'typing' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={handleTypingSubmit}
              disabled={!textInput.trim()}
              className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
            >
              Check Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
