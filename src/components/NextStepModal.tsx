import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { BrandLogo } from './BrandLogo';

interface NextStepModalProps {
  visible: boolean;
  onClose: () => void;
  onRestartOnboarding: () => void;
  onEnterMain?: () => void;
}

const { width } = Dimensions.get('window');

export const NextStepModal: React.FC<NextStepModalProps> = ({
  visible,
  onClose,
  onRestartOnboarding,
  onEnterMain,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Mini Logo */}
          <View style={styles.logoWrap}>
            <BrandLogo size={56} showText={false} lightMode={true} />
          </View>

          <Text style={styles.sheetTitle}>Xuş kelibsiz!</Text>
          <Text style={styles.sheetSubtitle}>
            YORDAM platformasiga ulaniş uçun keyingi bosqiç navigatsiyasi tayyorlandi.
          </Text>

          {/* Language Selection Preview */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionLabel}>Dastur tili:</Text>
            <View style={styles.langRow}>
              <TouchableOpacity style={[styles.langBtn, styles.langBtnActive]} activeOpacity={0.8}>
                <Text style={styles.langTextActive}>Özbekça</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langBtn} activeOpacity={0.8}>
                <Text style={styles.langText}>Ўзбекча</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langBtn} activeOpacity={0.8}>
                <Text style={styles.langText}>Русский</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Planned Next Phase Options */}
          <View style={styles.authOptions}>
            {onEnterMain && (
              <TouchableOpacity
                style={styles.mainEnterBtn}
                activeOpacity={0.85}
                onPress={() => {
                  onClose();
                  onEnterMain();
                }}
              >
                <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
                <Text style={styles.mainEnterText}>Asosiy tizimga kiriş</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.oneIdBtn}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onEnterMain?.();
              }}
            >
              <MaterialCommunityIcons name="shield-key" size={20} color="#FFFFFF" />
              <Text style={styles.oneIdText}>OneID orqali kiriş</Text>
              <View style={styles.officialPill}>
                <Text style={styles.officialText}>Rasmiy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.phoneAuthBtn}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onEnterMain?.();
              }}
            >
              <Ionicons name="call-outline" size={18} color="#0F172A" />
              <Text style={styles.phoneAuthText}>Telefon raqam orqali</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Controls */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={onRestartOnboarding}
              style={styles.restartBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={16} color={COLORS.accent} />
              <Text style={styles.restartText}>Taqdimotni qayta köriş</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>Yopiş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 14, 26, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 44,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 16,
  },
  logoWrap: {
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  sectionBox: {
    width: '100%',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  langBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0066FF',
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  langTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066FF',
  },
  authOptions: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  mainEnterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mainEnterText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  oneIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A192F',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 10,
  },
  oneIdText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  officialPill: {
    backgroundColor: '#00D4B2',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  officialText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0A192F',
  },
  phoneAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneAuthText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  footerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  restartText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});

