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

  // Auto-focus OTP input whenever modal becomes visible
  useEffect(() => {
    if (isOtpModalVisible) {
      const timer = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOtpModalVisible]);

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
      Alert.alert('Xatolik', 'Email manzilingizni kiriting.');
      return;
    }
    if (!loginPassword) {
      Alert.alert('Xatolik', 'Parolingizni kiriting.');
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
      Alert.alert('Xatolik', 'Ism va familiyangizni to‘liq kiriting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Xatolik', 'To‘g‘ri email manzilini kiriting.');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 9) {
      Alert.alert('Xatolik', 'To‘g‘ri telefon raqamingizni kiriting.');
      return;
    }

    if (registerPassword.length < 6) {
      Alert.alert('Xatolik', 'Parol kamida 6 ta belgidan iborat bo‘lishi lozim.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      Alert.alert('Xatolik', 'Parollar bir-biriga mos kelmadi.');
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
      Alert.alert('Xatolik', err.message || 'Server bilan bog‘lanishda xatolik.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async () => {
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      setOtpError('6 xonali tasdiqlash kodini to‘liq kiriting.');
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
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar with back button */}
          <View style={styles.headerBar}>
            {onCancel ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#0F172A" />
                <Text style={styles.backButtonText}>Bosh sahifa</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
            <View style={{ width: 40 }} />
          </View>

          {/* Logo & Platform Title (matches MainHomeScreen 1:1) */}
          <View style={styles.brandContainer}>
            <Image
              source={logoImage}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitleText}>
              Y<Text style={styles.brandTitleAccent}>o</Text>rdam
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
                size={18}
                color={activeTab === 'login' ? '#0284C7' : '#64748B'}
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
                size={17}
                color={activeTab === 'register' ? '#0284C7' : '#64748B'}
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

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email manzil</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="namuna@gmail.com"
                    placeholderTextColor="#94A3B8"
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
                  <Ionicons name="lock-closed-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Parolingizni kiriting"
                    placeholderTextColor="#94A3B8"
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
                      color="#64748B"
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

              {/* Ism Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ism</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ismingizni kiriting"
                    placeholderTextColor="#94A3B8"
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
                  <Ionicons name="person-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Familiyangizni kiriting"
                    placeholderTextColor="#94A3B8"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Address Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email manzil</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="namuna@gmail.com"
                    placeholderTextColor="#94A3B8"
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
                  <Ionicons name="call-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="+998 90 123 45 67"
                    placeholderTextColor="#94A3B8"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parol</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Kamida 6 ta belgi"
                    placeholderTextColor="#94A3B8"
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
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parolni tasdiqlash</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={19} color="#0284C7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Parolni qayta kiriting"
                    placeholderTextColor="#94A3B8"
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
                      color="#64748B"
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ===================================================================== */}
      {/* 6-DIGIT OTP VERIFICATION MODAL / ALERT (LIGHT THEME) */}
      {/* ===================================================================== */}
      <Modal
        visible={isOtpModalVisible}
        transparent
        animationType="fade"
        onShow={() => {
          setTimeout(() => {
            otpInputRef.current?.focus();
          }, 150);
        }}
        onRequestClose={() => setIsOtpModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.otpModalCard}>
            {/* Header icon */}
            <View style={styles.otpIconCircle}>
              <Ionicons name="mail-unread" size={30} color="#0284C7" />
            </View>

            <Text style={styles.otpModalTitle}>Emailni tasdiqlang</Text>
            <Text style={styles.otpModalSubtitle}>
              <Text style={{ color: '#0284C7', fontWeight: '700' }}>{registerEmail}</Text> manziliga 6 xonali tasdiqlash kodi yuborildi.
            </Text>

            {/* OTP Input Visual Boxes (Tapping opens keyboard) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                otpInputRef.current?.focus();
              }}
              style={styles.otpBoxesRow}
            >
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
                    <Text style={[styles.otpDigitText, char ? styles.otpDigitTextFilled : null]}>
                      {char}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* Real Visible Input Box (Android & iOS 100% Reliable Keyboard Trigger) */}
            <View style={styles.otpDirectInputContainer}>
              <View style={styles.otpDirectInputWrapper}>
                <Ionicons name="keypad-outline" size={20} color="#0284C7" style={{ marginRight: 8 }} />
                <TextInput
                  ref={otpInputRef}
                  style={styles.otpDirectTextInput}
                  value={otpCode}
                  onChangeText={(text) => {
                    const clean = text.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtpCode(clean);
                    setOtpError('');
                  }}
                  placeholder="Kodni bu yerga kiriting"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  maxLength={6}
                  autoFocus={true}
                  selectTextOnFocus
                />
                {otpCode.length > 0 && (
                  <TouchableOpacity onPress={() => setOtpCode('')} style={{ padding: 4 }}>
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Error Message */}
            {otpError ? (
              <View style={styles.otpErrorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
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
                  <Ionicons name="refresh" size={15} color="#0284C7" style={{ marginRight: 5 }} />
                  <Text style={styles.resendText}>
                    {isResending ? 'Yuborilmoqda...' : 'Kodni qayta yuborish'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendCountdownText}>
                  Qayta kod so‘rash: <Text style={{ color: '#0284C7', fontWeight: '700' }}>{resendCountdown}s</Text>
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
                colors={otpCode.length === 6 ? ['#0284C7', '#00A3FF'] : ['#CBD5E1', '#94A3B8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.otpConfirmGradient}
              >
                {isOtpVerifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={19} color="#FFFFFF" style={{ marginRight: 8 }} />
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  backButtonText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    marginLeft: 6,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  logoImage: {
    width: 50,
    height: 44,
  },
  brandTitleText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#033B6A',
    letterSpacing: 0.5,
  },
  brandTitleAccent: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
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
    color: '#64748B',
  },
  switchAuthLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },

  // Modal styles (Light theme)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpModalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  otpIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  otpModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  otpModalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  otpDigitBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigitBoxFocused: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  otpDigitBoxFilled: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  otpDigitText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  otpDigitTextFilled: {
    color: '#0284C7',
  },
  otpDirectInputContainer: {
    width: '100%',
    marginTop: 8,
    marginBottom: 6,
  },
  otpDirectInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0284C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  otpDirectTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 3,
  },
  otpErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  otpErrorText: {
    fontSize: 12,
    color: '#DC2626',
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
    color: '#0284C7',
  },
  resendCountdownText: {
    fontSize: 12.5,
    color: '#64748B',
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
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelModalText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
});
