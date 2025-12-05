export interface PatternConfig {
  grid: {
    rows: number;
    cols: number;
    gap: number;
    baseRadius: number;
  };
  variation: {
    seed: number;
    sizeVariance: number; // 0 to 1
    opacityVariance: number; // 0 to 1
    randomizeColor: boolean;
  };
  effectors: {
    mouseProximity: {
      enabled: boolean;
      radius: number;
      strength: number; // Multiplier for size
    };
    centerGravity: {
      enabled: boolean;
      strength: number;
    };
    wave: {
      enabled: boolean;
      frequency: number;
      amplitude: number;
      speed: number;
    };
  };
  style: {
    color: string;
    backgroundColor: string;
    shape: 'circle' | 'square' | 'diamond';
  };
}
