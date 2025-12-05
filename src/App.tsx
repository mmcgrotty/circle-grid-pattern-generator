import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PatternCanvas } from './components/PatternCanvas';
import { PatternConfig } from './types/pattern';

const DEFAULT_CONFIG: PatternConfig = {
  grid: {
    rows: 12,
    cols: 16,
    gap: 12,
    baseRadius: 8,
  },
  variation: {
    seed: 12345,
    sizeVariance: 0.2,
    opacityVariance: 0.1,
    randomizeColor: false,
  },
  effectors: {
    mouseProximity: {
      enabled: true,
      radius: 200,
      strength: 2.5,
    },
    centerGravity: {
      enabled: false,
      strength: 1,
    },
    wave: {
      enabled: false,
      frequency: 1,
      amplitude: 10,
      speed: 1,
    },
  },
  style: {
    color: '#9E7FFF',
    backgroundColor: '#171717',
    shape: 'circle',
  },
};

function App() {
  const [config, setConfig] = useState<PatternConfig>(DEFAULT_CONFIG);

  const handleExport = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${config.variation.seed}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-full bg-background text-text overflow-hidden font-sans">
      <ControlPanel 
        config={config} 
        onChange={setConfig} 
        onExport={handleExport}
      />
      <main className="flex-1 relative">
        <PatternCanvas config={config} />
      </main>
    </div>
  );
}

export default App;
