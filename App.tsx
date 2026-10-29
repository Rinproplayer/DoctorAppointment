import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { OtpScreen } from './src/screens/OtpScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { AppointmentsScreen } from './src/screens/AppointmentsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DoctorDetailScreen } from './src/screens/DoctorDetailScreen';
import { HospitalDetailScreen } from './src/screens/HospitalDetailScreen';
import { BookingScreen } from './src/screens/BookingScreen';
import { ChatDetailScreen } from './src/screens/ChatDetailScreen';
import { VideoCallScreen } from './src/screens/VideoCallScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { VouchersScreen } from './src/screens/VouchersScreen';
import { SearchFilterModal } from './src/screens/SearchFilterModal';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { BottomNav, TabType } from './src/components/BottomNav';
import { doctorsData, Doctor } from './src/data/doctors';
import { hospitalsData, Hospital } from './src/data/hospitals';
import { Appointment } from './src/data/appointments';
import { Conversation } from './src/data/messages';

type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'otp'
  | 'main'
  | 'doctor_detail'
  | 'hospital_detail'
  | 'booking'
  | 'chat_detail'
  | 'video_call'
  | 'wallet'
  | 'vouchers'
  | 'search_filter'
  | 'admin_dashboard';

function MainNavigator() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string>('an.nguyen@example.com');

  // Selected Entities
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctorsData[0]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(hospitalsData[0]);

  // Handlers
  const handleOpenDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('doctor_detail');
  };

  const handleOpenHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setCurrentScreen('hospital_detail');
  };

  const handleStartBooking = (doctor?: Doctor) => {
    if (doctor) setSelectedDoctor(doctor);
    setCurrentScreen('booking');
  };

  const handleStartChat = () => {
    setCurrentScreen('chat_detail');
  };

  const handleStartConsultation = (appointment: Appointment) => {
    if (appointment.type === 'video') {
      setCurrentScreen('video_call');
    } else {
      setCurrentScreen('chat_detail');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />
      )}

      {/* 2. Onboarding Screen */}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onStart={() => setCurrentScreen('main')}
          onLogin={() => setCurrentScreen('login')}
        />
      )}

      {/* 3. Login Screen */}
      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={() => setCurrentScreen('main')}
          onGoToRegister={() => setCurrentScreen('register')}
          onForgotPassword={() => setCurrentScreen('otp')}
        />
      )}

      {/* 4. Register Screen */}
      {currentScreen === 'register' && (
        <RegisterScreen
          onRegisterSuccess={(email: string) => {
            setPendingOtpEmail(email);
            setCurrentScreen('otp');
          }}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      )}

      {/* 5. OTP Screen */}
      {currentScreen === 'otp' && (
        <OtpScreen
          email={pendingOtpEmail}
          onVerifySuccess={() => setCurrentScreen('main')}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {/* 6. Main 5-Tab Area */}
      {currentScreen === 'main' && (
        <View style={styles.tabContentArea}>
          {currentTab === 'home' && (
            <HomeScreen
              onSelectDoctor={handleOpenDoctor}
              onSelectHospital={handleOpenHospital}
              onOpenSearch={() => setCurrentScreen('search_filter')}
              onOpenFilter={() => setCurrentScreen('search_filter')}
              onViewAllAppointments={() => setCurrentTab('appointments')}
              onViewAllHospitals={() => setCurrentTab('explore')}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreScreen
              onSelectHospital={handleOpenHospital}
              onOpenFilter={() => setCurrentScreen('search_filter')}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsScreen
              onStartConsultation={handleStartConsultation}
              onOpenChat={() => setCurrentScreen('chat_detail')}
              onViewInvoice={() => setCurrentScreen('booking')}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesScreen
              onOpenConversation={(_conv: Conversation) => setCurrentScreen('chat_detail')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              onOpenWallet={() => setCurrentScreen('wallet')}
              onOpenVouchers={() => setCurrentScreen('vouchers')}
              onOpenSettings={() => setCurrentScreen('search_filter')}
              onOpenHelpCenter={() => setCurrentScreen('search_filter')}
              onOpenFavorites={() => setCurrentTab('home')}
              onLogout={() => setCurrentScreen('login')}
              onOpenAdmin={() => setCurrentScreen('admin_dashboard')}
            />
          )}

          <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
        </View>
      )}

      {/* Detail & Flow Screens */}
      {currentScreen === 'doctor_detail' && (
        <DoctorDetailScreen
          doctor={selectedDoctor}
          onBack={() => setCurrentScreen('main')}
          onBookAppointment={handleStartBooking}
          onStartChat={handleStartChat}
        />
      )}

      {currentScreen === 'hospital_detail' && (
        <HospitalDetailScreen
          hospital={selectedHospital}
          onBack={() => setCurrentScreen('main')}
          onBookAppointment={() => handleStartBooking(doctorsData[0])}
          onStartChat={handleStartChat}
        />
      )}

      {currentScreen === 'booking' && (
        <BookingScreen
          doctor={selectedDoctor}
          onBack={() => setCurrentScreen('main')}
          onFinishBooking={() => {
            setCurrentTab('appointments');
            setCurrentScreen('main');
          }}
        />
      )}

      {currentScreen === 'chat_detail' && (
        <ChatDetailScreen
          onBack={() => setCurrentScreen('main')}
          onStartVideoCall={() => setCurrentScreen('video_call')}
          onStartVoiceCall={() => setCurrentScreen('video_call')}
        />
      )}

      {currentScreen === 'video_call' && (
        <VideoCallScreen onEndCall={() => setCurrentScreen('chat_detail')} />
      )}

      {currentScreen === 'wallet' && (
        <WalletScreen onBack={() => setCurrentScreen('main')} />
      )}

      {currentScreen === 'vouchers' && (
        <VouchersScreen onBack={() => setCurrentScreen('main')} />
      )}

      {currentScreen === 'search_filter' && (
        <SearchFilterModal
          onClose={() => setCurrentScreen('main')}
          onSelectDoctor={handleOpenDoctor}
          onSelectHospital={handleOpenHospital}
        />
      )}

      {currentScreen === 'admin_dashboard' && (
        <AdminDashboardScreen onBack={() => setCurrentScreen('main')} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContentArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
