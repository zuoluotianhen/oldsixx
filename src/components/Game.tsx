import React, { useState, useEffect } from 'react';
import { Player, Enemy, Skill, EasterEgg, Difficulty } from '../types';
import { Sword, Zap, Salad, Wifi, Bomb, Star, Coffee, Music, Camera, Gift, Feather, Rocket, Heart, Droplet, Sun, Moon, Cloud, Umbrella, Wind, User, UserX, Shield, Users, Cigarette, Drumstick } from 'lucide-react';

interface GameProps {
  onEnd: (victory: boolean) => void;
  difficulty: Difficulty;
}

const Game: React.FC<GameProps> = ({ onEnd, difficulty }) => {
  const [player, setPlayer] = useState<Player>({
    health: 100,
    attack: 10,
    defense: 5,
    mana: 50
  });

  const [enemy, setEnemy] = useState<Enemy>({
    name: '戴老六',
    health: 666,
    attack: 15,
    defense: 10,
    isEnraged: false
  });

  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [message, setMessage] = useState<string>('');
  const [effectAnimation, setEffectAnimation] = useState<string | null>(null);
  const [additionalDamage, setAdditionalDamage] = useState<number | null>(null);
  const [easterEgg, setEasterEgg] = useState<EasterEgg | null>(null);

  const skills: Skill[] = [
    { name: '雷霆一击', manaCost: 20, damage: 30 },
    { name: '防御姿态', manaCost: 15, effect: 'defense' },
    { name: '群友召唤', manaCost: 25, damage: 25 }
  ];

  const handleAttack = () => {
    if (turn === 'player') {
      let damage = Math.min(Math.max(player.attack - enemy.defense, 1), 35);
      let isCritical = Math.random() < 0.05;

      if (isCritical) {
        damage *= 2;
      }

      setEnemy(prev => ({ ...prev, health: Math.max(prev.health - damage, 0) }));
      setMessage(`你对戴老六造成了 ${damage} 点伤害！${isCritical ? '暴击！' : ''}`);
      setEffectAnimation(isCritical ? 'critical-attack' : 'attack');
      
      document.body.classList.add('animate-shake');
      setTimeout(() => document.body.classList.remove('animate-shake'), 500);

      setTurn('enemy');

      if (Math.random() < 0.3) {
        triggerEasterEgg();
      }

      checkGameEnd();
    }
  };

  const handleSkill = (skill: Skill) => {
    if (turn === 'player' && player.mana >= skill.manaCost) {
      setPlayer(prev => ({ ...prev, mana: prev.mana - skill.manaCost }));

      if (skill.damage) {
        const damage = skill.damage;
        setEnemy(prev => ({ ...prev, health: Math.max(prev.health - damage, 0) }));
        setMessage(`你使用${skill.name}对戴老六造成了 ${damage} 点伤害！`);
        setEffectAnimation('skill-attack');
      } else if (skill.effect === 'defense') {
        setPlayer(prev => ({ ...prev, defense: prev.defense + 5 }));
        setMessage('你进入了防御姿态，防御力提升了！');
        setEffectAnimation('defense');
      }

      setTurn('enemy');
      checkGameEnd();
    }
  };

  const handleEat = () => {
    if (turn === 'player') {
      const healAmount = 20;
      setPlayer(prev => ({ ...prev, health: Math.min(prev.health + healAmount, 100) }));
      setMessage(`你吃了一份沙拉，恢复了 ${healAmount} 点生命值！`);
      setEffectAnimation('heal');
      setTurn('enemy');
    }
  };

  const handleEatPorkKnuckle = () => {
    if (turn === 'player') {
      const attackIncrease = 6;
      const manaRestore = 10;
      setPlayer(prev => ({
        ...prev,
        attack: prev.attack + attackIncrease,
        mana: Math.min(prev.mana + manaRestore, 50)
      }));
      setMessage(`你吃了一个肘子，攻击力永久提升 ${attackIncrease} 点，恢复了 ${manaRestore} 点魔法值！`);
      setEffectAnimation('buff');
      setTurn('enemy');
    }
  };

  const enemyTurn = () => {
    if (turn === 'enemy') {
      let damage = Math.max(enemy.attack - player.defense, 1);
      if (Math.random() < 0.1) {
        damage *= 1.5;
        setMessage(`戴老六暴击了！对你造成了 ${damage} 点伤害！`);
      } else {
        setMessage(`戴老六攻击了你，造成了 ${damage} 点伤害！`);
      }
      setPlayer(prev => ({ ...prev, health: Math.max(prev.health - damage, 0) }));
      setEffectAnimation('enemy-attack');
      
      if (enemy.health <= 333 && !enemy.isEnraged) {
        setEnemy(prev => ({ ...prev, isEnraged: true, health: prev.health + 66 }));
        setMessage(prev => `${prev} 戴老六进入了狂暴状态，恢复了 66 点生命值！`);
      }

      setTurn('player');
      checkGameEnd();
    }
  };

  const triggerEasterEgg = () => {
    const easterEggs: EasterEgg[] = [
      { name: '幸运星', description: '你的下一次攻击必定暴击！', effect: 'criticalHit', animation: 'flash' },
      { name: '群友支援', description: '群友们为你加油，恢复少量生命值和魔法值', effect: 'heal', value: 15, animation: 'bounce' },
      { name: '网络卡顿', description: '戴老六的下一回合被跳过', effect: 'skipEnemyTurn', animation: 'pixelate' },
      // Add more easter eggs here
    ];

    const randomEasterEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
    setEasterEgg(randomEasterEgg);
    setMessage(`触发彩蛋：${randomEasterEgg.description}`);

    // Apply easter egg effect
    switch (randomEasterEgg.effect) {
      case 'criticalHit':
        // Will be handled in the next attack
        break;
      case 'heal':
        if (randomEasterEgg.value) {
          setPlayer(prev => ({
            ...prev,
            health: Math.min(prev.health + randomEasterEgg.value!, 100),
            mana: Math.min(prev.mana + randomEasterEgg.value!, 50)
          }));
        }
        break;
      case 'skipEnemyTurn':
        setTurn('player');
        break;
      // Handle other effects
    }
  };

  const checkGameEnd = () => {
    if (enemy.health <= 0) {
      onEnd(true);
    } else if (player.health <= 0) {
      onEnd(false);
    }
  };

  useEffect(() => {
    if (turn === 'enemy') {
      const timer = setTimeout(() => {
        enemyTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  const getEasterEggIcon = (name: string) => {
    switch (name) {
      case '幸运星': return <Star />;
      case '群友支援': return <Users />;
      case '网络卡顿': return <Wifi />;
      default: return <Gift />;
    }
  };

  return (
    <div className="text-white text-center p-4 max-w-md mx-auto game-container relative">
      <h2 className="text-2xl mb-4 text-red-500 pixel-text">重生之我在群里暴打戴老六</h2>
      <p className="mb-2 text-yellow-500 pixel-text">难度: {difficulty === 'hard' ? '困难' : '普通'}</p>
      
      {/* Boss Area */}
      <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg mb-4 pixel-art">
        <div className="flex items-center justify-center mb-2">
          <UserX size={32} className="mr-2 text-red-500" />
          <h3 className="text-xl text-red-500 pixel-text">{enemy.name}</h3>
          {enemy.isEnraged && <Cigarette size={24} className="ml-2 text-gray-400" />}
        </div>
        <div className="health-bar bg-red-900 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full" style={{ width: `${(enemy.health / 666) * 100}%` }}></div>
        </div>
        <p className="text-red-300 pixel-text">Health: {enemy.health}/666</p>
      </div>

      {/* Player Area */}
      <div className="bg-blue-800 bg-opacity-70 p-4 rounded-lg mb-4 pixel-art">
        <div className="flex items-center justify-center mb-2">
          <User size={32} className="mr-2 text-blue-300" />
          <h3 className="text-xl text-blue-300 pixel-text">你</h3>
        </div>
        <div className="health-bar bg-blue-900 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full" style={{ width: `${player.health}%` }}></div>
        </div>
        <p className="text-blue-300 pixel-text">Health: {player.health}/100</p>
        <div className="mana-bar bg-purple-900 rounded-full overflow-hidden mt-2">
          <div className="bg-purple-500 h-full" style={{ width: `${(player.mana / 50) * 100}%` }}></div>
        </div>
        <p className="text-purple-300 pixel-text">Mana: {player.mana}/50</p>
        <p className="text-yellow-300 pixel-text">Attack: {player.attack}</p>
      </div>

      {/* Effect Animation */}
      {effectAnimation && (
        <div className={`absolute inset-0 pointer-events-none flex items-center justify-center animate-${effectAnimation} pixel-art`}>
          {effectAnimation === 'attack' && <Sword size={64} className="text-red-500" />}
          {effectAnimation === 'critical-attack' && <Zap size={64} className="text-yellow-500" />}
          {effectAnimation === 'skill-attack' && <Bomb size={64} className="text-purple-500" />}
          {effectAnimation === 'defense' && <Shield size={64} className="text-blue-500" />}
          {effectAnimation === 'heal' && <Heart size={64} className="text-green-500" />}
          {effectAnimation === 'buff' && <Feather size={64} className="text-yellow-300" />}
          {effectAnimation === 'enemy-attack' && <Sword size={64} className="text-red-700" />}
        </div>
      )}

      {/* Additional Damage Display */}
      {additionalDamage !== null && (
        <div className="absolute top-1/2 right-4 text-red-500 font-bold text-2xl animate-bounce pixel-text">
          +{additionalDamage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={handleAttack}
          disabled={turn === 'enemy'}
        >
          攻击 <Sword className="inline-block ml-1" size={16} />
        </button>
        {skills.map((skill, index) => (
          <button
            key={index}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
            onClick={() => handleSkill(skill)}
            disabled={turn === 'enemy' || player.mana < skill.manaCost}
          >
            {skill.name} {skill.name === '雷霆一击' ? <Zap className="inline-block ml-1" size={16} /> : 
                         skill.name === '防御姿态' ? <Shield className="inline-block ml-1" size={16} /> :
                         <Users className="inline-block ml-1" size={16} />}
          </button>
        ))}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={handleEat}
          disabled={turn === 'enemy'}
        >
          吃沙拉 <Salad className="inline-block ml-1" size={16} />
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center btn-pixel"
          onClick={handleEatPorkKnuckle}
          disabled={turn === 'enemy'}
        >
          吃肘子 <Drumstick className="inline-block ml-1" size={16} />
        </button>
      </div>

      {/* Message Area */}
      {message && (
        <div className="bg-gray-700 bg-opacity-70 p-2 rounded-lg mb-4">
          <p className="text-yellow-300 pixel-text">{message}</p>
        </div>
      )}

      {/* Easter Egg Icon */}
      {easterEgg && (
        <div className={`text-4xl mb-4 animate-${easterEgg.animation} pixel-art`}>
          {getEasterEggIcon(easterEgg.name)}
        </div>
      )}

      {/* Pixelate filter */}
      <svg className="hidden">
        <filter id="pixelate-filter">
          <feFlood x="4" y="4" height="2" width="2"/>
          <feComposite width="10" height="10"/>
          <feTile result="a"/>
          <feComposite in="SourceGraphic" in2="a" operator="in"/>
          <feMorphology operator="dilate" radius="5"/>
        </filter>
      </svg>
    </div>
  );
};

export default Game;