import { useState } from 'react';
import { instrumentsData } from '@/data/instrumentsData';

const AstronomicalInstruments = () => {
  const [activeInstrument, setActiveInstrument] = useState(instrumentsData[0].id);

  const getActiveInstrumentData = () => {
    return instrumentsData.find(item => item.id === activeInstrument) || instrumentsData[0];
  };

  return (
    <section id="instruments" className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <h2 className="ancient-title text-center mb-4">中国古代天文仪器</h2>
        <p className="ancient-text text-center max-w-3xl mx-auto mb-12">
          探索中国古代天文学家设计的精密仪器，了解它们的功能、历史意义和科学价值
        </p>
        
        {/* 仪器选择器 */}
        <div className="flex flex-wrap justify-center mb-12">
          {instrumentsData.map((instrument) => (
            <button
              key={instrument.id}
              className={`px-4 py-2 mx-2 mb-2 rounded-lg transition-colors ${
                activeInstrument === instrument.id
                  ? 'bg-ancient-bronze text-white'
                  : 'bg-ancient-paper hover:bg-ancient-bronze hover:bg-opacity-20'
              }`}
              onClick={() => setActiveInstrument(instrument.id)}
            >
              {instrument.name}
            </button>
          ))}
        </div>
        
        {/* 仪器详情 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 左侧：仪器图片和基本信息 */}
            <div className="bg-ancient-paper p-6 md:p-8">
              <div className="aspect-square bg-ancient-gold bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                <div className="text-6xl text-ancient-bronze opacity-70">
                  {/* 这里可以替换为实际的仪器图片 */}
                  {getActiveInstrumentData().name.charAt(0)}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{getActiveInstrumentData().name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">发明时期</p>
                  <p className="font-semibold">{getActiveInstrumentData().period}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">发明者</p>
                  <p className="font-semibold">{getActiveInstrumentData().inventor}</p>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <h4 className="font-bold mb-2">现代对比</h4>
                <p className="text-sm">{getActiveInstrumentData().modernComparison}</p>
              </div>
            </div>
            
            {/* 右侧：详细描述和功能 */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">仪器描述</h4>
                <p className="text-gray-700">{getActiveInstrumentData().description}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">主要功能</h4>
                <ul className="space-y-2">
                  {getActiveInstrumentData().functions.map((func, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-ancient-bronze mr-2">•</span>
                      <span>{func}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">历史意义</h4>
                <p className="text-gray-700">{getActiveInstrumentData().significance}</p>
              </div>
            </div>
          </div>
          
          {/* 底部导航 */}
          <div className="bg-gray-50 p-4 flex justify-between">
            <button
              className="text-ancient-bronze hover:underline disabled:opacity-50 disabled:no-underline"
              disabled={instrumentsData.findIndex(i => i.id === activeInstrument) === 0}
              onClick={() => {
                const currentIndex = instrumentsData.findIndex(i => i.id === activeInstrument);
                if (currentIndex > 0) {
                  setActiveInstrument(instrumentsData[currentIndex - 1].id);
                }
              }}
            >
              ← 上一个仪器
            </button>
            
            <button
              className="text-ancient-bronze hover:underline disabled:opacity-50 disabled:no-underline"
              disabled={instrumentsData.findIndex(i => i.id === activeInstrument) === instrumentsData.length - 1}
              onClick={() => {
                const currentIndex = instrumentsData.findIndex(i => i.id === activeInstrument);
                if (currentIndex < instrumentsData.length - 1) {
                  setActiveInstrument(instrumentsData[currentIndex + 1].id);
                }
              }}
            >
              下一个仪器 →
            </button>
          </div>
        </div>
        
        {/* 补充信息 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            中国古代天文仪器展现了古人的智慧和创造力，它们不仅是科学工具，
            也是艺术品和文化遗产，见证了中华文明对天文学的持久探索。
          </p>
        </div>
      </div>
    </section>
  );
};

export default AstronomicalInstruments; 