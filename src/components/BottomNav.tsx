import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type TabType = 'home' | 'explore' | 'appointments' | 'messages' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    {
      key: 'home' as TabType,
      label: 'Trang chủ',
      activeIcon: 'home' as const,
      inactiveIcon: 'home-outline' as const,
    },
    {
      key: 'explore' as TabType,
      label: 'Khám phá',
      activeIcon: 'location' as const,
      inactiveIcon: 'location-outline' as const,
    },
    {
      key: 'appointments' as TabType,
      label: 'Lịch hẹn',
      activeIcon: 'calendar' as const,
      inactiveIcon: 'calendar-outline' as const,
    },
    {
      key: 'messages' as TabType,
      label: 'Tin nhắn',
      activeIcon: 'chatbubble' as const,
      inactiveIcon: 'chatbubble-outline' as const,
    },
    {
      key: 'profile' as TabType,
      label: 'Tài khoản',
      activeIcon: 'person' as const,
      inactiveIcon: 'person-outline' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.inactiveIcon}
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors.primary : colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
