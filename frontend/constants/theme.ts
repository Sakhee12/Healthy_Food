/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  healthy: {
    primary: '#a19494', // Deep Magenta
    primaryDark: '#8B008B',
    accentRed: '#B91428', // Goji Berry Red
    yellow: '#FFD700', // Vibrant Yellow
    white: '#FFFFFF',
    cream: '#FFF1E6', // Softer cream
    cardBackground: '#FAFAFA',
    mutedText: '#FFF6E5',
    textPrimary: '#FFFFFF',
    successGreen: '#1C8B39',
  },

  gradients: {
    // 🟢 ALL – Calm healthy green (default)
    all: ['#E8F5E9', '#FFFFFF'],

    // 🌸 HOLI – Soft festive but not flashy
    holi: ['#fbd8fcff', '#fcb6e7ff'],

    // 🌙 RAMZAN – (keep if already fine)
    ramzan: ['#E0F2E9', '#F0F9F4'],

    // 🧒 KIDS – (unchanged or playful)
    kids: ['#E3F2FD', '#BBDEFB'],

    // 🎁 GIFTING
    gifting: ['#FCE4EC', '#F8BBD0'],

    // 🌍 IMPORTED
    imported: ['#ECEFF1', '#CFD8DC'],

    // 😄 KUCH BHI – Fun but clean
    kuchBhi: ['#F3E5F5', '#E1BEE7'],
  },

  // gradients: {
  //   all: ['#f8d4c5b4', 'hsl(19, 96%, 81%)'], // Default All - Gold/Yellow gradient like Blinkit default sometimes
  //   holi: ['#f8b0d6', '#f3e598', '#c7feff'],
  //   ramzan: ['#E0F2E9', '#F0F9F4'], // Soft green from image
  //   kids: ['#E3F2FD', '#BBDEFB'], // Soft blue from image
  //   imported: ['#F5F0E1', '#E8DFCC'], // Soft tan/premium from image
  //   gifting: ['#faecc0', '#fde8a9'],
  //   kuchBhi: ['#f8c4e3', '#faa4fa'], // Keeping magenta here
  // },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
