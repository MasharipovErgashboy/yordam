import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import type { UserSession } from '../types';
import logoImg from '../assets/logo.png';

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
        triggerError('Foydalanuvchi nomi yoki parol noto‘g‘ri!');
        setIsLoading(false);
      }
    }, 450);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic Cosmic Background */}
      <div className="login-bg-container">
        <div className="login-orb-1" />
        <div className="login-orb-2" />
        <div className="login-orb-3" />
        <div className="login-orbit-ring" />
        <div className="login-orbit-ring-outer" />
        <div className="login-grid-plane" />
        <div className="login-stars" />
      </div>

      {/* Login Glass Card */}
      <div
        className={`glass-panel ${isShaking ? 'animate-shake' : 'animate-fade-in'}`}
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '42px 36px 36px 36px',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'rgba(12, 19, 34, 0.38)',
          backdropFilter: 'blur(36px) saturate(190%)',
          WebkitBackdropFilter: 'blur(36px) saturate(190%)',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Brand Header with New Official Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Logo with matching ambient warm/cyan glow */}
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 163, 255, 0.35) 0%, rgba(245, 158, 11, 0.28) 45%, transparent 70%)',
              filter: 'blur(18px)',
              pointerEvents: 'none',
            }} />
            <img
              src={logoImg}
              alt="Yordam Logo"
              style={{
                width: '88px',
                height: '88px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0 10px 24px rgba(0, 163, 255, 0.35))',
              }}
            />
          </div>

          <div>
            <span style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              display: 'inline-block',
              lineHeight: 1,
            }}>
              <span style={{ color: '#2563EB' }}>Y</span>
              <span style={{ color: '#FF7A00' }}>o</span>
              <span style={{ color: '#2563EB' }}>rdam</span>
            </span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
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
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#94A3B8',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}>
              Foydalanuvchi nomi
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
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
                placeholder="Foydalanuvchi nomini kiriting"
                autoComplete="username"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '26px' }}>
            <label style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#94A3B8',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}>
              Maxfiy parol
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
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
                placeholder="Parolni kiriting"
                autoComplete="current-password"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
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
      </div>
    </div>
  );
};
