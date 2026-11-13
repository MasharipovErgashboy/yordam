import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Crown,
  Megaphone,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Command,
} from 'lucide-react';
import type { UserSession } from '../types';
import logoImg from '../assets/logo.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserSession;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search Input (Only when expanded) */}
      {!isCollapsed ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.035)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0 12px',
          height: '40px',
          marginBottom: '22px',
        }}>
          <Search size={15} color="#64748B" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 5px',
            borderRadius: '5px',
            color: '#64748B',
            fontSize: '10px',
            fontWeight: 700,
          }}>
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      ) : (
        <div style={{ height: '8px' }} />
      )}

      {/* Navigation Items List */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
      }}>
        {filteredNavItems.map((item) => {
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

      {/* User Profile Card at Bottom */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: isCollapsed ? '6px 0' : '8px 10px',
          background: isCollapsed ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
          border: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}>
          {/* Avatar with active green dot */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
            }}>
              {user.avatar || 'RC'}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #070B14',
            }} />
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#94A3B8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                Bosh Administrator
              </div>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={onLogout}
              title="Tizimdan chiqish"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748B';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
