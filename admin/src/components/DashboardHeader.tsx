import React, { useState } from 'react';
import { Search, Command, X } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  searchQuery: externalQuery,
  onSearchChange: externalOnChange,
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const query = externalQuery !== undefined ? externalQuery : internalQuery;

  const handleChange = (val: string) => {
    if (externalOnChange) {
      externalOnChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  const handleClear = () => {
    handleChange('');
    const input = document.getElementById('header-search-input') as HTMLInputElement | null;
    if (input) input.focus();
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '26px',
      position: 'relative',
      zIndex: 5,
      gap: '20px',
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

      {/* Right Search Bar (Placed in place of previous Date Filter and + button) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isFocused ? 'rgba(16, 26, 48, 0.65)' : 'rgba(255, 255, 255, 0.04)',
        border: isFocused ? '1px solid rgba(0, 163, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '14px',
        padding: '0 14px',
        height: '44px',
        width: '340px',
        maxWidth: '100%',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: isFocused
          ? '0 0 24px rgba(0, 163, 255, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
          : '0 8px 20px -8px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}>
        {/* Search Icon */}
        <Search
          size={16}
          color={isFocused ? '#00E5FF' : '#64748B'}
          style={{ marginRight: '10px', flexShrink: 0, transition: 'color 0.2s ease' }}
        />

        {/* Input */}
        <input
          id="header-search-input"
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Qidiruv (arizalar, mijozlar, bo‘limlar)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        />

        {/* Clear Button or Cmd+K Badge */}
        {query ? (
          <button
            onClick={handleClear}
            title="Tozalash"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            <X size={14} />
          </button>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '2px 6px',
            borderRadius: '6px',
            color: '#64748B',
            fontSize: '10.5px',
            fontWeight: 700,
            userSelect: 'none',
          }}>
            <Command size={10} />
            <span>K</span>
          </div>
        )}
      </div>
    </header>
  );
};
