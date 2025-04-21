import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { instrumentsData } from '@/data/instrumentsData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const InstrumentsPage = () => {
  return (
    <>
      <Head>
        <title>中国古代天文仪器 - 中国古代天文可视化</title>
        <meta name="description" content="探索中国古代天文学家设计的精密仪器，了解它们的功能、历史意义和科学价值" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-ancient-paper">
        <div className="py-12 bg-ancient-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="ancient-title text-4xl md:text-5xl mb-4">中国古代天文仪器</h1>
            <p className="max-w-3xl mx-auto">
              探索中国古代天文学家设计的精密仪器，了解它们的功能、历史意义和科学价值
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instrumentsData.map((instrument, index) => (
              <motion.div
                key={instrument.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/instrument/${instrument.id}`} className="block h-full">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-xl transition-all hover:scale-105">
                    <div className="bg-ancient-gold bg-opacity-10 p-6">
                      <h2 className="text-2xl font-bold text-center">{instrument.name}</h2>
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {instrument.period} · {instrument.inventor}
                      </p>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 mb-4 line-clamp-3">{instrument.description}</p>
                      <div className="mt-4">
                        <h3 className="font-semibold text-ancient-gold mb-2">主要功能</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {instrument.functions.slice(0, 2).map((func, i) => (
                            <li key={i} className="line-clamp-1">{func}</li>
                          ))}
                          {instrument.functions.length > 2 && (
                            <li className="text-gray-500">更多功能...</li>
                          )}
                        </ul>
                      </div>
                      <div className="mt-4 text-center">
                        <span className="text-ancient-gold text-sm inline-flex items-center">
                          查看详情和3D模型
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default InstrumentsPage; 