import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { AppUsageInfo } from '../native-bridge/AppUsage';

const HIGH_VALUE_PACKAGES = ['com.amazon.kindle', 'com.audible.application', 'com.duolingo'];
const TIME_LEAK_PACKAGES = [
  'com.instagram.android',
  'com.google.android.youtube',
  'com.zhiliaoapp.musically',
  'com.facebook.katana',
  'com.twitter.android'
];

interface UsageDashboardProps {
  usageData: AppUsageInfo[];
  onTriggerIntervention: (appName: string) => void;
  refreshControl?: React.ReactElement<typeof RefreshControl>;
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({ 
  usageData,
  onTriggerIntervention,
  refreshControl,
}) => {
  const categories = useMemo(() => {
    const highValue = usageData.filter(app => HIGH_VALUE_PACKAGES.includes(app.packageName));
    const timeLeaks = usageData.filter(app => TIME_LEAK_PACKAGES.includes(app.packageName));
    const others = usageData.filter(app => 
      !HIGH_VALUE_PACKAGES.includes(app.packageName) && 
      !TIME_LEAK_PACKAGES.includes(app.packageName)
    );

    return { highValue, timeLeaks, others };
  }, [usageData]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes}m`;
    return `${(minutes / 60).toFixed(1)}h`;
  };

  const UsageCard = ({ app, color, isLeak }: { app: AppUsageInfo, color: string, isLeak?: boolean }) => (
    <TouchableOpacity 
      onPress={() => isLeak && onTriggerIntervention(app.packageName)}
      className={`bg-brutalist-white border-4 border-brutalist-black p-4 mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${color}`}
    >
      <View className="flex-row justify-between items-end">
        <View className="flex-1">
          <Text className="text-brutalist-black font-black uppercase text-xs mb-1">
            {app.packageName.split('.').pop()}
          </Text>
          <Text className="text-brutalist-black font-black text-2xl uppercase">
            {formatDuration(app.duration)}
          </Text>
        </View>
        {isLeak && (
          <View className="bg-brutalist-red p-1 border-2 border-brutalist-black">
            <Text className="text-brutalist-white font-black text-[10px] uppercase">LEAK</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 24 }}
      refreshControl={refreshControl}
    >
      <View className="mb-8 bg-brutalist-black p-4 rotate-[-1deg]">
        <Text className="text-brutalist-white text-4xl font-black italic uppercase">
          Digital Inventory
        </Text>
      </View>

      {/* High-Value Section */}
      <View className="mb-10">
        <Text className="text-brutalist-black text-2xl font-black uppercase mb-4 underline decoration-brutalist-blue decoration-8">
          High Value Assets
        </Text>
        {categories.highValue.length > 0 ? (
          categories.highValue.map(app => (
            <UsageCard key={app.packageName} app={app} color="border-brutalist-blue" />
          ))
        ) : (
          <Text className="font-bold text-gray-500 italic">No deep work recorded yet.</Text>
        )}
      </View>

      {/* Time Leaks Section */}
      <View className="mb-10">
        <Text className="text-brutalist-black text-2xl font-black uppercase mb-4 underline decoration-brutalist-red decoration-8">
          Time Leaks
        </Text>
        {categories.timeLeaks.map(app => (
          <UsageCard key={app.packageName} app={app} color="border-brutalist-red" isLeak />
        ))}
      </View>

      {/* Others */}
      <View className="mb-20">
        <Text className="text-brutalist-black text-xl font-black uppercase mb-4">
          Utilities & Others
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.others.slice(0, 10).map(app => (
            <View key={app.packageName} className="w-[48%] bg-gray-100 border-2 border-brutalist-black p-2 mb-4">
              <Text className="text-[10px] font-black uppercase truncate">{app.packageName.split('.').pop()}</Text>
              <Text className="text-lg font-black">{formatDuration(app.duration)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
