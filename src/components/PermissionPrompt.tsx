import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { useUsagePermission } from '../hooks/useUsagePermission';

export const PermissionPrompt: React.FC = () => {
  const { isGranted, requestPermission } = useUsagePermission();

  if (Platform.OS !== 'android' || isGranted === true || isGranted === null) {
    return null;
  }

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Action Required</Text>
          <Text style={styles.description}>
            To track your behavior and improve your habits, this app needs
            <Text style={styles.highlight}> Usage Access</Text>. This allows us
            to monitor app usage patterns.
          </Text>
          <Text style={styles.instruction}>
            Tap below, then find <Text style={styles.bold}>BehavioralTracker</Text> in
            the list and toggle 'Allow usage tracking'.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A1A1AA',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  highlight: {
    color: '#6366F1',
    fontWeight: '700',
  },
  instruction: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  bold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
