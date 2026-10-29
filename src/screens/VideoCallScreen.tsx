import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window');

interface VideoCallScreenProps {
  onEndCall: () => void;
}

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ onEndCall }) => {
  const [seconds, setSeconds] = useState(754); // 12:34
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Full Background Doctor Video */}
      <Image
        source={require('../../assets/images/doctor_viet.jpg')}
        style={styles.doctorVideoBg}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.overlayContainer}>
        {/* Top Info Bar */}
        <View style={styles.topInfoCard}>
          <Image
            source={require('../../assets/images/doctor_viet.jpg')}
            style={styles.doctorThumb}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.doctorName}>BS. Nguyễn Quốc Việt</Text>
            <Text style={styles.specialty}>Tim mạch</Text>
          </View>
          <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
        </View>

        {/* Floating User PIP Camera */}
        <View style={styles.userPipBox}>
          <Image
            source={require('../../assets/images/user_avatar.jpg')}
            style={styles.userPipImage}
            resizeMode="cover"
          />
          <View style={styles.userPipLabel}>
            <Text style={styles.userPipLabelText}>Bạn</Text>
          </View>
        </View>

        {/* Bottom Control Bar */}
        <View style={styles.bottomControlsArea}>
          <View style={styles.roundControlsRow}>
            <TouchableOpacity
              style={[styles.circleBtn, isMuted && styles.circleBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={22}
                color={isMuted ? '#EF4444' : '#0C1F42'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, !isVideoOn && styles.circleBtnActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Ionicons
                name={isVideoOn ? 'videocam' : 'videocam-off'}
                size={22}
                color={!isVideoOn ? '#EF4444' : '#0C1F42'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="headset" size={22} color="#0C1F42" />
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <TouchableOpacity
            style={styles.endCallBtn}
            activeOpacity={0.85}
            onPress={onEndCall}
          >
            <Text style={styles.endCallBtnText}>Kết thúc cuộc gọi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  doctorVideoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.95,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 8,
  },
  doctorThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  specialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
  },
  userPipBox: {
    position: 'absolute',
    top: 90,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  userPipImage: {
    width: '100%',
    height: '100%',
  },
  userPipLabel: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userPipLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomControlsArea: {
    paddingBottom: 20,
  },
  roundControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  circleBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  endCallBtn: {
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  endCallBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
