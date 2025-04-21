import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // 监听滚动事件以更改导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 导航链接数据
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/timeline', label: '历史时间线' },
    { href: '/instruments', label: '天文仪器' },
    { href: '/records', label: '天象记录' },
    { href: '/scientific-value', label: '科学价值' },
    { href: '/sky-experience', label: '3D星空体验', highlight: true },
    { href: '/vr-experience', label: '虚拟现实', highlight: true }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      isScrolled ? 'bg-ancient-dark bg-opacity-90 backdrop-blur-sm py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-ancient-gold font-serif text-xl md:text-2xl font-bold">
              中国古代<span className="text-white">天文</span>
            </span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${
                  router.pathname === link.href 
                    ? 'text-ancient-gold font-medium' 
                    : 'text-white hover:text-ancient-gold'
                } transition-colors ${
                  link.highlight 
                    ? 'bg-ancient-gold bg-opacity-20 px-3 py-1 rounded-lg text-ancient-gold hover:bg-opacity-30' 
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <motion.div
        className={`md:hidden bg-ancient-dark bg-opacity-95 backdrop-blur-md overflow-hidden`}
        initial={false}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm py-2 ${
                  router.pathname === link.href 
                    ? 'text-ancient-gold font-medium' 
                    : 'text-white hover:text-ancient-gold'
                } ${
                  link.highlight 
                    ? 'bg-ancient-gold bg-opacity-20 px-3 py-2 rounded-lg text-ancient-gold text-center' 
                    : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <Link 
                href="/vr-experience" 
                className={`block py-2 px-4 rounded transition-colors ${router.pathname === '/vr-experience' ? 'bg-ancient-gold text-black' : 'text-gray-200 hover:bg-gray-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                虚拟现实
              </Link>
            </div>
          </nav>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
