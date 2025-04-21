import React from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface CalendarNavigationProps {
  activeItem: string;
  onItemChange: (id: string) => void;
  className?: string;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  activeItem,
  onItemChange,
  className = '',
}) => {
  const navItems: NavItem[] = [
    {
      id: 'history-accuracy',
      label: '历法精度',
      icon: '📅',
    },
    {
      id: 'observation-accuracy',
      label: '观测精度',
      icon: '🔭',
    },
    {
      id: 'scientific-value',
      label: '科学价值',
      icon: '🔬',
    },
    {
      id: 'cosmic-concept',
      label: '宇宙观念',
      icon: '🌌',
    },
    {
      id: 'astronomical-instruments',
      label: '天文仪器',
      icon: '🔭',
    },
  ];

  return (
    <div className={`w-full overflow-x-auto py-4 ${className}`}>
      <div className="flex space-x-2 min-w-max px-4 justify-center">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 whitespace-nowrap ${
              activeItem === item.id
                ? 'bg-[#B4846C] text-white shadow-lg'
                : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CalendarNavigation; 