import { type ReactNode } from 'react';
import { type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/theme';

type GradientName = keyof typeof gradients;

interface Props {
  name?: GradientName;
  colors?: readonly string[];
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
  /** Diagonal by default; pass false for a vertical top→bottom fill. */
  diagonal?: boolean;
}

/** Thin wrapper over expo-linear-gradient that pulls from the brand palette. */
export function Gradient({ name = 'primary', colors, style, children, diagonal = true }: Props) {
  const stops = (colors ?? gradients[name]) as [string, string, ...string[]];
  return (
    <LinearGradient
      colors={stops}
      start={{ x: 0, y: 0 }}
      end={diagonal ? { x: 1, y: 1 } : { x: 0, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
