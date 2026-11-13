import React, { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  RefreshCw,
  FolderLock,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Command,
} from 'lucide-react';
import type { UserSession } from '../types';

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

  const navPrincipal = [
    { id: 'visao_geral', label: 'Visão geral', uzLabel: 'Umumiy ko‘rinish', icon: LayoutDashboard },
    { id: 'sinistros', label: 'Sinistros', uzLabel: 'Nizolar va Da’volar', icon: AlertTriangle },
    { id: 'apolices', label: 'Apólices', uzLabel: 'Arizalar va Shartnomalar', icon: FileText, hasDropdown: true },
    { id: 'renovacoes', label: 'Renovações', uzLabel: 'Yangilanishlar', icon: RefreshCw, badge: '9', badgeColor: '#EF4444' },
  ];

  const navCorretora = [
    { id: 'documentos', label: 'Documentos', uzLabel: 'Hujjatlar bazasi', icon: FolderLock },
    { id: 'configuracoes', label: 'Configurações', uzLabel: 'Sozlamalar', icon: Settings },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: isCollapsed ? '84px' : '272px',
        minHeight: 'calc(100vh - 32px)',
        margin: '16px 0 16px 16px',
        padding: isCollapsed ? '24px 12px' : '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'visible',
      }}
    >
      {/* Collapse Toggle Button (Circle on right border) */}
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Kengaytirish' : 'Yig‘ish'}
        style={{
          position: 'absolute',
          right: '-14px',
          top: '28px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#0E172B',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          zIndex: 20,
          transition: 'transform 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#0E172B')}
      >
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Brand Logo Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        paddingLeft: isCollapsed ? '4px' : '6px',
      }}>
        {/* Glowing Geometric Logo */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00E5FF 0%, #0066FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 163, 255, 0.5)',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 8C5 5.5 7 4 9.5 4C12 4 14 5.5 14 8C14 10.5 12 12 9.5 12C7 12 5 10.5 5 8Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              fill="rgba(255, 255, 255, 0.2)"
            />
            <path
              d="M10 12C10 14.5 12 16 14.5 16C17 16 19 14.5 19 12C19 9.5 17 8 14.5 8"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#FFFFFF',
            }}>
              nuvio
            </span>
            <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 700 }}>• yordam</span>
          </div>
        )}
      </div>

      {/* Search Pill Input */}
      {!isCollapsed ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(8, 14, 27, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0 12px',
          height: '40px',
          marginBottom: '26px',
        }}>
          <Search size={15} color="#64748B" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Buscar..."
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
        <div style={{ height: '16px' }} />
      )}

      {/* Nav List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Section 1: PRINCIPAL */}
        <div>
          {!isCollapsed && (
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '1px',
              marginBottom: '10px',
              paddingLeft: '10px',
            }}>
              PRINCIPAL
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navPrincipal.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    height: '44px',
                    padding: isCollapsed ? '0 16px' : '0 14px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, #00B2FF 0%, #0080FF 100%)'
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    position: 'relative',
                    boxShadow: isActive ? '0 0 25px rgba(0, 163, 255, 0.45)' : 'none',
                    transition: 'all 0.2s ease',
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
                  <Icon size={18} color={isActive ? '#FFFFFF' : '#94A3B8'} style={{ flexShrink: 0 }} />

                  {!isCollapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>

                      {item.hasDropdown && (
                        <ChevronDown size={14} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                      )}

                      {item.badge && (
                        <span style={{
                          background: item.badgeColor,
                          color: '#FFFFFF',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '1px 7px',
                          borderRadius: '10px',
                          minWidth: '18px',
                          textAlign: 'center',
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: CORRETORA */}
        <div>
          {!isCollapsed && (
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '1px',
              marginBottom: '10px',
              paddingLeft: '10px',
            }}>
              CORRETORA
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navCorretora.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    height: '44px',
                    padding: isCollapsed ? '0 16px' : '0 14px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, #00B2FF 0%, #0080FF 100%)'
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    boxShadow: isActive ? '0 0 25px rgba(0, 163, 255, 0.45)' : 'none',
                    transition: 'all 0.2s ease',
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
                  <Icon size={18} color={isActive ? '#FFFFFF' : '#94A3B8'} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Cards: Plan Usage & Profile Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        {/* Plano Card */}
        {!isCollapsed && (
          <div style={{
            background: 'rgba(8, 14, 27, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>Plano Corretora</span>
              <span style={{ fontSize: '10px', color: '#00E5FF', fontWeight: 700 }}>Pro</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
              84% do arquivo usado
            </div>
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '84%',
                height: '100%',
                background: 'linear-gradient(90deg, #00B2FF, #00E5FF)',
                borderRadius: '2px',
              }} />
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: isCollapsed ? '8px 0' : '8px 10px',
          background: isCollapsed ? 'transparent' : 'rgba(8, 14, 27, 0.5)',
          border: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}>
          {/* Avatar circle */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 800,
            flexShrink: 0,
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
          }}>
            {user.avatar || 'RC'}
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Corretora de seguros
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
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
