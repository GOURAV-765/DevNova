import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const ThreeDBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse coordinates to range [-0.5, 0.5]
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none" style={{ zIndex: -10 }}>
      {/* Styles Injection */}
      <style>{`
        .scene-3d {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        
        /* 3D Cube Styles */
        .cube-3d {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          animation: spin-cube 25s infinite linear;
        }
        .cube-face {
          position: absolute;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
          border: 1.5px solid rgba(99, 102, 241, 0.4);
          backdrop-filter: blur(8px);
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.25), 0 8px 25px rgba(99, 102, 241, 0.15);
        }
        .dark .cube-face {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          border: 1.5px solid rgba(168, 85, 247, 0.45);
          box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.05), 0 10px 30px rgba(168, 85, 247, 0.3);
        }
        .face-front  { transform: rotateY(0deg) translateZ(50px); }
        .face-back   { transform: rotateY(180deg) translateZ(50px); }
        .face-left   { transform: rotateY(-90deg) translateZ(50px); }
        .face-right  { transform: rotateY(90deg) translateZ(50px); }
        .face-top    { transform: rotateX(90deg) translateZ(50px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(50px); }

        /* 3D Torus Ring Styles */
        .torus-3d {
          position: relative;
          width: 150px;
          height: 150px;
          transform-style: preserve-3d;
          animation: spin-torus 20s infinite linear;
        }
        .torus-slice {
          position: absolute;
          left: 45px;
          top: 45px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid rgba(6, 182, 212, 0.45);
          background: rgba(6, 182, 212, 0.05);
          transform-style: preserve-3d;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);
        }
        .dark .torus-slice {
          border: 2px solid rgba(168, 85, 247, 0.5);
          background: rgba(168, 85, 247, 0.08);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
        }
        
        /* Constructing Torus Ring Slices */
        .slice-0 { transform: rotateY(0deg) translateZ(65px); }
        .slice-1 { transform: rotateY(45deg) translateZ(65px); }
        .slice-2 { transform: rotateY(90deg) translateZ(65px); }
        .slice-3 { transform: rotateY(135deg) translateZ(65px); }
        .slice-4 { transform: rotateY(180deg) translateZ(65px); }
        .slice-5 { transform: rotateY(225deg) translateZ(65px); }
        .slice-6 { transform: rotateY(270deg) translateZ(65px); }
        .slice-7 { transform: rotateY(315deg) translateZ(65px); }

        /* Keyframes */
        @keyframes spin-cube {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes spin-torus {
          0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); }
        }
        
        .sphere-3d-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: float-sphere 12s infinite ease-in-out;
        }
        @keyframes float-sphere {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.04); }
        }

        /* Animated Background Blobs */
        .animated-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.28;
          z-index: -30;
        }
        .dark .animated-bg-blob {
          opacity: 0.38;
          filter: blur(120px);
        }
        .blob-indigo {
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0) 70%);
          top: -10%;
          left: -10%;
          animation: float-indigo 24s infinite alternate ease-in-out;
        }
        .blob-purple {
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(168, 85, 247, 0) 70%);
          bottom: -10%;
          right: -10%;
          animation: float-purple 28s infinite alternate ease-in-out;
        }
        .blob-cyan {
          width: 38vw;
          height: 38vw;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0) 70%);
          top: 35%;
          left: 25%;
          animation: float-cyan 22s infinite alternate ease-in-out;
        }

        @keyframes float-indigo {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(80px, 60px) scale(1.08); }
          100% { transform: translate(-40px, 110px) scale(0.95); }
        }
        @keyframes float-purple {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-90px, -50px) scale(0.92); }
          100% { transform: translate(50px, -100px) scale(1.08); }
        }
        @keyframes float-cyan {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -70px) scale(1.12); }
          100% { transform: translate(-60px, 60px) scale(0.88); }
        }
      `}</style>

      {/* Animated Liquid Background Mesh */}
      <div className="blob-indigo animated-bg-blob" />
      <div className="blob-purple animated-bg-blob" />
      <div className="blob-cyan animated-bg-blob" />

      {/* Floating 3D Cube (Top Right Area) */}
      <motion.div 
        className="absolute scene-3d top-[18%] right-[8%] opacity-75 dark:opacity-85 hidden sm:block"
        style={{
          x: mousePosition.x * 40,
          y: mousePosition.y * 40 + scrollY * 0.12,
          rotateX: scrollY * 0.05,
          rotateY: scrollY * 0.03,
        }}
      >
        <div className="cube-3d">
          <div className="cube-face face-front"></div>
          <div className="cube-face face-back"></div>
          <div className="cube-face face-left"></div>
          <div className="cube-face face-right"></div>
          <div className="cube-face face-top"></div>
          <div className="cube-face face-bottom"></div>
        </div>
      </motion.div>

      {/* 3D Rotating Torus Ring (Bottom Left Area) */}
      <motion.div 
        className="absolute scene-3d bottom-[22%] left-[6%] opacity-70 dark:opacity-85 hidden md:block"
        style={{
          x: mousePosition.x * -30,
          y: mousePosition.y * -30 + scrollY * -0.18,
          rotate: scrollY * -0.05,
        }}
      >
        <div className="torus-3d">
          <div className="torus-slice slice-0"></div>
          <div className="torus-slice slice-1"></div>
          <div className="torus-slice slice-2"></div>
          <div className="torus-slice slice-3"></div>
          <div className="torus-slice slice-4"></div>
          <div className="torus-slice slice-5"></div>
          <div className="torus-slice slice-6"></div>
          <div className="torus-slice slice-7"></div>
        </div>
      </motion.div>

      {/* Glossy 3D Orb 1 (Top Left, Indigo/Purple gradient) */}
      <motion.div
        className="absolute sphere-3d-glow top-[22%] left-[12%] opacity-45 dark:opacity-60"
        style={{
          width: '85px',
          height: '85px',
          background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.6), rgba(79, 70, 229, 0.75) 55%, rgba(49, 46, 129, 0.95))',
          boxShadow: 'inset -8px -8px 18px rgba(0, 0, 0, 0.45), inset 6px 6px 12px rgba(255, 255, 255, 0.15), 0 12px 35px rgba(99, 102, 241, 0.25)',
          x: mousePosition.x * 25,
          y: mousePosition.y * 25 + scrollY * 0.18,
        }}
      />

      {/* Glossy 3D Orb 2 (Middle Right, Cyan/Blue gradient) */}
      <motion.div
        className="absolute sphere-3d-glow top-[58%] right-[10%] opacity-40 dark:opacity-55"
        style={{
          width: '70px',
          height: '70px',
          background: 'radial-gradient(circle at 35% 35%, rgba(6, 182, 212, 0.6), rgba(8, 145, 178, 0.75) 55%, rgba(21, 94, 117, 0.95))',
          boxShadow: 'inset -6px -6px 15px rgba(0, 0, 0, 0.45), inset 5px 5px 10px rgba(255, 255, 255, 0.15), 0 10px 30px rgba(6, 182, 212, 0.25)',
          x: mousePosition.x * -20,
          y: mousePosition.y * -20 + scrollY * -0.22,
        }}
      />

      {/* Glossy 3D Orb 3 (Bottom Right, Magenta/Violet gradient) */}
      <motion.div
        className="absolute sphere-3d-glow bottom-[12%] right-[25%] opacity-35 dark:opacity-50"
        style={{
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.6), rgba(147, 51, 234, 0.75) 55%, rgba(88, 28, 135, 0.95))',
          boxShadow: 'inset -5px -5px 12px rgba(0, 0, 0, 0.45), inset 4px 4px 8px rgba(255, 255, 255, 0.15), 0 8px 25px rgba(168, 85, 247, 0.2)',
          x: mousePosition.x * 35,
          y: mousePosition.y * 35 + scrollY * 0.08,
        }}
      />

      {/* Ambient floating dust particles */}
      <motion.div 
        className="absolute inset-0 opacity-35 dark:opacity-50"
        style={{
          y: scrollY * -0.15,
        }}
      >
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const duration = Math.random() * 8 + 7;
          const delay = Math.random() * 6;
          return (
            <motion.div
              key={i}
              className="absolute bg-white dark:bg-primary/50 rounded-full"
              style={{
                width: size,
                height: size,
                top: `${top}%`,
                left: `${left}%`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default ThreeDBackground;
