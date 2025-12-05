import React, { useRef, useMemo, useState, useEffect } from 'react';
import { PatternConfig } from '../types/pattern';
import { SeededRandom, distance, mapRange, clamp } from '../utils/math';

interface PatternCanvasProps {
  config: PatternConfig;
}

export const PatternCanvas: React.FC<PatternCanvasProps> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  // Handle resize
  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  // Generate grid points
  const points = useMemo(() => {
    const { rows, cols, gap, baseRadius } = config.grid;
    const { seed, sizeVariance, opacityVariance, randomizeColor } = config.variation;
    
    const rng = new SeededRandom(seed);
    const pts = [];

    // Calculate total grid size to center it
    const cellWidth = baseRadius * 2 + gap;
    const cellHeight = baseRadius * 2 + gap;
    const gridWidth = cols * cellWidth - gap;
    const gridHeight = rows * cellHeight - gap;

    const startX = (dimensions.width - gridWidth) / 2 + baseRadius;
    const startY = (dimensions.height - gridHeight) / 2 + baseRadius;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * cellWidth;
        const y = startY + r * cellHeight;
        
        // Base variations from seed
        const randomScale = 1 + (rng.next() * 2 - 1) * sizeVariance;
        const randomOpacity = 1 - rng.next() * opacityVariance;
        const hueShift = randomizeColor ? rng.range(-30, 30) : 0;

        pts.push({
          id: `${r}-${c}`,
          baseX: x,
          baseY: y,
          baseR: baseRadius,
          randomScale,
          randomOpacity,
          hueShift,
        });
      }
    }
    return pts;
  }, [config.grid, config.variation, dimensions]);

  return (
    <div className="flex-1 h-full bg-[#121212] relative overflow-hidden flex items-center justify-center p-8">
      <div 
        className="relative shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
        style={{ 
          backgroundColor: config.style.backgroundColor,
          width: '100%',
          height: '100%',
          maxWidth: '1200px',
          maxHeight: '800px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair"
          xmlns="http://www.w3.org/2000/svg"
        >
          {points.map((pt) => {
            let currentRadius = pt.baseR * pt.randomScale;
            
            // Apply Mouse Proximity Effector
            if (config.effectors.mouseProximity.enabled) {
              const d = distance(mousePos.x, mousePos.y, pt.baseX, pt.baseY);
              const { radius, strength } = config.effectors.mouseProximity;
              
              if (d < radius) {
                const factor = mapRange(d, 0, radius, strength, 1);
                // Smooth easing
                const easedFactor = 1 + (factor - 1) * (factor - 1); 
                currentRadius *= easedFactor;
              }
            }

            // Apply Center Gravity Effector
            if (config.effectors.centerGravity.enabled) {
              const centerX = dimensions.width / 2;
              const centerY = dimensions.height / 2;
              const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
              const d = distance(centerX, centerY, pt.baseX, pt.baseY);
              
              const strength = config.effectors.centerGravity.strength;
              // Inverse distance: closer to center = larger
              const factor = mapRange(d, 0, maxDist, 1 + strength, 0.5);
              currentRadius *= Math.max(0, factor);
            }

            // Clamp radius to prevent negative values
            currentRadius = Math.max(0, currentRadius);

            // Color calculation
            // We can use CSS filters for hue rotation if needed, or inline styles
            const style: React.CSSProperties = {
              fill: config.style.color,
              opacity: pt.randomOpacity,
              transition: 'r 0.2s cubic-bezier(0.2, 0, 0.2, 1), width 0.2s, height 0.2s',
              filter: pt.hueShift !== 0 ? `hue-rotate(${pt.hueShift}deg)` : undefined,
              transformOrigin: `${pt.baseX}px ${pt.baseY}px`,
            };

            if (config.style.shape === 'square') {
              return (
                <rect
                  key={pt.id}
                  x={pt.baseX - currentRadius}
                  y={pt.baseY - currentRadius}
                  width={currentRadius * 2}
                  height={currentRadius * 2}
                  style={style}
                />
              );
            } else if (config.style.shape === 'diamond') {
               return (
                <rect
                  key={pt.id}
                  x={pt.baseX - currentRadius}
                  y={pt.baseY - currentRadius}
                  width={currentRadius * 2}
                  height={currentRadius * 2}
                  style={{...style, transform: `rotate(45deg)`, transformOrigin: `${pt.baseX}px ${pt.baseY}px`}}
                />
              );
            }

            return (
              <circle
                key={pt.id}
                cx={pt.baseX}
                cy={pt.baseY}
                r={currentRadius}
                style={style}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Overlay Info */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono pointer-events-none">
        {points.length} elements generated
      </div>
    </div>
  );
};
