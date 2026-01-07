import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PlayerStats } from '../types';

interface StatsRadarProps {
  stats: PlayerStats;
}

export const StatsRadar: React.FC<StatsRadarProps> = ({ stats }) => {
  const data = [
    { subject: 'Vitesse', A: stats.pace, fullMark: 100 },
    { subject: 'Tir', A: stats.shooting, fullMark: 100 },
    { subject: 'Passe', A: stats.passing, fullMark: 100 },
    { subject: 'Dribble', A: stats.dribbling, fullMark: 100 },
    { subject: 'Défense', A: stats.defending, fullMark: 100 },
    { subject: 'Physique', A: stats.physical, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
             itemStyle={{ color: '#60a5fa' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
