import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: '探索',
      links: [
        { name: '星图', href: '/' },
        { name: '古代天文仪器', href: '/instruments' },
        { name: '天象记录', href: '/celestial-records' },
        { name: 'VR体验', href: '/vr-experience' },
      ]
    },
    {
      title: '研究',
      links: [
        { name: '历法发展', href: '/calendar-development' },
        { name: '天文成就', href: '/astronomy-achievements' },
        { name: '科学价值', href: '/scientific-value' },
        { name: '文献资料', href: '/references' },
      ]
    },
    {
      title: '资源',
      links: [
        { name: '项目说明', href: '/about' },
        { name: '参考文献', href: '/references' },
        { name: '图片来源', href: '/image-credits' },
        { name: '联系我们', href: '/contact' },
      ]
    }
  ];
  
  // 星星闪烁动画
  const starVariants = {
    animate: (i: number) => ({
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
      transition: {
        repeat: Infinity,
        duration: 3 + i * 0.5,
        ease: "easeInOut",
      }
    })
  };
  
  // 随机位置的星星
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: Math.random() * 3
  }));
  
  return (
    <footer className="relative bg-ancient-celestial text-white overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 opacity-30">
        <div className="enhanced-stars-bg"></div>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left
            }}
            custom={star.id}
            animate="animate"
            variants={starVariants}
          />
        ))}
      </div>
      
      {/* 流星 */}
      <motion.div 
        className="meteor-enhanced" 
        style={{ 
          "--meteor-delay": "0s",
          "--meteor-x": "100px",
          "--meteor-y": "50px"
        } as React.CSSProperties}
      />
      <motion.div 
        className="meteor-enhanced" 
        style={{ 
          "--meteor-delay": "5s",
          "--meteor-x": "-150px",
          "--meteor-y": "-30px"
        } as React.CSSProperties}
      />
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 项目介绍 */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-4">
              <Link href="/" legacyBehavior>
                <a className="text-ancient-gold text-2xl font-serif font-bold inline-block">
                  中国古代天文
                </a>
              </Link>
              <div className="h-0.5 w-16 bg-ancient-gold/60 rounded mt-2"></div>
            </div>
            <p className="text-white/80 text-sm mb-6">
              探索中国古代天文学的精髓，感受数千年的星空观测智慧和历法发展历程。
            </p>
            
            {/* 社交图标 */}
            <div className="flex space-x-4 mt-4">
              {['github', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ancient-gold/20 transition-all duration-300"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-4 h-4 text-ancient-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* 链接列表 */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-ancient-gold font-medium text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} legacyBehavior>
                      <a className="text-white/70 hover:text-ancient-gold transition-colors duration-300 text-sm flex items-center">
                        <svg className="w-3 h-3 mr-2 text-ancient-gold/50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 5l7 7-7 7"></path>
                        </svg>
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* 订阅 */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-ancient-gold font-medium text-lg mb-4">订阅更新</h3>
            <p className="text-white/70 text-sm mb-4">
              获取项目的最新动态和研究成果
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="您的邮箱地址"
                className="ancient-input bg-white/10 text-white placeholder:text-white/50 focus:ring-ancient-gold/50"
              />
              <button
                type="submit"
                className="ancient-button py-2 px-4 text-sm font-medium"
              >
                <span className="text-ancient-gold">订阅</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="section-divider mt-10 mb-8">
          <span className="px-4 relative bg-ancient-celestial text-ancient-gold/60 text-sm">
            天文探索
          </span>
        </div>
        
        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-xs">
          <p>© {currentYear} 中国古代天文可视化项目 · 保留所有权利</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" legacyBehavior>
              <a className="hover:text-ancient-gold transition-colors duration-300">隐私政策</a>
            </Link>
            <Link href="/terms" legacyBehavior>
              <a className="hover:text-ancient-gold transition-colors duration-300">使用条款</a>
            </Link>
            <Link href="/credits" legacyBehavior>
              <a className="hover:text-ancient-gold transition-colors duration-300">致谢</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 