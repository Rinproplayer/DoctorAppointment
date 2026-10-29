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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { sampleChatMessages, ChatMessage } from '../data/messages';

interface ChatDetailScreenProps {
  onBack: () => void;
  onStartVideoCall: () => void;
  onStartVoiceCall: () => void;
}

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  onBack,
  onStartVideoCall,
  onStartVoiceCall,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: '09:45',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#0C1F42" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerDoctorName}>BS. Nguyễn Quốc Việt</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={onStartVoiceCall}>
            <Ionicons name="call-outline" size={20} color="#0C1F42" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={onStartVideoCall}>
            <Ionicons name="videocam-outline" size={20} color="#0C1F42" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subheader Doctor Card */}
      <View style={styles.subDoctorCard}>
        <Image
          source={require('../../assets/images/doctor_viet.jpg')}
          style={styles.subDoctorAvatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.subDoctorName}>BS. Nguyễn Quốc Việt</Text>
          <Text style={styles.subDoctorStatus}>Tim mạch • Đang trực tuyến</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {/* Date Separator */}
          <Text style={styles.dateSeparator}>Hôm nay • 20/10/2026</Text>

          {/* Messages */}
          {messages.map((m) => {
            const isDoctor = m.sender === 'doctor';

            return (
              <View
                key={m.id}
                style={[
                  styles.messageBubbleWrapper,
                  isDoctor ? styles.bubbleLeft : styles.bubbleRight,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isDoctor ? styles.bubbleDoctor : styles.bubbleUser,
                  ]}
                >
                  {m.text && (
                    <Text
                      style={[
                        styles.messageText,
                        isDoctor ? styles.textDoctor : styles.textUser,
                      ]}
                    >
                      {m.text}
                    </Text>
                  )}

                  {m.attachment && (
                    <View style={styles.attachmentBox}>
                      <Ionicons name="document-text" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
                      <View>
                        <Text style={styles.attachmentName}>{m.attachment.name}</Text>
                        <Text style={styles.attachmentSize}>{m.attachment.size}</Text>
                      </View>
                    </View>
                  )}
                </View>

                <Text style={styles.msgTime}>{m.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBarContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="arrow-up-circle-outline" size={26} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.inputFieldWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
          </View>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subDoctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  subDoctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  subDoctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  subDoctorStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 14,
  },
  messageBubbleWrapper: {
    marginBottom: 16,
    maxWidth: '82%',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleDoctor: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textDoctor: {
    color: '#0C1F42',
  },
  textUser: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  attachmentSize: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    marginTop: 2,
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFieldWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
