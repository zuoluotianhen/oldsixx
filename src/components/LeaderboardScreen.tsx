import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, Sword, Shield } from 'lucide-react';
import { LeaderboardEntry, Difficulty } from '../types';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentMode, setCurrentMode] = useState<Difficulty>('normal');

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  const filteredLeaderboard = leaderboard
    .filter(entry => entry.difficulty === currentMode)
    .sort((a, b) => a.clearTime - b.clearTime)
    .slice(0, 50);

  return (
    <div className="text-white text-center pixel-art">
      <h1 className="text-4xl mb-4 pixel-text">排行榜</h1>
      <Trophy className="mx-auto mb-4" size={64} />
      <div className="flex justify-center mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded btn-pixel ${currentMode === 'normal' ? 'bg-green-500' : 'bg-gray-500'}`}
          onClick={() => setCurrentMode('normal')}
        >
          <Sword className="inline-block mr-2" size={20} />
          普通模式
        </button>
        <button
          className={`px-4 py-2 rounded btn-pixel ${currentMode === 'hard' ? 'bg-red-500' : 'bg-gray-500'}`}
          onClick={() => setCurrentMode('hard')}
        >
          <Shield className="inline-block mr-2" size={20} />
          困难模式
        </button>
      </div>
      <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg mb-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pixel-text">排名</th>
              <th className="pixel-text">玩家</th>
              <th className="pixel-text">通关时间</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-700 bg-opacity-50' : ''}>
                <td className="pixel-text">{index + 1}</td>
                <td className="pixel-text">{entry.playerName}</td>
                <td className="pixel-text">{entry.clearTime}秒</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel mx-auto"
        onClick={onBack}
      >
        返回 <ArrowLeft className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default LeaderboardScreen;