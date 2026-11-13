import React from 'react';
import { Calendar, DollarSign, Shield, TrendingUp } from 'lucide-react';
import type { MetricCardData } from '../types';

export const KPICards: React.FC = () => {
  const cards: MetricCardData[] = [
    {
      id: 'm1',
      title: 'Vencem na semana',
      value: '9',
      change: '+29%',
      isPositive: true,
      icon: 'calendar',
      color: '#00A3FF',
      bgColor: 'rgba(0, 163, 255, 0.15)',
    },
    {
      id: 'm2',
      title: 'Prêmios a renovar',
      value: 'R$ 14.300',
      change: '+12%',
      isPositive: true,
      icon: 'currency',
      color: '#A855F7',
      bgColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      id: 'm3',
      title: 'Apólices ativas',
      value: '642',
      change: '+6%',
      isPositive: true,
      icon: 'shield',
      color: '#F97316',
      bgColor: 'rgba(249, 115, 22, 0.15)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '18px',
      marginBottom: '20px',
    }}>
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            className="glass-panel-interactive"
            style={{
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '128px',
              background: 'rgba(14, 21, 38, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
            }}
          >
            {/* Top row: Icon and Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: card.bgColor,
                border: `1px solid ${card.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {card.icon === 'calendar' && <Calendar size={18} color={card.color} />}
                {card.icon === 'currency' && <DollarSign size={18} color={card.color} />}
                {card.icon === 'shield' && <Shield size={18} color={card.color} />}
              </div>

              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '-0.1px',
              }}>
                {card.title}
              </span>
            </div>

            {/* Bottom row: Large Stat Number and Change Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              marginTop: '14px',
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.6px',
                lineHeight: '1',
              }}>
                {card.value}
              </span>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 7px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: 800,
              }}>
                <TrendingUp size={11} />
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
