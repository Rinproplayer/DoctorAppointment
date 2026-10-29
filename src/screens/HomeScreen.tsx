import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
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
import { doctorsData, Doctor } from '../data/doctors';
import { hospitalsData, Hospital } from '../data/hospitals';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectHospital: (hospital: Hospital) => void;
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  onViewAllAppointments: () => void;
  onViewAllHospitals: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectDoctor,
  onSelectHospital,
  onOpenSearch,
  onOpenFilter,
  onViewAllAppointments,
  onViewAllHospitals,
}) => {
  const [selectedService, setSelectedService] = useState('Nội khoa');
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalsData);
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const services = ['Nội khoa', 'Tim mạch', 'Xét nghiệm', 'Sản phụ', 'Nhi khoa'];

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Load real hospitals from Supabase
      supabase.from('hospitals').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((h, idx) => ({
            id: h.id,
            name: h.name,
            specialties: h.specialties,
            address: h.address,
            distance: h.distance,
            travelTime: h.travel_time,
            rating: Number(h.rating) || 4.8,
            image: hospitalsData[idx % hospitalsData.length].image,
            isFavorite: true,
            phone: h.phone || '0236 3711 111',
            workingHours: h.working_hours || 'Thứ Hai – Thứ Bảy • 07:00 – 18:00',
            description: h.description || '',
          }));
          setHospitals(mapped);
        }
      });

      // Load real doctors from Supabase
      supabase.from('doctors').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((d, idx) => ({
            id: d.id,
            name: d.name,
            specialty: d.specialty,
            hospital: d.hospital_name || 'Vinmec Đà Nẵng',
            rating: Number(d.rating) || 4.9,
            reviewsCount: d.reviews_count || 53,
            patientsCount: d.patients_count || '3.500+',
            experienceYears: d.experience_years || 10,
            bio: d.bio || '',
            avatar: doctorsData[idx % doctorsData.length].avatar,
            fee: Number(d.fee) || 200000,
            isFavorite: true,
          }));
          setDoctors(mapped);
        }
      });
    }
  }, []);

  const upcomingDoctor = doctors[0] || doctorsData[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Blue Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.locationSubtitle}>Vị trí của bạn</Text>
          <TouchableOpacity style={styles.locationSelector} activeOpacity={0.8}>
            <Text style={styles.locationText}>Đà Nẵng</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Search Bar Input */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.8}
              onPress={onOpenSearch}
            >
              <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
              <Text style={styles.searchPlaceholder}>Bác sĩ, bệnh viện, xét nghiệm...</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterBtn} onPress={onOpenFilter}>
              <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.bodySection}>
          {/* Lịch hẹn sắp tới */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Lịch hẹn sắp tới</Text>
            <TouchableOpacity onPress={onViewAllAppointments}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Appointment Banner Card */}
          <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.9}
            onPress={() => onSelectDoctor(upcomingDoctor)}
          >
            <View style={styles.appointmentTopRow}>
              <Image source={upcomingDoctor.avatar} style={styles.doctorAvatarLarge} />
              <View style={styles.appointmentDoctorInfo}>
                <Text style={styles.doctorNameText}>{upcomingDoctor.name}</Text>
                <Text style={styles.doctorSpecialtyText}>{upcomingDoctor.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.star} />
                  <Text style={styles.ratingNumber}> {upcomingDoctor.rating}</Text>
                </View>
              </View>
            </View>

            {/* Date Pill */}
            <View style={styles.timePill}>
              <Ionicons name="calendar-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.timePillText}>20/10/2026</Text>
              <Text style={styles.timePillDivider}> | </Text>
              <Ionicons name="time-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.timePillText}>09:00 – 10:00</Text>
            </View>
          </TouchableOpacity>

          {/* Pagination dots */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Dịch vụ Section */}
          <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
            <Text style={styles.sectionTitle}>Dịch vụ</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Services Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesRow}
          >
            {services.map((svc) => {
              const isActive = selectedService === svc;
              return (
                <TouchableOpacity
                  key={svc}
                  style={[styles.servicePill, isActive && styles.servicePillActive]}
                  onPress={() => setSelectedService(svc)}
                >
                  <Text style={[styles.servicePillText, isActive && styles.servicePillTextActive]}>
                    {svc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Bệnh viện gần đây */}
          <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Bệnh viện gần đây</Text>
            <TouchableOpacity onPress={onViewAllHospitals}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Hospital Cards List */}
          {hospitals.map((hosp) => (
            <TouchableOpacity
              key={hosp.id}
              style={styles.hospitalCard}
              activeOpacity={0.88}
              onPress={() => onSelectHospital(hosp)}
            >
              <View style={styles.hospitalImageContainer}>
                <Image source={hosp.image} style={styles.hospitalImage} resizeMode="cover" />
                <TouchableOpacity style={styles.favIconBtn}>
                  <Ionicons
                    name={hosp.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={hosp.isFavorite ? '#EF4444' : '#6B7280'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.hospitalInfo}>
                <View style={styles.hospitalTitleRow}>
                  <Text style={styles.hospitalName}>{hosp.name}</Text>
                  <View style={styles.hospitalRating}>
                    <Ionicons name="star" size={14} color={colors.star} />
                    <Text style={styles.hospitalRatingText}> {hosp.rating}</Text>
                  </View>
                </View>
                <Text style={styles.hospitalSpecialties}>{hosp.specialties}</Text>
                <View style={styles.hospitalLocationRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.hospitalAddress} numberOfLines={1}>
                    {' '}{hosp.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    paddingBottom: 24,
  },
  headerSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  locationSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bodySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0C1F42',
  },
  seeAllText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appointmentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  doctorAvatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E5E7EB',
  },
  appointmentDoctorInfo: {
    flex: 1,
    marginLeft: 14,
  },
  doctorNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
  },
  doctorSpecialtyText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0C1F42',
  },
  timePill: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  timePillDivider: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.textSecondary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  servicePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  servicePillActive: {
    backgroundColor: colors.primary,
  },
  servicePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  servicePillTextActive: {
    color: '#FFFFFF',
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  hospitalImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
  },
  favIconBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalInfo: {
    padding: 14,
  },
  hospitalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
  },
  hospitalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.star,
  },
  hospitalSpecialties: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  hospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  hospitalAddress: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
});
