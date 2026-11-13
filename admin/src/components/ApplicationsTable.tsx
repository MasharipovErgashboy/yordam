import React, { useState } from 'react';
import { Search, Eye, CheckCircle2, Clock, FileCheck, ArrowUpRight } from 'lucide-react';
import type { ApplicationItem } from '../types';

interface ApplicationsTableProps {
  applications?: ApplicationItem[];
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications: externalApplications,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const [internalApplications] = useState<ApplicationItem[]>([
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

  const applications = externalApplications || internalApplications;

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    const matchesQuery =
      searchQuery === '' ||
      app.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: '22px',
      }}
    >
      {/* Table Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px',
      }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3px 0' }}>
            So‘nggi arizalar va shartnomalar
          </h2>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0 }}>
            Mobil ilovadan kelib tushgan yangi murojaatlar va talabnomalar
          </p>
        </div>

        {/* Filter Pills + Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            background: 'rgba(8, 14, 27, 0.6)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {[
              { key: 'all', label: 'Barchasi' },
              { key: 'faol', label: 'Faol' },
              { key: 'kutilmoqda', label: 'Kutilmoqda' },
              { key: 'hal_qilindi', label: 'Hal qilindi' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filterStatus === tab.key ? '#00A3FF' : 'transparent',
                  color: filterStatus === tab.key ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: filterStatus === tab.key ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(8, 14, 27, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0 10px',
            height: '34px',
          }}>
            <Search size={14} color="#64748B" style={{ marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '12.5px',
                width: '140px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Hujjat №</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Murojaat turi</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Mijoz</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Sana</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Summa</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Holat</th>
              <th style={{ padding: '10px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Amal</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => {
              const isSuccess = app.status === 'hal_qilindi';
              const isPending = app.status === 'kutilmoqda';

              return (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px', fontSize: '12.5px', fontWeight: 700, color: '#00E5FF' }}>
                    {app.number}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                      {app.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                      {app.categoryLabel}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>{app.client}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{app.phone}</div>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#94A3B8' }}>
                    {app.date}
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {app.amount}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: isSuccess
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isPending
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(0, 163, 255, 0.15)',
                      color: isSuccess
                        ? '#10B981'
                        : isPending
                        ? '#F59E0B'
                        : '#00E5FF',
                      border: `1px solid ${
                        isSuccess
                          ? 'rgba(16, 185, 129, 0.3)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.3)'
                          : 'rgba(0, 163, 255, 0.3)'
                      }`,
                    }}>
                      {isSuccess && <CheckCircle2 size={11} />}
                      {isPending && <Clock size={11} />}
                      {!isSuccess && !isPending && <FileCheck size={11} />}
                      {app.statusLabel}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedApp(app)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#00A3FF';
                        e.currentTarget.style.borderColor = '#00A3FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      }}
                    >
                      <Eye size={13} />
                      <span>Ko‘rish</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(4, 7, 15, 0.75)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            borderRadius: '24px',
            background: '#0B1324',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 800 }}>{selectedApp.number}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>{selectedApp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                &times;
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Mijoz F.I.Sh:</span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>{selectedApp.client}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Telefon raqami:</span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#00E5FF' }}>{selectedApp.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Murojaat sanasi:</span>
                <span style={{ fontSize: '12.5px', color: '#FFFFFF' }}>{selectedApp.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Da’vo summasi:</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>{selectedApp.amount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  alert('Status muvaffaqiyatli o‘zgartirildi!');
                  setSelectedApp(null);
                }}
                style={{
                  flex: 1.5,
                  height: '42px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#00A3FF',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Ijroga qabul qilish</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
