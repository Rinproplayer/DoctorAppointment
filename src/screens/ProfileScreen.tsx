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
  onOpenAdmin?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenWallet,
  onOpenVouchers,
  onOpenSettings,
  onOpenHelpCenter,
  onOpenFavorites,
  onLogout,
  onOpenAdmin,
}) => {
  const { profile, user, signOut, isConfigured, isAdmin, switchRoleDemo } = useAuth();

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

        {/* Admin Portal Entry Banner */}
        <TouchableOpacity
          style={styles.adminBanner}
          activeOpacity={0.85}
          onPress={onOpenAdmin}
        >
          <View style={styles.adminBannerIconBox}>
            <Ionicons name="shield-checkmark" size={24} color="#FBBF24" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.adminBannerTitle}>Trung Tâm Quản Trị</Text>
              <View style={styles.adminPill}>
                <Text style={styles.adminPillText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.adminBannerSub}>Quản lý bác sĩ, bệnh viện & duyệt lịch hẹn</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Quick Role Switcher for Demo */}
        <TouchableOpacity
          style={styles.roleToggleRow}
          activeOpacity={0.7}
          onPress={() => {
            const nextRole = isAdmin ? 'patient' : 'admin';
            switchRoleDemo(nextRole);
            Alert.alert(
              'Chuyển đổi vai trò',
              `Đã chuyển sang vai trò: ${nextRole === 'admin' ? 'Quản Trị Viên (Admin)' : 'Bệnh Nhân (Patient)'}`
            );
          }}
        >
          <Ionicons name="swap-horizontal" size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.roleToggleText}>
            {isAdmin ? 'Đổi sang vai trò Bệnh nhân' : 'Kích hoạt quyền Quản Trị Viên (Admin)'}
          </Text>
        </TouchableOpacity>

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
  adminBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  adminBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  adminPill: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  adminPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  adminBannerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  roleToggleRow: {
    marginHorizontal: 20,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
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
