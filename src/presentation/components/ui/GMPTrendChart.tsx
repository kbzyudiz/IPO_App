import React from 'react';
import { motion } from 'framer-motion';

interface GMPTrendChartProps {
    data: number[];
    color?: string;
    height?: number;
}

export const GMPTrendChart: React.FC<GMPTrendChartProps> = ({
    data,
    color = '#10B981',
    height = 60
}) => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data, 10);
    const min = Math.min(...data, 0);
    const range = max - min;

    // Normalize points to SVG coordinates
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((val - min) / (range || 1)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full" style={{ height }}>
            <svg viewBox={`0 0 100 ${height}`} className="w-full h-full overflow-visible">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Main Path */}
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={`M ${points}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Fill Area */}
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    d={`M 0,${height} L ${points} L 100,${height} Z`}
                    fill="url(#gradient)"
                    stroke="none"
                />

                {/* Last Point Indicator */}
                <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    cx="100"
                    cy={height - ((data[data.length - 1] - min) / (range || 1)) * height}
                    r="3"
                    fill={color}
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
            </svg>
        </div>
    );
};
