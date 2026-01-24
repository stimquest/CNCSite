import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TIDE_DATA } from '../constants';

export const TideChart: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={TIDE_DATA}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A9CE" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00A9CE" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#002B49', borderColor: '#00A9CE', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#00A9CE' }}
          />
          <Area 
            type="monotone" 
            dataKey="height" 
            stroke="#00A9CE" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTide)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};