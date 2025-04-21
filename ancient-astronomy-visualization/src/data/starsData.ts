// 星星数据，包含位置和亮度信息
// 使用球坐标系，r为距离，theta和phi为角度
// 将古代天文记录与现代星座对应

export interface Star {
  id: string;
  name: string;
  chineseName?: string; // 中文名称
  x: number;
  y: number;
  z: number;
  magnitude: number; // 亮度，数值越小越亮
  color: string;
  dynasty?: string; // 对应的朝代
  recordId?: string; // 关联的天文记录ID
}

// 生成随机星星
export const generateRandomStars = (count: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const r = 100 + Math.random() * 200; // 星星到中心的距离
    const theta = Math.random() * Math.PI * 2; // 水平角度
    const phi = Math.acos(2 * Math.random() - 1); // 垂直角度
    
    // 球坐标转直角坐标
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    // 随机亮度，偏向暗星
    const magnitude = Math.random() * 2.5 + 0.5;
    
    // 颜色，大多为白色和蓝色，少量红色和黄色
    const colors = ['#ffffff', '#f4f4ff', '#ffffee', '#ffeeee', '#eeffff'];
    const colorIndex = Math.floor(Math.pow(Math.random(), 2) * colors.length);
    
    stars.push({
      id: `star-${i}`,
      name: `Star ${i}`,
      x,
      y,
      z,
      magnitude,
      color: colors[colorIndex]
    });
  }
  return stars;
};

// 重要的历史星象记录，使用固定位置
export const historicalStars: Star[] = [
  // 东方七宿 (青龙)
  { id: 'eastern-1', name: 'Spica', chineseName: '角宿', x: 120, y: 20, z: 50, magnitude: 0.8, color: '#a0a0ff', dynasty: '周朝' },
  { id: 'eastern-2', name: 'Arcturus', chineseName: '氐宿', x: 140, y: 40, z: 30, magnitude: 0.9, color: '#ffb380', dynasty: '周朝' },
  { id: 'eastern-3', name: 'Antares', chineseName: '心宿', x: 160, y: 60, z: 10, magnitude: 0.7, color: '#ff3333', dynasty: '周朝' },
  { id: 'eastern-4', name: 'Libra', chineseName: '尾宿', x: 180, y: 80, z: -10, magnitude: 1.2, color: '#a0a0ff', dynasty: '周朝' },
  { id: 'eastern-5', name: 'Sagittarius', chineseName: '箕宿', x: 200, y: 60, z: -30, magnitude: 1.1, color: '#ffffff', dynasty: '周朝' },
  { id: 'eastern-6', name: 'Alpha Virginis', chineseName: '轸宿', x: 130, y: 30, z: 40, magnitude: 0.9, color: '#a0a0ff', dynasty: '周朝' },
  { id: 'eastern-7', name: 'Beta Scorpii', chineseName: '房宿', x: 170, y: 70, z: 0, magnitude: 0.8, color: '#ff9980', dynasty: '周朝' },
  
  // 北方七宿 (玄武)
  { id: 'northern-8', name: 'Beta Pegasi', chineseName: '斗宿', x: -120, y: -20, z: 50, magnitude: 0.8, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-9', name: 'Alpha Aquarii', chineseName: '牛宿', x: -140, y: -40, z: 30, magnitude: 0.9, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-10', name: 'Beta Aquarii', chineseName: '女宿', x: -160, y: -60, z: 10, magnitude: 1.0, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-11', name: 'Alpha Pegasi', chineseName: '虚宿', x: -180, y: -80, z: -10, magnitude: 0.8, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-12', name: 'Beta Andromedae', chineseName: '危宿', x: -200, y: -60, z: -30, magnitude: 0.9, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-13', name: 'Alpha Andromedae', chineseName: '室宿', x: -190, y: -70, z: -20, magnitude: 0.7, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'northern-14', name: 'Fomalhaut', chineseName: '壁宿', x: -210, y: -50, z: -40, magnitude: 0.6, color: '#a0e6ff', dynasty: '周朝' },

  // 西方七宿 (白虎)
  { id: 'western-1', name: 'Alpha Tauri', chineseName: '奎宿', x: -100, y: 40, z: 60, magnitude: 0.7, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-2', name: 'Gamma Andromedae', chineseName: '娄宿', x: -80, y: 60, z: 80, magnitude: 0.8, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-3', name: 'Pleiades', chineseName: '胃宿', x: -60, y: 80, z: 100, magnitude: 1.0, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-4', name: 'Hyades', chineseName: '昴宿', x: -40, y: 100, z: 120, magnitude: 0.9, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-5', name: 'Zeta Tauri', chineseName: '毕宿', x: -20, y: 120, z: 140, magnitude: 0.8, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-6', name: 'Castor', chineseName: '觜宿', x: 0, y: 140, z: 160, magnitude: 0.6, color: '#ffffff', dynasty: '周朝' },
  { id: 'western-7', name: 'Pollux', chineseName: '参宿', x: 20, y: 160, z: 140, magnitude: 0.5, color: '#ffffff', dynasty: '周朝' },
  
  // 南方七宿 (朱雀)
  { id: 'southern-1', name: 'Alpha Hydrae', chineseName: '井宿', x: 100, y: -40, z: -60, magnitude: 0.7, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-2', name: 'Alpha Crateris', chineseName: '鬼宿', x: 80, y: -60, z: -80, magnitude: 0.9, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-3', name: 'Gamma Corvi', chineseName: '柳宿', x: 60, y: -80, z: -100, magnitude: 0.8, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-4', name: 'Delta Corvi', chineseName: '星宿', x: 40, y: -100, z: -120, magnitude: 0.8, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-5', name: 'Alpha Virginis', chineseName: '张宿', x: 20, y: -120, z: -140, magnitude: 0.6, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-6', name: 'Gamma Virginis', chineseName: '翼宿', x: 0, y: -140, z: -160, magnitude: 0.7, color: '#ffb380', dynasty: '周朝' },
  { id: 'southern-7', name: 'Alpha Librae', chineseName: '轸宿', x: -20, y: -160, z: -140, magnitude: 0.8, color: '#ffb380', dynasty: '周朝' },
  
  // 北斗七星
  { id: 'northern-1', name: 'Dubhe', chineseName: '天枢', x: 80, y: 140, z: 70, magnitude: 0.6, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-2', name: 'Merak', chineseName: '天璇', x: 60, y: 130, z: 80, magnitude: 0.7, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-3', name: 'Phecda', chineseName: '天玑', x: 40, y: 120, z: 90, magnitude: 0.7, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-4', name: 'Megrez', chineseName: '天权', x: 20, y: 110, z: 100, magnitude: 0.8, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-5', name: 'Alioth', chineseName: '玉衡', x: 0, y: 100, z: 110, magnitude: 0.5, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-6', name: 'Mizar', chineseName: '开阳', x: -20, y: 90, z: 120, magnitude: 0.6, color: '#ffffff', dynasty: '汉朝' },
  { id: 'northern-7', name: 'Alkaid', chineseName: '摇光', x: -40, y: 80, z: 130, magnitude: 0.6, color: '#ffffff', dynasty: '汉朝' },
  
  // 其他重要中国古代星座
  { id: 'polaris', name: 'Polaris', chineseName: '北极星', x: 0, y: 190, z: 0, magnitude: 0.4, color: '#ffffff', dynasty: '周朝' },
  { id: 'vega', name: 'Vega', chineseName: '织女星', x: 40, y: 150, z: -60, magnitude: 0.3, color: '#a0e6ff', dynasty: '周朝' },
  { id: 'altair', name: 'Altair', chineseName: '牵牛星', x: -40, y: 150, z: -60, magnitude: 0.4, color: '#ffcc99', dynasty: '周朝' },
  { id: 'deneb', name: 'Deneb', chineseName: '天津四', x: 0, y: 170, z: -40, magnitude: 0.5, color: '#ffffff', dynasty: '周朝' },
  { id: 'sirius', name: 'Sirius', chineseName: '天狼星', x: 120, y: -80, z: 90, magnitude: 0.1, color: '#ffffff', dynasty: '汉朝' },
  { id: 'canopus', name: 'Canopus', chineseName: '老人星', x: 150, y: -100, z: 70, magnitude: 0.2, color: '#ffff80', dynasty: '汉朝' },
  
  // 天文记录相关的特殊星体
  { id: 'supernova-1054', name: 'Crab Nebula', chineseName: '客星', x: -60, y: -40, z: 150, magnitude: 0.1, color: '#ff9933', dynasty: '宋朝', recordId: 'nova-3' },
  { id: 'comet-240bc', name: 'Halley Comet', chineseName: '彗星', x: 180, y: -60, z: -120, magnitude: 0.2, color: '#66ffff', dynasty: '战国', recordId: 'comet-2' },
  { id: 'eclipse-776bc', name: 'Solar Eclipse', chineseName: '日食', x: 0, y: 0, z: 190, magnitude: 0.1, color: '#ffff00', dynasty: '周朝', recordId: 'solar-2' },
  { id: 'meteor-687', name: 'Perseid Meteor', chineseName: '流星雨', x: -140, y: 80, z: -110, magnitude: 0.1, color: '#00ff99', dynasty: '唐朝', recordId: 'meteor-5' },
  { id: 'supernova-1006', name: 'SN 1006', chineseName: '周天之客星', x: 120, y: -120, z: 110, magnitude: 0.0, color: '#ff5050', dynasty: '北宋', recordId: 'nova-2' },
  { id: 'supernova-1181', name: 'SN 1181', chineseName: '宋代客星', x: -120, y: 120, z: -110, magnitude: 0.2, color: '#ff9933', dynasty: '南宋', recordId: 'nova-4' },
  { id: 'eclipse-1221', name: 'Annular Eclipse', chineseName: '金环日食', x: 10, y: -10, z: 190, magnitude: 0.1, color: '#ffcc33', dynasty: '南宋', recordId: 'solar-20' },
  { id: 'comet-1066', name: 'Halley Comet 1066', chineseName: '长尾星', x: -180, y: 60, z: 120, magnitude: 0.2, color: '#66ffff', dynasty: '北宋', recordId: 'comet-9' },
  { id: 'comet-12bc', name: '彗星-汉朝', chineseName: '扫帚星', x: 160, y: -80, z: -140, magnitude: 0.1, color: '#66ffff', dynasty: '西汉', recordId: 'comet-3' },
  { id: 'venus-28bc', name: 'Venus Daylight', chineseName: '太白昼见', x: 30, y: 30, z: 180, magnitude: 0.1, color: '#ffff99', dynasty: '西汉', recordId: 'planet-1' },
];

// 所有星星的集合，包括随机星星和历史星星
export const allStars = [...historicalStars, ...generateRandomStars(3000)]; 