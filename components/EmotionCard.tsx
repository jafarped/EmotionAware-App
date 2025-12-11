import React from 'react';
import { EmotionConfig } from '../types';

interface EmotionCardProps {
  config: EmotionConfig;
  onClick: () => void;
  isSelected: boolean;
}

const EmotionCard: React.FC<EmotionCardProps> = ({ config, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group
        w-full aspect-square
        rounded-3xl border-4 
        flex flex-col items-center justify-center
        transition-all duration-300 ease-spring
        hover:scale-105 active:scale-95
        ${isSelected 
          ? 'border-white ring-4 ring-offset-2 ring-blue-300 scale-105 shadow-xl z-10' 
          : 'border-transparent shadow-md hover:shadow-lg'
        }
        bg-gradient-to-br ${config.gradient}
      `}
    >
      <div className="text-6xl mb-2 drop-shadow-md transform transition-transform group-hover:scale-110 duration-300">
        {config.emoji}
      </div>
      <span className="text-white font-bold text-xl drop-shadow-sm font-bubble">
        {config.type}
      </span>
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-black blur-xl"></div>
      </div>
    </button>
  );
};

export default EmotionCard;
