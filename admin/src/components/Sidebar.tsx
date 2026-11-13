import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Crown,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react';
import type { UserSession } from '../types';
import logoImg from '../assets/logo.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: UserSession;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  // 5 main navigation sections specified by user
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'foydalanuvchilar',
      label: 'Foydalanuvchilar',
      icon: Users,
      badge: '1.2k',
      badgeColor: 'rgba(0, 163, 255, 0.25)',
      badgeTextColor: '#00E5FF',
    },
    {
      id: 'xizmatlar',
      label: 'Xizmatlar',
      icon: Briefcase,
    },
    {
      id: 'premium',
      label: 'Premium obuna',
      icon: Crown,
      badge: 'PRO',
      badgeColor: 'rgba(245, 158, 11, 0.25)',
      badgeTextColor: '#F59E0B',
    },
    {
      id: 'reklama',
      label: 'Reklama',
      icon: Megaphone,
    },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: isCollapsed ? '80px' : '265px',
        minHeight: 'calc(100vh - 32px)',
        margin: '16px 0 16px 16px',
        padding: isCollapsed ? '20px 10px' : '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand Logo & Header */}
      {!isCollapsed ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          padding: '2px 4px',
        }}>
          {/* Logo without rectangle frame + Stylized Yordam Wordmark */}
          <div
            onClick={() => onTabChange('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <img
              src={logoImg}
              alt="Yordam Logo"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0, 163, 255, 0.35))',
                flexShrink: 0,
              }}
            />
            {/* Word "Yordam": "o" is orange (#FF7A00), "Y" and "rdam" are deep blue (#2563EB) */}
            <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'baseline' }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}>
                <span style={{ color: '#2563EB' }}>Y</span>
                <span style={{ color: '#FF7A00' }}>o</span>
                <span style={{ color: '#2563EB' }}>rdam</span>
              </span>
            </div>
          </div>

          {/* Sleek Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            title="Panelni yig‘ish"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <PanelLeftClose size={17} />
          </button>
        </div>
      ) : (
        /* Collapsed Header */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '22px',
          gap: '12px',
        }}>
          <img
            src={logoImg}
            alt="Yordam Logo"
            onClick={() => onTabChange('dashboard')}
            style={{
              width: '42px',
              height: '42px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0, 163, 255, 0.35))',
              cursor: 'pointer',
            }}
          />
          <button
            onClick={onToggleCollapse}
            title="Panelni ochish"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#00E5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 163, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 163, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <PanelLeftOpen size={17} />
          </button>
        </div>
      )}

      {/* Navigation Items List */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
        marginTop: isCollapsed ? '0px' : '4px',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                height: '46px',
                padding: isCollapsed ? '0 16px' : '0 14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, #00B2FF 0%, #0077FF 100%)'
                  : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                position: 'relative',
                boxShadow: isActive ? '0 0 25px rgba(0, 163, 255, 0.45)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              <Icon
                size={20}
                color={isActive ? '#FFFFFF' : '#94A3B8'}
                style={{ flexShrink: 0 }}
              />

              {!isCollapsed && (
                <>
                  <span style={{
                    flex: 1,
                    textAlign: 'left',
                    letterSpacing: '-0.2px',
                  }}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span style={{
                      background: item.badgeColor || 'rgba(255, 255, 255, 0.1)',
                      color: item.badgeTextColor || '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      letterSpacing: '0.3px',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <button
          onClick={onLogout}
          title="Chiqish"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            width: '100%',
            height: '44px',
            padding: isCollapsed ? '0 12px' : '0 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#94A3B8',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Chiqish</span>}
        </button>
      </div>
    </aside>
  );
};
