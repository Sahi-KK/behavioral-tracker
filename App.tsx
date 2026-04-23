import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppUsage, { AppUsageInfo } from './src/native-bridge/AppUsage';
import { UsageDashboard } from './src/components/UsageDashboard';
import { InterventionModal } from './src/components/InterventionModal';
import { PermissionPrompt } from './src/components/PermissionPrompt';
import { useUsagePermission } from './src/hooks/useUsagePermission';

const REFRESH_INTERVAL_MS = 30000; // Auto-refresh every 30 seconds

function App(): React.JSX.Element {
  const { isGranted } = useUsagePermission();
  const [usageData, setUsageData] = useState<AppUsageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [interventionApp, setInterventionApp] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUsageData = useCallback(async (silent = false) => {
    if (!isGranted) return;
    if (!silent) setIsLoading(true);
    try {
      const data = await AppUsage.getForegroundUsage();
      setUsageData(data.sort((a, b) => b.duration - a.duration));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isGranted]);

  const handlePullRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsageData(true);
  }, [fetchUsageData]);

  // Initial load + auto-refresh every 30 seconds
  useEffect(() => {
    if (!isGranted) return;
    fetchUsageData(false);

    intervalRef.current = setInterval(() => {
      fetchUsageData(true); // silent refresh (no spinner)
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isGranted, fetchUsageData]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (isGranted === false) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <PermissionPrompt />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFF00" />

        {/* Header with refresh button */}
        <View style={{ backgroundColor: '#FFFF00', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 4, borderColor: '#000' }}>
          <Text style={{ fontWeight: '900', fontSize: 16, textTransform: 'uppercase', color: '#000' }}>
            Today's Usage
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={handlePullRefresh}
              style={{ backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 0 }}
            >
              <Text style={{ color: '#FFFF00', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' }}>
                ↻ Refresh
              </Text>
            </TouchableOpacity>
            {lastUpdated && (
              <Text style={{ fontSize: 9, color: '#333', marginTop: 2 }}>
                Updated: {formatTime(lastUpdated)}
              </Text>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ marginTop: 12, fontWeight: '900', textTransform: 'uppercase', color: '#000' }}>
              Loading Today's Data...
            </Text>
          </View>
        ) : (
          <UsageDashboard
            usageData={usageData}
            onTriggerIntervention={setInterventionApp}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handlePullRefresh}
                colors={['#000000']}
                tintColor="#000000"
              />
            }
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
