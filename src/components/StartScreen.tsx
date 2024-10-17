import React, { useState } from 'react';
import { Sword, Shield, Trophy } from 'lucide-react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  hasUnlockedHardMode: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  onShowLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  hasUnlockedHardMode, 
  playerName, 
  setPlayerName,
  onShowLeaderboard 
}) => {
  const [isEditingName, setIsEditingName] = useState(!playerName);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  return (
    <div className="text-white text-center pixel-art">
      <h1 className="text-4xl mb-4 pixel-text">重生之我在群里暴打戴老六</h1>
      <p className="mb-4 pixel-text">Reborn: Beating Dai Laoliu in the Group Chat</p>
      
      {isEditingName ? (
        <form onSubmit={handleNameSubmit} className="mb-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="输入你的名字"
            className="bg-gray-800 text-white px-2 py-1 rounded pixel-text"
          />
          <button type="submit" className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded btn-pixel">
            确定
          </button>
        </form>
      ) : (
        <p className="mb-4 pixel-text">
          欢迎, {playerName}! 
          <button 
            onClick={() => setIsEditingName(true)}
            className="ml-2 text-blue-300 hover:text-blue-500 underline"
          >
            修改名字
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={() => onStart('normal')}
        >
          开始游戏（普通模式） <Sword className="ml-2" size={20} />
        </button>
        {hasUnlockedHardMode && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
            onClick={() => onStart('hard')}
          >
            开始游戏（困难模式） <Shield className="ml-2" size={20} />
          </button>
        )}
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={onShowLeaderboard}
        >
          查看排行榜 <Trophy className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};

export default StartScreen;