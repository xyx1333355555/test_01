import React, { useEffect, useRef, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { timelineData } from '@/data/timelineData';
import { comparisonData } from '@/data/comparisonData';
import annotationPlugin from 'chartjs-plugin-annotation';
import { motion } from 'framer-motion';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const AstronomyAchievements: React.FC = () => {
  const chartRef = useRef<ChartJS<"bar", number[], string>>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredDynasty, setHoveredDynasty] = useState<string | null>(null);

  const categories = [
    { id: 'solar', label: '日食记录', color: 'rgba(255, 215, 0, 0.8)', icon: '☀️' },
    { id: 'lunar', label: '月食记录', color: 'rgba(173, 216, 230, 0.8)', icon: '🌙' },
    { id: 'comet', label: '彗星记录', color: 'rgba(100, 149, 237, 0.8)', icon: '☄️' },
    { id: 'nova', label: '新星记录', color: 'rgba(255, 69, 0, 0.8)', icon: '⭐' },
    { id: 'meteor', label: '流星记录', color: 'rgba(144, 238, 144, 0.8)', icon: '💫' },
    { id: 'instruments', label: '天文仪器', color: 'rgba(186, 85, 211, 0.8)', icon: '🔭' },
  ];
  
  const prepareChartData = () => {
    const dynasties = timelineData.map(dynasty => dynasty.name);
    const { scientificValue } = comparisonData;

    const totalRecords = {
      solarEclipse: scientificValue.find(v => v.recordType === '日月食记录')?.ancientRecords || 0,
      lunarEclipse: scientificValue.find(v => v.recordType === '日月食记录')?.ancientRecords || 0,
      comet: scientificValue.find(v => v.recordType === '彗星记录')?.ancientRecords || 0,
      nova: scientificValue.find(v => v.recordType === '超新星记录')?.ancientRecords || 0,
      meteor: scientificValue.find(v => v.recordType === '流星记录')?.ancientRecords || 0,
    };

    const getDynastyRecords = (dynasty: string, totalCount: number) => {
      const dynastyData = timelineData.find(d => d.name === dynasty);
      if (!dynastyData) return 0;
      
      const period = dynastyData.period;
      const years = period.split('-').map(year => {
        const match = year.match(/-?\d+/);
        return match ? parseInt(match[0]) : 0;
      });
      
      const duration = Math.abs(years[1] - years[0]);
      const totalDuration = 2070;
      return Math.round((duration / totalDuration) * totalCount);
    };

    return {
      labels: dynasties,
      datasets: [
        {
          label: '日食记录',
          data: dynasties.map(dynasty => getDynastyRecords(dynasty, totalRecords.solarEclipse)),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'solar' || !selectedCategory 
                ? 'rgba(255, 215, 0, 0.8)' 
                : 'rgba(255, 215, 0, 0.3)';
            }
            return 'rgba(255, 215, 0, 0.1)';
          },
          borderColor: 'rgba(255, 215, 0, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(255, 215, 0, 1)',
          hoverBorderWidth: 3,
        },
        {
          label: '月食记录',
          data: dynasties.map(dynasty => getDynastyRecords(dynasty, totalRecords.lunarEclipse)),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'lunar' || !selectedCategory 
                ? 'rgba(173, 216, 230, 0.8)' 
                : 'rgba(173, 216, 230, 0.3)';
            }
            return 'rgba(173, 216, 230, 0.1)';
          },
          borderColor: 'rgba(173, 216, 230, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(173, 216, 230, 1)',
          hoverBorderWidth: 3,
        },
        {
          label: '彗星记录',
          data: dynasties.map(dynasty => getDynastyRecords(dynasty, totalRecords.comet)),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'comet' || !selectedCategory 
                ? 'rgba(100, 149, 237, 0.8)' 
                : 'rgba(100, 149, 237, 0.3)';
            }
            return 'rgba(100, 149, 237, 0.1)';
          },
          borderColor: 'rgba(100, 149, 237, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(100, 149, 237, 1)',
          hoverBorderWidth: 3,
        },
        {
          label: '新星记录',
          data: dynasties.map(dynasty => getDynastyRecords(dynasty, totalRecords.nova)),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'nova' || !selectedCategory 
                ? 'rgba(255, 69, 0, 0.8)' 
                : 'rgba(255, 69, 0, 0.3)';
            }
            return 'rgba(255, 69, 0, 0.1)';
          },
          borderColor: 'rgba(255, 69, 0, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(255, 69, 0, 1)',
          hoverBorderWidth: 3,
        },
        {
          label: '流星记录',
          data: dynasties.map(dynasty => getDynastyRecords(dynasty, totalRecords.meteor)),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'meteor' || !selectedCategory 
                ? 'rgba(144, 238, 144, 0.8)' 
                : 'rgba(144, 238, 144, 0.3)';
            }
            return 'rgba(144, 238, 144, 0.1)';
          },
          borderColor: 'rgba(144, 238, 144, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(144, 238, 144, 1)',
          hoverBorderWidth: 3,
        },
        {
          label: '天文仪器',
          data: dynasties.map(dynasty => {
            const dynastyData = timelineData.find(d => d.name === dynasty);
            return dynastyData?.instruments?.length || 0;
          }),
          backgroundColor: (context: any) => {
            const dynasty = dynasties[context.dataIndex];
            if (hoveredDynasty === dynasty || !hoveredDynasty) {
              return selectedCategory === 'instruments' || !selectedCategory 
                ? 'rgba(186, 85, 211, 0.8)' 
                : 'rgba(186, 85, 211, 0.3)';
            }
            return 'rgba(186, 85, 211, 0.1)';
          },
          borderColor: 'rgba(186, 85, 211, 1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(186, 85, 211, 1)',
          hoverBorderWidth: 3,
        },
      ],
    };
  };
  
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: ['中国各朝代天文成就统计', '古代天文观测记录与仪器数量分布'],
        color: 'white',
        font: {
          family: 'serif',
          size: 20,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'serif',
          size: 14
        },
        bodyFont: {
          family: 'serif',
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} 条记录`;
          },
          title: function(tooltipItems: any) {
            return `${tooltipItems[0].label} 朝代`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          font: {
            family: 'serif',
            size: 13
          },
          padding: 8
        },
        grid: {
          display: false
        },
        border: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            family: 'serif',
            size: 12
          },
          padding: 8
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    onHover: (event: any, elements: any) => {
      if (elements && elements.length > 0) {
        const dataIndex = elements[0].index;
        const dynasty = timelineData[dataIndex]?.name || null;
        setHoveredDynasty(dynasty);
      } else {
        setHoveredDynasty(null);
      }
    }
  };
  
  const data = prepareChartData();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-[500px] p-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl"
      >
        <Bar ref={chartRef} data={data} options={options} />
      </motion.div>

      <div className="text-center text-gray-400 text-sm">
        <p>注：尽管现代天文观测精度远超古代，但中国古代天文学家在当时条件下取得的成就仍然令人敬佩。</p>
      </div>
    </div>
  );
};

export default AstronomyAchievements; 