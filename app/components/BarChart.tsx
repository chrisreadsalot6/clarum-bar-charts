'use client'

import React, { useState } from 'react';

interface BarChartProps {
  data: { value: number; label: string }[];
  maxValue: number;
  title: string;
}

// BarChart component definition
const BarChart: React.FC<BarChartProps> = ({ data: initialData, maxValue, title }) => {
  // State variables
  const [data, setData] = useState(initialData);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Generate axis labels based on maxValue
  const axisLabels = Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i));

  // Function to handle bar click event
  const handleBarClick = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold z-10">{title}</h2>
      <div className="flex items-end border-b border-l h-96 relative overflow-x-auto w-full">
        {/* Axis labels */}
        <div className="absolute sticky top-0 left-0 z-10 w-full flex flex-col-reverse justify-between h-48 mb-16">
          {axisLabels.map((label, index) => (
            <span key={index} className="text-xs">
              {label}
            </span>
          ))}
        </div>
        {/* Bars */}
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-64 overflow-y-visible"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              onClick={() => handleBarClick(index)}
            >
              <div
                className={`relative w-8 bg-blue-500 transition-all duration-300 z-0 ${
                  hoveredBar === index ? 'scale-150 z-20' : 'z-10'
                }`}
                style={{ height: `${Math.max(1, height)}%` }}
              >
                {/* Tooltip for hovered bar */}
                {hoveredBar === index && (
                    <div className="z-30 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white text-black text-xs font-bold p-1 rounded shadow-lg">
                        {item.value}
                    </div>
                )}
              </div>
              <span
                className={`text-xs mt-12 transform -rotate-45 origin-top-left transition-all duration-300 ${
                  hoveredBar === index ? 'translate-y-10' : ''
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;