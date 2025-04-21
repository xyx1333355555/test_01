import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { instrumentsData } from '@/data/instrumentsData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// 获取仪器对应的3D模型路径
const getInstrumentModelPath = (instrumentId: string): string => {
  // 为每个仪器提供专属的3D模型路径
  const modelPaths: Record<string, string> = {
    'armillary_sphere': '/models/instruments/huntianyi.glb',
    'gnomon': '/models/instruments/guibiao.glb',
    'water_clock': '/models/instruments/loushui.glb',
    'seismograph': '/models/instruments/dizhenyi.glb',
    'celestial_globe': '/models/instruments/tianqiu.glb',
    'simplified_armillary': '/models/instruments/jianyi.glb',
  };
  
  return modelPaths[instrumentId] || '/models/instruments/default.glb';
};

const InstrumentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [instrument, setInstrument] = useState<typeof instrumentsData[0] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 3D模型相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (!id) return;
    
    // 获取仪器数据
    const instrumentData = instrumentsData.find(i => i.id === id);
    if (instrumentData) {
      setInstrument(instrumentData);
    }
    
    setLoading(false);
  }, [id]);
  
  // 3D模型加载和渲染
  useEffect(() => {
    if (!canvasRef.current || !instrument || !id) return;
    
    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f0e1); // 古纸色背景
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      45, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 2, 5);
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // 添加环境光和方向光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    // 添加地面
    const groundGeometry = new THREE.CircleGeometry(3, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37,
      metalness: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // 添加装饰性光环
    const ringGeometry = new THREE.RingGeometry(1.9, 2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0;
    scene.add(ring);
    
    // 创建一个占位模型（在加载真实模型失败时使用）
    const createPlaceholderModel = () => {
      const group = new THREE.Group();
      
      // 创建底座
      const baseGeometry = new THREE.CylinderGeometry(0.7, 0.8, 0.2, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.7,
        roughness: 0.3
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.1;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);
      
      // 创建主体部分
      const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.8, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.5,
        roughness: 0.5
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.9;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
      
      // 创建顶部装饰
      const topGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.8,
        roughness: 0.2
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 2;
      top.castShadow = true;
      group.add(top);
      
      return group;
    };
    
    // 创建仪器名称显示
    const createNameDisplay = (name: string) => {
      // 创建画布
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      
      if (context) {
        // 绘制渐变背景
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.7)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0.3)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制边框
        context.strokeStyle = 'rgba(212, 175, 55, 0.8)';
        context.lineWidth = 4;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        // 绘制文字
        context.font = 'bold 48px "Ma Shan Zheng", serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000';
        context.fillText(name, canvas.width / 2, canvas.height / 2);
      }
      
      // 创建纹理
      const texture = new THREE.CanvasTexture(canvas);
      
      // 创建材质
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      // 创建平面几何体
      const geometry = new THREE.PlaneGeometry(2, 0.5);
      
      // 创建网格
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -0.5;
      mesh.position.z = -0.5;
      mesh.rotation.x = -Math.PI / 8;
      
      return mesh;
    };
    
    // 初始化占位模型和名称显示
    const placeholderModel = createPlaceholderModel();
    placeholderModel.visible = false;
    scene.add(placeholderModel);
    
    const nameDisplay = createNameDisplay(instrument.name);
    nameDisplay.visible = false;
    scene.add(nameDisplay);
    
    // 加载3D模型
    setModelLoaded(false);
    setModelError(false);
    setLoadingProgress(0);
    
    const modelPath = getInstrumentModelPath(id as string);
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        // 模型加载成功
        const model = gltf.scene;
        
        // 计算模型的包围盒
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // 调整模型大小和位置
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);
        
        // 确保模型位于地面上
        model.position.y = -center.y * scale;
        
        // 添加阴影
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        
        scene.add(model);
        setModelLoaded(true);
      },
      (progress) => {
        // 加载进度
        if (progress.lengthComputable) {
          const progressPercent = (progress.loaded / progress.total) * 100;
          setLoadingProgress(progressPercent);
        }
      },
      (error) => {
        // 加载失败
        console.error('An error happened while loading the model:', error);
        placeholderModel.visible = true;
        nameDisplay.visible = true;
        setModelError(true);
      }
    );
    
    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // 处理窗口大小变化
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // 清理Three.js资源
      scene.clear();
      renderer.dispose();
      
      if (controls) {
        controls.dispose();
      }
    };
  }, [instrument, id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ancient-paper">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">正在加载仪器信息...</p>
        </div>
      </div>
    );
  }
  
  if (!instrument) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ancient-paper">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">未找到仪器信息</h1>
          <p className="mb-6">抱歉，我们无法找到您请求的仪器信息。可能是链接错误或该仪器数据尚未添加。</p>
          <Link href="/instruments" className="bg-ancient-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
            返回仪器列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{instrument.name} - 中国古代天文仪器 | 中国古代天文可视化</title>
        <meta name="description" content={`探索${instrument.name}的设计、功能和历史意义，了解这一中国古代天文仪器的科学价值`} />
      </Head>
      
      <Header />
      
      <main className="bg-ancient-paper min-h-screen">
        {/* 仪器标题部分 */}
        <section className="relative py-16 bg-gradient-to-b from-black to-ancient-dark overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="stars-bg"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="ancient-title text-white text-4xl md:text-5xl mb-4">{instrument.name}</h1>
              <p className="text-ancient-gold text-xl mb-6">发明者: {instrument.inventor}</p>
            </motion.div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D模型展示 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full"
                ></canvas>
                
                {!modelLoaded && !modelError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ancient-paper bg-opacity-80">
                    <div className="w-16 h-16 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg">加载3D模型中... {loadingProgress.toFixed(0)}%</p>
                  </div>
                )}
                
                {modelError && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
                    模型加载失败，显示占位模型
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-ancient-gold bg-opacity-10">
                <p className="text-center text-sm">
                  <span className="mr-2">👆</span>
                  您可以拖动、缩放和旋转3D模型以查看不同角度
                </p>
              </div>
            </motion.div>
            
            {/* 仪器详情 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-ancient-gold">仪器描述</h2>
                <p className="text-gray-700 mb-6">{instrument.description}</p>
                
                <h3 className="text-xl font-bold mb-3 text-ancient-gold">主要功能</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  {instrument.functions.map((func, index) => (
                    <li key={index} className="text-gray-700">{func}</li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-bold mb-3 text-ancient-gold">历史意义</h3>
                <p className="text-gray-700">{instrument.significance}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-ancient-gold">科学价值</h2>
                <p className="text-gray-700 mb-4">{instrument.modernComparison || '这一仪器体现了中国古代天文学的精湛技术和科学思想，对当时的天文观测和历法制定有重要贡献。'}</p>
                
                <div className="flex justify-between items-center mt-6">
                  <Link 
                    href="/instruments" 
                    className="text-ancient-gold hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    返回仪器列表
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default InstrumentPage; 