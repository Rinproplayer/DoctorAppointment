import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { hospitalsData, Hospital } from '../data/hospitals';

const { width, height } = Dimensions.get('window');

interface ExploreScreenProps {
  onSelectHospital: (hospital: Hospital) => void;
  onOpenFilter: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectHospital,
  onOpenFilter,
}) => {
  const [selectedHospId, setSelectedHospId] = useState('hosp-1');

  const pins = [
    {
      id: 'hosp-1',
      distance: '1,5 km',
      top: 240,
      left: width * 0.65,
      image: require('../../assets/images/vinmec.jpg'),
    },
    {
      id: 'hosp-2',
      distance: '7,5 km',
      top: 140,
      left: width * 0.72,
      image: require('../../assets/images/hoanmy.jpg'),
    },
    {
      id: 'hosp-3',
      distance: '8,8 km',
      top: 160,
      left: width * 0.12,
      image: require('../../assets/images/giadinh.jpg'),
    },
    {
      id: 'hosp-4',
      distance: '9,8 km',
      top: 310,
      left: width * 0.28,
      image: require('../../assets/images/vinmec.jpg'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header Overlay */}
      <View style={styles.headerOverlay}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>Tìm bác sĩ hoặc bệnh viện</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={onOpenFilter}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Stylized Map View */}
      <View style={styles.mapArea}>
        {/* Map grid streets simulation */}
        <View style={styles.streetLine1} />
        <View style={styles.streetLine2} />
        <View style={styles.streetLine3} />
        <View style={styles.streetLine4} />

        {/* Street Labels */}
        <Text style={[styles.streetLabel, { top: 120, left: 16 }]}>Nguyễn Văn Linh</Text>
        <Text style={[styles.streetLabel, { top: 220, left: 50 }]}>Trần Hưng Đạo</Text>
        <Text style={[styles.streetLabel, { top: 200, left: width * 0.44 }]}>30 Tháng 4</Text>
        <Text style={[styles.streetLabel, { top: 340, left: 30 }]}>Nguyễn Hữu Thọ</Text>
        <Text style={[styles.streetLabel, { top: 280, left: width * 0.54, fontWeight: '700' }]}>Hải Châu</Text>

        {/* User GPS Center Pulse */}
        <View style={styles.userGpsLocation}>
          <View style={styles.userPulseRing} />
          <View style={styles.userMarkerIcon}>
            <Ionicons name="navigate" size={18} color="#FFFFFF" />
          </View>
        </View>

        {/* Map Pins */}
        {pins.map((pin) => {
          const isSelected = selectedHospId === pin.id;
          return (
            <TouchableOpacity
              key={pin.id}
              style={[styles.pinWrapper, { top: pin.top, left: pin.left }]}
              onPress={() => setSelectedHospId(pin.id)}
            >
              <View style={[styles.pinCircle, isSelected && styles.pinCircleSelected]}>
                <Image source={pin.image} style={styles.pinImg} />
              </View>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceBadgeText}>{pin.distance}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Floating GPS Recenter Button */}
        <TouchableOpacity style={styles.recenterBtn}>
          <Ionicons name="locate" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Horizontal Slider */}
      <View style={styles.bottomCardContainer}>
        <ScrollView
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomCardsScroll}
        >
          {hospitalsData.map((hosp) => (
            <TouchableOpacity
              key={hosp.id}
              style={styles.cardItem}
              activeOpacity={0.9}
              onPress={() => onSelectHospital(hosp)}
            >
              <View style={styles.cardImgContainer}>
                <Image source={hosp.image} style={styles.cardImg} resizeMode="cover" />
                <TouchableOpacity style={styles.favBtnSmall}>
                  <Ionicons name="heart-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardHospName}>{hosp.name}</Text>
                  <Text style={styles.cardRating}>★ {hosp.rating}</Text>
                </View>
                <Text style={styles.cardSpecialty}>{hosp.specialties}</Text>
                <View style={styles.cardLocRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.cardLocText}>
                    {' '}Đà Nẵng • {hosp.travelTime} • {hosp.distance}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    zIndex: 10,
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
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    position: 'relative',
  },
  streetLine1: {
    position: 'absolute',
    width: 600,
    height: 24,
    backgroundColor: '#EBF0F7',
    top: 140,
    left: -100,
    transform: [{ rotate: '-35deg' }],
  },
  streetLine2: {
    position: 'absolute',
    width: 700,
    height: 28,
    backgroundColor: '#EBF0F7',
    top: 260,
    left: -50,
    transform: [{ rotate: '42deg' }],
  },
  streetLine3: {
    position: 'absolute',
    width: 500,
    height: 20,
    backgroundColor: '#EBF0F7',
    top: 380,
    left: 10,
    transform: [{ rotate: '-18deg' }],
  },
  streetLine4: {
    position: 'absolute',
    width: 500,
    height: 18,
    backgroundColor: '#EBF0F7',
    top: 80,
    left: 80,
    transform: [{ rotate: '60deg' }],
  },
  streetLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#94A3B8',
    transform: [{ rotate: '-30deg' }],
  },
  userGpsLocation: {
    position: 'absolute',
    top: 220,
    left: width * 0.44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(19, 96, 250, 0.2)',
  },
  userMarkerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinCircleSelected: {
    borderColor: '#EF4444',
    transform: [{ scale: 1.15 }],
  },
  pinImg: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  distanceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0C1F42',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 230,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  bottomCardsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cardItem: {
    width: width * 0.78,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImgContainer: {
    height: 110,
    width: '100%',
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  favBtnSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHospName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  cardRating: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.star,
  },
  cardSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardLocText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
