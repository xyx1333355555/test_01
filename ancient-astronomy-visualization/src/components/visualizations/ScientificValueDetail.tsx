import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { comparisonData } from '@/data/comparisonData';

interface ScientificValueDetailProps {
  recordType?: string;
  className?: string;
}

const ScientificValueDetail: React.FC<ScientificValueDetailProps> = ({
  recordType,
  className = ''
}) => {
  const [activeRecordType, setActiveRecordType] = useState(recordType || 'nova');
  const [activeCase, setActiveCase] = useState<number>(0);

  // 获取所有科学价值数据
  const scientificValueData = comparisonData.scientificValue;

  // 获取当前选择的记录类型数据
  const getRecordData = () => {
    return scientificValueData.find(record => 
      record.recordType.toLowerCase().includes(activeRecordType.toLowerCase())
    ) || scientificValueData[0];
  };

  const currentRecord = getRecordData();
  const currentCase = currentRecord.examples[activeCase];

  // 记录类型选项
  const recordTypeOptions = [
    { id: 'nova', label: '超新星记录', icon: '💫' },
    { id: 'comet', label: '彗星记录', icon: '☄️' },
    { id: 'solar', label: '日月食记录', icon: '🌓' },
    { id: 'meteor', label: '流星记录', icon: '🌠' },
    { id: 'star', label: '恒星观测', icon: '⭐' },
    { id: 'planet', label: '行星观测', icon: '🪐' }
  ];

  // 获取记录类型的完整信息
  const getRecordTypeInfo = (id: string) => {
    return recordTypeOptions.find(option => option.id === id) || recordTypeOptions[0];
  };

  // 获取当前记录类型的完整信息
  const currentRecordInfo = getRecordTypeInfo(activeRecordType);

  return (
    <div className={`bg-ancient-paper rounded-xl shadow-md p-4 ${className}`}>
      {/* 记录类型选择 */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {recordTypeOptions.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => {
              setActiveRecordType(type.id);
              setActiveCase(0);
            }}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
              activeRecordType === type.id
                ? 'bg-[#B4846C] text-white shadow-md'
                : 'bg-white/80 text-[#6B5C45] hover:bg-[#B4846C]/10 border border-[#D3C5B6]/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">{type.icon}</span>
            <span>{type.label}</span>
          </motion.button>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧：记录概述和统计 */}
        <div className="lg:col-span-2 bg-white/90 rounded-lg p-4">
          <motion.div
            key={activeRecordType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{currentRecordInfo.icon}</span>
              <h3 className="text-2xl font-bold text-[#4A4236]">{currentRecord.recordType}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F7F4ED] rounded-lg p-3 text-center">
                <p className="text-sm text-[#7C6C55] mb-1">古代记录总数</p>
                <p className="text-3xl font-bold text-[#B4846C]">{currentRecord.ancientRecords}</p>
              </div>
              <div className="bg-[#F7F4ED] rounded-lg p-3 text-center">
                <p className="text-sm text-[#7C6C55] mb-1">验证率</p>
                <p className="text-3xl font-bold text-[#B4846C]">
                  {Math.round((currentRecord.verifiedEvents / currentRecord.ancientRecords) * 100)}%
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-bold mb-2 text-[#4A4236]">历史意义</h4>
              <p className="text-[#6B5C45] text-sm leading-relaxed">{currentRecord.historicalSignificance}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-bold mb-2 text-[#4A4236]">现代研究价值</h4>
              <p className="text-[#6B5C45] text-sm leading-relaxed">{currentRecord.modernResearch}</p>
            </div>

            {currentRecord.distribution && (
              <div className="mb-4">
                <h4 className="font-bold mb-2 text-[#4A4236]">时代分布</h4>
                <div className="bg-[#F7F4ED] rounded-lg p-3">
                  <div className="flex flex-wrap gap-2">
                    {currentRecord.distribution.timeDistribution.map((item, index) => (
                      <div key={index} className="text-xs bg-white/80 rounded-full px-2 py-1">
                        <span className="text-[#6B5C45]">{item.period}: </span>
                        <span className="font-bold text-[#B4846C]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 右侧：典型案例展示 */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeRecordType}-${activeCase}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 rounded-lg p-4"
            >
              <h3 className="text-xl font-bold mb-4 text-[#4A4236]">典型案例：{currentCase.event}</h3>
              
              {/* 案例图片 */}
              <div className="relative h-48 md:h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={currentCase.imageUrl || '/images/scientific-value/default.jpg'}
                  alt={currentCase.event}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
              
              {/* 案例详情 */}
              <div className="mb-4">
                <div className="bg-[#F7F4ED] p-3 rounded-lg mb-4">
                  <h4 className="font-bold text-[#4A4236] mb-1">古代记载</h4>
                  <p className="text-[#6B5C45] italic">"{currentCase.ancientDescription}"</p>
                </div>
                
                <div className="bg-[#F2EEE3] p-3 rounded-lg mb-4">
                  <h4 className="font-bold text-[#4A4236] mb-1">现代发现</h4>
                  <p className="text-[#6B5C45]">{currentCase.modernDiscovery}</p>
                </div>
                
                <div className="bg-[#E8DFD5] p-3 rounded-lg">
                  <h4 className="font-bold text-[#4A4236] mb-1">科学影响</h4>
                  <p className="text-[#6B5C45]">{currentCase.scientificImpact}</p>
                </div>
              </div>
              
              {/* 案例导航 */}
              <div className="flex justify-center gap-2 mt-6">
                {currentRecord.examples.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveCase(index)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeCase === index ? 'bg-[#B4846C]' : 'bg-[#D3C5B6]'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* 底部：现代意义总结 */}
      <motion.div 
        className="mt-8 bg-[#4A4236]/5 p-4 rounded-lg border border-[#4A4236]/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-3 text-[#4A4236] text-center">
          中国古代{currentRecord.recordType}对现代天文学的贡献
        </h3>
        <p className="text-[#6B5C45] leading-relaxed text-center">
          {currentRecord.modernSignificance}
        </p>
        
        <div className="flex justify-center mt-4">
          <div className="inline-block bg-[#B4846C]/80 text-white px-3 py-1 rounded-full text-sm">
            精确度：{currentRecord.accuracyRate}%
          </div>
        </div>
      </motion.div>
      
      {/* 数据来源 */}
      <div className="mt-4 text-xs text-[#7C6C55] text-center">
        <p>数据来源：《中国天文学史》、《中国古天文记录总集》及现代天文学研究成果</p>
      </div>
    </div>
  );
};

export default ScientificValueDetail; 