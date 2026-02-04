import { CardStatus, Flashcard } from '@type-schema/flashcard';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatsChartProps {
  cards: Flashcard[];
}

const COLORS = ['#94a3b8', '#3b82f6', '#22c55e']; // Slate (New), Blue (Learning), Green (Mastered)

const StatsChart: React.FC<StatsChartProps> = ({ cards }) => {
  const data = [
    { name: 'New', value: cards.filter((c) => c.status === CardStatus.New).length },
    { name: 'Learning', value: cards.filter((c) => c.status === CardStatus.Learning).length },
    { name: 'Mastered', value: cards.filter((c) => c.status === CardStatus.Mastered).length },
  ];

  // Filter out zero values for cleaner chart
  const activeData = data.filter((d) => d.value > 0);

  if (activeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-xl border border-slate-200 text-slate-400">
        No data yet. Add some cards!
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-white p-4 pb-7 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Progress Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[data.findIndex((d) => d.name === entry.name)]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
