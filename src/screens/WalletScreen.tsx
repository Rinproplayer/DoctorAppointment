import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface WalletScreenProps {
  onBack: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onBack }) => {
  const [balance, setBalance] = useState(500000);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedTopUp, setSelectedTopUp] = useState(200000);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data && data.balance !== undefined && data.balance !== null) {
            setBalance(Number(data.balance));
          }
        });
    }
  }, [user]);

  const presetAmounts = [
    100000, 200000, 500000, 1000000,
    2000000, 3000000, 4000000, 5000000,
  ];

  const handleConfirmTopUp = async () => {
    const newBal = balance + selectedTopUp;
    setBalance(newBal);
    if (user && isSupabaseConfigured()) {
      try {
        await supabase.from('wallets').upsert({
          user_id: user.id,
          balance: newBal,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Wallet upsert error:', err);
      }
    }
    setShowTopUpModal(false);
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.roundBackBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#0C1F42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví của tôi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeaderRow}>
            <View>
              <Text style={styles.balanceSubtitle}>Số dư ví</Text>
              <Text style={styles.balanceAmount}>{balance.toLocaleString('vi-VN')} đ</Text>
            </View>
            <Ionicons name="wallet-outline" size={32} color="#0C1F42" />
          </View>

          <TouchableOpacity
            style={styles.topUpBtn}
            activeOpacity={0.85}
            onPress={() => setShowTopUpModal(true)}
          >
            <Text style={styles.topUpBtnText}>Nạp tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History Section */}
        <Text style={styles.historyGroupTitle}>Hôm nay</Text>
        <View style={styles.historyCard}>
          <View style={styles.txRow}>
            <Text style={styles.txTitle}>Nạp tiền vào ví</Text>
            <Text style={styles.txAmountPlus}>+500.000 đ</Text>
          </View>
          <View style={styles.txSubRow}>
            <Text style={styles.txTime}>16/10/2026 • 09:30</Text>
            <Text style={styles.txBalance}>Số dư 500.000 đ</Text>
          </View>
        </View>

        <Text style={styles.historyGroupTitle}>Hôm qua</Text>
        <View style={styles.historyCard}>
          <View style={styles.txRow}>
            <Text style={styles.txTitle}>Thanh toán #GD001234</Text>
            <Text style={styles.txAmountMinus}>-200.000 đ</Text>
          </View>
          <View style={styles.txSubRow}>
            <Text style={styles.txTime}>15/10/2026 • 10:30</Text>
            <Text style={styles.txBalance}>Số dư 0 đ</Text>
          </View>
        </View>

        <Text style={styles.historyGroupTitle}>10 tháng 10, 2026</Text>
        <View style={styles.historyCard}>
          <View style={styles.txRow}>
            <Text style={styles.txTitle}>Nạp tiền vào ví</Text>
            <Text style={styles.txAmountPlus}>+500.000 đ</Text>
          </View>
          <View style={styles.txSubRow}>
            <Text style={styles.txTime}>10/10/2026 • 08:30</Text>
            <Text style={styles.txBalance}>Số dư 200.000 đ</Text>
          </View>
        </View>

        <View style={[styles.historyCard, { marginTop: 10 }]}>
          <View style={styles.txRow}>
            <Text style={styles.txTitle}>Thanh toán #GD001200</Text>
            <Text style={styles.txAmountMinus}>-150.000 đ</Text>
          </View>
          <View style={styles.txSubRow}>
            <Text style={styles.txTime}>10/10/2026 • 07:48</Text>
            <Text style={styles.txBalance}>Số dư 50.000 đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={showTopUpModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.topUpSheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
                <Ionicons name="close" size={24} color="#0C1F42" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Nạp tiền</Text>
              <View style={{ width: 24 }} />
            </View>

            <Text style={styles.sheetSubtitle}>Số dư hiện tại: {balance.toLocaleString('vi-VN')} đ</Text>

            {/* Presets Grid */}
            <View style={styles.presetsGrid}>
              {presetAmounts.map((amt) => {
                const isSelected = selectedTopUp === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.presetBtn, isSelected && styles.presetBtnActive]}
                    onPress={() => setSelectedTopUp(amt)}
                  >
                    <Text style={[styles.presetBtnText, isSelected && styles.presetBtnTextActive]}>
                      + {amt.toLocaleString('vi-VN')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Display */}
            <View style={styles.amountInputBox}>
              <Text style={styles.currencyPrefix}>đ</Text>
              <Text style={styles.selectedAmountText}>
                {selectedTopUp.toLocaleString('vi-VN')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmTopUpBtn}
              activeOpacity={0.85}
              onPress={handleConfirmTopUp}
            >
              <Text style={styles.confirmTopUpBtnText}>Nạp tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successModalOverlay}>
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
            <Text style={styles.successTitle}>Nạp tiền thành công!</Text>
            <Text style={styles.successDesc}>
              Bạn đã nạp {selectedTopUp.toLocaleString('vi-VN')} đ vào ví.
            </Text>
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0C1F42',
    marginTop: 6,
  },
  topUpBtn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topUpBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  historyGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1F42',
    marginTop: 14,
    marginBottom: 8,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1F42',
  },
  txAmountPlus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  txAmountMinus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  txSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  txTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  txBalance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  topUpSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C1F42',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    width: '48%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  presetBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  presetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  presetBtnTextActive: {
    color: colors.primary,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: 10,
  },
  selectedAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1F42',
  },
  confirmTopUpBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTopUpBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0C1F42',
    marginTop: 16,
  },
  successDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  successBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
