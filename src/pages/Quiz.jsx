import React, { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/Game/Avatar';
import { api } from '../services/api';

// Simple progress bar
const ProgressBar = ({ current, total }) => {
  const percent = (current / total) * 100;
  return (
    <div style={{ 
      width: '100%', 
      height: '10px', 
      border: '2px solid #000', 
      background: '#2d2d2d',
      marginBottom: '1rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: `${percent}%`,
        background: '#00ff66',
        transition: 'width 0.3s'
      }} />
    </div>
  );
};

const Quiz = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    answerQuestion, 
    playerId, 
    answers,
    finishGame, 
    setLoading 
  } = useGameStore();

  const currentQ = questions[currentQuestionIndex];
  const totalQ = questions.length;

  // Handle Game Over
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      handleFinish();
    }
  }, [currentQuestionIndex, questions.length]);

  const handleFinish = async () => {
    setLoading(true);
    // Calculate final stats
    const submitData = {
      action: 'submitScore', 
      id: playerId,
      answers: answers,
      timestamp: new Date().toISOString()
    };

    try {
      const result = await api.submitScore(submitData);
      
      // Update store with result score if returned
      if (result && result.score !== undefined) {
          useGameStore.setState({ score: result.score });
      }
      
      finishGame(result); 
    } catch (e) {
      console.error("Submit error", e);
      finishGame({ error: true });
    }
    setLoading(false);
  };

  if (!currentQ) return <div className="container">Loading Next...</div>;

  return (
    <div className="container">
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
           <span>LEVEL {currentQuestionIndex + 1}/{totalQ}</span>
           {/* Score hidden as it is calculated server-side */}
        </div>
        <ProgressBar current={currentQuestionIndex} total={totalQ} />

        <Card className="flex flex-col items-center gap-6">
          <Avatar 
            seed={`boss-${currentQ.id || currentQuestionIndex}`} 
            size={100} 
            className="mb-4"
          />
          
          <h2 style={{ 
            fontSize: '1.2rem', 
            textAlign: 'center', 
            minHeight: '60px',
            lineHeight: '1.6'
          }}>
            {currentQ.question}
          </h2>

          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            width: '100%',
            gridTemplateColumns: '1fr' 
          }}>
            {currentQ.options.map((opt, idx) => (
              <Button 
                key={idx} 
                onClick={() => answerQuestion(opt)}
                className="text-left"
              >
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
