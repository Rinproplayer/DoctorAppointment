import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onStart,
  onLogin,
}) => {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <SafeAreaView style={styles.blueContainer}>
        <View style={styles.contentContainer}>
          {/* Top right card */}
          <View style={styles.cardTopRight}>
            <View style={styles.iconCircleBlue}>
              <Ionicons name="person-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTopRightText}>
              Khám phá dịch vụ y tế. Chọn bác sĩ tin cậy và đặt lịch phù hợp với bạn.
            </Text>
          </View>

          {/* Middle tilted card */}
          <View style={styles.cardTilted}>
            <Ionicons name="sparkles" size={18} color="#6B7280" />
            <Text style={styles.cardTiltedTitle}>Bác sĩ hàng đầu</Text>
            <Text style={styles.cardTiltedText}>Đặt lịch nhanh chóng</Text>
            <Text style={styles.cardTiltedText}>Chăm sóc thật dễ dàng</Text>
          </View>

          {/* Bottom white card */}
          <View style={styles.cardBottom}>
            <View style={styles.cardBottomLeft}>
              <Ionicons name="sparkles" size={20} color="#6B7280" style={{ marginBottom: 12 }} />
              <Text style={styles.cardBottomTitle}>Tìm bác sĩ{'\n'}phù hợp</Text>
              <TouchableOpacity
                style={styles.circleArrowBtn}
                onPress={() => setStep(1)}
              >
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../assets/images/doctor_hang.jpg')}
              style={styles.doctorImg}
              resizeMode="cover"
            />
          </View>

          {/* Action buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.primaryWhiteBtn}
              activeOpacity={0.85}
              onPress={() => setStep(1)}
            >
              <Text style={styles.primaryWhiteBtnText}>Bắt đầu ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLinkBtn}
              onPress={onLogin}
            >
              <Text style={styles.loginLinkText}>
                Đã có tài khoản? <Text style={styles.loginLinkBold}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 1: Favorites & Features showcase
  return (
    <SafeAreaView style={styles.whiteContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onStart}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.step1Center}>
        {/* Mock Phone Frame */}
        <View style={styles.phoneMockup}>
          <View style={styles.mockupHeader}>
            <Ionicons name="chevron-back" size={20} color="#0C1F42" />
            <Text style={styles.mockupTitle}>Yêu thích</Text>
            <Ionicons name="search" size={20} color="#0C1F42" />
          </View>

          {/* Mock Tab */}
          <View style={styles.mockupTabs}>
            <Text style={styles.mockupActiveTab}>Bác sĩ</Text>
            <Text style={styles.mockupInactiveTab}>Bệnh viện</Text>
          </View>

          {/* Doctor item 1 */}
          <View style={styles.mockDoctorCard}>
            <Image
              source={require('../../assets/images/doctor_viet.jpg')}
              style={styles.mockDoctorAvatar}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mockDoctorName}>BS. Nguyễn Quốc Việt</Text>
              <Text style={styles.mockDoctorSub}>Tim mạch • 4,9 ★</Text>
            </View>
            <Ionicons name="heart" size={18} color="#EF4444" />
          </View>

          {/* Doctor item 2 */}
          <View style={styles.mockDoctorCard}>
            <Image
              source={require('../../assets/images/doctor_hang.jpg')}
              style={styles.mockDoctorAvatar}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.mockDoctorName}>BS. Lê Thị Diệu Hằng</Text>
              <Text style={styles.mockDoctorSub}>Sản phụ khoa • 4,9 ★</Text>
            </View>
            <Ionicons name="heart" size={18} color="#EF4444" />
          </View>
        </View>

        {/* Text descriptions */}
        <Text style={styles.titleLarge}>
          Lưu bác sĩ và bệnh viện{'\n'}yêu thích của bạn
        </Text>
        <Text style={styles.descText}>
          Tìm lại chuyên gia tin cậy và cơ sở y tế phù hợp mỗi khi bạn cần chăm sóc.
        </Text>
      </View>

      {/* Bottom pagination & navigation */}
      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={styles.roundBackBtn}
          onPress={() => setStep(0)}
        >
          <Ionicons name="arrow-back" size={20} color="#0C1F42" />
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>

        <TouchableOpacity
          style={styles.roundNextBtn}
          onPress={onStart}
        >
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  blueContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  cardTopRight: {
    alignSelf: 'flex-end',
    width: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
  },
  iconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTopRightText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  cardTilted: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '78%',
    transform: [{ rotate: '-8deg' }],
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTiltedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
    marginTop: 6,
  },
  cardTiltedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C1F42',
    marginTop: 2,
  },
  cardBottom: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBottomLeft: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardBottomTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
    lineHeight: 24,
  },
  circleArrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorImg: {
    width: 140,
    height: '100%',
  },
  actionSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  primaryWhiteBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryWhiteBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  loginLinkBtn: {
    marginTop: 16,
    padding: 6,
  },
  loginLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loginLinkBold: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Step 1 styles
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  step1Center: {
    alignItems: 'center',
  },
  phoneMockup: {
    width: 270,
    height: 280,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#0C1F42',
    backgroundColor: '#FFFFFF',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 28,
  },
  mockupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  mockupTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
    marginBottom: 12,
  },
  mockupActiveTab: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
  },
  mockupInactiveTab: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  mockDoctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  mockDoctorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  mockDoctorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C1F42',
  },
  mockDoctorSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 10,
  },
  descText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  roundBackBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0C1F42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#374151',
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  roundNextBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
