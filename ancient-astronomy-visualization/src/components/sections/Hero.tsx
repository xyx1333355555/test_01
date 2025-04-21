import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    // 创建星空背景
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      const starCount = 300; // 增加星星数量
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3; // 增加星星大小变化范围
        
        star.className = 'absolute rounded-full bg-white animate-star-twinkle';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`; // 提高最低亮度
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`; // 变化的动画持续时间
        
        starsContainer.appendChild(star);
      }
    }
    
    // 添加视差滚动效果
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 星座连线效果
  const constellationLines = [
    { x1: '20%', y1: '25%', x2: '25%', y2: '30%' },
    { x1: '25%', y1: '30%', x2: '30%', y2: '28%' },
    { x1: '30%', y1: '28%', x2: '35%', y2: '32%' },
    { x1: '35%', y1: '32%', x2: '32%', y2: '38%' },
    { x1: '32%', y1: '38%', x2: '20%', y2: '25%' },
    
    { x1: '70%', y1: '15%', x2: '75%', y2: '20%' },
    { x1: '75%', y1: '20%', x2: '80%', y2: '18%' },
    { x1: '80%', y1: '18%', x2: '78%', y2: '25%' },
    { x1: '78%', y1: '25%', x2: '70%', y2: '15%' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 星空背景 */}
      <div 
        ref={starsRef} 
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a20] via-[#121236] to-[#1a1a3a] z-0"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }} // 视差滚动效果
      ></div>
      
      {/* 星座连线 */}
      <div className="absolute inset-0 z-1 opacity-40">
        <svg width="100%" height="100%" className="absolute inset-0">
          {constellationLines.map((line, index) => (
            <motion.line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
            />
          ))}
        </svg>
      </div>
      
      {/* 内容 */}
      <div className="container mx-auto px-4 relative z-10 text-center py-20 mt-16">
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="block mb-2">中国古代天文记录</span>
            <span className="text-ancient-gold">探索千年星象智慧</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            穿越时空，探索中国古代天文学的辉煌成就，感受先人对宇宙的深邃思考与精确观测
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Link 
              href="/timeline" 
              className="bg-ancient-gold text-ancient-ink px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all"
              passHref
            >
              <motion.span 
                className="block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                开始探索
              </motion.span>
            </Link>
            
            {/* 3D星空体验按钮 */}
            <Link 
              href="/sky-experience" 
              className="bg-transparent border-2 border-ancient-gold text-ancient-gold px-8 py-3 rounded-lg text-lg font-medium hover:bg-ancient-gold hover:text-ancient-dark transition-all group"
              passHref
            >
              <motion.span 
                className="block flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">体验3D星空</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 transition-transform group-hover:rotate-12" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* 装饰性天文元素 */}
      <motion.div 
        className="absolute right-[10%] top-[20%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-70 blur-md"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.8, 0.7]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(8px)' }}
      />
      <motion.div 
        className="absolute left-[15%] bottom-[25%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 opacity-50 blur-sm"
        animate={{ 
          y: [0, 15, 0],
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.6, 0.5]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ filter: 'blur(5px)' }}
      />
      
      {/* 添加更多天体元素 */}
      <motion.div 
        className="absolute left-[75%] top-[60%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-300 to-red-500 opacity-40 blur-sm"
        animate={{ 
          y: [0, 10, 0],
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.5, 0.4]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ filter: 'blur(3px)' }}
      />
      <motion.div 
        className="absolute left-[30%] top-[15%] w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 opacity-60 blur-sm"
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.7, 0.6]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ filter: 'blur(2px)' }}
      />
      
      {/* 流星效果 */}
      <motion.div
        className="absolute w-0.5 h-20 bg-white opacity-0"
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
    </section>
  );
};

export default Hero; 