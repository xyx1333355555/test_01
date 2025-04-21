import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TimelineSection from '@/components/sections/TimelineSection';

const TimelinePage = () => {
  return (
    <>
      <Head>
        <title>中国古代天文学发展时间线 - 中国古代天文可视化</title>
        <meta name="description" content="探索中国古代天文学的发展历程，了解各个朝代的重要天文成就和关键人物" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-ancient-paper">
        <div className="py-12 bg-ancient-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="ancient-title text-4xl md:text-5xl mb-4">中国古代天文学发展时间线</h1>
            <p className="max-w-3xl mx-auto">
              从夏商周到明清，探索中国古代天文学的辉煌历程，了解各个朝代的天文成就、关键人物和历史背景
            </p>
          </div>
        </div>
        
        <TimelineSection />
      </main>

      <Footer />
    </>
  );
};

export default TimelinePage; 