import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Doctor } from '../data/doctors';

const { width } = Dimensions.get('window');

interface DoctorDetailScreenProps {
  doctor: Doctor;
  onBack: () => void;
  onBookAppointment: (doctor: Doctor) => void;
  onStartChat: (doctor: Doctor) => void;
}

export const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
  doctor,
  onBack,
  onBookAppointment,
  onStartChat,
}) => {
  const [isFavorite, setIsFavorite] = useState(doctor.isFavorite || false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.roundNavBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#0C1F42" />
        </TouchableOpacity>

        <Text style={styles.topNavTitle}>Chi tiết bác sĩ</Text>

        <View style={styles.topNavActions}>
          <TouchableOpacity style={styles.roundNavBtn}>
            <Ionicons name="share-social-outline" size={20} color="#0C1F42" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundNavBtn}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#EF4444' : '#0C1F42'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Doctor Header Banner with Image */}
        <View style={styles.doctorHeaderRow}>
          <View style={styles.doctorHeaderLeft}>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyBadgeText}>{doctor.specialty}</Text>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 6, marginTop: 4 }} />
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={colors.star} />
              <Text style={styles.ratingNumber}> {doctor.rating}</Text>
            </View>
          </View>

          <Image source={doctor.avatar} style={styles.doctorHeroImage} resizeMode="contain" />
        </View>

        {/* 4 Stats Cards Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Ionicons name="person-outline" size={18} color={colors.textPrimary} />
            </View>
            <Text style={styles.statValue}>{doctor.patientsCount}</Text>
            <Text style={styles.statLabel}>Bệnh nhân</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Ionicons name="briefcase-outline" size={18} color={colors.textPrimary} />
            </View>
            <Text style={styles.statValue}>{doctor.experienceYears}+</Text>
            <Text style={styles.statLabel}>Năm KN</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Ionicons name="star-outline" size={18} color={colors.textPrimary} />
            </View>
            <Text style={styles.statValue}>{doctor.rating}</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textPrimary} />
            </View>
            <Text style={styles.statValue}>5.000+</Text>
            <Text style={styles.statLabel}>Nhận xét</Text>
          </View>
        </View>

        {/* Giới thiệu bác sĩ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Giới thiệu bác sĩ</Text>
          <Text style={styles.bioText}>
            {doctor.bio} <Text style={styles.readMoreText}>Đọc thêm</Text>
          </Text>
        </View>

        {/* Liên hệ bác sĩ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Liên hệ bác sĩ</Text>
          <View style={styles.contactCard}>
            <Image source={doctor.avatar} style={styles.contactAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.contactDocName}>{doctor.name}</Text>
              <Text style={styles.contactDocSpecialty}>{doctor.specialty}</Text>
            </View>
            <TouchableOpacity style={styles.contactBtn} onPress={() => onStartChat(doctor)}>
              <Ionicons name="chatbubble-outline" size={18} color="#0C1F42" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={18} color="#0C1F42" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookNowBtn}
          activeOpacity={0.85}
          onPress={() => onBookAppointment(doctor)}
        >
          <Text style={styles.bookNowBtnText}>Đặt lịch khám</Text>
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
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  roundNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0C1F42',
  },
  topNavActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  doctorHeaderLeft: {
    flex: 1,
    paddingRight: 10,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 8,
  },
  specialtyBadgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.star,
  },
  doctorHeroImage: {
    width: 150,
    height: 190,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0C1F42',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  readMoreText: {
    color: colors.primary,
    fontWeight: '600',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginTop: 4,
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  contactDocName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  contactDocSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
