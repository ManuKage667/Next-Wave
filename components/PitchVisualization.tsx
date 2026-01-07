import React from 'react';
import { Position } from '../types';

interface PitchVisualizationProps {
  primaryPosition: Position;
  secondaryPositions?: Position[];
  className?: string;
}

const getPositionCoordinates = (pos: Position) => {
  switch (pos) {
    case Position.GK: return { top: '90%', left: '50%' };
    case Position.CB: return { top: '75%', left: '50%' };
    case Position.LB: return { top: '70%', left: '15%' };
    case Position.RB: return { top: '70%', left: '85%' };
    case Position.CDM: return { top: '60%', left: '50%' };
    case Position.CM: return { top: '45%', left: '50%' };
    case Position.CAM: return { top: '30%', left: '50%' };
    case Position.LW: return { top: '20%', left: '15%' };
    case Position.RW: return { top: '20%', left: '85%' };
    case Position.ST: return { top: '10%', left: '50%' };
    default: return { top: '50%', left: '50%' };
  }
};

const PositionDot: React.FC<{ pos: Position, isPrimary: boolean }> = ({ pos, isPrimary }) => {
    const coords = getPositionCoordinates(pos);
    return (
        <div 
            className={`absolute w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10 ${isPrimary ? 'bg-green-500 shadow-green-500/50 z-20 scale-110' : 'bg-yellow-400 shadow-yellow-400/50'}`}
            style={{ top: coords.top, left: coords.left }}
        >
            <span className="text-[10px] md:text-xs font-bold text-black leading-none">{pos}</span>
        </div>
    );
};

export const PitchVisualization: React.FC<PitchVisualizationProps> = ({ primaryPosition, secondaryPositions = [], className = '' }) => {
  return (
    <div className={`relative bg-pitch-dark border-2 border-slate-600 rounded-lg overflow-hidden shadow-inner ${className}`} style={{ aspectRatio: '2/3' }}>
      {/* Grass Strips Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 50%)', backgroundSize: '100% 10%' }}>
      </div>

      {/* Pitch Markings */}
      <div className="absolute top-0 left-0 right-0 bottom-0 border border-pitch-line m-4"></div> {/* Touchlines */}
      <div className="absolute top-1/2 left-4 right-4 h-px bg-pitch-line transform -translate-y-1/2"></div> {/* Halfway Line */}
      <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-pitch-line rounded-full transform -translate-x-1/2 -translate-y-1/2"></div> {/* Center Circle */}
      
      {/* Penalty Areas */}
      <div className="absolute top-4 left-1/2 w-32 h-16 border border-pitch-line transform -translate-x-1/2 bg-transparent"></div>
      <div className="absolute bottom-4 left-1/2 w-32 h-16 border border-pitch-line transform -translate-x-1/2 bg-transparent"></div>

      {/* Secondary Positions (Yellow) */}
      {secondaryPositions.map((pos) => (
          pos !== primaryPosition && <PositionDot key={pos} pos={pos} isPrimary={false} />
      ))}

      {/* Primary Position (Green) */}
      <PositionDot pos={primaryPosition} isPrimary={true} />
      
      {/* Legend */}
      <div className="absolute bottom-1 right-1 flex flex-col gap-1 text-[8px] text-white/70 bg-black/40 p-1 rounded">
         <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Principal</div>
         {secondaryPositions.length > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Secondaire</div>}
      </div>
    </div>
  );
};