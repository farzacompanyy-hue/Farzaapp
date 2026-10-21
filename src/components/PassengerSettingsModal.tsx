import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Briefcase,
  HelpCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Phone,
  Mail,
  Lock,
  Smartphone,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Car,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Laptop,
  Save,
  PhoneCall,
  Send,
  Star,
} from 'lucide-react';
import { Booking, Trip, PassengerProfile, UserPreferences } from '../types';

interface PassengerSettingsModalProps {
  onClose: () => void;
  bookings: Booking[];
  trips: Trip[];
  onCancelBooking: (bookingId: string) => void;
  onOpenChat: (bookingId: string) => void;
  onOpenPrivacyCenter: (tab?: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact') => void;
  onLogout: () => void;
  onAccountDeleted: (phone: string) => void;
  customerPhone?: string;
}

export const PassengerSettingsModal: React.FC<PassengerSettingsModalProps> = ({
  onClose,
  bookings,
  trips,
  onCancelBooking,
  onOpenChat,
  onOpenPrivacyCenter,
  onLogout,
  onAccountDeleted,
  customerPhone = '739992781',
}) => {
  // Navigation: null means main WhatsApp-style list, or a string sub-screen
  const [activeSection, setActiveSection] = useState<
    'profile' | 'privacy' | 'notifications' | 'appearance' | 'bookings' | 'support' | 'preferences' | null
  >(null);

  // Profile State
  const [name, setName] = useState('محمد صالح القدسي');
  const [phone, setPhone] = useState('773456789');
  const [email, setEmail] = useState('m.alqudsi@farza.app');
  const [profileSaved, setProfileSaved] = useState(false);

  // Change phone state
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  // Change password / PIN
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('farza_user_preferences') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      theme: 'light',
      language: 'ar',
      allowLocation: true,
      notificationsEnabled: true,
      bookingAlerts: true,
      tripReminders: true,
      promotionsAlerts: false,
      chatSound: true,
      favoriteCities: ['صنعاء - حدة', 'عدن - المنصورة', 'تعز - الحوبان'],
      preferredSeat: 'window',
    };
  });

  const savePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farza_user_preferences', JSON.stringify(updated));
    }
  };

  // Support / Complaint State
  const [supportTopic, setSupportTopic] = useState('استفسار عن حجز');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Account Deletion inside Settings
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInputPhone, setDeleteInputPhone] = useState('');
  const [deleteReason, setDeleteReason] = useState('no_longer_traveling');
  const [deleteCompleted, setDeleteCompleted] = useState(false);

  // Booking Filter inside settings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'pending_driver' || b.status === 'commission_pending_verification' || b.status === 'accepted_unpaid_commission';
    }
    if (bookingFilter === 'past') return b.status === 'completed';
    if (bookingFilter === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleExecuteDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteInputPhone.replace(/\s+/g, '') !== phone.replace(/\s+/g, '')) {
      alert('رقم الهاتف المدخل لا يتطابق مع رقم الهاتف المسجل في حسابك.');
      return;
    }
    setDeleteCompleted(true);
    setTimeout(() => {
      onAccountDeleted(phone);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/20 shadow-2xl text-right text-[#202633] overflow-hidden"
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-[#245BDB]/15 bg-[#F5F7FB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeSection !== null ? (
              <button
                onClick={() => setActiveSection(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center border border-[#DCE4F0] cursor-pointer transition-colors shadow-xs"
                title="الرجوع للقائمة الرئيسية"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            <div>
              <h3 className="text-lg font-black text-[#202633] flex items-center gap-2">
                <span>
                  {activeSection === null
                    ? 'إعدادات الحساب'
                    : activeSection === 'profile'
                    ? 'الملف الشخصي والحساب'
                    : activeSection === 'privacy'
                    ? 'الخصوصية والأمان'
                    : activeSection === 'notifications'
                    ? 'إشعارات الرحلات'
                    : activeSection === 'appearance'
                    ? 'المظهر واللغة'
                    : activeSection === 'bookings'
                    ? 'حجوزاتي ورحلاتي'
                    : activeSection === 'support'
                    ? 'المساعدة والدعم'
                    : 'تفضيلات إضافية'}
                </span>
                <span className="text-[10px] bg-[#EAF2FF] text-[#245BDB] px-2 py-0.5 rounded-full font-bold">
                  الراكب
                </span>
              </h3>
              <p className="text-[11px] text-[#7B8494]">
                {activeSection === null
                  ? 'تحكّم في خيارات حسابك وخصوصيتك وإشعاراتك بكل سهولة'
                  : 'تطبيق فَرْزَة — إعدادات المستخدم الشخصية'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#202633] flex items-center justify-center border border-[#DCE4F0] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ======================================================== */}
          {/* MAIN WHATSAPP-STYLE MENU LIST */}
          {/* ======================================================== */}
          {activeSection === null && (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div
                onClick={() => setActiveSection('profile')}
                className="p-4 rounded-3xl bg-[#F5F7FB] hover:bg-[#EAF2FF]/60 border border-[#245BDB]/20 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl bg-[#245BDB] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#245BDB]/25 overflow-hidden">
                    <span>{name.charAt(0)}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        {name}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        نشط
                      </span>
                    </div>
                    <p className="text-xs text-[#7B8494] font-mono mt-0.5">{phone}</p>
                    <p className="text-[11px] text-[#245BDB] font-medium mt-0.5">تعديل الملف الشخصي والبيانات</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white text-[#7B8494] group-hover:text-[#245BDB] flex items-center justify-center border border-[#DCE4F0] group-hover:border-[#245BDB]/30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Settings Rows Groups */}
              <div className="rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 divide-y divide-[#DCE4F0] overflow-hidden">
                {/* 1. Account & Profile */}
                <button
                  type="button"
                  onClick={() => setActiveSection('profile')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الحساب والملف الشخصي
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        تغيير الاسم، رقم الهاتف، البريد الإلكتروني، إدارة وسائل الدخول
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 2. Privacy & Security */}
                <button
                  type="button"
                  onClick={() => setActiveSection('privacy')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الخصوصية والأمان
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        مركز الخصوصية، الأذونات، الجلسات النشطة، والتحكم بالظهور
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 3. Notifications */}
                <button
                  type="button"
                  onClick={() => setActiveSection('notifications')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الإشعارات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        تأكيد الحجز، تذكيرات السفر، التنبيهات الترويجية المستقلة
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 4. Appearance & Customization */}
                <button
                  type="button"
                  onClick={() => setActiveSection('appearance')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        المظهر والتخصيص
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        الوضع الفاتح والداكن، لغة التطبيق (العربية / English)
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 5. Bookings & Trips */}
                <button
                  type="button"
                  onClick={() => setActiveSection('bookings')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الحجوزات والرحلات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        عرض الحجوزات القادمة والسابقة، سياسة الإلغاء، تفاصيل الدفع
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bookings.length > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#245BDB] text-white text-[10px] font-bold flex items-center justify-center">
                        {bookings.length}
                      </span>
                    )}
                    <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                  </div>
                </button>

                {/* 6. Help & Support */}
                <button
                  type="button"
                  onClick={() => setActiveSection('support')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        المساعدة والدعم
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        خدمة العملاء، تقديم شكوى أو بلاغ، إرشادات السلامة
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 7. Preferences & Favorites */}
                <button
                  type="button"
                  onClick={() => setActiveSection('preferences')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        تفضيلات إضافية
                      </div>
                      <div className="text-[11px] text-[#7B8494]">
                        الوجهات المفضلة، تفضيل المقعد، مراجعة التقييمات
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>
              </div>

              {/* Bottom Quick Logout */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#7B8494]">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب</span>
                </button>

                <span>الإصدار 2.4.0 (PWA)</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: ACCOUNT & PROFILE */}
          {/* ======================================================== */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-4">
                  <h4 className="text-xs font-bold text-[#202633]">البيانات الشخصية الأساسية</h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#7B8494]">الاسم الكامل</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#7B8494]">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-mono focus:border-[#245BDB] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </button>
                    {profileSaved && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        تم حفظ التعديلات بنجاح
                      </span>
                    )}
                  </div>
                </div>
              </form>

              {/* Change Phone Number Sub-card */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#202633]">رقم الهاتف المسجل</h4>
                    <p className="text-xs text-[#245BDB] font-mono mt-0.5">{phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingPhone(!isChangingPhone)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#245BDB]/30 text-xs font-bold text-[#245BDB] hover:bg-[#EAF2FF] cursor-pointer transition-colors"
                  >
                    {isChangingPhone ? 'إلغاء' : 'تغيير الرقم'}
                  </button>
                </div>

                {isChangingPhone && (
                  <div className="pt-2 border-t border-[#DCE4F0] space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-[#202633]">الرقم الجديد</label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="77XXXXXXX"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-[#DCE4F0] font-mono focus:border-[#245BDB] outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newPhone.trim().length >= 8) {
                          setPhoneOtpSent(true);
                          setPhoneOtp('5829');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-[#245BDB] text-white font-bold cursor-pointer"
                    >
                      إرسال رمز التحقق للرقم الجديد
                    </button>

                    {phoneOtpSent && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-[#202633]">رمز التحقق</label>
                          <span className="text-[10px] text-emerald-600 font-mono">الرمز: 5829</span>
                        </div>
                        <input
                          type="text"
                          dir="ltr"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-white border border-[#DCE4F0] font-mono text-center tracking-widest focus:border-[#245BDB] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhone(newPhone);
                            setIsChangingPhone(false);
                            setPhoneOtpSent(false);
                            alert('تم تحديث رقم هاتفك والتحقق منه بنجاح.');
                          }}
                          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                        >
                          تأكيد الرقم الجديد
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Connected Login Providers */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2.5 text-xs">
                <h4 className="font-bold text-[#202633]">وسائل تسجيل الدخول المرتبطة</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <span className="font-bold">رقم الهاتف (SMS)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px]">
                      مفعّل ({phone})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <span className="font-bold">Google Identity</span>
                    <span className="text-[#245BDB] bg-[#EAF2FF] px-2 py-0.5 rounded text-[11px] font-bold">
                      جاهز للربط
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <span className="font-bold">Apple ID</span>
                    <span className="text-[#245BDB] bg-[#EAF2FF] px-2 py-0.5 rounded text-[11px] font-bold">
                      جاهز للربط
                    </span>
                  </div>
                </div>
              </div>

              {/* CRITICAL: ACCOUNT DELETION MOVED TO CUSTOMER SETTINGS HERE */}
              <div className="p-5 rounded-3xl bg-red-50 border border-red-200 space-y-3">
                <div className="flex items-center gap-2.5 text-red-700">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h4 className="text-sm font-black">منطقة إدارة الحساب الحساسة — حذف الحساب</h4>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  حذف الحساب نهائي وسيؤدي إلى إزالة ملفك الشخصي وسجل الرحلات وأرقام التواصل من التطبيق بصورة دائمة.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>طلب حذف حسابي نهائياً</span>
                  </button>
                ) : (
                  <form onSubmit={handleExecuteDeleteAccount} className="space-y-3 pt-2 border-t border-red-200">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-900">
                        لتأكيد الحذف، اكتب رقم هاتفك المسجل ({phone}):
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder={phone}
                        value={deleteInputPhone}
                        onChange={(e) => setDeleteInputPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-red-300 text-xs font-mono focus:border-red-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-900">سبب الحذف:</label>
                      <select
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-red-300 text-xs font-medium focus:border-red-600 outline-none"
                      >
                        <option value="no_longer_traveling">لم أعد بحاجة للسفر بين المحافظات</option>
                        <option value="privacy_concerns">مخاوف تتعلق بالخصوصية</option>
                        <option value="alternative_service">استخدام وسيلة نقل أخرى</option>
                        <option value="other">أسباب أخرى</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs cursor-pointer shadow-sm"
                      >
                        تأكيد الحذف النهائي وفقدان البيانات
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-2.5 px-4 rounded-xl bg-white text-gray-700 text-xs font-bold border border-gray-300 cursor-pointer"
                      >
                        تراجع
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: PRIVACY & SECURITY */}
          {/* ======================================================== */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              {/* Quick Launch into full Privacy Center */}
              <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#15356B]">مركز الخصوصية وحماية البيانات</h4>
                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    استعراض الوثائق الرسمية الكاملة، بنود الامتثال، والتواصل مع مسؤول الحماية (DPO).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPrivacyCenter('privacy')}
                  className="px-4 py-2 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-bold text-xs cursor-pointer whitespace-nowrap shadow-xs transition-colors"
                >
                  فتح المركز
                </button>
              </div>

              {/* In-app Privacy Toggles */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#202633]">مشاركة الموقع الجغرافي (GPS)</span>
                    <p className="text-[11px] text-[#7B8494]">
                      يُستخدم فقط أثناء الرحلة لاقتراح أقرب محطة انطلاق، ولا يتم التتبع في الخلفية.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => savePreferences({ allowLocation: !preferences.allowLocation })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      preferences.allowLocation ? 'bg-[#245BDB]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                        preferences.allowLocation ? 'left-0.5 translate-x-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#202633]">إظهار رقم الهاتف للسائق</span>
                    <p className="text-[11px] text-[#7B8494]">
                      يظهر رقمك للسائق فقط بعد قبول الحجز والتأكيد للتنسيق المباشر بموعد التحرك.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#245BDB] bg-[#EAF2FF] px-2 py-1 rounded">
                    عند التأكيد فقط
                  </span>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2.5 text-xs">
                <h4 className="font-bold text-[#202633]">الجلسات النشطة والأجهزة</h4>
                <div className="p-3 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#245BDB]" />
                    <div>
                      <div className="font-bold text-[#202633]">هذا الجهاز (الجلسة الحالية)</div>
                      <div className="text-[10px] text-[#7B8494]">نشط الآن · متصفح الويب / تطبيق فَرْزَة</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    متصل
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: NOTIFICATIONS */}
          {/* ======================================================== */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#202633]">تفعيل إشعارات التطبيق العامة</h4>
                  <p className="text-[11px] text-[#7B8494]">المفتاح الرئيسي لجميع إشعارات الحجز والسفر</p>
                </div>
                <button
                  type="button"
                  onClick={() => savePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.notificationsEnabled ? 'bg-[#245BDB]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                      preferences.notificationsEnabled ? 'left-0.5 translate-x-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202633]">إشعارات تأكيد وتغيير الحجز</span>
                    <p className="text-[10px] text-[#7B8494]">إشعار عند قبول السائق أو تغيير موعد الرحلة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.bookingAlerts}
                    onChange={(e) => savePreferences({ bookingAlerts: e.target.checked })}
                    className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202633]">تذكيرات موعد انطلاق الرحلة</span>
                    <p className="text-[10px] text-[#7B8494]">تنبيه قبل انطلاق الرحلة بساعة وساعتين</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.tripReminders}
                    onChange={(e) => savePreferences({ tripReminders: e.target.checked })}
                    className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202633]">صوت تنبيه المحادثة المباشرة</span>
                    <p className="text-[10px] text-[#7B8494]">تشغيل نغمة عند استلام رسالة من السائق</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.chatSound}
                    onChange={(e) => savePreferences({ chatSound: e.target.checked })}
                    className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202633]">العروض والخصومات الترويجية</span>
                    <p className="text-[10px] text-[#7B8494]">إشعارات مستقلة عن الخدمة للعروض والوجهات المخفضة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.promotionsAlerts}
                    onChange={(e) => savePreferences({ promotionsAlerts: e.target.checked })}
                    className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: APPEARANCE & CUSTOMIZATION */}
          {/* ======================================================== */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Selector */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <h4 className="text-xs font-bold text-[#202633]">نمط المظهر (Theme)</h4>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => savePreferences({ theme: 'light' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      preferences.theme === 'light'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>فاتح</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences({ theme: 'dark' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      preferences.theme === 'dark'
                        ? 'bg-[#15356B] border-[#1769FF] text-white shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-[#1769FF]" />
                    <span>داكن</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences({ theme: 'system' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      preferences.theme === 'system'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-gray-500" />
                    <span>حسب الجهاز</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <h4 className="text-xs font-bold text-[#202633]">لغة التطبيق واتجاه الواجهة</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => savePreferences({ language: 'ar' })}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      preferences.language === 'ar'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>العربية (RTL)</span>
                    </div>
                    {preferences.language === 'ar' && <CheckCircle2 className="w-4 h-4 text-[#245BDB]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences({ language: 'en' })}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      preferences.language === 'en'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>English (LTR)</span>
                    </div>
                    {preferences.language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#245BDB]" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: BOOKINGS & TRIPS */}
          {/* ======================================================== */}
          {activeSection === 'bookings' && (
            <div className="space-y-4">
              {/* Segmented Filter */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#F5F7FB] border border-[#DCE4F0] rounded-xl text-xs font-bold">
                <button
                  onClick={() => setBookingFilter('upcoming')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    bookingFilter === 'upcoming' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494]'
                  }`}
                >
                  القادمة
                </button>
                <button
                  onClick={() => setBookingFilter('past')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    bookingFilter === 'past' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494]'
                  }`}
                >
                  السابقة
                </button>
                <button
                  onClick={() => setBookingFilter('cancelled')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    bookingFilter === 'cancelled' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494]'
                  }`}
                >
                  الملغاة
                </button>
                <button
                  onClick={() => setBookingFilter('all')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    bookingFilter === 'all' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494]'
                  }`}
                >
                  الكل ({bookings.length})
                </button>
              </div>

              {/* Bookings Cards List */}
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center bg-[#F5F7FB] rounded-2xl border border-[#DCE4F0] text-xs text-[#7B8494]">
                  لا توجد حجوزات في هذا القسم حاليًا.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const trip = trips.find((t) => t.id === b.tripId);
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-[#DCE4F0] pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#245BDB]">#{b.id}</span>
                            <span className="font-bold text-[#202633]">
                              {trip ? `${trip.fromCity} ← ${trip.toCity}` : 'رحلة بين المدن'}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'pending_driver'
                                ? 'bg-amber-100 text-amber-800'
                                : b.status === 'cancelled' || b.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {b.status === 'confirmed'
                              ? 'حجز مؤكد'
                              : b.status === 'pending_driver'
                              ? 'بانتظار موافقة السائق'
                              : b.status === 'accepted_unpaid_commission'
                              ? 'مقبول / بانتظار العمولة'
                              : b.status === 'commission_pending_verification'
                              ? 'قيد تدقيق العمولة'
                              : b.status === 'cancelled'
                              ? 'ملغي'
                              : b.status === 'rejected'
                              ? 'مرفوض'
                              : 'مكتمل'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7B8494]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#245BDB]" />
                            <span>الموعد: {trip?.departureTime || '07:00 ص'} ({trip?.date || '2026-10-21'})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#245BDB]" />
                            <span>السيارة: {trip?.vehicleModel || 'Toyota Hilux'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#245BDB]" />
                            <span>السائق: {trip?.driverName || 'أحمد الشامي'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#202633]">المقاعد: {b.seatsCount}</span>
                            <span>· إجمالي المبلغ: {b.totalAmount.toLocaleString()} ر.ي</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#DCE4F0]">
                          <button
                            type="button"
                            onClick={() => onOpenChat(b.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#EAF2FF] text-[#245BDB] font-bold text-xs flex items-center gap-1.5 hover:bg-[#D7E7FF] cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>محادثة السائق</span>
                          </button>

                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز وفق سياسة الإلغاء؟')) {
                                  onCancelBooking(b.id);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 cursor-pointer"
                            >
                              إلغاء الحجز
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 6: HELP & SUPPORT */}
          {/* ======================================================== */}
          {activeSection === 'support' && (
            <div className="space-y-5">
              {/* Direct Call / WhatsApp Banner */}
              <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[#15356B] text-xs">
                    <PhoneCall className="w-4 h-4 text-[#245BDB]" />
                    <span>خدمة العملاء المباشرة</span>
                  </div>
                  <span className="font-mono font-bold text-[#245BDB] text-xs">{customerPhone}</span>
                </div>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  فريق دعم فَرْزَة متاح على مدار الساعة للمساعدة في أي استفسار أو مشكلة أثناء السفر.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={`tel:${customerPhone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#245BDB] text-white text-xs font-bold text-center hover:bg-[#1769FF] transition-colors"
                  >
                    اتصال هاتفي
                  </a>
                  <a
                    href={`https://wa.me/967${customerPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center hover:bg-emerald-700 transition-colors"
                  >
                    محادثة واتساب
                  </a>
                </div>
              </div>

              {/* Submit Ticket / Complaint Form */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <h4 className="text-xs font-bold text-[#202633]">تقديم شكوى أو بلاغ عن رحلة</h4>

                {supportSubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>تم استلام بلاغك وسيقوم فريق الدعم بمتابعته والتواصل معك خلال 30 دقيقة.</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-[#7B8494]">نوع البلاغ أو المشكلة</label>
                      <select
                        value={supportTopic}
                        onChange={(e) => setSupportTopic(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-[#DCE4F0] font-medium outline-none focus:border-[#245BDB]"
                      >
                        <option value="تأخر السائق">تأخر السائق عن الموعد المحدد</option>
                        <option value="مشكلة في المقاعد">عدم مطابقة المقاعد المحجوزة</option>
                        <option value="استرداد مالي">استفسار عن استرداد مالي أو إلغاء</option>
                        <option value="ملاحظة على المركبة">ملاحظة بخصوص تكييف أو نظافة السيارة</option>
                        <option value="أخرى">ملاحظة عامة أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#7B8494]">تفاصيل البلاغ</label>
                      <textarea
                        rows={3}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="اكتب تفاصيل ما حدث معك بوضوح..."
                        className="w-full p-3 rounded-lg bg-white border border-[#DCE4F0] outline-none focus:border-[#245BDB]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!supportMessage.trim()}
                      onClick={() => {
                        setSupportSubmitted(true);
                        setTimeout(() => {
                          setSupportSubmitted(false);
                          setSupportMessage('');
                        }, 4000);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] disabled:bg-gray-300 text-white font-bold cursor-pointer"
                    >
                      إرسال البلاغ لفريق الدعم
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 7: PREFERENCES & FAVORITES */}
          {/* ======================================================== */}
          {activeSection === 'preferences' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <h4 className="text-xs font-bold text-[#202633]">الوجهات ومحطات السفر المفضلة</h4>
                <div className="flex flex-wrap gap-2">
                  {preferences.favoriteCities.map((dest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#245BDB]/25 text-xs font-bold text-[#245BDB] flex items-center gap-1.5 shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{dest}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3">
                <h4 className="text-xs font-bold text-[#202633]">تفضيل موقع المقعد في سيارة الهايلكس</h4>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => savePreferences({ preferredSeat: 'window' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      preferences.preferredSeat === 'window'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <span>مقعد النافذة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences({ preferredSeat: 'front' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      preferences.preferredSeat === 'front'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <span>المقعد الأمامي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences({ preferredSeat: 'any' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      preferences.preferredSeat === 'any'
                        ? 'bg-white border-[#245BDB] text-[#245BDB] shadow-xs'
                        : 'bg-white/50 border-[#DCE4F0] text-[#7B8494]'
                    }`}
                  >
                    <span>أي مقعد متاح</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
