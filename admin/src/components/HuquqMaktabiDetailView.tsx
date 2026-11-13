import React, { useState, useRef } from 'react';
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
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
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

  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Image Upload handler (Base64 data or standard URL)
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
      const res = await fetch('/api/huquq-maktabi/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: bannerTarget,
          title: bannerTitle || (bannerTarget === 'store' ? 'Do‘kon reklamasi' : 'Huquq maktabi reklamasi'),
          subtitle: bannerSubtitle || 'Yangi taklif va imkoniyatlar',
          imageUrl: bannerImage,
          durationKey: bannerDuration,
        }),
      });

      const result = await res.json();
      if (result.success) {
        showToast('Swiper reklamasi muvaffaqiyatli qo‘shildi!');
        setShowAddBannerModal(false);
        setBannerImage('');
        setBannerTitle('');
        setBannerSubtitle('');
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
      const res = await fetch(`/api/huquq-maktabi/banners/${id}?target=${target}`, {
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
      const res = await fetch(`/api/huquq-maktabi/topics/${selectedTopic.id}`, {
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
      const res = await fetch(`/api/huquq-maktabi/store/items/${selectedStoreItem.id}`, {
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

  // Format remaining time
  const getRemainingTimeBadge = (expiresAt: number | null) => {
    if (!expiresAt) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3" /> Bir umr (Muddatsiz)
        </span>
      );
    }
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Clock className="w-3 h-3" /> Muddati tugagan
        </span>
      );
    }

    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3 h-3" /> {days} kun qoldi
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/90 text-white shadow-xl backdrop-blur-md border border-emerald-400/40 text-sm font-medium animate-slideIn">
          <CheckCircle2 className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200 border border-slate-700/60 shadow-sm group"
            title="Xizmatlar ro‘yxatiga qaytish"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Xizmat boshqaruvi
              </span>
              <span className="text-xs text-slate-400">Real-time sinxronizatsiya</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">Huquq Maktabi</h1>
          </div>
        </div>

        {/* Action Button */}
        {activeTab === 'banners' && (
          <button
            onClick={() => {
              setBannerTarget('main');
              setShowAddBannerModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi reklama qo‘shish</span>
          </button>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'banners'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Reklama bo‘limi (Bosh sahifa swiper)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300">
            {data.banners?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'topics'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mavzular bo‘limi (Katalog)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300">
            {data.topics?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'store'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Maktab do‘koni (Coin Shop)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. REKLAMA BO‘LIMI (BOSH SAHIFA SWIPERI) */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm text-purple-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-200">Avtomatik o‘chish mexanizmi faol</p>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Qo‘shilgan swiper reklamalari belgilangan muddat (1 kun, 1 hafta, 1 oy va h.k.) o‘tishi bilan avtomatik tarzda mini ilovadan ham, admin paneldan ham o‘chib ketadi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(!data.banners || data.banners.length === 0) ? (
              <div className="col-span-full py-16 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-slate-300 font-semibold text-base">Hozircha faol reklama yo‘q</h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  «Yangi reklama qo‘shish» tugmasi orqali Huquq maktabi bosh sahifasi uchun swiper rasmini joylashtiring.
                </p>
              </div>
            ) : (
              data.banners.map((banner) => (
                <div
                  key={banner.id}
                  className="group relative rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/40 overflow-hidden shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      {getRemainingTimeBadge(banner.expiresAt)}
                    </div>

                    <button
                      onClick={() => handleDeleteBanner(banner.id, 'main')}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-95"
                      title="Reklamani o‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                        {banner.durationLabel}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                        {banner.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <span>Qo‘shilgan: {new Date(banner.createdAt).toLocaleDateString('uz-UZ')}</span>
                      <button
                        onClick={() => handleDeleteBanner(banner.id, 'main')}
                        className="text-rose-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> O‘chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAVZULAR BO‘LIMI (KATALOG) */}
      {/* ========================================================================= */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-sm text-blue-300">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-200">Mini ilovadagi huquqiy mavzular ro‘yxati</p>
                <p className="text-xs text-blue-300/80 mt-0.5">
                  Har bir mavzuning tartib raqami (navbati), iconi, nomi va darslar sonini real vaqt rejimida tahrirlashingiz mumkin.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                    <th className="py-4 px-4 text-center w-16">Navbati</th>
                    <th className="py-4 px-4">Mavzu nomi va tavsifi</th>
                    <th className="py-4 px-4">Icon kodi</th>
                    <th className="py-4 px-4 text-center">Darslar soni</th>
                    <th className="py-4 px-4 text-center">Daraja</th>
                    <th className="py-4 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {data.topics?.map((topic) => (
                    <tr
                      key={topic.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Navbati */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-sm">
                          {topic.order}
                        </span>
                      </td>

                      {/* Title & Subtitle */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700/60 text-blue-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                              {topic.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 max-w-md line-clamp-1">
                              {topic.subtitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Icon name */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50">
                          <Tag className="w-3 h-3 text-slate-400" /> {topic.iconName}
                        </span>
                      </td>

                      {/* Lessons Count */}
                      <td className="py-4 px-4 text-center font-bold text-slate-200">
                        {topic.lessonsCount} ta modul
                      </td>

                      {/* Level */}
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                          {topic.level}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedTopic(topic);
                              setIsViewingTopic(true);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
                            title="Batafsil ko‘rish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditTopic(topic)}
                            className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-all shadow-sm"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAKTAB DO‘KONI (COIN SHOP) */}
      {/* ========================================================================= */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {/* Subtabs within Store */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setStoreSubTab('banners')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  storeSubTab === 'banners'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>1. Reklama bo‘limi</span>
              </button>

              <button
                onClick={() => setStoreSubTab('talim')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  storeSubTab === 'talim'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>2. Ta’lim imtiyozlari</span>
              </button>

              <button
                onClick={() => setStoreSubTab('maxsus')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  storeSubTab === 'maxsus'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>3. Maxsus sovg‘alar</span>
              </button>

              <button
                onClick={() => setStoreSubTab('hamkorlar')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  storeSubTab === 'hamkorlar'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>4. Hamkorlar takliflari</span>
              </button>
            </div>

            {storeSubTab === 'banners' && (
              <button
                onClick={() => {
                  setBannerTarget('store');
                  setShowAddBannerModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Do‘konga reklama qo‘shish</span>
              </button>
            )}
          </div>

          {/* 3.1 Store Banners */}
          {storeSubTab === 'banners' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(!data.store?.banners || data.store.banners.length === 0) ? (
                  <div className="col-span-full py-16 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-slate-300 font-semibold text-base">Do‘kon uchun reklama mavjud emas</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Coin Shop tepadagi swiper qismi uchun yangi rasm va muddat belgilab e’lon joylashtiring.
                    </p>
                  </div>
                ) : (
                  data.store.banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="group relative rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          {getRemainingTimeBadge(banner.expiresAt)}
                        </div>

                        <button
                          onClick={() => handleDeleteBanner(banner.id, 'store')}
                          className="absolute top-3 right-3 p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-95"
                          title="Reklamani o‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                            {banner.durationLabel}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                            {banner.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {banner.subtitle}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                          <span>Qo‘shilgan: {new Date(banner.createdAt).toLocaleDateString('uz-UZ')}</span>
                          <button
                            onClick={() => handleDeleteBanner(banner.id, 'store')}
                            className="text-rose-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> O‘chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3.2 Ta'lim imtiyozlari */}
          {storeSubTab === 'talim' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.store?.talimItems?.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.subcategory}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                        <Coins className="w-4 h-4" />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'talim')}
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3.3 Maxsus sovg'alar */}
          {storeSubTab === 'maxsus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.store?.maxsusItems?.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {item.subcategory}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                        <Coins className="w-4 h-4" />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'maxsus')}
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3.4 Hamkorlar takliflari */}
          {storeSubTab === 'hamkorlar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.store?.hamkorlarItems?.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item.subcategory}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                        <Coins className="w-4 h-4" />
                        <span>{item.priceCoins} coin</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedStoreItem(item);
                        setIsViewingStoreItem(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditStoreItem(item, 'hamkorlar')}
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30"
                    >
                      <Pencil className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {bannerTarget === 'store' ? 'Do‘kon uchun reklama qo‘shish' : 'Huquq maktabi uchun reklama'}
                  </h3>
                  <p className="text-xs text-slate-400">Swiper rasmi va faollik muddatini tanlang</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddBannerModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Swiper rasmi (Upload yoki URL)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {bannerImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-36 bg-slate-950 group">
                    <img src={bannerImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setBannerImage('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white"
                      title="Olib tashlash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl p-5 text-center transition-all bg-slate-800/30 hover:bg-slate-800/60"
                  >
                    <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Kompyuterdan rasm yuklash</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (Maksimal 5MB)</p>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="yoki rasm to‘g‘ridan-to‘g‘ri URL manzilini kiriting..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Reklama sarlavhasi
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Masalan: Yangi interaktiv testlar bazasi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Qisqacha izoh
                </label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Masalan: 50% ko‘proq ball va tangalar yutib oling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Reklama muddati (Avtomatik o‘chish vaqti)
                </label>
                <div className="relative">
                  <select
                    value={bannerDuration}
                    onChange={(e) => setBannerDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ushbu muddat yakuniga yetgach swiper reklamasi tizimdan avtomatik olib tashlanadi.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleCreateBanner}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Mavzuni tahrirlash</h3>
                  <p className="text-xs text-slate-400">Tartib raqami, icon va matnlarni sozlash</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingTopic(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Navbati (Order) */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Navbati (#)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={topicOrder}
                    onChange={(e) => setTopicOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-black text-center text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Darslar soni */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Modullar soni
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={topicLessons}
                    onChange={(e) => setTopicLessons(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-bold text-center text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Darajasi */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Daraja
                  </label>
                  <select
                    value={topicLevel}
                    onChange={(e) => setTopicLevel(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Boshlang‘ich">Boshlang‘ich</option>
                    <option value="O‘rta">O‘rta</option>
                    <option value="Murakkab">Murakkab</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mavzu nomi
                </label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Icon Selector / Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mavzu iconi (Tanlang yoki Ionicons nomini yozing)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={AVAILABLE_ICONS.some((ic) => ic.name === topicIcon) ? topicIcon : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setTopicIcon(e.target.value);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                    <option value="custom">Boshqa icon...</option>
                  </select>

                  <input
                    type="text"
                    value={topicIcon}
                    onChange={(e) => setTopicIcon(e.target.value)}
                    placeholder="masalan: gavel, cart"
                    className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Qisqacha tavsifi (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={topicSubtitle}
                  onChange={(e) => setTopicSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingTopic(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSaveTopic}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400">
                  Navbat: #{selectedTopic.order}
                </span>
                <h3 className="text-base font-bold text-white">Mavzu kartasi</h3>
              </div>
              <button
                onClick={() => setIsViewingTopic(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400">Mavzu nomi:</span>
                <p className="font-bold text-white text-base mt-0.5">{selectedTopic.title}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400">Tavsifi:</span>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{selectedTopic.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-xs text-slate-400">Dars modullari</span>
                  <p className="text-base font-black text-white mt-0.5">{selectedTopic.lessonsCount} ta</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-xs text-slate-400">Qiyinlik darajasi</span>
                  <p className="text-base font-black text-blue-400 mt-0.5">{selectedTopic.level}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Mini ilovadagi icon:</span>
                <p className="font-mono text-xs text-purple-400 mt-0.5">{selectedTopic.iconName}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsViewingTopic(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Do‘kon elementini tahrirlash</h3>
              <button
                onClick={() => setIsEditingStoreItem(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nomi</label>
                <input
                  type="text"
                  value={storeItemTitle}
                  onChange={(e) => setStoreItemTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subkategoriya</label>
                  <input
                    type="text"
                    value={storeItemSubcategory}
                    onChange={(e) => setStoreItemSubcategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Narxi (Coin)</label>
                  <input
                    type="number"
                    value={storeItemPrice}
                    onChange={(e) => setStoreItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tavsifi</label>
                <textarea
                  rows={3}
                  value={storeItemDesc}
                  onChange={(e) => setStoreItemDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsEditingStoreItem(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveStoreItem}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewingStoreItem && selectedStoreItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400">
                {selectedStoreItem.subcategory}
              </span>
              <button
                onClick={() => setIsViewingStoreItem(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedStoreItem.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedStoreItem.desc}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Talab qilinadigan coin:</span>
              <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Coins className="w-4 h-4" /> {selectedStoreItem.priceCoins} coin
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsViewingStoreItem(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
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
