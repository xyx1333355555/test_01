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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CosmicModel {
  id: string;
  name: string;
  period: string;
  originator: string;
  features: string[];
  description: string;
  significance: string;
  image?: string;
}

interface CosmicConceptAnalysisProps {
  className?: string;
}

const CosmicConceptAnalysis: React.FC<CosmicConceptAnalysisProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState('huntian');
  const [activeView, setActiveView] = useState<'models' | 'comparison' | 'evolution'>('models');
  
  // 中国古代宇宙模型数据
  const cosmicModels: CosmicModel[] = [
    {
      id: 'gaitain',
      name: '盖天说',
      period: '战国至汉代',
      originator: '杨泉、鲁连',
      features: [
        '天圆地方',
        '天如倒扣之盖',
        '地如棋盘',
        '天地之间有四海'
      ],
      description: '盖天说认为天像华盖，地平如棋盘，天覆地载，日月五星附着在天上运行。天有四柱支撑，地浮于水上，太阳经过天罡后落入西方昆仑山后，夜间沿地下返回东方。',
      significance: '反映了中国古代朴素的天文观察和思考，是早期宇宙模型的代表，体现了"天圆地方"的传统观念',
      image: '/images/astronomy/gaitianshuo.jpg'
    },
    {
      id: 'huntian',
      name: '浑天说',
      period: '汉代至明清',
      originator: '落下闳、张衡',
      features: [
        '天地如鸡子',
        '天包地不著',
        '天地沉浮',
        '日月星辰附着天球'
      ],
      description: '浑天说认为天象鸡卵之壳，地象卵中之黄，四方上下曰宇，往古来今曰宙。天包裹着地，但不与地相连，天地各自悬浮于空中。天球外面是气，内面是刚，均匀旋转，带动日月星辰运行。',
      significance: '成为中国古代主流宇宙学说，为设计浑天仪等天文仪器奠定了理论基础，对古代历法制定有重要影响',
      image: '/images/astronomy/huntianshuo.jpg'
    },
    {
      id: 'xuanye',
      name: '宣夜说',
      period: '战国至汉代',
      originator: '邹衍',
      features: [
        '天无形体',
        '星辰自行',
        '日月自行',
        '天空无限广阔'
      ],
      description: '宣夜说认为天空是一片无边无际的虚空，称为"宣夜"，日月星辰在虚空中自行运动，没有实体的天球。天体周期性运动是自然规律，而非附着在某个实体上。',
      significance: '是较为进步的古代宇宙模型，近似现代宇宙观，对后世天文学有一定启发意义',
      image: '/images/astronomy/xuanyeshuo.jpg'
    },
    {
      id: 'zhoutian',
      name: '周天说',
      period: '明代',
      originator: '李时珍',
      features: [
        '天地无穷',
        '日月环行',
        '天无实体',
        '地如浮球'
      ],
      description: '周天说结合了宣夜说和浑天说的特点，认为天空无边无际，不存在实体天球，但星辰按照一定规律在周天轨道上运行。地处宇宙中央，日月环绕地球运行。',
      significance: '为中西方天文学交流时期的重要学说，融合了多种宇宙模型的特点，展现了明代学者的宇宙观念创新',
      image: '/images/astronomy/zhoutianshuo.jpg'
    }
  ];
  
  // 宇宙观念演变时间线数据
  const evolutionData = {
    labels: ['春秋战国', '秦汉', '魏晋南北朝', '隋唐', '宋元', '明清'],
    datasets: [
      {
        label: '盖天说影响力',
        data: [90, 75, 45, 30, 20, 10],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '浑天说影响力',
        data: [20, 80, 90, 95, 90, 85],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: '宣夜说影响力',
        data: [60, 40, 20, 15, 10, 5],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: '周天说影响力',
        data: [0, 0, 0, 0, 10, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };
  
  // 宇宙模型比较数据
  const comparisonData = {
    labels: [
      '天体结构认识',
      '天体运动解释',
      '对历法的影响',
      '实用天文价值',
      '哲学思想反映',
      '科学进步性'
    ],
    datasets: [
      {
        label: '盖天说',
        data: [50, 45, 65, 70, 80, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: '浑天说',
        data: [80, 85, 90, 85, 75, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '宣夜说',
        data: [65, 60, 40, 35, 70, 85],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: '周天说',
        data: [75, 70, 60, 65, 85, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  // 宇宙观念影响领域分布
  const impactData = {
    labels: ['历法制定', '天文观测', '哲学思想', '文学艺术', '宗教信仰', '科技发展'],
    datasets: [
      {
        label: '影响程度',
        data: [35, 28, 20, 15, 12, 18],
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
        text: '中国古代宇宙模型历史演变',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };
  
  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '中国古代宇宙模型比较',
        font: {
          size: 18
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '宇宙观念对各领域影响分布',
        font: {
          size: 18
        }
      }
    }
  };
  
  // 获取当前选中的模型
  const getSelectedModel = () => {
    return cosmicModels.find(model => model.id === activeModel) || cosmicModels[0];
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
        <h2 className="text-3xl font-bold text-[#4A4236]">中国古代宇宙观念分析</h2>
        <p className="text-[#6B5C45] mt-2">探索中国古代的宇宙模型及其对天文学发展的影响</p>
      </div>
      
      {/* 视图切换 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/50 rounded-full p-1 shadow-sm">
          <motion.button
            onClick={() => setActiveView('models')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'models' 
                ? 'bg-[#B4846C] text-white shadow-sm' 
                : 'bg-transparent text-[#6B5C45] hover:bg-[#B4846C]/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>宇宙模型详情</span>
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
            <span>模型比较</span>
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
      
      {/* 宇宙模型详情视图 */}
      {activeView === 'models' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 模型选择导航 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {cosmicModels.map(model => (
              <motion.button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeModel === model.id 
                    ? 'bg-[#B4846C] text-white shadow-md' 
                    : 'bg-white text-[#6B5C45] hover:bg-[#B4846C]/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {model.name}
              </motion.button>
            ))}
          </div>
          
          {/* 模型详情展示 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：模型介绍 */}
            <div className="space-y-5">
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-xl font-bold text-[#4A4236] mb-3">{getSelectedModel().name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[#B4846C] font-medium">时期:</span>
                    <span className="text-[#6B5C45] ml-2">{getSelectedModel().period}</span>
                  </div>
                  <div>
                    <span className="text-[#B4846C] font-medium">代表人物:</span>
                    <span className="text-[#6B5C45] ml-2">{getSelectedModel().originator}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#6B5C45] leading-relaxed">{getSelectedModel().description}</p>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-3">主要特点</h3>
                <ul className="list-disc list-inside text-[#6B5C45] space-y-1">
                  {getSelectedModel().features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-3">历史意义</h3>
                <p className="text-[#6B5C45] leading-relaxed">{getSelectedModel().significance}</p>
              </div>
            </div>
            
            {/* 右侧：影响领域 */}
            <div className="space-y-5">              
              {/* 影响领域饼图 */}
              <div className="bg-white/80 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#4A4236] mb-4">对各领域影响</h3>
                <div className="h-[350px]">
                  <Pie data={impactData} options={pieOptions} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 模型比较视图 */}
      {activeView === 'comparison' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 rounded-lg p-5 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">各宇宙模型特性比较</h3>
            <div className="h-[400px]">
              <Bar data={comparisonData} options={comparisonOptions} />
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">宇宙模型比较分析</h3>
            <div className="text-[#6B5C45] space-y-4">
              <p>
                中国古代四大宇宙模型各具特色，反映了不同历史阶段的宇宙认知水平。浑天说在天体结构解释和天文实用性方面表现最优，对历法制定有重要影响；
                宣夜说在科学进步性上领先，但在实用天文价值上较弱；盖天说虽然结构简单，但在文化和哲学层面影响深远；周天说则集各家之长，在明清时期得到一定发展。
              </p>
              <p>
                从历史发展来看，浑天说成为主流学说并长期占据主导地位，这主要因为其对天象解释的全面性和实用性，能够满足历法制定和天文观测的需求。
                各种模型的出现和发展，反映了中国古代天文学家不断探索宇宙奥秘的科学精神和创新思想。
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
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">宇宙模型历史影响力演变</h3>
            <div className="h-[400px]">
              <Bar data={evolutionData} options={barOptions} />
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#4A4236] mb-4">宇宙观念演变分析</h3>
            <div className="text-[#6B5C45] space-y-4">
              <p>
                中国古代宇宙观念的演变展现了天文学思想的发展轨迹。从图表可见，早期盖天说占主导地位，随着汉代天文学的发展，浑天说逐渐成为主流，
                并在隋唐时期达到影响力巅峰。宣夜说虽然具有进步性，但由于缺乏系统性的理论支持和实用价值，影响力逐渐减弱。
              </p>
              <p>
                明清时期，随着中西天文学交流，周天说等新的宇宙模型开始发展，但浑天说仍保持较大影响力。这一演变过程反映了中国古代宇宙观念从直观经验向系统理论的发展，
                也体现了实用性在古代天文学发展中的重要作用。
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 数据来源说明 */}
      <div className="mt-6 text-[#6B5C45] text-sm italic text-center">
        数据来源：《中国天文学史》、《中国古代天文学家的宇宙模型》、《天学真原》等历史文献综合分析
      </div>
    </div>
  );
};

export default CosmicConceptAnalysis; 