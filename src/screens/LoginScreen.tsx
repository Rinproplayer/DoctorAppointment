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

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onForgotPassword,
}) => {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('an.nguyen@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.success) {
      onLoginSuccess();
    } else {
      const isEmailNotConfirmed = res.error?.toLowerCase().includes('email not confirmed');
      const msg = isEmailNotConfirmed
        ? 'Email chưa được xác nhận trên Supabase. Bạn có thể kiểm tra email để xác nhận hoặc tắt "Confirm email" trong Supabase Dashboard (Authentication -> Providers -> Email) để đăng nhập ngay.'
        : (res.error || 'Đăng nhập không thành công');
      setErrorMessage(msg);
      Alert.alert(
        'Đăng nhập không thành công',
        msg,
        [
          { text: 'Đóng', style: 'cancel' },
          { text: 'Khám phá ngay (Demo)', onPress: onLoginSuccess }
        ]
      );
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

            <Text style={styles.bannerTitle}>Chào mừng bạn trở lại!</Text>
            <Text style={styles.bannerSubtitle}>
              {isConfigured ? 'Kết nối Supabase Cloud Backend' : 'Chế độ Demo (Chưa cấu hình Supabase API Key)'}
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

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={onForgotPassword}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            {/* Demo Quick Entry */}
            <TouchableOpacity
              style={styles.demoBtn}
              activeOpacity={0.8}
              onPress={onLoginSuccess}
            >
              <Ionicons name="sparkles-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.demoBtnText}>Trải nghiệm nhanh không cần đăng nhập</Text>
            </TouchableOpacity>

            {/* Social Logins */}
            <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7} onPress={handleLogin}>
                <Ionicons name="logo-apple" size={20} color="#000000" style={{ marginRight: 8 }} />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7} onPress={handleLogin}>
                <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 8 }} />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.footerLink}
              onPress={onGoToRegister}
            >
              <Text style={styles.footerLinkText}>
                Chưa có tài khoản? <Text style={styles.footerLinkBold}>Đăng ký</Text>
              </Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity style={styles.privacyLink}>
              <Text style={styles.privacyLinkText}>Chính sách bảo mật</Text>
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
  inputGroup: {
    marginBottom: 16,
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
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginTop: 12,
  },
  demoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
  dividerText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    marginVertical: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    color: colors.primary,
    fontWeight: '700',
  },
  privacyLink: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  privacyLinkText: {
    fontSize: 13,
    color: colors.primary,
  },
});
