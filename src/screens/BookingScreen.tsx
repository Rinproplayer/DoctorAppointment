import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Doctor } from '../data/doctors';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface BookingScreenProps {
  doctor: Doctor;
  onBack: () => void;
  onFinishBooking: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  doctor,
  onBack,
  onFinishBooking,
}) => {
  const [step, setStep] = useState(1);

  // Form states
  const [selectedDay, setSelectedDay] = useState(20);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [targetPerson, setTargetPerson] = useState<'self' | 'relative'>('self');
  const [patientName, setPatientName] = useState('Nguyễn An');
  const [patientGender, setPatientGender] = useState('Nữ');
  const [patientAge, setPatientAge] = useState('26 tuổi');
  const [patientReason, setPatientReason] = useState('Khám và tư vấn sức khỏe định kỳ');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'apple_pay'>('wallet');
  const [bookingCode, setBookingCode] = useState('KH001234');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    const newCode = `KH${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(newCode);

    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('appointments').insert({
          code: newCode,
          user_id: user.id,
          doctor_name: doctor.name,
          specialty: doctor.specialty,
          hospital_name: doctor.hospital,
          appointment_date: `${selectedDay}/10/2026`,
          appointment_time: selectedTime,
          consultation_type: selectedPackage === 'video' ? 'video' : selectedPackage === 'phone' ? 'voice' : 'in_person',
          status: 'confirmed',
          fee: currentPkg.price,
          patient_name: patientName,
          patient_gender: patientGender,
          patient_age: patientAge,
          patient_notes: patientReason,
        });
        if (error) {
          console.warn('Booking insertion error:', error.message);
        }
      } catch (err) {
        console.warn('Booking error:', err);
      }
    }
    setIsSubmitting(false);
    setStep(6);
  };

  const packages = [
    {
      id: 'standard',
      title: 'Khám tiêu chuẩn',
      desc: 'Khám và tư vấn cùng bác sĩ',
      price: 200000,
      icon: 'chatbubble-outline' as const,
    },
    {
      id: 'phone',
      title: 'Tư vấn qua điện thoại',
      desc: 'Trao đổi từ xa với bác sĩ',
      price: 150000,
      icon: 'help-circle-outline' as const,
    },
    {
      id: 'video',
      title: 'Tư vấn qua video',
      desc: 'Tư vấn trực tuyến qua video',
      price: 250000,
      icon: 'eye-outline' as const,
    },
    {
      id: 'specialized',
      title: 'Khám chuyên sâu',
      desc: 'Thăm khám và tư vấn mở rộng',
      price: 350000,
      icon: 'person-outline' as const,
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackage) || packages[0];

  // STEP 6: E-Invoice with QR Code
  if (step === 6) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.roundNavBtn} onPress={onFinishBooking}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Hóa đơn điện tử</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.invoiceCard}>
            {/* QR Code Illustration */}
            <View style={styles.qrContainer}>
              <View style={styles.qrPatternBox}>
                <Ionicons name="qr-code" size={120} color="#0C1F42" />
              </View>
              <Text style={styles.qrSubText}>{`Mã QR check-in • ${bookingCode}`}</Text>
            </View>

            <View style={styles.invoiceDivider} />

            {/* Info rows */}
            <View style={styles.invoiceRow}>
              <View>
                <Text style={styles.invoiceRowLabel}>Mã lịch khám</Text>
                <Text style={styles.invoiceRowValBold}>{bookingCode}</Text>
              </View>
              <View>
                <Text style={styles.invoiceRowLabel}>Người khám</Text>
                <Text style={styles.invoiceRowValBold}>{patientName}</Text>
              </View>
            </View>

            <View style={styles.invoiceRow}>
              <View>
                <Text style={styles.invoiceRowLabel}>Số điện thoại</Text>
                <Text style={styles.invoiceRowValBold}>090 123 4567</Text>
              </View>
              <View>
                <Text style={styles.invoiceRowLabel}>Bác sĩ</Text>
                <Text style={styles.invoiceRowValBold}>{doctor.name}</Text>
              </View>
            </View>

            <View style={styles.invoiceRow}>
              <View>
                <Text style={styles.invoiceRowLabel}>Gói khám</Text>
                <Text style={styles.invoiceRowValBold}>{currentPkg.title}</Text>
              </View>
              <View>
                <Text style={styles.invoiceRowLabel}>Thời lượng</Text>
                <Text style={styles.invoiceRowValBold}>30 phút</Text>
              </View>
            </View>

            <View style={styles.invoiceRow}>
              <View>
                <Text style={styles.invoiceRowLabel}>Ngày khám</Text>
                <Text style={styles.invoiceRowValBold}>{selectedDay}/10/2026</Text>
              </View>
              <View>
                <Text style={styles.invoiceRowLabel}>Giờ khám</Text>
                <Text style={styles.invoiceRowValBold}>{selectedTime}</Text>
              </View>
            </View>

            <View style={styles.invoiceDivider} />

            <View style={styles.invoicePriceRow}>
              <Text style={styles.priceLabel}>Phí khám</Text>
              <Text style={styles.priceVal}>{currentPkg.price.toLocaleString('vi-VN')} đ</Text>
            </View>
            <View style={styles.invoicePriceRow}>
              <Text style={styles.priceLabel}>Giảm giá</Text>
              <Text style={styles.priceVal}>0 đ</Text>
            </View>
            <View style={[styles.invoicePriceRow, { marginTop: 6 }]}>
              <Text style={styles.totalPriceLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalPriceVal}>{currentPkg.price.toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewScheduleBtn} onPress={onFinishBooking}>
            <Text style={styles.viewScheduleBtnText}>Về lịch khám ›</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // STEP 5: Review & Confirmation
  if (step === 5) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.roundNavBtn} onPress={() => setStep(4)}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Xem lại lịch khám</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Doctor Card */}
          <Text style={styles.sectionHeader}>Bác sĩ</Text>
          <View style={styles.reviewCard}>
            <Image source={doctor.avatar} style={styles.reviewAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reviewDocName}>{doctor.name}</Text>
              <Text style={styles.reviewDocSub}>{doctor.specialty}</Text>
              <Text style={styles.reviewDocRating}>★ {doctor.rating} • {doctor.reviewsCount} đánh giá</Text>
            </View>
          </View>

          {/* Date & Time */}
          <Text style={styles.sectionHeader}>Thông tin lịch khám</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewIconCircle}>
              <Ionicons name="calendar-outline" size={20} color="#0C1F42" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reviewItemTitle}>Thông tin lịch khám</Text>
              <Text style={styles.reviewItemSub}>{selectedDay}/10/2026 • {selectedTime}</Text>
            </View>
          </View>

          {/* Package */}
          <Text style={styles.sectionHeader}>Gói khám</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewIconCircle}>
              <Ionicons name="heart-outline" size={20} color="#0C1F42" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reviewItemTitle}>Gói khám</Text>
              <Text style={styles.reviewItemSub}>
                {currentPkg.title} • {currentPkg.price.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>

          {/* Patient */}
          <Text style={styles.sectionHeader}>Người khám</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewIconCircle}>
              <Ionicons name="person-outline" size={20} color="#0C1F42" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reviewItemTitle}>Người khám</Text>
              <Text style={styles.reviewItemSub}>
                {patientName} • {patientGender} • {patientAge}
              </Text>
            </View>
          </View>

          {/* Payment */}
          <Text style={styles.sectionHeader}>Thanh toán</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewIconCircle}>
              <Ionicons name="wallet-outline" size={20} color="#0C1F42" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reviewItemTitle}>Thanh toán</Text>
              <Text style={styles.reviewItemSub}>
                Ví của tôi • {currentPkg.price.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.primaryActionBtn, isSubmitting && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleConfirmPayment}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryActionBtnText}>Xác nhận và thanh toán</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 4: Phương thức thanh toán
  if (step === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.roundNavBtn} onPress={() => setStep(3)}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Phương thức thanh toán</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Ví của tôi • Số dư 500.000 đ</Text>
          <TouchableOpacity
            style={[styles.paymentBox, paymentMethod === 'wallet' && styles.paymentBoxSelected]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Ionicons name="wallet-outline" size={22} color="#0C1F42" style={{ marginRight: 12 }} />
            <Text style={styles.paymentBoxTitle}>Ví của tôi</Text>
            <View style={styles.radioOuter}>
              {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Thẻ ghi nợ & tín dụng</Text>
          <TouchableOpacity style={styles.addCardRow}>
            <Ionicons name="card-outline" size={22} color="#0C1F42" style={{ marginRight: 12 }} />
            <Text style={styles.addCardText}>Thêm thẻ thanh toán</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Phương thức khác</Text>
          <View style={styles.otherPaymentsCard}>
            <TouchableOpacity
              style={styles.otherPayRow}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.payBrandIcon}>P</Text>
              <Text style={styles.payBrandText}>PayPal</Text>
              <View style={styles.radioOuter}>
                {paymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.otherPayRow}
              onPress={() => setPaymentMethod('apple_pay')}
            >
              <Text style={styles.payBrandIcon}>A</Text>
              <Text style={styles.payBrandText}>Apple Pay</Text>
              <View style={styles.radioOuter}>
                {paymentMethod === 'apple_pay' && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            activeOpacity={0.85}
            onPress={() => setStep(5)}
          >
            <Text style={styles.primaryActionBtnText}>Tiếp tục xem lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 3: Thông tin người khám
  if (step === 3) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.roundNavBtn} onPress={() => setStep(2)}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Thông tin người khám</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Bạn đặt lịch cho ai?</Text>

          <View style={styles.targetRow}>
            <TouchableOpacity
              style={[styles.targetCard, targetPerson === 'self' && styles.targetCardActive]}
              onPress={() => setTargetPerson('self')}
            >
              <View style={styles.targetAvatarPlaceholder} />
              <Text style={styles.targetText}>Bản thân</Text>
              <View style={styles.radioOuterSmall}>
                {targetPerson === 'self' && <View style={styles.radioInnerSmall} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.targetCard, targetPerson === 'relative' && styles.targetCardActive]}
              onPress={() => setTargetPerson('relative')}
            >
              <Ionicons name="person-outline" size={22} color="#0C1F42" />
              <Text style={styles.targetText}>Người thân</Text>
              <View style={styles.radioOuterSmall}>
                {targetPerson === 'relative' && <View style={styles.radioInnerSmall} />}
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Thông tin người khám</Text>

          <View style={styles.formInputGroup}>
            <Text style={styles.formInputLabel}>Họ và tên</Text>
            <TextInput
              style={styles.formInputField}
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <View style={styles.formInputGroup}>
            <Text style={styles.formInputLabel}>Giới tính</Text>
            <View style={styles.dropdownField}>
              <Text style={styles.dropdownFieldText}>{patientGender}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.formInputGroup}>
            <Text style={styles.formInputLabel}>Tuổi</Text>
            <View style={styles.dropdownField}>
              <Text style={styles.dropdownFieldText}>{patientAge}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.formInputGroup}>
            <Text style={styles.formInputLabel}>Lý do khám</Text>
            <TextInput
              style={styles.formInputField}
              value={patientReason}
              onChangeText={setPatientReason}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            activeOpacity={0.85}
            onPress={() => setStep(4)}
          >
            <Text style={styles.primaryActionBtnText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 2: Chọn gói khám
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.roundNavBtn} onPress={() => setStep(1)}>
            <Ionicons name="chevron-back" size={22} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Chọn gói khám</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Chọn gói khám phù hợp</Text>

          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.packageCard, isSelected && styles.packageCardSelected]}
                onPress={() => setSelectedPackage(pkg.id)}
                activeOpacity={0.85}
              >
                <View style={styles.packageIconCircle}>
                  <Ionicons name={pkg.icon} size={22} color="#0C1F42" />
                </View>
                <View style={styles.packageInfo}>
                  <View style={styles.packageTitleRow}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                    <Text style={styles.packagePrice}>
                      {pkg.price.toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                  <Text style={styles.packageDesc}>{pkg.desc}</Text>
                </View>
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            activeOpacity={0.85}
            onPress={() => setStep(3)}
          >
            <Text style={styles.primaryActionBtnText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 1: Chọn ngày & chọn giờ
  const daysHeader = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const calendarDays = [
    [27, 28, 29, 30, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, 20, null, null, null, null],
    [null, null, null, null, null, null, null],
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '11:00'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.roundNavBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#0C1F42" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Đặt lịch khám</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Doctor Card Banner */}
        <View style={styles.doctorBanner}>
          <Image source={doctor.avatar} style={styles.doctorBannerImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.doctorBannerName}>{doctor.name}</Text>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.doctorBannerSpecialty}>{doctor.specialty}</Text>
            <Text style={styles.doctorBannerRating}>★ {doctor.rating} • {doctor.reviewsCount} đánh giá</Text>
          </View>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeader}>Chọn ngày</Text>

        {/* Month Selector */}
        <View style={styles.monthRow}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={18} color="#0C1F42" />
          </TouchableOpacity>
          <Text style={styles.monthText}>Tháng 10, 2026</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={18} color="#0C1F42" />
          </TouchableOpacity>
        </View>

        {/* Days of week header */}
        <View style={styles.calendarWeekRow}>
          {daysHeader.map((d) => (
            <Text key={d} style={styles.weekDayHeader}>{d}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((week, wIdx) => (
            <View key={wIdx} style={styles.calendarWeek}>
              {week.map((day, dIdx) => {
                const isSelected = day === selectedDay;
                return (
                  <TouchableOpacity
                    key={dIdx}
                    style={[
                      styles.calendarCell,
                      isSelected && styles.calendarCellSelected,
                    ]}
                    onPress={() => day && setSelectedDay(day)}
                    disabled={!day}
                  >
                    <Text
                      style={[
                        styles.calendarCellText,
                        isSelected && styles.calendarCellTextSelected,
                        !day && { opacity: 0 },
                      ]}
                    >
                      {day || ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Section Heading */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Chọn giờ</Text>

        {/* Time slots row */}
        <View style={styles.timeSlotsRow}>
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlotPill, isSelected && styles.timeSlotPillSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    isSelected && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Next Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryActionBtn}
          activeOpacity={0.85}
          onPress={() => setStep(2)}
        >
          <Text style={styles.primaryActionBtnText}>Tiếp tục</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  doctorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  doctorBannerImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  doctorBannerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  doctorBannerSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  doctorBannerRating: {
    fontSize: 12,
    color: colors.star,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
    marginBottom: 12,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayHeader: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    gap: 8,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarCell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  calendarCellSelected: {
    backgroundColor: colors.primary,
  },
  calendarCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  calendarCellTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeSlotPill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeSlotPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  packageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F3F7FF',
  },
  packageIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  packageDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  targetCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    position: 'relative',
  },
  targetCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  targetAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1D5DB',
    marginBottom: 8,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C1F42',
  },
  radioOuterSmall: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  formInputGroup: {
    marginBottom: 14,
  },
  formInputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  formInputField: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownField: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownFieldText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  paymentBoxSelected: {
    borderColor: colors.primary,
  },
  paymentBoxTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0C1F42',
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  addCardText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#0C1F42',
  },
  otherPaymentsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  otherPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  payBrandIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    width: 28,
  },
  payBrandText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0C1F42',
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewDocName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  reviewDocSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewDocRating: {
    fontSize: 12,
    color: colors.star,
    fontWeight: '600',
    marginTop: 2,
  },
  reviewIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  reviewItemSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  invoiceCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  qrPatternBox: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  qrSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceRowLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  invoiceRowValBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0C1F42',
    marginTop: 2,
  },
  invoicePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0C1F42',
  },
  totalPriceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  totalPriceVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  viewScheduleBtn: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  viewScheduleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
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
  primaryActionBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
