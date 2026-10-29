import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface OtpScreenProps {
  email?: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  email = 'an.nguyen@example.com',
  onVerifySuccess,
  onBack,
}) => {
  const { verifyOtp } = useAuth();
  const [digits, setDigits] = useState(['3', '6', '3', '6', '3', '6']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    const token = digits.join('');
    setLoading(true);
    const res = await verifyOtp(email, token);
    setLoading(false);

    if (res.success) {
      Alert.alert('Thành công', 'Tài khoản của bạn đã được xác thực thành công!', [
        { text: 'Bắt đầu', onPress: onVerifySuccess },
      ]);
    } else {
      Alert.alert('Xác thực thất bại', res.error || 'Mã xác thực không hợp lệ');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.resend({
          type: 'signup',
          email: email.trim(),
        });
      }
      Alert.alert('Đã gửi lại mã', `Mã xác thực mới đã được gửi tới ${email}`);
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Không thể gửi lại mã');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#0C1F42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác thực OTP</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>Kiểm tra email của bạn</Text>
        <Text style={styles.subTitle}>
          Nhập mã xác thực đã gửi đến{'\n'}{email}
        </Text>

        {/* 6 Digit Input Boxes */}
        <View style={styles.codeRow}>
          {digits.map((digit, idx) => (
            <TextInput
              key={idx}
              style={styles.digitBox}
              value={digit}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => {
                const nextDigits = [...digits];
                nextDigits[idx] = text;
                setDigits(nextDigits);
              }}
            />
          ))}
        </View>

        <Text style={styles.timerText}>Mã có hiệu lực trong 02:00</Text>

        {/* Resend Code Button */}
        <TouchableOpacity
          style={styles.resendBtn}
          activeOpacity={0.8}
          onPress={handleResend}
          disabled={resending}
        >
          {resending ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.resendBtnText}>Gửi lại mã</Text>
          )}
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyBtn}
          activeOpacity={0.85}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyBtnText}>Xác thực</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  digitBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#0C1F42',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  timerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  resendBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  resendBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  verifyBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
