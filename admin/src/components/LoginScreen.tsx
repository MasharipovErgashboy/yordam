import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import type { UserSession } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      triggerError('Iltimos, foydalanuvchi nomi va parolni kiriting!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Credentials validation: username === 'yordam' && password === 'yordam123'
      if (username.trim() === 'yordam' && password === 'yordam123') {
        const session: UserSession = {
          username: 'yordam',
          name: 'Renata Cavalcanti',
          role: 'Bosh Administrator',
          avatar: 'RC',
          isAuthenticated: true,
        };
        localStorage.setItem('yordam_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
      } else {
        triggerError('Foydalanuvchi nomi yoki parol noto‘g‘ri! (yordam / yordam123)');
        setIsLoading(false);
      }
    }, 450);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const fillDemoCredentials = () => {
    setUsername('yordam');
    setPassword('yordam123');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      zIndex: 2,
    }}>
      {/* Login Glass Card */}
      <div
        className={`glass-panel ${isShaking ? 'animate-shake' : 'animate-fade-in'}`}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 36px',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(13, 20, 36, 0.40)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0, 163, 255, 0.25) 0%, rgba(0, 102, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 163, 255, 0.4)',
            marginBottom: '16px',
            boxShadow: '0 0 35px rgba(0, 163, 255, 0.35)',
          }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#loginGlow)" />
              <path d="M10 16.5 L14.5 21 L22 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="loginGlow" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#00E5FF" />
                  <stop offset="1" stopColor="#0066FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', color: '#FFFFFF' }}>yordam</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(0, 163, 255, 0.15)',
              color: '#00E5FF',
              border: '1px solid rgba(0, 163, 255, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              ADMIN
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0 }}>
            Huquqiy boshqaruv paneliga xavfsiz kirish
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '20px',
            color: '#FCA5A5',
            fontSize: '13px',
            lineHeight: '18px',
          }}>
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '7px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Foydalanuvchi nomi
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(8, 14, 27, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '0 14px',
              height: '48px',
              transition: 'all 0.2s ease',
            }}>
              <User size={18} color="#64748B" style={{ marginRight: '10px' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yordam"
                autoComplete="username"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Maxfiy parol
              </label>
              <button
                type="button"
                onClick={fillDemoCredentials}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00A3FF',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <Sparkles size={12} />
                Demo to‘ldirish
              </button>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(8, 14, 27, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '0 14px',
              height: '48px',
              transition: 'all 0.2s ease',
            }}>
              <Lock size={18} color="#64748B" style={{ marginRight: '10px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="yordam123"
                autoComplete="current-password"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #00B2FF 0%, #0070F3 100%)',
              color: '#FFFFFF',
              fontSize: '14.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 25px rgba(0, 163, 255, 0.45)',
              transition: 'all 0.25s ease',
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading ? (
              <span>Tekshirilmoqda...</span>
            ) : (
              <>
                <span>Tizimga kirish</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{
          marginTop: '24px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '0 0 4px 0' }}>
            Standart ma’lumotlar:
          </p>
          <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', margin: 0 }}>
            Login: <span style={{ color: '#00E5FF' }}>yordam</span> &bull; Parol: <span style={{ color: '#00E5FF' }}>yordam123</span>
          </p>
        </div>

        {/* Security Badge Footnote */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '22px',
          color: '#64748B',
          fontSize: '11px',
        }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>256-bit SSL xavfsiz shifrlangan boshqaruv tizimi</span>
        </div>
      </div>
    </div>
  );
};
