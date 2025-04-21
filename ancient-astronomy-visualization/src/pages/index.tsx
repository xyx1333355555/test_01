import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import TimelineSection from '@/components/sections/TimelineSection';
import AstronomicalInstruments from '@/components/sections/AstronomicalInstruments';
import CelestialRecords from '@/components/sections/CelestialRecords';
import ComparisonSection from '@/components/sections/ComparisonSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 添加页面导航链接
  const pageLinks = [
    { name: '历史时间线', href: '/timeline', description: '探索中国古代天文学的发展历程' },
    { name: '天文仪器', href: '/instruments', description: '了解古代天文仪器的设计与功能' },
    { name: '天象记录', href: '/records', description: '查看古代天象观测的详细记录' },
    { name: '科学价值', href: '/scientific-value', description: '比较古代天文成就与现代科学' },
    { name: '3D星空体验', href: '/sky-experience', description: '交互式探索中国古代星官和天象' },
    { name: '虚拟现实', href: '/vr-experience', description: '沉浸式体验古代天文学的魅力' },
  ];

  return (
    <>
      <Head>
        <title>中国古代天象记录与天文成就 | 沉浸式数据可视化平台</title>
        <meta name="description" content="探索中国古代天文学的成就、天象记录及其科学价值的沉浸式交互数据可视化平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-ancient-paper z-50">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="ancient-text">正在加载古代天文智慧...</p>
          </div>
        </div>
      ) : (
        <main className="min-h-screen">
          <Header />
          <Hero />
          
          {/* 页面导航区域 */}
          <section className="py-16 bg-ancient-paper">
            <div className="container mx-auto px-4">
              <h2 className="ancient-title text-center mb-12">探索古代天文世界</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl"
                  >
                    <h3 className="text-xl font-bold mb-2 text-ancient-ink">{link.name}</h3>
                    <p className="text-gray-600 mb-4">{link.description}</p>
                    <div className="flex justify-end">
                      <span className="text-ancient-gold font-medium flex items-center">
                        查看详情
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          
          <TimelineSection />
          <AstronomicalInstruments />
          <CelestialRecords />
          <ComparisonSection />
          <Footer />
        </main>
      )}
    </>
  );
}
