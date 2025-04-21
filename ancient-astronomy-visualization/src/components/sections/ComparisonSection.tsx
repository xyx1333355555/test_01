import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { comparisonData } from '@/data/comparisonData';
import Image from 'next/image';
import Link from 'next/link';

const ComparisonSection = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  
  const tabs = [
    { id: 'calendar', label: '历法精度', icon: '📅' },
    { id: 'observation', label: '观测精度', icon: '🔭' },
    { id: 'scientific', label: '科学价值', icon: '⚗️' },
    { id: 'cosmology', label: '宇宙观念', icon: '🌌' },
    { id: 'instruments', label: '天文仪器', icon: '🧭' }
  ];
  
  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const renderCalendarAccuracy = () => (
    <motion.div 
      className="overflow-x-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <table className="min-w-full bg-white border border-[#D3C5B6]/30 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#E8DFD5]">
            <th className="px-4 py-3 text-left text-[#4A4236]">历法名称</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">朝代</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">年份</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">回归年长度</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">现代测量值</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">精度(%)</th>
            <th className="px-4 py-3 text-left text-[#4A4236]">说明</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.calendarAccuracy.map((item, index) => (
            <motion.tr 
              key={index}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(180, 132, 108, 0.05)' }}
              className={index % 2 === 0 ? 'bg-white' : 'bg-[#F7F4ED]'}
            >
              <td className="px-4 py-3 font-bold text-[#4A4236]">{item.name}</td>
              <td className="px-4 py-3 text-[#6B5C45]">{item.period}</td>
              <td className="px-4 py-3 text-[#6B5C45]">{item.year < 0 ? `公元前${Math.abs(item.year)}年` : `公元${item.year}年`}</td>
              <td className="px-4 py-3 text-[#6B5C45]">{item.tropicalYear} 天</td>
              <td className="px-4 py-3 text-[#6B5C45]">{item.modernValue} 天</td>
              <td className="px-4 py-3">
                <motion.div
                  className="bg-[#B4846C]/10 text-[#B4846C] rounded-full px-2 py-1 inline-block"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.accuracy}%
                </motion.div>
              </td>
              <td className="px-4 py-3 text-[#6B5C45]">{item.description}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-[#7C6C55]">
          注：现代测量的回归年长度为365.2422天，中国古代历法对回归年长度的测量达到了极高的精度。
        </p>
      </motion.div>
    </motion.div>
  );

  const renderObservationAccuracy = () => (
    <motion.div 
      className="overflow-x-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <table className="min-w-full bg-white/95 border border-ancient-gold/50 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-ancient-gold/20">
            <th className="px-4 py-3 text-left">天文现象</th>
            <th className="px-4 py-3 text-left">古代方法</th>
            <th className="px-4 py-3 text-left">古代精度</th>
            <th className="px-4 py-3 text-left">现代方法</th>
            <th className="px-4 py-3 text-left">现代精度</th>
            <th className="px-4 py-3 text-left">提升倍数</th>
            <th className="px-4 py-3 text-left">意义</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.observationAccuracy.map((item, index) => (
            <motion.tr 
              key={index}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(218, 165, 32, 0.05)' }}
              className={index % 2 === 0 ? 'bg-white' : 'bg-ancient-gold/5'}
            >
              <td className="px-4 py-3 font-bold">{item.phenomenon}</td>
              <td className="px-4 py-3">{item.ancientMethod}</td>
              <td className="px-4 py-3">{item.ancientAccuracy}</td>
              <td className="px-4 py-3">{item.modernMethod}</td>
              <td className="px-4 py-3">{item.modernAccuracy}</td>
              <td className="px-4 py-3">
                <motion.div
                  className="bg-ancient-gold bg-opacity-20 rounded-full px-2 py-1 inline-block"
                  whileHover={{ scale: 1.1 }}
                >
                  ×{item.improvementFactor}
                </motion.div>
              </td>
              <td className="px-4 py-3">{item.significance}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-600">
          注：尽管现代天文观测精度远超古代，但中国古代天文学家在当时条件下取得的成就仍然令人敬佩。
        </p>
      </motion.div>
    </motion.div>
  );

  const renderScientificValue = () => (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {comparisonData.scientificValue.map((item, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          custom={index}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-[#D3C5B6]/30 rounded-lg p-6 transform transition-all duration-300"
        >
          <h3 className="text-xl font-bold mb-3 text-[#4A4236]">{item.recordType}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <motion.div 
              className="bg-[#F7F4ED] p-3 rounded-lg text-center"
              whileHover={{ scale: 1.05, backgroundColor: '#F2EEE3' }}
            >
              <p className="text-sm text-[#7C6C55]">古代记录总数</p>
              <motion.p 
                className="text-3xl font-bold text-[#B4846C]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {item.ancientRecords}
              </motion.p>
            </motion.div>
            <motion.div 
              className="bg-[#F7F4ED] p-3 rounded-lg text-center"
              whileHover={{ scale: 1.05, backgroundColor: '#F2EEE3' }}
            >
              <p className="text-sm text-[#7C6C55]">已验证事件</p>
              <motion.p 
                className="text-3xl font-bold text-[#B4846C]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.1 }}
              >
                {item.verifiedEvents}
              </motion.p>
            </motion.div>
            <motion.div 
              className="bg-[#F7F4ED] p-3 rounded-lg text-center"
              whileHover={{ scale: 1.05, backgroundColor: '#F2EEE3' }}
            >
              <p className="text-sm text-[#7C6C55]">验证率</p>
              <motion.p 
                className="text-3xl font-bold text-[#B4846C]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.2 }}
              >
                {Math.round((item.verifiedEvents / item.ancientRecords) * 100)}%
              </motion.p>
            </motion.div>
          </div>
          <p className="mb-4 text-[#6B5C45]">{item.modernSignificance}</p>
          <h4 className="font-bold mb-2 text-[#4A4236]">典型案例：</h4>
          <div className="space-y-4">
            {item.examples.map((example, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                className="bg-[#F7F4ED] p-4 rounded-lg hover:bg-[#F2EEE3] transition-colors"
              >
                <h5 className="font-bold text-[#4A4236]">{example.event}</h5>
                <p className="text-sm mb-2"><span className="font-semibold text-[#6B5C45]">古代记载：</span><span className="text-[#7C6C55]">{example.ancientDescription}</span></p>
                <p className="text-sm"><span className="font-semibold text-[#6B5C45]">现代发现：</span><span className="text-[#7C6C55]">{example.modernDiscovery}</span></p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderCosmologyEvolution = () => (
    <motion.div 
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-ancient-gold/30 transform -translate-x-1/2"></div>
      <div className="space-y-12 relative">
        {comparisonData.cosmologyEvolution.map((item, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.div 
              className="absolute left-1/2 top-12 w-5 h-5 bg-ancient-gold/80 rounded-full transform -translate-x-1/2 z-10"
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <motion.div 
                className={`bg-white/95 border border-ancient-gold/50 rounded-lg p-6 ${index % 2 === 0 ? 'md:text-right md:mr-8' : 'md:ml-8'}`}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(218, 165, 32, 0.05)' }}
              >
                <h3 className="text-xl font-bold mb-2">{item.period} ({item.year < 0 ? `公元前${Math.abs(item.year)}年` : `公元${item.year}年`})</h3>
                <h4 className="font-bold text-ancient-gold mb-2">{item.chineseModel}</h4>
                <p className="mb-4">{item.description}</p>
                <p className="text-sm text-gray-600">{item.scientificValue}</p>
              </motion.div>
              <motion.div 
                className={`bg-white/90 border border-gray-200 rounded-lg p-6 ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8 md:text-right'}`}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(218, 165, 32, 0.05)' }}
              >
                <h4 className="font-bold text-gray-700 mb-2">西方对应：{item.westernCounterpart}</h4>
                <p className="text-sm">中国宇宙观与西方宇宙观在这一时期有着不同的发展路径，但都反映了人类对宇宙本质的探索。</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderInstrumentComparison = () => (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {comparisonData.instrumentComparison.map((item, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          custom={index}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          className="bg-white/95 border border-ancient-gold/50 rounded-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.div 
              className="p-6 border-b md:border-b-0 md:border-r border-ancient-gold/30"
              whileHover={{ backgroundColor: 'rgba(218, 165, 32, 0.05)' }}
            >
              <h3 className="text-xl font-bold mb-2">{item.chineseInstrument}</h3>
              <p className="text-sm mb-4">{item.inventionPeriod} ({item.inventionYear < 0 ? `公元前${Math.abs(item.inventionYear)}年` : `公元${item.inventionYear}年`})</p>
              <p className="mb-4">{item.technicalAdvantages}</p>
              <p className="text-sm text-gray-600">{item.historicalInfluence}</p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gray-50/80"
              whileHover={{ backgroundColor: 'rgba(218, 165, 32, 0.05)' }}
            >
              <h3 className="text-xl font-bold mb-2">{item.westernEquivalent}</h3>
              <p className="text-sm mb-4">发明于 {item.westernInventionYear < 0 ? `公元前${Math.abs(item.westernInventionYear)}年` : `公元${item.westernInventionYear}年`}</p>
              <motion.div 
                className="bg-ancient-gold/10 p-3 rounded-lg text-center mb-4"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(218, 165, 32, 0.15)' }}
              >
                <p className="text-sm">中国早于西方</p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {item.timeDifference} 年
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return renderCalendarAccuracy();
      case 'observation':
        return renderObservationAccuracy();
      case 'scientific':
        return renderScientificValue();
      case 'cosmology':
        return renderCosmologyEvolution();
      case 'instruments':
        return renderInstrumentComparison();
      default:
        return renderCalendarAccuracy();
    }
  };

  // VR按钮组件
  const VRToggle = () => (
    <motion.div 
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link href="/vr-experience">
        <motion.button
          className="flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 
            bg-white text-[#4A4236] shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">🥽</span>
          <span>进入VR模式</span>
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <section id="comparison" className="py-20 bg-gradient-to-b from-[#F7F4ED] via-[#F5F1E8] to-[#F2EEE3] relative">
      <VRToggle />
      
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-[#4A4236] text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          中国古代天文学的科学价值
        </motion.h2>
        <motion.p 
          className="text-[#6B5C45] text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          中国古代天文学成就与现代天文学的比较，展示了中华文明对人类科学发展的重要贡献
        </motion.p>
        
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 m-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#B4846C] text-white shadow-lg'
                  : 'bg-white text-[#7C6C55] hover:bg-[#B4846C] hover:bg-opacity-10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-[#D3C5B6]/30"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ComparisonSection; 