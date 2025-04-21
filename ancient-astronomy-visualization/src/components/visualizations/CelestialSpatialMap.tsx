import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CelestialDataAnalyzer } from '@/utils/celestialDataAnalyzer';
import { CelestialRecord } from '@/data/celestialRecordsData';

// 组件属性
interface CelestialSpatialMapProps {
  records: CelestialRecord[];
  className?: string;
}

/**
 * 天象记录地理空间分布可视化组件
 */
const CelestialSpatialMap: React.FC<CelestialSpatialMapProps> = ({ records, className }) => {
  const [analyzer] = useState(() => new CelestialDataAnalyzer(records));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spatialData, setSpatialData] = useState<any>(null);
  
  // 分析空间数据
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const data = analyzer.analyzeSpatialDistribution();
      setSpatialData(data);
    } catch (err) {
      console.error('分析空间数据时出错:', err);
      setError(err instanceof Error ? err.message : '分析空间数据时出错');
    } finally {
      setLoading(false);
    }
  }, [analyzer]);
  
  // 渲染地图
  return (
    <div className={`relative ${className || ''}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-ancient-ink">分析天象空间数据中...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">错误:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}
      
      {!loading && !error && spatialData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">古代天象观测地理分布</h3>
            <p className="text-gray-700 mb-4">
              由于技术兼容性问题，地图组件暂时无法显示。以下是主要观测地点的数据：
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">观测地点</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">记录数量</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主要朝代</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spatialData.observationCenters
                    .sort((a: any, b: any) => b.count - a.count)
                    .map((center: any, index: number) => (
                      <tr key={center.location} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{center.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{center.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {center.location === '长安' && '周、秦、汉、隋、唐'}
                          {center.location === '洛阳' && '东周、东汉、曹魏、西晋'}
                          {center.location === '开封' && '北宋'}
                          {center.location === '临安' && '南宋'}
                          {center.location === '安阳' && '商'}
                          {center.location === '北京' && '元、明、清'}
                          {center.location === '南京' && '南朝、明初'}
                          {center.location === '成都' && '蜀汉'}
                          {!['长安', '洛阳', '开封', '临安', '安阳', '北京', '南京', '成都'].includes(center.location) && '多朝代'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">区域记录密度分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spatialData.regionalDensity
                .sort((a: any, b: any) => b.density - a.density)
                .map((region: any) => (
                  <div key={region.region} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{region.region}</h4>
                    <div className="flex items-center">
                      <div className="relative w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="absolute top-0 left-0 h-2.5 rounded-full bg-ancient-jade" 
                          style={{ width: `${(region.density / Math.max(...spatialData.regionalDensity.map((r: any) => r.density))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{region.density.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <motion.div 
            className="text-xs text-gray-500 mt-2 italic text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            数据来源：基于《中国古代都城与天文台址考》结合古代天象记录分析
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CelestialSpatialMap; 