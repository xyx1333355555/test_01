export const comparisonData = {
  // 历法精度比较
  calendarAccuracy: [
    {
      name: '太初历',
      period: '西汉',
      year: -104,
      tropicalYear: 365.25,
      modernValue: 365.2422,
      accuracy: 99.9979,
      description: '由邓平、落下闳等人制定，确立了以冬至为历法起点的原则'
    },
    {
      name: '四分历',
      period: '东汉',
      year: 85,
      tropicalYear: 365.25,
      modernValue: 365.2422,
      accuracy: 99.9979,
      description: '由刘洪制定，沿用太初历的基本原则，使用了更精确的观测数据'
    },
    {
      name: '大明历',
      period: '南北朝',
      year: 510,
      tropicalYear: 365.24281,
      modernValue: 365.2422,
      accuracy: 99.9998,
      description: '由祖冲之制定，对回归年长度的计算达到了极高的精度'
    },
    {
      name: '大衍历',
      period: '唐朝',
      year: 729,
      tropicalYear: 365.2446,
      modernValue: 365.2422,
      accuracy: 99.9993,
      description: '由一行和南宫说创制，引入了交食计算的新方法'
    },
    {
      name: '授时历',
      period: '元朝',
      year: 1281,
      tropicalYear: 365.2425,
      modernValue: 365.2422,
      accuracy: 99.9999,
      description: '由郭守敬主持编制，是中国古代最精确的历法之一'
    }
  ],
  
  // 天文观测精度比较
  observationAccuracy: [
    {
      phenomenon: '冬至点测定',
      ancientMethod: '圭表测影',
      ancientAccuracy: 0.5, // 单位：度
      modernMethod: '天体测量仪器',
      modernAccuracy: 0.0001, // 单位：度
      improvementFactor: 5000,
      significance: '冬至点的准确测定是历法制定的基础，对农业生产具有重要指导意义'
    },
    {
      phenomenon: '日食预测',
      ancientMethod: '历法计算',
      ancientAccuracy: 0.8, // 单位：小时
      modernMethod: '天文动力学模型',
      modernAccuracy: 0.0001, // 单位：小时
      improvementFactor: 8000,
      significance: '日食预测能力反映了对天体运行规律的掌握程度，也是政治和文化的重要组成部分'
    },
    {
      phenomenon: '恒星位置测量',
      ancientMethod: '浑天仪',
      ancientAccuracy: 0.3, // 单位：度
      modernMethod: '射电望远镜',
      modernAccuracy: 0.00001, // 单位：度
      improvementFactor: 30000,
      significance: '恒星位置的精确测量是星图绘制和导航的基础，对天文学发展至关重要'
    },
    {
      phenomenon: '行星运动预测',
      ancientMethod: '历法推算',
      ancientAccuracy: 1.2, // 单位：度
      modernMethod: '行星动力学模型',
      modernAccuracy: 0.0001, // 单位：度
      improvementFactor: 12000,
      significance: '行星运动预测反映了对太阳系结构的理解，是天文学核心研究内容之一'
    },
    {
      phenomenon: '岁差测量',
      ancientMethod: '长期天象记录比对',
      ancientAccuracy: 0.8, // 单位：角秒/年
      modernMethod: '高精度天体测量',
      modernAccuracy: 0.0001, // 单位：角秒/年
      improvementFactor: 8000,
      significance: '岁差测量反映了对地球自转轴变化的认识，是历法长期准确性的保证'
    }
  ],
  
  // 天文记录的科学价值
  scientificValue: [
    {
      recordType: '超新星记录',
      ancientRecords: 20,
      verifiedEvents: 18,
      modernSignificance: '为现代天文学提供了珍贵的历史数据，帮助确定超新星爆发的精确时间和位置，对恒星演化理论研究具有重要价值',
      historicalSignificance: '古代天文学家通过精确观测和记录"客星"现象，积累了宝贵的天文数据，反映了中国古代天象观测的系统性和连续性',
      modernResearch: '现代天体物理学利用这些记录确认了多个超新星遗迹，并计算出爆发的精确时间，为恒星演化末期的研究提供了重要证据',
      accuracyRate: 90,
      examples: [
        {
          event: 'SN 1054（蟹状星云超新星）',
          ancientDescription: '仁宗至和元年，客星见于天关，昼见如太白',
          modernDiscovery: '蟹状星云脉冲星是超新星爆发遗迹，通过中国古代记录确定了其爆发时间',
          scientificImpact: '该记录帮助天文学家确定了蟹状星云中的脉冲星形成时间，为中子星物理学提供了重要研究对象',
          imageUrl: '/images/scientific-value/sn1054.jpg'
        },
        {
          event: 'SN 1006（历史上最亮超新星）',
          ancientDescription: '真宗景德三年，客星见于参旗之西，大如半月，芒角四出，色赤白',
          modernDiscovery: '通过中国、日本、阿拉伯和欧洲的记录确认了这是历史上观测到的最亮超新星',
          scientificImpact: '该记录帮助确定了SN 1006的位置和亮度，使其成为研究Ia型超新星物理机制的关键样本',
          imageUrl: '/images/scientific-value/sn1006.jpg'
        },
        {
          event: 'SN 185（最早有详细记录的超新星）',
          ancientDescription: '灵帝光和二年，客星出现于南门，大如半筵',
          modernDiscovery: '现代天文学认为这是RCW 86超新星遗迹的爆发记录，是人类历史上第一颗有确切记录的超新星',
          scientificImpact: '该记录为超新星遗迹年龄测定提供了准确依据，有助于研究超新星爆发后的演化过程',
          imageUrl: '/images/scientific-value/sn185.jpg'
        },
        {
          event: 'SN 1181（古代精确记录的超新星）',
          ancientDescription: '宋孝宗淳熙八年，八月庚申，有客星见于嵯阳，色白',
          modernDiscovery: '2021年，天文学家确认脉冲星风星云IRAS 00500+6713是SN 1181的遗迹',
          scientificImpact: '这一最新研究成果证明中国古代天象记录对现代天文学研究仍具有重要价值',
          imageUrl: '/images/scientific-value/sn1181.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '唐以前', count: 4 },
          { period: '唐朝', count: 3 },
          { period: '宋朝', count: 8 },
          { period: '元朝', count: 1 },
          { period: '明朝', count: 3 },
          { period: '清朝', count: 1 }
        ],
        accuracyDistribution: [
          { level: '极高(90-100%)', count: 12 },
          { level: '高(80-90%)', count: 5 },
          { level: '中等(70-80%)', count: 2 },
          { level: '低(<70%)', count: 1 }
        ]
      }
    },
    {
      recordType: '彗星记录',
      ancientRecords: 581,
      verifiedEvents: 532,
      modernSignificance: '为彗星轨道计算和周期确定提供了长期数据，特别是对哈雷彗星的研究具有不可替代的价值',
      historicalSignificance: '中国是世界上记录彗星最系统、最连续的国家，从春秋到清代的彗星记录构成了人类最完整的彗星观测数据库之一',
      modernResearch: '现代天文学家利用这些记录重建了多颗彗星的历史轨道，特别是哈雷彗星的29次历史回归几乎都有中国的记录',
      accuracyRate: 91.6,
      examples: [
        {
          event: '哈雷彗星历史记录',
          ancientDescription: '多个朝代对哈雷彗星的详细描述，最早可追溯到公元前240年',
          modernDiscovery: '通过中国古代记录，天文学家能够追溯哈雷彗星的历史轨道变化',
          scientificImpact: '这些记录帮助天文学家计算哈雷彗星轨道的长期演化，验证了万有引力理论的准确性',
          imageUrl: '/images/scientific-value/halley.jpg'
        },
        {
          event: '客星与彗星区分',
          ancientDescription: '中国古代天文学家区分了"孛星"（彗星）和"客星"（新星或超新星）',
          modernDiscovery: '这种区分对现代天文学分类具有启发意义',
          scientificImpact: '中国古代天文学家的分类方法表明他们对不同天体现象有精确的认识，这种分类思想与现代天文学分类原则相符',
          imageUrl: '/images/scientific-value/comet-classification.jpg'
        },
        {
          event: '明朝万历年间彗星记录',
          ancientDescription: '万历三十五年，"有长尾彗星见，其状如剑"',
          modernDiscovery: '现代天文学家确认这是C/1607 P1彗星，与克普勒在同一时期的观测记录相吻合',
          scientificImpact: '东西方对同一彗星的记录对比研究，有助于验证彗星历史轨道和亮度变化',
          imageUrl: '/images/scientific-value/1607-comet.jpg'
        },
        {
          event: '唐朝大彗星记录',
          ancientDescription: '唐睿宗景云二年(711年)，"有大彗星出东方，长数丈，历天街，至于西方"',
          modernDiscovery: '现代研究表明这可能是一颗超大型彗星，其尾巴横跨大半个天空',
          scientificImpact: '通过这类历史记录，天文学家能研究彗星尺寸和活跃度的长期变化规律',
          imageUrl: '/images/scientific-value/tang-comet.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '春秋战国', count: 38 },
          { period: '秦汉', count: 102 },
          { period: '魏晋南北朝', count: 89 },
          { period: '隋唐', count: 105 },
          { period: '宋元', count: 127 },
          { period: '明清', count: 120 }
        ],
        accuracyDistribution: [
          { level: '极高(90-100%)', count: 421 },
          { level: '高(80-90%)', count: 89 },
          { level: '中等(70-80%)', count: 52 },
          { level: '低(<70%)', count: 19 }
        ]
      }
    },
    {
      recordType: '日月食记录',
      ancientRecords: 1046,
      verifiedEvents: 996,
      modernSignificance: '为地球自转速率长期变化研究提供了关键数据，帮助确定ΔT（地球时与世界时之差）的历史变化',
      historicalSignificance: '中国拥有世界上最长、最连续的日食和月食记录，从商代甲骨文到清代的记录跨越了约3500年',
      modernResearch: '现代天文学家利用这些记录研究地球自转减速率和潮汐摩擦效应，对地球动力学和天体力学研究有重要价值',
      accuracyRate: 95.2,
      examples: [
        {
          event: '公元前2137年日食',
          ancientDescription: '《尚书》记载的"羲和失职"日食',
          modernDiscovery: '通过这一记录，天文学家能够研究地球自转速率的长期变化',
          scientificImpact: '这是世界上最早的可能被验证的日食记录之一，为研究地球自转长期变化提供了关键节点',
          imageUrl: '/images/scientific-value/earliest-eclipse.jpg'
        },
        {
          event: '唐朝日食记录系列',
          ancientDescription: '唐朝天文官详细记录的多次日食，包括时间、位置和遮蔽程度',
          modernDiscovery: '这些记录帮助现代天文学家校准历史日食计算模型',
          scientificImpact: '唐朝精确的日食观测记录为地球自转历史变化研究提供了重要数据点，有助于建立更精确的ΔT变化模型',
          imageUrl: '/images/scientific-value/tang-eclipse.jpg'
        },
        {
          event: '宋朝日月食精确记录',
          ancientDescription: '宋代天文台系统记录的多次日月食，包括"既缺食复"的全过程时刻',
          modernDiscovery: '宋朝的日月食记录精度极高，可用于高精度地球自转变化研究',
          scientificImpact: '通过宋代的精确记录，现代科学家能够细致研究千年尺度上的地球自转变化规律',
          imageUrl: '/images/scientific-value/song-eclipse.jpg'
        },
        {
          event: '《春秋》日食记录系列',
          ancientDescription: '《春秋》中记录的37次日食，是世界上最早的系统性日食记录',
          modernDiscovery: '现代研究验证了《春秋》中36次日食记录的可靠性，准确率达97.3%',
          scientificImpact: '这些记录不仅有助于研究地球自转变化，也为古代历史年代学研究提供了天文学依据',
          imageUrl: '/images/scientific-value/spring-autumn-eclipse.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '商周', count: 42 },
          { period: '春秋战国', count: 98 },
          { period: '秦汉', count: 156 },
          { period: '魏晋南北朝', count: 189 },
          { period: '隋唐', count: 201 },
          { period: '宋元', count: 231 },
          { period: '明清', count: 129 }
        ],
        accuracyDistribution: [
          { level: '极高(95-100%)', count: 701 },
          { level: '高(90-95%)', count: 205 },
          { level: '中等(80-90%)', count: 72 },
          { level: '低(<80%)', count: 18 }
        ]
      }
    },
    {
      recordType: '流星记录',
      ancientRecords: 299,
      verifiedEvents: 270,
      modernSignificance: '为流星雨周期研究和母彗星确定提供了长期数据，特别是对英仙座和狮子座流星雨的研究具有重要价值',
      historicalSignificance: '中国是世界上最早系统记录流星和流星雨的国家，古代天文学家详细记录了流星的方位、亮度、颜色和数量',
      modernResearch: '现代天文学家通过这些记录研究了流星雨周期变化和母彗星轨道演化，为理解太阳系小天体动力学提供了长期数据',
      accuracyRate: 90.3,
      examples: [
        {
          event: '公元前687年流星雨',
          ancientDescription: '《春秋》记载的"庄公七年，夏四月，辛亥，夜，恒星不见，夜中星陨如雨"',
          modernDiscovery: '这可能是最早的英仙座流星雨记录，帮助确定其长期周期',
          scientificImpact: '通过这一记录，天文学家能够追踪英仙座流星雨母彗星轨道的长期演化历史',
          imageUrl: '/images/scientific-value/ancient-meteor.jpg'
        },
        {
          event: '唐朝流星雨记录',
          ancientDescription: '《旧唐书·天文志》记载的"文宗开成元年，流星如雨，自子至卯不绝"',
          modernDiscovery: '通过这些记录，天文学家能够研究流星雨母彗星的轨道演化',
          scientificImpact: '唐朝的多次流星雨记录为现代流星天文学提供了重要的历史数据点，有助于验证彗星演化模型',
          imageUrl: '/images/scientific-value/tang-meteor.jpg'
        },
        {
          event: '宋朝天文图中的流星记录',
          ancientDescription: '宋代《星图》中记录了流星出现的方位和天区，建立了初步的流星记录体系',
          modernDiscovery: '现代研究发现宋代流星记录包含了辐射点信息，可用于确定历史流星雨',
          scientificImpact: '这些记录帮助现代天文学家恢复了多个历史流星雨的辐射点和活跃期',
          imageUrl: '/images/scientific-value/song-meteor.jpg'
        },
        {
          event: '1833年狮子座流星雨',
          ancientDescription: '道光十三年记载："十月初四日夜，北京及各省均见大流星雨，满天流火，持续数时"',
          modernDiscovery: '这是著名的1833年狮子座流星雨，是首次被全球范围记录的大流星暴',
          scientificImpact: '中国对这次流星暴的详细记录与西方观测相互印证，为狮子座流星雨周期研究提供了关键数据',
          imageUrl: '/images/scientific-value/leonid-1833.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '春秋战国', count: 35 },
          { period: '秦汉', count: 56 },
          { period: '魏晋南北朝', count: 48 },
          { period: '隋唐', count: 62 },
          { period: '宋元', count: 58 },
          { period: '明清', count: 40 }
        ],
        accuracyDistribution: [
          { level: '极高(90-100%)', count: 180 },
          { level: '高(80-90%)', count: 63 },
          { level: '中等(70-80%)', count: 42 },
          { level: '低(<70%)', count: 14 }
        ]
      }
    },
    {
      recordType: '恒星观测',
      ancientRecords: 1464,
      verifiedEvents: 1350,
      modernSignificance: '中国古代的星表和星官体系为恒星变化研究提供了基础数据，对变星和恒星亮度变化研究具有参考价值',
      historicalSignificance: '中国是世界上最早建立完整恒星分类和命名系统的国家，二十八宿体系比西方的黄道十二宫更为精确和实用',
      modernResearch: '现代天文学家通过比对古代星表与现代观测，研究恒星的长期亮度变化、自行和演化过程',
      accuracyRate: 92.2,
      examples: [
        {
          event: '甘德、石申星表',
          ancientDescription: '战国时期甘德、石申记录的800多颗恒星',
          modernDiscovery: '这些早期星表帮助现代天文学家研究恒星亮度的长期变化',
          scientificImpact: '战国时期的星表是世界上最早的系统性恒星目录之一，对恒星演化研究具有重要参考价值',
          imageUrl: '/images/scientific-value/star-catalog.jpg'
        },
        {
          event: '苏颂《新仪象法要》星图',
          ancientDescription: '北宋苏颂绘制的详细星图，记录了1464颗恒星',
          modernDiscovery: '这些精确的历史星图为恒星位置和亮度变化研究提供了重要参考',
          scientificImpact: '宋代精确的星图帮助现代天文学家识别了多颗历史变星，并追踪了它们的长期变化规律',
          imageUrl: '/images/scientific-value/song-star-chart.jpg'
        },
        {
          event: '《天文大成》恒星记录',
          ancientDescription: '明代《天文大成》中详细记录的恒星亮度和颜色信息',
          modernDiscovery: '通过比对这些记录与现代观测，天文学家发现了一些恒星的长期亮度变化',
          scientificImpact: '明代详细的恒星描述为研究数百年尺度的恒星变化提供了可靠数据',
          imageUrl: '/images/scientific-value/ming-star-record.jpg'
        },
        {
          event: '中国古代对北极星的持续观测',
          ancientDescription: '从汉代到清代对北极星位置的连续记录，反映了岁差现象',
          modernDiscovery: '通过这些记录，现代天文学家能够研究地球自转轴的长期进动',
          scientificImpact: '中国古代对北极星变化的持续记录为研究地球自转轴进动提供了独特的历史数据',
          imageUrl: '/images/scientific-value/pole-star.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '战国', count: 800 },
          { period: '汉代', count: 783 },
          { period: '魏晋南北朝', count: 820 },
          { period: '隋唐', count: 1000 },
          { period: '宋元', count: 1464 },
          { period: '明清', count: 1550 }
        ],
        accuracyDistribution: [
          { level: '极高(90-100%)', count: 1020 },
          { level: '高(80-90%)', count: 253 },
          { level: '中等(70-80%)', count: 155 },
          { level: '低(<70%)', count: 36 }
        ]
      }
    },
    {
      recordType: '行星观测',
      ancientRecords: 2789,
      verifiedEvents: 2687,
      modernSignificance: '中国古代对五大行星的系统观测记录为研究行星轨道的长期演化提供了宝贵数据',
      historicalSignificance: '中国古代天文学将五大行星命名为金、木、水、火、土，开创了行星研究的先河，并积累了大量行星运行数据',
      modernResearch: '现代天文学家利用这些记录验证了行星轨道计算模型，并研究了太阳系动力学的长期稳定性',
      accuracyRate: 96.3,
      examples: [
        {
          event: '汉代五星合同记录',
          ancientDescription: '《汉书·天文志》记载："元封元年，五星聚于东井"',
          modernDiscovery: '现代计算验证了这次罕见的行星聚集现象，证实了汉代天文观测的准确性',
          scientificImpact: '这类罕见天象的记录为验证现代行星轨道长期演化模型提供了关键检验点',
          imageUrl: '/images/scientific-value/han-planets.jpg'
        },
        {
          event: '唐代木星"留"现象记录',
          ancientDescription: '《唐书·天文志》详细记录了木星的"留"（视运动方向改变）现象',
          modernDiscovery: '这些记录准确反映了木星的逆行现象，为研究行星视运动提供了历史数据',
          scientificImpact: '唐代对行星视运动变化的精确记录，展示了中国古代天文学家对复杂天象的深入理解',
          imageUrl: '/images/scientific-value/tang-jupiter.jpg'
        },
        {
          event: '宋代行星会合记录',
          ancientDescription: '宋代天文记录中详细记载了多次行星与恒星的会合现象',
          modernDiscovery: '现代研究证实这些记录的高精度，反映了宋代天文观测的科学水平',
          scientificImpact: '行星与特定恒星的会合记录为现代天文学提供了行星历史位置的精确测量点',
          imageUrl: '/images/scientific-value/song-conjunction.jpg'
        },
        {
          event: '明清时期火星观测',
          ancientDescription: '明清天文记录中对火星运行的详细描述，包括亮度和颜色变化',
          modernDiscovery: '这些记录帮助现代天文学家研究火星的长期亮度变化和大气变化',
          scientificImpact: '通过比对古代记录与现代观测，科学家能研究火星表面和大气的长期变化规律',
          imageUrl: '/images/scientific-value/mars-observation.jpg'
        }
      ],
      distribution: {
        timeDistribution: [
          { period: '春秋战国', count: 156 },
          { period: '秦汉', count: 385 },
          { period: '魏晋南北朝', count: 420 },
          { period: '隋唐', count: 562 },
          { period: '宋元', count: 693 },
          { period: '明清', count: 573 }
        ],
        accuracyDistribution: [
          { level: '极高(95-100%)', count: 2158 },
          { level: '高(90-95%)', count: 412 },
          { level: '中等(80-90%)', count: 106 },
          { level: '低(<80%)', count: 11 }
        ]
      }
    }
  ],
  
  // 宇宙观念的演变
  cosmologyEvolution: [
    {
      period: '夏商周',
      year: -1600,
      chineseModel: '盖天说雏形',
      description: '天圆地方，天如覆盖的伞，大地如方形的棋盘',
      westernCounterpart: '古希腊早期宇宙观',
      scientificValue: '反映了早期人类对宇宙的朴素认识，强调天地之间的对应关系'
    },
    {
      period: '战国',
      year: -350,
      chineseModel: '盖天说与浑天说并存',
      description: '盖天说认为天如鸡蛋壳，地如蛋黄；浑天说认为天地如鸡蛋，天包地，地浮于水',
      westernCounterpart: '亚里士多德地心说',
      scientificValue: '浑天说对天体运动的解释更为合理，为后世天文观测奠定了理论基础'
    },
    {
      period: '汉代',
      year: 100,
      chineseModel: '浑天说成为主流',
      description: '张衡《浑天仪注》系统阐述浑天说，认为宇宙如鸡子，天包地，地如浮于水中的蛋黄',
      westernCounterpart: '托勒密体系',
      scientificValue: '浑天说能够较好解释天体视运动，与实际观测结果相符'
    },
    {
      period: '唐宋',
      year: 800,
      chineseModel: '宣夜说与浑天说并存',
      description: '宣夜说认为天空无形无质，星辰在空中自由运行；浑天说继续发展，更加精细',
      westernCounterpart: '中世纪基督教宇宙观',
      scientificValue: '宣夜说包含了空间无限的思想萌芽，对后世天文学发展有启发意义'
    },
    {
      period: '明清',
      year: 1600,
      chineseModel: '西方日心说传入与中国传统宇宙观融合',
      description: '徐光启、李之藻翻译《几何原本》和《乾坤体义》，介绍哥白尼学说；梅文鼎等人融合中西方天文学',
      westernCounterpart: '哥白尼日心说、开普勒行星运动定律',
      scientificValue: '中西方天文学的交流与融合促进了科学发展，为现代天文学奠定了基础'
    }
  ],
  
  // 天文仪器的技术比较
  instrumentComparison: [
    {
      chineseInstrument: '浑天仪',
      inventionPeriod: '西汉',
      inventionYear: -100,
      westernEquivalent: '天球仪(Armillary Sphere)',
      westernInventionYear: 150,
      timeDifference: 250, // 中国早于西方的年数
      technicalAdvantages: '中国浑天仪结构更为复杂精密，包含赤道环、黄道环、子午环等多重环系，观测精度更高',
      historicalInfluence: '浑天仪的设计理念影响了后世天文观测仪器的发展，也传播到了阿拉伯和欧洲'
    },
    {
      chineseInstrument: '简仪',
      inventionPeriod: '战国',
      inventionYear: -300,
      westernEquivalent: '子午环(Meridian Ring)',
      westernInventionYear: 300,
      timeDifference: 600,
      technicalAdvantages: '简仪结构简单实用，便于携带和操作，为早期星表编制提供了工具支持',
      historicalInfluence: '简仪的设计理念体现了中国古代天文学家追求实用性的特点，为天文观测的普及做出了贡献'
    },
    {
      chineseInstrument: '圭表',
      inventionPeriod: '周代',
      inventionYear: -1000,
      westernEquivalent: '日晷(Gnomon)',
      westernInventionYear: -500,
      timeDifference: 500,
      technicalAdvantages: '中国圭表系统更为完善，不仅测量时间，还用于确定节气和地理纬度',
      historicalInfluence: '圭表观测积累的数据为中国历法制定提供了科学依据，对农业生产和社会生活产生了深远影响'
    },
    {
      chineseInstrument: '候风地动仪',
      inventionPeriod: '东汉',
      inventionYear: 132,
      westernEquivalent: '地震检测装置',
      westernInventionYear: 1800,
      timeDifference: 1668,
      technicalAdvantages: '张衡的候风地动仪能够检测远处地震并指示方向，机械设计极为精密',
      historicalInfluence: '候风地动仪是世界上第一台地震仪，比西方同类装置早1600多年，展示了中国古代科技的卓越成就'
    },
    {
      chineseInstrument: '水运仪象台',
      inventionPeriod: '北宋',
      inventionYear: 1090,
      westernEquivalent: '机械天文钟',
      westernInventionYear: 1330,
      timeDifference: 240,
      technicalAdvantages: '水运仪象台集天文观测和时间测量于一体，通过水力驱动，实现了天体运行的自动演示',
      historicalInfluence: '水运仪象台代表了中国古代机械技术和天文学的巅峰成就，为后世天文钟和机械装置的发展提供了启发'
    }
  ]
}; 