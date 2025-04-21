// 生成随机星星
function createStars() {
  const body = document.querySelector('body');
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    body.appendChild(star);
  }
}

// 鼠标移动视差效果
document.addEventListener('mousemove', (e) => {
  const planets = document.querySelectorAll('.planet');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  planets.forEach((planet, index) => {
    const speed = (index + 1) * 0.05;
    const x = (mouseX - 0.5) * speed * 100;
    const y = (mouseY - 0.5) * speed * 100;
    planet.style.transform = `translate(${x}px, ${y}px)`;
  });
  
  // 星星也随鼠标移动（更微妙的效果）
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    const speed = 0.01;
    const x = (mouseX - 0.5) * speed * 100;
    const y = (mouseY - 0.5) * speed * 100;
    star.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// 页面加载时初始化
window.addEventListener('load', () => {
  createStars();
}); 