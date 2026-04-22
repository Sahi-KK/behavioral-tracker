import { NativeModules, Platform } from 'react-native';

const { UsageStatsModule } = NativeModules;

export interface IUsageStatsModule {
  isPermissionGranted(): Promise<boolean>;
  navigateToSettings(): void;
}

/**
 * UsageStatsModule bridge.
 * Only available on Android.
 */
export default UsageStatsModule as IUsageStatsModule;
