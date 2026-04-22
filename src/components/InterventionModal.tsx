import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Modal, Pressable, Vibration } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing
} from 'react-native-reanimated';

interface InterventionModalProps {
  isVisible: boolean;
  appName: string;
  onDismiss: () => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isVisible,
  appName,
  onDismiss,
}) => {
  const progress = useSharedValue(0);
  const [isHolding, setIsHolding] = useState(false);

  const handlePressIn = () => {
    setIsHolding(true);
    progress.value = withTiming(1, { 
      duration: 5000, 
      easing: Easing.linear 
    }, (finished) => {
      if (finished) {
        runOnJS(completeDismiss)();
      }
    });
  };

  const handlePressOut = () => {
    setIsHolding(false);
    progress.value = withTiming(0, { duration: 300 });
  };

  const completeDismiss = () => {
    Vibration.vibrate(100);
    onDismiss();
  };

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-brutalist-yellow p-8 justify-between border-8 border-brutalist-black">
        <View>
          <View className="bg-brutalist-black p-4 mb-8">
            <Text className="text-brutalist-white text-5xl font-black italic">
              STOP.
            </Text>
          </View>
          
          <Text className="text-brutalist-black text-3xl font-black mb-4 uppercase leading-tight">
            You are leaking time into {appName}.
          </Text>
          
          <Text className="text-brutalist-black text-xl font-bold mb-8 border-l-8 border-brutalist-black pl-4">
            Is this who you want to be right now? Or is this just an impulse?
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-brutalist-black text-sm font-black mb-4 uppercase">
            {isHolding ? 'HOLD STEADY...' : 'HOLD TO ACKNOWLEDGE'}
          </Text>
          
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="w-full bg-brutalist-black h-24 justify-center items-center active:bg-brutalist-red border-4 border-brutalist-black"
          >
            <Animated.View 
              className="absolute left-0 top-0 bottom-0 bg-brutalist-red"
              style={animatedBarStyle}
            />
            <Text className="text-brutalist-white text-2xl font-black z-10">
              {isHolding ? '5.0 SECONDS' : 'I AM CONSCIOUS'}
            </Text>
          </Pressable>
          
          <View className="mt-8 bg-brutalist-white p-2 border-2 border-brutalist-black">
            <Text className="text-brutalist-black font-bold uppercase text-xs">
              High friction intended to break the loop.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
