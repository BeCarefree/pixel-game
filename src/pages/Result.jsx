import React, { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import confetti from 'canvas-confetti';

const Result = () => {
  const { score, questions, gameResult, resetGame } = useGameStore();
  const total = questions.length;
  const passThreshold = Number(import.meta.env.VITE_PASS_THRESHOLD) || 3;
  const isPass = score >= passThreshold;

  useEffect(() => {
    if (isPass) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0055', '#00ff66', '#ffcc00']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0055', '#00ff66', '#ffcc00']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isPass]);

  return (
    <div className="container">
      <Card style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ 
          color: isPass ? 'var(--pixel-success)' : 'var(--pixel-accent)',
          marginBottom: '1rem',
          fontSize: '2rem'
        }}>
          {isPass ? 'MISSION CLEARED!' : 'GAME OVER'}
        </h1>

        <div style={{ fontSize: '4rem', margin: '2rem 0' }}>
          {score} / {total}
        </div>

        {gameResult && (
          <div style={{ 
            textAlign: 'left', 
            background: '#f0f0f0', 
            padding: '1rem', 
            border: '4px solid #000',
            marginBottom: '2rem',
            color: '#000',
            fontSize: '0.9rem'
          }}>
            <p>HIGH SCORE: {gameResult.highScore}</p>
            <p>ATTEMPTS: {gameResult.attempts}</p>
            {gameResult.firstClearScore && (
              <p>FIRST CLEAR: {gameResult.firstClearScore}</p>
            )}
          </div>
        )}

        <Button onClick={resetGame} style={{ fontSize: '1.2rem' }}>
          TRY AGAIN
        </Button>
      </Card>
    </div>
  );
};

export default Result;
