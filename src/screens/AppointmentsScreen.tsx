import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { appointmentsData, Appointment } from '../data/appointments';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Alert } from 'react-native';

interface AppointmentsScreenProps {
  onStartConsultation: (appointment: Appointment) => void;
  onOpenChat: (doctorName: string) => void;
  onViewInvoice: (appointment: Appointment) => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  onStartConsultation,
  onOpenChat,
  onViewInvoice,
}) => {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const mapped: Appointment[] = data.map((row: any) => ({
            id: row.id,
            code: row.code,
            doctorName: row.doctor_name,
            specialty: row.specialty,
            hospital: row.hospital_name || 'Vinmec Đà Nẵng',
            date: row.appointment_date,
            time: row.appointment_time,
            type: (row.consultation_type || 'video') as any,
            typeLabel:
              row.consultation_type === 'video'
                ? 'Tư vấn video'
                : row.consultation_type === 'voice'
                ? 'Gọi thoại'
                : 'Khám trực tiếp',
            status: row.status as any,
            statusLabel:
              row.status === 'confirmed'
                ? 'Đã xác nhận'
                : row.status === 'pending'
                ? 'Chờ duyệt'
                : row.status === 'completed'
                ? 'Đã khám'
                : 'Đã hủy',
            avatar: require('../../assets/images/doctor_viet.jpg'),
            fee: Number(row.fee) || 200000,
            patientName: row.patient_name,
            patientGender: row.patient_gender || 'Nữ',
            patientAge: row.patient_age || '26 tuổi',
            notes: row.patient_notes,
          }));
          setAppointments(mapped);
        }
      } catch (err) {
        console.warn('Error fetching appointments:', err);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = (appId: string) => {
    Alert.alert('Hủy lịch hẹn', 'Bạn có chắc chắn muốn hủy lịch hẹn khám này không?', [
      { text: 'Quay lại', style: 'cancel' },
      {
        text: 'Hủy lịch',
        style: 'destructive',
        onPress: async () => {
          if (user && isSupabaseConfigured()) {
            await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appId);
          }
          setAppointments((prev) =>
            prev.map((a) => (a.id === appId ? { ...a, status: 'cancelled', statusLabel: 'Đã hủy' } : a))
          );
        },
      },
    ]);
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeFilter === 'upcoming') return app.status === 'confirmed' || app.status === 'pending';
    if (activeFilter === 'completed') return app.status === 'completed';
    if (activeFilter === 'cancelled') return app.status === 'cancelled';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch khám của tôi</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'upcoming' && styles.filterPillActive]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text
            style={[styles.filterPillText, activeFilter === 'upcoming' && styles.filterPillTextActive]}
          >
            Sắp tới
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'completed' && styles.filterPillActive]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text
            style={[styles.filterPillText, activeFilter === 'completed' && styles.filterPillTextActive]}
          >
            Đã khám
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'cancelled' && styles.filterPillActive]}
          onPress={() => setActiveFilter('cancelled')}
        >
          <Text
            style={[styles.filterPillText, activeFilter === 'cancelled' && styles.filterPillTextActive]}
          >
            Đã hủy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Cards List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Chưa có lịch khám nào trong mục này</Text>
          </View>
        ) : (
          filteredAppointments.map((app) => {
            const isConfirmed = app.status === 'confirmed';
            const isPending = app.status === 'pending';

            return (
              <View key={app.id} style={styles.card}>
                {/* Doctor Row */}
                <View style={styles.cardHeader}>
                  <Image source={app.avatar} style={styles.doctorAvatar} />
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{app.doctorName}</Text>
                    <Text style={styles.doctorSub}>{app.specialty} • {app.hospital}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isConfirmed && styles.statusBadgeConfirmed,
                      isPending && styles.statusBadgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isConfirmed && styles.statusTextConfirmed,
                        isPending && styles.statusTextPending,
                      ]}
                    >
                      {app.statusLabel}
                    </Text>
                  </View>
                </View>

                {/* Date & Time */}
                <View style={styles.dateTimeRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} style={{ marginRight: 6 }} />
                  <Text style={styles.dateTimeText}>{app.date}</Text>
                  <Ionicons name="time-outline" size={16} color={colors.textPrimary} style={{ marginLeft: 16, marginRight: 6 }} />
                  <Text style={styles.dateTimeText}>{app.time}</Text>
                </View>

                {/* Sub details */}
                <Text style={styles.typeSubText}>
                  {app.typeLabel} • Mã {app.code}
                </Text>
                {app.notes && (
                  <Text style={styles.notesText}>{app.notes}</Text>
                )}
                {app.locationDetail && (
                  <Text style={styles.notesText}>Địa điểm: {app.locationDetail}</Text>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  {app.type === 'video' && (
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      activeOpacity={0.85}
                      onPress={() => onStartConsultation(app)}
                    >
                      <Text style={styles.primaryActionBtnText}>Vào tư vấn</Text>
                    </TouchableOpacity>
                  )}

                  {app.type === 'voice' && (
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      activeOpacity={0.85}
                      onPress={() => onStartConsultation(app)}
                    >
                      <Text style={styles.primaryActionBtnText}>Gọi thoại</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    onPress={() => onOpenChat(app.doctorName)}
                  >
                    <Text style={styles.secondaryActionBtnText}>Mở chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    onPress={() => onViewInvoice(app)}
                  >
                    <Text style={styles.secondaryActionBtnText}>Chi tiết</Text>
                  </TouchableOpacity>

                  {(app.status === 'confirmed' || app.status === 'pending') && (
                    <TouchableOpacity
                      style={[styles.secondaryActionBtn, { borderColor: '#FEE2E2' }]}
                      onPress={() => handleCancelAppointment(app.id)}
                    >
                      <Text style={[styles.secondaryActionBtnText, { color: '#EF4444' }]}>Hủy</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1F42',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  doctorSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  statusBadgeConfirmed: {
    backgroundColor: '#E8F5E9',
  },
  statusTextConfirmed: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgePending: {
    backgroundColor: '#FFF8E1',
  },
  statusTextPending: {
    color: '#F57F17',
    fontSize: 12,
    fontWeight: '700',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C1F42',
  },
  typeSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notesText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  primaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
