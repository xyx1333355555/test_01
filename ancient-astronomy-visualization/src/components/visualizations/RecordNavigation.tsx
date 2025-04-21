import React from 'react';
import { motion } from 'framer-motion';

interface RecordItem {
  id: string;
  label: string;
  icon: string;
}

interface RecordNavigationProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
  className?: string;
}

const RecordNavigation: React.FC<RecordNavigationProps> = ({ 
  activeItem, 
  onItemChange, 
  className = '' 
}) => {
  const recordItems: RecordItem[] = [
    { id: 'supernova', label: '超新星记录', icon: '💫' },
    { id: 'comet', label: '彗星记录', icon: '☄️' },
    { id: 'solar-lunar', label: '日月食记录', icon: '🌓' },
    { id: 'meteor', label: '流星记录', icon: '✨' },
    { id: 'star', label: '恒星观测', icon: '⭐' },
    { id: 'planet', label: '行星观测', icon: '🪐' }
  ];

  return (
    <div className={`w-full overflow-x-auto pb-2 ${className}`}>
      <div className="flex space-x-2 min-w-max">
        {recordItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
              activeItem === item.id
                ? 'bg-[#B4846C] text-white shadow-md'
                : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
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

export default RecordNavigation; 