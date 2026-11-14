import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Video,
  FileText,
  Award,
  Layers,
  Clock,
  ExternalLink,
  Upload,
  X,
  FileUp,
  ListOrdered,
  Paperclip,
  ChevronDown,
  Check,
  Search,
  Pencil,
} from 'lucide-react';
import type { TopicItem } from './HuquqMaktabiDetailView';

export interface TopicCourse {
  id: string;
  topicId: string;
  title: string;
  lessons: string;
  duration: string;
  imageUrl?: string;
  progress?: number;
  progressColor?: string;
  iconBg?: string;
  iconType?: string;
  createdAt?: number;
}

export interface LessonChapter {
  id: string;
  title: string;
  timeRange: string;
}

export interface LessonMaterial {
  id: string;
  name: string;
  size?: string;
  type?: string;
  fileUrl?: string;
}

export interface CourseLessonItem {
  id: string;
  courseId: string;
  topicId: string;
  order: number;
  title: string;
  duration: string;
  imageUrl?: string;
  youtubeUrl?: string;
  description?: string;
  plan?: LessonChapter[];
  materials?: LessonMaterial[];
  status?: 'completed' | 'in_progress' | 'locked';
  createdAt?: number;
}

export interface TopicCertificateItem {
  id: string;
  topicId: string;
  title: string;
  pdfUrl?: string;
  pdfName?: string;
  createdAt?: number;
}

interface TopicDetailManagementViewProps {
  topic: TopicItem;
  allTopics: TopicItem[];
  courses: TopicCourse[];
  lessons: CourseLessonItem[];
  certificates: TopicCertificateItem[];
  onBack: () => void;
  onRefresh: () => void;
  apiBaseUrl?: string;
}

export const TopicDetailManagementView: React.FC<TopicDetailManagementViewProps> = ({
  topic,
  allTopics,
  courses,
  lessons,
  certificates,
  onBack,
  onRefresh,
  apiBaseUrl = 'http://localhost:5000',
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'certificates'>('courses');

  // Filter items for this topic
  const topicCourses = courses.filter((c) => c.topicId === topic.id);
  const topicLessons = lessons.filter((l) => l.topicId === topic.id || topicCourses.some((c) => c.id === l.courseId));
  const topicCerts = certificates.filter((cert) => cert.topicId === topic.id);

  // Filter lessons by specific course inside Tab 2
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const filteredLessons = topicLessons.filter((l) => {
    if (selectedCourseFilter === 'all') return true;
    return l.courseId === selectedCourseFilter;
  });

  // Modal 1: Create Course
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTopicId, setCourseTopicId] = useState(topic.id);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLessonsCount, setCourseLessonsCount] = useState('4 dars');
  const [courseDuration, setCourseDuration] = useState('45 daqiqa');
  const [courseImage, setCourseImage] = useState('');
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [topicSearchTerm, setTopicSearchTerm] = useState('');
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(e.target as Node)) {
        setIsTopicDropdownOpen(false);
      }
    };
    if (isTopicDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTopicDropdownOpen]);

  // Modal 1.5: Edit Course
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TopicCourse | null>(null);
  const [editCourseTopicId, setEditCourseTopicId] = useState('');
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseLessonsCount, setEditCourseLessonsCount] = useState('');
  const [editCourseDuration, setEditCourseDuration] = useState('');
  const [editCourseImage, setEditCourseImage] = useState('');
  const [isSubmittingEditCourse, setIsSubmittingEditCourse] = useState(false);
  const [isEditTopicDropdownOpen, setIsEditTopicDropdownOpen] = useState(false);
  const [editTopicSearchTerm, setEditTopicSearchTerm] = useState('');
  const editTopicDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editTopicDropdownRef.current && !editTopicDropdownRef.current.contains(e.target as Node)) {
        setIsEditTopicDropdownOpen(false);
      }
    };
    if (isEditTopicDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditTopicDropdownOpen]);

  // Modal 2: Create Lesson
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState(topicCourses[0]?.id || '');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10 daqiqa');
  const [lessonOrder, setLessonOrder] = useState<number>(topicLessons.length + 1);
  const [lessonCoverImage, setLessonCoverImage] = useState('');
  const [lessonYoutubeUrl, setLessonYoutubeUrl] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonPlan, setLessonPlan] = useState<LessonChapter[]>([
    { id: 'ch1', title: 'Kirish qismi va tushunchasi', timeRange: '00:00 – 02:30' },
    { id: 'ch2', title: 'Qonuniy asoslar va moddalar', timeRange: '02:30 – 06:15' },
    { id: 'ch3', title: 'Amaliy tahlil va xulosa', timeRange: '06:15 – 10:00' },
  ]);
  const [lessonMaterials, setLessonMaterials] = useState<LessonMaterial[]>([]);
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false);
  const materialFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadMaterials = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingMaterial(true);

    const newItems: LessonMaterial[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType = 'pdf';
      if (ext === 'docx' || ext === 'doc') fileType = 'docx';
      else if (ext === 'xlsx' || ext === 'xls') fileType = 'xlsx';
      else if (ext === 'pdf') fileType = 'pdf';
      else fileType = ext;

      let formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      if (file.size < 1024 * 1024) {
        formattedSize = `${Math.max(1, Math.round(file.size / 1024))} KB`;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        let uploadedUrl = base64;
        try {
          const uploadRes = await fetch(`${apiBaseUrl}/api/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              data: base64,
              type: fileType,
            }),
          });
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.fileUrl) {
            uploadedUrl = uploadJson.fileUrl;
          }
        } catch (uploadErr) {
          console.warn('Backend upload failed, fallback to base64 data URL:', uploadErr);
        }

        newItems.push({
          id: `mat_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          size: formattedSize,
          type: fileType,
          fileUrl: uploadedUrl,
        });
      } catch (err) {
        console.error('File reading error:', err);
      }
    }

    setLessonMaterials((prev) => [...prev, ...newItems]);
    setIsUploadingMaterial(false);
  };
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  // Modal 2.5: Edit Lesson
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLessonItem | null>(null);
  const [editLessonCourseId, setEditLessonCourseId] = useState('');
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState('10 daqiqa');
  const [editLessonOrder, setEditLessonOrder] = useState<number>(1);
  const [editLessonCoverImage, setEditLessonCoverImage] = useState('');
  const [editLessonYoutubeUrl, setEditLessonYoutubeUrl] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonPlan, setEditLessonPlan] = useState<LessonChapter[]>([]);
  const [editLessonMaterials, setEditLessonMaterials] = useState<LessonMaterial[]>([]);
  const [isSubmittingEditLesson, setIsSubmittingEditLesson] = useState(false);
  const [isUploadingEditMaterial, setIsUploadingEditMaterial] = useState(false);
  const editMaterialFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEditLesson = (lesson: CourseLessonItem) => {
    setEditingLesson(lesson);
    setEditLessonCourseId(lesson.courseId || topicCourses[0]?.id || '');
    setEditLessonTitle(lesson.title || '');
    setEditLessonDuration(lesson.duration || '10 daqiqa');
    setEditLessonOrder(lesson.order || 1);
    setEditLessonCoverImage(lesson.imageUrl || '');
    setEditLessonYoutubeUrl(lesson.youtubeUrl || '');
    setEditLessonDescription(lesson.description || '');
    setEditLessonPlan(Array.isArray(lesson.plan) ? [...lesson.plan] : []);
    setEditLessonMaterials(Array.isArray(lesson.materials) ? [...lesson.materials] : []);
    setShowEditLessonModal(true);
  };

  const handleUploadEditMaterials = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingEditMaterial(true);

    const newItems: LessonMaterial[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType = 'pdf';
      if (ext === 'docx' || ext === 'doc') fileType = 'docx';
      else if (ext === 'xlsx' || ext === 'xls') fileType = 'xlsx';
      else if (ext === 'pdf') fileType = 'pdf';
      else fileType = ext;

      let formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      if (file.size < 1024 * 1024) {
        formattedSize = `${Math.max(1, Math.round(file.size / 1024))} KB`;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        let uploadedUrl = base64;
        try {
          const uploadRes = await fetch(`${apiBaseUrl}/api/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              data: base64,
              type: fileType,
            }),
          });
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.fileUrl) {
            uploadedUrl = uploadJson.fileUrl;
          }
        } catch (uploadErr) {
          console.warn('Backend upload failed, fallback to base64 data URL:', uploadErr);
        }

        newItems.push({
          id: `mat_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          size: formattedSize,
          type: fileType,
          fileUrl: uploadedUrl,
        });
      } catch (err) {
        console.error('File reading error:', err);
      }
    }

    setEditLessonMaterials((prev) => [...prev, ...newItems]);
    setIsUploadingEditMaterial(false);
  };

  // Modal 3: Create Certificate
  const [showCertModal, setShowCertModal] = useState(false);
  const [certTopicId, setCertTopicId] = useState(topic.id);
  const [certTitle, setCertTitle] = useState(`${topic.title} bo‘yicha rasmiy sertifikat`);
  const [certPdfName, setCertPdfName] = useState('sertifikat_shablon.pdf');
  const [certPdfUrl, setCertPdfUrl] = useState('');
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);

  // Helper for mock / uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      alert('Iltimos, kurs nomini kiriting!');
      return;
    }

    try {
      setIsSubmittingCourse(true);
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: courseTopicId,
          title: courseTitle.trim(),
          lessons: courseLessonsCount,
          duration: courseDuration,
          imageUrl:
            courseImage ||
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCourseModal(false);
        setCourseTitle('');
        setCourseImage('');
        onRefresh();
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error(err);
      alert('Server bilan ulanishda xatolik yuz berdi');
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Haqiqatan ham ushbu kursni va unga tegishli barcha darslarni o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/courses/${courseId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Course Modal
  const handleOpenEditCourse = (course: TopicCourse) => {
    setEditingCourse(course);
    setEditCourseTopicId(course.topicId || topic.id);
    setEditCourseTitle(course.title);
    setEditCourseLessonsCount(course.lessons || '4 dars');
    setEditCourseDuration(course.duration || '45 daqiqa');
    setEditCourseImage(course.imageUrl || '');
    setIsEditTopicDropdownOpen(false);
    setEditTopicSearchTerm('');
    setShowEditCourseModal(true);
  };

  // Submit Course Edits
  const handleSaveEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editCourseTitle.trim()) {
      alert('Iltimos, kurs nomini kiriting!');
      return;
    }

    try {
      setIsSubmittingEditCourse(true);
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: editCourseTopicId,
          title: editCourseTitle.trim(),
          lessons: editCourseLessonsCount.trim() || '4 dars',
          duration: editCourseDuration.trim() || '45 daqiqa',
          imageUrl: editCourseImage.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowEditCourseModal(false);
        setEditingCourse(null);
        onRefresh();
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Server bilan bog‘lanishda xatolik yuz berdi');
    } finally {
      setIsSubmittingEditCourse(false);
    }
  };

  // Submit Lesson
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonCourseId) {
      alert('Iltimos, dars biriktiriladigan kursni tanlang!');
      return;
    }
    if (!lessonTitle.trim()) {
      alert('Iltimos, dars nomini kiriting!');
      return;
    }

    try {
      setIsSubmittingLesson(true);
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: lessonCourseId,
          topicId: topic.id,
          title: lessonTitle.trim(),
          duration: lessonDuration,
          order: lessonOrder,
          imageUrl:
            lessonCoverImage ||
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
          youtubeUrl: lessonYoutubeUrl.trim() || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: lessonDescription.trim() || `${topic.title} doirasida batafsil video-darslik.`,
          plan: lessonPlan.filter((p) => p.title.trim()),
          materials: lessonMaterials.filter((m) => m.name.trim()),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowLessonModal(false);
        setLessonTitle('');
        setLessonYoutubeUrl('');
        setLessonDescription('');
        setLessonCoverImage('');
        onRefresh();
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error(err);
      alert('Server bilan bog‘lanishda xatolik yuz berdi');
    } finally {
      setIsSubmittingLesson(false);
    }
  };

  // Update Lesson
  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    if (!editLessonTitle.trim()) {
      alert('Iltimos, dars nomini kiriting!');
      return;
    }

    try {
      setIsSubmittingEditLesson(true);
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: editLessonCourseId,
          topicId: topic.id,
          title: editLessonTitle.trim(),
          duration: editLessonDuration.trim() || '10 daqiqa',
          order: editLessonOrder,
          imageUrl: editLessonCoverImage.trim(),
          youtubeUrl: editLessonYoutubeUrl.trim(),
          description: editLessonDescription.trim(),
          plan: editLessonPlan.filter((p) => p.title.trim()),
          materials: editLessonMaterials.filter((m) => m.name.trim()),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowEditLessonModal(false);
        setEditingLesson(null);
        onRefresh();
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error('Error updating lesson:', err);
      alert('Server bilan bog‘lanishda xatolik yuz berdi');
    } finally {
      setIsSubmittingEditLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Haqiqatan ham ushbu darsni o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Certificate Stub
  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) {
      alert('Iltimos, sertifikat nomini kiriting!');
      return;
    }

    try {
      setIsSubmittingCert(true);
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: certTopicId,
          title: certTitle.trim(),
          pdfName: certPdfName.trim() || 'sertifikat.pdf',
          pdfUrl: certPdfUrl.trim() || 'https://example.com/certificate.pdf',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCertModal(false);
        setCertTitle(`${topic.title} bo‘yicha rasmiy sertifikat`);
        onRefresh();
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingCert(false);
    }
  };

  // Delete Certificate
  const handleDeleteCert = async (certId: string) => {
    if (!confirm('Sertifikatni o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/huquq-maktabi/certificates/${certId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', minHeight: '100%' }}>
      {/* 1. TOP HEADER & BACK NAVIGATION */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'row',
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
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = '#00E5FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <ArrowLeft size={16} color="#00E5FF" />
            Mavzular katalogiga qaytish
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: topic.color || '#00E5FF',
                  boxShadow: `0 0 12px ${topic.color || '#00E5FF'}`,
                }}
              />
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {topic.title} boshqaruvi
              </h1>
              <span
                style={{
                  background: 'rgba(0, 229, 255, 0.12)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#00E5FF',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Navbat #{topic.order}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
              {topic.subtitle || 'Huquqiy mavzu bo‘yicha kurslar, darslar va sertifikat boshqaruvi'}
            </p>
          </div>
        </div>

        {/* Badges Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={14} color="#60A5FA" />
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Kurslar:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{topicCourses.length} ta</span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Video size={14} color="#34D399" />
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Darslar:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{topicLessons.length} ta</span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Award size={14} color="#FBBF24" />
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sertifikat:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{topicCerts.length} ta</span>
          </div>
        </div>
      </div>

      {/* 2. SECTION TABS BAR (Kurslar, Darslar ro‘yxati, Sertifikat) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '2px',
        }}
      >
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px 12px 0 0',
            border: 'none',
            borderBottom: activeTab === 'courses' ? '3px solid #00E5FF' : '3px solid transparent',
            background: activeTab === 'courses' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
            color: activeTab === 'courses' ? '#00E5FF' : '#94A3B8',
            fontWeight: activeTab === 'courses' ? 700 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <BookOpen size={16} />
          Kurslar ({topicCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px 12px 0 0',
            border: 'none',
            borderBottom: activeTab === 'lessons' ? '3px solid #00E5FF' : '3px solid transparent',
            background: activeTab === 'lessons' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
            color: activeTab === 'lessons' ? '#00E5FF' : '#94A3B8',
            fontWeight: activeTab === 'lessons' ? 700 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Layers size={16} />
          Darslar ro‘yxati ({topicLessons.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px 12px 0 0',
            border: 'none',
            borderBottom: activeTab === 'certificates' ? '3px solid #00E5FF' : '3px solid transparent',
            background: activeTab === 'certificates' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
            color: activeTab === 'certificates' ? '#00E5FF' : '#94A3B8',
            fontWeight: activeTab === 'certificates' ? 700 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Award size={16} />
          Sertifikat ({topicCerts.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: KURSLAR */}
      {/* ========================================================================= */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {topic.title} bo‘yicha o‘quv kurslari
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
                Yangi kurs yaratilganda darhol mini ilovaning Mavzular bo‘limida real time paydo bo‘ladi.
              </p>
            </div>

            <button
              onClick={() => {
                setCourseTopicId(topic.id);
                setCourseTitle('');
                setCourseLessonsCount('4 dars');
                setCourseDuration('45 daqiqa');
                setCourseImage('');
                setShowCourseModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                color: '#04101E',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
              }}
            >
              <Plus size={16} />
              Yangi kurs yaratish
            </button>
          </div>

          {/* Courses Table / Cards */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            {topicCourses.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <BookOpen size={48} color="#64748B" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '16px', color: '#F8FAFC', margin: 0 }}>Hozircha kurslar mavjud emas</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>
                  Ushbu mavzu uchun birinchi o‘quv kursini yaratish uchun yuqoridagi tugmani bosing.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Kurs rasmi / Icon</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Kurs nomi</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Darslar soni</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Davomiyligi</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Ilovadagi holati</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {topicCourses.map((c) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: c.iconBg || '#EFF6FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <BookOpen size={20} color="#0284C7" />
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                          {c.title}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>ID: {c.id}</span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            color: '#38BDF8',
                          }}
                        >
                          <Video size={12} />
                          {c.lessons}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94A3B8' }}>
                          <Clock size={13} color="#64748B" />
                          {c.duration}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#10B981',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            padding: '3px 10px',
                            borderRadius: '12px',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                          Faol (Real time)
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(c)}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0, 229, 255, 0.25)',
                              background: 'rgba(0, 229, 255, 0.1)',
                              color: '#00E5FF',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                            title="Kursni tahrirlash"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.22)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.id)}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                            title="Kursni o‘chirish"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: DARSLAR RO‘YXATI */}
      {/* ========================================================================= */}
      {activeTab === 'lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Video-darslar va reja katalogi
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
                Har bir dars YouTube video havolasi, dars rejasi va qo‘shimcha materiallar bilan boyitiladi.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Filter by course */}
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">Barcha kurslar darslari</option>
                {topicCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setLessonCourseId(selectedCourseFilter !== 'all' ? selectedCourseFilter : topicCourses[0]?.id || '');
                  setLessonTitle('');
                  setLessonDuration('10 daqiqa');
                  setLessonOrder(topicLessons.length + 1);
                  setLessonCoverImage('');
                  setLessonYoutubeUrl('');
                  setLessonDescription('');
                  setLessonMaterials([]);
                  setShowLessonModal(true);
                }}
                disabled={topicCourses.length === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background:
                    topicCourses.length === 0
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                  color: topicCourses.length === 0 ? '#64748B' : '#04101E',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: topicCourses.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: topicCourses.length === 0 ? 'none' : '0 4px 15px rgba(0, 229, 255, 0.35)',
                }}
              >
                <Plus size={16} />
                Dars yaratish
              </button>
            </div>
          </div>

          {/* Lessons Table */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            {filteredLessons.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Video size={48} color="#64748B" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '16px', color: '#F8FAFC', margin: 0 }}>Hozircha darslar mavjud emas</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>
                  {topicCourses.length === 0
                    ? 'Avval kurs yaratishingiz kerak, so‘ng dars qo‘shishingiz mumkin.'
                    : 'Yangi video-dars yaratish uchun yuqoridagi "+ Dars yaratish" tugmasini bosing.'}
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}># Navbati</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Dars coveri</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Dars nomi</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Tegishli kurs</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Davomiyligi</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Video / Materiallar</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((l) => {
                    const matchedCourse = topicCourses.find((c) => c.id === l.courseId);
                    return (
                      <tr
                        key={l.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              background: 'rgba(0, 229, 255, 0.1)',
                              color: '#00E5FF',
                              fontWeight: 700,
                              fontSize: '12px',
                            }}
                          >
                            {l.order || 1}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div
                            style={{
                              width: '64px',
                              height: '42px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#1E293B',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            {l.imageUrl ? (
                              <img src={l.imageUrl} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Video size={16} color="#64748B" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                            {l.title}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {l.description || 'Tavsif berilmagan'}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 500 }}>
                            {matchedCourse?.title || l.courseId}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94A3B8' }}>
                            <Clock size={13} color="#64748B" />
                            {l.duration}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {l.youtubeUrl ? (
                              <a
                                href={l.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#EF4444',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                }}
                              >
                                <Video size={11} />
                                YouTube
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#64748B' }}>Video yo‘q</span>
                            )}

                            {l.materials && l.materials.length > 0 && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  color: '#CBD5E1',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                }}
                              >
                                <Paperclip size={11} />
                                {l.materials.length} fayl
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditLesson(l)}
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'rgba(0, 229, 255, 0.12)',
                                color: '#00E5FF',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                              title="Darsni tahrirlash"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(l.id)}
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'rgba(239, 68, 68, 0.12)',
                                color: '#EF4444',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                              title="Darsni o‘chirish"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: SERTIFIKAT */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {topic.title} bo‘yicha rasmiy sertifikat
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
                Foydalanuvchi darslar va testlarni muvaffaqiyatli topshirganda taqdim etiladigan sertifikat shabloni.
              </p>
            </div>

            <button
              onClick={() => {
                setCertTopicId(topic.id);
                setCertTitle(`${topic.title} bo‘yicha rasmiy sertifikat`);
                setShowCertModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                color: '#04101E',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
              }}
            >
              <Plus size={16} />
              Sertifikat yaratish
            </button>
          </div>

          {/* Certificate Table */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            {topicCerts.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Award size={48} color="#64748B" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '16px', color: '#F8FAFC', margin: 0 }}>Hozircha sertifikat shabloni yuklanmagan</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>
                  Ushbu mavzu uchun PDF shablon biriktirish uchun "+ Sertifikat yaratish" tugmasini bosing.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Sertifikat</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Mavzu nomi</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>PDF Fayl</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Holati</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {topicCerts.map((cert) => (
                    <tr
                      key={cert.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            <Award size={20} color="#F59E0B" />
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                            {cert.title}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '13px', color: '#94A3B8' }}>{topic.title}</span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#F87171',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <FileText size={13} />
                          {cert.pdfName || 'sertifikat.pdf'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#10B981',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            padding: '3px 10px',
                            borderRadius: '12px',
                          }}
                        >
                          Biriktirilgan
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteCert(cert.id)}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          title="Sertifikatni o‘chirib tashlash"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: YANGI KURS YARATISH */}
      {/* ========================================================================= */}
      {showCourseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setShowCourseModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#0B132B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(0, 229, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={18} color="#00E5FF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Yangi kurs yaratish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Ilovada ushbu mavzu ostida yangi o‘quv kursi paydo bo‘ladi
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Topic (Custom Premium Dropdown) */}
              {(() => {
                const selectedTopicObj = allTopics.find((t) => t.id === courseTopicId) || topic;
                const filteredTopics = allTopics.filter((t) => {
                  if (!topicSearchTerm.trim()) return true;
                  const term = topicSearchTerm.toLowerCase();
                  return (
                    t.title.toLowerCase().includes(term) ||
                    (t.subtitle && t.subtitle.toLowerCase().includes(term)) ||
                    String(t.order).includes(term)
                  );
                });

                return (
                  <div style={{ position: 'relative' }} ref={topicDropdownRef}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>
                        Mavjud mavzu *
                      </label>
                      <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E5FF', display: 'inline-block' }}></span>
                        {allTopics.length} ta yo‘nalish
                      </span>
                    </div>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsTopicDropdownOpen((prev) => !prev)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '14px',
                        background: isTopicDropdownOpen
                          ? 'rgba(0, 229, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isTopicDropdownOpen
                          ? '1px solid #00E5FF'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: isTopicDropdownOpen
                          ? '0 0 0 3px rgba(0, 229, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.5)'
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxSizing: 'border-box',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: selectedTopicObj.color
                              ? `${selectedTopicObj.color}22`
                              : 'rgba(0, 229, 255, 0.15)',
                            border: `1px solid ${selectedTopicObj.color || '#00E5FF'}44`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Layers size={18} color={selectedTopicObj.color || '#00E5FF'} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {selectedTopicObj.title}
                            </span>
                            <span
                              style={{
                                padding: '2px 7px',
                                borderRadius: '6px',
                                background: 'rgba(0, 229, 255, 0.15)',
                                color: '#00E5FF',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              #{selectedTopicObj.order}
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '11.5px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {selectedTopicObj.subtitle || 'Belgilangan o‘quv mavzusi'}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        <ChevronDown
                          size={16}
                          color={isTopicDropdownOpen ? '#00E5FF' : '#94A3B8'}
                          style={{
                            transform: isTopicDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s ease',
                          }}
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu Popup (Bosilganda ochiladigan qism) */}
                    {isTopicDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          background: '#0B132B',
                          border: '1px solid rgba(0, 229, 255, 0.35)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.15)',
                          padding: '10px',
                          boxSizing: 'border-box',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        {/* Search Input inside Dropdown */}
                        <div
                          style={{
                            position: 'relative',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Search
                            size={14}
                            color="#64748B"
                            style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
                          />
                          <input
                            type="text"
                            placeholder="Mavzularni qidirish..."
                            value={topicSearchTerm}
                            onChange={(e) => setTopicSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '8px 12px 8px 34px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#FFFFFF',
                              fontSize: '12.5px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          {topicSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setTopicSearchTerm('')}
                              style={{
                                position: 'absolute',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>

                        {/* Scrollable Topics List */}
                        <div
                          style={{
                            maxHeight: '230px',
                            overflowY: 'auto',
                            paddingRight: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          {filteredTopics.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                              Mavzu topilmadi
                            </div>
                          ) : (
                            filteredTopics.map((t) => {
                              const isSelected = t.id === courseTopicId;
                              return (
                                <div
                                  key={t.id}
                                  onClick={() => {
                                    setCourseTopicId(t.id);
                                    setIsTopicDropdownOpen(false);
                                    setTopicSearchTerm('');
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: isSelected
                                      ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.16) 0%, rgba(0, 229, 255, 0.04) 100%)'
                                      : 'transparent',
                                    border: isSelected
                                      ? '1px solid rgba(0, 229, 255, 0.35)'
                                      : '1px solid transparent',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                    <span
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '8px',
                                        background: isSelected ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                        color: isSelected ? '#00E5FF' : '#94A3B8',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                      }}
                                    >
                                      {t.order}
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: isSelected ? '#00E5FF' : '#FFFFFF' }}>
                                        {t.title}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: '#64748B',
                                          marginTop: '1px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: '310px',
                                        }}
                                      >
                                        {t.subtitle || 'Huquq maktabi o‘quv mavzusi'}
                                      </div>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <div
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'rgba(0, 229, 255, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginLeft: '8px',
                                      }}
                                    >
                                      <Check size={14} color="#00E5FF" />
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Course Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Kurs nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Nikoh va oila munosabatlari"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Grid: Lessons count & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Nechta dars borligi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 4 dars"
                    value={courseLessonsCount}
                    onChange={(e) => setCourseLessonsCount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 45 daqiqa"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Cover Image URL / Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Kurs cover rasmi yoki ikonkasi
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Rasm URL havolasi..."
                    value={courseImage}
                    onChange={(e) => setCourseImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} />
                    Fayldan
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, setCourseImage)}
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCourse}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                    color: '#04101E',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmittingCourse ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {isSubmittingCourse ? 'Saqlanmoqda...' : 'Kursni yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1.5: KURSNI TAHRIRLASH */}
      {/* ========================================================================= */}
      {showEditCourseModal && editingCourse && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
          onClick={() => setShowEditCourseModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#0B132B',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 229, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(0, 229, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pencil size={18} color="#00E5FF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Kursni tahrirlash
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    O‘quv kursi ma’lumotlarini tahrirlash va yangilash
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditCourseModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Topic */}
              {(() => {
                const selectedTopicObj = allTopics.find((t) => t.id === editCourseTopicId) || topic;
                const filteredTopics = allTopics.filter((t) => {
                  if (!editTopicSearchTerm.trim()) return true;
                  const term = editTopicSearchTerm.toLowerCase();
                  return (
                    t.title.toLowerCase().includes(term) ||
                    (t.subtitle && t.subtitle.toLowerCase().includes(term)) ||
                    String(t.order).includes(term)
                  );
                });

                return (
                  <div style={{ position: 'relative' }} ref={editTopicDropdownRef}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>
                        Biriktirilgan mavzu *
                      </label>
                      <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 600 }}>
                        {allTopics.length} ta yo‘nalish
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditTopicDropdownOpen((prev) => !prev)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '14px',
                        background: isEditTopicDropdownOpen ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                        border: isEditTopicDropdownOpen ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: isEditTopicDropdownOpen ? '0 0 0 3px rgba(0, 229, 255, 0.18)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: selectedTopicObj.color ? `${selectedTopicObj.color}22` : 'rgba(0, 229, 255, 0.15)',
                            border: `1px solid ${selectedTopicObj.color || '#00E5FF'}44`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Layers size={18} color={selectedTopicObj.color || '#00E5FF'} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {selectedTopicObj.title}
                            </span>
                            <span
                              style={{
                                padding: '2px 7px',
                                borderRadius: '6px',
                                background: 'rgba(0, 229, 255, 0.15)',
                                color: '#00E5FF',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              #{selectedTopicObj.order}
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '11.5px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {selectedTopicObj.subtitle || 'Belgilangan o‘quv mavzusi'}
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        size={16}
                        color={isEditTopicDropdownOpen ? '#00E5FF' : '#94A3B8'}
                        style={{
                          transform: isEditTopicDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          flexShrink: 0,
                        }}
                      />
                    </button>

                    {isEditTopicDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          background: '#0B132B',
                          border: '1px solid rgba(0, 229, 255, 0.35)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.15)',
                          padding: '10px',
                          boxSizing: 'border-box',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        <div style={{ position: 'relative', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                          <input
                            type="text"
                            placeholder="Mavzularni qidirish..."
                            value={editTopicSearchTerm}
                            onChange={(e) => setEditTopicSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '8px 12px 8px 34px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#FFFFFF',
                              fontSize: '12.5px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {filteredTopics.map((t) => {
                            const isSelected = t.id === editCourseTopicId;
                            return (
                              <div
                                key={t.id}
                                onClick={() => {
                                  setEditCourseTopicId(t.id);
                                  setIsEditTopicDropdownOpen(false);
                                  setEditTopicSearchTerm('');
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 12px',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  background: isSelected
                                    ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.16) 0%, rgba(0, 229, 255, 0.04) 100%)'
                                    : 'transparent',
                                  border: isSelected ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid transparent',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                  <span
                                    style={{
                                      width: '26px',
                                      height: '26px',
                                      borderRadius: '8px',
                                      background: isSelected ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                      color: isSelected ? '#00E5FF' : '#94A3B8',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {t.order}
                                  </span>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: isSelected ? '#00E5FF' : '#FFFFFF' }}>
                                      {t.title}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '310px' }}>
                                      {t.subtitle || 'O‘quv mavzusi'}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <Check size={14} color="#00E5FF" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Course Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Kurs nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Nikoh va oila munosabatlari"
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Grid: Lessons count & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Darslar soni
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 4 dars"
                    value={editCourseLessonsCount}
                    onChange={(e) => setEditCourseLessonsCount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 45 daqiqa"
                    value={editCourseDuration}
                    onChange={(e) => setEditCourseDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Image URL / Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Kurs muqova rasmi (URL yoki fayl yuklash)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://... yoki fayl tanlang"
                    value={editCourseImage}
                    onChange={(e) => setEditCourseImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <label
                    style={{
                      padding: '11px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 229, 255, 0.15)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      color: '#00E5FF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0,
                    }}
                  >
                    <Upload size={15} />
                    Yuklash
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, setEditCourseImage)}
                    />
                  </label>
                </div>
                {editCourseImage && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={editCourseImage}
                      alt="Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <span style={{ fontSize: '12px', color: '#10B981' }}>Rasm biriktirildi</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditCourseModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  disabled={isSubmittingEditCourse}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                    color: '#04101E',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmittingEditCourse ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {isSubmittingEditCourse ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: YANGI DARS YARATISH */}
      {/* ========================================================================= */}
      {showLessonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setShowLessonModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0B132B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Video size={18} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Yangi dars yaratish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    YouTube video havolasi, dars rejasi va qo‘shimcha materiallar biriktiriladi
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLessonModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Course */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Biriktiriladigan kurs *
                </label>
                <select
                  value={lessonCourseId}
                  onChange={(e) => setLessonCourseId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  {topicCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.lessons})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Title & Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Dars nomi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 1. Nikoh tushunchasi va ahamiyati"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Navbati (#)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Duration & YouTube URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 12 daqiqa"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    YouTube video havolasi (link yoki embed)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lessonYoutubeUrl}
                    onChange={(e) => setLessonYoutubeUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Lesson Cover Image */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Dars cover rasmi
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Cover rasm URL manzili..."
                    value={lessonCoverImage}
                    onChange={(e) => setLessonCoverImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} />
                    Fayldan
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, setLessonCoverImage)}
                    />
                  </label>
                </div>
              </div>

              {/* Lesson Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Dars haqida batafsil tavsif
                </label>
                <textarea
                  rows={3}
                  placeholder="Ushbu darsda ko‘rib chiqiladigan masalalar, moddalar va amaliy keyslar haqida..."
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Dynamic Lesson Plan (Chapters) */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ListOrdered size={14} color="#00E5FF" />
                    Dars rejasi (Vaqt va bo‘limlar)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLessonPlan([
                        ...lessonPlan,
                        { id: `ch_${Date.now()}`, title: '', timeRange: '00:00 – 00:00' },
                      ])
                    }
                    style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      border: 'none',
                      color: '#00E5FF',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    + Bo‘lim qo‘shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lessonPlan.map((chap, idx) => (
                    <div key={chap.id || idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="00:00 – 02:15"
                        value={chap.timeRange}
                        onChange={(e) => {
                          const updated = [...lessonPlan];
                          updated[idx].timeRange = e.target.value;
                          setLessonPlan(updated);
                        }}
                        style={{
                          width: '120px',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#00E5FF',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Bo‘lim sarlavhasi..."
                        value={chap.title}
                        onChange={(e) => {
                          const updated = [...lessonPlan];
                          updated[idx].title = e.target.value;
                          setLessonPlan(updated);
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setLessonPlan(lessonPlan.filter((_, i) => i !== idx))}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Materials (PDF, DOCX, XLSX) with Real File Upload */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(52, 211, 153, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#34D399',
                      }}
                    >
                      <Paperclip size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9', display: 'block' }}>
                        Qo‘shimcha materiallar (PDF, DOCX, XLSX)
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Darsga biriktiriladigan hujjatlar ({lessonMaterials.length} ta)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => materialFileInputRef.current?.click()}
                    disabled={isUploadingMaterial}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.3) 100%)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      color: '#34D399',
                      fontSize: '12px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: isUploadingMaterial ? 'wait' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Upload size={13} />
                    {isUploadingMaterial ? 'Yuklanmoqda...' : '+ Fayl yuklash'}
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={materialFileInputRef}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files) handleUploadMaterials(e.target.files);
                    e.target.value = '';
                  }}
                />

                {/* Drag and Drop Zone if empty */}
                {lessonMaterials.length === 0 ? (
                  <div
                    onClick={() => materialFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#34D399';
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      if (e.dataTransfer.files) handleUploadMaterials(e.dataTransfer.files);
                    }}
                    style={{
                      border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FileUp size={28} color="#34D399" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                      Fayllarni bu yerga tashlang yoki tanlash uchun bosing
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                      Qo‘llab-quvvatlanadi: .PDF, .DOCX, .XLSX, .DOC, .XLS (avtomatik o‘lcham va format aniqlanadi)
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {lessonMaterials.map((mat, idx) => {
                      const isPdf = mat.type === 'pdf' || mat.name?.toLowerCase().endsWith('.pdf');
                      const isDoc = mat.type === 'docx' || mat.type === 'doc' || mat.name?.toLowerCase().endsWith('.doc') || mat.name?.toLowerCase().endsWith('.docx');
                      const isXls = mat.type === 'xlsx' || mat.type === 'xls' || mat.name?.toLowerCase().endsWith('.xls') || mat.name?.toLowerCase().endsWith('.xlsx');
                      const badgeBg = isPdf ? 'rgba(239, 68, 68, 0.18)' : isXls ? 'rgba(16, 185, 129, 0.18)' : isDoc ? 'rgba(59, 130, 246, 0.18)' : 'rgba(148, 163, 184, 0.18)';
                      const badgeColor = isPdf ? '#EF4444' : isXls ? '#10B981' : isDoc ? '#3B82F6' : '#94A3B8';
                      const badgeLabel = isPdf ? 'PDF' : isXls ? 'XLSX' : isDoc ? 'DOCX' : 'FAYL';

                      return (
                        <div
                          key={mat.id || idx}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: badgeColor,
                              background: badgeBg,
                              padding: '3px 7px',
                              borderRadius: '6px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {badgeLabel}
                          </span>

                          <input
                            type="text"
                            placeholder="Fayl nomi"
                            value={mat.name}
                            onChange={(e) => {
                              const updated = [...lessonMaterials];
                              updated[idx].name = e.target.value;
                              setLessonMaterials(updated);
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              outline: 'none',
                            }}
                          />

                          <span
                            style={{
                              fontSize: '11px',
                              color: '#94A3B8',
                              background: 'rgba(255, 255, 255, 0.05)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {mat.size || '1.0 MB'}
                          </span>

                          {mat.fileUrl && (
                            <a
                              href={mat.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Faylni ko‘rish"
                              style={{
                                color: '#00E5FF',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                textDecoration: 'none',
                              }}
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}

                          <button
                            type="button"
                            title="O‘chirish"
                            onClick={() => setLessonMaterials(lessonMaterials.filter((_, i) => i !== idx))}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: 'none',
                              color: '#EF4444',
                              borderRadius: '6px',
                              padding: '5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => materialFileInputRef.current?.click()}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#34D399',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        <Plus size={12} /> Yana fayl yuklash
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLesson}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                    color: '#04101E',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmittingLesson ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {isSubmittingLesson ? 'Saqlanmoqda...' : 'Darsni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2.5: DARSNI TAHRIRLASH */}
      {/* ========================================================================= */}
      {showEditLessonModal && editingLesson && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => {
            setShowEditLessonModal(false);
            setEditingLesson(null);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0B132B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(0, 229, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pencil size={18} color="#00E5FF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Darsni tahrirlash
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Dars ma’lumotlari, video havola, reja va materiallarni o‘zgartirish
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditLessonModal(false);
                  setEditingLesson(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Course */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Biriktirilgan kurs *
                </label>
                <select
                  value={editLessonCourseId}
                  onChange={(e) => setEditLessonCourseId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  {topicCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.lessons})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Title & Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Dars nomi *
                  </label>
                  <input
                    type="text"
                    value={editLessonTitle}
                    onChange={(e) => setEditLessonTitle(e.target.value)}
                    placeholder="Masalan: Nikoh tushunchasi va huquqiy asosi"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Navbati
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editLessonOrder}
                    onChange={(e) => setEditLessonOrder(Number(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Duration & YouTube URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    value={editLessonDuration}
                    onChange={(e) => setEditLessonDuration(e.target.value)}
                    placeholder="10 daqiqa"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    YouTube video havolasi
                  </label>
                  <input
                    type="text"
                    value={editLessonYoutubeUrl}
                    onChange={(e) => setEditLessonYoutubeUrl(e.target.value)}
                    placeholder="https://youtu.be/... yoki embed link"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Dars muqova rasmi (Cover)
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {editLessonCoverImage ? (
                    <img
                      src={editLessonCoverImage}
                      alt="Cover Preview"
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Video size={18} color="#64748B" />
                    </div>
                  )}

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Upload size={14} /> Rasm tanlash
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, setEditLessonCoverImage)}
                        />
                      </label>
                      {editLessonCoverImage && (
                        <button
                          type="button"
                          onClick={() => setEditLessonCoverImage('')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Tozalash
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Yoki rasm URL manzilini kiriting..."
                      value={editLessonCoverImage}
                      onChange={(e) => setEditLessonCoverImage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#94A3B8',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Dars haqida qisqacha tavsif
                </label>
                <textarea
                  value={editLessonDescription}
                  onChange={(e) => setEditLessonDescription(e.target.value)}
                  rows={2}
                  placeholder="Ushbu darsda o‘rganiladigan asosiy huquqiy tushunchalar..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Dynamic Lesson Chapters (Plan) */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ListOrdered size={14} color="#00E5FF" />
                    Dars rejasi va vaqti ({editLessonPlan.length} band)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditLessonPlan([
                        ...editLessonPlan,
                        { id: `ch_${Date.now()}`, title: '', timeRange: '00:00 – 00:00' },
                      ])
                    }
                    style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      border: 'none',
                      color: '#00E5FF',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    + Reja bandi qo‘shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {editLessonPlan.map((ch, idx) => (
                    <div key={ch.id || idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Reja mavzusi"
                        value={ch.title}
                        onChange={(e) => {
                          const updated = [...editLessonPlan];
                          updated[idx].title = e.target.value;
                          setEditLessonPlan(updated);
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="00:00 – 03:00"
                        value={ch.timeRange}
                        onChange={(e) => {
                          const updated = [...editLessonPlan];
                          updated[idx].timeRange = e.target.value;
                          setEditLessonPlan(updated);
                        }}
                        style={{
                          width: '120px',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94A3B8',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditLessonPlan(editLessonPlan.filter((_, i) => i !== idx))}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {editLessonPlan.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', padding: '6px' }}>
                      Hozircha reja bandlari qo‘shilmagan.
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Materials with Real File Upload */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(52, 211, 153, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#34D399',
                      }}
                    >
                      <Paperclip size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9', display: 'block' }}>
                        Qo‘shimcha materiallar (PDF, DOCX, XLSX)
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Darsga biriktirilgan hujjatlar ({editLessonMaterials.length} ta)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => editMaterialFileInputRef.current?.click()}
                    disabled={isUploadingEditMaterial}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.3) 100%)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      color: '#34D399',
                      fontSize: '12px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: isUploadingEditMaterial ? 'wait' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Upload size={13} />
                    {isUploadingEditMaterial ? 'Yuklanmoqda...' : '+ Fayl yuklash'}
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={editMaterialFileInputRef}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files) handleUploadEditMaterials(e.target.files);
                    e.target.value = '';
                  }}
                />

                {/* Drag and Drop Zone if empty */}
                {editLessonMaterials.length === 0 ? (
                  <div
                    onClick={() => editMaterialFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#34D399';
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      if (e.dataTransfer.files) handleUploadEditMaterials(e.dataTransfer.files);
                    }}
                    style={{
                      border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FileUp size={28} color="#34D399" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                      Fayllarni bu yerga tashlang yoki tanlash uchun bosing
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                      Qo‘llab-quvvatlanadi: .PDF, .DOCX, .XLSX, .DOC, .XLS (avtomatik o‘lcham va format aniqlanadi)
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editLessonMaterials.map((mat, idx) => {
                      const isPdf = mat.type === 'pdf' || mat.name?.toLowerCase().endsWith('.pdf');
                      const isDoc = mat.type === 'docx' || mat.type === 'doc' || mat.name?.toLowerCase().endsWith('.doc') || mat.name?.toLowerCase().endsWith('.docx');
                      const isXls = mat.type === 'xlsx' || mat.type === 'xls' || mat.name?.toLowerCase().endsWith('.xls') || mat.name?.toLowerCase().endsWith('.xlsx');
                      const badgeBg = isPdf ? 'rgba(239, 68, 68, 0.18)' : isXls ? 'rgba(16, 185, 129, 0.18)' : isDoc ? 'rgba(59, 130, 246, 0.18)' : 'rgba(148, 163, 184, 0.18)';
                      const badgeColor = isPdf ? '#EF4444' : isXls ? '#10B981' : isDoc ? '#3B82F6' : '#94A3B8';
                      const badgeLabel = isPdf ? 'PDF' : isXls ? 'XLSX' : isDoc ? 'DOCX' : 'FAYL';

                      return (
                        <div
                          key={mat.id || idx}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: badgeColor,
                              background: badgeBg,
                              padding: '3px 7px',
                              borderRadius: '6px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {badgeLabel}
                          </span>

                          <input
                            type="text"
                            placeholder="Fayl nomi"
                            value={mat.name}
                            onChange={(e) => {
                              const updated = [...editLessonMaterials];
                              updated[idx].name = e.target.value;
                              setEditLessonMaterials(updated);
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              outline: 'none',
                            }}
                          />

                          <span
                            style={{
                              fontSize: '11px',
                              color: '#94A3B8',
                              background: 'rgba(255, 255, 255, 0.05)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {mat.size || '1.0 MB'}
                          </span>

                          {mat.fileUrl && (
                            <a
                              href={mat.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Faylni ko‘rish"
                              style={{
                                color: '#00E5FF',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                textDecoration: 'none',
                              }}
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}

                          <button
                            type="button"
                            title="O‘chirish"
                            onClick={() => setEditLessonMaterials(editLessonMaterials.filter((_, i) => i !== idx))}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: 'none',
                              color: '#EF4444',
                              borderRadius: '6px',
                              padding: '5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => editMaterialFileInputRef.current?.click()}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#34D399',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        <Plus size={12} /> Yana fayl yuklash
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditLessonModal(false);
                    setEditingLesson(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEditLesson}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                    color: '#04101E',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmittingEditLesson ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {isSubmittingEditLesson ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: YANGI SERTIFIKAT YARATISH */}
      {/* ========================================================================= */}
      {showCertModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setShowCertModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#0B132B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={18} color="#F59E0B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Sertifikat yaratish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Ushbu mavzu uchun PDF shablon biriktirish
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Topic */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Tegishli mavzu
                </label>
                <select
                  value={certTopicId}
                  onChange={(e) => setCertTopicId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  {allTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certificate Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Sertifikat nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Oila huquqi bo‘yicha rasmiy sertifikat"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* PDF File Upload or Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  PDF shablon fayli *
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="sertifikat_shablon.pdf"
                    value={certPdfName}
                    onChange={(e) => setCertPdfName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <FileUp size={14} />
                    PDF yuklash
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCertPdfName(file.name);
                          setCertPdfUrl(file.name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCert}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #00E5FF 100%)',
                    color: '#04101E',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubmittingCert ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {isSubmittingCert ? 'Saqlanmoqda...' : 'Sertifikatni yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
