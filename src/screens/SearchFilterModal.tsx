import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { doctorsData, Doctor } from '../data/doctors';
import { hospitalsData, Hospital } from '../data/hospitals';

interface SearchFilterModalProps {
  onClose: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  onClose,
  onSelectDoctor,
  onSelectHospital,
}) => {
  const [mode, setMode] = useState<'search' | 'filter'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTags, setRecentTags] = useState(['Tim mạch', 'Xét nghiệm', 'Nội khoa']);

  // Filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRating, setSelectedRating] = useState('4.5');

  const removeTag = (tag: string) => {
    setRecentTags((prev) => prev.filter((t) => t !== tag));
  };

  if (mode === 'filter') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.roundBackBtn} onPress={() => setMode('search')}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bộ lọc</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Chuyên khoa */}
          <Text style={styles.filterSectionTitle}>Chuyên khoa</Text>
          <View style={styles.pillRow}>
            {['all', 'internal', 'cardio'].map((item) => {
              const label = item === 'all' ? 'Tất cả' : item === 'internal' ? 'Nội khoa' : 'Tim mạch';
              const isActive = selectedSpecialty === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedSpecialty(item)}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Loại tư vấn */}
          <Text style={styles.filterSectionTitle}>Loại tư vấn</Text>
          <View style={styles.pillRow}>
            {['all', 'chat', 'call'].map((item) => {
              const label = item === 'all' ? 'Tất cả' : item === 'chat' ? 'Tin nhắn' : 'Gọi thoại';
              const isActive = selectedType === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedType(item)}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Đánh giá */}
          <Text style={styles.filterSectionTitle}>Đánh giá</Text>
          {[
            { val: '4.5', label: '4,5 trở lên' },
            { val: '4.0', label: '4,0 – 4,5' },
            { val: '3.5', label: '3,5 – 4,0' },
          ].map((r) => {
            const isSelected = selectedRating === r.val;
            return (
              <TouchableOpacity
                key={r.val}
                style={styles.ratingRow}
                onPress={() => setSelectedRating(r.val)}
              >
                <View style={styles.starsGroup}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={16} color={colors.star} style={{ marginRight: 2 }} />
                  ))}
                  <Text style={styles.ratingOptionLabel}> {r.label}</Text>
                </View>
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Distance */}
          <Text style={styles.filterSectionTitle}>Khoảng cách (km)</Text>
          <View style={styles.sliderSim}>
            <View style={styles.sliderTrack} />
            <View style={styles.sliderActive} />
            <View style={[styles.sliderThumb, { left: 40 }]} />
            <View style={[styles.sliderThumb, { right: 40 }]} />
          </View>
          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderMinMax}>1 km</Text>
            <Text style={styles.sliderMinMax}>15 km</Text>
          </View>

          {/* Fee */}
          <Text style={styles.filterSectionTitle}>Phí khám</Text>
          <View style={styles.sliderSim}>
            <View style={styles.sliderTrack} />
            <View style={styles.sliderActive} />
            <View style={[styles.sliderThumb, { left: 30 }]} />
            <View style={[styles.sliderThumb, { right: 50 }]} />
          </View>
          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderMinMax}>100.000 đ</Text>
            <Text style={styles.sliderMinMax}>1.000.000 đ</Text>
          </View>
        </ScrollView>

        <View style={styles.filterBottomBar}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSelectedSpecialty('all');
              setSelectedType('all');
              setSelectedRating('4.5');
            }}
          >
            <Text style={styles.resetBtnText}>Đặt lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyBtn} onPress={() => setMode('search')}>
            <Text style={styles.applyBtnText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.roundBackBtn} onPress={onClose}>
          <Ionicons name="chevron-back" size={22} color="#0C1F42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchFieldWrapper}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bác sĩ, bệnh viện, xét nghiệm..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton} onPress={() => setMode('filter')}>
          <Ionicons name="options-outline" size={22} color="#0C1F42" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tìm kiếm gần đây */}
        {recentTags.length > 0 && (
          <View style={styles.recentTagsSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
              <TouchableOpacity onPress={() => setRecentTags([])}>
                <Text style={styles.clearAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tagsRow}>
              {recentTags.map((tag) => (
                <View key={tag} style={styles.tagItem}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close" size={14} color={colors.textSecondary} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bác sĩ đã tìm gần đây */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Bác sĩ đã tìm gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.clearAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {doctorsData.slice(0, 3).map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.doctorRecentCard}
              onPress={() => onSelectDoctor(doc)}
            >
              <Image source={doc.avatar} style={styles.recentDocAvatar} />
              <Text style={styles.recentDocName} numberOfLines={2}>
                {doc.name}
              </Text>
              <Text style={styles.recentDocSpec}>{doc.specialty}</Text>
              <View style={styles.recentDocRating}>
                <Ionicons name="star" size={12} color={colors.star} />
                <Text style={styles.recentDocRatingText}> {doc.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bệnh viện tại Đà Nẵng */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Bệnh viện tại Đà Nẵng (8)</Text>
        </View>

        {hospitalsData.map((hosp) => (
          <TouchableOpacity
            key={hosp.id}
            style={styles.hospitalRowCard}
            onPress={() => onSelectHospital(hosp)}
          >
            <Image source={hosp.image} style={styles.hospitalRowImg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.hospRowName}>{hosp.name}</Text>
              <Text style={styles.hospRowAddress}>{hosp.address}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.labTestsLink}>
          <Text style={styles.labTestsLinkText}>Xem xét nghiệm & gói tầm soát ›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  roundBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  searchFieldWrapper: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  recentTagsSection: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
  },
  clearAllText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  doctorRecentCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  recentDocAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  recentDocName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C1F42',
    textAlign: 'center',
  },
  recentDocSpec: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  recentDocRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recentDocRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.star,
  },
  hospitalRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  hospitalRowImg: {
    width: 60,
    height: 50,
    borderRadius: 10,
  },
  hospRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  hospRowAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  labTestsLink: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 10,
  },
  labTestsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  // Filter Styles
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
    marginTop: 18,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  starsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingOptionLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  sliderSim: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  sliderActive: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 4,
    backgroundColor: colors.primary,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMinMax: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterBottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
