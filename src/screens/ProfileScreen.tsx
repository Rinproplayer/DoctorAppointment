import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onOpenWallet: () => void;
  onOpenVouchers: () => void;
  onOpenSettings: () => void;
  onOpenHelpCenter: () => void;
  onOpenFavorites: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenWallet,
  onOpenVouchers,
  onOpenSettings,
  onOpenHelpCenter,
  onOpenFavorites,
  onLogout,
}) => {
  const { profile, user, signOut, isConfigured } = useAuth();

  const displayName = profile?.full_name || 'Nguyễn An';
  const displayEmail = profile?.email || user?.email || 'an.nguyen@example.com';

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          onLogout();
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 'personal_info',
      icon: 'person-outline' as const,
      label: 'Thông tin cá nhân',
      onPress: () => {},
    },
    {
      id: 'payment_methods',
      icon: 'card-outline' as const,
      label: 'Phương thức thanh toán',
      onPress: () => {},
    },
    {
      id: 'favorites',
      icon: 'heart-outline' as const,
      label: 'Yêu thích',
      onPress: onOpenFavorites,
    },
    {
      id: 'vouchers',
      icon: 'document-text-outline' as const,
      label: 'Mã giảm giá',
      onPress: onOpenVouchers,
    },
    {
      id: 'wallet',
      icon: 'wallet-outline' as const,
      label: 'Ví của tôi',
      onPress: onOpenWallet,
    },
    {
      id: 'settings',
      icon: 'settings-outline' as const,
      label: 'Cài đặt',
      onPress: onOpenSettings,
    },
    {
      id: 'help_center',
      icon: 'help-circle-outline' as const,
      label: 'Trung tâm trợ giúp',
      onPress: onOpenHelpCenter,
    },
    {
      id: 'health_records',
      icon: 'shield-checkmark-outline' as const,
      label: 'Hồ sơ sức khỏe',
      onPress: () => {},
    },
    {
      id: 'family_privacy',
      icon: 'people-outline' as const,
      label: 'Người thân & quyền riêng tư',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Avatar Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/user_avatar.jpg')}
              style={styles.userAvatar}
            />
            <TouchableOpacity style={styles.editPencilBtn}>
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>

          {/* Backend Status Badge */}
          <View style={styles.backendBadge}>
            <Ionicons
              name={isConfigured ? 'cloud-done-outline' : 'code-working-outline'}
              size={14}
              color={isConfigured ? '#10B981' : colors.primary}
            />
            <Text
              style={[
                styles.backendBadgeText,
                { color: isConfigured ? '#047857' : colors.primary },
              ]}
            >
              {isConfigured ? 'Supabase Connected' : 'Demo Local Auth'}
            </Text>
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.menuIconCircle}>
                <Ionicons name={item.icon} size={20} color="#0C1F42" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}

          {/* Logout button */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomWidth: 0, marginTop: 10 }]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Đăng xuất</Text>
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 18,
  },
  avatarWrapper: {
    position: 'relative',
  },
  userAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E5E7EB',
  },
  editPencilBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  backendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 6,
  },
  backendBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#0C1F42',
  },
});
