import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.content} activeOpacity={0.9} onPress={onFinish}>
        {/* Abstract decor circles */}
        <View style={styles.decorTopLeft} />
        <View style={styles.decorBottomRight} />

        {/* Doctor Appointment Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <View style={styles.stethoscopeIcon}>
              <Ionicons name="medical" size={24} color={colors.primary} />
            </View>
            <Text style={styles.logoTitle}>DOCTOR</Text>
          </View>
          <Text style={styles.logoSubtitle}>A P P O I N T M E N T</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decorTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  decorBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stethoscopeIcon: {
    marginRight: 6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0C1F42',
    letterSpacing: 1.5,
  },
  logoSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 4,
    marginTop: 4,
  },
});
