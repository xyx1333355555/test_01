import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Billboard, 
  Html,
  Line
} from '@react-three/drei';
import * as THREE from 'three';
import { allStars, Star, historicalStars, generateRandomStars } from '@/data/starsData';
import { motion } from 'framer-motion';
import { CelestialRecord } from '@/data/celestialRecordsData';
import Link from 'next/link';

interface StarrySkyProps {
  records?: CelestialRecord[];
  dynasty?: string;
  onSelectStar?: (star: Star) => void;
  initialPosition?: [number, number, number];
  interactive?: boolean;
}

// 星星组件
const StarPoint: React.FC<{
  star: Star;
  selected: boolean;
  onClick: () => void;
  showLabel: boolean;
}> = ({ star, selected, onClick, showLabel }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // 增加星星大小以便于点击
  const size = 0.5 + (5 - star.magnitude) * 0.8; // 调整亮度转换为大小的比例
  const color = star.color;
  
  useFrame(() => {
    if (meshRef.current) {
      // 让星星闪烁
      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 
        size * (0.9 + 0.2 * Math.sin(Date.now() * 0.001 + parseInt(star.id.split('-')[1] || '0') * 100));
    }
  });

  // 创建一个更大的点击区域但保持星星视觉效果
  const handleClick = (e: any) => {
    // 阻止事件传播
    e.stopPropagation();
    
    // 记录点击事件
    console.log("点击星星:", star.chineseName || star.name, "ID:", star.id);
    
    // 立即显示选中效果
    if (meshRef.current) {
      // 短暂放大星星作为点击反馈
      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = size * 2;
      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = size;
        }
      }, 200);
    }
    
    // 触发点击回调
    onClick();
    
    // 直接操作DOM创建信息面板
    const event = new CustomEvent('starClick', { 
      detail: { star: star }
    });
    document.dispatchEvent(event);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[star.x, star.y, star.z]}
        onClick={handleClick}
      >
        {/* 增加球体分段数以获得更平滑的外观 */}
        <sphereGeometry args={[selected ? size * 2 : size, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* 为重要星星添加光晕效果 */}
      {star.dynasty && (
        <mesh position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[size * 3, 32, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      )}
      
      {/* 星星标签，只在选中或特定条件下显示 */}
      {(selected || (showLabel && star.chineseName)) && (
        <Billboard
          position={[star.x, star.y + size * 4, star.z]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <Text
            color="white"
            fontSize={0.8}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#00000080"
          >
            {star.chineseName || star.name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

// 星座连线组件
const ConstellationLines: React.FC<{ dynasty?: string }> = ({ dynasty }) => {
  // 获取要显示的星座连线
  const getConstellationLines = () => {
    const lines: Array<{
      points: [number, number, number][];
      color: string;
      name: string;
    }> = [];
    
    // 北斗七星连线
    const northernStars = historicalStars.filter(star => 
      star.id.startsWith('northern')
    );
    lines.push({
      points: northernStars.map(star => [star.x, star.y, star.z] as [number, number, number]),
      color: 'rgba(255,255,255,0.2)',
      name: '北斗七星'
    });
    
    // 东方七宿连线
    const easternStars = historicalStars.filter(star => 
      star.id.startsWith('eastern')
    );
    lines.push({
      points: easternStars.map(star => [star.x, star.y, star.z] as [number, number, number]),
      color: 'rgba(255,255,255,0.2)',
      name: '东方七宿'
    });
    
    return lines;
  };
  
  const constellationLines = getConstellationLines();
  
  return (
    <>
      {constellationLines.map((line, index) => (
        <Line
          key={index}
          points={line.points}
          color={line.color}
          lineWidth={1}
          segments
          derivatives={[]}
        />
      ))}
      
      {/* 添加星座名称标签 */}
      {constellationLines.map((line, index) => {
        const centerPoint = line.points[Math.floor(line.points.length / 2)];
        return (
          <Billboard
            key={`label-${index}`}
            position={centerPoint}
            follow={true}
          >
            <Text
              color="white"
              fontSize={2}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="#00000080"
            >
              {line.name}
            </Text>
          </Billboard>
        );
      })}
    </>
  );
};

// 相机控制组件
const CameraController: React.FC<{
  initialPosition: [number, number, number];
}> = ({ initialPosition }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    camera.position.set(...initialPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, initialPosition]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={50}
      maxDistance={500}
      autoRotate={true}
      autoRotateSpeed={0.3}
      rotateSpeed={0.5}
      zoomSpeed={0.7}
    />
  );
};

// 主3D星空组件
const StarrySky: React.FC<StarrySkyProps> = ({
  records = [],
  dynasty,
  onSelectStar,
  initialPosition = [0, 0, 300],
  interactive = true
}) => {
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [filteredStars, setFilteredStars] = useState<Star[]>(allStars);
  const [showHistoricalOnly, setShowHistoricalOnly] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  
  // 根据朝代过滤星星
  useEffect(() => {
    // 增加随机星星数量，与starsData.ts中的保持一致
    const backgroundStars = generateRandomStars(3000);
    
    if (dynasty && dynasty !== '全部朝代') {
      // 当选择特定朝代时:
      // 1. 包含该朝代的历史星星 (亮度增强)
      // 2. 包含其他朝代的历史星星 (亮度降低)
      const dynastyStars = historicalStars.filter(star => star.dynasty === dynasty)
        .map(star => ({...star, magnitude: star.magnitude * 0.7})); // 增强亮度
      
      const otherDynastyStars = historicalStars.filter(star => star.dynasty !== dynasty)
        .map(star => ({...star, magnitude: star.magnitude * 1.5})); // 降低亮度
      
      setFilteredStars([...dynastyStars, ...otherDynastyStars, ...backgroundStars]);
    } else {
      // 显示全部星星
      setFilteredStars([...historicalStars, ...backgroundStars]);
    }
  }, [dynasty]);

  // 检查records数据
  useEffect(() => {
    // 检查records数据是否有效
    console.log("天文记录数量:", records.length);
    console.log("历史星星数量:", historicalStars.length);
    // 检查有多少星星关联了天文记录
    const starsWithRecords = historicalStars.filter(star => star.recordId);
    console.log("带记录ID的星星数量:", starsWithRecords.length);
    
    // 检查每个带记录ID的星星是否能找到对应记录
    starsWithRecords.forEach(star => {
      const found = records.find(r => r.id === star.recordId);
      console.log(`星星 ${star.chineseName || star.name} (ID: ${star.recordId}): ${found ? '找到记录' : '未找到记录'}`);
    });
  }, [records]);
  
  // 选择星星时查找相关天象记录
  const selectedRecord = useMemo(() => {
    if (!selectedStar?.recordId) return undefined;
    
    const record = records.find(r => r.id === selectedStar.recordId);
    console.log("查找记录:", selectedStar.recordId, "找到:", record ? "是" : "否");
    
    // 如果没找到记录，尝试模糊匹配
    if (!record && selectedStar.recordId) {
      console.log("尝试模糊匹配记录ID:", selectedStar.recordId);
      // 尝试部分匹配，比如"solar-2"可能在数据中是"solar-02"
      const partialMatch = records.find(r => 
        r.id.includes(selectedStar.recordId || '') || 
        (selectedStar.recordId && r.id.includes(selectedStar.recordId))
      );
      
      if (partialMatch) {
        console.log("模糊匹配成功:", partialMatch.id);
        return partialMatch;
      }
    }
    
    return record;
  }, [selectedStar, records]);
  
  // 处理星体点击的简化逻辑
  const handleStarClick = (star: Star) => {
    console.log("主组件接收到星体点击:", star.id);
    
    // 立即设置选中的星星
    setSelectedStar(star);
    setShowInfoPanel(true);
    
    // 触发外部回调
    if (onSelectStar) {
      onSelectStar(star);
    }
  };
  
  // 处理关闭信息面板
  const handleCloseInfo = () => {
    console.log("关闭信息面板");
    setShowInfoPanel(false);
    setSelectedStar(null);
  };
  
  const toggleHistoricalView = () => {
    setShowHistoricalOnly(!showHistoricalOnly);
  };
  
  // 在组件挂载时添加全局事件监听
  useEffect(() => {
    // 创建监听函数
    const handleGlobalStarClick = (event: any) => {
      const { star } = event.detail;
      console.log("捕获到全局星体点击事件:", star.id);
      handleStarClick(star);
    };
    
    // 添加事件监听
    document.addEventListener('starClick', handleGlobalStarClick);
    
    // 清理函数
    return () => {
      document.removeEventListener('starClick', handleGlobalStarClick);
    };
  }, []);
  
  return (
    <div className="w-full h-full flex">
      {/* 左侧: 星空3D视图区域 */}
      <div className="w-3/5 h-full relative border-r border-ancient-gold/30">
        {/* 控制面板 */}
        <div className="absolute top-4 right-4 z-[100] flex flex-col space-y-2">
          <button
            onClick={toggleHistoricalView}
            className="bg-ancient-dark bg-opacity-70 hover:bg-ancient-gold text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            {showHistoricalOnly ? '显示所有星星' : '仅显示历史星象'}
          </button>
        </div>
        
        {/* 交互提示 - 在没有选中星体时显示 */}
        {!selectedStar && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm z-[100] animate-pulse">
            点击星体查看详细信息 • 拖动旋转视角 • 滚轮缩放
          </div>
        )}
        
        {/* 星体高亮指示器 - 当有选中星体时 */}
        {selectedStar && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[50] pointer-events-none">
            <div className="w-20 h-20 rounded-full border-2 border-ancient-gold animate-ping opacity-70"></div>
          </div>
        )}
        
        {/* VR模式按钮 */}
        <div className="absolute bottom-6 right-6 z-[100]">
          <Link href="/vr-experience">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-lg hover:bg-black/60 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>进入VR模式</span>
            </motion.button>
          </Link>
        </div>
        
        {/* ThreeJS Canvas */}
        <Canvas
          shadows
          className="bg-black"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 300], fov: 45 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#000000'));
            gl.setPixelRatio(window.devicePixelRatio);
          }}
        >
          {/* 增强环境光，使星星更明显 */}
          <ambientLight intensity={0.2} />
          {/* 调整雾的范围，使远处的星星更可见 */}
          <fog attach="fog" color="#000000" near={150} far={500} />
          
          {/* 增加背景星星数量和亮度 */}
          <Stars
            radius={300}
            depth={150}
            count={2000}
            factor={3}
            saturation={0.7}
            fade
            speed={0.5}
          />
          
          {/* 相机控制 */}
          <CameraController initialPosition={initialPosition} />
          
          {/* 星座连线 - 传递当前选择的朝代 */}
          <ConstellationLines dynasty={dynasty} />
          
          {/* 渲染星星 - 确保所有星星都能被点击 */}
          {filteredStars
            .filter(star => !showHistoricalOnly || star.dynasty)
            .map(star => (
              <StarPoint
                key={star.id}
                star={star}
                selected={selectedStar?.id === star.id}
                onClick={() => handleStarClick(star)}
                showLabel={!!star.dynasty}
              />
            ))}
        </Canvas>
      </div>

      {/* 右侧: 交互信息面板 */}
      <div className="w-2/5 h-full bg-black/95 backdrop-blur-xl overflow-auto">
        {selectedStar ? (
          <div className="h-full p-6 text-white">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">
                {selectedStar.id.includes('supernova') ? '💥' : 
                 selectedStar.id.includes('comet') ? '☄️' : 
                 selectedStar.id.includes('eclipse') ? '🌓' : 
                 selectedStar.id.includes('meteor') ? '💫' : 
                 selectedStar.id.includes('venus') || selectedStar.id.includes('planet') ? '🪐' : '⭐'}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-ancient-gold">
                  {selectedStar.chineseName || selectedStar.name}
                </h3>
                {selectedStar.chineseName && selectedStar.name !== selectedStar.chineseName && (
                  <p className="text-sm font-normal opacity-70">
                    西方名称: {selectedStar.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* 视觉分隔线 */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-ancient-gold/50 to-transparent mb-6"></div>
            
            <div className="space-y-6">
              {selectedStar.dynasty && (
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">朝代</h4>
                  <p className="font-medium text-lg">{selectedStar.dynasty}</p>
                </div>
              )}
              
              {selectedRecord && (
                <>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">记录日期</h4>
                    <p className="font-medium">{selectedRecord.date}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">史料来源</h4>
                    <p className="font-medium">{selectedRecord.source}</p>
                  </div>
                  
                  {selectedRecord.accuracy && (
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">准确性评分</h4>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-ancient-gold h-2.5 rounded-full" style={{ width: `${selectedRecord.accuracy}%` }}></div>
                      </div>
                      <p className="text-xs mt-1 text-right">{selectedRecord.accuracy}%</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">史料记载</h4>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">{selectedRecord.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">科学价值</h4>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">{selectedRecord.significance}</p>
                  </div>
                </>
              )}
              
              {!selectedRecord && selectedStar.dynasty && (
                <>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">史料来源</h4>
                    <p className="font-medium">古代星表记录</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">星体信息</h4>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">这是一颗在{selectedStar.dynasty}被记录的重要天体，中文名为"{selectedStar.chineseName || selectedStar.name}"。它在古代天文观测中具有重要意义，是传统星象体系的一部分。</p>
                  </div>
                </>
              )}
              
              <div>
                <h4 className="text-sm uppercase tracking-wider text-ancient-gold/70 mb-2">历史背景</h4>
                <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">
                  {selectedStar.dynasty ? 
                    (() => {
                      const dynastyInfo: Record<string, string> = {
                        '商朝': '殷商时期是中国青铜文明的鼎盛时期，甲骨文记载了大量天文观测。',
                        '周朝': '西周礼制重视天文观测，《诗经》《尚书》中有不少天象记载。',
                        '春秋时期': '这一时期的《春秋》详细记录了日食等天象，反映了初步的天文历法知识。',
                        '战国时期': '百家争鸣时期，天文观测方法更加多样，出现了多种宇宙模型。',
                        '秦朝': '秦统一度量衡，对天文观测影响深远，但相关记录较少。',
                        '西汉': '司马迁的《史记·天官书》奠定了中国古代天文学的基础。',
                        '东汉': '张衡发明浑天仪，提出了精确的宇宙模型。',
                        '三国': '天文学家陈卓修订历法，发展了天文观测技术。',
                        '晋朝': '西晋时期虽然政局动荡，但天文观测仍在继续。',
                        '南北朝': '祖冲之改进历法，提高了天文观测的精度。',
                        '隋朝': '大业历颁布，促进了天文历法的发展。',
                        '唐朝': '唐太宗时期设立了专门的司天监，一丝不苟地记录天象。',
                        '五代十国': '政局动荡时期，天文观测出现一定程度下滑。',
                        '北宋': '苏颂制造水运仪象台，创建了精确的天文观测系统。',
                        '南宋': '虽然半壁江山，但天文观测的传统不减。',
                        '元朝': '回回历法传入，融合中西天文学知识。',
                        '明朝': '徐光启引入西方天文知识，促进了中西天文学交流。',
                        '清朝': '康熙时期著《历象考成》，集大成者。'
                      };
                      return dynastyInfo[selectedStar.dynasty] || '这一时期的天文学家精心记录天象，为后世留下了宝贵资料。';
                    })()
                  : "这颗星体在古代天文学中有记载，但详细信息已经失传。"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // 未选中星体时显示欢迎界面
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="text-5xl mb-6 animate-pulse">✨</div>
            <h2 className="text-3xl font-bold text-ancient-gold mb-4">星汉灿烂</h2>
            <h3 className="text-xl text-white/80 mb-8">中国古代天文可视化系统</h3>
            
            <div className="w-16 h-0.5 bg-ancient-gold/50 my-6"></div>
            
            <p className="text-white/70 mb-8 max-w-md">
              请点击左侧星空中的星体，探索中国古代天文学的璀璨历史。
              每颗星体都承载着丰富的历史记忆与科学价值。
            </p>
            
            <div className="space-y-4 w-full max-w-sm">
              <div className="flex items-center bg-black/30 p-3 rounded-lg border border-gray-800">
                <span className="text-ancient-gold mr-3">⭐</span>
                <div className="text-left">
                  <h4 className="text-sm font-medium text-white">恒星</h4>
                  <p className="text-xs text-white/60">古代观测与命名的恒星</p>
                </div>
              </div>
              
              <div className="flex items-center bg-black/30 p-3 rounded-lg border border-gray-800">
                <span className="text-ancient-gold mr-3">🪐</span>
                <div className="text-left">
                  <h4 className="text-sm font-medium text-white">行星</h4>
                  <p className="text-xs text-white/60">古人对五大行星的观测记录</p>
                </div>
              </div>
              
              <div className="flex items-center bg-black/30 p-3 rounded-lg border border-gray-800">
                <span className="text-ancient-gold mr-3">☄️</span>
                <div className="text-left">
                  <h4 className="text-sm font-medium text-white">彗星与特殊天象</h4>
                  <p className="text-xs text-white/60">历史上记载的特殊天文现象</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarrySky; 