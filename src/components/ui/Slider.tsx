import React from 'react';
import { cn } from '../../utils/cn';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  valueDisplay?: string | number;
}

export const Slider: React.FC<SliderProps> = ({ label, valueDisplay, className, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center text-xs font-medium text-gray-400">
        <label>{label}</label>
        <span className="font-mono text-gray-300">{valueDisplay ?? props.value}</span>
      </div>
      <input
        type="range"
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
        {...props}
      />
    </div>
  );
};
