import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numStars, setNumStars] = useState(0);
  const controls = useAnimationControls();
  
  // 滚动动画效果
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // 根据窗口大小动态计算星星数量
  useEffect(() => {
    const calculateStars = () => {
      if (typeof window !== 'undefined') {
        const area = window.innerWidth * window.innerHeight;
        // 每10000平方像素生成一颗星星，但不少于50颗，不多于300颗
        const count = Math.min(300, Math.max(50, Math.floor(area / 10000)));
        setNumStars(count);
      }
    };
    
    calculateStars();
    window.addEventListener('resize', calculateStars);
    
    return () => {
      window.removeEventListener('resize', calculateStars);
    };
  }, []);
  
  // 自动播放动画效果
  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
      await new Promise(resolve => setTimeout(resolve, 500));
      await controls.start("highlight");
    };
    
    sequence();
  }, [controls]);
  
  // 文字显示动画
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    highlight: {
      color: "#d4af37",
      textShadow: "0 0 8px rgba(212, 175, 55, 0.5)",
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  // 按钮动画
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 15px rgba(212, 175, 55, 0.7)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };
  
  // 星空背景动画
  const generateStars = () => {
    return Array.from({ length: numStars }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 3;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: size,
            height: size,
            top: `${top}%`,
            left: `${left}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    });
  };
  
  // 生成流星
  const meteors = Array.from({ length: 3 }).map((_, i) => {
    const delay = i * 5; // 每隔5秒出现一颗流星
    const xOffset = Math.random() * 300 - 150;
    const yOffset = Math.random() * 100 - 50;
    
    return (
      <motion.div
        key={i}
        className="absolute h-[150px] w-[2px]"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          transformOrigin: "left top",
          transform: "rotate(45deg)",
          top: "0%",
          left: "100%",
        }}
        animate={{
          left: ["100%", "-20%"],
          top: ["0%", "120%"],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          ease: "easeIn",
          delay: delay,
          repeat: Infinity,
          repeatDelay: 15,
          times: [0, 0.1, 1]
        }}
      />
    );
  });
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ opacity, y: translateY, scale }}
    >
      {/* 背景星空 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ancient-dark to-ancient-galaxy">
        {generateStars()}
        {meteors}
      </div>
      
      {/* 背景装饰 - 古代星图投影 */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-stardust bg-repeat"></div>
      </div>
      
      {/* 内容 */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6"
          initial="hidden"
          animate={controls}
          variants={textVariants}
        >
          <span className="block">探索</span>
          <span className="text-ancient-gold text-shadow-glow">中国古代天文</span>
          <span className="block">的璀璨星空</span>
        </motion.h1>
        
        <motion.p 
          className="text-white/80 max-w-2xl text-lg md:text-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          穿越时空，探索中国古代天文学的精髓，体验数千年的星象智慧与宇宙观念
        </motion.p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/vr-experience" legacyBehavior>
              <motion.a
                className="px-8 py-3 bg-ancient-gold text-ancient-dark rounded-lg font-medium inline-flex items-center justify-center min-w-[180px]"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="mr-2">3D星空体验</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/astronomy-achievements" legacyBehavior>
              <motion.a
                className="px-8 py-3 bg-transparent border border-ancient-gold/70 text-ancient-gold rounded-lg font-medium inline-flex items-center justify-center min-w-[180px]"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <span>天文成就</span>
              </motion.a>
            </Link>
          </motion.div>
        </div>
        
        {/* 向下滚动指示器 */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-ancient-gold/80 text-sm mb-2">向下滚动</span>
            <svg className="w-6 h-6 text-ancient-gold animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ancient-dark to-transparent pointer-events-none"></div>
    </motion.div>
  );
};

export default HeroSection; 