import { useState, useEffect } from 'react';
import type { UserSession, ApplicationItem } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { KPICards } from './components/KPICards';
import { ChartsSection } from './components/ChartsSection';
import { ApplicationsTable } from './components/ApplicationsTable';
import { NewApplicationModal } from './components/NewApplicationModal';
import {
  Briefcase,
  Search,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('yordam_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Default active tab is 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Users tab state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('all');

  // Ad banner state
  const [adBanners, setAdBanners] = useState([
    {
      id: 'ad_1',
      title: 'Iste’molchi huquqlari bo‘yicha bepul yuridik ko‘mak',
      placement: 'Bosh sahifa • Reklama Swiper',
      impressions: '124,500',
      clicks: '6,470',
      ctr: '5.2%',
      status: true,
      startDate: '01.11.2026',
    },
    {
      id: 'ad_2',
      title: 'Mehnat shartnomasi va ishdan bo‘shatish nizolari',
      placement: 'Mehnat huquqi • Yuqori banner',
      impressions: '84,200',
      clicks: '3,700',
      ctr: '4.4%',
      status: true,
      startDate: '05.11.2026',
    },
    {
      id: 'ad_3',
      title: 'Yurist Online: Professional advokatlar jamoasi',
      placement: 'Xizmatlar sahifasi • Promo blok',
      impressions: '39,800',
      clicks: '1,950',
      ctr: '4.9%',
      status: true,
      startDate: '08.11.2026',
    },
  ]);

  // Services tab state
  const [servicesList, setServicesList] = useState([
    {
      id: 'srv_1',
      title: 'Iste’molchi huquqlari',
      desc: 'Sifatsiz mahsulotlar, kafolat muddati, qaytarish va 1159 Raqobat qo‘mitasi arizalari',
      templatesCount: 18,
      usageCount: '6,850 ta ariza',
      successRate: '96%',
      isActive: true,
      badgeColor: '#00A3FF',
    },
    {
      id: 'srv_2',
      title: 'Ish va mehnat huquqi',
      desc: 'Mehnat kodeksi bo‘yicha shartnomalar, noqonuniy bo‘shatish va ish haqi undirish',
      templatesCount: 24,
      usageCount: '4,210 ta ariza',
      successRate: '98%',
      isActive: true,
      badgeColor: '#F97316',
    },
    {
      id: 'srv_3',
      title: 'Fuqarolik sudi da’volari',
      desc: 'Moddiy va ma’naviy zararni qoplash, shartnoma majburiyatlarini bajarish talablari',
      templatesCount: 15,
      usageCount: '2,140 ta da’vo',
      successRate: '91%',
      isActive: true,
      badgeColor: '#A855F7',
    },
    {
      id: 'srv_4',
      title: 'Sun’iy intellekt (AI) yordamchi',
      desc: '24/7 qonunchilik normalari asosida foydalanuvchilar savollariga avtomatik yuridik javoblar',
      templatesCount: 1,
      usageCount: '18,900 ta suhbat',
      successRate: '99%',
      isActive: true,
      badgeColor: '#10B981',
    },
  ]);

  // Application list state
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app_1',
      number: 'AP-2026-089',
      title: 'Sotuvchiga tovar pulini qaytarish talabnomasi',
      client: 'Ergashboy Masharipov',
      phone: '+998 90 123 45 67',
      category: 'istemolchi',
      categoryLabel: 'Iste’molchi huquqlari',
      date: '13.11.2026',
      amount: '4 200 000 so‘m',
      status: 'faol',
      statusLabel: 'Ko‘rib chiqilmoqda',
    },
    {
      id: 'app_2',
      number: 'AP-2026-088',
      title: 'Kafolat muddati davomida bepul ta’mirlash arizasi',
      client: 'Bobur Mirzayev',
      phone: '+998 93 456 78 90',
      category: 'istemolchi',
      categoryLabel: 'Iste’molchi huquqlari',
      date: '12.11.2026',
      amount: '5 800 000 so‘m',
      status: 'hal_qilindi',
      statusLabel: 'Ijobiy hal qilindi',
    },
    {
      id: 'app_3',
      number: 'AP-2026-087',
      title: 'Ish haqini kechiktirganlik uchun penya kompensatsiyasi',
      client: 'Zuhra Karimova',
      phone: '+998 97 789 01 23',
      category: 'ish_mehnat',
      categoryLabel: 'Mehnat huquqi',
      date: '11.11.2026',
      amount: '8 400 000 so‘m',
      status: 'faol',
      statusLabel: 'Jarayonda',
    },
    {
      id: 'app_4',
      number: 'AP-2026-086',
      title: 'Raqobat qo‘mitasiga rasmiy shikoyat xati (1159)',
      client: 'Sanjarbek Qodirov',
      phone: '+998 99 321 65 43',
      category: 'istemolchi',
      categoryLabel: 'Raqobat qo‘mitasi',
      date: '10.11.2026',
      amount: '1 450 000 so‘m',
      status: 'kutilmoqda',
      statusLabel: 'Kutilmoqda',
    },
    {
      id: 'app_5',
      number: 'AP-2026-085',
      title: 'Sudga da’vo arizasi (moddiy va ma’naviy zarar)',
      client: 'Dilnoza Rahimova',
      phone: '+998 91 654 98 70',
      category: 'sud',
      categoryLabel: 'Fuqarolik sudi',
      date: '09.11.2026',
      amount: '12 000 000 so‘m',
      status: 'hal_qilindi',
      statusLabel: 'Sudda yutildi',
    },
  ]);

  // User list
  const usersList = [
    {
      id: 'u_1',
      name: 'Ergashboy Masharipov',
      phone: '+998 90 123 45 67',
      role: 'Fuqaro',
      roleColor: '#00A3FF',
      status: 'Faol',
      registered: '13.11.2026',
      appsCount: 12,
      avatar: 'EM',
    },
    {
      id: 'u_2',
      name: 'Bobur Mirzayev',
      phone: '+998 93 456 78 90',
      role: 'Fuqaro',
      roleColor: '#00A3FF',
      status: 'Faol',
      registered: '12.11.2026',
      appsCount: 4,
      avatar: 'BM',
    },
    {
      id: 'u_3',
      name: 'Zuhra Karimova',
      phone: '+998 97 789 01 23',
      role: 'Yurist',
      roleColor: '#10B981',
      status: 'Faol',
      registered: '10.11.2026',
      appsCount: 48,
      avatar: 'ZK',
    },
    {
      id: 'u_4',
      name: 'Sanjarbek Qodirov',
      phone: '+998 99 321 65 43',
      role: 'Fuqaro',
      roleColor: '#00A3FF',
      status: 'Kutilmoqda',
      registered: '08.11.2026',
      appsCount: 1,
      avatar: 'SQ',
    },
    {
      id: 'u_5',
      name: 'Dilnoza Rahimova',
      phone: '+998 91 654 98 70',
      role: 'Moderator',
      roleColor: '#A855F7',
      status: 'Faol',
      registered: '01.11.2026',
      appsCount: 128,
      avatar: 'DR',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('yordam_admin_session');
    setSession(null);
  };

  const handleAddApplication = (newApp: ApplicationItem) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const toggleAdStatus = (id: string) => {
    setAdBanners((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, status: !ad.status } : ad))
    );
  };

  const toggleServiceStatus = (id: string) => {
    setServicesList((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, isActive: !srv.isActive } : srv))
    );
  };

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('sidebar-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Not logged in -> Show Login Screen
  if (!session || !session.isAuthenticated) {
    return <LoginScreen onLoginSuccess={setSession} />;
  }

  // Header Titles based on 5 active tabs
  const getTabHeader = () => {
    switch (activeTab) {
      case 'foydalanuvchilar':
        return {
          title: 'Foydalanuvchilar',
          subtitle: 'Jami 14,820 ta ro‘yxatdan o‘tgan fuqarolar, yuristlar va faol mijozlar',
        };
      case 'xizmatlar':
        return {
          title: 'Xizmatlar katalogi',
          subtitle: 'Yordam mini ilovalari, rasmiy andozalar bazasi va huquqiy yechimlar',
        };
      case 'premium':
        return {
          title: 'Premium obuna',
          subtitle: 'Tarif rejalari, oylik obunachilar va tushumlar hisoboti',
        };
      case 'reklama':
        return {
          title: 'Reklama boshqaruvi',
          subtitle: 'Bosh sahifa, swiper bannerlar va hamkorlik e’lonlari monitoringi',
        };
      case 'dashboard':
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Real vaqt tahlili, arizalar oqimi va platformaning umumiy faolligi',
        };
    }
  };

  const { title, subtitle } = getTabHeader();

  const filteredUsers = usersList.filter((u) => {
    const matchesRole =
      selectedUserRole === 'all' ||
      u.role.toLowerCase() === selectedUserRole.toLowerCase();
    const matchesQuery =
      userSearchQuery === '' ||
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone.includes(userSearchQuery);
    return matchesRole && matchesQuery;
  });

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#070B14',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient lighting */}
      <div className="ambient-bg" />
      <div className="ambient-dust" />

      {/* Left Sidebar with updated 5 sections & new styling */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={session}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: '28px 36px 40px 36px',
          overflowY: 'auto',
          maxHeight: '100vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Dashboard Header */}
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />

        {/* =========================================================================
            TAB 1: DASHBOARD
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* 3 KPI Cards */}
            <KPICards />

            {/* Glowing Charts Section */}
            <ChartsSection />

            {/* Applications Table */}
            <ApplicationsTable applications={applications} />
          </div>
        )}

        {/* =========================================================================
            TAB 2: FOYDALANUVCHILAR
           ========================================================================= */}
        {activeTab === 'foydalanuvchilar' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {[
                { title: 'Jami foydalanuvchilar', value: '14,820', change: '+18.4%', color: '#00A3FF' },
                { title: 'Faol yuristlar', value: '142 nafar', change: '98.5% reyting', color: '#10B981' },
                { title: 'Bugungi yangi a’zolar', value: '+64 ta', change: 'O‘sish sur’ati', color: '#F59E0B' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="glass-panel-interactive"
                  style={{
                    padding: '20px 22px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>{m.title}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: m.color, background: `${m.color}18`, padding: '3px 8px', borderRadius: '6px' }}>
                      {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Users Directory Table */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '22px' }}>
              {/* Filter and Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0 14px',
                  height: '42px',
                  width: '320px',
                }}>
                  <Search size={16} color="#64748B" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Ism yoki telefon raqam..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
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
                </div>

                {/* Role Tabs */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'Fuqaro', 'Yurist', 'Moderator'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedUserRole(role)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: selectedUserRole === role ? 'rgba(0, 163, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                        background: selectedUserRole === role ? 'rgba(0, 163, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        color: selectedUserRole === role ? '#00E5FF' : '#94A3B8',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {role === 'all' ? 'Barchasi' : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#64748B',
                      fontSize: '11.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                    }}>
                      <th style={{ padding: '12px 14px' }}>Foydalanuvchi</th>
                      <th style={{ padding: '12px 14px' }}>Roli</th>
                      <th style={{ padding: '12px 14px' }}>Arizalar / Faollik</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Ro‘yxatdan o‘tgan</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '12px',
                            }}>
                              {u.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{u.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#64748B' }}>{u.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: `${u.roleColor}18`,
                            color: u.roleColor,
                            fontSize: '11.5px',
                            fontWeight: 700,
                            border: `1px solid ${u.roleColor}30`,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                          {u.appsCount} ta
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: u.status === 'Faol' ? '#10B981' : '#F59E0B',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Faol' ? '#10B981' : '#F59E0B' }} />
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '12.5px', color: '#94A3B8' }}>
                          {u.registered}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <button
                            onClick={() => alert(`${u.name} profili ochildi.`)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#00E5FF',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Ko‘rish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: XIZMATLAR
           ========================================================================= */}
        {activeTab === 'xizmatlar' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
              {servicesList.map((srv) => (
                <div
                  key={srv.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderRadius: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: `${srv.badgeColor}18`,
                          border: `1px solid ${srv.badgeColor}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: srv.badgeColor,
                        }}>
                          <Briefcase size={20} />
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                          {srv.title}
                        </h3>
                      </div>

                      {/* Status Toggle Switch */}
                      <button
                        onClick={() => toggleServiceStatus(srv.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: srv.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: srv.isActive ? '#10B981' : '#EF4444',
                          fontWeight: 700,
                          fontSize: '11.5px',
                          cursor: 'pointer',
                        }}
                      >
                        {srv.isActive ? 'Faol' : 'To‘xtatilgan'}
                      </button>
                    </div>

                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: '19px' }}>
                      {srv.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Andozalar: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{srv.templatesCount} ta</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Foydalanildi: <span style={{ color: '#00E5FF', fontWeight: 700 }}>{srv.usageCount}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Muvaffaqiyat: <span style={{ color: '#10B981', fontWeight: 700 }}>{srv.successRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => alert('Yangi xizmat yoki andoza yaratish oynasi tez orada qo‘shiladi.')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00B2FF 0%, #0077FF 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 20px rgba(0, 163, 255, 0.4)',
                }}
              >
                <Plus size={16} />
                <span>Yangi xizmat qo‘shish</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: PREMIUM OBUNA
           ========================================================================= */}
        {activeTab === 'premium' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {[
                { title: 'Oylik jami tushum (MRR)', value: '124 500 000 so‘m', change: '+22.8%', color: '#10B981' },
                { title: 'Faol Premium a’zolar', value: '2,410 ta', change: '+14.2%', color: '#00A3FF' },
                { title: 'O‘rtacha to‘lov (ARPU)', value: '49 000 so‘m/oy', change: 'Barqaror', color: '#F59E0B' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="glass-panel-interactive"
                  style={{
                    padding: '20px 22px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>{m.title}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: m.color, background: `${m.color}18`, padding: '3px 8px', borderRadius: '6px' }}>
                      {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Plans Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {[
                {
                  title: 'Standart Tarif',
                  price: '19 000 so‘m',
                  period: '/ oy',
                  subs: '1,240 ta faol obunachi',
                  features: ['Cheksiz andozalar yuklab olish', 'Shartnomalar generatori', 'Tezkor yuridik maslahat'],
                  isPopular: false,
                },
                {
                  title: 'Pro Yurist Tarifi',
                  price: '49 000 so‘m',
                  period: '/ oy',
                  subs: '890 ta faol obunachi',
                  features: ['Barcha Standart imkoniyatlar', 'Sud da’vo arizalari to‘liq paketi', '24/7 AI Yurist prioriteti', 'Yuridik ekspertiza xizmati'],
                  isPopular: true,
                },
                {
                  title: 'Korporativ Tarif',
                  price: '149 000 so‘m',
                  period: '/ oy',
                  subs: '280 ta faol tashkilot',
                  features: ['Cheksiz xodimlar hisobi', 'Barcha mini ilovalarga kirish', 'Shaxsiy advokat biriktirilishi', 'Shartnomalar yuridik auditi'],
                  isPopular: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className="glass-panel-interactive"
                  style={{
                    padding: '28px',
                    borderRadius: '22px',
                    border: plan.isPopular ? '1px solid rgba(0, 163, 255, 0.4)' : undefined,
                    boxShadow: plan.isPopular ? '0 0 30px rgba(0, 163, 255, 0.25)' : undefined,
                    position: 'relative',
                  }}
                >
                  {plan.isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'linear-gradient(135deg, #00B2FF, #0077FF)',
                      color: '#FFFFFF',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      letterSpacing: '0.4px',
                    }}>
                      ENG OMMABOP
                    </div>
                  )}

                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                    {plan.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: '#00E5FF' }}>{plan.price}</span>
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, marginBottom: '20px' }}>
                    {plan.subs}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#E2E8F0' }}>
                        <CheckCircle2 size={15} color="#00E5FF" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: REKLAMA
           ========================================================================= */}
        {activeTab === 'reklama' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Ad Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {[
                { title: 'Faol reklama bannerlari', value: '3 ta faol', change: '100% qamrov', color: '#10B981' },
                { title: 'Jami ko‘rishlar soni', value: '248,500', change: '+32.4%', color: '#00A3FF' },
                { title: 'O‘rtacha bosilishlar (CTR)', value: '4.8%', change: '12,120 klik', color: '#F59E0B' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="glass-panel-interactive"
                  style={{
                    padding: '20px 22px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>{m.title}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: m.color, background: `${m.color}18`, padding: '3px 8px', borderRadius: '6px' }}>
                      {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ads Manager Table */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Faol reklama kampaniyalari va bannerlar
                </h3>
                <button
                  onClick={() => alert('Yangi reklama kampaniyasi yaratish oynasi.')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #00B2FF 0%, #0077FF 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={15} />
                  <span>Yangi reklama qo‘shish</span>
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#64748B',
                      fontSize: '11.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                    }}>
                      <th style={{ padding: '12px 14px' }}>Reklama nomi & Joylashuv</th>
                      <th style={{ padding: '12px 14px' }}>Ko‘rishlar</th>
                      <th style={{ padding: '12px 14px' }}>Bosilishlar (Klik)</th>
                      <th style={{ padding: '12px 14px' }}>CTR ko‘rsatkichi</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adBanners.map((ad) => (
                      <tr
                        key={ad.id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                            {ad.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#00E5FF' }}>{ad.placement}</div>
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                          {ad.impressions}
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                          {ad.clicks}
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                          {ad.ctr}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button
                            onClick={() => toggleAdStatus(ad.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: ad.status ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: ad.status ? '#10B981' : '#EF4444',
                              fontWeight: 700,
                              fontSize: '11.5px',
                              cursor: 'pointer',
                            }}
                          >
                            {ad.status ? 'Faol' : 'Nofaol'}
                          </button>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <button
                            onClick={() => alert(`"${ad.title}" tahrirlash oynasi.`)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#CBD5E1',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Tahrirlash
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAdd={handleAddApplication}
      />
    </div>
  );
}
