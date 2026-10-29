import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { vouchersData } from '../data/vouchers';

interface VouchersScreenProps {
  onBack: () => void;
}

export const VouchersScreen: React.FC<VouchersScreenProps> = ({ onBack }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.roundBackBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#0C1F42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mã giảm giá</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Ưu đãi dành cho bạn</Text>

        {vouchersData.map((v) => {
          const isCopied = copiedCode === v.code;
          return (
            <View key={v.id} style={styles.voucherCard}>
              <View style={styles.voucherTop}>
                <Text style={styles.voucherCode}>{v.code}</Text>
                <Text style={styles.voucherCondition}>{v.condition}</Text>
                <View style={styles.discountRow}>
                  <Ionicons name="sparkles" size={16} color={colors.primary} />
                  <Text style={styles.discountText}> {v.discount}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => handleCopy(v.code)}
                activeOpacity={0.8}
              >
                <Text style={styles.copyBtnText}>
                  {isCopied ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP MÃ'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
    marginBottom: 16,
  },
  voucherCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'hidden',
  },
  voucherTop: {
    padding: 18,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0C1F42',
  },
  voucherCondition: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  discountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  copyBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
});
