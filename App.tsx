import './global.css';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppUsage, { AppUsageInfo } from './src/native-bridge/AppUsage';
import { UsageDashboard } from './src/components/UsageDashboard';
import { InterventionModal } from './src/components/InterventionModal';
import { PermissionPrompt } from './src/components/PermissionPrompt';
import { useUsagePermission } from './src/hooks/useUsagePermission';

function App(): React.JSX.Element {
  const { isGranted } = useUsagePermission();
  const [usageData, setUsageData] = useState<AppUsageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interventionApp, setInterventionApp] = useState<string | null>(null);

  const fetchUsageData = useCallback(async () => {
    if (isGranted) {
      setIsLoading(true);
      try {
        const data = await AppUsage.getForegroundUsage();
        // Sort by duration descending
        setUsageData(data.sort((a, b) => b.duration - a.duration));
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isGranted]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  if (isGranted === false) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <PermissionPrompt />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-brutalist-white">
        <StatusBar barStyle="dark-content" />
        
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <UsageDashboard 
            usageData={usageData} 
            onTriggerIntervention={setInterventionApp}
          />
        )}

        {/* High Friction Intervention */}
        <InterventionModal
          isVisible={!!interventionApp}
          appName={interventionApp || ''}
          onDismiss={() => setInterventionApp(null)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
