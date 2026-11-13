import React, { useState, useRef } from 'react';
import { TopicDetailManagementView } from './TopicDetailManagementView';
import type {
  TopicCourse,
  CourseLessonItem,
  TopicCertificateItem,
} from './TopicDetailManagementView';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Pencil,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Tag,
  BookOpen,
  ShoppingBag,
  Award,
  Layers,
  Gift,
  X,
  UploadCloud,
  Coins
} from 'lucide-react';

export interface TopicItem {
  id: string;
  order: number;
  title: string;
  iconName: string;
  subtitle: string;
  lessonsCount: number;
  level: string;
  color?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  durationKey: string;
  durationLabel: string;
  createdAt: number;
  expiresAt: number | null;
  isActive: boolean;
}

export interface StoreItem {
  id: string;
  title: string;
  category: 'talim' | 'maxsus' | 'hamkorlar';
  categoryLabel: string;
  subcategory: string;
  priceCoins: number;
  iconName: string;
  desc: string;
}

interface HuquqMaktabiData {
  banners: AdBanner[];
  topics: TopicItem[];
  courses?: TopicCourse[];
  lessons?: CourseLessonItem[];
  certificates?: TopicCertificateItem[];
  store: {
    banners: AdBanner[];
    talimItems: StoreItem[];
    maxsusItems: StoreItem[];
    hamkorlarItems: StoreItem[];
  };
}

interface Props {
  onBack: () => void;
  data: HuquqMaktabiData;
  onRefresh: () => void;
}

const DURATION_OPTIONS = [
  { key: '1_day', label: '1 kunlik' },
  { key: '3_days', label: '3 kunlik' },
  { key: '1_week', label: '1 haftalik' },
  { key: '2_weeks', label: '2 haftalik' },
  { key: '1_month', label: '1 oylik' },
  { key: '3_months', label: '3 oylik' },
  { key: 'forever', label: 'Bir umr turadigani (Muddatsiz)' },
];

const AVAILABLE_ICONS = [
  { name: 'scale-outline', label: 'Tarozi (Adolat)' },
  { name: 'people', label: 'Odamlar / Jamoa' },
  { name: 'hard-hat', label: 'Mehnat / Dubulg‘a' },
  { name: 'cart', label: 'Savatcha (Iste’molchi)' },
  { name: 'shield-checkmark', label: 'Qalqon (Himoya)' },
  { name: 'gavel', label: 'Bolg‘a (Sud/Jinoyat)' },
  { name: 'home', label: 'Uy-joy' },
  { name: 'laptop', label: 'Noutbuk (IT/Raqamli)' },
  { name: 'coins', label: 'Tangalar (Moliya)' },
  { name: 'book-outline', label: 'Kitob (Qonun)' },
];

export const HuquqMaktabiDetailView: React.FC<Props> = ({ onBack, data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'topics' | 'store'>('banners');
  const [storeSubTab, setStoreSubTab] = useState<'banners' | 'talim' | 'maxsus' | 'hamkorlar'>('banners');

  // Modal states for Ad Banner
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [bannerTarget, setBannerTarget] = useState<'main' | 'store'>('main');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerDuration, setBannerDuration] = useState('1_month');
  const [isUploading, setIsUploading] = useState(false);

  // Modal states for Topic Edit & View
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [isViewingTopic, setIsViewingTopic] = useState(false);
  const [topicOrder, setTopicOrder] = useState<number>(1);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicSubtitle, setTopicSubtitle] = useState('');
  const [topicIcon, setTopicIcon] = useState('scale-outline');
  const [topicLessons, setTopicLessons] = useState<number>(10);
  const [topicLevel, setTopicLevel] = useState('Boshlang‘ich');

  // Modal states for Store Item Edit & View
  const [selectedStoreItem, setSelectedStoreItem] = useState<StoreItem | null>(null);
  const [isEditingStoreItem, setIsEditingStoreItem] = useState(false);
  const [isViewingStoreItem, setIsViewingStoreItem] = useState(false);
  const [storeItemTitle, setStoreItemTitle] = useState('');
  const [storeItemCategory, setStoreItemCategory] = useState<'talim' | 'maxsus' | 'hamkorlar'>('talim');
  const [storeItemSubcategory, setStoreItemSubcategory] = useState('');
  const [storeItemPrice, setStoreItemPrice] = useState<number>(100);
  const [storeItemDesc, setStoreItemDesc] = useState('');

  const [managingTopic, setManagingTopic] = useState<TopicItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  if (managingTopic) {
    return (
      <TopicDetailManagementView
        topic={managingTopic}
        allTopics={data?.topics || []}
        courses={data?.courses || []}
        lessons={data?.lessons || []}
        certificates={data?.certificates || []}
        onBack={() => setManagingTopic(null)}
        onRefresh={onRefresh}
      />
    );
  }

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Rasm hajmi 5MB dan kichik bo‘lishi lozim');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Advertising Banner
  const handleCreateBanner = async () => {
    if (!bannerImage) {
      showToast('Iltimos, swiper rasmini yuklang yoki URL kiriting!');
      return;
    }

    try {
      setIsUploading(true);
      const res = await fetch('http://localhost:5000/api/huquq-maktabi/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: bannerTarget,
          imageUrl: bannerImage,
          durationKey: bannerDuration,
        }),
      });

      const result = await res.json();
      if (result.success) {
        showToast('Swiper reklamasi muvaffaqiyatli qo‘shildi!');
        setShowAddBannerModal(false);
        setBannerImage('');
        setBannerDuration('1_month');
        onRefresh();
      } else {
        showToast(result.message || 'Xatolik yuz berdi');
      }
    } catch {
      showToast('Server bilan bog‘lanishda xatolik');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string, target: 'main' | 'store') => {
    if (!confirm('Haqiqatan ham ushbu reklamani o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/huquq-maktabi/banners/${id}?target=${target}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        showToast('Reklama o‘chirildi');
        onRefresh();
      }
    } catch {
      showToast('O‘chirishda server xatosi');
    }
  };

  // Edit Topic Handler
  const openEditTopic = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setTopicOrder(topic.order);
    setTopicTitle(topic.title);
    setTopicSubtitle(topic.subtitle);
    setTopicIcon(topic.iconName);
    setTopicLessons(topic.lessonsCount);
    setTopicLevel(topic.level);
    setIsEditingTopic(true);
  };

  const handleSaveTopic = async () => {
    if (!selectedTopic) return;
    try {
      const res = await fetch(`http://localhost:5000/api/huquq-maktabi/topics/${selectedTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: topicOrder,
          title: topicTitle,
          subtitle: topicSubtitle,
          iconName: topicIcon,
          lessonsCount: topicLessons,
          level: topicLevel,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast('Mavzu ma’lumotlari muvaffaqiyatli yangilandi!');
        setIsEditingTopic(false);
        onRefresh();
      }
    } catch {
      showToast('Yangilashda xatolik');
    }
  };

  // Edit Store Item
  const openEditStoreItem = (item: StoreItem, cat: 'talim' | 'maxsus' | 'hamkorlar') => {
    setSelectedStoreItem(item);
    setStoreItemCategory(cat);
    setStoreItemTitle(item.title);
    setStoreItemSubcategory(item.subcategory);
    setStoreItemPrice(item.priceCoins);
    setStoreItemDesc(item.desc);
    setIsEditingStoreItem(true);
  };

  const handleSaveStoreItem = async () => {
    if (!selectedStoreItem) return;
    try {
      const res = await fetch(`http://localhost:5000/api/huquq-maktabi/store/items/${selectedStoreItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: storeItemCategory,
          title: storeItemTitle,
          subcategory: storeItemSubcategory,
          priceCoins: storeItemPrice,
          desc: storeItemDesc,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast('Mahsulot ma’lumotlari yangilandi!');
        setIsEditingStoreItem(false);
        onRefresh();
      }
    } catch {
      showToast('Yangilashda xatolik');
    }
  };

  // Format remaining time badge
  const renderRemainingBadge = (expiresAt: number | null) => {
    if (!expiresAt) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        }}>
          <Sparkles size={12} /> Bir umr (Muddatsiz)
        </span>
      );
    }
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.35)',
        }}>
          <Clock size={12} /> Muddati tugagan
        </span>
      );
    }

    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        background: 'rgba(245, 158, 11, 0.2)',
        color: '#F59E0B',
        border: '1px solid rgba(245, 158, 11, 0.35)',
      }}>
        <Clock size={12} /> {days} kun qoldi
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '40px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <CheckCircle2 size={16} />
          {notification}
        </div>
      )}

      {/* Top Header Card with Back Button */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            title="Xizmatlar ro‘yxatiga qaytish"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#C084FC',
                border: '1px solid rgba(139, 92, 246, 0.35)',
              }}>
                Xizmat boshqaruvi
              </span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>• Real-time jonli sinxronizatsiya</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.3px' }}>
              Huquq Maktabi Boshqaruvi
            </h1>
          </div>
        </div>

        {activeTab === 'banners' && (
          <button
            onClick={() => {
              setBannerTarget('main');
              setShowAddBannerModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Plus size={16} />
            <span>Yangi reklama qo‘shish</span>
          </button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px',
        background: 'rgba(8, 14, 27, 0.6)',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        width: 'fit-content',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setActiveTab('banners')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'banners' ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'transparent',
            color: activeTab === 'banners' ? '#FFFFFF' : '#94A3B8',
            fontSize: '13px',
            fontWeight: activeTab === 'banners' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'banners' ? '0 0 16px rgba(139, 92, 246, 0.35)' : 'none',
          }}
        >
          <ImageIcon size={16} />
          <span>Reklama bo‘limi (Bosh sahifa swiper)</span>
          <span style={{
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            background: 'rgba(0, 0, 0, 0.25)',
            color: '#FFFFFF',
          }}>
            {data.banners?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'topics' ? 'linear-gradient(135deg, #00A3FF 0%, #0077FF 100%)' : 'transparent',
            color: activeTab === 'topics' ? '#FFFFFF' : '#94A3B8',
            fontSize: '13px',
            fontWeight: activeTab === 'topics' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'topics' ? '0 0 16px rgba(0, 163, 255, 0.35)' : 'none',
          }}
        >
          <BookOpen size={16} />
          <span>Mavzular bo‘limi (Katalog)</span>
          <span style={{
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            background: 'rgba(0, 0, 0, 0.25)',
            color: '#FFFFFF',
          }}>
            {data.topics?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'store' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
            color: activeTab === 'store' ? '#FFFFFF' : '#94A3B8',
            fontSize: '13px',
            fontWeight: activeTab === 'store' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'store' ? '0 0 16px rgba(16, 185, 129, 0.35)' : 'none',
          }}
        >
          <ShoppingBag size={16} />
          <span>Maktab do‘koni (Coin Shop)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. REKLAMA BO‘LIMI (BOSH SAHIFA SWIPER) */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Notification Info Box */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}>
            <Sparkles size={20} color="#C084FC" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#E9D5FF' }}>
                Avtomatik o‘chish mexanizmi faol
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '3px', lineHeight: '18px' }}>
                Qo‘shilgan swiper reklamalari belgilangan muddat (1 kun, 3 kun, 1 hafta, 2 hafta, 1 oy, 3 oy) o‘tgandan so‘ng mini ilovadan hamda admin paneldan avtomatik o‘chib ketadi.
              </div>
            </div>
          </div>

          {/* Banner Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {(!data.banners || data.banners.length === 0) ? (
              <div className="glass-panel" style={{
                gridColumn: '1 / -1',
                padding: '60px 20px',
                textAlign: 'center',
                borderRadius: '20px',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
              }}>
                <ImageIcon size={44} color="#64748B" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#CBD5E1', margin: '0 0 4px 0' }}>
                  Hozircha faol reklama yo‘q
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '380px', margin: '0 auto' }}>
                  «Yangi reklama qo‘shish» tugmasi orqali Huquq maktabi bosh sahifasi uchun swiper rasmini joylashtiring.
                </p>
              </div>
            ) : (
              data.banners.map((banner) => (
                <div
                  key={banner.id}
                  className="glass-panel"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(14, 22, 38, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Banner Image Preview Container */}
                  <div style={{
                    position: 'relative',
                    height: '180px',
                    width: '100%',
                    background: '#070B14',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7, 11, 20, 0.95) 0%, rgba(7, 11, 20, 0.2) 60%, transparent 100%)',
                    }} />

                    {/* Remaining Days Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      {renderRemainingBadge(banner.expiresAt)}
                    </div>

                    {/* Delete button on image */}
                    <button
                      onClick={() => handleDeleteBanner(banner.id, 'main')}
                      title="Reklamani o‘chirish"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.85)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Banner Footer Info */}
                  <div style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(8, 14, 27, 0.4)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#C084FC',
                      }}>
                        {banner.durationLabel}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {new Date(banner.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBanner(banner.id, 'main')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} /> O‘chirish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAVZULAR BO‘LIMI (KATALOG JADVALI) */}
      {/* ========================================================================= */}
      {activeTab === 'topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Header Info */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(0, 163, 255, 0.1)',
            border: '1px solid rgba(0, 163, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <Layers size={20} color="#00E5FF" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#E0F2FE' }}>
                Mini ilovadagi huquqiy mavzular katalogi (10 ta yo‘nalish)
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Har bir mavzuning tartib raqami (navbati), iconi, nomi, qisqacha tavsifi va darslar sonini o‘zgartirishingiz mumkin.
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '20px',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', width: '70px' }}>
                    Navbati
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Mavzu nomi va tavsifi
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Icon kodi
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>
                    Modullar soni
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>
                    Daraja
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topics?.map((topic) => (
                  <tr
                    key={topic.id}
                    className="table-row-hover"
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Order / Navbati */}
                    <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        background: 'rgba(0, 163, 255, 0.15)',
                        border: '1px solid rgba(0, 163, 255, 0.3)',
                        color: '#00E5FF',
                        fontWeight: 800,
                        fontSize: '13px',
                      }}>
                        #{topic.order}
                      </span>
                    </td>

                    {/* Topic Title & Subtitle */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00A3FF',
                          flexShrink: 0,
                        }}>
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '3px' }}>
                            {topic.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94A3B8', maxWidth: '420px', lineHeight: '16px' }}>
                            {topic.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Icon Name Tag */}
                    <td style={{ padding: '16px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <Tag size={12} color="#94A3B8" /> {topic.iconName}
                      </span>
                    </td>

                    {/* Lessons Count */}
                    <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                        {topic.lessonsCount} ta modul
                      </span>
                    </td>

                    {/* Level Badge */}
                    <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}>
                        {topic.level}
                      </span>
                    </td>

                    {/* Actions: Eye & Edit */}
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setManagingTopic(topic);
                          }}
                          title="Mavzu darslari, kurslari va sertifikatlarini boshqarish"
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '9px',
                            border: '1px solid rgba(0, 163, 255, 0.35)',
                            background: 'rgba(0, 163, 255, 0.12)',
                            color: '#00A3FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEditTopic(topic)}
                          title="Tahrirlash"
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '9px',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            background: 'rgba(245, 158, 11, 0.12)',
                            color: '#F59E0B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAKTAB DO‘KONI (COIN SHOP) */}
      {/* ========================================================================= */}
      {activeTab === 'store' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subtabs Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStoreSubTab('banners')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: storeSubTab === 'banners' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                  color: storeSubTab === 'banners' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: storeSubTab === 'banners' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={15} />
                <span>1. Reklama bo‘limi</span>
              </button>

              <button
                onClick={() => setStoreSubTab('talim')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: storeSubTab === 'talim' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                  color: storeSubTab === 'talim' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: storeSubTab === 'talim' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <BookOpen size={15} />
                <span>2. Ta’lim imtiyozlari</span>
              </button>

              <button
                onClick={() => setStoreSubTab('maxsus')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: storeSubTab === 'maxsus' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                  color: storeSubTab === 'maxsus' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: storeSubTab === 'maxsus' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <Gift size={15} />
                <span>3. Maxsus sovg‘alar</span>
              </button>

              <button
                onClick={() => setStoreSubTab('hamkorlar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: storeSubTab === 'hamkorlar' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                  color: storeSubTab === 'hamkorlar' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: storeSubTab === 'hamkorlar' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <Award size={15} />
                <span>4. Hamkorlar takliflari</span>
              </button>
            </div>

            {storeSubTab === 'banners' && (
              <button
                onClick={() => {
                  setBannerTarget('store');
                  setShowAddBannerModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>Do‘konga reklama qo‘shish</span>
              </button>
            )}
          </div>

          {/* 3.1 Store Banners */}
          {storeSubTab === 'banners' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {(!data.store?.banners || data.store.banners.length === 0) ? (
                <div className="glass-panel" style={{
                  gridColumn: '1 / -1',
                  padding: '60px 20px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                }}>
                  <ImageIcon size={44} color="#64748B" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#CBD5E1', margin: '0 0 4px 0' }}>
                    Do‘kon uchun reklama mavjud emas
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '380px', margin: '0 auto' }}>
                    Coin Shop yuqori qismidagi swiper uchun rasm yuklab, amal qilish muddatini tanlang.
                  </p>
                </div>
              ) : (
                data.store.banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="glass-panel"
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(14, 22, 38, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: '180px',
                      width: '100%',
                      background: '#070B14',
                    }}>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(7, 11, 20, 0.95) 0%, transparent 60%)',
                      }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        {renderRemainingBadge(banner.expiresAt)}
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(banner.id, 'store')}
                        title="O‘chirish"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '9px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.85)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  {/* Store Banner Footer */}
                  <div style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(8, 14, 27, 0.4)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                      }}>
                        {banner.durationLabel}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {new Date(banner.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBanner(banner.id, 'store')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} /> O‘chirish
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          )}

          {/* 3.2 Ta'lim imtiyozlari */}
          {storeSubTab === 'talim' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {data.store?.talimItems?.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: 'rgba(0, 163, 255, 0.15)',
                        color: '#00E5FF',
                        border: '1px solid rgba(0, 163, 255, 0.3)',
                      }}>
                        {item.subcategory}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F59E0B', fontWeight: 800, fontSize: '14px' }}>
                        <Coins size={16} />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '18px' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    marginTop: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#CBD5E1',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'talim')}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3.3 Maxsus sovg'alar */}
          {storeSubTab === 'maxsus' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {data.store?.maxsusItems?.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#C084FC',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}>
                        {item.subcategory}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F59E0B', fontWeight: 800, fontSize: '14px' }}>
                        <Coins size={16} />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '18px' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    marginTop: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#CBD5E1',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'maxsus')}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3.4 Hamkorlar takliflari */}
          {storeSubTab === 'hamkorlar' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {data.store?.hamkorlarItems?.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#F59E0B',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}>
                        {item.subcategory}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F59E0B', fontWeight: 800, fontSize: '14px' }}>
                        <Coins size={16} />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '18px' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    marginTop: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#CBD5E1',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'hamkorlar')}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '9px',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ADVERTISING SWIPER BANNER */}
      {/* ========================================================================= */}
      {showAddBannerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setShowAddBannerModal(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '24px',
              padding: '28px',
              background: 'rgba(11, 18, 33, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC',
                }}>
                  <ImageIcon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2px 0' }}>
                    {bannerTarget === 'store' ? 'Do‘kon uchun reklama qo‘shish' : 'Huquq maktabi uchun reklama'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Swiper rasmi va muddatini belgilash</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddBannerModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Image Upload Area */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                  Swiper rasmi (Kompyuterdan yuklash yoki URL)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {bannerImage ? (
                  <div style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#070B14',
                  }}>
                    <img src={bannerImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => setBannerImage('')}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#EF4444',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <UploadCloud size={32} color="#C084FC" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                      Kompyuterdan rasm yuklash
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                      PNG, JPG, WEBP (Maksimal 5MB)
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="yoki rasm to‘g‘ridan-to‘g‘ri URL manzilini kiriting..."
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Duration Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Reklama muddati (Avtomatik o‘chish vaqti):
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={bannerDuration}
                    onChange={(e) => setBannerDuration(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: '#0F172A',
                      padding: '0 36px 0 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Calendar size={16} color="#64748B" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '5px' }}>
                  Ushbu muddat yakuniga yetgach reklama avtomatik ravishda olib tashlanadi.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <button
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleCreateBanner}
                disabled={isUploading}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                {isUploading ? 'Yuklanmoqda...' : 'Saqlash va faollashtirish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TOPIC EDIT (NAVBI, TITLE, ICON, LEVEL, LESSONS) */}
      {/* ========================================================================= */}
      {isEditingTopic && selectedTopic && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setIsEditingTopic(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '24px',
              padding: '28px',
              background: 'rgba(11, 18, 33, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(0, 163, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00E5FF',
                }}>
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2px 0' }}>
                    Mavzuni tahrirlash
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Tartib raqami, icon va matnlarni sozlash</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditingTopic(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {/* Navbati */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    Navbati (#):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={topicOrder}
                    onChange={(e) => setTopicOrder(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0 12px',
                      color: '#00E5FF',
                      fontSize: '15px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Modullar soni */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    Modullar soni:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={topicLessons}
                    onChange={(e) => setTopicLessons(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0 12px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Darajasi */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    Daraja:
                  </label>
                  <select
                    value={topicLevel}
                    onChange={(e) => setTopicLevel(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: '#0F172A',
                      padding: '0 10px',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  >
                    <option value="Boshlang‘ich">Boshlang‘ich</option>
                    <option value="O‘rta">O‘rta</option>
                    <option value="Murakkab">Murakkab</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Mavzu nomi:
                </label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '11px 14px',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Icon selector & custom input */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Mavzu iconi (Tanlang yoki nomini yozing):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <select
                    value={AVAILABLE_ICONS.some((ic) => ic.name === topicIcon) ? topicIcon : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setTopicIcon(e.target.value);
                      }
                    }}
                    style={{
                      height: '42px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: '#0F172A',
                      padding: '0 12px',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      outline: 'none',
                    }}
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                    <option value="custom">Boshqa icon nomi...</option>
                  </select>

                  <input
                    type="text"
                    value={topicIcon}
                    onChange={(e) => setTopicIcon(e.target.value)}
                    placeholder="masalan: gavel, cart"
                    style={{
                      height: '42px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0 12px',
                      color: '#C084FC',
                      fontSize: '12.5px',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Qisqacha tavsifi (Subtitle):
                </label>
                <textarea
                  rows={2}
                  value={topicSubtitle}
                  onChange={(e) => setTopicSubtitle(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    lineHeight: '18px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <button
                type="button"
                onClick={() => setIsEditingTopic(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSaveTopic}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00A3FF 0%, #0077FF 100%)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0, 163, 255, 0.4)',
                }}
              >
                O‘zgarishlarni saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TOPIC VIEW DETAILS */}
      {/* ========================================================================= */}
      {isViewingTopic && selectedTopic && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setIsViewingTopic(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              padding: '26px',
              background: 'rgba(11, 18, 33, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                background: 'rgba(0, 163, 255, 0.15)',
                color: '#00E5FF',
              }}>
                Navbat: #{selectedTopic.order}
              </span>
              <button
                onClick={() => setIsViewingTopic(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Mavzu nomi:
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
                  {selectedTopic.title}
                </h3>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tavsifi:
                </span>
                <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '4px 0 0 0', lineHeight: '19px' }}>
                  {selectedTopic.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                <div style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Dars modullari</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {selectedTopic.lessonsCount} ta
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Qiyinlik darajasi</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#00A3FF', marginTop: '2px' }}>
                    {selectedTopic.level}
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Mini ilovadagi icon kodi: </span>
                <span style={{ fontFamily: 'monospace', color: '#C084FC', fontWeight: 700, fontSize: '13px' }}>
                  {selectedTopic.iconName}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                onClick={() => setIsViewingTopic(false)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STORE ITEM EDIT & VIEW */}
      {/* ========================================================================= */}
      {isEditingStoreItem && selectedStoreItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setIsEditingStoreItem(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: '24px',
              padding: '28px',
              background: 'rgba(11, 18, 33, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Do‘kon mahsulotini tahrirlash
              </h3>
              <button
                onClick={() => setIsEditingStoreItem(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Nomi:
                </label>
                <input
                  type="text"
                  value={storeItemTitle}
                  onChange={(e) => setStoreItemTitle(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    Kichik toifa (subkategoriya):
                  </label>
                  <input
                    type="text"
                    value={storeItemSubcategory}
                    onChange={(e) => setStoreItemSubcategory(e.target.value)}
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    Narxi (Coin):
                  </label>
                  <input
                    type="number"
                    value={storeItemPrice}
                    onChange={(e) => setStoreItemPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '10px 14px',
                      color: '#F59E0B',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Tavsifi:
                </label>
                <textarea
                  rows={3}
                  value={storeItemDesc}
                  onChange={(e) => setStoreItemDesc(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    lineHeight: '18px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <button
                onClick={() => setIsEditingStoreItem(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#CBD5E1',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveStoreItem}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewingStoreItem && selectedStoreItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setIsViewingStoreItem(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '24px',
              padding: '26px',
              background: 'rgba(11, 18, 33, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
              }}>
                {selectedStoreItem.subcategory}
              </span>
              <button
                onClick={() => setIsViewingStoreItem(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                {selectedStoreItem.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: '18px', margin: 0 }}>
                {selectedStoreItem.desc}
              </p>
            </div>

            <div style={{
              marginTop: '18px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Talab qilinadigan ball:</span>
              <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Coins size={16} /> {selectedStoreItem.priceCoins} coin
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                onClick={() => setIsViewingStoreItem(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
