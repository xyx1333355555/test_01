import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RecordData {
  id: string;
  title: string;
  icon: string;
  totalRecords: number;
  verificationRate: string;
  historicalSignificance: string;
  modernValue: string;
  timeDistribution: Record<string, number>;
  examples: {
    name: string;
    ancientRecord: string;
    modernDiscovery: string;
    scientificImpact: string;
    image?: string;
  }[];
}

interface AstronomicalRecordDetailProps {
  recordType: string;
  className?: string;
}

const recordsData: Record<string, RecordData> = {
  'supernova': {
    id: 'supernova',
    title: '超新星记录',
    icon: '💫',
    totalRecords: 20,
    verificationRate: '90%',
    historicalSignificance: '古代天文学家通过精确观测和记录"客星"现象，积累了宝贵的天文数据，反映了中国古代天象观测的系统性和连续性',
    modernValue: '现代天体物理学利用这些记录确认了多个超新星遗迹，并计算出爆发的精确时间，为恒星演化末期的研究提供了重要证据',
    timeDistribution: {
      '汉以前': 4,
      '唐朝': 3,
      '宋朝': 8,
      '元朝': 1,
      '明朝': 3,
      '清朝': 1
    },
    examples: [
      {
        name: 'SN 1054（蟹状星云超新星）',
        ancientRecord: '"仁宗至和元年，客星见于天关，如太白，芒角四出。"',
        modernDiscovery: '蟹状星云脉冲星是超新星爆发遗迹，通过中国古代记录确定了爆发时间',
        scientificImpact: '该记录帮助天文学家精确定了蟹状星云中的脉冲星形成时间，为中子星物理学提供了重要研究对象',
        image: '/images/astronomy/crab-nebula.jpg'
      },
      {
        name: 'SN 1006（天狼座超新星）',
        ancientRecord: '"大中祥符二年，晨间有客星出现于东南方，如半月，光芒照地。"',
        modernDiscovery: '这是有记录以来最亮的超新星爆发，亮度达到-7.5等，现代望远镜已确认其遗迹',
        scientificImpact: '1006年超新星记录为研究Ia型超新星物理机制提供了重要历史数据',
        image: '/images/astronomy/sn1006-remnant.jpg'
      }
    ]
  },
  'comet': {
    id: 'comet',
    title: '彗星记录',
    icon: '☄️',
    totalRecords: 378,
    verificationRate: '82%',
    historicalSignificance: '中国古代天文学家详细记录了彗星的出现位置、形态和运行轨迹，构成了世界上最完整的古代彗星观测资料',
    modernValue: '这些彗星记录帮助现代天文学家确认周期彗星的轨道和历史回归，对太阳系小天体研究具有重要价值',
    timeDistribution: {
      '汉以前': 31,
      '魏晋南北朝': 48,
      '唐朝': 67,
      '宋朝': 95,
      '元朝': 27,
      '明朝': 64,
      '清朝': 46
    },
    examples: [
      {
        name: '哈雷彗星',
        ancientRecord: '"周惠王二十四年，有星孛于东方"（公元前613年，《史记·天官书》记载的哈雷彗星最早记录）',
        modernDiscovery: '哈雷彗星是第一个被确认具有周期性的彗星，周期约76年，通过中国古代记录确认了其多次历史回归',
        scientificImpact: '中国古代对哈雷彗星的连续记录帮助现代天文学家研究太阳系演化和彗星物理特性变化',
        image: '/images/astronomy/halley-comet.jpg'
      },
      {
        name: '金星彗星记录',
        ancientRecord: '"贞观十二年，客星见于太微，状如彗，芒长丈余。"',
        modernDiscovery: '现代天文学研究发现这是一次罕见的金星彗发现象，由金星大气散射太阳光形成',
        scientificImpact: '这一罕见记录帮助研究金星大气结构和太阳活动对行星大气的影响',
        image: '/images/astronomy/venus-comet.jpg'
      }
    ]
  },
  'solar-lunar': {
    id: 'solar-lunar',
    title: '日月食记录',
    icon: '🌓',
    totalRecords: 966,
    verificationRate: '95%',
    historicalSignificance: '中国拥有世界上最长、最连续的日食和月食记录，最早可追溯到公元前2137年，被誉为天文学"化石"',
    modernValue: '这些记录被现代天文学用于研究地球自转减慢现象，估算潮汐摩擦效应，对地球物理学和天体力学具有重要价值',
    timeDistribution: {
      '汉以前': 102,
      '魏晋南北朝': 138,
      '唐朝': 167,
      '宋朝': 198,
      '元朝': 89,
      '明朝': 174,
      '清朝': 98
    },
    examples: [
      {
        name: '商朝甲骨文日食记录',
        ancientRecord: '"有食日"（甲骨文记载的最早日食记录，约公元前1300年）',
        modernDiscovery: '现代天文学通过数值计算确认了多条甲骨文日食记录的准确性',
        scientificImpact: '这些记录为研究地球自转速率的长期变化提供了最早的科学数据',
        image: '/images/astronomy/oracle-eclipse.jpg'
      },
      {
        name: '《春秋》日食记录',
        ancientRecord: '"三月癸丑朔，日有食之"（公元前720年，《春秋》记载的第一次日食）',
        modernDiscovery: '现代天文学计算证实这是发生在中国的一次日全食',
        scientificImpact: '《春秋》中的日食记录帮助校准古代历法，也为研究地球自转变化提供了可靠数据点',
        image: '/images/astronomy/chunqiu-eclipse.jpg'
      }
    ]
  },
  'meteor': {
    id: 'meteor',
    title: '流星记录',
    icon: '✨',
    totalRecords: 526,
    verificationRate: '75%',
    historicalSignificance: '中国古代详细记录了流星和流星雨现象，包括出现时间、方位、亮度和数量等信息，为研究流星活动提供了宝贵历史资料',
    modernValue: '这些记录帮助现代天文学家确认流星雨的周期性活动和变化规律，对研究太阳系小天体和地球环境变化有重要意义',
    timeDistribution: {
      '汉以前': 48,
      '魏晋南北朝': 73,
      '唐朝': 86,
      '宋朝': 131,
      '元朝': 42,
      '明朝': 85,
      '清朝': 61
    },
    examples: [
      {
        name: '双子座流星雨古代记录',
        ancientRecord: '"开成二年十一月，夜，星陨如雨。"（唐代记载的双子座流星雨）',
        modernDiscovery: '现代天文学确认这是双子座流星雨的历史活动，与法厄顿小行星碎片相关',
        scientificImpact: '通过对古代流星雨记录的研究，天文学家能够追踪流星体来源的变化和活动周期',
        image: '/images/astronomy/geminids.jpg'
      },
      {
        name: '狮子座流星雨记录',
        ancientRecord: '"至道三年十月，夜，星陨如雨，或大如杯，光照地。"（宋代记载的狮子座流星雨）',
        modernDiscovery: '现代研究确认这是狮子座流星雨的历史极大期记录，与坦普尔-塔特尔彗星相关',
        scientificImpact: '古代流星雨记录帮助理解彗星活动与流星雨的关系，为太阳系小天体研究提供历史数据',
        image: '/images/astronomy/leonids.jpg'
      }
    ]
  },
  'star': {
    id: 'star',
    title: '恒星观测',
    icon: '⭐',
    totalRecords: 842,
    verificationRate: '88%',
    historicalSignificance: '中国古代天文学家对恒星位置和变化进行了系统观测，发展了精细的星官系统，记录了多颗变星的活动',
    modernValue: '这些恒星观测记录有助于现代天文学研究恒星长期变化，特别是对变星和新星研究具有重要参考价值',
    timeDistribution: {
      '汉以前': 86,
      '汉代': 124,
      '魏晋南北朝': 143,
      '唐朝': 152,
      '宋朝': 178,
      '元明清': 159
    },
    examples: [
      {
        name: '心宿二(心大星)的变光记录',
        ancientRecord: '"太微西星变色，白变赤，有芒角。"（汉书天文志记载的心宿二亮度变化）',
        modernDiscovery: '现代天文学确认心宿二(心大星)为一颗半规则变星，其亮度和颜色确实会发生变化',
        scientificImpact: '古代对心宿二的观测记录为研究恒星演化提供了千年尺度的数据，对了解红巨星物理特性有重要价值',
        image: '/images/astronomy/antares.jpg'
      },
      {
        name: '毕宿五(毕大星)观测',
        ancientRecord: '"毕星失色，色赤如火，光芒四射，有变动。"',
        modernDiscovery: '毕宿五是一颗明亮的红巨星，现代研究发现它是一颗脉动变星，其亮度和颜色会有周期性变化',
        scientificImpact: '古代对毕宿五的长期观测为研究大质量恒星晚期演化提供了宝贵的历史参考',
        image: '/images/astronomy/aldebaran.jpg'
      }
    ]
  },
  'planet': {
    id: 'planet',
    title: '行星观测',
    icon: '🪐',
    totalRecords: 2356,
    verificationRate: '93%',
    historicalSignificance: '中国古代天文学对金、木、水、火、土五大行星的运行进行了精确系统的记录，建立了行星运动预测模型',
    modernValue: '这些行星观测记录对研究行星轨道长期演化和太阳系动力学具有重要价值，也为历史天文学研究提供了丰富素材',
    timeDistribution: {
      '汉以前': 215,
      '汉代': 346,
      '魏晋南北朝': 378,
      '唐朝': 422,
      '宋朝': 486,
      '元朝': 189,
      '明清': 320
    },
    examples: [
      {
        name: '木星合月记录',
        ancientRecord: '"太初元年二月癸亥，岁星犯月。"（汉代记载的木星合月现象）',
        modernDiscovery: '现代天文学通过数值模拟精确重现了这次合相现象，证实古代记录的准确性',
        scientificImpact: '古代对行星合相的精确记录帮助校准历史年代学，也为行星轨道的长期演化研究提供了观测约束',
        image: '/images/astronomy/jupiter-moon.jpg'
      },
      {
        name: '金星凌日现象',
        ancientRecord: '"开元二十四年正月己亥朔，黑气如铜钱凌日中。"（唐代记载的可能金星凌日现象）',
        modernDiscovery: '现代计算表明这可能是一次金星凌日的观测记录，这类现象非常罕见',
        scientificImpact: '古代对金星凌日的观测为研究金星轨道的历史变化提供了关键数据点',
        image: '/images/astronomy/venus-transit.jpg'
      }
    ]
  }
};

const AstronomicalRecordDetail: React.FC<AstronomicalRecordDetailProps> = ({ recordType, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeExample, setActiveExample] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'examples'>('overview');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // 重置当前示例索引和标签页当记录类型改变时
    setActiveExample(0);
    setActiveTab('overview');
  }, [recordType]);
  
  if (isLoading) {
    return (
      <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4846C]"></div>
        </div>
      </div>
    );
  }
  
  const record = recordsData[recordType] || recordsData['supernova'];
  
  const getDistributionItems = () => {
    return Object.entries(record.timeDistribution).map(([dynasty, count]) => (
      <div key={dynasty} className="flex items-center justify-between py-2 border-b border-[#B4846C]/10">
        <span className="text-[#6B5C45]">{dynasty}</span>
        <div className="flex items-center">
          <div 
            className="h-4 bg-[#B4846C]/80 rounded-sm mr-2" 
            style={{ 
              width: `${Math.min(100, count * 3)}px`,
              minWidth: '20px'
            }}
          ></div>
          <span className="text-[#6B5C45]">{count}</span>
        </div>
      </div>
    ));
  };
  
  return (
    <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{record.icon}</span>
          <h2 className="text-3xl font-bold text-center text-[#4A4236]">{record.title}</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 mt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#B4846C]">{record.totalRecords}</div>
            <div className="text-[#6B5C45] mt-1">古代记录总数</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-[#B4846C]">{record.verificationRate}</div>
            <div className="text-[#6B5C45] mt-1">验证率</div>
          </div>
        </div>
      </div>
      
      {/* 标签页切换 */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/50 rounded-full p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'overview' 
                ? 'bg-[#B4846C] text-white' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
          >
            概述
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'examples' 
                ? 'bg-[#B4846C] text-white' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
          >
            典型案例
          </button>
        </div>
      </div>
      
      {/* 概述内容 */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/80 rounded-lg p-5">
              <h3 className="text-xl font-bold text-[#4A4236] mb-4">历史意义</h3>
              <p className="text-[#6B5C45]">{record.historicalSignificance}</p>
            </div>
            
            <div className="bg-white/80 rounded-lg p-5">
              <h3 className="text-xl font-bold text-[#4A4236] mb-4">现代研究价值</h3>
              <p className="text-[#6B5C45]">{record.modernValue}</p>
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-5 mb-4">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">时代分布</h3>
            <div className="space-y-1">
              {getDistributionItems()}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 典型案例内容 */}
      {activeTab === 'examples' && record.examples.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-[#4A4236]">典型案例: {record.examples[activeExample].name}</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              {record.examples[activeExample].image && (
                <div className="bg-white/80 rounded-lg p-2 mb-4 flex justify-center">
                  <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
                    <img 
                      src={record.examples[activeExample].image}
                      alt={record.examples[activeExample].name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-bold text-[#B4846C] mb-2">古代记载</h4>
                <p className="text-[#6B5C45] italic">"{record.examples[activeExample].ancientRecord}"</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-bold text-[#B4846C] mb-2">现代发现</h4>
                <p className="text-[#6B5C45]">{record.examples[activeExample].modernDiscovery}</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-bold text-[#B4846C] mb-2">科学影响</h4>
                <p className="text-[#6B5C45]">{record.examples[activeExample].scientificImpact}</p>
              </div>
            </div>
          </div>
          
          {/* 案例切换按钮 */}
          {record.examples.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {record.examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveExample(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeExample === index 
                      ? 'bg-[#B4846C]' 
                      : 'bg-[#B4846C]/30 hover:bg-[#B4846C]/50'
                  }`}
                  aria-label={`查看案例 ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AstronomicalRecordDetail; 