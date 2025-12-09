import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Avatar from '../components/Game/Avatar';
import { api } from '../services/api';

const Home = () => {
  const { setPlayerId, setQuestions, startGame, setLoading, isLoading, setError } = useGameStore();
  const [localId, setLocalId] = useState('');

  const handleStart = async () => {
    if (!localId.trim()) return;

    setLoading(true);
    setPlayerId(localId);
    setError(null);

    const count = import.meta.env.VITE_QUESTION_COUNT || 5;

    try {
      const data = await api.fetchQuestions(count);
      // Data validation: ensure data.questions exists
      const questions = data.questions || data; // Handle both wrapper or direct array
      if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error("No questions available");
      }
      setQuestions(questions);
      startGame();
    } catch (err) {
      setError("Failed to load game. Please check connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
       <h1 style={{ 
         marginBottom: '2rem', 
         textShadow: '4px 4px 0 #000', 
         fontSize: '3rem',
         color: '#ffcc00'
       }}>
         PIXEL QUIZ
       </h1>

       <Card className="flex flex-col gap-4 items-center max-w-md w-full">
          <Avatar seed={localId || 'hero'} size={120} />
          
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left' }}>
              PLAYER ID:
            </label>
            <Input 
              placeholder="Enter your ID..." 
              value={localId} 
              onChange={(e) => setLocalId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <Button 
            onClick={handleStart} 
            disabled={!localId || isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isLoading ? 'LOADING...' : 'START GAME'}
          </Button>
       </Card>
    </div>
  );
};

export default Home;
