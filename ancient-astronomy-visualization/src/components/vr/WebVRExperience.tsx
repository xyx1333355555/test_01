import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useTexture, 
  Environment, 
  Stars, 
  Text, 
  Float, 
  Sparkles,
  Html,
  useGLTF,
  Center,
  MeshDistortMaterial,
  useScroll,
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
// 暂时注释后期处理导入
// import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Euler, Vector3 } from 'three';

interface WebVRExperienceProps {
  activeTab?: string;
  setVrMode: (mode: boolean) => void;
}

// 简单的设备检测函数，避免使用react-device-detect
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    
    setIsMobile(checkMobile());
  }, []);
  
  return isMobile;
};

// 图标及信息点组件
const InfoPoint = ({ position, label, onClick, hovered, setHovered }: any) => {
  const pointRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (pointRef.current) {
      pointRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={pointRef}
        onClick={onClick}
        onPointerOver={() => setHovered(label)}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={hovered === label ? "#B4846C" : "#ffffff"} emissive={hovered === label ? "#B4846C" : "#666666"} />
      </mesh>
      {hovered === label && (
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#00000099" transparent opacity={0.8} side={THREE.DoubleSide} />
          <Text 
            position={[0, 0, 0.01]} 
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </mesh>
      )}
    </group>
  );
};

// 处理纹理加载，优先使用本地图像，失败时使用API生成的占位图
const useBackgroundTexture = (localPath: string, placeholderName: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 尝试加载本地图像
    const loader = new THREE.TextureLoader();
    loader.load(
      localPath,
      (loadedTexture) => {
        setTexture(loadedTexture);
        setError(false);
      },
      undefined,
      () => {
        // 如果本地图像加载失败，设置错误状态
        setError(true);
      }
    );
  }, [localPath]);

  // 如果本地图像加载失败，使用API生成的占位图
  const fallbackTexture = useTexture(error ? `/api/placeholder/vr-image?name=${placeholderName}` : '/api/placeholder/vr-image?name=default');

  return texture || fallbackTexture;
};

// 粒子效果组件
const ParticleField = ({ count = 500, color = '#ffcc88' }) => {
  const positions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 30, // x
        (Math.random() - 0.5) * 30, // y
        (Math.random() - 0.5) * 30  // z
      );
    }
    return new Float32Array(positions);
  }, [count]);

  const sizes = useMemo(() => {
    const sizes = [];
    for (let i = 0; i < count; i++) {
      sizes.push(Math.random() * 0.5 + 0.1);
    }
    return new Float32Array(sizes);
  }, [count]);

  const particleRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particleRef.current) {
      particleRef.current.rotation.x += 0.0003;
      particleRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        color={color}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 动态星座线条
const ConstellationLines = ({ points, color = '#ffffff', speed = 0.001 }: { points: Float32Array, color?: string, speed?: number }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += speed;
    }
  });
  
  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
};

// 根据主题创建星座线条数据
const createConstellationData = (theme: string) => {
  switch (theme) {
    case 'calendar':
      return new Float32Array([
        -5, 2, -10, -3, 4, -9, -1, 2, -8, 2, 4, -7, 4, 2, -9,
        -5, 2, -10, -6, 0, -8, -4, -2, -7, -1, 2, -8
      ]);
    case 'observation':
      return new Float32Array([
        6, 2, -8, 4, 4, -6, 2, 2, -5, 0, 4, -7, -2, 2, -9,
        -2, 2, -9, -4, 0, -7, -3, -1, -5, -1, -2, -8
      ]);
    case 'scientific':
      return new Float32Array([
        5, 3, -6, 3, 5, -8, 1, 3, -10, -1, 5, -8, -3, 3, -6,
        -3, 3, -6, -5, 1, -8, -3, -1, -9, -1, -3, -7
      ]);
    case 'cosmology':
      return new Float32Array([
        4, 4, -5, 2, 6, -7, 0, 4, -9, -2, 6, -7, -4, 4, -5,
        -4, 4, -5, -5, 2, -3, -4, 0, -1, -2, -2, -3
      ]);
    case 'instruments':
      return new Float32Array([
        5, 1, -8, 3, 3, -6, 1, 1, -4, -1, 3, -6, -3, 1, -8,
        -3, 1, -8, -5, -1, -6, -3, -3, -4, -1, -5, -6
      ]);
    default:
      return new Float32Array([
        -5, 2, -10, -3, 4, -9, -1, 2, -8, 2, 4, -7, 4, 2, -9
      ]);
  }
};

// 飘浮的3D模型
const FloatingObject = ({ position, rotationSpeed = 0.01, theme }: { position: [number, number, number], rotationSpeed?: number, theme: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed * 0.5;
      meshRef.current.rotation.y += rotationSpeed;
      // 添加轻微的浮动效果
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  const getGeometry = () => {
    switch (theme) {
      case 'calendar':
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case 'observation':
        return <dodecahedronGeometry args={[1, 0]} />;
      case 'scientific':
        return <octahedronGeometry args={[1, 0]} />;
      case 'cosmology':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'instruments':
        return <cylinderGeometry args={[0.5, 0.5, 2, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {getGeometry()}
      <MeshDistortMaterial
        color={theme === 'calendar' ? '#B4846C' : 
              theme === 'observation' ? '#7C6C55' : 
              theme === 'scientific' ? '#6B5C45' : 
              theme === 'cosmology' ? '#4A4236' : 
              '#D3C5B6'}
        speed={0.5}
        distort={0.3}
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
};

// 信息浮层组件
const InfoOverlay = ({ activeTab, setHoveredItem, hoveredItem }: { activeTab: string, setHoveredItem: (item: string | null) => void, hoveredItem: string | null }) => {
  // 根据选中的标签获取相关信息
  const getTabInfo = () => {
    switch(activeTab) {
      case 'calendar':
        return {
          title: '中国古代历法',
          description: '通过VR体验探索古代历法的精度和演变',
          facts: [
            '四分历：回归年长度为365.25日',
            '授时历：世界最精确的古代历法，回归年长度为365.2425日',
            '古代历法为农业社会提供了关键的季节预测'
          ]
        };
      case 'observation':
        return {
          title: '天文观测方法',
          description: '体验古代天文学家观测天象的方式',
          facts: [
            '简仪：测量天体高度的基本工具',
            '浑天仪：精确测量天体位置的复杂仪器',
            '候台：古代天文台，用于持续观测天象'
          ]
        };
      case 'scientific':
        return {
          title: '天文记录的科学价值',
          description: '探索古代天文记录对现代科学的贡献',
          facts: [
            '超新星记录：帮助现代天文学研究恒星演化',
            '日食月食记录：用于验证地球自转减速率',
            '彗星记录：提供长期彗星轨道的宝贵数据'
          ]
        };
      case 'cosmology':
        return {
          title: '宇宙观念的演变',
          description: '了解中国古代对宇宙本质的理解',
          facts: [
            '盖天说：天圆地方，天如盖笠',
            '浑天说：天如鸡卵，地如卵中黄',
            '宣夜说：宇宙空旷无限，天体自悬'
          ]
        };
      case 'instruments':
        return {
          title: '古代天文仪器',
          description: '近距离观察精密的古代天文仪器',
          facts: [
            '浑天仪：模拟天球运转',
            '简仪：测量天体高度',
            '圭表：测量太阳影长变化'
          ]
        };
      default:
        return {
          title: '中国古代天文学',
          description: '沉浸式体验古代天文成就',
          facts: ['选择一个主题开始探索']
        };
    }
  };

  const info = getTabInfo();

  return (
    <motion.div 
      className="absolute top-6 left-6 bg-black/40 backdrop-blur-md p-4 rounded-lg text-white max-w-xs"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-2">{info.title}</h3>
      <p className="text-sm mb-3">{info.description}</p>
      <div className="space-y-1">
        {info.facts.map((fact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-xs bg-white/10 p-2 rounded"
          >
            {fact}
          </motion.div>
        ))}
      </div>
      {hoveredItem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-[#B4846C]/30 p-2 rounded-lg text-xs"
        >
          <strong>当前查看：</strong> {hoveredItem}
        </motion.div>
      )}
    </motion.div>
  );
};

// 场景效果组件 - 暂时禁用
const SceneEffects = () => {
  // 移除后期处理效果
  return null;
};

// 增强日历/历法场景
const CalendarScene = ({ setHoveredItem }: any) => {
  const [hovered, setHovered] = useState(null);
  const texture = useBackgroundTexture('/images/vr/ancient-calendar-vr.jpg', 'ancient-calendar-vr');
  const constellationData = createConstellationData('calendar');
  
  useEffect(() => {
    setHoveredItem(hovered);
  }, [hovered, setHoveredItem]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      
      {/* 粒子效果 */}
      <ParticleField count={2000} color="#ffcc88" />
      
      {/* 星座线条 */}
      <ConstellationLines points={constellationData} color="#B4846C" speed={0.0005} />
      
      {/* 3D模型 */}
      <group>
        <FloatingObject position={[3, 1, -5]} rotationSpeed={0.005} theme="calendar" />
        <FloatingObject position={[-4, -1, -6]} rotationSpeed={0.008} theme="calendar" />
      </group>
      
      {/* 闪烁效果 */}
      <Sparkles count={100} scale={20} size={1} speed={0.3} opacity={0.5} color="#fff8e0" />
      
      {/* 信息点 */}
      <InfoPoint 
        position={[5, 0, -10]} 
        label="四分历：精度达到99.8%" 
        onClick={() => console.log('四分历')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[-8, 2, -8]} 
        label="授时历：世界最精确的古代历法" 
        onClick={() => console.log('授时历')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[10, 3, 2]} 
        label="太初历：提出了二十四节气" 
        onClick={() => console.log('太初历')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
    </>
  );
};

// 观测场景
const ObservationScene = ({ setHoveredItem }: any) => {
  const [hovered, setHovered] = useState(null);
  const texture = useBackgroundTexture('/images/vr/ancient-observation-vr.jpg', 'ancient-observation-vr');
  
  useEffect(() => {
    setHoveredItem(hovered);
  }, [hovered, setHoveredItem]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <InfoPoint 
        position={[8, 1, -8]} 
        label="目测法：古代观星的基本方法" 
        onClick={() => console.log('目测法')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[-5, 3, -10]} 
        label="筒测法：提高了观测精度" 
        onClick={() => console.log('筒测法')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[3, 0, 10]} 
        label="浑仪：精确测量天体位置" 
        onClick={() => console.log('浑仪')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
    </>
  );
};

// 科学价值场景
const ScientificValueScene = ({ setHoveredItem }: any) => {
  const [hovered, setHovered] = useState(null);
  const texture = useBackgroundTexture('/images/vr/scientific-value-vr.jpg', 'scientific-value-vr');
  
  useEffect(() => {
    setHoveredItem(hovered);
  }, [hovered, setHoveredItem]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <InfoPoint 
        position={[7, 2, -9]} 
        label="日食记录：世界最早的天文记录" 
        onClick={() => console.log('日食记录')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[-9, 1, -6]} 
        label="超新星记录：为现代天文学提供参考" 
        onClick={() => console.log('超新星记录')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[5, -1, 8]} 
        label="彗星记录：完整记载了哈雷彗星历次回归" 
        onClick={() => console.log('彗星记录')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
    </>
  );
};

// 宇宙观念场景
const CosmologyScene = ({ setHoveredItem }: any) => {
  const [hovered, setHovered] = useState(null);
  const texture = useBackgroundTexture('/images/vr/cosmology-vr.jpg', 'cosmology-vr');
  
  useEffect(() => {
    setHoveredItem(hovered);
  }, [hovered, setHoveredItem]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <InfoPoint 
        position={[6, 3, -8]} 
        label="盖天说：天如盖笠，地如覆盘" 
        onClick={() => console.log('盖天说')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[-8, 1, -7]} 
        label="浑天说：天如鸡卵，地如卵中黄" 
        onClick={() => console.log('浑天说')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[5, -2, 9]} 
        label="宣夜说：认为宇宙空旷无限" 
        onClick={() => console.log('宣夜说')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
    </>
  );
};

// 天文仪器场景
const InstrumentsScene = ({ setHoveredItem }: any) => {
  const [hovered, setHovered] = useState(null);
  const texture = useBackgroundTexture('/images/vr/instruments-vr.jpg', 'instruments-vr');
  
  useEffect(() => {
    setHoveredItem(hovered);
  }, [hovered, setHoveredItem]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <InfoPoint 
        position={[8, 2, -7]} 
        label="浑天仪：模拟天球运转的仪器" 
        onClick={() => console.log('浑天仪')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[-7, 0, -8]} 
        label="简仪：测量天体高度的仪器" 
        onClick={() => console.log('简仪')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
      <InfoPoint 
        position={[6, -1, 8]} 
        label="浑象：天体运行模型" 
        onClick={() => console.log('浑象')} 
        hovered={hovered} 
        setHovered={setHovered} 
      />
    </>
  );
};

// 创建一个新的SkyBox组件用于渲染360度全景星空
const SkyBox = ({ texture }: { texture: string }) => {
  const [skyTexture, setSkyTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(texture, (loadedTexture) => {
      loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.minFilter = THREE.LinearFilter;
      setSkyTexture(loadedTexture);
    });
  }, [texture]);
  
  if (!skyTexture) return null;
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
    </mesh>
  );
};

// 在现有代码基础上添加一个VR入口弹窗组件
const VREntryModal = ({ onClose, onStart }: { onClose: () => void, onStart: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-800 bg-opacity-90 border border-ancient-gold/40 rounded-xl p-6 max-w-md mx-4">
        <h2 className="text-2xl font-serif text-ancient-gold text-center mb-6">沉浸式古代天文VR体验</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center bg-black/30 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-white text-center text-sm">电脑：用鼠标拖拽查看星场景</p>
          </div>
          
          <div className="flex flex-col items-center bg-black/30 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-white text-center text-sm">手机：转动设备查看全景</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center bg-black/30 p-4 rounded-lg mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p className="text-white text-center text-sm">点击白色光点查看详情</p>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            返回常规视图
          </button>
          <button 
            onClick={onStart}
            className="px-4 py-2 bg-ancient-gold text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            开始体验
          </button>
        </div>
      </div>
    </div>
  );
};

// 加入类型定义
interface VRObject {
  id: string;
  name: string;
  type: string;
  description: string;
  details: {
    history: string;
    purpose: string;
    usage: string;
    significance: string;
  };
  dynasty?: string;
  imageUrl?: string;
}

// 修改天文台数据，为每个朝代添加特定描述
const observatoryData = {
  name: "中国古代天文台",
  dynasties: [
    { 
      id: "han", 
      name: "汉朝天文台", 
      year: "公元前202-公元220",
      description: "汉代天文台是中国古代天文学发展的重要阶段，以灵台为主要观测场所。汉代天文学家张衡发明了浑天仪等重要天文仪器，并编制了《灵宪》等著名天文著作。"
    },
    { 
      id: "tang", 
      name: "唐朝天文台", 
      year: "618-907",
      description: "唐朝时期，天文观测技术取得了显著进步，建造了规模宏大的观星台，并改进了多种天文仪器。《大衍历》和《麟德历》等历法的制定反映了当时天文学的高度成就。"
    },
    { 
      id: "song", 
      name: "宋朝天文台", 
      year: "960-1279",
      description: "宋朝天文学达到了中国古代天文学的巅峰，北宋时期由苏颂主持建造的水运仪象台是当时世界上最先进的天文钟，《新仪象法要》详细记载了其构造和原理。"
    },
    { 
      id: "yuan", 
      name: "元朝天文台", 
      year: "1271-1368",
      description: "元朝时期，中西方天文学开始交流，伊斯兰天文学传入中国，郭守敬主持修订了《授时历》，其精度达到了中国古代历法的最高水平。"
    },
    { 
      id: "ming", 
      name: "明朝天文台", 
      year: "1368-1644",
      description: "明朝设立钦天监负责天文观测和历法编制，徐光启与利玛窦合作翻译《几何原本》，开启了中西方天文学知识的系统性交流。"
    },
    { 
      id: "qing", 
      name: "清朝天文台", 
      year: "1644-1912",
      description: "清朝的天文台以北京古观象台为代表，收藏了多件精美的天文仪器，融合了中国传统与西方技术。康熙年间编纂的《历象考成》是东西方天文学融合的重要成果。"
    }
  ],
  defaultDynasty: "han"
}

// 按朝代分类的天文仪器数据
const dynastyInstruments = {
  han: [
    {
      id: "armillary-sphere-han",
      name: "浑天仪",
      type: "instrument",
      description: "汉代张衡改进的浑天仪，用于测量天体位置和观测天象变化。",
      details: {
        history: "浑天仪起源于战国时期，西汉时期张衡对其进行了重大改进，使其成为精确的天文观测仪器。",
        purpose: "用于测量天体的赤经、赤纬等坐标，确定天体位置，为历法制定提供基础数据。",
        usage: "观测者通过调整仪器上的环，瞄准特定天体，读取刻度来确定天体位置。",
        significance: "张衡的浑天仪是中国古代天文学的重要里程碑，开创了精确测量天体位置的新时代。"
      },
      dynasty: "汉朝",
      imageUrl: "/images/instruments/armillary-sphere-han.jpg"
    },
    {
      id: "gnomon-han",
      name: "测影台",
      type: "instrument",
      description: "汉代用于测量日影长度的高台，用于确定节气和编制历法。",
      details: {
        history: "测影台在汉代得到广泛应用，灵台上设置了专门的测影设施。",
        purpose: "通过观测太阳投射的影子变化，确定季节更替、节气划分以及正午时刻。",
        usage: "在正午时分测量表杆(表)投下的影子长度，记录全年变化。",
        significance: "测影台的观测数据为汉代《太初历》的编制提供了重要依据。"
      },
      dynasty: "汉朝",
      imageUrl: "/images/instruments/gnomon-han.jpg"
    },
    {
      id: "bronze-mirror-han",
      name: "天文铜镜",
      type: "instrument",
      description: "汉代用于观象授时和象征天文的铜镜，镜面刻有天文图案。",
      details: {
        history: "天文铜镜在汉代被广泛制作，反映了汉代人对宇宙的认知。",
        purpose: "既有实用功能，也具有天文教育和礼仪象征意义。",
        usage: "铜镜上的星象图案用于简易的天文教育和文化传播。",
        significance: "天文铜镜体现了天文知识在汉代社会的普及程度和重要性。"
      },
      dynasty: "汉朝",
      imageUrl: "/images/instruments/bronze-mirror-han.jpg"
    }
  ],
  tang: [
    {
      id: "armillary-sphere-tang",
      name: "浑天仪",
      type: "instrument",
      description: "唐代改进的浑天仪，用于精确测量天体位置和制定历法。",
      details: {
        history: "唐代浑天仪在前代基础上进行了精度提升，《大衍历》和《麟德历》的制定都依赖于它的观测数据。",
        purpose: "用于测量天体的赤经、赤纬等坐标，确定天体位置，为历法制定提供基础数据。",
        usage: "观测者通过调整仪器上的环，瞄准特定天体，读取刻度来确定天体位置。",
        significance: "唐代浑天仪的精度提高，反映了唐朝天文学的发展水平。"
      },
      dynasty: "唐朝",
      imageUrl: "/images/instruments/armillary-sphere-tang.jpg"
    },
    {
      id: "gnomon-tang",
      name: "圭表",
      type: "instrument",
      description: "唐代用于测量日影长度的仪器，具有更高的精度。",
      details: {
        history: "唐代圭表在设计上更加精密，测量精度得到提升。",
        purpose: "通过观测太阳投射的影子变化，确定季节更替、节气划分以及正午时刻。",
        usage: "立竿（表）于平地，观察其影子（圭）的长度变化，记录不同时间的数据。",
        significance: "唐代圭表的观测数据为唐朝历法制定提供了重要依据。"
      },
      dynasty: "唐朝",
      imageUrl: "/images/instruments/gnomon-tang.jpg"
    },
    {
      id: "celestial-globe-tang",
      name: "天球仪",
      type: "instrument",
      description: "唐代用于展示星空和教学的球形天文仪器。",
      details: {
        history: "天球仪在唐代被用于天文教育和星象展示。",
        purpose: "用于直观展示天球上星辰的位置和运动规律。",
        usage: "转动天球仪模拟天球的运转，展示不同时间的星象。",
        significance: "天球仪帮助人们理解星象运动规律，促进了天文知识的传播。"
      },
      dynasty: "唐朝",
      imageUrl: "/images/instruments/celestial-globe-tang.jpg"
    }
  ],
  song: [
    {
      id: "water-clock",
      name: "水运仪象台",
      type: "instrument",
      description: "宋代苏颂设计的机械天文钟，通过水力驱动模拟天体运行。",
      details: {
        history: "水运仪象台在北宋时期由苏颂和韩公廉等人设计建造，代表了古代中国机械天文钟的最高成就。",
        purpose: "自动显示天象变化、计时报时，并展示天体运行规律，为天文观测和时间测量提供参考。",
        usage: "通过水力驱动机械装置，带动天球仪运转，显示天体位置变化，同时提供准确的时间信息。",
        significance: "水运仪象台综合了天文学、机械学和水力学知识，是宋代科技的集大成者，被誉为中国古代'天文钟'的杰作。"
      },
      dynasty: "宋朝",
      imageUrl: "/images/instruments/water-clock.jpg"
    },
    {
      id: "simplified-armillary-sphere",
      name: "简仪",
      type: "instrument",
      description: "宋代沈括发明的简化版浑天仪，便于携带和使用。",
      details: {
        history: "简仪是宋代科学家沈括在《梦溪笔谈》中记载的一种便携式天文观测仪器。",
        purpose: "用于野外和旅行中进行简便的天文观测。",
        usage: "通过简化的结构，仍能进行基本的天体位置测量。",
        significance: "简仪的发明体现了宋代科学家对实用性的追求和创新精神。"
      },
      dynasty: "宋朝",
      imageUrl: "/images/instruments/simplified-armillary-sphere.jpg"
    },
    {
      id: "star-map-song",
      name: "天文图",
      type: "instrument",
      description: "宋代绘制的详细星图，记录了恒星位置和星座分布。",
      details: {
        history: "宋代出现了多种详细的天文图，如《淳祐天文图》，记录了当时可观测的恒星。",
        purpose: "用于记录和教学天文知识，指导天文观测活动。",
        usage: "根据图上标注对照夜空，识别星座和恒星。",
        significance: "宋代天文图的精确度高，为后世天文学研究提供了重要史料。"
      },
      dynasty: "宋朝",
      imageUrl: "/images/instruments/star-map-song.jpg"
    }
  ],
  yuan: [
    {
      id: "simplified-instrument",
      name: "简仪",
      type: "instrument",
      description: "元代天文学家郭守敬改进的观测仪器，更加精确简便。",
      details: {
        history: "简仪是郭守敬在元代创制的一种改进型观测仪器，是授时历观测系统的重要组成部分。",
        purpose: "用于精确测量天体高度和地理位置，为制定授时历提供数据。",
        usage: "通过精确的刻度和瞄准装置，测量天体的高度角和方位角。",
        significance: "简仪的精度比前代仪器有显著提高，对《授时历》的编制起到关键作用。"
      },
      dynasty: "元朝",
      imageUrl: "/images/instruments/simplified-instrument.jpg"
    },
    {
      id: "shadow-definer",
      name: "景符",
      type: "instrument",
      description: "元代用于测定日影方向的仪器，是郭守敬观测系统的组成部分。",
      details: {
        history: "景符是郭守敬设计的专门用于测定日影方向的仪器。",
        purpose: "用于确定正午时刻和测量太阳方位。",
        usage: "将仪器置于水平面上，观察阳光投影的位置和方向。",
        significance: "景符提高了日影观测的精度，为《授时历》提供了重要数据。"
      },
      dynasty: "元朝",
      imageUrl: "/images/instruments/shadow-definer.jpg"
    },
    {
      id: "celestial-globe-yuan",
      name: "浑象",
      type: "instrument",
      description: "元代改进的天球仪，表面标注了更多的星官和恒星。",
      details: {
        history: "元代浑象在前代基础上增加了更多星官标记，反映了天文观测的进步。",
        purpose: "用于展示天球星象和教学示范。",
        usage: "转动浑象可模拟天球运转，展示不同时间的星空景象。",
        significance: "元代浑象融合了中国传统星官体系和伊斯兰天文学影响，代表了文化交流成果。"
      },
      dynasty: "元朝",
      imageUrl: "/images/instruments/celestial-globe-yuan.jpg"
    }
  ],
  ming: [
    {
      id: "equatorial-armilla",
      name: "赤道经纬仪",
      type: "instrument",
      description: "明代改进的天文观测仪器，采用赤道坐标系进行观测。",
      details: {
        history: "赤道经纬仪在明代钦天监中得到应用，是明代天文观测的重要工具。",
        purpose: "用于精确测量天体在赤道坐标系中的位置。",
        usage: "通过调整仪器对准天体，读取赤经和赤纬刻度。",
        significance: "赤道经纬仪反映了明代天文测量技术的发展。"
      },
      dynasty: "明朝",
      imageUrl: "/images/instruments/equatorial-armilla.jpg"
    },
    {
      id: "quadrant-ming",
      name: "象限仪",
      type: "instrument",
      description: "明代传入的西方天文仪器，用于测量天体高度角。",
      details: {
        history: "象限仪通过明末西方传教士引入中国，为明代天文观测带来新技术。",
        purpose: "主要用于精确测量天体的高度角。",
        usage: "通过瞄准装置对准天体，读取刻度盘上的角度。",
        significance: "象限仪的引入代表了中西方科技交流的重要一步。"
      },
      dynasty: "明朝",
      imageUrl: "/images/instruments/quadrant-ming.jpg"
    },
    {
      id: "star-map-ming",
      name: "天文图志",
      type: "instrument",
      description: "明代编绘的星图和天文著作，结合了传统和西方知识。",
      details: {
        history: "明代编绘了多种天文图志，如《天文大成》，融合了传统知识和西方传入的新概念。",
        purpose: "用于记录天文知识、教学和指导观测。",
        usage: "作为天文学参考资料和教学工具使用。",
        significance: "明代天文图志反映了中西方天文学知识的交流与融合。"
      },
      dynasty: "明朝",
      imageUrl: "/images/instruments/star-map-ming.jpg"
    }
  ],
  qing: [
    {
      id: "celestial-globe-qing",
      name: "天体仪",
      type: "instrument",
      description: "清代制造的精美天球仪，融合了中西方技术。",
      details: {
        history: "清代天体仪由宫廷工匠和西方传教士合作制造，收藏于北京古观象台。",
        purpose: "用于展示天体位置和运行规律，兼具观赏和教学价值。",
        usage: "转动仪器可模拟天球运转，展示天体位置变化。",
        significance: "清代天体仪代表了中西方天文技术的融合和清代精湛的工艺水平。"
      },
      dynasty: "清朝",
      imageUrl: "/images/instruments/celestial-globe-qing.jpg"
    },
    {
      id: "equatorial-telescope",
      name: "赤道仪",
      type: "instrument",
      description: "清代引入的西方光学天文仪器，可进行精确观测。",
      details: {
        history: "赤道仪在清代康熙年间由西方传教士引入中国，安装于北京古观象台。",
        purpose: "用于精确观测和跟踪天体。",
        usage: "通过调整仪器跟随天体运动，进行长时间观测。",
        significance: "赤道仪的引入标志着中国天文观测技术进入光学时代。"
      },
      dynasty: "清朝",
      imageUrl: "/images/instruments/equatorial-telescope.jpg"
    },
    {
      id: "azimuth-theodolite",
      name: "地平经纬仪",
      type: "instrument",
      description: "清代用于测量天体方位角和高度角的精密仪器。",
      details: {
        history: "地平经纬仪是清代观象台的重要仪器，由中西方工匠合作铸造。",
        purpose: "用于精确测量天体在地平坐标系中的位置。",
        usage: "通过调整仪器瞄准天体，读取方位角和高度角刻度。",
        significance: "地平经纬仪体现了清代天文测量的高精度和中西方技术的融合。"
      },
      dynasty: "清朝",
      imageUrl: "/images/instruments/azimuth-theodolite.jpg"
    }
  ]
};

// 修改观测活动数据，按朝代分类
const dynastyActivities = {
  han: [
    {
      id: "solar-observation-han",
      name: "日影测量",
      description: "汉代天文学家使用测影台测量太阳影长，确定节气和历法。",
      procedure: "1. 在测影台上竖立表杆\n2. 正午时刻测量影长\n3. 记录数据并与历年记录比对\n4. 根据影长变化确定节气"
    },
    {
      id: "star-mapping-han",
      name: "星象绘制",
      description: "汉代天文学家通过观测绘制星图，记录天象变化。",
      procedure: "1. 夜间架设浑天仪\n2. 观测星辰位置\n3. 记录特定星宿的位置\n4. 绘制星图并记录变化"
    }
  ],
  tang: [
    {
      id: "solar-observation-tang",
      name: "圭表测影",
      description: "唐代天文学家使用圭表测量太阳影长，编制精确历法。",
      procedure: "1. 校准圭表位置\n2. 在正午时刻观测影长\n3. 记录数据并与历年记录比对\n4. 确定季节变化和节气划分"
    },
    {
      id: "star-mapping-tang",
      name: "星象绘制",
      description: "通过浑天仪观测星象位置，绘制详细星图。",
      procedure: "1. 夜间架设浑天仪\n2. 调整环轮对准目标星体\n3. 记录坐标位置\n4. 根据多次观测结果绘制星图"
    }
  ],
  song: [
    {
      id: "mechanical-demonstration",
      name: "机械演示",
      description: "使用水运仪象台展示天体运行和自动报时功能。",
      procedure: "1. 启动水运系统\n2. 观察天象运行模型\n3. 记录显示的天文数据\n4. 验证自动报时功能"
    },
    {
      id: "eclipse-observation-song",
      name: "日食观测",
      description: "宋代天文学家对日食现象进行系统记录和预测。",
      procedure: "1. 准备观测工具和记录材料\n2. 在预测时间进行观测\n3. 记录日食进程和特征\n4. 将观测结果与历法计算比对"
    }
  ],
  yuan: [
    {
      id: "nationwide-observation",
      name: "全国观测网",
      description: "元代郭守敬建立的全国天文观测网络，同步观测天象。",
      procedure: "1. 选定全国观测点\n2. 分发统一的观测仪器\n3. 协调同步观测时间\n4. 汇总各地观测数据编制历法"
    },
    {
      id: "eclipse-prediction-yuan",
      name: "日食预测",
      description: "元代天文学家根据授时历进行精确的日食预测。",
      procedure: "1. 分析历史日食记录\n2. 应用授时历计算方法\n3. 推算可能的日食时间\n4. 发布预测结果并准备观测"
    }
  ],
  ming: [
    {
      id: "western-method",
      name: "西法观测",
      description: "明末利用西方传入的天文仪器和方法进行观测。",
      procedure: "1. 架设西式观测仪器\n2. 按照新方法进行观测\n3. 记录数据并与传统方法比对\n4. 整合东西方观测结果"
    },
    {
      id: "nova-observation",
      name: "新星观测",
      description: "明代天文学家对新出现的恒星进行观测记录。",
      procedure: "1. 发现新星后立即记录位置\n2. 持续观测亮度变化\n3. 绘制新星所在区域图\n4. 编写观测报告呈送朝廷"
    }
  ],
  qing: [
    {
      id: "telescope-observation",
      name: "望远镜观测",
      description: "清代使用光学望远镜进行天体观测。",
      procedure: "1. 安装并校准望远镜\n2. 对准目标天体\n3. 记录观测结果和图像\n4. 与传统观测方法比对"
    },
    {
      id: "calendar-compilation",
      name: "时宪历编纂",
      description: "清代天文学家编纂融合中西方历法的时宪历。",
      procedure: "1. 收集中西方天文数据\n2. 应用数学计算方法\n3. 编制日月五星历表\n4. 汇编成完整历书出版"
    }
  ]
};

// 修改主WebVR组件
const WebVRExperience = ({ activeTab = 'instruments', setVrMode }: WebVRExperienceProps) => {
  const [showModal, setShowModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const isMobile = useIsMobile();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [hasDeviceOrientationPermission, setHasDeviceOrientationPermission] = useState(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  
  // 新增状态管理选中的对象和当前朝代
  const [selectedObject, setSelectedObject] = useState<VRObject | null>(null);
  const [currentDynasty, setCurrentDynasty] = useState(observatoryData.defaultDynasty || "han");
  const [showSimulation, setShowSimulation] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<any>(null);
  
  // 修改仪器选择逻辑
  const getCurrentDynastyInstruments = (dynasty: string) => {
    return dynastyInstruments[dynasty as keyof typeof dynastyInstruments] || dynastyInstruments.tang;
  };

  // 修改活动选择逻辑
  const getCurrentDynastyActivities = (dynasty: string) => {
    return dynastyActivities[dynasty as keyof typeof dynastyActivities] || dynastyActivities.tang;
  };
  
  // 处理朝代切换
  const handleDynastyChange = (dynasty: string) => {
    setCurrentDynasty(dynasty);
    setSelectedObject(null); // 切换朝代时清除选中对象
  };
  
  // 处理点击场景中的对象
  const handleObjectSelect = (objectId: string) => {
    const currentInstruments = getCurrentDynastyInstruments(currentDynasty);
    const object = currentInstruments.find(item => item.id === objectId);
    setSelectedObject(object || null);
    console.log(`选中对象: ${objectId}，朝代: ${currentDynasty}`);
  };
  
  // 开始观测模拟
  const startObservationSimulation = (simulationId: string) => {
    const currentActivities = getCurrentDynastyActivities(currentDynasty);
    const simulation = currentActivities.find(item => item.id === simulationId);
    if (simulation) {
      setCurrentSimulation(simulation);
      setShowSimulation(true);
    }
  };
  
  // 结束观测模拟
  const endSimulation = () => {
    setShowSimulation(false);
    setCurrentSimulation(null);
  };
  
  // 处理开始VR模式
  const handleStartVR = () => {
    setIsVRMode(true);
    setShowModal(false);
    if (setVrMode) setVrMode(true);
    
    // 请求全屏
    requestFullscreen();
  };
  
  // 退出VR模式
  const exitVRMode = () => {
    setIsVRMode(false);
    if (setVrMode) setVrMode(false);
    
    // 退出全屏
    exitFullscreen();
  };
  
  // 请求全屏模式
  const requestFullscreen = () => {
    const elem = fullscreenContainerRef.current;
    if (!elem) return;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  };
  
  // 退出全屏模式
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) { /* Safari */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { /* IE11 */
      (document as any).msExitFullscreen();
    }
  };
  
  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).msFullscreenElement) {
        // 如果退出了全屏，也同时退出VR模式
        if (isVRMode) {
          setIsVRMode(false);
          if (setVrMode) setVrMode(false);
        }
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isVRMode, setVrMode]);
  
  // 鼠标移动处理
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 鼠标离开处理
  const handleMouseLeave = () => {
    setCursorPosition({ x: 0, y: 0 });
  };

  // 触摸事件处理
  const handleTouch = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      setCursorPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  // 请求设备方向权限（仅移动设备）
  const requestDeviceOrientationPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            setHasDeviceOrientationPermission(true);
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(console.error);
    } else {
      // 设备不支持或浏览器已授予权限
      setHasDeviceOrientationPermission(true);
    }
  };

  // 处理设备方向变化
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    setDeviceOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    });
  };

  useEffect(() => {
    // 如果是桌面设备，不需要请求权限
    if (!isMobile) {
      setHasDeviceOrientationPermission(true);
    }

    // 添加事件监听器
    if (hasDeviceOrientationPermission) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      // 移除事件监听器
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [hasDeviceOrientationPermission]);

  return (
    <div ref={fullscreenContainerRef} className="w-full h-full flex overflow-hidden">
      {isVRMode ? (
        // 全屏VR模式
        <div className="w-full h-full relative">
          <Canvas
            shadows
            className="bg-black"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 1.5, 5], fov: 75 }}
          >
            <Suspense fallback={null}>
              {/* 天空盒 */}
              <Environment preset="night" />
              
              {/* 场景光源 */}
              <ambientLight intensity={0.3} />
              <spotLight position={[5, 5, 5]} intensity={0.7} castShadow />
              
              {/* 地面 */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
              
              {/* 动态加载朝代特定的天文台场景 - 全屏模式下更详细 */}
              <group position={[0, 0, 0]}>
                {/* 天文台主体 - 根据朝代调整样式 */}
                <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[8, 0.5, 8]} />
                  <meshStandardMaterial color={
                    currentDynasty === "han" ? "#3a3a3a" : 
                    currentDynasty === "tang" ? "#4a4a4a" : 
                    currentDynasty === "song" ? "#5a5a5a" : 
                    currentDynasty === "yuan" ? "#3a4a5a" : 
                    currentDynasty === "ming" ? "#5a3a3a" : 
                    "#4a5a3a"
                  } />
                </mesh>
                
                {/* 天文台特色建筑 - 根据朝代变化 */}
                <mesh position={[0, 1, 0]} castShadow>
                  <cylinderGeometry args={
                    currentDynasty === "han" ? [1.8, 2.2, 1.2, 32] : 
                    currentDynasty === "tang" ? [2, 2.5, 1.5, 32] : 
                    currentDynasty === "song" ? [2.2, 2.7, 1.7, 32] : 
                    currentDynasty === "yuan" ? [2, 2.3, 1.4, 32] : 
                    currentDynasty === "ming" ? [2.5, 3, 2, 32] : 
                    [2.3, 2.8, 1.8, 32]
                  } />
                  <meshStandardMaterial color={
                    currentDynasty === "han" ? "#504030" : 
                    currentDynasty === "tang" ? "#605040" : 
                    currentDynasty === "song" ? "#705050" : 
                    currentDynasty === "yuan" ? "#506050" : 
                    currentDynasty === "ming" ? "#705040" : 
                    "#605060"
                  } />
                </mesh>
                
                {/* 动态加载当前朝代的天文仪器 */}
                {getCurrentDynastyInstruments(currentDynasty).map((instrument, index) => {
                  // 计算仪器的位置，围绕中心点放置
                  const angle = (index / getCurrentDynastyInstruments(currentDynasty).length) * Math.PI * 2;
                  const radius = 3; // 在全屏模式下，使半径更大
                  const x = Math.sin(angle) * radius;
                  const z = Math.cos(angle) * radius;
                  
                  return (
                    <InfoPoint
                      key={instrument.id}
                      position={[x, 1.5, z]}
                      label={instrument.name}
                      onClick={() => handleObjectSelect(instrument.id)}
                      hovered={hoveredItem}
                      setHovered={setHoveredItem}
                    />
                  );
                })}
              </group>
              
              {/* 星空背景和效果增强 */}
              <Stars radius={100} depth={50} count={8000} factor={5} saturation={0.5} fade speed={1} />
              <ParticleField count={1000} color="#ffcc88" />
              <ConstellationLines points={createConstellationData(currentDynasty)} color="#8888ff" />
              
              {/* 使用OrbitControls提供更灵活的相机控制 */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={50}
                target={[0, 1, 0]}
                makeDefault
              />
              
              {/* 特效增强 */}
              <SceneEffects />
            </Suspense>
          </Canvas>
          
          {/* 全屏模式下的UI元素 */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={exitVRMode}
              className="bg-ancient-gold/80 text-white px-4 py-2 rounded-lg hover:bg-ancient-gold transition-colors"
            >
              退出VR模式
            </button>
          </div>
          
          {/* 朝代选择器 - 全屏模式 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 bg-black/60 backdrop-blur-sm p-2 rounded-full">
            {observatoryData.dynasties.map(dynasty => (
              <button
                key={dynasty.id}
                onClick={() => handleDynastyChange(dynasty.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentDynasty === dynasty.id 
                    ? 'bg-ancient-gold text-black' 
                    : 'bg-black/50 text-gray-300 hover:bg-black/70'
                }`}
              >
                {dynasty.name.replace('天文台', '')}
              </button>
            ))}
          </div>
          
          {/* 交互提示 */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/40 text-white px-4 py-2 rounded-full text-sm">
            拖动旋转视角 • 滚轮缩放 • 点击场景中的仪器查看详情
          </div>
          
          {/* 选中对象信息弹窗 */}
          {selectedObject && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-lg p-6 rounded-lg border border-ancient-gold/30 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-ancient-gold">{selectedObject.name}</h2>
                <button 
                  onClick={() => setSelectedObject(null)}
                  className="text-white hover:text-ancient-gold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-white">
                <p>{selectedObject.description}</p>
                
                <div>
                  <h3 className="text-lg font-medium text-ancient-gold mb-2">历史背景</h3>
                  <p className="text-sm">{selectedObject.details.history}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-ancient-gold mb-2">用途</h3>
                  <p className="text-sm">{selectedObject.details.purpose}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // 标准布局（左侧VR场景，右侧信息面板）
        <>
          {/* 左侧: VR场景 */}
          <div className="w-3/5 h-full relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
          >
            {/* VR场景内容 */}
            <Canvas
              shadows
              className="bg-black"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              camera={{ position: [0, 1.5, 5], fov: 60 }}
            >
              <Suspense fallback={null}>
                {/* 天空盒 */}
                <Environment preset="night" />
                
                {/* 场景光源 */}
                <ambientLight intensity={0.2} />
                <spotLight position={[5, 5, 5]} intensity={0.5} castShadow />
                
                {/* 地面 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial color="#111111" />
                </mesh>
                
                {/* 动态加载朝代特定的天文台场景 */}
                <group position={[0, 0, 0]}>
                  {/* 天文台主体 - 根据朝代调整样式 */}
                  <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[5, 0.5, 5]} />
                    <meshStandardMaterial color={
                      currentDynasty === "han" ? "#3a3a3a" : 
                      currentDynasty === "tang" ? "#4a4a4a" : 
                      currentDynasty === "song" ? "#5a5a5a" : 
                      currentDynasty === "yuan" ? "#3a4a5a" : 
                      currentDynasty === "ming" ? "#5a3a3a" : 
                      "#4a5a3a"
                    } />
                  </mesh>
                  
                  {/* 天文台特色建筑 - 根据朝代变化 */}
                  <mesh position={[0, 1, 0]} castShadow>
                    <cylinderGeometry args={
                      currentDynasty === "han" ? [1.8, 2.2, 1.2, 32] : 
                      currentDynasty === "tang" ? [2, 2.5, 1.5, 32] : 
                      currentDynasty === "song" ? [2.2, 2.7, 1.7, 32] : 
                      currentDynasty === "yuan" ? [2, 2.3, 1.4, 32] : 
                      currentDynasty === "ming" ? [2.5, 3, 2, 32] : 
                      [2.3, 2.8, 1.8, 32]
                    } />
                    <meshStandardMaterial color={
                      currentDynasty === "han" ? "#504030" : 
                      currentDynasty === "tang" ? "#605040" : 
                      currentDynasty === "song" ? "#705050" : 
                      currentDynasty === "yuan" ? "#506050" : 
                      currentDynasty === "ming" ? "#705040" : 
                      "#605060"
                    } />
                  </mesh>
                  
                  {/* 动态加载当前朝代的天文仪器 */}
                  {getCurrentDynastyInstruments(currentDynasty).map((instrument, index) => {
                    // 计算仪器的位置，围绕中心点放置
                    const angle = (index / getCurrentDynastyInstruments(currentDynasty).length) * Math.PI * 2;
                    const radius = 1.5;
                    const x = Math.sin(angle) * radius;
                    const z = Math.cos(angle) * radius;
                    
                    return (
                      <InfoPoint
                        key={instrument.id}
                        position={[x, 1.5, z]}
                        label={instrument.name}
                        onClick={() => handleObjectSelect(instrument.id)}
                        hovered={hoveredItem}
                        setHovered={setHoveredItem}
                      />
                    );
                  })}
                </group>
                
                {/* 简易星空背景 */}
                <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                
                {/* 相机控制 */}
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={20}
                />
                
                {/* 特效 */}
                <SceneEffects />
              </Suspense>
            </Canvas>
            
            {/* 交互提示 */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/40 text-white px-4 py-2 rounded-full text-sm">
              点击场景中的仪器查看详情 • 拖动旋转视角 • 滚轮缩放
            </div>
            
            {/* VR模式按钮 */}
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-6 right-6 bg-ancient-gold/80 text-white px-4 py-2 rounded-lg hover:bg-ancient-gold transition-colors"
            >
              进入VR模式
            </button>
          </div>
          
          {/* 右侧: 交互信息面板 */}
          <div className="w-2/5 h-full bg-black/95 backdrop-blur-xl overflow-auto border-l border-ancient-gold/30">
            {showSimulation ? (
              <div className="h-full p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-ancient-gold">{currentSimulation.name}模拟</h2>
                  <button 
                    onClick={endSimulation}
                    className="text-white hover:text-ancient-gold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-ancient-gold/50 to-transparent mb-6"></div>
                
                <div className="space-y-6">
                  <p className="text-gray-300">{currentSimulation.description}</p>
                  
                  <div>
                    <h3 className="text-lg font-medium text-ancient-gold mb-2">观测步骤</h3>
                    <div className="bg-black/50 p-4 rounded-md border border-gray-800">
                      {currentSimulation.procedure.split('\n').map((step: string, index: number) => (
                        <div key={index} className="flex items-start mb-3 last:mb-0">
                          <div className="bg-ancient-gold/20 text-ancient-gold w-6 h-6 flex items-center justify-center rounded-full mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-300">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-ancient-gold mb-4">观测模拟</h3>
                    <div className="aspect-video bg-black/70 rounded-lg border border-gray-800 flex items-center justify-center mb-4">
                      <p className="text-gray-400 text-center">交互式观测模拟<br/>点击场景中的仪器进行操作</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      注: 实际观测需要精密的仪器校准和专业知识。此模拟仅供教育目的，展示古代观测方法的基本原理。
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedObject ? (
              <div className="h-full p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-ancient-gold">{selectedObject.name}</h2>
                  <button 
                    onClick={() => setSelectedObject(null)}
                    className="text-white hover:text-ancient-gold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-ancient-gold/50 to-transparent mb-6"></div>
                
                {selectedObject.imageUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-black/70 rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedObject.imageUrl}
                        alt={selectedObject.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-instrument.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-300">{selectedObject.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-ancient-gold mb-2">历史背景</h3>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">
                      {selectedObject.details.history}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-ancient-gold mb-2">用途</h3>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">
                      {selectedObject.details.purpose}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-ancient-gold mb-2">使用方法</h3>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">
                      {selectedObject.details.usage}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-ancient-gold mb-2">历史意义</h3>
                    <p className="text-sm leading-relaxed bg-black/50 p-3 rounded-md border border-gray-800">
                      {selectedObject.details.significance}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium text-ancient-gold mb-3">相关观测活动</h3>
                    <div className="space-y-2">
                      {getCurrentDynastyActivities(currentDynasty).map(activity => (
                        <button
                          key={activity.id}
                          onClick={() => startObservationSimulation(activity.id)}
                          className="w-full text-left p-3 bg-ancient-gold/10 hover:bg-ancient-gold/20 rounded-md border border-ancient-gold/30 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="text-ancient-gold mr-3">▶</span>
                            <div>
                              <h4 className="font-medium text-white">{activity.name}</h4>
                              <p className="text-xs text-gray-400">{activity.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full p-6 text-white">
                <div className="pb-6 border-b border-gray-800 mb-6">
                  <h2 className="text-2xl font-bold text-ancient-gold mb-2">
                    {observatoryData.dynasties.find(d => d.id === currentDynasty)?.name || observatoryData.name}
                  </h2>
                  <p className="text-gray-300">
                    {observatoryData.dynasties.find(d => d.id === currentDynasty)?.description || "中国古代天文台是天文观测和历法制定的重要场所，体现了古代中国在天文学领域的卓越成就。"}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-ancient-gold mb-4">选择朝代</h3>
                  <div className="flex overflow-x-auto pb-3 space-x-2">
                    {observatoryData.dynasties.map(dynasty => (
                      <button
                        key={dynasty.id}
                        onClick={() => handleDynastyChange(dynasty.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-md border ${
                          currentDynasty === dynasty.id 
                            ? 'bg-ancient-gold/20 border-ancient-gold text-ancient-gold' 
                            : 'bg-black/30 border-gray-700 text-gray-300 hover:bg-black/50'
                        }`}
                      >
                        <div className="text-center">
                          <div>{dynasty.name}</div>
                          <div className="text-xs opacity-70">{dynasty.year}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-ancient-gold mb-4">天文仪器</h3>
                  <div className="space-y-4">
                    {getCurrentDynastyInstruments(currentDynasty).map(instrument => (
                      <div 
                        key={instrument.id}
                        onClick={() => handleObjectSelect(instrument.id)}
                        className="flex items-center p-3 bg-black/30 rounded-lg border border-gray-800 hover:bg-ancient-gold/10 hover:border-ancient-gold/30 cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 bg-black/50 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ancient-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{instrument.name}</h4>
                          <p className="text-xs text-gray-400">{instrument.description.substring(0, 60)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-ancient-gold mb-4">观测活动</h3>
                  <div className="space-y-4">
                    {getCurrentDynastyActivities(currentDynasty).map(activity => (
                      <div 
                        key={activity.id}
                        onClick={() => startObservationSimulation(activity.id)}
                        className="flex items-center p-3 bg-black/30 rounded-lg border border-gray-800 hover:bg-ancient-gold/10 hover:border-ancient-gold/30 cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 bg-black/50 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ancient-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{activity.name}</h4>
                          <p className="text-xs text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* VR模式对话框 */}
      {showModal && (
        <VREntryModal onClose={() => setShowModal(false)} onStart={handleStartVR} />
      )}
      
      {/* 鼠标指针自定义样式（仅在非移动设备上显示） */}
      {!isMobile && hoveredItem && !isVRMode && (
        <div 
          className="fixed pointer-events-none z-50 text-white text-xs bg-ancient-gold/80 px-2 py-1 rounded"
          style={{ left: cursorPosition.x + 15, top: cursorPosition.y + 15 }}
        >
          {hoveredItem}
        </div>
      )}
    </div>
  );
};

export default WebVRExperience; 