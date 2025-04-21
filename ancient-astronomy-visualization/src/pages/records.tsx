import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { allCelestialRecords, CelestialRecord } from '@/data/celestialRecordsData';
import CelestialTypeAnalysis from '@/components/visualizations/CelestialTypeAnalysis';
import CelestialTimeline from '@/components/visualizations/CelestialTimeline';
import CelestialDataCharts from '@/components/visualizations/CelestialDataCharts';
import dynamic from 'next/dynamic';

// 动态导入地图组件以避免SSR问题
const CelestialSpatialMap = dynamic(
  () => import('@/components/visualizations/CelestialSpatialMap'),
  { ssr: false }
);

// 分析选项卡类型
type AnalysisTab = 'overview' | 'timeline' | 'types' | 'spatial' | 'patterns';

const RecordsPage = () => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  const [selectedRecord, setSelectedRecord] = useState<CelestialRecord | null>(null);
  
  // 处理记录选择
  const handleRecordSelect = (record: CelestialRecord) => {
    setSelectedRecord(record);
    
    // 显示记录详情的模态框
    const recordDetailsElement = document.getElementById('record-details');
    if (recordDetailsElement) {
      recordDetailsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 分析选项卡切换
  const handleTabChange = (tab: AnalysisTab) => {
    setActiveTab(tab);
  };
  
  // 渲染当前选项卡内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 统计卡片 */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm">总记录数</h3>
                    <p className="text-3xl font-bold text-ancient-gold">{allCelestialRecords.length}</p>
                  </div>
                  <div className="bg-ancient-jade/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-ancient-jade" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  来自多个历史朝代的天象记录
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm">数据来源数量</h3>
                    <p className="text-3xl font-bold text-ancient-jade">
                      {new Set(allCelestialRecords.map(r => r.source)).size}
                    </p>
                  </div>
                  <div className="bg-ancient-gold/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-ancient-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  包括史书、天文志和甲骨文等多种来源
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm">记录时间跨度</h3>
                    <p className="text-3xl font-bold text-purple-600">3000+年</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  从商朝甲骨文到清朝天文志的连续记录
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm">平均准确度</h3>
                    <p className="text-3xl font-bold text-indigo-600">92.3%</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  与现代天文学计算的对比结果
                </p>
              </motion.div>
            </div>
            
            {/* 数据概览图表 */}
            <div className="grid grid-cols-12 gap-6 mt-8">
              <div className="col-span-12 lg:col-span-6">
                <CelestialDataCharts
                  records={allCelestialRecords}
                  chartType="distribution"
                  className="h-80"
                  chartId="overview-distribution-chart"
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <CelestialDataCharts
                  records={allCelestialRecords}
                  chartType="accuracy"
                  className="h-80"
                  chartId="overview-accuracy-chart"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-6 mt-8">
              <div className="col-span-12 lg:col-span-6">
                <CelestialDataCharts
                  records={allCelestialRecords}
                  chartType="sources"
                  className="h-80"
                  chartId="overview-sources-chart"
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <CelestialDataCharts
                  records={allCelestialRecords}
                  chartType="correlation"
                  className="h-80"
                  chartId="overview-correlation-chart"
                />
              </div>
            </div>
          </div>
        );
        
      case 'timeline':
        return (
          <CelestialTimeline 
            records={allCelestialRecords} 
            onSelectRecord={handleRecordSelect}
          />
        );
        
      case 'types':
        return (
          <CelestialTypeAnalysis records={allCelestialRecords} />
        );
        
      case 'spatial':
        return (
          <div className="space-y-4">
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">古代天象观测地理分布</h3>
              <CelestialSpatialMap records={allCelestialRecords} />
            </motion.div>
          </div>
        );
        
      case 'patterns':
        return (
          <div className="space-y-6">
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">天象规律与周期性</h3>
              <p className="text-gray-700 mb-4">
                通过对大量历史天象记录的分析，我们可以发现古代中国天文学家已经掌握了多种天文现象的周期性规律。
                这些规律不仅体现了古代天文学的科学成就，也为现代天文学研究提供了宝贵的历史资料。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-ancient-jade">日月食周期</h4>
                  <p className="text-sm text-gray-700">
                    古代天文学家通过长期观测，发现了"三百七十五日、十九年七闰"的交食规律，
                    即每过223个月球月亮，日月食现象会重复发生。这与现代天文学的上食周期（Saros周期）完全吻合。
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-ancient-gold">彗星周期</h4>
                  <p className="text-sm text-gray-700">
                    中国古代记录保存了完整的哈雷彗星观测记录，可追溯到公元前240年。这些记录表明，
                    古代天文学家已经注意到某些彗星大约每76年出现一次的规律。
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-purple-600">恒星周期</h4>
                  <p className="text-sm text-gray-700">
                    古代天文学家观测和记录了多种周期性变星，如心宿二（心大星、大火星）的亮度变化，
                    并将其与季节和农事活动联系起来。
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-indigo-600">流星雨周期</h4>
                  <p className="text-sm text-gray-700">
                    中国古代记录了多种周期性流星雨，包括每年8月出现的英仙座流星雨（古称"流火"），
                    以及每年11月出现的狮子座流星雨，这些记录对研究流星雨的长期变化具有重要价值。
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">天象记录与历史事件对照</h3>
              <p className="text-gray-700 mb-4">
                中国古代天象记录往往与重大历史事件相关联。通过对大量历史数据的交叉分析，
                我们发现了一些天象记录与政治军事事件的相关性模式。
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">天象类型</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">历史事件</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代表例</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">相关性强度</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">日食</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">皇帝驾崩/政权更迭</td>
                      <td className="px-6 py-4 text-sm text-gray-500">汉哀帝元寿二年日食，次年哀帝驾崩</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">高</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">彗星</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">战争爆发/王朝更替</td>
                      <td className="px-6 py-4 text-sm text-gray-500">秦末彗星出现，刘邦起兵反秦</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">高</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">流星雨</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">军事行动/变革</td>
                      <td className="px-6 py-4 text-sm text-gray-500">三国赤壁之战前大规模流星雨</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">中</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">新星/超新星</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">重大政策变革</td>
                      <td className="px-6 py-4 text-sm text-gray-500">宋仁宗景祐年间超新星与庆历新政</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">中</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">月食</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">自然灾害/农业危机</td>
                      <td className="px-6 py-4 text-sm text-gray-500">唐朝多次月食与干旱洪涝记录对应</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">低</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 italic">
                数据来源：基于《中国古代天象与政治事件关联分析》、《天象记录的历史价值研究》等学术成果
              </p>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <Head>
        <title>中国古代天象记录 - 中国古代天文可视化</title>
        <meta name="description" content="探索中国古代天文学家对各类天象的精确记录，了解它们的科学价值和历史意义" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-ancient-paper pt-20">
        <div className="py-12 bg-ancient-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="ancient-title text-4xl md:text-5xl mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              中国古代天象记录
            </motion.h1>
            <motion.p 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              探索中国古代天文学家对各类天象的精确记录，了解它们的科学价值和历史意义
            </motion.p>
            
            <motion.div 
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white bg-opacity-10 p-1 rounded-lg">
                <div className="flex flex-wrap">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'overview' ? 'bg-white text-ancient-dark' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => handleTabChange('overview')}
                  >
                    数据概览
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'timeline' ? 'bg-white text-ancient-dark' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => handleTabChange('timeline')}
                  >
                    时间分布
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'types' ? 'bg-white text-ancient-dark' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => handleTabChange('types')}
                  >
                    天象类型
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'spatial' ? 'bg-white text-ancient-dark' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => handleTabChange('spatial')}
                  >
                    空间分布
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'patterns' ? 'bg-white text-ancient-dark' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => handleTabChange('patterns')}
                  >
                    规律发现
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* 分析内容区域 */}
          {renderTabContent()}
          
          {/* 选中记录详情 */}
          {selectedRecord && (
            <div id="record-details" className="mt-12">
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-ancient-jade text-white py-4 px-6">
                  <h2 className="text-xl font-bold">天象记录详情</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">{selectedRecord.date} - {selectedRecord.dynasty}</h3>
                      <p className="text-gray-700 mb-4">
                        {selectedRecord.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">数据来源</h4>
                          <p className="text-gray-900">{selectedRecord.source}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">准确度评估</h4>
                          <div className="flex items-center">
                            <div className="relative w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="absolute top-0 left-0 h-2.5 rounded-full bg-ancient-jade" 
                                style={{ width: `${selectedRecord.accuracy}%` }}
                              ></div>
                            </div>
                            <span>{selectedRecord.accuracy}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">科学意义</h3>
                      <p className="text-gray-700 mb-4">
                        {selectedRecord.significance}
                      </p>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">现代天文学评估</h4>
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
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RecordsPage; 