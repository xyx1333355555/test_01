import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { name: '首页', href: '/' },
    { name: '天文成就', href: '/astronomy-achievements' },
    { name: '历法发展', href: '/calendar-development' },
    { name: '天象记录', href: '/celestial-records' },
    { name: '科学价值', href: '/scientific-value' },
  ];
  
  const isActive = (path: string) => router.pathname === path;
  
  // 动画变体
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };
  
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: 'easeInOut' 
      }
    }
  };
  
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled || !transparent
          ? 'bg-ancient-celestial/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <motion.div
                initial="normal"
                whileHover="hover"
                variants={logoVariants}
                className="relative group"
              >
                <span className="text-xl md:text-2xl font-serif font-bold text-ancient-gold group-hover:text-shadow-glow transition-all duration-300">
                  中国古代天文
                </span>
                <motion.span 
                  className="block h-0.5 bg-ancient-gold rounded-full mt-0.5 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <span className="absolute -bottom-3 left-0 text-xs text-ancient-gold/70 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300">
                  Ancient Chinese Astronomy
                </span>
              </motion.div>
            </a>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:block">
            <motion.ul 
              className="flex space-x-2 items-center"
              initial="hidden"
              animate="visible"
              variants={navVariants}
            >
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link href={link.href} legacyBehavior>
                    <a 
                      className={`px-3 py-2 rounded-md text-sm font-medium relative transition-all duration-300 
                        ${isActive(link.href) 
                          ? 'text-ancient-gold text-shadow-glow' 
                          : 'text-white hover:text-ancient-gold/90'}`
                       }
                    >
                      {link.name}
                      {isActive(link.href) && (
                        <motion.span 
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-ancient-gold/80 rounded-full"
                          layoutId="activeNavIndicator"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </a>
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants}>
                <Link href="/vr-experience" legacyBehavior>
                  <a className="ancient-button ml-2 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                    <span className="text-ancient-gold flex items-center">
                      <span className="mr-1">VR体验</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                </Link>
              </motion.li>
            </motion.ul>
          </nav>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-ancient-gold p-2 rounded-md focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* 移动端下拉菜单 */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-ancient-celestial/95 backdrop-blur-md pt-2 pb-4 px-2 rounded-b-lg shadow-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link href={link.href} legacyBehavior>
                    <a 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(link.href) 
                          ? 'bg-ancient-gold/20 text-ancient-gold text-shadow-glow' 
                          : 'text-white hover:bg-ancient-gold/10 hover:text-ancient-gold'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants}>
                <Link href="/vr-experience" legacyBehavior>
                  <a 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-ancient-gold/30 text-ancient-gold text-shadow-glow"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      <span>VR体验</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 