import Android from './Android.svelte';
import Ios from './Ios.svelte';
import Linux from './Linux.svelte';
import Macos from './Macos.svelte';
import Windows from './Windows.svelte';

export const Platform = {
  Android: { name: 'Android', icon: Android },
  Windows: { name: 'Windows', icon: Windows },
  Linux: { name: 'Linux', icon: Linux },
  iOS: { name: 'iOS', icon: Ios },
  macOS: { name: 'macOS', icon: Macos },
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];
export const platforms = Object.values(Platform);
