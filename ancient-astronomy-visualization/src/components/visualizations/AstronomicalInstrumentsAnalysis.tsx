import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface Instrument {
  id: string;
  name: string;
  period: string;
  inventor: string;
  purpose: string;
  features: string[];
  description: string;
  significance: string;
  image?: string;
}

interface AstronomicalInstrumentsAnalysisProps {
  className?: string;
}

const AstronomicalInstrumentsAnalysis: React.FC<AstronomicalInstrumentsAnalysisProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeInstrument, setActiveInstrument] = useState('huntianyi');
  const [activeView, setActiveView] = useState<'instruments' | 'comparison' | 'evolution'>('instruments');
  
  // 中国古代天文仪器数据
  const instruments: Instrument[] = [
    {
      id: 'huntianyi',
      name: '浑天仪',
      period: '汉代至清代',
      inventor: '张衡、郭守敬',
      purpose: '观测天体位置和运动',
      features: [
        '黄道赤道坐标系',
        '可旋转观测',
        '精密刻度',
        '模拟天体运动'
      ],
      description: '浑天仪是模拟天球运转的综合性天文观测仪器，由内外两层球体组成，外层代表天球，内层安置观测装置。仪器可以旋转，模拟天球周日运动，观测者能够测量天体位置和运行轨迹。随着技术发展，浑天仪结构越来越复杂精密，测量精度不断提高。',
      significance: '是中国古代最重要的天文仪器之一，集天文观测和教学于一体，对推动天文测量技术发展和天文知识普及有重大贡献',
      image: '/images/astronomy/hunteenyi.jpg'
    },
    {
      id: 'jianyi',
      name: '简仪',
      period: '战国至汉代',
      inventor: '甘德、石申',
      purpose: '测量天体高度和方位',
      features: [
        '立竿测影',
        '结构简单',
        '观测精确',
        '易于操作'
      ],
      description: '简仪是早期的天文观测仪器，由垂直立杆和水平圆盘组成。通过立杆投射的影子在圆盘上的位置，可以测量太阳高度、方位和季节变化。简仪是后来各种复杂天文仪器的基础，以其简便实用而被广泛使用。',
      significance: '代表了中国古代天文观测的早期成就，为历法制定提供了基础数据，体现了古人对天文现象的系统观察能力',
      image: '/images/astronomy/jianyi.jpg'
    },
    {
      id: 'rikui',
      name: '日晷',
      period: '周代至清代',
      inventor: '多人改进',
      purpose: '测定时间和季节',
      features: [
        '以影测时',
        '刻度精确',
        '形式多样',
        '四季适用'
      ],
      description: '日晷是利用太阳投影测定时间的仪器，由表盘和垂直或倾斜的针（称为晷针或晷柱）组成。太阳照射时，晷针在表盘上投下影子，根据影子位置可以读取时间。中国古代发明了多种形式的日晷，包括平面日晷、赤道式日晷等。',
      significance: '是古代主要的计时工具，对农业生产和社会生活有重要指导作用，也是天文学知识应用的典型例证',
      image: '/images/astronomy/rikui.jpg'
    },
    {
      id: 'gaobiao',
      name: '高表',
      period: '汉代至唐代',
      inventor: '洛下闳',
      purpose: '测量日影长度变化',
      features: [
        '高大立杆',
        '精确测影',
        '季节变化',
        '历法校准'
      ],
      description: '高表是一种测量太阳高度和季节变化的仪器，主要由一根高大的垂直立杆和地面刻度组成。通过测量太阳光在不同时节投射的影子长度，可以确定节气和历法参数。汉代时，高表已发展得相当精确。',
      significance: '为制定和校正历法提供了关键数据，特别是对确定冬至点和回归年长度做出了重要贡献',
      image: '/images/astronomy/gaobiao.jpg'
    },
    {
      id: 'armillary',
      name: '简化浑仪',
      period: '宋代至清代',
      inventor: '苏颂、郭守敬',
      purpose: '精确测量天体位置',
      features: [
        '环轮结构',
        '精密刻度',
        '水力驱动',
        '持续观测'
      ],
      description: '简化浑仪是浑天仪的改进型，由多个环轮组成，每个环轮代表天球上的一个坐标圈，如赤道圈、黄道圈等。通过调整环轮位置和使用瞄准装置，可以精确测量天体位置。宋代苏颂的浑仪还结合了水力驱动装置，实现了均速旋转和持续观测。',
      significance: '代表了中国古代天文仪器的最高水平，测量精度达到前所未有的高度，为编制精确的天文历法提供了技术保障',
      image: '/images/astronomy/armillary.jpg'
    },
    {
      id: 'celestial-globe',
      name: '天球仪',
      period: '汉代至明清',
      inventor: '多人改进',
      purpose: '教学演示和星象预报',
      features: [
        '星象图',
        '旋转模拟',
        '教学应用',
        '精美工艺'
      ],
      description: '天球仪是模拟天球的教学和演示工具，球面上绘制或镶嵌星象图，可以旋转演示天体运动。中国古代天球仪不仅是科学仪器，也是精美的工艺品，常用青铜制作并饰以金银。',
      significance: '是天文知识传播和教学的重要工具，体现了中国古代天文学与工艺美术的结合，也是科学成果的物化表现',
      image: '/images/astronomy/celestial-globe.jpg'
    }
  ];
  
  // 仪器发展时间线数据
  const evolutionData = {
    labels: ['周代', '战国秦汉', '魏晋南北朝', '隋唐', '宋元', '明清'],
    datasets: [
      {
        label: '天文仪器数量',
        data: [2, 5, 8, 12, 15, 18],
        backgroundColor: 'rgba(180, 132, 108, 0.7)',
      },
      {
        label: '精度提升(相对值)',
        data: [30, 55, 65, 75, 85, 90],
        backgroundColor: 'rgba(106, 90, 76, 0.7)',
      }
    ]
  };
  
  // 仪器性能比较数据
  const comparisonData = {
    labels: [
      '观测精度',
      '使用便捷性',
      '功能多样性',
      '制造复杂度',
      '历史影响力',
      '科学价值'
    ],
    datasets: [
      {
        label: '浑天仪',
        data: [85, 60, 95, 90, 95, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      },
      {
        label: '简仪',
        data: [70, 95, 60, 40, 80, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      },
      {
        label: '日晷',
        data: [75, 85, 65, 60, 90, 80],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 206, 86, 1)'
      },
      {
        label: '简化浑仪',
        data: [90, 65, 90, 85, 85, 95],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ]
  };
  
  // 仪器用途分布
  const usageData = {
    labels: ['天体位置测量', '时间测定', '季节变化观测', '历法制定', '教学演示', '天象预报'],
    datasets: [
      {
        label: '用途分布',
        data: [30, 25, 15, 12, 10, 8],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // 图表配置
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '中国古代天文仪器发展历程',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };
  
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '天文仪器性能比较',
        font: {
          size: 18
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent'
        }
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '天文仪器用途分布',
        font: {
          size: 18
        }
      }
    }
  };
  
  // 获取当前选中的仪器
  const getSelectedInstrument = () => {
    return instruments.find(instrument => instrument.id === activeInstrument) || instruments[0];
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4846C]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-[#F7F4ED] rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#4A4236]">中国古代天文仪器分析</h2>
        <p className="text-[#6B5C45] mt-2">探索中国古代天文仪器的发展历程、技术特点和科学价值</p>
      </div>
      
      {/* 视图切换 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/50 rounded-full p-1 shadow-sm">
          <motion.button
            onClick={() => setActiveView('instruments')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'instruments' 
                ? 'bg-[#B4846C] text-white shadow-sm' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>仪器详情</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveView('comparison')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'comparison' 
                ? 'bg-[#B4846C] text-white shadow-sm' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>仪器比较</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveView('evolution')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'evolution' 
                ? 'bg-[#B4846C] text-white shadow-sm' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>历史演变</span>
          </motion.button>
        </div>
      </div>
      
      {/* 仪器详情视图 */}
      {activeView === 'instruments' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 仪器选择导航 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 overflow-x-auto">
            <div className="inline-flex gap-2 pb-2">
              {instruments.map(instrument => (
                <motion.button
                  key={instrument.id}
                  onClick={() => setActiveInstrument(instrument.id)}
                  className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeInstrument === instrument.id 
                      ? 'bg-[#B4846C] text-white shadow-md' 
                      : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {instrument.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* 仪器详情展示 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：仪器介绍 */}
            <div className="space-y-5">
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-xl font-bold text-[#4A4236] mb-3">{getSelectedInstrument().name}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-[#B4846C] font-medium">时期:</span>
                    <span className="text-[#6B5C45] ml-2">{getSelectedInstrument().period}</span>
                  </div>
                  <div>
                    <span className="text-[#B4846C] font-medium">发明者:</span>
                    <span className="text-[#6B5C45] ml-2">{getSelectedInstrument().inventor}</span>
                  </div>
                  <div>
                    <span className="text-[#B4846C] font-medium">用途:</span>
                    <span className="text-[#6B5C45] ml-2">{getSelectedInstrument().purpose}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#6B5C45] leading-relaxed">{getSelectedInstrument().description}</p>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-3">技术特点</h3>
                <ul className="list-disc list-inside text-[#6B5C45] space-y-1">
                  {getSelectedInstrument().features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-3">科学价值</h3>
                <p className="text-[#6B5C45] leading-relaxed">{getSelectedInstrument().significance}</p>
              </div>
            </div>
            
            {/* 右侧：用途分布 */}
            <div className="space-y-5">              
              {/* 用途分布图 */}
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-4">天文仪器用途分布</h3>
                <div className="h-[350px]">
                  <Doughnut data={usageData} options={doughnutOptions} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 仪器比较视图 */}
      {activeView === 'comparison' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 rounded-lg p-5 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">天文仪器性能比较分析</h3>
            <div className="h-[400px]">
              <Radar data={comparisonData} options={radarOptions} />
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">仪器特性比较</h3>
            <div className="text-[#6B5C45] space-y-4">
              <p>
                通过对比分析可以看出，浑天仪和简化浑仪在观测精度和功能多样性方面表现最优，但使用便捷性较低；
                简仪和日晷则以使用简便和实用性见长，但在精度和功能上有所不足。从历史影响力看，各类仪器都有重要地位，
                但浑天仪作为中国古代天文学的标志性仪器，影响尤为深远。
              </p>
              <p>
                不同仪器有各自的适用场景，简仪适合基础天文观测和教学，日晷主要用于日常计时，
                浑天仪和简化浑仪则用于精密天文观测和历法制定。这种功能互补性使得中国古代天文观测形成了完整的技术体系。
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 历史演变视图 */}
      {activeView === 'evolution' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 rounded-lg p-5 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">天文仪器历史发展</h3>
            <div className="h-[400px]">
              <Bar data={evolutionData} options={barOptions} />
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">天文仪器发展历程分析</h3>
            <div className="text-[#6B5C45] space-y-4">
              <p>
                中国古代天文仪器的发展经历了从简单到复杂、从单一功能到多功能的演变过程。周代主要使用简单的日晷和土圭测影；
                战国秦汉时期出现了更为系统的简仪和高表；汉代张衡发明浑天仪后，天文仪器进入了快速发展阶段；隋唐时期，天文仪器的种类和数量都有显著增加；
                宋代是天文仪器发展的高峰期，苏颂的水运仪象台集中体现了当时的技术水平；明清时期在吸收西方技术的基础上，传统天文仪器又有新的发展。
              </p>
              <p>
                天文仪器的精度提升是一个持续过程，从早期的粗略测量到后来能够精确到分秒的观测，体现了中国古代科技的不断进步。
                这些仪器的发展不仅促进了天文学的进步，也带动了机械工艺、冶金技术等多个领域的发展。
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 数据来源说明 */}
      <div className="mt-6 text-[#6B5C45] text-sm italic text-center">
        数据来源：《中国科学技术史·天文卷》、《中国古代天文仪器史》、《天文考古学》等专业文献综合分析
      </div>
    </div>
  );
};

export default AstronomicalInstrumentsAnalysis; 