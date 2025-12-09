import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const api = {
  fetchQuestions: async (count = 5) => {
    if (!API_URL) {
      console.warn('API URL not set, using mock data');
      return mockQuestions(count);
    }
    // Apps Script GET usually needs to serve JSON.
    // We send 'count' as a query param.
    // Spec says: "透過 Google Apps Script ... 隨機撈取 N 題"
    try {
        const response = await axios.get(`${API_URL}?action=getQuestions&count=${count}`);
        return response.data; // Expecting { questions: [...] }
    } catch (error) {
        console.error("Fetch questions failed", error);
        throw error;
    }
  },

  submitScore: async (data) => {
    if (!API_URL) {
       console.warn('API URL not set, mock submit');
       // Mock Score Calculation
       let calculatedScore = 0;
       if (data.answers) {
         // Mock: 60% chance correct
         calculatedScore = data.answers.filter(() => Math.random() > 0.4).length;
       } else if (data.score !== undefined) {
         calculatedScore = data.score;
       }
       
       return { 
         score: calculatedScore, 
         totalScore: 100, // mock accumulated
         highScore: Math.max(calculatedScore, 10), 
         attempts: 5,
         firstClearScore: 8 
       };
    }
    
    // Apps Script Post
    try {
        // We must stringify manually because we are forcing Content-Type to text/plain
        // to avoid CORS preflight (OPTIONS) issues with Google Apps Script.
        const response = await axios.post(API_URL, JSON.stringify(data), {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            }
        });
        
        console.log("Submit Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Submit score failed", error);
        throw error;
    }
  }
};

// Mock Data for development
const mockQuestions = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: `第 ${i + 1} 題：Pixel Art 最早起源於哪個年代？`,
    options: ['1970s', '1980s', '1990s', '2000s'],
    correctAnswer: '1980s', // Note: Spec says A,B,C,D colums. API should return normalized options.
    // Let's assume API returns: { question: "...", options: ["A", "B", "C", "D"], correctAnswer: "A" wait? }
    // Real questions have options text.
    // We need to clarify how we match answers. By index or content?
    // Spec says: "A、B、C、D、解答". "解答" likely contains the correct option letter (A/B/C/D) or the content.
    // Usually it's Letter.
    // Let's assume API returns options as array, and we check content or index.
    // If "解答" is "A", then it's options[0].
  })).map(q => ({
      ...q,
      // Randomize options for mock? No, keep simple.
      options: ['1970s', '1980s', '1990s', '2000s'],
      correctAnswer: '1980s' 
  }));
};
