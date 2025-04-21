import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  // 设置响应头为图像
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  // 生成一个简单的渐变SVG作为临时占位图
  const colors: Record<string, string[]> = {
    'ancient-calendar-vr': ['#1e3a8a', '#1e40af'],
    'ancient-observation-vr': ['#064e3b', '#065f46'],
    'scientific-value-vr': ['#581c87', '#7e22ce'],
    'cosmology-vr': ['#0c4a6e', '#0369a1'],
    'instruments-vr': ['#713f12', '#a16207'],
  };

  const imageName = Array.isArray(name) ? name[0] : name || 'default';
  const [color1, color2] = colors[imageName] || ['#111827', '#374151'];

  // 创建SVG
  const svg = `
    <svg width="2000" height="1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="stars" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.8);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="2000" height="1000" fill="url(#grad)" />
      
      <!-- 绘制一些随机星星 -->
      ${Array.from({ length: 200 }, (_, i) => {
        const x = Math.random() * 2000;
        const y = Math.random() * 1000;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}" />`;
      }).join('')}
      
      <!-- 添加文字 -->
      <text x="1000" y="500" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${imageName.replace(/-/g, ' ').toUpperCase()}
      </text>
      <text x="1000" y="580" font-family="Arial" font-size="30" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">
        临时VR场景图像
      </text>
    </svg>
  `;

  res.status(200).send(svg);
} 