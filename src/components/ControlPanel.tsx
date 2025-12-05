import React from 'react';
import { PatternConfig } from '../types/pattern';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { RefreshCw, Download, Settings2, MousePointer2, Zap, Palette } from 'lucide-react';
import { cn } from '../utils/cn';

interface ControlPanelProps {
  config: PatternConfig;
  onChange: (newConfig: PatternConfig) => void;
  onExport: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, onExport }) => {
  const updateGrid = (key: keyof PatternConfig['grid'], value: number) => {
    onChange({ ...config, grid: { ...config.grid, [key]: value } });
  };

  const updateVariation = (key: keyof PatternConfig['variation'], value: number | boolean) => {
    onChange({ ...config, variation: { ...config.variation, [key]: value } });
  };

  const updateEffector = (
    effector: keyof PatternConfig['effectors'],
    key: string,
    value: number | boolean
  ) => {
    onChange({
      ...config,
      effectors: {
        ...config.effectors,
        [effector]: { ...config.effectors[effector], [key]: value },
      },
    });
  };

  const updateStyle = (key: keyof PatternConfig['style'], value: string) => {
    onChange({ ...config, style: { ...config.style, [key]: value } });
  };

  return (
    <div className="w-80 bg-surface border-r border-border h-full overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          GridGen
        </h1>
      </div>

      {/* Grid Settings */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <Settings2 className="w-4 h-4 text-primary" />
          Grid Layout
        </div>
        <Slider
          label="Columns"
          min={2}
          max={50}
          value={config.grid.cols}
          onChange={(e) => updateGrid('cols', Number(e.target.value))}
        />
        <Slider
          label="Rows"
          min={2}
          max={50}
          value={config.grid.rows}
          onChange={(e) => updateGrid('rows', Number(e.target.value))}
        />
        <Slider
          label="Base Size"
          min={1}
          max={50}
          value={config.grid.baseRadius}
          onChange={(e) => updateGrid('baseRadius', Number(e.target.value))}
        />
        <Slider
          label="Gap"
          min={0}
          max={50}
          value={config.grid.gap}
          onChange={(e) => updateGrid('gap', Number(e.target.value))}
        />
      </section>

      <hr className="border-border" />

      {/* Variation Settings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
            <RefreshCw className="w-4 h-4 text-accent" />
            Variation
          </div>
          <button 
            onClick={() => updateVariation('seed', Math.floor(Math.random() * 10000))}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
            title="Randomize Seed"
          >
            <RefreshCw className="w-3 h-3 text-gray-400" />
          </button>
        </div>
        
        <Slider
          label="Size Variance"
          min={0}
          max={1}
          step={0.01}
          value={config.variation.sizeVariance}
          onChange={(e) => updateVariation('sizeVariance', Number(e.target.value))}
        />
        <Slider
          label="Opacity Variance"
          min={0}
          max={1}
          step={0.01}
          value={config.variation.opacityVariance}
          onChange={(e) => updateVariation('opacityVariance', Number(e.target.value))}
        />
        <div className="pt-2">
          <Switch
            label="Randomize Color"
            checked={config.variation.randomizeColor}
            onChange={(checked) => updateVariation('randomizeColor', checked)}
          />
        </div>
      </section>

      <hr className="border-border" />

      {/* Effectors */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <MousePointer2 className="w-4 h-4 text-secondary" />
          Effectors
        </div>
        
        <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <Switch
            label="Mouse Proximity"
            checked={config.effectors.mouseProximity.enabled}
            onChange={(checked) => updateEffector('mouseProximity', 'enabled', checked)}
          />
          {config.effectors.mouseProximity.enabled && (
            <div className="pl-2 border-l-2 border-secondary/30 space-y-3 mt-2">
              <Slider
                label="Radius"
                min={50}
                max={500}
                value={config.effectors.mouseProximity.radius}
                onChange={(e) => updateEffector('mouseProximity', 'radius', Number(e.target.value))}
              />
              <Slider
                label="Strength"
                min={1}
                max={5}
                step={0.1}
                value={config.effectors.mouseProximity.strength}
                onChange={(e) => updateEffector('mouseProximity', 'strength', Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <Switch
            label="Center Gravity"
            checked={config.effectors.centerGravity.enabled}
            onChange={(checked) => updateEffector('centerGravity', 'enabled', checked)}
          />
          {config.effectors.centerGravity.enabled && (
            <div className="pl-2 border-l-2 border-secondary/30 space-y-3 mt-2">
              <Slider
                label="Strength"
                min={0}
                max={3}
                step={0.1}
                value={config.effectors.centerGravity.strength}
                onChange={(e) => updateEffector('centerGravity', 'strength', Number(e.target.value))}
              />
            </div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Style */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <Palette className="w-4 h-4 text-success" />
          Appearance
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.style.color}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-xs font-mono text-gray-500">{config.style.color}</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.style.backgroundColor}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-xs font-mono text-gray-500">{config.style.backgroundColor}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-gray-400">Shape</label>
          <div className="flex bg-gray-800 p-1 rounded-lg">
            {(['circle', 'square', 'diamond'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => updateStyle('shape', shape)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                  config.style.shape === shape
                    ? "bg-gray-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-auto pt-6">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export SVG
        </button>
      </div>
    </div>
  );
};
