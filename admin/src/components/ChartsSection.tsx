import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { BarChartData } from '../types';

export const ChartsSection: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const barData: BarChartData[] = [
    { label: 'S1', value: 52 },
    { label: 'S2', value: 88, active: true },
    { label: 'S3', value: 34 },
    { label: 'S4', value: 48 },
    { label: 'S5', value: 20 },
    { label: 'S6', value: 4 },
    { label: 'S7', value: 2 },
    { label: 'S8', value: 2 },
  ];

  // Donut chart calculations
  const percentage = 75;
  const radius = 64;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.8fr 1fr',
      gap: '18px',
      marginBottom: '20px',
    }}>
      {/* Left Card: Vencimentos por semana (Glowing Bar Chart) */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'rgba(14, 21, 38, 0.65)',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '340px',
        }}
      >
        {/* Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}>
          <h2 style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.2px',
          }}>
            Vencimentos por semana
          </h2>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#10B981',
            fontSize: '11.5px',
            fontWeight: 700,
          }}>
            <TrendingUp size={13} />
            <span>9 nesta semana</span>
          </div>
        </div>

        {/* Bar Chart Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px',
          paddingBottom: '8px',
          height: '210px',
          position: 'relative',
        }}>
          {barData.map((bar, idx) => {
            const isHovered = hoveredBar === idx;
            const barHeightPx = Math.max((bar.value / 100) * 180, 8);

            return (
              <div
                key={bar.label}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: `calc(100% - ${barHeightPx + 44}px)`,
                    background: '#0F172A',
                    border: '1px solid rgba(0, 163, 255, 0.4)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#00E5FF',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
                    pointerEvents: 'none',
                    zIndex: 20,
                  }}>
                    {bar.value}% ({Math.round(bar.value * 0.4)} ta)
                  </div>
                )}

                {/* Vertical Bar Capsule */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '44px',
                    height: `${barHeightPx}px`,
                    borderRadius: '12px 12px 6px 6px',
                    background: bar.value > 5
                      ? 'linear-gradient(180deg, #00D2FF 0%, #0070F3 100%)'
                      : 'rgba(255, 255, 255, 0.06)',
                    border: bar.value > 5 ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: bar.value > 5
                      ? isHovered
                        ? '0 0 24px rgba(0, 163, 255, 0.7), inset 0 2px 2px rgba(255, 255, 255, 0.4)'
                        : '0 0 16px rgba(0, 163, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                      : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top Neon Cap */}
                  {bar.value > 5 && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: '#FFFFFF',
                      opacity: 0.65,
                      borderRadius: '12px 12px 0 0',
                    }} />
                  )}
                </div>

                {/* X-axis Label */}
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: isHovered ? '#00E5FF' : '#64748B',
                  marginTop: '10px',
                  transition: 'color 0.2s ease',
                }}>
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Card: Meta renovação (Circular Donut Ring Chart) */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'rgba(14, 21, 38, 0.65)',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '340px',
        }}
      >
        {/* Card Header */}
        <h2 style={{
          fontSize: '17px',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '-0.2px',
        }}>
          Meta renovação
        </h2>

        {/* Circular Donut Ring Graphic */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="donutGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
              <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background track circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Glowing active progress arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="url(#donutGlow)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              filter="url(#ringGlow)"
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </svg>

          {/* Centered Numbers */}
          <div style={{
            position: 'absolute',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-1px',
            }}>
              75%
            </span>
            <span style={{
              fontSize: '11.5px',
              color: '#94A3B8',
              marginTop: '6px',
              fontWeight: 500,
            }}>
              de 40 apólices
            </span>
          </div>
        </div>

        {/* Bottom Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '12px',
          color: '#94A3B8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }} />
            <span>Yakunlangan: 30</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
            <span>Kutilmoqda: 10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
