import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

interface RegisterScreenProps {
  onRegisterSuccess: (email: string) => void;
  onGoToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onGoToLogin,
}) => {
  const { signUp, isConfigured } = useAuth();
  const [fullName, setFullName] = useState('Nguyễn An');
  const [email, setEmail] = useState('an.nguyen@gmail.com');
  const [password, setPassword] = useState('123456');
  const [agreePolicy, setAgreePolicy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!agreePolicy) {
      Alert.alert('Thông báo', 'Vui lòng đồng ý với Chính sách bảo mật');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    const res = await signUp(email, password, fullName);
    setLoading(false);

    if (res.success) {
      if (res.needVerification) {
        Alert.alert(
          'Đăng ký tài khoản thành công',
          'Tài khoản đã được tạo trên Supabase! Vui lòng kiểm tra email của bạn để xác nhận (hoặc bạn có thể tắt "Confirm email" trong Supabase Dashboard -> Authentication -> Providers -> Email để đăng nhập tức thì).',
          [{ text: 'Tiếp tục', onPress: () => onRegisterSuccess(email) }]
        );
      } else {
        onRegisterSuccess(email);
      }
    } else {
      setErrorMessage(res.error || 'Đăng ký không thành công');
      Alert.alert('Đăng ký thất bại', res.error || 'Vui lòng thử lại');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Blue Header Banner */}
          <View style={styles.headerBanner}>
            <View style={styles.logoRow}>
              <View style={styles.stethoscopeIcon}>
                <Ionicons name="medical" size={20} color={colors.primary} />
              </View>
              <Text style={styles.logoText}>DOCTOR</Text>
            </View>
            <Text style={styles.logoSubText}>A P P O I N T M E N T</Text>

            <Text style={styles.bannerTitle}>Tạo tài khoản</Text>
            <Text style={styles.bannerSubtitle}>
              {isConfigured ? 'Lưu trữ thông tin an toàn với Supabase DB' : 'Chế độ Demo (Chưa cấu hình Supabase API Key)'}
            </Text>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Social Logins 3 buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.dividerText}>Hoặc tiếp tục với email</Text>

            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu (tối thiểu 6 ký tự)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Checkbox agreement */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreePolicy(!agreePolicy)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreePolicy && styles.checkboxChecked]}>
                {agreePolicy && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Tôi đồng ý với Chính sách bảo mật</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.footerLink}
              onPress={onGoToLogin}
            >
              <Text style={styles.footerLinkText}>
                Đã có tài khoản? <Text style={styles.footerLinkBold}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBanner: {
    backgroundColor: colors.primary,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stethoscopeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoSubText: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    flex: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dividerText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    marginVertical: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 28,
  },
  footerLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});
