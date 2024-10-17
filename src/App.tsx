import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import VictoryScreen from './components/VictoryScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import { GameState, Difficulty, LeaderboardEntry } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [hasUnlockedHardMode, setHasUnlockedHardMode] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
    const storedHardMode = localStorage.getItem('hasUnlockedHardMode');
    if (storedHardMode) {
      setHasUnlockedHardMode(JSON.parse(storedHardMode));
    }
  }, []);

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setStartTime(Date.now());
  };

  const endGame = (victory: boolean) => {
    if (victory) {
      const clearTime = Math.floor((Date.now() - startTime) / 1000);
      updateLeaderboard(clearTime);
      setGameState('victory');
      if (!hasUnlockedHardMode) {
        setHasUnlockedHardMode(true);
        localStorage.setItem('hasUnlockedHardMode', 'true');
      }
    } else {
      setGameState('end');
    }
  };

  const updateLeaderboard = (clearTime: number) => {
    const leaderboardEntry: LeaderboardEntry = {
      playerName,
      difficulty,
      clearTime
    };
    const storedLeaderboard = localStorage.getItem('leaderboard');
    let leaderboard: LeaderboardEntry[] = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    leaderboard.push(leaderboardEntry);
    leaderboard.sort((a, b) => {
      if (a.difficulty !== b.difficulty) {
        return a.difficulty === 'hard' ? -1 : 1;
      }
      return a.clearTime - b.clearTime;
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="game-container">
        {gameState === 'start' && (
          <StartScreen 
            onStart={startGame} 
            hasUnlockedHardMode={hasUnlockedHardMode} 
            playerName={playerName}
            setPlayerName={(name) => {
              setPlayerName(name);
              localStorage.setItem('playerName', name);
            }}
            onShowLeaderboard={() => setGameState('leaderboard')}
          />
        )}
        {gameState === 'playing' && <Game onEnd={endGame} difficulty={difficulty} />}
        {gameState === 'victory' && (
          <VictoryScreen 
            onRestart={startGame} 
            hasUnlockedHardMode={hasUnlockedHardMode} 
            onShowLeaderboard={() => setGameState('leaderboard')}
          />
        )}
        {gameState === 'end' && (
          <div className="text-white text-center">
            <h2 className="text-2xl mb-4 text-red-500 pixel-text">Game Over</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn-pixel"
              onClick={() => setGameState('start')}
            >
              再玩一次
            </button>
          </div>
        )}
        {gameState === 'leaderboard' && (
          <LeaderboardScreen onBack={() => setGameState('start')} />
        )}
      </div>
    </div>
  );
}

export default App;