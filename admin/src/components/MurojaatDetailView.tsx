import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  FileText,
  Clock,
  Building2,
  BookOpen,
  FolderPlus,
  X,
  Layers,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Radio,
  Search,
} from 'lucide-react';

export interface MurojaatCategory {
  id: string;
  name: string;
  createdAt?: string;
}

export interface MurojaatTemplate {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  durationDays: string;
  description: string;
  targetOrg: string;
  law: string;
  requiredDocs: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  onBack: () => void;
}

export const MurojaatDetailView: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'kategoriyalar' | 'andozalar'>('kategoriyalar');
  const [categories, setCategories] = useState<MurojaatCategory[]>([]);
  const [templates, setTemplates] = useState<MurojaatTemplate[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal 1: Create Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Modal 2: Create Template
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateCategoryId, setTemplateCategoryId] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDurationDays, setTemplateDurationDays] = useState('15 ish kuni');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateTargetOrg, setTemplateTargetOrg] = useState('');
  const [templateLaw, setTemplateLaw] = useState('');
  const [templateRequiredDocs, setTemplateRequiredDocs] = useState<string[]>(['']);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState('');

  // Modal 3: Edit Category
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [editCategoryError, setEditCategoryError] = useState('');

  // Modal 4: Edit Template
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState('');
  const [editTemplateCategoryId, setEditTemplateCategoryId] = useState('');
  const [editTemplateTitle, setEditTemplateTitle] = useState('');
  const [editTemplateDurationDays, setEditTemplateDurationDays] = useState('15 ish kuni');
  const [editTemplateDesc, setEditTemplateDesc] = useState('');
  const [editTemplateTargetOrg, setEditTemplateTargetOrg] = useState('');
  const [editTemplateLaw, setEditTemplateLaw] = useState('');
  const [editTemplateRequiredDocs, setEditTemplateRequiredDocs] = useState<string[]>(['']);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [editTemplateError, setEditTemplateError] = useState('');

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/murojaat');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setTemplates(data.templates || []);
          if (data.categories && data.categories.length > 0 && !templateCategoryId) {
            setTemplateCategoryId(data.categories[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching murojaat data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // WebSocket Real-time updates
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:5000');
      ws.onopen = () => setIsWsConnected(true);
      ws.onclose = () => setIsWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'murojaat:updated' && msg.data) {
            if (Array.isArray(msg.data.categories)) setCategories(msg.data.categories);
            if (Array.isArray(msg.data.templates)) setTemplates(msg.data.templates);
          } else if (msg.event === 'initial:sync' && msg.data?.murojaat) {
            if (Array.isArray(msg.data.murojaat.categories)) setCategories(msg.data.murojaat.categories);
            if (Array.isArray(msg.data.murojaat.templates)) setTemplates(msg.data.murojaat.templates);
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };
    } catch (e) {
      console.error('WS init error:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // 1. Create Category Handler
  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) {
      setCategoryError('Kategoriya nomini kiriting');
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError('');

    try {
      const res = await fetch('http://localhost:5000/api/murojaat/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.categories) {
          setCategories(data.data.categories);
        } else if (data.category) {
          setCategories((prev) => [...prev, data.category]);
        }
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
      } else {
        setCategoryError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      setCategoryError('Server bilan aloqa uzildi');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // 2. Delete Category Handler
  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!window.confirm(`«${catName}» kategoriyasini va unga tegishli andozalarni o‘chirishni tasdiqlaysizmi?`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/murojaat/categories/${catId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setCategories(data.data.categories || []);
        setTemplates(data.data.templates || []);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
        setTemplates((prev) => prev.filter((t) => t.categoryId !== catId));
      }
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  // 3. Dynamic Required Docs Helpers
  const handleAddDocInput = () => {
    setTemplateRequiredDocs((prev) => [...prev, '']);
  };

  const handleDocChange = (index: number, val: string) => {
    setTemplateRequiredDocs((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveDocInput = (index: number) => {
    setTemplateRequiredDocs((prev) => prev.filter((_, i) => i !== index));
  };

  // 4. Create Template Handler
  const handleCreateTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!templateTitle.trim()) {
      setTemplateError('Andoza nomini kiriting');
      return;
    }
    if (!templateCategoryId) {
      setTemplateError('Kategoriyani tanlang');
      return;
    }

    setIsCreatingTemplate(true);
    setTemplateError('');

    try {
      const payload = {
        categoryId: templateCategoryId,
        title: templateTitle.trim(),
        durationDays: templateDurationDays.trim() || '15 ish kuni',
        description: templateDesc.trim(),
        targetOrg: templateTargetOrg.trim(),
        law: templateLaw.trim(),
        requiredDocs: templateRequiredDocs.filter((d) => d.trim().length > 0),
      };

      const res = await fetch('http://localhost:5000/api/murojaat/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.templates) {
          setTemplates(data.data.templates);
        } else if (data.template) {
          setTemplates((prev) => [...prev, data.template]);
        }
        // Reset form
        setTemplateTitle('');
        setTemplateDurationDays('15 ish kuni');
        setTemplateDesc('');
        setTemplateTargetOrg('');
        setTemplateLaw('');
        setTemplateRequiredDocs(['']);
        setIsTemplateModalOpen(false);
      } else {
        setTemplateError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setTemplateError('Server bilan aloqa uzildi');
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  // 5. Delete Template Handler
  const handleDeleteTemplate = async (tplId: string, tplTitle: string) => {
    if (!window.confirm(`«${tplTitle}» andozasini o‘chirishni tasdiqlaysizmi?`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/murojaat/templates/${tplId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setTemplates(data.data.templates || []);
      } else {
        setTemplates((prev) => prev.filter((t) => t.id !== tplId));
      }
    } catch (err) {
      console.error('Delete template error:', err);
    }
  };

  // 6. Edit Category Handlers
  const handleOpenEditCategory = (cat: MurojaatCategory) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setEditCategoryError('');
    setIsEditCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = editCategoryName.trim();
    if (!cleanName) {
      setEditCategoryError('Kategoriya nomini kiriting');
      return;
    }

    setIsUpdatingCategory(true);
    setEditCategoryError('');

    try {
      const res = await fetch(`http://localhost:5000/api/murojaat/categories/${editingCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.categories) {
          setCategories(data.data.categories);
        } else if (data.category) {
          setCategories((prev) => prev.map((c) => (c.id === editingCategoryId ? data.category : c)));
        }
        setIsEditCategoryModalOpen(false);
      } else {
        setEditCategoryError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      setEditCategoryError('Server bilan aloqa uzildi');
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  // 7. Edit Template Handlers
  const handleOpenEditTemplate = (tpl: MurojaatTemplate) => {
    setEditingTemplateId(tpl.id);
    setEditTemplateCategoryId(tpl.categoryId);
    setEditTemplateTitle(tpl.title);
    setEditTemplateDurationDays(tpl.durationDays || '15 ish kuni');
    setEditTemplateDesc(tpl.description || '');
    setEditTemplateTargetOrg(tpl.targetOrg || '');
    setEditTemplateLaw(tpl.law || '');
    setEditTemplateRequiredDocs(tpl.requiredDocs && tpl.requiredDocs.length > 0 ? [...tpl.requiredDocs] : ['']);
    setEditTemplateError('');
    setIsEditTemplateModalOpen(true);
  };

  const handleEditAddDocInput = () => {
    setEditTemplateRequiredDocs((prev) => [...prev, '']);
  };

  const handleEditDocChange = (index: number, val: string) => {
    setEditTemplateRequiredDocs((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleEditRemoveDocInput = (index: number) => {
    setEditTemplateRequiredDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTemplateTitle.trim()) {
      setEditTemplateError('Andoza nomini kiriting');
      return;
    }
    if (!editTemplateCategoryId) {
      setEditTemplateError('Kategoriyani tanlang');
      return;
    }

    setIsUpdatingTemplate(true);
    setEditTemplateError('');

    try {
      const payload = {
        categoryId: editTemplateCategoryId,
        title: editTemplateTitle.trim(),
        durationDays: editTemplateDurationDays.trim() || '15 ish kuni',
        description: editTemplateDesc.trim(),
        targetOrg: editTemplateTargetOrg.trim(),
        law: editTemplateLaw.trim(),
        requiredDocs: editTemplateRequiredDocs.map((d) => d.trim()).filter(Boolean),
      };

      const res = await fetch(`http://localhost:5000/api/murojaat/templates/${editingTemplateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.templates) {
          setTemplates(data.data.templates);
        } else if (data.template) {
          setTemplates((prev) => prev.map((t) => (t.id === editingTemplateId ? data.template : t)));
        }
        setIsEditTemplateModalOpen(false);
      } else {
        setEditTemplateError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      setEditTemplateError('Server bilan aloqa uzildi');
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  // Filtered Templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCat = selectedCatFilter === 'all' || tpl.categoryId === selectedCatFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.targetOrg?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.law?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header Card */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(0, 163, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(8, 14, 27, 0.95) 0%, rgba(2, 132, 199, 0.12) 100%)',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Xizmatlar ro‘yxatiga qaytish"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Murojaat va arizalar boshqaruvi
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: isWsConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isWsConnected ? '#10B981' : '#F59E0B',
                  border: isWsConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <Radio size={12} className={isWsConnected ? 'animate-pulse' : ''} />
                {isWsConnected ? 'Real-time faol' : 'Ulanmoqda...'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Mobil ilovadagi Murojaat va arizalar bo‘limi kategoriyalari hamda rasmiy andozalarini real vaqtda boshqaring
            </p>
          </div>
        </div>

        {/* Action Button depending on active tab */}
        <div>
          {activeTab === 'kategoriyalar' ? (
            <button
              onClick={() => {
                setCategoryError('');
                setNewCategoryName('');
                setIsCategoryModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 163, 255, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <FolderPlus size={18} />
              Kategoriya yaratish
            </button>
          ) : (
            <button
              onClick={() => {
                setTemplateError('');
                if (categories.length > 0 && !templateCategoryId) {
                  setTemplateCategoryId(categories[0].id);
                }
                setIsTemplateModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 163, 255, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <FileCheck2 size={18} />
              Andoza yaratish
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(8, 14, 27, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>Jami kategoriyalar</span>
            <Layers size={18} color="#00A3FF" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }}>{categories.length} ta</div>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>Mini ilovada ko‘rinadigan toifalar</span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(8, 14, 27, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>Jami andozalar</span>
            <FileText size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981' }}>{templates.length} ta</div>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>Tayyor rasmiy ariza shakllari</span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(8, 14, 27, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>Talab qilingan hujjatlar</span>
            <BookOpen size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B' }}>
            {templates.reduce((acc, t) => acc + (t.requiredDocs?.length || 0), 0)} ta
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>Biriktirilgan me’yoriy hujjatlar</span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(8, 14, 27, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>Mobil sinxronizatsiya</span>
            <Sparkles size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#8B5CF6' }}>100% Avtomatik</div>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>Ilovaga lahzada yetkaziladi</span>
        </div>
      </div>

      {/* Navigation Tabs Pill */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(8, 14, 27, 0.7)',
          borderRadius: '14px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setActiveTab('kategoriyalar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 24px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'kategoriyalar' ? '#00A3FF' : 'transparent',
            color: activeTab === 'kategoriyalar' ? '#FFFFFF' : '#94A3B8',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <FolderPlus size={16} />
          1. Kategoriyalar ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('andozalar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 24px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'andozalar' ? '#00A3FF' : 'transparent',
            color: activeTab === 'andozalar' ? '#FFFFFF' : '#94A3B8',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <FileText size={16} />
          2. Andozalar ({templates.length})
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 1: KATEGORIYALAR */}
      {/* ===================================================================== */}
      {activeTab === 'kategoriyalar' && (
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Faol kategoriyalar ro‘yxati
              </h3>
              <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Bu yerdagi har bir kategoriya mobil ilovadagi "Murojaat va arizalar" ekranida toifa filtri sifatida paydo bo‘ladi
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <Layers size={44} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#94A3B8' }}>Hozircha kategoriyalar mavjud emas</div>
              <p style={{ fontSize: '13px', margin: '6px 0 18px 0' }}>
                Yuqoridagi "Kategoriya yaratish" tugmasini bosib yangi toifa qo‘shing.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {categories.map((cat, idx) => {
                const count = templates.filter((t) => t.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="table-row-hover"
                    style={{
                      borderRadius: '16px',
                      padding: '18px 20px',
                      background: 'rgba(8, 14, 27, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(0, 163, 255, 0.12)',
                          border: '1px solid rgba(0, 163, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00A3FF',
                          fontSize: '15px',
                          fontWeight: 800,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                          {cat.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: count > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                              color: count > 0 ? '#10B981' : '#94A3B8',
                            }}
                          >
                            {count} ta andoza
                          </span>
                          {cat.createdAt && (
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{cat.createdAt}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        title="Kategoriyani tahrirlash"
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          border: '1px solid rgba(0, 163, 255, 0.3)',
                          background: 'rgba(0, 163, 255, 0.1)',
                          color: '#00A3FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        title="Kategoriyani o‘chirish"
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 2: ANDOZALAR */}
      {/* ===================================================================== */}
      {activeTab === 'andozalar' && (
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* Filter & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '22px', flexWrap: 'wrap' }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCatFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: selectedCatFilter === 'all' ? '#00A3FF' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCatFilter === 'all' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Barchasi ({templates.length})
              </button>
              {categories.map((c) => {
                const count = templates.filter((t) => t.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCatFilter(c.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: selectedCatFilter === c.id ? '#00A3FF' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCatFilter === c.id ? '#FFFFFF' : '#94A3B8',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(8, 14, 27, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '7px 12px',
                width: '260px',
              }}
            >
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Andoza bo‘yicha qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <FileText size={44} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#94A3B8' }}>Andozalar topilmadi</div>
              <p style={{ fontSize: '13px', margin: '6px 0 18px 0' }}>
                Yangi andoza yaratish tugmasini bosib rasmiy ariza shaklini qo‘shing.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="table-row-hover"
                  style={{
                    borderRadius: '16px',
                    padding: '22px',
                    background: 'rgba(8, 14, 27, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    {/* Header: Category Badge + Duration Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(0, 163, 255, 0.12)',
                          color: '#00A3FF',
                          border: '1px solid rgba(0, 163, 255, 0.25)',
                        }}
                      >
                        {tpl.categoryName}
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#10B981',
                          background: 'rgba(16, 185, 129, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                      >
                        <Clock size={12} />
                        {tpl.durationDays || '15 ish kuni'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: '22px' }}>
                      {tpl.title}
                    </h4>

                    {/* Description */}
                    {tpl.description && (
                      <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '0 0 14px 0', lineHeight: '18px' }}>
                        {tpl.description}
                      </p>
                    )}

                    {/* Target Org */}
                    {tpl.targetOrg && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                        <Building2 size={14} color="#00E5FF" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 600 }}>{tpl.targetOrg}</span>
                      </div>
                    )}

                    {/* Legal basis */}
                    {tpl.law && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                        <BookOpen size={14} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '11.5px', color: '#CBD5E1' }}>{tpl.law}</span>
                      </div>
                    )}

                    {/* Required Documents Section */}
                    {tpl.requiredDocs && tpl.requiredDocs.length > 0 && (
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                          Talab qilinadigan hujjatlar ({tpl.requiredDocs.length}):
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#E2E8F0' }}>
                          {tpl.requiredDocs.map((doc, i) => (
                            <li key={i} style={{ marginBottom: '3px' }}>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Edit and Delete actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <button
                      onClick={() => handleOpenEditTemplate(tpl)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 163, 255, 0.3)',
                        background: 'rgba(0, 163, 255, 0.1)',
                        color: '#00A3FF',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Pencil size={14} />
                      Tahrirlash
                    </button>

                    <button
                      onClick={() => handleDeleteTemplate(tpl.id, tpl.title)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Trash2 size={14} />
                      O‘chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: KATEGORIYA YARATISH ALERT MODALI */}
      {/* ===================================================================== */}
      {isCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '22px',
              padding: '28px',
              border: '1px solid rgba(0, 163, 255, 0.3)',
              background: 'rgba(11, 18, 33, 0.96)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(0, 163, 255, 0.15)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00A3FF',
                  }}
                >
                  <FolderPlus size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Kategoriya yaratish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Mini ilovaga darhol integratsiya bo‘ladi</span>
                </div>
              </div>

              <button
                onClick={() => setIsCategoryModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCategory}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '8px' }}>
                  Kategoriya nomi <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sud va prokuratura, Soliq masalalari..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {categoryError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{categoryError}</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={isCreatingCategory}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 163, 255, 0.35)',
                    opacity: isCreatingCategory ? 0.7 : 1,
                  }}
                >
                  <FolderPlus size={16} />
                  {isCreatingCategory ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ANDOZA YARATISH ALERT MODALI */}
      {/* ===================================================================== */}
      {isTemplateModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '22px',
              padding: '28px',
              border: '1px solid rgba(0, 163, 255, 0.3)',
              background: 'rgba(11, 18, 33, 0.98)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(0, 163, 255, 0.15)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00A3FF',
                  }}
                >
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Yangi andoza yaratish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Rasmiy blank talabnomasi va qonuniy asos</span>
                </div>
              </div>

              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Template Form */}
            <form onSubmit={handleCreateTemplate}>
              {/* 1. Kategoriya tanlash */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Kategoriyani tanlang <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={templateCategoryId}
                  onChange={(e) => setTemplateCategoryId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: '#0B1329',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: '#0B1329', color: '#FFFFFF' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Andoza nomi */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Andoza nomi <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Maosh ushlab qolinishi bo‘yicha ariza"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 3. Ko'rib chiqilish muddati & Davlat organi nomi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Ko‘rib chiqilish muddati
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 15 ish kuni, 1 oy"
                    value={templateDurationDays}
                    onChange={(e) => setTemplateDurationDays(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(8, 14, 27, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Davlat organi nomi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Bosh prokuratura, Hokimiyat"
                    value={templateTargetOrg}
                    onChange={(e) => setTemplateTargetOrg(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(8, 14, 27, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* 4. Description (Tavsif) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Tavsif (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ariza qachon va qaysi holatlarda topshirilishi haqida tushuntirish..."
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 5. Qonuniy asos va moddalar qismi */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Qonuniy asos va moddalar
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Mehnat Kodeksining 161-moddasi, O‘RQ-369"
                  value={templateLaw}
                  onChange={(e) => setTemplateLaw(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 6. Talab qilinadigan hujjatlar qismi (Dinamik inputlar) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0' }}>
                    Talab qilinadigan hujjatlar
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDocInput}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 163, 255, 0.3)',
                      background: 'rgba(0, 163, 255, 0.12)',
                      color: '#00A3FF',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    Yangi hujjat qo‘shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {templateRequiredDocs.map((doc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder={`Hujjat #${idx + 1} (masalan: Pasport nusxasi, Chek...)`}
                        value={doc}
                        onChange={(e) => handleDocChange(idx, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          background: 'rgba(8, 14, 27, 0.8)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {templateRequiredDocs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocInput(idx)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {templateError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{templateError}</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={isCreatingTemplate}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 163, 255, 0.35)',
                    opacity: isCreatingTemplate ? 0.7 : 1,
                  }}
                >
                  <FileCheck2 size={16} />
                  {isCreatingTemplate ? 'Saqlanmoqda...' : 'Andozani saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: KATEGORIYANI TAHRIRLASH */}
      {/* ===================================================================== */}
      {isEditCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 163, 255, 0.35)',
              background: 'linear-gradient(180deg, #0d162d 0%, #080e1b 100%)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 163, 255, 0.2)',
              padding: '26px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(0, 163, 255, 0.15)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00A3FF',
                  }}
                >
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Kategoriyani tahrirlash
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Kategoriya nomini yangilang</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditCategoryModalOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '8px' }}>
                  Kategoriya nomi <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Masalan: Mehnat, Ta’lim, Mulk..."
                  value={editCategoryName}
                  onChange={(e) => {
                    setEditCategoryName(e.target.value);
                    setEditCategoryError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(0, 163, 255, 0.4)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {editCategoryError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{editCategoryError}</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditCategoryModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingCategory}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 163, 255, 0.35)',
                    opacity: isUpdatingCategory ? 0.7 : 1,
                  }}
                >
                  <Pencil size={16} />
                  {isUpdatingCategory ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: ANDOZANI TAHRIRLASH */}
      {/* ===================================================================== */}
      {isEditTemplateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '680px',
              borderRadius: '22px',
              border: '1px solid rgba(0, 163, 255, 0.35)',
              background: 'linear-gradient(180deg, #0d162d 0%, #080e1b 100%)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 163, 255, 0.2)',
              padding: '28px 32px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(0, 163, 255, 0.15)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00A3FF',
                  }}
                >
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Andozani tahrirlash
                  </h3>
                  <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                    Andoza ma’lumotlari va talab qilinadigan hujjatlarni o‘zgartiring
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditTemplateModalOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateTemplate}>
              {/* 1. Kategoriya tanlash va Muddat */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Kategoriya <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={editTemplateCategoryId}
                    onChange={(e) => setEditTemplateCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: '#0d162d',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} style={{ background: '#0d162d', color: '#FFFFFF' }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Ko‘rib chiqilish muddati
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 15 ish kuni"
                    value={editTemplateDurationDays}
                    onChange={(e) => setEditTemplateDurationDays(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(8, 14, 27, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* 2. Andoza nomi va Davlat organi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Andoza nomi <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Oylik maosh undirish to‘g‘risida"
                    value={editTemplateTitle}
                    onChange={(e) => setEditTemplateTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(8, 14, 27, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                    Davlat organi nomi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Bosh prokuratura, Hokimiyat"
                    value={editTemplateTargetOrg}
                    onChange={(e) => setEditTemplateTargetOrg(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(8, 14, 27, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* 3. Description (Tavsif) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Tavsif (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ariza qachon va qaysi holatlarda topshirilishi haqida tushuntirish..."
                  value={editTemplateDesc}
                  onChange={(e) => setEditTemplateDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 4. Qonuniy asos va moddalar qismi */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Qonuniy asos va moddalar
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Mehnat Kodeksining 161-moddasi, O‘RQ-369"
                  value={editTemplateLaw}
                  onChange={(e) => setEditTemplateLaw(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(8, 14, 27, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 5. Talab qilinadigan hujjatlar qismi (Dinamik inputlar) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0' }}>
                    Talab qilinadigan hujjatlar
                  </label>
                  <button
                    type="button"
                    onClick={handleEditAddDocInput}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 163, 255, 0.3)',
                      background: 'rgba(0, 163, 255, 0.12)',
                      color: '#00A3FF',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    Yangi hujjat qo‘shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {editTemplateRequiredDocs.map((doc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder={`Hujjat #${idx + 1} (masalan: Pasport nusxasi, Chek...)`}
                        value={doc}
                        onChange={(e) => handleEditDocChange(idx, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          background: 'rgba(8, 14, 27, 0.8)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {editTemplateRequiredDocs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleEditRemoveDocInput(idx)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {editTemplateError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontSize: '12.5px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{editTemplateError}</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditTemplateModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingTemplate}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 163, 255, 0.35)',
                    opacity: isUpdatingTemplate ? 0.7 : 1,
                  }}
                >
                  <Pencil size={16} />
                  {isUpdatingTemplate ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
