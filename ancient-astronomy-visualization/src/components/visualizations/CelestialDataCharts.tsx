import React, { useEffect, useRef, useState } from 'react';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  PieController,
  LineController,
  BarController,
  DoughnutController,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadarController,
  RadialLinearScale,
  TimeScale,
  SubTitle,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { 
  CelestialDataAnalyzer, 
  TimeDistributionResult, 
  AccuracyAnalysisResult,
  SourceAnalysisResult,
  CelestialEventType
} from '@/utils/celestialDataAnalyzer';
import { CelestialRecord } from '@/data/celestialRecordsData';
import { motion } from 'framer-motion';

// 注册Chart.js组件
Chart.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  PieController,
  LineController,
  BarController,
  DoughnutController,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadarController,
  RadialLinearScale,
  TimeScale,
  SubTitle,
  Filler
);

// 图表类型
type ChartType = 'distribution' | 'timeline' | 'accuracy' | 'sources' | 'correlation';

// 天象事件类型对应的名称
const eventTypeNames: {[key in CelestialEventType]: string} = {
  solar: '日食',
  lunar: '月食',
  comet: '彗星',
  nova: '新星',
  meteor: '流星'
};

// 图表颜色
const chartColors = {
  background: [
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 99, 132, 0.6)', 
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)',
    'rgba(40, 159, 123, 0.6)',
    'rgba(205, 92, 92, 0.6)',
    'rgba(169, 169, 169, 0.6)',
    'rgba(255, 140, 0, 0.6)'
  ],
  border: [
    'rgb(54, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
    'rgb(199, 199, 199)',
    'rgb(83, 102, 255)',
    'rgb(40, 159, 123)',
    'rgb(205, 92, 92)',
    'rgb(169, 169, 169)',
    'rgb(255, 140, 0)'
  ]
};

// 图表组件属性
interface CelestialDataChartsProps {
  records: CelestialRecord[];
  chartType: ChartType;
  className?: string;
  chartId?: string; // 添加唯一ID属性
}

// 生成全局唯一ID
const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;
};

/**
 * 天象数据可视化图表组件
 */
const CelestialDataCharts: React.FC<CelestialDataChartsProps> = ({ records, chartType, className, chartId }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzer] = useState(() => new CelestialDataAnalyzer(records));
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  // 生成唯一canvas ID
  const canvasId = chartId || `chart-${chartType}-${Math.random().toString(36).substring(2, 9)}`;
  
  // 确保在组件卸载时清理图表实例
  useEffect(() => {
    return () => {
      // 组件卸载时清理图表实例
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);
  
  // 安全地销毁现有图表
  const safeDestroyChart = () => {
    if (chartInstance) {
      try {
        chartInstance.destroy();
      } catch (e) {
        console.warn('销毁图表实例时出错:', e);
      }
      setChartInstance(null);
    }
    
    // 查找并销毁所有绑定到当前canvas的chart实例
    if (chartRef.current && chartRef.current.id) {
      const existingCharts = Chart.getChart(chartRef.current.id);
      if (existingCharts) {
        try {
          existingCharts.destroy();
        } catch (e) {
          console.warn('销毁已存在的图表实例时出错:', e);
        }
      }
    }
  };
  
  // 分析数据并创建图表
  useEffect(() => {
    if (!chartRef.current) return;
    
    setLoading(true);
    setError(null);
    
    // 先销毁现有图表
    safeDestroyChart();
    
    try {
      const canvas = chartRef.current.getContext('2d');
      if (!canvas) {
        throw new Error('无法获取Canvas上下文');
      }
      
      // 根据图表类型创建不同的图表
      let chart: Chart;
      const uniqueChartId = generateUniqueId(`chart-${chartType}`);
      
      switch(chartType) {
        case 'distribution':
          chart = createDistributionChart(canvas, analyzer, uniqueChartId);
          setDataSource('数据来源：基于《二十四史》天文志记载的天象分布统计');
          break;
        case 'timeline':
          chart = createTimelineChart(canvas, analyzer, uniqueChartId);
          setDataSource('数据来源：基于《中国古代天象记录编年》整理的时间分布');
          break;
        case 'accuracy':
          chart = createAccuracyChart(canvas, analyzer, uniqueChartId);
          setDataSource('数据来源：与现代天文学计算结果对比的准确度评估');
          break;
        case 'sources':
          chart = createSourcesChart(canvas, analyzer, uniqueChartId);
          setDataSource('数据来源：基于各朝代史书和天文志的数据来源分析');
          break;
        case 'correlation':
          chart = createCorrelationChart(canvas, analyzer, uniqueChartId);
          setDataSource('数据来源：基于《天象与中国古代政治事件关联研究》');
          break;
        default:
          throw new Error(`不支持的图表类型: ${chartType}`);
      }
      
      // 设置图表ID
      (chart as any).id = uniqueChartId;
      
      setChartInstance(chart);
    } catch (err) {
      console.error('创建图表时出错:', err);
      setError(err instanceof Error ? err.message : '创建图表时出错');
    } finally {
      setLoading(false);
    }
    
    // 返回清理函数，确保在每次重新创建图表前销毁旧图表
    return () => {
      safeDestroyChart();
    };
  }, [records, chartType, analyzer]);
  
  /**
   * 创建时间线图表
   */
  const createTimelineChart = (canvas: CanvasRenderingContext2D, analyzer: CelestialDataAnalyzer, chartId: string): Chart => {
    const timeDistributionData = analyzer.analyzeTimeDistribution();
    
    // 准备数据 - 按朝代分组
    const dynastyData = Object.entries(timeDistributionData.byDynasty)
      .sort((a, b) => b[1] - a[1]) // 按记录数量降序排序
      .slice(0, 12); // 取前12个朝代
      
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: dynastyData.map(([dynasty]) => dynasty),
        datasets: [
          {
            label: '天象记录数量',
            data: dynastyData.map(([, count]) => count),
            backgroundColor: chartColors.background.slice(0, dynastyData.length),
            borderColor: chartColors.border.slice(0, dynastyData.length),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '各朝代天象记录数量分布',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          subtitle: {
            display: true,
            text: `共分析 ${records.length} 条历史天象记录`,
            font: {
              size: 14
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed.y} 条记录`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '记录数量'
            }
          }
        }
      }
    });
  };
  
  /**
   * 创建分布图表
   */
  const createDistributionChart = (canvas: CanvasRenderingContext2D, analyzer: CelestialDataAnalyzer, chartId: string): Chart => {
    // 获取时间分布数据
    const timeDistributionData = analyzer.analyzeTimeDistribution();
    
    // 按世纪统计数据
    const centuryData = Object.entries(timeDistributionData.byCentury)
      .sort((a, b) => {
        // 解析世纪标签进行排序
        const parseLabel = (label: string) => {
          const match = label.match(/前(\d+)世纪|(\d+)世纪/);
          if (match) {
            if (match[1]) return -parseInt(match[1]);
            if (match[2]) return parseInt(match[2]);
          }
          return 0;
        };
        return parseLabel(a[0]) - parseLabel(b[0]);
      });
    
    // 按天象类型统计
    const typeCount: {[key in CelestialEventType]: number} = {
      solar: 0,
      lunar: 0,
      comet: 0,
      nova: 0,
      meteor: 0
    };
    
    timeDistributionData.timeline.forEach(event => {
      typeCount[event.type]++;
    });
    
    // 创建饼图展示天象类型分布
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.entries(eventTypeNames).map(([, name]) => name),
        datasets: [{
          data: Object.values(typeCount),
          backgroundColor: chartColors.background.slice(0, 5),
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '天象记录类型分布',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          subtitle: {
            display: true,
            text: '按天象现象类型统计',
            font: {
              size: 14
            }
          },
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => (a as number) + (b as number), 0 as number);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} 条 (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };
  
  /**
   * 创建准确度图表
   */
  const createAccuracyChart = (canvas: CanvasRenderingContext2D, analyzer: CelestialDataAnalyzer, chartId: string): Chart => {
    // 获取准确度分析数据
    const accuracyData = analyzer.analyzeAccuracy();
    
    // 准确度趋势数据
    const trendData = accuracyData.trends;
    
    // 按类型的准确度数据
    const typeData = Object.entries(accuracyData.byType)
      .map(([type, accuracy]) => ({
        type: eventTypeNames[type as CelestialEventType] || type,
        accuracy
      }));
    
    // 创建雷达图展示各类型的准确度
    return new Chart(canvas, {
      type: 'radar',
      data: {
        labels: typeData.map(item => item.type),
        datasets: [
          {
            label: '记录准确度',
            data: typeData.map(item => item.accuracy),
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '各类天象记录的准确度分析',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          subtitle: {
            display: true,
            text: '与现代天文学计算结果的对比',
            font: {
              size: 14
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: false,
            min: 50,
            max: 100,
            ticks: {
              stepSize: 10
            }
          }
        }
      }
    });
  };
  
  /**
   * 创建数据源分析图表
   */
  const createSourcesChart = (canvas: CanvasRenderingContext2D, analyzer: CelestialDataAnalyzer, chartId: string): Chart => {
    // 获取数据源分析结果
    const sourceData = analyzer.analyzeDataSources();
    
    // 取前10个主要数据源
    const topSources = sourceData.sourceDistribution.slice(0, 10);
    
    // 创建饼图展示数据源分布
    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: topSources.map(item => item.source),
        datasets: [
          {
            data: topSources.map(item => item.count),
            backgroundColor: chartColors.background.slice(0, topSources.length),
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '中国古代天象记录的数据来源分析',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          subtitle: {
            display: true,
            text: `数据源多样性指数: ${sourceData.sourceDiversity.toFixed(2)}`,
            font: {
              size: 14
            }
          },
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => (a as number) + (b as number), 0 as number);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${label}: ${value} 条记录 (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };
  
  /**
   * 创建相关性分析图表
   */
  const createCorrelationChart = (canvas: CanvasRenderingContext2D, analyzer: CelestialDataAnalyzer, chartId: string): Chart => {
    // 获取相关性分析结果
    const correlationData = analyzer.analyzeCorrelations();
    
    // 提取政治事件相关性数据
    const politicalCorrelation = correlationData.politicalCorrelation;
    
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: politicalCorrelation.map(item => `${item.event} - ${item.celestialEvent}`),
        datasets: [
          {
            label: '相关性系数',
            data: politicalCorrelation.map(item => item.correlation * 100),
            backgroundColor: chartColors.background.slice(0, politicalCorrelation.length),
            borderColor: chartColors.border.slice(0, politicalCorrelation.length),
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '天象记录与历史事件的相关性分析',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          subtitle: {
            display: true,
            text: '基于历史文献的交叉分析',
            font: {
              size: 14
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `相关性: ${context.parsed.x.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: '相关性 (%)'
            }
          }
        }
      }
    });
  };
  
  // 每次组件重新渲染时，强制销毁所有图表实例
  useEffect(() => {
    // 组件卸载时清理所有图表实例
    return () => {
      safeDestroyChart();
    };
  }, [chartType]);
  
  // 渲染图表
  return (
    <div className={`relative ${className || ''}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 border-4 border-ancient-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-ancient-ink">分析天象数据中...</p>
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
      
      <div className="chart-container" style={{ position: 'relative', height: '100%', width: '100%' }}>
        <canvas id={canvasId} ref={chartRef}></canvas>
      </div>
      
      {!loading && !error && dataSource && (
        <motion.div 
          className="text-xs text-gray-500 mt-2 italic text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {dataSource}
        </motion.div>
      )}
    </div>
  );
};

export default CelestialDataCharts; 