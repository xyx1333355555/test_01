import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Select from '@/components/ui/Select';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface CalendarData {
  name: string;
  dynasty: string;
  year: string;
  length: string;
  modernValue: string;
  accuracy: string;
  description: string;
}

interface CalendarAccuracyAnalysisProps {
  className?: string;
}

const CalendarAccuracyAnalysis: React.FC<CalendarAccuracyAnalysisProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [selectedChart, setSelectedChart] = useState<'accuracy' | 'comparison'>('accuracy');
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const calendarData: CalendarData[] = [
    {
      name: '太初历',
      dynasty: '西汉',
      year: '公元前104年',
      length: '365.25 天',
      modernValue: '365.2422 天',
      accuracy: '99.9979%',
      description: '由邓平、落下闳等人制定，确立了以冬至为历法起点的原则'
    },
    {
      name: '四分历',
      dynasty: '东汉',
      year: '公元85年',
      length: '365.25 天',
      modernValue: '365.2422 天',
      accuracy: '99.9979%',
      description: '由刘洪制定，沿用太初历的基本原则，使用了更精确的观测数据'
    },
    {
      name: '大明历',
      dynasty: '南北朝',
      year: '公元510年',
      length: '365.24281 天',
      modernValue: '365.2422 天',
      accuracy: '99.9998%',
      description: '由祖冲之制定，对回归年长度的计算达到了极高的精度'
    },
    {
      name: '大衍历',
      dynasty: '唐朝',
      year: '公元729年',
      length: '365.2446 天',
      modernValue: '365.2422 天',
      accuracy: '99.9993%',
      description: '由一行和南宫说创制，引入了交食计算的新方法'
    },
    {
      name: '授时历',
      dynasty: '元朝',
      year: '公元1281年',
      length: '365.2425 天',
      modernValue: '365.2422 天',
      accuracy: '99.9999%',
      description: '由郭守敬主持编制，是中国古代最精确的历法之一'
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getAccuracyChartData = () => {
    return {
      labels: calendarData.map(item => item.name),
      datasets: [
        {
          label: '精度百分比',
          data: calendarData.map(item => parseFloat(item.accuracy.replace('%', ''))),
          backgroundColor: [
            'rgba(180, 132, 108, 0.8)',
            'rgba(180, 132, 108, 0.7)',
            'rgba(180, 132, 108, 0.9)',
            'rgba(180, 132, 108, 0.7)',
            'rgba(180, 132, 108, 0.8)',
          ],
          borderColor: [
            'rgba(180, 132, 108, 1)',
            'rgba(180, 132, 108, 1)',
            'rgba(180, 132, 108, 1)',
            'rgba(180, 132, 108, 1)',
            'rgba(180, 132, 108, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const getComparisonChartData = () => {
    return {
      labels: calendarData.map(item => item.name),
      datasets: [
        {
          label: '历法回归年长度',
          data: calendarData.map(item => parseFloat(item.length.replace(' 天', ''))),
          backgroundColor: 'rgba(180, 132, 108, 0.2)',
          borderColor: 'rgba(180, 132, 108, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: false
        },
        {
          label: '现代测量值',
          data: calendarData.map(() => parseFloat('365.2422')),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        }
      ],
    };
  };
  
  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              family: "'STSong', 'SimSun', serif"
            }
          }
        },
        title: {
          display: true,
          text: selectedChart === 'accuracy' ? '中国古代历法精度分析' : '历法回归年长度与现代测量对比',
          font: {
            family: "'STSong', 'SimSun', serif",
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              if (selectedChart === 'accuracy') {
                return `精度: ${context.raw}%`;
              } else {
                return `${context.dataset.label}: ${context.raw} 天`;
              }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: selectedChart === 'accuracy' ? false : false,
          ticks: {
            font: {
              family: "'STSong', 'SimSun', serif"
            },
            callback: function(value: any) {
              if (selectedChart === 'accuracy') {
                return value + '%';
              } else {
                return value;
              }
            }
          },
          min: selectedChart === 'accuracy' ? 99.997 : 365.23,
          max: selectedChart === 'accuracy' ? 100.0001 : 365.26,
        },
        x: {
          ticks: {
            font: {
              family: "'STSong', 'SimSun', serif"
            }
          }
        }
      }
    };
  };
  
  const renderSelectedCalendarDetail = () => {
    if (!selectedCalendar) return null;
    
    const calendar = calendarData.find(c => c.name === selectedCalendar);
    if (!calendar) return null;
    
    return (
      <motion.div 
        className="mt-6 p-4 bg-white/90 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold text-[#B4846C] mb-3">{calendar.name} <span className="text-sm font-normal text-[#6B5C45]">({calendar.dynasty}, {calendar.year})</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">回归年长度:</span> {calendar.length}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">现代测量值:</span> {calendar.modernValue}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">精度:</span> {calendar.accuracy}</p>
          </div>
          <div>
            <p className="text-[#6B5C45]">{calendar.description}</p>
          </div>
        </div>
      </motion.div>
    );
  };
  
  if (isLoading) {
    return (
      <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4846C]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-center text-[#4A4236] mb-6">中国古代历法精度分析</h2>
      
      {/* 视图选择 */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveView('table')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'table' 
              ? 'bg-[#B4846C] text-white' 
              : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
          }`}
        >
          表格视图
        </button>
        <button
          onClick={() => setActiveView('chart')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'chart' 
              ? 'bg-[#B4846C] text-white' 
              : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
          }`}
        >
          图表视图
        </button>
      </div>
      
      {/* 表格视图 */}
      {activeView === 'table' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-[#B4846C]/20 text-[#4A4236]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">历法名称</th>
                  <th className="py-3 px-4 text-left font-semibold">朝代</th>
                  <th className="py-3 px-4 text-left font-semibold">年份</th>
                  <th className="py-3 px-4 text-left font-semibold">回归年长度</th>
                  <th className="py-3 px-4 text-left font-semibold">现代测量值</th>
                  <th className="py-3 px-4 text-left font-semibold">精度(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B4846C]/10">
                {calendarData.map((calendar, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-[#B4846C]/5 transition-colors cursor-pointer ${
                      selectedCalendar === calendar.name ? 'bg-[#B4846C]/10' : ''
                    }`}
                    onClick={() => setSelectedCalendar(calendar.name)}
                  >
                    <td className="py-2 px-4 text-[#6B5C45] font-medium">{calendar.name}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{calendar.dynasty}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{calendar.year}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{calendar.length}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{calendar.modernValue}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{calendar.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {renderSelectedCalendarDetail()}
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            注：现代测量的回归年长度为365.2422天，中国古代历法对回归年长度的测量达到了极高的精度。
          </p>
        </motion.div>
      )}
      
      {/* 图表视图 */}
      {activeView === 'chart' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedChart('accuracy')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedChart === 'accuracy' 
                  ? 'bg-[#B4846C] text-white' 
                  : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
            >
              精度分析
            </button>
            <button
              onClick={() => setSelectedChart('comparison')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedChart === 'comparison' 
                  ? 'bg-[#B4846C] text-white' 
                  : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
            >
              回归年对比
            </button>
          </div>
          
          <div ref={chartRef} className="h-80 mb-6">
            {selectedChart === 'accuracy' ? (
              <Bar 
                data={getAccuracyChartData()} 
                options={getChartOptions()} 
                key="accuracy-chart"
              />
            ) : (
              <Line 
                data={getComparisonChartData()} 
                options={getChartOptions()} 
                key="comparison-chart"
              />
            )}
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-[#4A4236] mb-2">分析结论</h3>
            <ul className="list-disc list-inside text-[#6B5C45] space-y-2">
              <li>中国古代历法在回归年长度的计算上展现出极高的精度，尤其是授时历和大明历。</li>
              <li>祖冲之在公元5世纪制定的大明历，其回归年长度计算达到了99.9998%的精度，超过了同时期世界其他地区的历法。</li>
              <li>元朝郭守敬主持编制的授时历精度达到了99.9999%，是中国古代历法发展的巅峰之作。</li>
              <li>这些历法的高精度计算反映了中国古代天文学家精确的观测能力和先进的数学方法。</li>
            </ul>
          </div>
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            数据来源：《中国古代历法通考》、《中国科学技术史·天文学卷》
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarAccuracyAnalysis; 