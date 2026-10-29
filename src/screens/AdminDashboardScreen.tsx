import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth, UserProfile } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { doctorsData, Doctor } from '../data/doctors';
import { hospitalsData, Hospital } from '../data/hospitals';
import { appointmentsData, Appointment } from '../data/appointments';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

type AdminTab = 'appointments' | 'doctors' | 'hospitals' | 'users';

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onBack }) => {
  const { profile, user, switchRoleDemo } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('appointments');
  const [loading, setLoading] = useState(false);

  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalsData);
  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      id: 'user-1',
      full_name: 'Nguyễn An (Bạn)',
      email: profile?.email || 'an.nguyen@gmail.com',
      role: profile?.role || 'admin',
    },
    {
      id: 'user-2',
      full_name: 'Trần Văn Bình',
      email: 'binh.tran@gmail.com',
      role: 'patient',
    },
    {
      id: 'user-3',
      full_name: 'Lê Hoàng Minh',
      email: 'minh.le@hospital.vn',
      role: 'doctor',
    },
    {
      id: 'user-4',
      full_name: 'Phạm Thu Thảo',
      email: 'thao.pham@gmail.com',
      role: 'patient',
    },
  ]);

  // Appointment filter
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Tim mạch');
  const [newDocHospital, setNewDocHospital] = useState('Vinmec Đà Nẵng');
  const [newDocFee, setNewDocFee] = useState('200000');
  const [newDocExp, setNewDocExp] = useState('5');

  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [newHospName, setNewHospName] = useState('');
  const [newHospSpecialty, setNewHospSpecialty] = useState('Đa khoa');
  const [newHospAddress, setNewHospAddress] = useState('Đà Nẵng');
  const [newHospPhone, setNewHospPhone] = useState('1900 1234');

  // Load real data from Supabase
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    try {
      // 1. Appointments
      const { data: appsData } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (appsData && appsData.length > 0) {
        const mapped: Appointment[] = appsData.map((row: any) => ({
          id: row.id,
          code: row.code,
          doctorName: row.doctor_name,
          specialty: row.specialty,
          hospital: row.hospital_name || 'Bệnh viện',
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

      // 2. Doctors
      const { data: docsData } = await supabase.from('doctors').select('*');
      if (docsData && docsData.length > 0) {
        const mappedDocs: Doctor[] = docsData.map((d: any, idx: number) => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          hospital: d.hospital_name || 'Bệnh viện',
          rating: Number(d.rating) || 4.9,
          reviewsCount: d.reviews_count || 53,
          patientsCount: d.patients_count || '3.500+',
          experienceYears: d.experience_years || 10,
          bio: d.bio || '',
          avatar: doctorsData[idx % doctorsData.length].avatar,
          fee: Number(d.fee) || 200000,
          isFavorite: true,
        }));
        setDoctors(mappedDocs);
      }

      // 3. Hospitals
      const { data: hospsData } = await supabase.from('hospitals').select('*');
      if (hospsData && hospsData.length > 0) {
        const mappedHosps: Hospital[] = hospsData.map((h: any, idx: number) => ({
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
          workingHours: h.working_hours || '24/7',
          description: h.description || '',
        }));
        setHospitals(mappedHosps);
      }

      // 4. Profiles
      const { data: profsData } = await supabase.from('profiles').select('*');
      if (profsData && profsData.length > 0) {
        const mappedUsers: UserProfile[] = profsData.map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          phone: p.phone,
          avatar_url: p.avatar_url,
          role: p.role || 'patient',
        }));
        setUsersList(mappedUsers);
      }
    } catch (e) {
      console.warn('Admin load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Update appointment status
  const handleUpdateAppStatus = async (appId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('appointments').update({ status: newStatus }).eq('id', appId);
      } catch (err) {
        console.warn('Update app status err:', err);
      }
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: newStatus,
              statusLabel:
                newStatus === 'confirmed'
                  ? 'Đã xác nhận'
                  : newStatus === 'completed'
                  ? 'Đã khám'
                  : 'Đã hủy',
            }
          : a
      )
    );
    Alert.alert('Thành công', `Đã cập nhật trạng thái lịch khám sang: ${newStatus}`);
  };

  // Add doctor
  const handleAddDoctor = async () => {
    if (!newDocName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên bác sĩ');
      return;
    }

    const feeNum = Number(newDocFee) || 200000;
    const expNum = Number(newDocExp) || 5;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .insert({
            name: newDocName.trim(),
            specialty: newDocSpecialty,
            hospital_name: newDocHospital,
            fee: feeNum,
            experience_years: expNum,
            rating: 4.9,
            patients_count: '1.200+',
            bio: `Bác sĩ chuyên khoa ${newDocSpecialty} tại ${newDocHospital}.`,
          })
          .select()
          .single();

        if (error) {
          Alert.alert('Lỗi', error.message);
          return;
        }
      } catch (err: any) {
        Alert.alert('Lỗi', err.message);
      }
    }

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      specialty: newDocSpecialty,
      hospital: newDocHospital,
      fee: feeNum,
      experienceYears: expNum,
      rating: 4.9,
      reviewsCount: 12,
      patientsCount: '1.200+',
      bio: `Bác sĩ chuyên khoa ${newDocSpecialty} tại ${newDocHospital}.`,
      avatar: doctorsData[0].avatar,
      isFavorite: true,
    };

    setDoctors((prev) => [newDoc, ...prev]);
    setShowAddDoctorModal(false);
    setNewDocName('');
    Alert.alert('Thành công', 'Đã thêm bác sĩ mới vào hệ thống');
  };

  // Delete doctor
  const handleDeleteDoctor = (docId: string, docName: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa bác sĩ "${docName}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa vĩnh viễn',
        style: 'destructive',
        onPress: async () => {
          if (isSupabaseConfigured()) {
            await supabase.from('doctors').delete().eq('id', docId);
          }
          setDoctors((prev) => prev.filter((d) => d.id !== docId));
          Alert.alert('Đã xóa', `Đã xóa bác sĩ "${docName}"`);
        },
      },
    ]);
  };

  // Add hospital
  const handleAddHospital = async () => {
    if (!newHospName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên bệnh viện / cơ sở');
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('hospitals').insert({
          name: newHospName.trim(),
          specialties: newHospSpecialty,
          address: newHospAddress,
          phone: newHospPhone,
          distance: '2,5 km',
          travel_time: '10 phút',
          rating: 4.8,
          working_hours: '24/7',
          description: `Cơ sở y tế ${newHospName.trim()} cung cấp dịch vụ chuyên khoa ${newHospSpecialty}.`,
        });
      } catch (err: any) {
        console.warn('Hospital insert err:', err);
      }
    }

    const newHosp: Hospital = {
      id: `hosp-${Date.now()}`,
      name: newHospName.trim(),
      specialties: newHospSpecialty,
      address: newHospAddress,
      phone: newHospPhone,
      distance: '2,5 km',
      travelTime: '10 phút',
      rating: 4.8,
      workingHours: '24/7',
      description: `Cơ sở y tế ${newHospName.trim()}.`,
      image: hospitalsData[0].image,
      isFavorite: true,
    };

    setHospitals((prev) => [newHosp, ...prev]);
    setShowAddHospitalModal(false);
    setNewHospName('');
    Alert.alert('Thành công', 'Đã thêm cơ sở y tế vào danh sách');
  };

  // Toggle user role
  const handleToggleUserRole = async (targetUser: UserProfile) => {
    const nextRole: 'admin' | 'patient' = targetUser.role === 'admin' ? 'patient' : 'admin';
    const roleLabel = nextRole === 'admin' ? 'Quản Trị Viên (Admin)' : 'Bệnh Nhân (Patient)';

    Alert.alert(
      'Thay đổi phân quyền',
      `Bạn có muốn chuyển vai trò của "${targetUser.full_name}" thành "${roleLabel}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận đổi',
          onPress: async () => {
            if (isSupabaseConfigured() && targetUser.id) {
              try {
                await supabase
                  .from('profiles')
                  .update({ role: nextRole })
                  .eq('id', targetUser.id);
              } catch (e: any) {
                console.warn('Role update error:', e);
              }
            }

            setUsersList((prev) =>
              prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
            );

            if (targetUser.id === profile?.id) {
              switchRoleDemo?.(nextRole);
            }

            Alert.alert('Thành công', `Đã phân quyền thành ${roleLabel}`);
          },
        },
      ]
    );
  };

  // Calculations for KPI
  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.fee || 200000), 0);

  const filteredAppointments = appointments.filter((a) => {
    if (appFilter === 'all') return true;
    return a.status === appFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Admin Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.roundBackBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTagRow}>
            <View style={styles.crownCircle}>
              <Ionicons name="shield-checkmark" size={14} color="#FBBF24" />
            </View>
            <Text style={styles.headerTagText}>ADMIN PORTAL</Text>
          </View>
          <Text style={styles.headerTitle}>Trung tâm Quản trị</Text>
        </View>
        <TouchableOpacity style={styles.roundBackBtn} onPress={loadSupabaseData}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderLeftColor: '#3B82F6' }]}>
            <View style={styles.kpiIconBox}>
              <Ionicons name="people" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.kpiValue}>{usersList.length}</Text>
            <Text style={styles.kpiLabel}>Người dùng</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="medkit" size={20} color="#10B981" />
            </View>
            <Text style={styles.kpiValue}>{doctors.length}</Text>
            <Text style={styles.kpiLabel}>Bác sĩ</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#8B5CF6' }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="calendar" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.kpiValue}>{appointments.length}</Text>
            <Text style={styles.kpiLabel}>Lịch khám</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#F59E0B' }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="cash" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.kpiValue}>{(totalRevenue / 1000).toFixed(0)}k đ</Text>
            <Text style={styles.kpiLabel}>Doanh thu</Text>
          </View>
        </View>

        {/* Tab Navigation Buttons */}
        <View style={styles.tabNavRow}>
          <TouchableOpacity
            style={[styles.tabNavBtn, currentTab === 'appointments' && styles.tabNavBtnActive]}
            onPress={() => setCurrentTab('appointments')}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={currentTab === 'appointments' ? colors.primary : '#64748B'}
            />
            <Text
              style={[
                styles.tabNavText,
                currentTab === 'appointments' && styles.tabNavTextActive,
              ]}
            >
              Lịch khám
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabNavBtn, currentTab === 'doctors' && styles.tabNavBtnActive]}
            onPress={() => setCurrentTab('doctors')}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={currentTab === 'doctors' ? colors.primary : '#64748B'}
            />
            <Text style={[styles.tabNavText, currentTab === 'doctors' && styles.tabNavTextActive]}>
              Bác sĩ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabNavBtn, currentTab === 'hospitals' && styles.tabNavBtnActive]}
            onPress={() => setCurrentTab('hospitals')}
          >
            <Ionicons
              name="business-outline"
              size={16}
              color={currentTab === 'hospitals' ? colors.primary : '#64748B'}
            />
            <Text style={[styles.tabNavText, currentTab === 'hospitals' && styles.tabNavTextActive]}>
              Bệnh viện
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabNavBtn, currentTab === 'users' && styles.tabNavBtnActive]}
            onPress={() => setCurrentTab('users')}
          >
            <Ionicons
              name="shield-outline"
              size={16}
              color={currentTab === 'users' ? colors.primary : '#64748B'}
            />
            <Text style={[styles.tabNavText, currentTab === 'users' && styles.tabNavTextActive]}>
              Phân quyền
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= TAB 1: APPOINTMENTS ================= */}
        {currentTab === 'appointments' && (
          <View style={styles.sectionContainer}>
            <View style={styles.filterPillsRow}>
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((key) => {
                const labels: Record<string, string> = {
                  all: 'Tất cả',
                  pending: 'Chờ duyệt',
                  confirmed: 'Đã duyệt',
                  completed: 'Đã khám',
                  cancelled: 'Đã hủy',
                };
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.filterPill, appFilter === key && styles.filterPillActive]}
                    onPress={() => setAppFilter(key)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        appFilter === key && styles.filterPillTextActive,
                      ]}
                    >
                      {labels[key]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {filteredAppointments.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="folder-open-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyCardText}>Không có lịch hẹn nào</Text>
              </View>
            ) : (
              filteredAppointments.map((app) => (
                <View key={app.id} style={styles.adminCard}>
                  <View style={styles.adminCardHeader}>
                    <View>
                      <Text style={styles.cardCode}>Mã: {app.code}</Text>
                      <Text style={styles.cardPatientTitle}>
                        Bệnh nhân: <Text style={{ color: '#0C1F42' }}>{app.patientName}</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        app.status === 'confirmed' && { backgroundColor: '#DEF7EC' },
                        app.status === 'pending' && { backgroundColor: '#FEF08A' },
                        app.status === 'completed' && { backgroundColor: '#E0E7FF' },
                        app.status === 'cancelled' && { backgroundColor: '#FEE2E2' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          app.status === 'confirmed' && { color: '#03543F' },
                          app.status === 'pending' && { color: '#854D0E' },
                          app.status === 'completed' && { color: '#3730A3' },
                          app.status === 'cancelled' && { color: '#991B1B' },
                        ]}
                      >
                        {app.statusLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={14} color="#64748B" />
                    <Text style={styles.detailText}>
                      {app.doctorName} • {app.specialty}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={styles.detailText}>
                      {app.date} • {app.time} • Phí: {(app.fee || 200000).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>

                  {/* Admin Actions */}
                  <View style={styles.adminActionRow}>
                    {app.status !== 'confirmed' && (
                      <TouchableOpacity
                        style={[styles.actionBtnSmall, { backgroundColor: '#10B981' }]}
                        onPress={() => handleUpdateAppStatus(app.id, 'confirmed')}
                      >
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Duyệt</Text>
                      </TouchableOpacity>
                    )}

                    {app.status !== 'completed' && (
                      <TouchableOpacity
                        style={[styles.actionBtnSmall, { backgroundColor: '#3B82F6' }]}
                        onPress={() => handleUpdateAppStatus(app.id, 'completed')}
                      >
                        <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Hoàn tất</Text>
                      </TouchableOpacity>
                    )}

                    {app.status !== 'cancelled' && (
                      <TouchableOpacity
                        style={[styles.actionBtnSmall, { backgroundColor: '#EF4444' }]}
                        onPress={() => handleUpdateAppStatus(app.id, 'cancelled')}
                      >
                        <Ionicons name="close" size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Hủy</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ================= TAB 2: DOCTORS ================= */}
        {currentTab === 'doctors' && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.addPrimaryBtn}
              activeOpacity={0.85}
              onPress={() => setShowAddDoctorModal(true)}
            >
              <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addPrimaryBtnText}>Thêm Bác Sĩ Mới</Text>
            </TouchableOpacity>

            {doctors.map((doc) => (
              <View key={doc.id} style={styles.adminCard}>
                <View style={styles.adminDocRow}>
                  <Image source={doc.avatar} style={styles.adminDocAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.docNameTitle}>{doc.name}</Text>
                    <Text style={styles.docSubTitle}>
                      {doc.specialty} • {doc.hospital}
                    </Text>
                    <Text style={styles.docFeeText}>
                      Khám: {doc.fee.toLocaleString('vi-VN')} đ • {doc.experienceYears} năm KN
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteCircleBtn}
                    onPress={() => handleDeleteDoctor(doc.id, doc.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================= TAB 3: HOSPITALS ================= */}
        {currentTab === 'hospitals' && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.addPrimaryBtn}
              activeOpacity={0.85}
              onPress={() => setShowAddHospitalModal(true)}
            >
              <Ionicons name="business" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addPrimaryBtnText}>Thêm Bệnh Viện Mới</Text>
            </TouchableOpacity>

            {hospitals.map((hosp) => (
              <View key={hosp.id} style={styles.adminCard}>
                <View style={styles.adminDocRow}>
                  <Image source={hosp.image} style={styles.adminHospImg} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.docNameTitle}>{hosp.name}</Text>
                    <Text style={styles.docSubTitle}>{hosp.specialties}</Text>
                    <Text style={styles.detailText}>
                      📍 {hosp.address} • 📞 {hosp.phone}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================= TAB 4: USERS & ROLES ================= */}
        {currentTab === 'users' && (
          <View style={styles.sectionContainer}>
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle" size={18} color="#1E40AF" style={{ marginRight: 8 }} />
              <Text style={styles.infoBannerText}>
                Phân quyền Quản trị viên (Admin) cho phép quản lý toàn bộ dữ liệu hệ thống, duyệt lịch hẹn và quản lý bác sĩ.
              </Text>
            </View>

            {usersList.map((usr) => {
              const isUsrAdmin = usr.role === 'admin';
              return (
                <View key={usr.id} style={styles.adminCard}>
                  <View style={styles.userRow}>
                    <View style={styles.userIconCircle}>
                      <Ionicons
                        name={isUsrAdmin ? 'shield-checkmark' : 'person'}
                        size={20}
                        color={isUsrAdmin ? '#8B5CF6' : '#64748B'}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.userNameText}>{usr.full_name}</Text>
                        <View
                          style={[
                            styles.rolePill,
                            isUsrAdmin ? styles.rolePillAdmin : styles.rolePillPatient,
                          ]}
                        >
                          <Text
                            style={[
                              styles.rolePillText,
                              isUsrAdmin ? { color: '#6D28D9' } : { color: '#03543F' },
                            ]}
                          >
                            {isUsrAdmin ? 'Admin' : 'Bệnh nhân'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.userEmailText}>{usr.email}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.roleToggleBtn,
                        isUsrAdmin ? { borderColor: '#FCA5A5' } : { borderColor: '#C4B5FD' },
                      ]}
                      onPress={() => handleToggleUserRole(usr)}
                    >
                      <Text
                        style={[
                          styles.roleToggleBtnText,
                          isUsrAdmin ? { color: '#EF4444' } : { color: '#7C3AED' },
                        ]}
                      >
                        {isUsrAdmin ? 'Hạ quyền' : 'Cấp Admin'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modal Add Doctor */}
      <Modal visible={showAddDoctorModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Bác Sĩ Mới</Text>
              <TouchableOpacity onPress={() => setShowAddDoctorModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Họ và tên bác sĩ</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: BS. Phan Trọng Nhân"
                value={newDocName}
                onChangeText={setNewDocName}
              />

              <Text style={styles.inputLabel}>Chuyên khoa</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: Tim mạch, Răng Hàm Mặt, Nội..."
                value={newDocSpecialty}
                onChangeText={setNewDocSpecialty}
              />

              <Text style={styles.inputLabel}>Bệnh viện / Cơ sở</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: Vinmec Đà Nẵng"
                value={newDocHospital}
                onChangeText={setNewDocHospital}
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Giá khám (VNĐ)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={newDocFee}
                    onChangeText={setNewDocFee}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Số năm KN</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={newDocExp}
                    onChangeText={setNewDocExp}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                activeOpacity={0.85}
                onPress={handleAddDoctor}
              >
                <Text style={styles.modalSubmitBtnText}>Lưu Bác Sĩ Vào Hệ Thống</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Add Hospital */}
      <Modal visible={showAddHospitalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Cơ Sở Y Tế</Text>
              <TouchableOpacity onPress={() => setShowAddHospitalModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Tên cơ sở / Bệnh viện</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: Bệnh viện Quân Y 17"
                value={newHospName}
                onChangeText={setNewHospName}
              />

              <Text style={styles.inputLabel}>Chuyên khoa thế mạnh</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: Đa khoa • Chấn thương chỉnh hình"
                value={newHospSpecialty}
                onChangeText={setNewHospSpecialty}
              />

              <Text style={styles.inputLabel}>Địa chỉ</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: 02 Nguyễn Tri Phương, Đà Nẵng"
                value={newHospAddress}
                onChangeText={setNewHospAddress}
              />

              <Text style={styles.inputLabel}>Số điện thoại hotline</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="VD: 0236 3822 567"
                value={newHospPhone}
                onChangeText={setNewHospPhone}
              />

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                activeOpacity={0.85}
                onPress={handleAddHospital}
              >
                <Text style={styles.modalSubmitBtnText}>Lưu Cơ Sở Y Tế</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#0F172A',
  },
  roundBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  crownCircle: {
    marginRight: 4,
  },
  headerTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabNavRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  tabNavBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabNavTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: 4,
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  adminCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  cardPatientTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#64748B',
  },
  adminActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'flex-end',
  },
  actionBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  addPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  adminDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminDocAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  adminHospImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  docNameTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  docSubTitle: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  docFeeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  deleteCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 6,
  },
  userEmailText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rolePillAdmin: {
    backgroundColor: '#EDE9FE',
  },
  rolePillPatient: {
    backgroundColor: '#DEF7EC',
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleToggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyCardText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
