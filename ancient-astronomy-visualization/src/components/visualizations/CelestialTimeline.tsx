import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelestialDataAnalyzer, CelestialEventType, dynastyPeriods } from '@/utils/celestialDataAnalyzer';
import { CelestialRecord } from '@/data/celestialRecordsData';

// 组件属性
interface CelestialTimelineProps {
  records: CelestialRecord[];
  className?: string;
  onSelectRecord?: (record: CelestialRecord) => void;
}

// 朝代颜色映射
const dynastyColors: {[key: string]: string} = {
  '商朝': '#8B4513',
  '西周': '#B8860B',
  '东周': '#CD853F',
  '春秋时期': '#DAA520',
  '战国时期': '#D2691E',
  '秦朝': '#8B0000',
  '西汉': '#A0522D',
  '东汉': '#CD5C5C',
  '三国时期': '#F08080',
  '晋朝': '#BC8F8F',
  '南北朝': '#E9967A',
  '隋朝': '#5F9EA0',
  '唐朝': '#4682B4',
  '五代十国': '#708090',
  '北宋': '#4169E1',
  '南宋': '#1E90FF',
  '元朝': '#483D8B',
  '明朝': '#9370DB',
  '清朝': '#6A5ACD',
};

// 类型颜色映射
const typeColors: {[key in CelestialEventType]: string} = {
  solar: '#FF8C00', // 橙色
  lunar: '#6A5ACD', // 靛蓝色
  comet: '#32CD32', // 绿色
  nova: '#DC143C',  // 深红色
  meteor: '#1E90FF', // 蓝色
};

// 天象类型中文名称
const typeNames: {[key in CelestialEventType]: string} = {
  solar: '日食',
  lunar: '月食',
  comet: '彗星',
  nova: '新星',
  meteor: '流星',
};

/**
 * 天象记录时间线可视化组件
 */
const CelestialTimeline: React.FC<CelestialTimelineProps> = ({ records, className, onSelectRecord }) => {
  const [analyzer] = useState(() => new CelestialDataAnalyzer(records));
  const [timelineData, setTimelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<CelestialEventType | 'all'>('all');
  const [activeDynasty, setActiveDynasty] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // 分析时间线数据
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const data = analyzer.analyzeTimeDistribution();
      setTimelineData(data);
    } catch (err) {
      console.error('分析时间线数据时出错:', err);
      setError(err instanceof Error ? err.message : '分析时间线数据时出错');
    } finally {
      setLoading(false);
    }
  }, [analyzer]);
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        setViewportWidth(timelineRef.current.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 过滤事件类型
  const filterByType = (type: CelestialEventType | 'all') => {
    setActiveType(type);
  };
  
  // 过滤朝代
  const filterByDynasty = (dynasty: string | null) => {
    setActiveDynasty(dynasty === activeDynasty ? null : dynasty);
  };
  
  // 调整缩放级别
  const handleZoom = (level: number) => {
    setZoomLevel(Math.max(0.5, Math.min(3, level)));
  };
  
  // 生成时间线刻度
  const generateTimelineMarkers = () => {
    if (!timelineData) return [];
    
    // 找出时间范围
    const years = timelineData.timeline.map((event: any) => event.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    // 根据范围生成世纪刻度
    const markers = [];
    const startCentury = Math.floor(minYear / 100) * 100;
    const endCentury = Math.ceil(maxYear / 100) * 100;
    
    for (let year = startCentury; year <= endCentury; year += 100) {
      markers.push({
        year,
        label: year < 0 ? `前${Math.abs(year)}年` : `${year}年`,
        isCentury: true
      });
    }
    
    return markers;
  };
  
  // 获取事件位置百分比
  const getEventPosition = (year: number) => {
    if (!timelineData) return 0;
    
    // 找出时间范围
    const years = timelineData.timeline.map((event: any) => event.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const range = maxYear - minYear;
    
    // 计算相对位置（0-100%）
    return ((year - minYear) / range) * 100;
  };
  
  // 获取朝代时间段的位置和宽度
  const getDynastyPosition = (dynasty: string) => {
    if (!timelineData || !dynastyPeriods[dynasty]) return { left: 0, width: 0 };
    
    // 找出时间范围
    const years = timelineData.timeline.map((event: any) => event.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const range = maxYear - minYear;
    
    // 计算朝代在时间线上的起始位置和宽度
    const [startYear, endYear] = dynastyPeriods[dynasty];
    const left = ((startYear - minYear) / range) * 100;
    const width = ((endYear - startYear) / range) * 100;
    
    return { left, width };
  };
  
  // 确定事件的类型
  const getEventType = (event: { year: number, count: number, type: CelestialEventType }): CelestialEventType => {
    return event.type;
  };
  
  // 找到对应的记录
  const findRecord = (year: number, type: CelestialEventType): CelestialRecord | null => {
    // 根据年份和类型查找匹配的记录
    const yearStr = year < 0 ? `前${Math.abs(year)}年` : `${year}年`;
    return records.find(record => {
      const matchesYear = record.date.includes(yearStr);
      const matchesType = (
        (type === 'solar' && record.id.startsWith('solar')) ||
        (type === 'lunar' && record.id.startsWith('lunar')) ||
        (type === 'comet' && record.id.startsWith('comet')) ||
        (type === 'nova' && record.id.startsWith('nova')) ||
        (type === 'meteor' && record.id.startsWith('meteor'))
      );
      return matchesYear && matchesType;
    }) || null;
  };
  
  // 点击事件的处理
  const handleEventClick = (event: { year: number, type: CelestialEventType }) => {
    const record = findRecord(event.year, event.type);
    if (record && onSelectRecord) {
      onSelectRecord(record);
    }
  };
  
  // 渲染时间线
  return (
    <div className={`relative ${className || ''}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-ancient-ink">分析天象时间数据中...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">错误:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}
      
      {!loading && timelineData && (
        <div className="space-y-6">
          {/* 控制面板 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-bold text-lg">天象记录时间分布</h3>
                <p className="text-sm text-gray-600">
                  总记录数: {records.length} | 
                  时间跨度: 约{Math.round(
                    (Math.max(...timelineData.timeline.map((e: any) => e.year)) - 
                     Math.min(...timelineData.timeline.map((e: any) => e.year))
                    ) / 100
                  ) * 100}年
                </p>
              </div>
              
              {/* 缩放控制 */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleZoom(zoomLevel - 0.5)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  title="缩小"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="text-sm">{zoomLevel.toFixed(1)}x</div>
                <button 
                  onClick={() => handleZoom(zoomLevel + 0.5)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  title="放大"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleZoom(1)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 ml-2"
                  title="重置缩放"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 类型筛选 */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">按天象类型筛选:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => filterByType('all')}
                  className={`px-3 py-1 text-xs rounded-full ${
                    activeType === 'all'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  全部类型
                </button>
                {Object.entries(typeNames).map(([type, name]) => (
                  <button
                    key={type}
                    onClick={() => filterByType(type as CelestialEventType)}
                    className={`px-3 py-1 text-xs rounded-full flex items-center ${
                      activeType === type
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    style={{
                      backgroundColor: activeType === type 
                        ? typeColors[type as CelestialEventType] 
                        : undefined
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: typeColors[type as CelestialEventType] }}
                    />
                    {name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 朝代筛选 */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">按朝代筛选:</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(timelineData.byDynasty)
                  .sort((a, b) => {
                    // 按时间顺序排序朝代
                    const aStart = dynastyPeriods[a] ? dynastyPeriods[a][0] : 0;
                    const bStart = dynastyPeriods[b] ? dynastyPeriods[b][0] : 0;
                    return aStart - bStart;
                  })
                  .map(dynasty => (
                    <button
                      key={dynasty}
                      onClick={() => filterByDynasty(dynasty)}
                      className={`px-3 py-1 text-xs rounded-full flex items-center ${
                        activeDynasty === dynasty
                          ? 'text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      style={{
                        backgroundColor: activeDynasty === dynasty 
                          ? dynastyColors[dynasty] || '#6B7280' 
                          : undefined
                      }}
                    >
                      <span 
                        className="w-2 h-2 rounded-full mr-1" 
                        style={{ backgroundColor: dynastyColors[dynasty] || '#6B7280' }}
                      />
                      {dynasty} ({timelineData.byDynasty[dynasty]})
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
          
          {/* 时间线容器 */}
          <div 
            ref={timelineRef}
            className="relative bg-white p-6 rounded-lg shadow-md overflow-hidden"
          >
            {/* 朝代背景 */}
            <div className="relative h-20 mb-6">
              {Object.keys(dynastyPeriods).map(dynasty => {
                const { left, width } = getDynastyPosition(dynasty);
                // 只显示有记录的朝代
                if (timelineData.byDynasty[dynasty] && width > 0) {
                  return (
                    <div
                      key={dynasty}
                      className={`absolute h-full rounded-md ${
                        activeDynasty === dynasty || activeDynasty === null
                          ? 'opacity-50'
                          : 'opacity-20'
                      } cursor-pointer transition-opacity duration-200 flex items-center justify-center`}
                      style={{
                        left: `${left}%`,
                        width: `${width * zoomLevel}%`,
                        backgroundColor: dynastyColors[dynasty] || '#6B7280',
                        transform: 'translateX(-50%)',
                        transformOrigin: 'left',
                      }}
                      onClick={() => filterByDynasty(dynasty)}
                      title={`${dynasty}: ${timelineData.byDynasty[dynasty]}条记录`}
                    >
                      <span className="text-white text-xs font-bold whitespace-nowrap px-1 select-none">
                        {dynasty}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* 时间刻度 */}
            <div className="relative h-10 mb-4 border-t border-b border-gray-300">
              {generateTimelineMarkers().map((marker, index) => (
                <div 
                  key={index}
                  className="absolute h-full flex flex-col items-center"
                  style={{
                    left: `${getEventPosition(marker.year) * zoomLevel}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="w-px h-3 bg-gray-400"></div>
                  <div className="text-xs text-gray-500 mt-1">{marker.label}</div>
                </div>
              ))}
            </div>
            
            {/* 事件标记 */}
            <div className="relative h-40">
              {timelineData.timeline
                .filter((event: any) => {
                  // 过滤类型
                  if (activeType !== 'all' && getEventType(event) !== activeType) {
                    return false;
                  }
                  
                  // 过滤朝代
                  if (activeDynasty) {
                    // 通过年份确定朝代
                    const year = event.year;
                    const inDynasty = Object.entries(dynastyPeriods).some(([dynasty, [start, end]]) => {
                      return dynasty === activeDynasty && year >= start && year <= end;
                    });
                    
                    if (!inDynasty) {
                      return false;
                    }
                  }
                  
                  return true;
                })
                .map((event: any, index: number) => {
                  const eventType = getEventType(event);
                  return (
                    <motion.div 
                      key={`${event.year}-${eventType}-${index}`}
                      className="absolute"
                      style={{
                        left: `${getEventPosition(event.year) * zoomLevel}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                      whileHover={{ scale: 1.2 }}
                      onHoverStart={() => setHoveredEvent(index)}
                      onHoverEnd={() => setHoveredEvent(null)}
                      onClick={() => handleEventClick(event)}
                    >
                      <div 
                        className="w-4 h-4 rounded-full cursor-pointer"
                        style={{ backgroundColor: typeColors[eventType] }}
                        title={`${event.year < 0 ? '公元前' + Math.abs(event.year) : event.year}年 - ${typeNames[eventType]}`}
                      ></div>
                      
                      {/* 悬停提示 */}
                      <AnimatePresence>
                        {hoveredEvent === index && (
                          <motion.div
                            className="absolute bottom-full mb-2 bg-white px-3 py-2 rounded shadow-lg z-10 min-w-[150px]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <div className="text-sm font-bold">
                              {event.year < 0 ? '公元前' + Math.abs(event.year) : event.year}年
                            </div>
                            <div className="text-xs">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: typeColors[eventType] }}
                              ></span>
                              {typeNames[eventType]}记录
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(dynastyPeriods).map(([dynasty, [start, end]]) => {
                                if (event.year >= start && event.year <= end) {
                                  return <span key={dynasty}>{dynasty}时期</span>;
                                }
                                return null;
                              })}
                            </div>
                            <div className="text-xs mt-1">
                              点击查看详情
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              }
            </div>
            
            {/* 图例 */}
            <div className="mt-4 flex justify-end items-center space-x-4 text-xs text-gray-600">
              {Object.entries(typeNames).map(([type, name]) => (
                <div key={type} className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: typeColors[type as CelestialEventType] }}
                  ></span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 数据来源信息 */}
          <motion.div 
            className="text-xs text-gray-500 mt-2 italic text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            数据来源：基于《二十四史》天文志、甲骨文等古代文献记录，结合现代天文学考证
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CelestialTimeline; 