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
import { Hospital } from '../data/hospitals';
import { doctorsData } from '../data/doctors';

const { width } = Dimensions.get('window');

interface HospitalDetailScreenProps {
  hospital: Hospital;
  onBack: () => void;
  onBookAppointment: () => void;
  onStartChat: () => void;
}

export const HospitalDetailScreen: React.FC<HospitalDetailScreenProps> = ({
  hospital,
  onBack,
  onBookAppointment,
  onStartChat,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'services' | 'departments' | 'photos' | 'reviews'>('intro');

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Floating Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#0C1F42" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hospital Hero Banner Image */}
        <Image source={hospital.image} style={styles.heroImage} resizeMode="cover" />

        {/* Gallery Thumbnails Row */}
        <View style={styles.galleryRow}>
          <Image source={require('../../assets/images/vinmec.jpg')} style={styles.thumbImg} />
          <Image source={require('../../assets/images/asset_10.jpeg')} style={styles.thumbImg} />
          <Image source={require('../../assets/images/asset_11.jpeg')} style={styles.thumbImg} />
          <Image source={require('../../assets/images/asset_12.jpeg')} style={styles.thumbImg} />
          <View style={styles.moreThumb}>
            <Text style={styles.moreThumbText}>+10</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Specialties & Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.specialtiesText}>{hospital.specialties}</Text>
            <View style={styles.starBadge}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.starText}> {hospital.rating}</Text>
            </View>
          </View>

          {/* Hospital Name */}
          <Text style={styles.hospitalName}>{hospital.name}</Text>

          {/* Location info */}
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.locText}> {hospital.address}</Text>
          </View>
          <View style={[styles.locRow, { marginTop: 4 }]}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.locText}> {hospital.distance} • {hospital.travelTime}</Text>
          </View>

          {/* Quick Action Circles */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="globe-outline" size={20} color="#0C1F42" />
              </View>
              <Text style={styles.actionLabel}>Website</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="navigate-outline" size={20} color="#0C1F42" />
              </View>
              <Text style={styles.actionLabel}>Chỉ đường</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={onStartChat}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="chatbubble-outline" size={20} color="#0C1F42" />
              </View>
              <Text style={styles.actionLabel}>Tin nhắn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="share-social-outline" size={20} color="#0C1F42" />
              </View>
              <Text style={styles.actionLabel}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'intro' && styles.tabItemActive]}
              onPress={() => setActiveTab('intro')}
            >
              <Text style={[styles.tabItemText, activeTab === 'intro' && styles.tabItemTextActive]}>
                Giới thiệu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'services' && styles.tabItemActive]}
              onPress={() => setActiveTab('services')}
            >
              <Text style={[styles.tabItemText, activeTab === 'services' && styles.tabItemTextActive]}>
                Dịch vụ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'departments' && styles.tabItemActive]}
              onPress={() => setActiveTab('departments')}
            >
              <Text style={[styles.tabItemText, activeTab === 'departments' && styles.tabItemTextActive]}>
                Chuyên khoa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'photos' && styles.tabItemActive]}
              onPress={() => setActiveTab('photos')}
            >
              <Text style={[styles.tabItemText, activeTab === 'photos' && styles.tabItemTextActive]}>
                Hình ảnh
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'intro' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <Text style={styles.descText}>{hospital.description}</Text>
              <Text style={[styles.descText, { marginTop: 6, fontWeight: '600' }]}>
                {hospital.workingHours}
              </Text>

              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Khám phá dịch vụ xét nghiệm</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'services' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionTitle}>Dịch vụ điều trị (3)</Text>
              <TouchableOpacity style={styles.serviceItemCard}>
                <Text style={styles.serviceItemTitle}>Khám nội tổng quát</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceItemCard}>
                <Text style={styles.serviceItemTitle}>Khám tim mạch</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceItemCard}>
                <Text style={styles.serviceItemTitle}>Gói xét nghiệm chuyên sâu</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'departments' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionTitle}>Chuyên gia tại cơ sở</Text>
              {doctorsData.slice(0, 2).map((doc) => (
                <View key={doc.id} style={styles.doctorItemCard}>
                  <Image source={doc.avatar} style={styles.doctorThumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docSpec}>{doc.specialty}</Text>
                    <Text style={styles.docRating}>★ {doc.rating} • {doc.reviewsCount} đánh giá</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookNowBtn}
          activeOpacity={0.85}
          onPress={onBookAppointment}
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
  topHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  galleryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 8,
  },
  thumbImg: {
    width: (width - 64) / 5,
    height: 48,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  moreThumb: {
    width: (width - 64) / 5,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(12, 31, 66, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  moreThumbText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialtiesText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.star,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
    marginTop: 6,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0C1F42',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    paddingVertical: 10,
    marginRight: 20,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabContentSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
    marginBottom: 10,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  serviceItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  serviceItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C1F42',
  },
  doctorItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  doctorThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  docSpec: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  docRating: {
    fontSize: 12,
    color: colors.star,
    fontWeight: '600',
    marginTop: 2,
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
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
