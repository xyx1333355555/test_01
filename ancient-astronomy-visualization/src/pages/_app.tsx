import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 添加流星动画
    const createMeteors = () => {
      // 创建5个流星，随机位置和延迟
      for (let i = 0; i < 5; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.top = `${Math.random() * 50}%`;
        meteor.style.left = `${Math.random() * 100}%`;
        meteor.style.animationDelay = `${Math.random() * 15}s`;
        document.body.appendChild(meteor);
      }
    };

    // 页面加载完成后
    const timer = setTimeout(() => {
      setLoading(false);
      document.documentElement.classList.add('loaded');
      
      // 添加流星
      createMeteors();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      // 清理流星元素
      document.querySelectorAll('.meteor').forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${sans.variable};
          --font-serif: ${serif.variable};
          --font-mono: ${mono.variable};
        }
      `}</style>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-[#0a0a20] to-[#1a1a3a]"
          >
            <div className="stars-bg"></div>
            
            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full border-4 border-ancient-gold border-t-transparent animate-spin mx-auto mb-8"></div>
              <h1 className="text-3xl font-serif text-white mb-4">中国古代天文</h1>
              <p className="text-ancient-gold text-xl font-serif">探索千年星象智慧...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans`}
          >
            <Component {...pageProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
