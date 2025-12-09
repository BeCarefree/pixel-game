import { create } from 'zustand';

const startState = {
  currentScreen: 'HOME', // HOME, PLAYING, RESULT
  playerId: '',
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [], // Record of { questionId, selected, isCorrect }
  isLoading: false,
  error: null,
  gameResult: null, // Data returned from server after submit
};

const useGameStore = create((set, get) => ({
  ...startState,

  setPlayerId: (id) => set({ playerId: id }),
  
  startGame: () => set({ 
    currentScreen: 'PLAYING', 
    currentQuestionIndex: 0, 
    score: 0, 
    answers: [],
    gameResult: null,
    error: null
  }),

  setQuestions: (questions) => set({ questions }),

  answerQuestion: (answer) => {
    const { questions, currentQuestionIndex, answers } = get();
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    // Store Answer without local validation
    const newAnswers = [...answers, { 
      id: currentQ.id, 
      selected: answer 
    }];

    set({
      answers: newAnswers,
      currentQuestionIndex: currentQuestionIndex + 1,
    });
  },

  finishGame: (resultData) => set({ 
    currentScreen: 'RESULT', 
    gameResult: resultData 
  }),

  resetGame: () => set((state) => ({ 
    ...startState, 
    playerId: state.playerId // Keep ID
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

export default useGameStore;
