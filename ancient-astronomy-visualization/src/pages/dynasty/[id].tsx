import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { timelineData } from '@/data/timelineData';
import { instrumentsData } from '@/data/instrumentsData';
import { 
  solarEclipseRecords, 
  lunarEclipseRecords, 
  cometRecords, 
  novaRecords, 
  meteorRecords,
  CelestialRecord
} from '@/data/celestialRecordsData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// 定义朝代详情页面的数据类型
type DynastyData = {
  id: string;
  name: string;
  period: string;
  description: string;
  achievements: {
    title: string;
    content: string;
  }[];
  keyFigures: {
    name: string;
    title?: string;
    contribution: string;
  }[];
  instruments: string[];
  records: string[];
};

type InstrumentData = typeof instrumentsData[0];

const DynastyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [dynastyData, setDynastyData] = useState<DynastyData | null>(null);
  const [relatedInstruments, setRelatedInstruments] = useState<InstrumentData[]>([]);
  const [relatedRecords, setRelatedRecords] = useState<CelestialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 处理鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // 创建星空背景
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      const starCount = 200;
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3;
        
        star.className = 'absolute rounded-full bg-white animate-star-twinkle';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        
        starsContainer.appendChild(star);
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    // 获取朝代数据
    const dynasty = timelineData.find(d => d.id === id);
    if (dynasty) {
      setDynastyData(dynasty as DynastyData);
      
      // 获取相关天文仪器
      const instruments = instrumentsData.filter(
        instrument => dynasty.instruments.includes(instrument.id)
      );
      setRelatedInstruments(instruments);
      
      // 获取相关天象记录
      const allRecords = [
        ...solarEclipseRecords,
        ...lunarEclipseRecords,
        ...cometRecords,
        ...novaRecords,
        ...meteorRecords
      ];
      
      const records = allRecords.filter(
        record => dynasty.records.includes(record.id)
      );
      setRelatedRecords(records);
    }
    
    setLoading(false);
  }, [id]);

  // 获取前一个和后一个朝代
  const getPreviousDynasty = () => {
    if (!dynastyData) return null;
    const currentIndex = timelineData.findIndex(d => d.id === dynastyData.id);
    if (currentIndex > 0) {
      return timelineData[currentIndex - 1];
    }
    return null;
  };

  const getNextDynasty = () => {
    if (!dynastyData) return null;
    const currentIndex = timelineData.findIndex(d => d.id === dynastyData.id);
    if (currentIndex < timelineData.length - 1) {
      return timelineData[currentIndex + 1];
    }
    return null;
  };

  // 生成人物详情页面的链接
  const getFigureLink = (figureName: string) => {
    if (!dynastyData) return '';
    return `/figure/${dynastyData.id}-${figureName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const previousDynasty = getPreviousDynasty();
  const nextDynasty = getNextDynasty();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ancient-paper">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">正在加载朝代信息...</p>
        </div>
      </div>
    );
  }

  if (!dynastyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ancient-paper">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">未找到朝代信息</h1>
          <p className="mb-6">抱歉，我们无法找到您请求的朝代信息。可能是链接错误或该朝代数据尚未添加。</p>
          <Link href="/timeline" className="bg-ancient-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
            返回时间线
          </Link>
        </div>
      </div>
    );
  }

  // 计算星球视差效果的位置
  const sunPositionX = mousePosition.x * 20 - 10;
  const sunPositionY = mousePosition.y * 20 - 10;
  const moonPositionX = mousePosition.x * -15 + 7.5;
  const moonPositionY = mousePosition.y * -15 + 7.5;
  const starPositionX = mousePosition.x * 10 - 5;
  const starPositionY = mousePosition.y * 10 - 5;

  return (
    <>
      <Head>
        <title>{dynastyData.name} 时期天文成就 - 中国古代天文可视化</title>
        <meta name="description" content={`探索${dynastyData.name}时期（${dynastyData.period}）的天文成就、关键人物、天文仪器和天象记录`} />
      </Head>

      <Header />

      <main className="bg-ancient-paper min-h-screen">
        {/* 朝代标题部分 */}
        <section className="relative py-20 bg-gradient-to-b from-[#0a0a20] to-[#1a1a3a] overflow-hidden">
          {/* 星空背景 */}
          <div ref={starsRef} className="absolute inset-0 z-0 overflow-hidden">
            {/* 由JS添加星星 */}
          </div>
          
          {/* 装饰性天体 */}
          <motion.div 
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-70 blur-md z-0"
            style={{ 
              right: '15%', 
              top: '25%',
              filter: 'blur(8px)',
              transform: `translate(${sunPositionX}px, ${sunPositionY}px)`
            }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.8, 0.7]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 opacity-50 blur-sm z-0"
            style={{ 
              left: '10%', 
              bottom: '30%',
              filter: 'blur(5px)',
              transform: `translate(${moonPositionX}px, ${moonPositionY}px)`
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.6, 0.5]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute w-1 h-1 bg-white shadow-[0_0_10px_5px_rgba(255,255,255,0.7)] z-0"
            style={{ 
              left: '25%', 
              top: '15%',
              transform: `translate(${starPositionX}px, ${starPositionY}px)`
            }}
            animate={{ 
              scale: [1, 3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* 流星效果 */}
          <motion.div
            className="absolute w-0.5 h-20 bg-white opacity-0 z-0"
            style={{ 
              top: '10%', 
              left: '80%', 
              transform: 'rotate(-45deg)',
              boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.7)'
            }}
            animate={{
              opacity: [0, 1, 0],
              left: ['80%', '70%', '60%'],
              top: ['10%', '30%', '50%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 15,
              ease: "easeOut"
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="ancient-title text-white text-4xl md:text-5xl mb-4">{dynastyData.name}</h1>
              <p className="text-ancient-gold text-xl mb-6">{dynastyData.period}</p>
              <p className="text-white max-w-3xl mx-auto">{dynastyData.description}</p>
            </motion.div>
          </div>
        </section>

        {/* 朝代导航 */}
        <div className="bg-ancient-gold bg-opacity-10 py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              {previousDynasty ? (
                <Link href={`/dynasty/${previousDynasty.id}`} className="text-ancient-gold hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {previousDynasty.name}
                </Link>
              ) : (
                <div></div>
              )}
              
              <Link href="/timeline" className="text-ancient-gold hover:underline">
                返回时间线
              </Link>
              
              {nextDynasty ? (
                <Link href={`/dynasty/${nextDynasty.id}`} className="text-ancient-gold hover:underline flex items-center">
                  {nextDynasty.name}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* 主要成就部分 */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="ancient-title text-2xl md:text-3xl mb-8 text-center">主要天文成就</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dynastyData.achievements.map((achievement, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* 装饰性星星背景 */}
                  <div className="absolute -right-3 -top-3 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute w-1 h-1 bg-ancient-gold rounded-full left-5 top-10 animate-[twinkle_2s_ease-in-out_infinite]"></div>
                    <div className="absolute w-2 h-2 bg-ancient-gold rounded-full left-12 top-7 animate-[twinkle_3s_ease-in-out_infinite_0.5s]"></div>
                    <div className="absolute w-1 h-1 bg-ancient-gold rounded-full left-16 top-14 animate-[twinkle_2.5s_ease-in-out_infinite_1s]"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-ancient-gold mb-3 group-hover:text-ancient-red transition-colors duration-300">{achievement.title}</h3>
                  <p className="text-gray-700">{achievement.content}</p>
                  
                  {/* 悬停时显示的装饰线 */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-ancient-gold group-hover:w-full transition-all duration-500 ease-in-out"></div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 关键人物部分 */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="ancient-title text-2xl md:text-3xl mb-8 text-center">关键人物</h2>
            
            <div className={`grid grid-cols-1 ${
              dynastyData.keyFigures.length === 4 
                ? 'md:grid-cols-2 lg:grid-cols-4' 
                : dynastyData.keyFigures.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-3'
            } gap-6`}>
              {dynastyData.keyFigures.map((figure, index) => (
                <Link 
                  key={index}
                  href={getFigureLink(figure.name)}
                  className="flex"
                >
                  <motion.div 
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer w-full h-full flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{figure.name}</h3>
                        <p className="text-gray-600 mb-3">{figure.title || '天文学家'}</p>
                      </div>
                      <div className="text-ancient-gold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-700 flex-grow">{figure.contribution}</p>
                    <div className="mt-4 text-sm text-ancient-gold">点击查看详情和3D模型</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* 天文仪器部分 */}
          {relatedInstruments.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="ancient-title text-2xl md:text-3xl mb-8 text-center">天文仪器</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedInstruments.map((instrument, index) => (
                  <motion.div 
                    key={instrument.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    <div className="md:w-1/3 bg-gradient-to-br from-ancient-gold to-amber-600 bg-opacity-80 p-6 flex items-center justify-center relative overflow-hidden">
                      {/* 装饰性星座线 */}
                      <svg className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" viewBox="0 0 100 100">
                        <circle cx="20" cy="20" r="1" fill="white" className="animate-[twinkle_3s_ease-in-out_infinite]"/>
                        <circle cx="40" cy="25" r="1.5" fill="white" className="animate-[twinkle_2s_ease-in-out_infinite_0.5s]"/>
                        <circle cx="30" cy="60" r="1" fill="white" className="animate-[twinkle_4s_ease-in-out_infinite_1s]"/>
                        <circle cx="70" cy="40" r="1.5" fill="white" className="animate-[twinkle_3s_ease-in-out_infinite_1.5s]"/>
                        <circle cx="80" cy="80" r="1" fill="white" className="animate-[twinkle_2.5s_ease-in-out_infinite_0.7s]"/>
                        <line x1="20" y1="20" x2="40" y2="25" stroke="white" strokeWidth="0.3" />
                        <line x1="40" y1="25" x2="30" y2="60" stroke="white" strokeWidth="0.3" />
                        <line x1="30" y1="60" x2="70" y2="40" stroke="white" strokeWidth="0.3" />
                        <line x1="70" y1="40" x2="80" y2="80" stroke="white" strokeWidth="0.3" />
                        <line x1="80" y1="80" x2="20" y2="20" stroke="white" strokeWidth="0.3" />
                      </svg>
                      
                      <div className="text-center relative z-10">
                        <h3 className="text-xl font-bold text-white">{instrument.name}</h3>
                        <p className="text-sm text-white text-opacity-80 mt-2">发明者: {instrument.inventor}</p>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6 relative">
                      <p className="text-gray-700 mb-4">{instrument.description}</p>
                      <div className="text-sm">
                        <p className="font-semibold text-ancient-gold">主要功能:</p>
                        <ul className="list-disc list-inside mt-1 mb-3">
                          {instrument.functions.map((func, i) => (
                            <li key={i} className="text-gray-700">{func}</li>
                          ))}
                        </ul>
                        <p className="font-semibold text-ancient-gold">历史意义:</p>
                        <p className="text-gray-700">{instrument.significance}</p>
                      </div>
                      <div className="mt-4 text-right">
                        <Link 
                          href={`/instrument/${instrument.id}`}
                          className="text-ancient-gold hover:text-ancient-red transition-colors duration-300 inline-flex items-center group-hover:translate-x-1 transition-transform"
                        >
                          查看详情和3D模型
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                      
                      {/* 悬停时显示的装饰效果 */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-ancient-gold opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* 天象记录部分 */}
          {relatedRecords.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="ancient-title text-2xl md:text-3xl mb-8 text-center">天象记录</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-ancient-gold bg-opacity-20">
                    <tr>
                      <th className="py-3 px-4 text-left">日期</th>
                      <th className="py-3 px-4 text-left">天象描述</th>
                      <th className="py-3 px-4 text-left">记录来源</th>
                      <th className="py-3 px-4 text-left">历史意义</th>
                      <th className="py-3 px-4 text-left">准确度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {relatedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.description}</td>
                        <td className="py-3 px-4">{record.source}</td>
                        <td className="py-3 px-4">{record.significance}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-ancient-gold h-2.5 rounded-full" 
                                style={{ width: `${record.accuracy}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{record.accuracy}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DynastyPage; 