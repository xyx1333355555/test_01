import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComparisonSection from '@/components/sections/ComparisonSection';
import ScientificValueCharts from '@/components/visualizations/ScientificValueCharts';
import ScientificValueDetail from '@/components/visualizations/ScientificValueDetail';
import CalendarAccuracyAnalysis from '@/components/visualizations/CalendarAccuracyAnalysis';
import ObservationAccuracyAnalysis from '@/components/visualizations/ObservationAccuracyAnalysis';
import ScientificValueVisualization from '@/components/visualizations/ScientificValueVisualization';
import CalendarNavigation from '@/components/visualizations/CalendarNavigation';
import AstronomicalRecordDetail from '@/components/visualizations/AstronomicalRecordDetail';
import RecordNavigation from '@/components/visualizations/RecordNavigation';
import CosmicConceptAnalysis from '@/components/visualizations/CosmicConceptAnalysis';
import AstronomicalInstrumentsAnalysis from '@/components/visualizations/AstronomicalInstrumentsAnalysis';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ScientificValuePage = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'detail' | 'charts'>('summary');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'general' | 'calendar'>('general');
  const [activeCalendarItem, setActiveCalendarItem] = useState('history-accuracy');
  const [activeRecordType, setActiveRecordType] = useState('supernova'); // 默认显示超新星记录

  return (
    <>
      <Head>
        <title>中国古代天文学的科学价值 - 中国古代天文可视化</title>
        <meta name="description" content="中国古代天文学成就与现代天文学的比较，展示了中华文明对人类科学发展的重要贡献" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-ancient-paper pt-20">
        <div className="py-12 bg-ancient-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="ancient-title text-4xl md:text-5xl mb-4">中国古代天文学的科学价值</h1>
            <p className="max-w-3xl mx-auto">
              中国古代天文学成就与现代天文学的比较，展示了中华文明对人类科学发展的重要贡献
            </p>
          </div>
        </div>
        
        {/* 天象记录数据分析图表 */}
        <div className="container mx-auto px-4 py-8 mt-4 mb-10">
          <motion.h2 
            className="text-2xl font-bold text-center text-[#4A4236] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            天象记录数据分析图表
          </motion.h2>
          <ScientificValueCharts />
        </div>
        
        {/* 内容导航栏 */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <motion.button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                activeTab === 'summary' 
                  ? 'bg-[#B4846C] text-white shadow-lg' 
                  : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">📜</span>
              <span>概述与比较</span>
            </motion.button>
            
            <motion.button
              onClick={() => setActiveTab('detail')}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                activeTab === 'detail' 
                  ? 'bg-[#B4846C] text-white shadow-lg' 
                  : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🔍</span>
              <span>案例研究</span>
            </motion.button>
            
            <motion.button
              onClick={() => setActiveTab('charts')}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                activeTab === 'charts' 
                  ? 'bg-[#B4846C] text-white shadow-lg' 
                  : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">📊</span>
              <span>数据分析</span>
            </motion.button>
          </div>
          
          {/* 内容区域 */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {activeTab === 'summary' && (
              <div className="mb-20">
                {/* 历史贡献与现代意义部分（移至顶部） */}
                <div className="container mx-auto px-4 py-8 mb-12 bg-[#F7F4ED] rounded-xl">
                  <div className="max-w-4xl mx-auto">
                    <motion.h2 
                      className="text-2xl font-bold text-center text-[#4A4236] mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      中国古代天文学的历史贡献与现代意义
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div 
                        className="bg-white/90 p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <h3 className="text-lg font-bold text-[#B4846C] mb-3">精确的观测记录</h3>
                        <p className="text-[#6B5C45]">
                          中国拥有世界上最长、最连续的天文观测记录，跨越3500多年，这些记录具有极高的科学价值和历史价值。
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white/90 p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className="text-lg font-bold text-[#B4846C] mb-3">科学方法的应用</h3>
                        <p className="text-[#6B5C45]">
                          古代天文学家应用系统观测、精确记录和数学计算等科学方法，创造了领先世界的天文成就。
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white/90 p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <h3 className="text-lg font-bold text-[#B4846C] mb-3">对现代天文学的贡献</h3>
                        <p className="text-[#6B5C45]">
                          这些古代记录为现代天文学研究提供了珍贵的历史数据，帮助科学家研究地球自转变化、恒星演化和太阳系动力学等问题。
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <ComparisonSection />
              </div>
            )}
            
            {activeTab === 'detail' && (
              <div className="container mx-auto px-4 mb-20">
                <div className="max-w-5xl mx-auto">
                  <motion.h2 
                    className="text-3xl font-bold text-[#4A4236] text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    中国古代天象记录的现代科学价值
                  </motion.h2>
                  <motion.p 
                    className="text-[#6B5C45] text-center max-w-3xl mx-auto mb-12"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    中国拥有世界上最长、最连续的天文观测记录，这些记录为现代天文学研究提供了珍贵的历史数据
                  </motion.p>
                
                  {/* 天象记录导航 */}
                  <div className="mb-8">
                    <RecordNavigation
                      activeItem={activeRecordType}
                      onItemChange={setActiveRecordType}
                    />
                  </div>
                  
                  {/* 天象记录详情 */}
                  <AstronomicalRecordDetail
                    recordType={activeRecordType}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'charts' && (
              <div className="container mx-auto px-4 mb-20">
                <div className="max-w-5xl mx-auto">
                  <motion.h2 
                    className="text-3xl font-bold text-[#4A4236] text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    天象记录数据分析
                  </motion.h2>
                  <motion.p 
                    className="text-[#6B5C45] text-center max-w-3xl mx-auto mb-12"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    通过数据分析和可视化，探索中国古代天文记录的分布、精确度和科学价值
                  </motion.p>
                
                  {/* 分析类型选择 */}
                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <motion.button
                      onClick={() => setActiveAnalysisTab('general')}
                      className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                        activeAnalysisTab === 'general' 
                          ? 'bg-[#B4846C] text-white shadow-lg' 
                          : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>天象记录分析</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setActiveAnalysisTab('calendar')}
                      className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                        activeAnalysisTab === 'calendar' 
                          ? 'bg-[#B4846C] text-white shadow-lg' 
                          : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>历法精度分析</span>
                    </motion.button>
                  </div>
                
                  {activeAnalysisTab === 'general' ? (
                    <motion.div 
                      key="general-analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-12"
                    >
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-2xl font-bold text-[#4A4236] mb-4">中国古代天象记录的数据分析</h3>
                        <p className="text-[#6B5C45] mb-4">
                          中国古代天象记录在现代天文学研究中具有重要价值，以下是对这些记录的深入分析：
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="bg-[#F7F4ED] p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-[#B4846C]">记录的连续性</h4>
                            <p className="text-sm text-[#6B5C45]">
                              中国古代天象记录在时间上具有良好的连续性，从商朝甲骨文到清代天文志，
                              形成了跨越约3000年的连续观测记录，这在世界天文史上极其罕见。
                            </p>
                          </div>
                          
                          <div className="bg-[#F7F4ED] p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-[#B4846C]">记录的准确性</h4>
                            <p className="text-sm text-[#6B5C45]">
                              通过与现代天文学计算的对比，中国古代天象记录具有很高的准确性，
                              特别是在日食、月食和新星观测方面，正确率达到90%以上。
                            </p>
                          </div>
                          
                          <div className="bg-[#F7F4ED] p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-[#B4846C]">记录的系统性</h4>
                            <p className="text-sm text-[#6B5C45]">
                              中国古代天象记录具有系统性和规范性，按照天象类型、观测时间和地点等要素进行整理，
                              形成了完整的观测体系，为现代研究提供了丰富的数据支持。
                            </p>
                          </div>
                          
                          <div className="bg-[#F7F4ED] p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-[#B4846C]">记录的科学价值</h4>
                            <p className="text-sm text-[#6B5C45]">
                              这些记录对现代天文学研究，特别是在研究天体长期变化规律、校准历史天文事件年表、
                              研究地球自转速率的长期变化等方面具有不可替代的价值。
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-[#6B5C45] mt-6 italic">
                          数据来源：基于《中国古代天象记录整理与研究》、《天文考古学研究方法》等学术成果
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="calendar-analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-[#F7F4ED] rounded-xl p-4 mb-8">
                        <CalendarNavigation 
                          activeItem={activeCalendarItem}
                          onItemChange={setActiveCalendarItem}
                        />
                      </div>
                      
                      {activeCalendarItem === 'history-accuracy' && (
                        <CalendarAccuracyAnalysis />
                      )}
                      
                      {activeCalendarItem === 'observation-accuracy' && (
                        <ObservationAccuracyAnalysis />
                      )}
                      
                      {activeCalendarItem === 'scientific-value' && (
                        <ScientificValueVisualization />
                      )}
                      
                      {activeCalendarItem === 'cosmic-concept' && (
                        <CosmicConceptAnalysis />
                      )}
                      
                      {activeCalendarItem === 'astronomical-instruments' && (
                        <AstronomicalInstrumentsAnalysis />
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ScientificValuePage; 