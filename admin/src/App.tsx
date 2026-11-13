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
  LayoutDashboard,
  AlertTriangle,
  RefreshCw,
  FolderLock,
  Settings,
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

  const [activeTab, setActiveTab] = useState('apolices');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Application list state for dynamic updates
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

  const handleLogout = () => {
    localStorage.removeItem('yordam_admin_session');
    setSession(null);
  };

  const handleAddApplication = (newApp: ApplicationItem) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Keyboard shortcut: Cmd/Ctrl + K for search focus
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

  // Render header titles based on active tab
  const getTabHeader = () => {
    switch (activeTab) {
      case 'visao_geral':
        return {
          title: 'Visão Geral (Umumiy tahlil)',
          subtitle: 'Real vaqtda platforma faolligi va umumiy statistika',
        };
      case 'sinistros':
        return {
          title: 'Sinistros (Da’volar va nizolar)',
          subtitle: 'Fuqarolar va tashkilotlar o‘rtasidagi faol sud hamda nizolar',
        };
      case 'renovacoes':
        return {
          title: 'Renovações (Muddati kelgan arizalar)',
          subtitle: '9 ta yangilanish va qayta ko‘rib chiqish talabi mavjud',
        };
      case 'documentos':
        return {
          title: 'Documentos (Hujjatlar ombori)',
          subtitle: 'Barcha rasmiy andozalar, da’vo arizalari va shartnomalar bazasi',
        };
      case 'configuracoes':
        return {
          title: 'Configurações (Tizim sozlamalari)',
          subtitle: 'Xavfsizlik, API ulanishlari va foydalanuvchilar boshqaruvi',
        };
      case 'apolices':
      default:
        return {
          title: 'Apólices',
          subtitle: 'Segunda, 9 de novembro • Vale Seguro Corretora',
        };
    }
  };

  const { title, subtitle } = getTabHeader();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#070B14',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient lighting effects matching screenshot */}
      <div className="ambient-bg" />
      <div className="ambient-dust" />

      {/* Left Sidebar */}
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

        {/* Tab Content */}
        {activeTab === 'apolices' && (
          <div className="animate-fade-in">
            {/* 3 Metric KPI Cards */}
            <KPICards />

            {/* Glowing Charts Row */}
            <ChartsSection />

            {/* Applications Data Table */}
            <ApplicationsTable applications={applications} />
          </div>
        )}

        {/* Other Sections (Visão Geral, Sinistros, Renovações, Documentos, Configurações) */}
        {activeTab === 'visao_geral' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <KPICards />
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                background: 'rgba(14, 21, 38, 0.65)',
                borderRadius: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(0, 163, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00A3FF',
              }}>
                <LayoutDashboard size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  Umumiy boshqaruv va real vaqt monitoringi
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, maxWidth: '700px' }}>
                  Yordam tizimining barcha mini ilovalari (Ish va mehnat huquqi, Iste’molchi huquqlari) bo‘yicha tushayotgan barcha arizalar hamda murojaatlar oqimi shu yerda jamlangan.
                </p>
              </div>
            </div>
            <ChartsSection />
          </div>
        )}

        {activeTab === 'sinistros' && (
          <div className="animate-fade-in">
            <div
              className="glass-panel"
              style={{
                padding: '36px',
                background: 'rgba(14, 21, 38, 0.65)',
                borderRadius: '22px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                }}>
                  <AlertTriangle size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Nizolar va iste’molchi da’volari
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Sotuvchilar yoki ish beruvchilar bilan hal qilinmagan muammolar ro‘yxati
                  </p>
                </div>
              </div>
              <ApplicationsTable
                applications={applications.filter((a) => a.category === 'istemolchi' || a.category === 'sud')}
              />
            </div>
          </div>
        )}

        {activeTab === 'renovacoes' && (
          <div className="animate-fade-in">
            <div
              className="glass-panel"
              style={{
                padding: '36px',
                background: 'rgba(14, 21, 38, 0.65)',
                borderRadius: '22px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                }}>
                  <RefreshCw size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Muddati yaqinlashgan arizalar (9 ta)
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Kafolat muddati yoki murojaat ko‘rib chiqish qonuniy muddati tugayotgan arizalar
                  </p>
                </div>
              </div>
              <ApplicationsTable applications={applications} />
            </div>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="animate-fade-in">
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                background: 'rgba(14, 21, 38, 0.65)',
                borderRadius: '22px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A855F7',
                }}>
                  <FolderLock size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Hujjatlar va andozalar arxivi
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Yuklab olingan va foydalanuvchilar tomonidan yaratilgan barcha rasmiy hujjatlar
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { title: 'Talabnoma andozalari', count: '18 ta fayl', size: '24.5 MB', color: '#00A3FF' },
                  { title: 'Sud da’vo arizalari', count: '12 ta fayl', size: '42.1 MB', color: '#A855F7' },
                  { title: 'Mehnat shartnomalari', count: '34 ta fayl', size: '89.3 MB', color: '#10B981' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="glass-panel-interactive"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(18, 27, 47, 0.7)',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '13px', color: doc.color, fontWeight: 600 }}>
                      {doc.count} • {doc.size}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ApplicationsTable applications={applications} />
          </div>
        )}

        {activeTab === 'configuracoes' && (
          <div className="animate-fade-in">
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                background: 'rgba(14, 21, 38, 0.65)',
                borderRadius: '22px',
                maxWidth: '700px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(249, 115, 22, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F97316',
                }}>
                  <Settings size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Admin Panel Sozlamalari
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Tizim parametrlari va administrator ma’lumotlari
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Administrator</div>
                  <div style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700 }}>
                    {session.name} ({session.username})
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Kirish ma’lumotlari</div>
                  <div style={{ fontSize: '14px', color: '#00A3FF', fontWeight: 600 }}>
                    Login: yordam | Parol: yordam123
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    marginTop: '12px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  Tizimdan chiqish (Logout)
                </button>
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
