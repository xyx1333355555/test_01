import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// 动态导入VR组件
const WebVRExperience = dynamic(() => import('../components/vr/WebVRExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="w-20 h-20 border-t-2 border-ancient-gold rounded-full animate-spin"></div>
      <p className="mt-4 text-ancient-gold text-lg">正在加载VR体验...</p>
    </div>
  )
});

const VRExperiencePage: React.FC = () => {
  const [vrMode, setVrMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Head>
        <title>VR体验 - 古代天文学可视化</title>
        <meta name="description" content="通过VR技术沉浸式体验中国古代天文学的成就与魅力" />
      </Head>

      <Header />

      {/* 空白间隔 */}
      <div className="h-16"></div>

      {/* 添加标题和说明区域 */}
      <div className="w-full py-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-ancient-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-ancient-gold mb-3">古代天文VR体验</h1>
          <p className="text-gray-300 max-w-3xl">体验中国古代天文台的观测环境和天文仪器，探索不同朝代的天文成就和观测方法。</p>
        </div>
      </div>

      <main className="flex-grow mt-6">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-[calc(100vh-22rem)] flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 border-t-2 border-ancient-gold rounded-full animate-spin"></div>
              <p className="mt-6 text-ancient-gold text-xl">正在准备VR体验环境...</p>
              <p className="mt-2 text-gray-400 text-sm">首次加载可能需要较长时间</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              {/* VR体验区域 - 占满剩余高度 */}
              <div className="h-[calc(100vh-24rem)] rounded-lg overflow-hidden shadow-2xl shadow-black/50 mx-4">
                <WebVRExperience setVrMode={setVrMode} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!vrMode && <Footer />}
    </div>
  );
};

export default VRExperiencePage; 