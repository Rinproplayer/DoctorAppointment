import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { conversationsData, Conversation } from '../data/messages';

interface MessagesScreenProps {
  onOpenConversation: (conv: Conversation) => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ onOpenConversation }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'consulting'>('all');
  const [searchText, setSearchText] = useState('');

  const filteredConversations = conversationsData.filter((conv) => {
    if (activeTab === 'unread' && conv.unreadCount === 0) return false;
    if (activeTab === 'consulting' && conv.statusTag !== 'consulting') return false;
    if (searchText && !conv.doctorName.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bác sĩ, cuộc trò chuyện..."
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.pill, activeTab === 'all' && styles.pillActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.pillText, activeTab === 'all' && styles.pillTextActive]}>Tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeTab === 'unread' && styles.pillActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.pillText, activeTab === 'unread' && styles.pillTextActive]}>Chưa đọc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeTab === 'consulting' && styles.pillActive]}
          onPress={() => setActiveTab('consulting')}
        >
          <Text style={[styles.pillText, activeTab === 'consulting' && styles.pillTextActive]}>Đang tư vấn</Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredConversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.convItem}
            activeOpacity={0.8}
            onPress={() => onOpenConversation(conv)}
          >
            <View style={styles.avatarWrapper}>
              <Image source={conv.avatar} style={styles.avatar} />
              {conv.onlineStatus === 'Đang trực tuyến' && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.convDetails}>
              <View style={styles.convTopRow}>
                <Text style={styles.doctorName}>{conv.doctorName}</Text>
                <Text style={styles.timestamp}>{conv.timestamp}</Text>
              </View>

              <Text style={styles.specialtyText}>
                {conv.specialty} • {conv.onlineStatus}
              </Text>

              <View style={styles.convBottomRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
                {conv.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  convDetails: {
    flex: 1,
    marginLeft: 14,
  },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  convBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
