import React, { useState } from 'react';
import { Plus, X, FileText, User, Phone, DollarSign } from 'lucide-react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newApp: any) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [category, setCategory] = useState<'istemolchi' | 'ish_mehnat' | 'shartnoma' | 'sud'>('istemolchi');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      alert('Iltimos, ariza nomi va mijoz ismini kiriting.');
      return;
    }

    const categoryLabels = {
      istemolchi: 'Iste’molchi huquqlari',
      ish_mehnat: 'Mehnat huquqi',
      shartnoma: 'Shartnomalar',
      sud: 'Fuqarolik sudi',
    };

    const newApp = {
      id: `app_${Date.now()}`,
      number: `AP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      client: client.trim(),
      phone: phone.trim(),
      category,
      categoryLabel: categoryLabels[category],
      date: 'Bugun',
      amount: amount.trim() ? `${amount.trim()} so‘m` : 'Ko‘rsatilmagan',
      status: 'faol' as const,
      statusLabel: 'Yangi ochilgan',
    };

    onAdd(newApp);
    onClose();
  };

  return (
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
        maxWidth: '500px',
        padding: '28px',
        borderRadius: '24px',
        background: '#0B1324',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(0, 163, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Plus size={18} color="#00E5FF" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Yangi ariza yoki talabnoma qo‘shish
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Murojaat / Talabnoma nomi *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '42px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <FileText size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Masalan: Tovar pulini qaytarish talabi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Mijoz F.I.Sh. *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '42px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <User size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Masalan: Aliyev Vali Anvar o‘g‘li"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Telefon raqami
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '0 12px',
                height: '42px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <Phone size={15} color="#64748B" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Da’vo summasi (so‘m)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '0 12px',
                height: '42px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <DollarSign size={15} color="#64748B" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="3 500 000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Huquqiy yo‘nalish (Toifa)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'istemolchi', label: 'Iste’molchi' },
                { key: 'ish_mehnat', label: 'Mehnat' },
                { key: 'shartnoma', label: 'Shartnoma' },
                { key: 'sud', label: 'Sud' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key as any)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: category === c.key ? '#00A3FF' : 'rgba(255, 255, 255, 0.1)',
                    background: category === c.key ? 'rgba(0, 163, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: category === c.key ? '#00E5FF' : '#94A3B8',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
              Bekor qilish
            </button>
            <button
              type="submit"
              style={{
                flex: 1.5,
                height: '42px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #00B2FF 0%, #0077FF 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 163, 255, 0.45)',
              }}
            >
              Arizani saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
