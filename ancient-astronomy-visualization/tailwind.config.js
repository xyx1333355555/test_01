/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          ancient: {
            paper: '#f5e6c8',
            ink: '#2c2c2c',
            gold: '#d4af37',
            bronze: '#cd7f32',
            jade: '#00a86b',
            red: '#c41e3a',
            dark: '#121236',
            nebula: '#663399',
            cosmic: '#1a1a3a',
            sunlight: '#ffd700',
            moonlight: '#e6e6fa',
            starlight: '#f8f8ff',
            parchment: '#f3e0c0',
            bamboo: '#d6c9a0',
            terracotta: '#b56357',
            celadon: '#88b5ad',
            lacquer: '#7c0a02',
            imperial: '#592720',
            celestial: '#1c1c3c',
            observatory: '#3c2c2c',
            eclipse: '#2d132c',
            astrolabe: '#826644',
            comet: '#738dc8',
            meteor: '#ff6b6b',
            galaxy: '#171730',
            supernova: '#ffbd39',
            star: '#f9f2da',
            venus: '#eeddaa',
            mars: '#aa4433',
            jupiter: '#e0b486',
            saturn: '#d0c1a0',
          },
        },
        fontFamily: {
          sans: ['var(--font-sans)', 'sans-serif'],
          serif: ['var(--font-serif)', 'serif'],
          mono: ['var(--font-mono)', 'monospace'],
        },
        animation: {
          'star-twinkle': 'twinkle 3s ease-in-out infinite',
          'float': 'float 6s ease-in-out infinite',
          'meteor': 'meteor 10s linear infinite',
          'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
          'orbit': 'orbit 20s linear infinite',
          'cosmic-spin': 'spin 30s linear infinite',
          'star-shimmer': 'shimmer 3s ease-in-out infinite',
          'slow-rotate': 'rotate 30s linear infinite',
          'gentle-bob': 'bob 5s ease-in-out infinite',
          'fade-pulse': 'fadePulse 4s ease-in-out infinite',
          'grow-shrink': 'growShrink 8s ease-in-out infinite',
          'constellation-draw': 'draw 3s linear forwards',
        },
        keyframes: {
          twinkle: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          meteor: {
            '0%': { transform: 'translateX(0) translateY(0)', opacity: 0 },
            '10%': { opacity: 1 },
            '100%': { transform: 'translateX(-300px) translateY(300px)', opacity: 0 },
          },
          pulseGlow: {
            '0%, 100%': { boxShadow: '0 0 15px 0 rgba(255, 215, 0, 0.7)' },
            '50%': { boxShadow: '0 0 30px 5px rgba(255, 215, 0, 0.9)' },
          },
          orbit: {
            '0%': { transform: 'rotate(0deg) translateX(50px) rotate(0deg)' },
            '100%': { transform: 'rotate(360deg) translateX(50px) rotate(-360deg)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          bob: {
            '0%, 100%': { transform: 'translateY(0) scale(1)' },
            '50%': { transform: 'translateY(-5px) scale(1.05)' },
          },
          fadePulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.6 },
          },
          growShrink: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
          },
          draw: {
            '0%': { strokeDashoffset: '1000' },
            '100%': { strokeDashoffset: '0' },
          },
        },
        backgroundImage: {
          'star-field': 'radial-gradient(circle at center, #f8f8ff 1px, transparent 1px)',
          'nebula-gradient': 'linear-gradient(135deg, rgba(102, 51, 153, 0.7) 0%, rgba(26, 26, 58, 0.7) 100%)',
          'golden-scroll': 'linear-gradient(to right, transparent, #d4af37 20%, #d4af37 80%, transparent 100%)',
          'cosmic-gradient': 'linear-gradient(to bottom, #0a0a20, #1a1a3a)',
          'ancient-paper': 'repeating-linear-gradient(45deg, rgba(243, 224, 192, 0.9), rgba(243, 224, 192, 0.9) 20px, rgba(231, 212, 180, 0.8) 20px, rgba(231, 212, 180, 0.8) 40px)',
          'celestial-chart': 'radial-gradient(circle at center, rgba(26, 26, 58, 0.3) 0%, rgba(26, 26, 58, 0) 70%)',
          'silk-pattern': 'repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.1) 10px, rgba(212, 175, 55, 0.05) 10px, rgba(212, 175, 55, 0.05) 20px)',
          'eclipse-gradient': 'radial-gradient(circle, #1a1a3a 30%, #0a0a20 70%)',
          'stardust': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0.5px, transparent 1px), radial-gradient(circle at center, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px)',
        },
        boxShadow: {
          'cosmic': '0 0 20px rgba(255, 215, 0, 0.5)',
          'starlight': '0 0 10px rgba(248, 248, 255, 0.8)',
          'astrolabe': '0 10px 30px -10px rgba(130, 102, 68, 0.5)',
          'eclipse': '0 0 50px rgba(45, 19, 44, 0.7)',
          'jade': '0 5px 15px rgba(0, 168, 107, 0.4)',
          'scroll': '0 10px 20px rgba(0, 0, 0, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.1)',
          'cosmic-item': '0 4px 12px rgba(26, 26, 58, 0.5), 0 0 15px rgba(212, 175, 55, 0.3)',
        },
        borderRadius: {
          'scroll': '0.5rem 2rem 0.5rem 2rem',
          'artifact': '38% 62% 63% 37% / 41% 44% 56% 59%',
        },
        textShadow: {
          'glow': '0 0 5px rgba(255, 215, 0, 0.7)',
          'cosmic': '0 0 8px rgba(26, 26, 58, 0.8)',
        },
        backdropFilter: {
          'cosmic': 'blur(8px) saturate(180%)',
        },
      },
    },
    plugins: [
      function({ addUtilities }) {
        const newUtilities = {
          '.text-shadow-glow': {
            textShadow: '0 0 5px rgba(255, 215, 0, 0.7)'
          },
          '.text-shadow-cosmic': {
            textShadow: '0 0 8px rgba(26, 26, 58, 0.8)'
          },
          '.backdrop-cosmic': {
            backdropFilter: 'blur(8px) saturate(180%)'
          },
          '.text-vertical': {
            writingMode: 'vertical-rl'
          },
          '.scrollbar-hidden': {
            'scrollbarWidth': 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
          '.bg-blend-overlay': {
            'backgroundBlendMode': 'overlay'
          },
          '.text-outline': {
            'textShadow': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
          },
        }
        addUtilities(newUtilities, ['responsive', 'hover'])
      }
    ],
  }