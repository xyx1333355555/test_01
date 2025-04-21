import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Select from '@/components/ui/Select';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface ObservationData {
  name: string;
  method: string;
  ancientAccuracy: string;
  modernMethod: string;
  modernAccuracy: string;
  improvementFactor: string;
  significance: string;
}

interface ObservationAccuracyAnalysisProps {
  className?: string;
}

const ObservationAccuracyAnalysis: React.FC<ObservationAccuracyAnalysisProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const observationData: ObservationData[] = [
    {
      name: '冬至点测定',
      method: '圭表测影',
      ancientAccuracy: '0.5度',
      modernMethod: '天体测量仪器',
      modernAccuracy: '0.0001度',
      improvementFactor: '×5000',
      significance: '冬至点的准确测定是历法制定的基础，对农业生产具有重要指导意义'
    },
    {
      name: '日食预测',
      method: '历法计算',
      ancientAccuracy: '0.8度',
      modernMethod: '天文动力学模型',
      modernAccuracy: '0.0001度',
      improvementFactor: '×8000',
      significance: '日食预测能力反映了对天体运行规律的掌握程度，也是政治和文化的重要组成部分'
    },
    {
      name: '恒星位置测量',
      method: '浑天仪',
      ancientAccuracy: '0.3度',
      modernMethod: '射电望远镜',
      modernAccuracy: '0.00001度',
      improvementFactor: '×30000',
      significance: '恒星位置的精确测量是星图绘制和导航的基础，对天文学发展至关重要'
    },
    {
      name: '行星运动预测',
      method: '历法推算',
      ancientAccuracy: '1.2度',
      modernMethod: '行星动力学模型',
      modernAccuracy: '0.0001度',
      improvementFactor: '×12000',
      significance: '行星运动预测反映了对太阳系结构的理解，是天文学核心研究内容之一'
    },
    {
      name: '岁差测量',
      method: '长期天象记录比对',
      ancientAccuracy: '0.8度',
      modernMethod: '高精度天体测量',
      modernAccuracy: '0.0001度',
      improvementFactor: '×8000',
      significance: '岁差测量反映了对地球自转轴变化的认识，是历法长期准确性的保证'
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getChartData = () => {
    return {
      labels: observationData.map(item => item.name),
      datasets: [
        {
          label: '精度提升倍数',
          data: observationData.map(item => parseInt(item.improvementFactor.replace('×', ''))),
          backgroundColor: [
            'rgba(180, 132, 108, 0.8)',
            'rgba(180, 132, 108, 0.65)',
            'rgba(180, 132, 108, 0.9)',
            'rgba(180, 132, 108, 0.7)',
            'rgba(180, 132, 108, 0.75)',
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
          text: '观测精度提升倍数对比',
          font: {
            family: "'STSong', 'SimSun', serif",
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `提升倍数: ${context.raw}倍`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '精度提升倍数',
            font: {
              family: "'STSong', 'SimSun', serif"
            }
          },
          ticks: {
            font: {
              family: "'STSong', 'SimSun', serif"
            }
          }
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
  
  const renderSelectedObservationDetail = () => {
    if (!selectedObservation) return null;
    
    const observation = observationData.find(o => o.name === selectedObservation);
    if (!observation) return null;
    
    return (
      <motion.div 
        className="mt-6 p-4 bg-white/90 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold text-[#B4846C] mb-3">{observation.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">古代观测方法:</span> {observation.method}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">古代观测精度:</span> {observation.ancientAccuracy}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">现代观测方法:</span> {observation.modernMethod}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">现代观测精度:</span> {observation.modernAccuracy}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">精度提升:</span> {observation.improvementFactor}</p>
          </div>
          <div>
            <p className="text-[#6B5C45]"><span className="font-bold">科学意义:</span> {observation.significance}</p>
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
      <h2 className="text-2xl font-bold text-center text-[#4A4236] mb-6">中国古代天文观测精度分析</h2>
      
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
                  <th className="py-3 px-4 text-left font-semibold">天文现象</th>
                  <th className="py-3 px-4 text-left font-semibold">古代方法</th>
                  <th className="py-3 px-4 text-left font-semibold">古代精度</th>
                  <th className="py-3 px-4 text-left font-semibold">现代方法</th>
                  <th className="py-3 px-4 text-left font-semibold">现代精度</th>
                  <th className="py-3 px-4 text-left font-semibold">提升倍数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B4846C]/10">
                {observationData.map((observation, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-[#B4846C]/5 transition-colors cursor-pointer ${
                      selectedObservation === observation.name ? 'bg-[#B4846C]/10' : ''
                    }`}
                    onClick={() => setSelectedObservation(observation.name)}
                  >
                    <td className="py-2 px-4 text-[#6B5C45] font-medium">{observation.name}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{observation.method}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{observation.ancientAccuracy}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{observation.modernMethod}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{observation.modernAccuracy}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{observation.improvementFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {renderSelectedObservationDetail()}
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            注：尽管现代天文观测精度远超古代，但中国古代天文学家在当时条件下取得的成就仍然令人敬佩。
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
          <div ref={chartRef} className="h-80 mb-6">
            <Bar 
              data={getChartData()} 
              options={getChartOptions()} 
              key="accuracy-improvement-chart"
            />
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-[#4A4236] mb-2">分析结论</h3>
            <ul className="list-disc list-inside text-[#6B5C45] space-y-2">
              <li>恒星位置测量精度提升最为显著，现代技术比古代技术提高了约30000倍。</li>
              <li>行星运动预测精度提升约12000倍，反映了现代天文动力学模型的巨大优势。</li>
              <li>日食预测和岁差测量精度均提升了约8000倍，主要得益于现代观测设备和计算技术。</li>
              <li>尽管精度差异巨大，但中国古代天文学家在简单工具条件下，仍然取得了令人惊叹的观测精度。</li>
              <li>这些成就为中国古代历法和天文学奠定了坚实基础，对农业生产和社会发展产生了重要影响。</li>
            </ul>
          </div>
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            数据来源：《中国科学技术史·天文学卷》、《中国古代天文学成就研究》
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ObservationAccuracyAnalysis; 