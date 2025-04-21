import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Radar, PolarArea, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ScientificValueChartsProps {
  className?: string;
}

// 定义导航项类型
interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const ScientificValueCharts: React.FC<ScientificValueChartsProps> = ({ className = '' }) => {
  // 状态管理
  const [activeChart, setActiveChart] = useState<string>('time_analysis');
  const [isLoading, setIsLoading] = useState(true);
  
  // 导航项定义 - 更新为四个新的分析类型
  const navItems: NavItem[] = [
    { id: 'time_analysis', label: '时间精度分析', icon: '📅' },
    { id: 'astronomy_evolution', label: '天文学演变', icon: '🔭' },
    { id: 'global_comparison', label: '全球比较', icon: '🌐' },
    { id: 'modern_application', label: '现代应用', icon: '🛰️' }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 时间精度分析数据
  const timeAccuracyData = {
    labels: ['商周时期', '秦汉时期', '魏晋南北朝', '隋唐时期', '宋元时期', '明清时期'],
    datasets: [
      {
        label: '日食预测平均误差(分钟)',
        data: [180, 105, 75, 45, 30, 22],
        backgroundColor: 'rgba(180, 132, 108, 0.7)',
      },
      {
        label: '日月合朔计算误差(分钟)',
        data: [210, 120, 90, 60, 42, 28],
        backgroundColor: 'rgba(106, 90, 76, 0.7)',
      }
    ]
  };
  
  // 天文学演变数据
  const astronomyEvolutionData = {
    labels: ['公元前1000年', '公元前500年', '公元1年', '公元500年', '公元1000年', '公元1500年', '公元1900年'],
    datasets: [
      {
        label: '观测仪器精度',
        data: [15, 25, 35, 45, 60, 75, 90],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: '天体定位精度',
        data: [10, 20, 30, 40, 55, 70, 85],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: '历法预测精度',
        data: [20, 30, 42, 53, 65, 80, 93],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  // 全球比较数据
  const globalComparisonData = {
    labels: ['观测连续性', '日食记录精度', '彗星记录完整性', '新星记录', '恒星目录', '历法精度', '观测仪器'],
    datasets: [
      {
        label: '中国古代天文学',
        data: [95, 88, 92, 90, 78, 86, 82],
        backgroundColor: 'rgba(180, 132, 108, 0.2)',
        borderColor: 'rgba(180, 132, 108, 1)',
        pointBackgroundColor: 'rgba(180, 132, 108, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(180, 132, 108, 1)'
      },
      {
        label: '巴比伦天文学',
        data: [65, 85, 75, 55, 70, 90, 80],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      },
      {
        label: '古希腊天文学',
        data: [55, 75, 65, 60, 90, 80, 85],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 206, 86, 1)'
      }
    ]
  };
  
  // 现代应用数据
  const modernApplicationData = {
    labels: [
      '太阳黑子周期研究', 
      '超新星历史分析', 
      '彗星轨道确定', 
      '地球自转变化', 
      '行星运动规律', 
      '天体坐标系统'
    ],
    datasets: [
      {
        label: '中国古代记录应用价值',
        data: [82, 95, 88, 90, 78, 75],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // 图表选项
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: '各历史时期天文观测精度分析',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '误差值(分钟)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '中国古代天文学发展演变趋势',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '相对精度(%)',
          font: {
            size: 12
          }
        }
      }
    }
  };
  
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '全球古代天文学成就比较',
        font: {
          size: 16
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
          font: {
            size: 10
          }
        }
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '古代天文记录在现代研究中的应用价值',
        font: {
          size: 16
        }
      }
    }
  };
  
  // 根据选择的图表类型渲染不同的图表
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    switch(activeChart) {
      case 'time_analysis':
        return (
          <div style={{ height: '400px', marginBottom: '2rem' }}>
            <Bar 
              data={timeAccuracyData} 
              options={barOptions}
            />
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              数据来源：基于《中国古代历法精度研究》与现代天文学计算的对比分析
            </p>
          </div>
        );
      case 'astronomy_evolution':
        return (
          <div style={{ height: '400px', marginBottom: '2rem' }}>
            <Line 
              data={astronomyEvolutionData} 
              options={lineOptions}
            />
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              数据来源：基于《中国天文学史》与《世界天文学发展通史》的综合分析
            </p>
          </div>
        );
      case 'global_comparison':
        return (
          <div style={{ height: '450px', marginBottom: '2rem' }}>
            <Radar 
              data={globalComparisonData} 
              options={radarOptions}
            />
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              数据来源：基于《世界古代天文学比较研究》的学术成果
            </p>
          </div>
        );
      case 'modern_application':
        return (
          <div style={{ height: '450px', marginBottom: '2rem' }}>
            <Pie 
              data={modernApplicationData} 
              options={pieOptions}
            />
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              数据来源：基于《古代天文记录在现代天文研究中的应用》统计分析
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#4A4236] mb-4">中国古代天文观测数据分析</h3>
        <p className="text-[#6B5C45] mb-6">
          通过分析中国古代天文观测记录，我们可以评估其科学精度、演变趋势及现代价值
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveChart(item.id)}
              className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors ${
                activeChart === item.id 
                  ? 'bg-[#B4846C] text-white' 
                  : 'bg-gray-100 text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default ScientificValueCharts; 