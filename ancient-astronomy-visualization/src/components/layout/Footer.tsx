import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-ancient-ink text-ancient-paper py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">中国古代天象记录与天文成就</h3>
            <p className="mb-4">
              探索中国古代天文学的成就、天象记录及其科学价值的沉浸式交互数据可视化平台
            </p>
            <p className="text-sm">
              © {new Date().getFullYear()} 古天文数据可视化项目
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">导航</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-ancient-gold transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-ancient-gold transition-colors">
                  历史时间线
                </Link>
              </li>
              <li>
                <Link href="/instruments" className="hover:text-ancient-gold transition-colors">
                  天文仪器
                </Link>
              </li>
              <li>
                <Link href="/records" className="hover:text-ancient-gold transition-colors">
                  天象记录
                </Link>
              </li>
              <li>
                <Link href="/scientific-value" className="hover:text-ancient-gold transition-colors">
                  科学价值
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">数据来源</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.zhihu.com/topic/19580961" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  《中国古代天文学史》
                </a>
              </li>
              <li>
                <a href="https://www.zhihu.com/topic/19580961" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  《中国科学技术史·天文学卷》
                </a>
              </li>
              <li>
                <a href="https://www.zhihu.com/topic/19580961" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  《中国古代天象记录的天文学研究》
                </a>
              </li>
              <li>
                <a href="https://www.zhihu.com/topic/19580961" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  《中国古代天文仪器史》
                </a>
              </li>
              <li>
                <a href="http://www.pmo.cas.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  中国科学院紫金山天文台
                </a>
              </li>
              <li>
                <a href="https://data.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-ancient-gold transition-colors">
                  NASA天文数据库
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
          <p>本项目为"中华自然科学及其它优秀文化瑰宝"主题创作，展示中国古代自然科学成就</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
