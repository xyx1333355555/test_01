import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { 
  solarEclipseRecords, 
  lunarEclipseRecords, 
  cometRecords, 
  novaRecords, 
  meteorRecords,
  CelestialRecord
} from '@/data/celestialRecordsData';
import { motion } from 'framer-motion';

// 动态导入Three.js组件，避免SSR报错
const StarrySky = dynamic(() => import('@/components/viewers/StarrySky'), { ssr: false });

const SkyExperiencePage = () => {
  const [loading, setLoading] = useState(true);
  const [allRecords, setAllRecords] = useState<CelestialRecord[]>([]);
  
  // 获取所有天象记录
  useEffect(() => {
    setAllRecords([
      ...solarEclipseRecords,
      ...lunarEclipseRecords,
      ...cometRecords,
      ...novaRecords,
      ...meteorRecords
    ]);
    
    // 模拟加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Head>
        <title>3D星空体验 | 中国古代天文可视化</title>
        <meta 
          name="description" 
          content="探索中国古代天文学的3D星空体验，观察历史上记录的星象位置和天文现象" 
        />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-ancient-dark">
        {/* 顶部导航与介绍 */}
        <section className="pt-24 pb-10 px-4 bg-gradient-to-b from-black to-transparent">
          <div className="container mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-serif text-center text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-ancient-gold">3D星空体验</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              穿越时空，探索中国古代天文学家观测到的星象。在3D星空中导航，了解历代天文成就，发现古代天象记录的位置。
            </motion.p>
          </div>
        </section>
        
        {/* 3D星空体验 */}
        <section className="h-[80vh] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ancient-dark">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-ancient-gold text-lg">正在生成星空...</p>
              </div>
            </div>
          ) : (
            <>
              <StarrySky records={allRecords} />
              
              {/* 交互提示 */}
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-40 backdrop-blur-sm p-3 rounded-lg text-white text-sm">
                <p className="mb-1"><span className="text-ancient-gold">拖动</span>: 旋转视角</p>
                <p className="mb-1"><span className="text-ancient-gold">滚轮</span>: 缩放</p>
                <p><span className="text-ancient-gold">点击星星</span>: 查看详情</p>
              </div>
            </>
          )}
        </section>
        
        {/* 底部说明 */}
        <section className="py-12 px-4 bg-black bg-opacity-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif text-ancient-gold mb-4">关于此星空模拟</h2>
                <p className="text-gray-300 mb-4">
                  本3D星空模拟基于中国古代天文记录与现代天文学数据，重现了古代天文学家观测到的重要天象，包括日食、月食、彗星、新星等现象。
                </p>
                <p className="text-gray-300">
                  星空中标记的是历史上有记载的重要天象位置。
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-serif text-ancient-gold mb-4">探索二十八宿与北斗</h2>
                <p className="text-gray-300 mb-4">
                  中国古代天文学将天空分为二十八宿，并以北斗七星为定位基准。在星空中，您可以看到这些重要星座的连线。
                </p>
                <p className="text-gray-300">
                  点击星空中的亮点，了解更多关于古代天文记录及其重要意义。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default SkyExperiencePage; 