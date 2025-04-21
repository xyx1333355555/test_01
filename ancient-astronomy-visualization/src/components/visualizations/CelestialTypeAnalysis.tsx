import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CelestialDataAnalyzer, CelestialEventType } from '@/utils/celestialDataAnalyzer';
import { CelestialRecord } from '@/data/celestialRecordsData';
import CelestialDataCharts from './CelestialDataCharts';

// 组件属性
interface CelestialTypeAnalysisProps {
  records: CelestialRecord[];
  className?: string;
}

// 类型信息配置
const typeInfo = {
  solar: {
    name: '日食',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    color: '#FF8C00',
    description: '日食是月球位于太阳与地球之间，遮挡太阳光线照射地球而形成的天文现象。古代中国天文学家能够精确预测日食，并通过观测验证历法的准确性。',
    significance: '日食预测是古代天文学的重要成就，也是官方天文机构的重要职责。《春秋》中记载的日食是世界最早的可靠日食记录之一。',
    sources: ['《春秋》', '《史记·天官书》', '《汉书·天文志》', '甲骨文'],
    patterns: '古代天文学家通过长期观测，发现了日食的周期性，建立了"三百七十五日、十九年七闰"的交食规律。',
  },
  lunar: {
    name: '月食',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3a9 9 0 109 9c0-5-4-9-9-9z" />
      </svg>
    ),
    color: '#6A5ACD',
    description: '月食是地球位于太阳与月球之间，地球的影子投射到月球表面上形成的天文现象。古代中国对月食有系统的观测记录，并理解了其周期性。',
    significance: '月食观测是古代历法发展的基础，也是测量天文单位的重要工具。月食的准确预测展示了古代天文历法的精确性。',
    sources: ['《尚书·武成》', '《春秋》', '《汉书·天文志》', '《晋书·天文志》'],
    patterns: '古代天文学家通过长期观测，掌握了朔望月和交食周期，能够预测月食的发生时间和规模。',
  },
  comet: {
    name: '彗星',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.5 2l-2 5h5l-2 5h5l-8 10 2-7h-4l2-6h-4z" />
      </svg>
    ),
    color: '#32CD32',
    description: '彗星是由冰、尘埃和小岩石组成的太阳系天体，当接近太阳时会形成彗尾。古代中国天文学家将彗星称为"孛星"或"扫星"，有大量彗星观测记录。',
    significance: '彗星在古代被视为重要的预兆，往往与重大政治军事变化相关联。哈雷彗星在中国古代文献中有连续数千年的记录。',
    sources: ['《史记·天官书》', '《汉书·天文志》', '《晋书·天文志》', '《宋史·天文志》'],
    patterns: '古代天文学家根据彗星的形态、颜色、尾巴长度和出现位置进行分类，并注意到某些彗星有周期性出现的特点。',
  },
  nova: {
    name: '新星',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    color: '#DC143C',
    description: '新星和超新星是恒星在演化末期的爆发现象，会在短时间内爆发出极强的亮度。古代中国天文学家称其为"客星"，记录了多次超新星爆发。',
    significance: '古代新星记录是现代天文学研究超新星爆发历史的重要资料。1054年宋朝观测的超新星（现在的蟹状星云）是最著名的例子。',
    sources: ['《宋史·天文志》', '《史记·天官书》', '《汉书·天文志》'],
    patterns: '古代天文学家记录了"客星"出现的位置、亮度、颜色和持续时间，通常精确到具体的星宿区域。',
  },
  meteor: {
    name: '流星',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4l-7 14-4-8-8 4 18-10z" />
      </svg>
    ),
    color: '#1E90FF',
    description: '流星是小流星体进入地球大气层产生的发光现象。古代中国称其为"流星"、"飞星"或"长星"，并记录了多次大规模流星雨。',
    significance: '流星记录展示了古代天文观测的广泛性和系统性，流星雨的周期性被用于历法制定和季节预测。',
    sources: ['《汉书·天文志》', '《晋书·天文志》', '《宋史·天文志》'],
    patterns: '古代天文学家记录了流星的起止方向、亮度和数量，并注意到某些流星雨在特定时间周期性出现的规律。',
  },
};

/**
 * 天象类型统计分析和可视化组件
 */
const CelestialTypeAnalysis: React.FC<CelestialTypeAnalysisProps> = ({ records, className }) => {
  const [activeTab, setActiveTab] = useState<CelestialEventType>('solar');
  const [typeData, setTypeData] = useState<{[key in CelestialEventType]: CelestialRecord[]}>();
  const [loading, setLoading] = useState(true);
  const [analyzer] = useState(() => new CelestialDataAnalyzer(records));
  const [accuracyData, setAccuracyData] = useState<any>(null);
  
  // 初始化类型数据
  useEffect(() => {
    setLoading(true);
    
    // 按类型分类记录
    const data = {
      solar: records.filter(r => r.id.startsWith('solar')),
      lunar: records.filter(r => r.id.startsWith('lunar')),
      comet: records.filter(r => r.id.startsWith('comet')),
      nova: records.filter(r => r.id.startsWith('nova')),
      meteor: records.filter(r => r.id.startsWith('meteor')),
    };
    
    setTypeData(data);
    
    // 获取准确度分析数据
    try {
      const accuracy = analyzer.analyzeAccuracy();
      setAccuracyData(accuracy);
    } catch (err) {
      console.error('分析天象准确度时出错:', err);
    }
    
    setLoading(false);
  }, [records, analyzer]);
  
  // 切换标签
  const handleTabChange = (type: CelestialEventType) => {
    setActiveTab(type);
  };
  
  // 获取当前类型的记录数量和平均准确度
  const getTypeStats = (type: CelestialEventType) => {
    if (!typeData || !accuracyData) return { count: 0, accuracy: 0 };
    
    const count = typeData[type].length;
    const accuracy = accuracyData.byType[type] || 0;
    
    return { count, accuracy };
  };
  
  // 根据天象类型筛选记录
  const getFilteredRecords = () => {
    if (!typeData) return [];
    return typeData[activeTab];
  };
  
  // 获取时间分布
  const getTimePeriods = (type: CelestialEventType) => {
    if (!typeData) return [];
    
    const records = typeData[type];
    const byDynasty: {[key: string]: number} = {};
    
    records.forEach(record => {
      if (!byDynasty[record.dynasty]) {
        byDynasty[record.dynasty] = 0;
      }
      byDynasty[record.dynasty]++;
    });
    
    return Object.entries(byDynasty)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([dynasty, count]) => `${dynasty} (${count}条)`);
  };
  
  // 获取数据源
  const getDataSources = (type: CelestialEventType) => {
    if (!typeData) return [];
    
    const records = typeData[type];
    const sources: {[key: string]: number} = {};
    
    records.forEach(record => {
      if (!sources[record.source]) {
        sources[record.source] = 0;
      }
      sources[record.source]++;
    });
    
    return Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([source, count]) => `${source} (${count}条)`);
  };
  
  return (
    <div className={`space-y-8 ${className || ''}`}>
      {/* 类型标签导航 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(typeInfo) as CelestialEventType[]).map(type => {
          const info = typeInfo[type];
          const stats = getTypeStats(type);
          
          return (
            <motion.button
              key={type}
              className={`relative rounded-lg p-4 flex flex-col items-center text-center transition-all ${
                activeTab === type 
                  ? 'bg-white shadow-lg border-b-4 text-gray-800'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              style={{ 
                borderBottomColor: activeTab === type ? info.color : 'transparent',
              }}
              onClick={() => handleTabChange(type)}
              whileHover={{ y: -5 }}
              whileTap={{ y: 0 }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ 
                  backgroundColor: activeTab === type ? info.color : '#E5E7EB',
                  color: activeTab === type ? 'white' : '#6B7280'
                }}
              >
                {info.icon}
              </div>
              <h3 className="font-bold">{info.name}</h3>
              <p className="text-xs mt-1">
                {stats.count}条记录 • {stats.accuracy.toFixed(1)}%准确度
              </p>
              {activeTab === type && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-ancient-jade text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* 类型详情 */}
      {!loading && typeData && (
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题栏 */}
          <div 
            className="py-4 px-6 flex items-center justify-between"
            style={{ backgroundColor: typeInfo[activeTab].color }}
          >
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">{typeInfo[activeTab].icon}</span>
              {typeInfo[activeTab].name}天象分析
            </h2>
            <div className="text-white text-sm">
              数据来源：{typeInfo[activeTab].sources.join('、')}
            </div>
          </div>
          
          {/* 内容区域 */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* 左侧信息 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 描述 */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 border-l-4 pl-3" style={{ borderLeftColor: typeInfo[activeTab].color }}>
                    天象特点
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {typeInfo[activeTab].description}
                  </p>
                </div>
                
                {/* 统计信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">记录分布时期</h4>
                    <ul className="text-sm space-y-1">
                      {getTimePeriods(activeTab).map((period, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: typeInfo[activeTab].color }}></span>
                          {period}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">主要数据来源</h4>
                    <ul className="text-sm space-y-1">
                      {getDataSources(activeTab).map((source, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: typeInfo[activeTab].color }}></span>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* 科学价值 */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 border-l-4 pl-3" style={{ borderLeftColor: typeInfo[activeTab].color }}>
                    科学价值
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {typeInfo[activeTab].significance}
                  </p>
                </div>
                
                {/* 规律发现 */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 border-l-4 pl-3" style={{ borderLeftColor: typeInfo[activeTab].color }}>
                    规律发现
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {typeInfo[activeTab].patterns}
                  </p>
                </div>
              </div>
              
              {/* 右侧图表 */}
              <div className="lg:col-span-3 space-y-6">
                {/* 准确度图表 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-l-4 pl-3" style={{ borderLeftColor: typeInfo[activeTab].color }}>
                    记录准确度分析
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-medium mb-2">准确度分析</h4>
                      <CelestialDataCharts
                        records={getFilteredRecords()}
                        chartType="accuracy"
                        className="h-60"
                        chartId={`type-accuracy-${activeTab}`}
                      />
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-medium mb-2">时间分布</h4>
                      <CelestialDataCharts
                        records={getFilteredRecords()}
                        chartType="timeline"
                        className="h-60"
                        chartId={`type-timeline-${activeTab}`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 记录表格 */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 border-l-4 pl-3" style={{ borderLeftColor: typeInfo[activeTab].color }}>
                    代表性历史记录
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">朝代</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">准确度</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredRecords().slice(0, 5).map((record, index) => (
                          <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dynasty}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{record.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.source}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="relative w-24 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="absolute top-0 left-0 h-2.5 rounded-full" 
                                    style={{ 
                                      width: `${record.accuracy}%`,
                                      backgroundColor: typeInfo[activeTab].color
                                    }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs">{record.accuracy}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CelestialTypeAnalysis; 