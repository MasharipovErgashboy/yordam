import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, Filter } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onOpenNewModal: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onOpenNewModal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Oxirgi 7 kun');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filters = ['Oxirgi 7 kun', 'Bugun', 'Oxirgi 30 kun', 'Shu oy', 'Barcha davr'];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      position: 'relative',
      zIndex: 5,
    }}>
      {/* Left Title and Subtitle */}
      <div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.5px',
          margin: '0 0 4px 0',
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#94A3B8',
          margin: 0,
          fontWeight: 500,
        }}>
          {subtitle}
        </p>
      </div>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date Filter Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '12px',
              background: 'rgba(14, 22, 38, 0.40)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#E2E8F0',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(22, 34, 60, 0.55)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(14, 22, 38, 0.40)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <Calendar size={15} color="#94A3B8" />
            <span>{selectedFilter}</span>
            <ChevronDown size={14} color="#94A3B8" />
          </button>

          {/* Filter Dropdown Menu */}
          {showFilterDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '180px',
                padding: '6px',
                borderRadius: '14px',
                zIndex: 30,
                background: '#0B1323',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setSelectedFilter(f);
                    setShowFilterDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedFilter === f ? 'rgba(0, 163, 255, 0.15)' : 'transparent',
                    color: selectedFilter === f ? '#00E5FF' : '#CBD5E1',
                    fontSize: '12.5px',
                    fontWeight: selectedFilter === f ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFilter !== f) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFilter !== f) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Filter size={12} color={selectedFilter === f ? '#00E5FF' : '#64748B'} />
                  <span>{f}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Plus Action CTA Button */}
        <button
          onClick={onOpenNewModal}
          title="Yangi ariza yoki shartnoma qo‘shish"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #00B2FF 0%, #0077FF 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 163, 255, 0.5)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 28px rgba(0, 163, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 163, 255, 0.5)';
          }}
        >
          <Plus size={20} strokeWidth={2.6} />
        </button>
      </div>
    </header>
  );
};

