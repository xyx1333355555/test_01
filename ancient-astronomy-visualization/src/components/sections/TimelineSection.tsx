import { useState } from 'react';
import { timelineData } from '@/data/timelineData';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TimelineSection = () => {
  const [activeDynasty, setActiveDynasty] = useState(timelineData[0].id);

  const getActiveDynastyData = () => {
    return timelineData.find(item => item.id === activeDynasty) || timelineData[0];
  };

  return (
    <section id="timeline" className="py-20 bg-ancient-paper">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="ancient-title text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          中国古代天文学发展时间线
        </motion.h2>
        <motion.p 
          className="ancient-text text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          探索中国古代天文学的发展历程，了解各个朝代的重要天文成就和关键人物
        </motion.p>
        
        {/* 朝代选择器 */}
        <motion.div 
          className="flex flex-wrap justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {timelineData.map((dynasty, index) => (
            <motion.button
              key={dynasty.id}
              className={`px-4 py-2 mx-2 mb-2 rounded-lg transition-colors ${
                activeDynasty === dynasty.id
                  ? 'bg-ancient-gold text-white'
                  : 'bg-white hover:bg-ancient-gold hover:bg-opacity-20'
              }`}
              onClick={() => setActiveDynasty(dynasty.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              {dynasty.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* 时间线可视化 */}
        <motion.div 
          className="relative mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute left-0 right-0 h-2 bg-ancient-gold bg-opacity-30 top-1/2 transform -translate-y-1/2 rounded-full"></div>
          <div className="flex justify-between relative">
            {timelineData.map((dynasty, index) => (
              <motion.div 
                key={dynasty.id} 
                className="relative flex flex-col items-center cursor-pointer"
                onClick={() => setActiveDynasty(dynasty.id)}
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div 
                  className={`w-6 h-6 rounded-full z-10 transition-all ${
                    activeDynasty === dynasty.id 
                      ? 'bg-ancient-gold scale-125' 
                      : 'bg-ancient-gold bg-opacity-50 hover:bg-opacity-80'
                  }`}
                ></div>
                <div className={`text-xs mt-2 transition-all ${
                  activeDynasty === dynasty.id ? 'font-bold' : ''
                }`}>
                  {dynasty.name}
                </div>
                <div className="text-xs text-gray-500">{dynasty.period}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* 朝代详情 */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          key={activeDynasty} // 添加key以便在切换朝代时触发动画
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-2">{getActiveDynastyData().name}</h3>
              <p className="text-gray-600 mb-4">{getActiveDynastyData().period}</p>
              
              <p className="text-gray-700 mb-6">{getActiveDynastyData().description}</p>
              
              <h4 className="text-lg font-semibold mb-3">主要天文成就</h4>
              <div className="space-y-3 mb-6">
                {getActiveDynastyData().achievements.map((achievement, index) => (
                  <div key={index} className="bg-ancient-gold bg-opacity-5 p-3 rounded-lg">
                    <h5 className="font-semibold text-ancient-gold">{achievement.title}</h5>
                    <p className="text-sm mt-1">{achievement.content}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-ancient-gold bg-opacity-10 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3">重要人物</h4>
              <div className="space-y-4">
                {getActiveDynastyData().keyFigures.map((figure, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex flex-col min-h-[80px]">
                    <div className="font-bold">{figure.name}</div>
                    <div className="text-sm mt-1 text-gray-600 flex-grow">{figure.contribution}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-ancient-gold border-opacity-30">
                <h4 className="text-lg font-semibold mb-3">查看详情</h4>
                <Link 
                  href={`/dynasty/${getActiveDynastyData().id}`}
                  className="block w-full bg-ancient-gold text-white text-center py-2 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  探索{getActiveDynastyData().name}时期天文成就
                </Link>
              </div>
            </div>
          </div>
          
          {/* 朝代之间的连接 */}
          {timelineData.indexOf(getActiveDynastyData()) < timelineData.length - 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                下一个朝代：
                <button 
                  className="ml-2 text-ancient-gold hover:underline"
                  onClick={() => {
                    const currentIndex = timelineData.findIndex(item => item.id === activeDynasty);
                    if (currentIndex < timelineData.length - 1) {
                      setActiveDynasty(timelineData[currentIndex + 1].id);
                    }
                  }}
                >
                  {timelineData[timelineData.indexOf(getActiveDynastyData()) + 1].name}
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection; 