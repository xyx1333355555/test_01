import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelestialRecord, allCelestialRecords } from '@/data/celestialRecordsData';
import CelestialDataCharts from '@/components/visualizations/CelestialDataCharts';
import CelestialTimeline from '@/components/visualizations/CelestialTimeline';
import CelestialTypeAnalysis from '@/components/visualizations/CelestialTypeAnalysis';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// 动态导入地图组件以避免SSR问题
const CelestialSpatialMap = dynamic(
  () => import('@/components/visualizations/CelestialSpatialMap'),
  { ssr: false }
);

// 天象记录组件属性
interface CelestialRecordsProps {
  className?: string;
}

// 分析视图类型
type AnalysisView = 'gallery' | 'timeline' | 'analysis' | 'spatial';

/**
 * 天象记录展示组件
 */
const CelestialRecords: React.FC<CelestialRecordsProps> = ({ className }) => {
  const [activeType, setActiveType] = useState<string>('all');
  const [filteredRecords, setFilteredRecords] = useState<CelestialRecord[]>(allCelestialRecords);
  const [selectedRecord, setSelectedRecord] = useState<CelestialRecord | null>(null);
  const [imagesToShow, setImagesToShow] = useState<number>(8);
  const [analysisView, setAnalysisView] = useState<AnalysisView>('gallery');
  const [showDataInsights, setShowDataInsights] = useState<boolean>(false);
  
  // 类型选项
  const typeOptions = [
    { id: 'all', name: '全部天象', count: allCelestialRecords.length },
    { id: 'solar', name: '日食', count: allCelestialRecords.filter(r => r.id.startsWith('solar')).length },
    { id: 'lunar', name: '月食', count: allCelestialRecords.filter(r => r.id.startsWith('lunar')).length },
    { id: 'comet', name: '彗星', count: allCelestialRecords.filter(r => r.id.startsWith('comet')).length },
    { id: 'nova', name: '新星', count: allCelestialRecords.filter(r => r.id.startsWith('nova')).length },
    { id: 'meteor', name: '流星', count: allCelestialRecords.filter(r => r.id.startsWith('meteor')).length },
  ];
  
  // 过滤记录
  useEffect(() => {
    if (activeType === 'all') {
      setFilteredRecords(allCelestialRecords);
    } else {
      setFilteredRecords(allCelestialRecords.filter(record => record.id.startsWith(activeType)));
    }
  }, [activeType]);
  
  // 切换记录类型
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setSelectedRecord(null);
  };
  
  // 加载更多图像
  const handleLoadMore = () => {
    setImagesToShow(prev => prev + 8);
  };
  
  // 选择记录详情
  const handleSelectRecord = (record: CelestialRecord) => {
    setSelectedRecord(record);
    
    // 如果在详情区域下方，滚动到详情区域
    if (selectedRecord === null) {
      const detailsElement = document.getElementById('record-details');
      if (detailsElement) {
        setTimeout(() => {
          detailsElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };
  
  // 切换分析视图
  const handleViewChange = (view: AnalysisView) => {
    setAnalysisView(view);
    setSelectedRecord(null);
  };
  
  // 获取天象类型相关的图片
  const getEventTypePicture = (recordId: string) => {
    if (recordId.startsWith('solar')) return '/images/celestial-events/solar-eclipse.jpg';
    if (recordId.startsWith('lunar')) return '/images/celestial-events/lunar-eclipse.jpg';
    if (recordId.startsWith('comet')) return '/images/celestial-events/comet.jpg';
    if (recordId.startsWith('nova')) return '/images/celestial-events/nova.jpg';
    if (recordId.startsWith('meteor')) return '/images/celestial-events/meteor.jpg';
    return '/images/celestial-events/default.jpg';
  };
  
  // 渲染图库视图
  const renderGalleryView = () => (
    <div className="space-y-8">
      {/* 类型选择器 */}
      <div className="flex flex-wrap gap-2">
        {typeOptions.map(type => (
          <button
            key={type.id}
            onClick={() => handleTypeChange(type.id)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeType === type.id
                ? 'bg-ancient-jade text-white shadow-md'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {type.name} ({type.count})
          </button>
        ))}
      </div>
      
      {/* 天象图库 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRecords.slice(0, imagesToShow).map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectRecord(record)}
          >
            <div className="relative h-48">
              <img
                src={getEventTypePicture(record.id)}
                alt={record.description}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-ancient-dark/70 text-white px-2 py-1 text-xs">
                {record.dynasty}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-ancient-dark mb-1">{record.date}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{record.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">{record.source}</span>
                <span className="text-xs bg-ancient-jade/10 text-ancient-jade px-2 py-1 rounded-full">
                  准确度: {record.accuracy}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {filteredRecords.length > imagesToShow && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-ancient-gold text-white rounded-md hover:bg-ancient-gold-dark transition-colors"
          >
            加载更多 ({imagesToShow}/{filteredRecords.length})
          </button>
        </div>
      )}
    </div>
  );
  
  // 渲染时间线视图
  const renderTimelineView = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <CelestialTimeline 
        records={filteredRecords} 
        onSelectRecord={handleSelectRecord}
      />
    </div>
  );
  
  // 渲染分析视图
  const renderAnalysisView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 记录类型分布 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">记录类型分布</h3>
          <div className="group-hover:shadow-lg transition-all duration-300">
            <CelestialDataCharts
              records={filteredRecords}
              chartType="distribution"
              className="h-64 md:h-72"
              chartId="distribution-chart"
            />
          </div>
        </div>
        
        {/* 历史准确度分析 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">准确度分析</h3>
          <div className="group-hover:shadow-lg transition-all duration-300">
            <CelestialDataCharts
              records={filteredRecords}
              chartType="accuracy"
              className="h-64 md:h-72"
              chartId="accuracy-chart"
            />
          </div>
        </div>
      </div>
      
      {/* 天象类型深入分析 */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">天象类型详细分析</h3>
        <CelestialTypeAnalysis records={filteredRecords} />
      </div>
      
      {/* 数据源分析 */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">数据来源分析</h3>
        <div className="group-hover:shadow-lg transition-all duration-300">
          <CelestialDataCharts
            records={filteredRecords}
            chartType="sources"
            className="h-64 md:h-72"
            chartId="sources-chart"
          />
        </div>
      </div>
      
      {/* 相关性分析 */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">天象与历史事件相关性</h3>
        <div className="group-hover:shadow-lg transition-all duration-300">
          <CelestialDataCharts
            records={filteredRecords}
            chartType="correlation"
            className="h-64 md:h-72"
            chartId="correlation-chart"
          />
        </div>
      </div>
    </div>
  );
  
  // 渲染空间分析视图
  const renderSpatialView = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">天象地理分布</h3>
      <div className="h-[600px]">
        <CelestialSpatialMap records={filteredRecords} />
      </div>
    </div>
  );

  return (
    <section className={`py-12 ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-ancient-dark"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            中国古代天象记录
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            探索中国古代天文学家对日食、月食、彗星等天象的精确记录，了解它们的科学价值和历史意义
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <Link 
              href="/records" 
              className="inline-flex items-center text-ancient-jade hover:text-ancient-jade-dark"
            >
              <span>查看完整分析页面</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
        
        {/* 视图切换导航 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap">
            <button
              onClick={() => handleViewChange('gallery')}
              className={`px-4 py-3 text-sm md:text-base ${
                analysisView === 'gallery' 
                  ? 'text-ancient-jade border-b-2 border-ancient-jade font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              图像集
            </button>
            <button
              onClick={() => handleViewChange('timeline')}
              className={`px-4 py-3 text-sm md:text-base ${
                analysisView === 'timeline' 
                  ? 'text-ancient-jade border-b-2 border-ancient-jade font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              历史时间线
            </button>
            <button
              onClick={() => handleViewChange('analysis')}
              className={`px-4 py-3 text-sm md:text-base ${
                analysisView === 'analysis' 
                  ? 'text-ancient-jade border-b-2 border-ancient-jade font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              数据分析
            </button>
            <button
              onClick={() => handleViewChange('spatial')}
              className={`px-4 py-3 text-sm md:text-base ${
                analysisView === 'spatial' 
                  ? 'text-ancient-jade border-b-2 border-ancient-jade font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              地理分布
            </button>
          </div>
        </div>
        
        {/* 视图内容 */}
        <div className="mb-8">
          {analysisView === 'gallery' && renderGalleryView()}
          {analysisView === 'timeline' && renderTimelineView()}
          {analysisView === 'analysis' && renderAnalysisView()}
          {analysisView === 'spatial' && renderSpatialView()}
          </div>
        
        {/* 记录详情 */}
        <AnimatePresence>
          {selectedRecord && (
            <motion.div 
              id="record-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mt-8"
            >
              <div className="bg-ancient-jade text-white py-3 px-6 flex justify-between items-center">
                <h3 className="text-xl font-bold">天象记录详情</h3>
                          <button 
                  onClick={() => setSelectedRecord(null)}
                  className="text-white hover:text-gray-200"
                          >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      src={getEventTypePicture(selectedRecord.id)}
                      alt={selectedRecord.description}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-ancient-dark">{selectedRecord.date}</h4>
                        <p className="text-gray-500">{selectedRecord.dynasty}</p>
                      </div>
                      <div className="bg-ancient-jade/10 text-ancient-jade px-3 py-1 rounded-full flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>准确度: {selectedRecord.accuracy}%</span>
                      </div>
                        </div>
                        
                    <p className="text-gray-700 mb-4">{selectedRecord.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-500">史料来源</h5>
                        <p className="text-gray-800">{selectedRecord.source}</p>
                      </div>
                        </div>
                        
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-500 mb-2">科学意义</h5>
                      <p className="text-gray-700 text-sm">{selectedRecord.significance}</p>
                        </div>
                        
                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-500 mb-2">现代天文学评估</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm">
                          这条记录{selectedRecord.accuracy >= 90 ? '与现代天文学计算结果高度吻合' : 
                            selectedRecord.accuracy >= 80 ? '与现代天文学计算结果基本吻合' : 
                            '与现代天文学计算存在一定差异'}，
                          {selectedRecord.accuracy >= 85 ? 
                            '说明古代中国天文学家已经掌握了较为精确的观测和记录方法。' : 
                            '可能受限于当时的观测条件和记录方式。'}
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 数据资源 */}
        <div className="mt-12">
          <button
            onClick={() => setShowDataInsights(!showDataInsights)}
            className="flex items-center text-ancient-jade hover:text-ancient-jade-dark mx-auto"
          >
            <span>{showDataInsights ? '收起数据资源' : '查看数据资源'}</span>
            <svg 
              className={`w-5 h-5 ml-1 transform transition-transform ${showDataInsights ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <AnimatePresence>
            {showDataInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-ancient-dark">数据资源与研究依据</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">主要数据来源</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>《二十四史》天文志记载</li>
                      <li>甲骨文天象记录</li>
                      <li>《史记·天官书》</li>
                      <li>《汉书·天文志》</li>
                      <li>《晋书·天文志》</li>
                      <li>《宋史·天文志》等历代天文志</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">现代研究参考</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>《中国古代天象记录的天文学研究》</li>
                      <li>《中国科学技术史·天文卷》</li>
                      <li>《中国古天文文献集》</li>
                      <li>《中国古代天象与政治事件关联研究》</li>
                      <li>NASA日食月食历史数据库</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">数据处理方法</h4>
                  <p className="text-gray-700">
                    本项目中的天象记录经过严格的历史考证和现代天文学验证。
                    我们使用现代天文计算软件对古代记录的日期、位置进行回推，
                    计算理论上应发生的天象，与古代记录进行对比，评估准确度。
                    空间分布分析基于古代王朝首都和天文观测中心的历史位置进行推断。
                  </p>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">准确度评估标准</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            准确度等级
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            评估标准
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              高 (90-100%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            天象日期、现象描述与现代计算结果完全吻合
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              中 (80-89%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            天象日期正确，描述与现代计算结果基本吻合，细节有少量差异
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              低 (70-79%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            天象记录的大致时间段正确，但具体日期或细节描述与现代计算存在偏差
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CelestialRecords; 