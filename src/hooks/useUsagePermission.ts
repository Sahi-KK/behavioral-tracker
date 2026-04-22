import { useState, useCallback, useEffect } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import UsageStats from '../native-bridge/UsageStats';

export const useUsagePermission = () => {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  const checkPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setIsGranted(true);
      return;
    }
    try {
      const granted = await UsageStats.isPermissionGranted();
      setIsGranted(granted);
    } catch (error) {
      console.error('Failed to check usage permission:', error);
      setIsGranted(false);
    }
  }, []);

  const requestPermission = useCallback(() => {
    if (Platform.OS === 'android') {
      UsageStats.navigateToSettings();
    }
  }, []);

  useEffect(() => {
    checkPermission();

    // Re-check when app comes back to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    isGranted,
    checkPermission,
    requestPermission,
  };
};
