import React from 'react';
import { Trophy, RefreshCw, List } from 'lucide-react';
import { Difficulty } from '../types';

interface VictoryScreenProps {
  onRestart: (difficulty: Difficulty) => void;
  hasUnlockedHardMode: boolean;
  onShowLeaderboard: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart, hasUnlockedHardMode, onShowLeaderboard }) => {
  return (
    <div className="text-white text-center pixel-art">
      <h1 className="text-4xl mb-4 pixel-text">恭喜您！</h1>
      <h2 className="text-2xl mb-4 pixel-text">已成功攻克戴老六！</h2>
      <Trophy className="mx-auto mb-4 animate-bounce" size={64} />
      <div className="grid grid-cols-1 gap-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={() => onRestart('normal')}
        >
          再玩一次（普通模式） <RefreshCw className="ml-2" size={20} />
        </button>
        {hasUnlockedHardMode && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
            onClick={() => onRestart('hard')}
          >
            挑战困难模式 <Trophy className="ml-2" size={20} />
          </button>
        )}
        {!hasUnlockedHardMode && (
          <p className="text-yellow-500 pixel-text animate-pulse">
            恭喜！您已解锁困难模式！再次获胜即可挑战。
          </p>
        )}
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={onShowLeaderboard}
        >
          查看排行榜 <List className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;