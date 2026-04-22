import { NativeModules, Platform } from 'react-native';

const { AppUsageModule } = NativeModules;

export interface AppUsageInfo {
  packageName: string;
  duration: number; // In milliseconds
}

export interface IAppUsageModule {
  /**
   * Fetches the total foreground time of all user-facing applications
   * over the last 24 hours.
   */
  getForegroundUsage(): Promise<AppUsageInfo[]>;
}

/**
 * AppUsageModule bridge.
 * Only available on Android.
 */
export default AppUsageModule as IAppUsageModule;
