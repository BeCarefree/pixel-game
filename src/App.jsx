import React from 'react';
import useGameStore from './store/gameStore';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';

function App() {
  const { currentScreen, error } = useGameStore();

  return (
    <>
      {error && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          background: '#ff0055',
          color: '#fff',
          padding: '10px',
          textAlign: 'center',
          fontFamily: "'Press Start 2P', cursive",
          zIndex: 9999
        }}>
          ERROR: {error}
        </div>
      )}
      
      {currentScreen === 'HOME' && <Home />}
      {currentScreen === 'PLAYING' && <Quiz />}
      {currentScreen === 'RESULT' && <Result />}
    </>
  );
}

export default App;
