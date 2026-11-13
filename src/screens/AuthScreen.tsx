import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authService, UserProfile } from '../services/authService';

interface AuthScreenProps {
  initialTab?: 'login' | 'register';
  onAuthSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
}

const logoImage = require('../../assets/images/logo.jpg');

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialTab = 'login',
  onAuthSuccess,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // OTP Modal state
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState('');

  const otpInputRef = useRef<any>(null);

  // Timer for OTP resend countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOtpModalVisible && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpModalVisible, resendCountdown]);

  // Handle phone format helper
  const handlePhoneChange = (text: string) => {
    if (!text.startsWith('+998')) {
      setPhone('+998 ');
      return;
    }
    setPhone(text);
  };

  // 1. Submit Login
  const handleLoginSubmit = async () => {
    const cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      Alert.alert('Xatolik', 'Iltimos, email manzilingizni kiriting.');
      return;
    }
    if (!loginPassword) {
      Alert.alert('Xatolik', 'Iltimos, parolingizni kiriting.');
      return;
    }

    try {
      setIsLoginLoading(true);
      const res = await authService.login(cleanEmail, loginPassword);
      if (res.user) {
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      Alert.alert('Kirishda xatolik', err.message || 'Email yoki parol noto‘g‘ri.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 2. Submit Register Request (triggers OTP)
  const handleRegisterSubmit = async () => {
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirst || !cleanLast) {
      Alert.alert('Xatolik', 'Iltimos, ism va familiyangizni to‘liq kiriting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Xatolik', 'Iltimos, to‘g‘ri email manzilini kiriting.');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 9) {
      Alert.alert('Xatolik', 'Iltimos, to‘g‘ri telefon raqamingizni kiriting.');
      return;
    }

    if (registerPassword.length < 6) {
      Alert.alert('Xatolik', 'Parol kamida 6 ta belgidan iborat bo‘lishi lozim.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      Alert.alert('Xatolik', 'Parollar bir-biriga mos kelmadi. Tekshirib qaytadan kiriting.');
      return;
    }

    try {
      setIsRegisterLoading(true);
      await authService.registerRequest({
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        password: registerPassword,
      });

      // Show OTP modal
      setOtpCode('');
      setOtpError('');
      setResendCountdown(60);
      setCanResend(false);
      setIsOtpModalVisible(true);
    } catch (err: any) {
      Alert.alert('Ro‘yxatdan o‘tishda xatolik', err.message || 'Server bilan bog‘lanishda xatolik.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async () => {
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      setOtpError('Iltimos, 6 xonali tasdiqlash kodini to‘liq kiriting.');
      return;
    }

    try {
      setIsOtpVerifying(true);
      setOtpError('');
      const res = await authService.verifyOtp(registerEmail.trim(), cleanOtp);
      setIsOtpModalVisible(false);
      if (res.user) {
        Alert.alert(
          'Tabriklaymiz! 🎉',
          `Xush kelibsiz, ${res.user.firstName}! Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi.`
        );
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setOtpError(err.message || 'Noto‘g‘ri tasdiqlash kodi.');
    } finally {
      setIsOtpVerifying(false);
    }
  };

  // 4. Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    try {
      setIsResending(true);
      setOtpError('');
      await authService.resendOtp(registerEmail.trim());
      setResendCountdown(60);
      setCanResend(false);
      Alert.alert('Yuborildi', 'Yangi tasdiqlash kodi emailingizga yuborildi.');
    } catch (err: any) {
      setOtpError(err.message || 'Kodni qayta yuborishda xatolik.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Ambient background decoration */}
      <LinearGradient
        colors={['#0F1E36', '#060E1A', '#060E1A']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.ambientGlowTop} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top navigation bar */}
          <View style={styles.headerBar}>
            {onCancel ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={22} color="#00E5FF" />
                <Text style={styles.backButtonText}>Bosh sahifa</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
            <View style={styles.secureBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.secureBadgeText}>Xavfsiz portal</Text>
            </View>
          </View>

          {/* Logo & Platform Name */}
          <View style={styles.brandContainer}>
            <View style={styles.logoWrapper}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandBlue}>Y</Text>
              <Text style={styles.brandOrange}>o</Text>
              <Text style={styles.brandBlue}>rdam</Text>
            </View>
            <Text style={styles.brandSubtitle}>
              Fuqarolar uchun yagona interaktiv huquqiy boshqaruv tizimi
            </Text>
          </View>

          {/* Auth Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
              onPress={() => setActiveTab('login')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="log-in-outline"
                size={17}
                color={activeTab === 'login' ? '#00E5FF' : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'login' && styles.tabButtonTextActive,
                ]}
              >
                Kirish
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
              onPress={() => setActiveTab('register')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-add-outline"
                size={16}
                color={activeTab === 'register' ? '#00E5FF' : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'register' && styles.tabButtonTextActive,
                ]}
              >
                Ro‘yxatdan o‘tish
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================================================================= */}
          {/* TAB 1: KIRISH (LOGIN) */}
          {/* ================================================================= */}
          {activeTab === 'login' && (
            <View style={styles.formCard}>
              <Text style={styles.cardHeaderTitle}>Tizimga kirish</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Yordam xizmatlaridan foydalanish uchun emailingiz va parolingizni kiriting
              </Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email manzil</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="namuna@gmail.com"
                    placeholderTextColor="#64748B"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parol</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Parolingizni kiriting"
                    placeholderTextColor="#64748B"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry={!showLoginPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowLoginPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showLoginPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLoginSubmit}
                disabled={isLoginLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#0284C7', '#00A3FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isLoginLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Kirish</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Switch to Register link */}
              <View style={styles.switchAuthRow}>
                <Text style={styles.switchAuthText}>Profilingiz yo‘qmi?</Text>
                <TouchableOpacity onPress={() => setActiveTab('register')}>
                  <Text style={styles.switchAuthLink}> Ro‘yxatdan o‘ting</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* TAB 2: RO‘YXATDAN O‘TISH (REGISTER) */}
          {/* ================================================================= */}
          {activeTab === 'register' && (
            <View style={styles.formCard}>
              <Text style={styles.cardHeaderTitle}>Ro‘yxatdan o‘tish</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Barcha huquqiy xizmatlardan to‘liq foydalanish uchun ma’lumotlaringizni kiriting
              </Text>

              {/* Ism Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ism</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ismingizni kiriting"
                    placeholderTextColor="#64748B"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Familiya Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Familiya</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Familiyangizni kiriting"
                    placeholderTextColor="#64748B"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Address Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email manzil (kod yuboriladi)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="namuna@gmail.com"
                    placeholderTextColor="#64748B"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Phone Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefon raqam</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="+998 90 123 45 67"
                    placeholderTextColor="#64748B"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parol yaratish (kamida 6 ta belgi)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Kuchli parol o‘ylab toping"
                    placeholderTextColor="#64748B"
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    secureTextEntry={!showRegisterPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowRegisterPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showRegisterPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parolni tasdiqlash</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={19} color="#00A3FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Parolni qayta kiriting"
                    placeholderTextColor="#64748B"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegisterSubmit}
                disabled={isRegisterLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#0284C7', '#00A3FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isRegisterLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Ro‘yxatdan o‘tish</Text>
                      <Ionicons name="mail" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Switch to Login link */}
              <View style={styles.switchAuthRow}>
                <Text style={styles.switchAuthText}>Allaqachon profilingiz bormi?</Text>
                <TouchableOpacity onPress={() => setActiveTab('login')}>
                  <Text style={styles.switchAuthLink}> Kirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>
            Ro‘yxatdan o‘tish orqali siz Yordam tizimining xavfsizlik qoidalari va shaxsiy ma’lumotlarni qayta ishlash siyosatiga rozilik bildirasiz.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ===================================================================== */}
      {/* 6-DIGIT OTP VERIFICATION MODAL / ALERT */}
      {/* ===================================================================== */}
      <Modal
        visible={isOtpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOtpModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.otpModalCard}>
            {/* Glow header icon */}
            <View style={styles.otpIconCircle}>
              <Ionicons name="mail-unread" size={32} color="#00E5FF" />
            </View>

            <Text style={styles.otpModalTitle}>Emailni tasdiqlang</Text>
            <Text style={styles.otpModalSubtitle}>
              <Text style={{ color: '#00E5FF', fontWeight: '700' }}>{registerEmail}</Text> manziliga 6 xonali tasdiqlash kodi yuborildi.
            </Text>

            {/* OTP Input Boxes representation */}
            <View style={styles.otpBoxesRow}>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const char = otpCode[index] || '';
                const isCurrent = otpCode.length === index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpDigitBox,
                      isCurrent && styles.otpDigitBoxFocused,
                      char ? styles.otpDigitBoxFilled : null,
                    ]}
                  >
                    <Text style={styles.otpDigitText}>{char}</Text>
                  </View>
                );
              })}
            </View>

            {/* Hidden actual text input for keyboard handling */}
            <TextInput
              ref={otpInputRef}
              style={styles.hiddenOtpInput}
              value={otpCode}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, '').slice(0, 6);
                setOtpCode(clean);
                setOtpError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {/* Error Message */}
            {otpError ? (
              <View style={styles.otpErrorBox}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.otpErrorText}>{otpError}</Text>
              </View>
            ) : null}

            {/* Countdown / Resend */}
            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isResending}
                  style={styles.resendButton}
                >
                  <Ionicons name="refresh" size={15} color="#00E5FF" style={{ marginRight: 5 }} />
                  <Text style={styles.resendText}>
                    {isResending ? 'Yuborilmoqda...' : 'Kodni qayta yuborish'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendCountdownText}>
                  Qayta kod so‘rash: <Text style={{ color: '#00E5FF', fontWeight: '700' }}>{resendCountdown}s</Text>
                </Text>
              )}
            </View>

            {/* Confirm OTP Button */}
            <TouchableOpacity
              style={styles.otpConfirmButton}
              onPress={handleVerifyOtp}
              disabled={isOtpVerifying || otpCode.length !== 6}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={otpCode.length === 6 ? ['#0284C7', '#00A3FF'] : ['#334155', '#1E293B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.otpConfirmGradient}
              >
                {isOtpVerifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.otpConfirmText}>Tasdiqlash va kirish</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Cancel / Edit email */}
            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={() => setIsOtpModalVisible(false)}
            >
              <Text style={styles.cancelModalText}>Emailni o‘zgartirish / Bekor qilish</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060E1A',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButtonText: {
    fontSize: 13,
    color: '#00E5FF',
    fontWeight: '600',
    marginLeft: 4,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  secureBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 5,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 58,
    height: 58,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBlue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  brandOrange: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF7A00',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 4,
    marginTop: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 163, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.4)',
  },
  tabButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabButtonTextActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    marginBottom: 18,
  },
  cardHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardHeaderSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 13,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  switchAuthText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  switchAuthLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00E5FF',
  },
  privacyNote: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 12,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpModalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#0E172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.3)',
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  otpIconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  otpModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  otpModalSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  otpDigitBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigitBoxFocused: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  otpDigitBoxFilled: {
    borderColor: '#0284C7',
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
  },
  otpDigitText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#00E5FF',
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  otpErrorText: {
    fontSize: 12,
    color: '#F87171',
    fontWeight: '600',
  },
  resendRow: {
    marginVertical: 14,
    alignItems: 'center',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00E5FF',
  },
  resendCountdownText: {
    fontSize: 12.5,
    color: '#94A3B8',
  },
  otpConfirmButton: {
    width: '100%',
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 12,
  },
  otpConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 16,
  },
  otpConfirmText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelModalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelModalText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
});
