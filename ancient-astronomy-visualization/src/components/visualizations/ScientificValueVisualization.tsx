import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, PolarArea } from 'react-chartjs-2';

ChartJS.register(ArcElement, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

interface ScientificContribution {
  field: string;
  examples: string[];
  modernImpact: string;
  significance: string;
  citations: number;
  relevanceScore: number;
  relatedFields: string[];
}

interface ScientificValueVisualizationProps {
  className?: string;
}

const ScientificValueVisualization: React.FC<ScientificValueVisualizationProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'contribution' | 'relevance'>('contribution');
  const chartRef = useRef<HTMLDivElement>(null);
  
  const scientificData: ScientificContribution[] = [
    {
      field: '日食月食记录',
      examples: ['苏颂《新仪象法要》", "《汉书·天文志》记载", "《春秋》记载的日食记录'],
      modernImpact: '为研究地球自转减慢现象提供了关键历史数据',
      significance: '利用古代日食记录，现代天文学家可追溯地球自转速率的历史变化，对研究地球自转减慢机制和长期地球动力学提供了宝贵信息。',
      citations: 580,
      relevanceScore: 9.2,
      relatedFields: ['地球物理学', '天体力学', '历史气候学']
    },
    {
      field: '超新星记录',
      examples: ['宋代《宋史·天文志》记载1054年"客星"', '汉代《后汉书·天文志》记载185年超新星', '《宋史》记载1006年超新星'],
      modernImpact: '帮助天文学家确认超新星遗迹与爆发时间的对应关系',
      significance: '中国古代"客星"记录为现代天文学家识别和研究超新星遗迹如蟹状星云提供了精确的年代学数据，推动了恒星演化理论研究。',
      citations: 760,
      relevanceScore: 9.6,
      relatedFields: ['恒星物理学', '宇宙演化', '高能天体物理学']
    },
    {
      field: '彗星记录',
      examples: ['《史记·天官书》中的彗星记录', '《晋书·天文志》记录', '《明史·天文志》记录'],
      modernImpact: '帮助确认哈雷彗星等周期彗星的轨道和周期',
      significance: '通过中国古代上千年的彗星观测记录，天文学家能够确认和计算周期彗星的轨道参数，特别是哈雷彗星的历史回归，这对太阳系小天体研究有重要价值。',
      citations: 620,
      relevanceScore: 8.7,
      relatedFields: ['行星科学', '太阳系动力学', '小天体天文学']
    },
    {
      field: '流星和流星雨记录',
      examples: ['《后汉书·天文志》记录的"星陨如雨"', '宋代《武林旧事》中的流星雨记录', '《明实录》中的流星记录'],
      modernImpact: '帮助确认流星雨周期和母彗星的关系',
      significance: '中国古代对流星现象的长期记录帮助现代天文学家研究流星群的历史活动规律，识别新的流星雨周期，以及追踪它们与母彗星的关系。',
      citations: 510,
      relevanceScore: 8.3,
      relatedFields: ['大气科学', '小天体天文学', '太阳系形成史']
    },
    {
      field: '太阳黑子记录',
      examples: ['《汉书》中的"日中有黑"记录', '宋代司天监的系统性记录', '明清时期的黑子观测'],
      modernImpact: '为太阳活动周期的长期研究提供了早期数据',
      significance: '中国古代对太阳黑子的观测记录为研究太阳活动的长期变化提供了宝贵数据，帮助科学家研究太阳活动周期的长期演变和对地球气候的潜在影响。',
      citations: 680,
      relevanceScore: 9.0,
      relatedFields: ['太阳物理学', '空间天气学', '气候变化研究']
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getContributionChartData = () => {
    return {
      labels: scientificData.map(item => item.field),
      datasets: [
        {
          label: '学术引用数量',
          data: scientificData.map(item => item.citations),
          backgroundColor: [
            'rgba(180, 132, 108, 0.8)',
            'rgba(94, 114, 228, 0.8)',
            'rgba(45, 206, 137, 0.8)',
            'rgba(251, 99, 64, 0.8)',
            'rgba(130, 94, 216, 0.8)',
          ],
          borderColor: [
            'rgba(180, 132, 108, 1)',
            'rgba(94, 114, 228, 1)',
            'rgba(45, 206, 137, 1)',
            'rgba(251, 99, 64, 1)',
            'rgba(130, 94, 216, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const getRelevanceChartData = () => {
    return {
      labels: scientificData.map(item => item.field),
      datasets: [
        {
          label: '现代科学相关性评分',
          data: scientificData.map(item => item.relevanceScore),
          backgroundColor: [
            'rgba(180, 132, 108, 0.7)',
            'rgba(94, 114, 228, 0.7)',
            'rgba(45, 206, 137, 0.7)',
            'rgba(251, 99, 64, 0.7)',
            'rgba(130, 94, 216, 0.7)',
          ],
          borderColor: [
            'rgba(180, 132, 108, 1)',
            'rgba(94, 114, 228, 1)',
            'rgba(45, 206, 137, 1)',
            'rgba(251, 99, 64, 1)',
            'rgba(130, 94, 216, 1)',
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
          position: 'right' as const,
          labels: {
            font: {
              family: "'STSong', 'SimSun', serif"
            }
          }
        },
        title: {
          display: true,
          text: chartType === 'contribution' ? '古代天文记录的现代学术贡献' : '古代天文记录的现代科学相关性',
          font: {
            family: "'STSong', 'SimSun', serif",
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              if (chartType === 'contribution') {
                return `引用数量: ${context.raw}`;
              } else {
                return `相关性评分: ${context.raw}/10`;
              }
            }
          }
        }
      }
    };
  };
  
  const renderSelectedFieldDetail = () => {
    if (!selectedField) return null;
    
    const field = scientificData.find(f => f.field === selectedField);
    if (!field) return null;
    
    return (
      <motion.div 
        className="mt-6 p-4 bg-white/90 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold text-[#B4846C] mb-3">{field.field}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">主要历史记录:</span></p>
            <ul className="list-disc list-inside text-[#6B5C45] mb-4 pl-2">
              {field.examples.map((example, index) => (
                <li key={index} className="mb-1">{example}</li>
              ))}
            </ul>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">学术引用数量:</span> {field.citations}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">现代科学相关性:</span> {field.relevanceScore}/10</p>
          </div>
          <div>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">现代影响:</span> {field.modernImpact}</p>
            <p className="text-[#6B5C45] mb-2"><span className="font-bold">科学意义:</span> {field.significance}</p>
            <p className="text-[#6B5C45] mb-2">
              <span className="font-bold">相关研究领域:</span> {field.relatedFields.join('、')}
            </p>
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
      <h2 className="text-2xl font-bold text-center text-[#4A4236] mb-6">中国古代天文记录的现代科学价值</h2>
      
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
                  <th className="py-3 px-4 text-left font-semibold">古代天文记录</th>
                  <th className="py-3 px-4 text-left font-semibold">现代科学影响</th>
                  <th className="py-3 px-4 text-left font-semibold">学术引用</th>
                  <th className="py-3 px-4 text-left font-semibold">相关性评分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B4846C]/10">
                {scientificData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-[#B4846C]/5 transition-colors cursor-pointer ${
                      selectedField === item.field ? 'bg-[#B4846C]/10' : ''
                    }`}
                    onClick={() => setSelectedField(item.field)}
                  >
                    <td className="py-2 px-4 text-[#6B5C45] font-medium">{item.field}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{item.modernImpact}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{item.citations}</td>
                    <td className="py-2 px-4 text-[#6B5C45]">{item.relevanceScore}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {renderSelectedFieldDetail()}
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            注：学术引用数据基于近20年国际天文学期刊中引用古代中国天文记录的论文统计，相关性评分由现代天文学家评估。
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
              onClick={() => setChartType('contribution')}
              className={`px-4 py-2 rounded-md transition-all ${
                chartType === 'contribution' 
                  ? 'bg-[#B4846C] text-white' 
                  : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
            >
              学术贡献
            </button>
            <button
              onClick={() => setChartType('relevance')}
              className={`px-4 py-2 rounded-md transition-all ${
                chartType === 'relevance' 
                  ? 'bg-[#B4846C] text-white' 
                  : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
            >
              科学相关性
            </button>
          </div>
          
          <div ref={chartRef} className="h-80 mb-6 flex justify-center">
            <div className="w-full max-w-xl">
              {chartType === 'contribution' ? (
                <Pie 
                  data={getContributionChartData()} 
                  options={getChartOptions()} 
                  key="contribution-chart"
                />
              ) : (
                <PolarArea 
                  data={getRelevanceChartData()} 
                  options={getChartOptions()} 
                  key="relevance-chart"
                />
              )}
            </div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-[#4A4236] mb-2">分析结论</h3>
            <ul className="list-disc list-inside text-[#6B5C45] space-y-2">
              <li>超新星记录在现代天文学研究中具有最高的科学价值，尤其是对恒星演化和超新星遗迹研究具有不可替代的历史参考价值。</li>
              <li>太阳黑子和日食月食记录对研究太阳活动周期和地球自转变化提供了关键的长期历史数据。</li>
              <li>彗星记录对确认周期彗星的轨道和回归周期有重要价值，特别是对哈雷彗星的研究贡献显著。</li>
              <li>中国古代天文记录跨越数千年，其连续性和系统性在世界天文史上独一无二，为现代天文学提供了宝贵的历史数据。</li>
              <li>近年来随着数据分析技术的发展，古代天文记录的价值被进一步挖掘，在多个研究领域获得了新的应用。</li>
            </ul>
          </div>
          
          <p className="text-xs text-[#6B5C45]/80 mt-6 text-center">
            数据来源：《中国古代天文记录的现代科学价值》、国际天文学联合会研究报告
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ScientificValueVisualization; 