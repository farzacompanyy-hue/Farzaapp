import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarzaLogo } from './FarzaLogo';
import { ASSETS } from '../data/mockData';
import {
  UserCheck,
  Car,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Play,
  Settings,
  Sparkles,
  ArrowLeft,
  Users,
  Compass,
  Smartphone,
  Shield,
  FileText,
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';

interface MainRoleSelectScreenProps {
  onSelectRole: (role: 'passenger' | 'driver' | 'admin') => void;
  onReplayIntro: () => void;
  onOpenSupport: () => void;
  onOpenInstall: () => void;
  onOpenPrivacy?: (tab?: 'privacy' | 'terms' | 'consents' | 'export' | 'delete' | 'contact') => void;
  customerPhone?: string;
  slogan?: string;
}

export const MainRoleSelectScreen: React.FC<MainRoleSelectScreenProps> = ({
  onSelectRole,
  onReplayIntro,
  onOpenSupport,
  onOpenInstall,
  onOpenPrivacy,
  customerPhone = '739992781',
  slogan = 'من مدينة إلى مدينة... رحلتك تبدأ من فَرْزَة',
}) => {
  // Auth Modal State
  const [authRole, setAuthRole] = useState<'passenger' | 'driver' | null>(null);
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'apple'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);

  const handleStartAuth = (role: 'passenger' | 'driver') => {
    setAuthRole(role);
    setOtpSent(false);
    setOtpCode('');
  };

  const handleCompleteAuth = () => {
    if (!consentAccepted) return;
    if (authRole) {
      onSelectRole(authRole);
      setAuthRole(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#FFFFFF] text-[#202633]">
      {/* Background Ambience & Digital Map Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Glows in Royal Blue & Light Gray */}
        <div className="absolute top-1/4 -right-28 w-96 h-96 bg-[#EAF2FF] rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-10 -left-28 w-96 h-96 bg-[#1769FF]/10 rounded-full blur-3xl opacity-80" />
        
        {/* Subtle Map Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply flex items-center justify-center">
          <img
            src={ASSETS.digitalMap}
            alt="Yemen Intercity Routes"
            className="w-full h-full object-cover filter contrast-150"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center space-y-8 sm:space-y-12 py-4">
        {/* HERO SECTION WITH FARZA LOGO & SLOGAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Official Emblem Logo */}
          <div className="flex justify-center pb-1">
            <FarzaLogo size="lg" showText={false} animated={false} />
          </div>

          {/* Typography Lockup */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-[#202633] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                FARZA
              </span>
              <span className="text-4xl sm:text-5xl font-black text-[#245BDB] font-['Cairo',sans-serif]">
                فَرْزَة
              </span>
            </div>
            
            <p className="text-lg sm:text-xl font-bold text-[#202633] max-w-xl mx-auto leading-relaxed">
              "{slogan}"
            </p>
            <p className="text-xs sm:text-sm text-[#7B8494] max-w-lg mx-auto">
              المنصة الرقمية الموثوقة لحجز المقاعد والتنقل المريح بين جميع المحافظات اليمنية بسيارات هايلكس حديثة.
            </p>
          </div>

          {/* Key Value Propositions */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs text-[#202633]">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#245BDB]/20 text-[#15356B] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#245BDB]" />
              سائقون موثقون رسميًا
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#245BDB]/20 text-[#15356B] font-semibold">
              <Car className="w-4 h-4 text-[#245BDB]" />
              أسطول Toyota Hilux مكيف
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#245BDB]/20 text-[#15356B] font-semibold">
              <MapPin className="w-4 h-4 text-[#245BDB]" />
              تغطية شاملة لمدن اليمن
            </span>
          </div>

          {/* Quick Install Banner Card */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenInstall}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#EAF2FF] hover:bg-[#D9E8FF] border border-[#245BDB]/30 hover:border-[#1769FF] text-[#15356B] text-xs font-bold transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#245BDB] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[#202633]">تثبيت تطبيق فَرْزَة على جهازك؟</span>
                <span className="text-[#245BDB] font-bold mr-1">اضغط هنا لإضافته لشاشتك الرئيسية فوراً</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-[#245BDB] group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* TWO DISTINCT CALL-TO-ACTION CARDS (RIDER & DRIVER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* 1. LOGIN AS RIDER (الدخول بصفة راكب) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#F5F7FB] hover:bg-[#FFFFFF] border border-[#245BDB]/15 hover:border-[#1769FF] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAF2FF] rounded-full blur-2xl group-hover:bg-[#1769FF]/10 transition-all pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/25 flex items-center justify-center text-[#245BDB] group-hover:scale-105 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EAF2FF] border border-[#245BDB]/30 text-[#245BDB]">
                  أنا راكب · احجز مقعدك
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#202633] group-hover:text-[#245BDB] transition-colors">
                  الدخول بصفة راكب
                </h3>
                <p className="text-xs sm:text-sm text-[#7B8494] mt-2 leading-relaxed">
                  ابحث عن الرحلات اليومية بين صنعاء، عدن، تعز، إب وجميع المدن. اختر عدد المقاعد، استعرض تقييمات السائقين، واحجز فوراً مع محادثة مباشرة وآمنة.
                </p>
              </div>

              <ul className="space-y-2 pt-2 text-xs text-[#202633]/90">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>معاينة المقاعد المتبقية لكل سيارة (مثلاً 3 / 5)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>أسعار واضحة بالريال اليمني دون رسوم خفية</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>تأكيد فوري وتواصل مع السائق بعد قبول الطلب</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => handleStartAuth('passenger')}
                className="w-full h-14 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#245BDB]/25 active:scale-[0.98] cursor-pointer group-hover:shadow-[#1769FF]/40"
              >
                <span>الدخول بصفة راكب (Login as Rider)</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* 2. LOGIN AS DRIVER (الدخول بصفة سائق) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#F5F7FB] hover:bg-[#FFFFFF] border border-[#245BDB]/15 hover:border-[#1769FF] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAF2FF] rounded-full blur-2xl group-hover:bg-[#1769FF]/10 transition-all pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/25 flex items-center justify-center text-[#245BDB] group-hover:scale-105 transition-transform">
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EAF2FF] border border-[#1769FF]/30 text-[#1769FF]">
                  أنا سائق · انشر رحلتك
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#202633] group-hover:text-[#245BDB] transition-colors">
                  الدخول بصفة سائق
                </h3>
                <p className="text-xs sm:text-sm text-[#7B8494] mt-2 leading-relaxed">
                  انشر رحلاتك بين المحافظات بسيارتك الهايلكس. حدد السعر ونقاط الانطلاق، واستقبل طلبات الحجز الموثقة مع عمولة فَرْزَة العادلة (20%) ونظام دفع بنكي معتمد.
                </p>
              </div>

              <ul className="space-y-2 pt-2 text-xs text-[#202633]/90">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>شارة التوثيق الرسمية «✓ سائق موثّق»</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>إدارة سعة المقاعد وقبول الركاب بضغطة زر</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                  <span>دفع عمولة المنصة بسهولة عبر حسابات البنوك اليمنية</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => handleStartAuth('driver')}
                className="w-full h-14 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#245BDB]/25 active:scale-[0.98] cursor-pointer group-hover:shadow-[#1769FF]/40"
              >
                <span>الدخول بصفة سائق (Login as Driver)</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* LEGAL CONSENT DISCLOSURE BAR */}
        <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 max-w-4xl mx-auto text-center space-y-2">
          <div className="text-xs text-[#7B8494] leading-relaxed">
            <span>بالدخول أو استخدام المنصة، فإنك توافق على </span>
            <button
              onClick={() => onOpenPrivacy && onOpenPrivacy('terms')}
              className="text-[#245BDB] font-bold hover:underline cursor-pointer"
            >
              شروط وأحكام الاستخدام
            </button>
            <span> و</span>
            <button
              onClick={() => onOpenPrivacy && onOpenPrivacy('privacy')}
              className="text-[#245BDB] font-bold hover:underline cursor-pointer"
            >
              سياسة الخصوصية وحماية البيانات
            </button>
            <span> لمنصة فَرْزَة.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#7B8494]">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>تشفير اتصالات HTTPS 256-bit</span>
            </span>
            <span>·</span>
            <span>حماية كاملة لأرقام الهواتف والمستندات</span>
            <span>·</span>
            <span>حق الوصول وحذف الحساب متاح بأي وقت</span>
          </div>
        </div>

        {/* BOTTOM UTILITY ACTIONS & ADMIN/SUPPORT/PRIVACY ACCESS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0] text-xs">
          {/* Replay Intro Animation Button */}
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] border border-[#245BDB]/20 hover:border-[#245BDB] transition-all cursor-pointer shadow-sm group"
          >
            <Play className="w-4 h-4 text-[#245BDB] fill-[#245BDB]/20 group-hover:scale-110 transition-transform" />
            <span>مشاهدة المقدمة التفاعلية</span>
          </button>

          {/* Privacy Center Shortcut */}
          <button
            onClick={() => onOpenPrivacy && onOpenPrivacy('privacy')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] hover:text-[#245BDB] border border-[#245BDB]/20 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#245BDB]" />
            <span>مركز الخصوصية وحماية البيانات</span>
          </button>

          {/* Customer Service Direct (739992781) */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] border border-[#245BDB]/20 hover:border-[#245BDB] transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#245BDB]" />
            <span>الدعم: <strong className="text-[#245BDB] font-mono tracking-wider">{customerPhone}</strong></span>
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => onSelectRole('admin')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#245BDB] border border-[#E2E8F0] hover:border-[#245BDB]/40 transition-all cursor-pointer mr-auto"
          >
            <Settings className="w-4 h-4" />
            <span>لوحة الإدارة</span>
          </button>
        </div>
      </div>

      {/* MODERN MULTI-PROVIDER AUTHENTICATION MODAL */}
      <AnimatePresence>
        {authRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative max-w-md w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 space-y-5 shadow-2xl text-right text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#202633]">
                      تسجيل الدخول — {authRole === 'passenger' ? 'حساب الراكب' : 'حساب السائق'}
                    </h3>
                    <p className="text-[11px] text-[#7B8494]">مصادقة مشفرة وآمنة لحماية هويتك وحجوزاتك</p>
                  </div>
                </div>
                <button
                  onClick={() => setAuthRole(null)}
                  className="w-7 h-7 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Authentication Provider Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs font-bold">
                <button
                  onClick={() => setAuthMethod('phone')}
                  className={`py-2 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    authMethod === 'phone' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
                  }`}
                >
                  رقم الهاتف (SMS)
                </button>
                <button
                  onClick={() => setAuthMethod('google')}
                  className={`py-2 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    authMethod === 'google' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setAuthMethod('apple')}
                  className={`py-2 px-2 rounded-lg transition-all cursor-pointer text-center ${
                    authMethod === 'apple' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
                  }`}
                >
                  Apple
                </button>
              </div>

              {/* Provider 1: Phone SMS OTP */}
              {authMethod === 'phone' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">رقم الهاتف الجوال اليمني</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="77XXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs font-mono outline-none focus:border-[#245BDB]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (phoneNumber.trim().length >= 8) {
                            setOtpSent(true);
                            setOtpCode('5829'); // Demo verification code
                          }
                        }}
                        className="h-11 px-3 rounded-xl bg-[#EAF2FF] hover:bg-[#D7E7FF] text-[#245BDB] font-bold text-xs border border-[#245BDB]/30 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {otpSent ? 'إعادة الإرسال' : 'إرسال الرمز'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#202633]">رمز التحقق (OTP)</label>
                        <span className="text-[10px] text-[#245BDB] font-mono">الرمز التجريبي: 5829</span>
                      </div>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="أدخل الرمز المكون من 4 أرقام"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs font-mono text-center tracking-widest outline-none focus:border-[#245BDB]"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Provider 2: Google Sign-In */}
              {authMethod === 'google' && (
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#202633]">
                    <span className="text-sm">🌐</span>
                    <span>تسجيل الدخول الموحد عبر Google</span>
                  </div>
                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    يتلقى تطبيق فَرْزَة فقط: المعرف الآمن، اسمك المسجل، وصورة ملفك الشخصي. لا نصل إطلاقاً لكلمات مرور حسابك في Google.
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-[#245BDB]/20 text-[11px] text-[#245BDB] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>جاهز للربط عبر Google Identity Services</span>
                  </div>
                </div>
              )}

              {/* Provider 3: Apple Sign-In */}
              {authMethod === 'apple' && (
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#202633]">
                    <span className="text-sm"></span>
                    <span>تسجيل الدخول باستخدام Apple</span>
                  </div>
                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    يدعم ميزة إخفاء البريد (Private Relay). يتم تشفير الرموز بأعلى معايير أمان iOS دون الوصول لبيانات جهازك الحساسة.
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-[#245BDB]/20 text-[11px] text-[#245BDB] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>جاهز للربط عبر Apple Sign In API</span>
                  </div>
                </div>
              )}

              {/* Consent Checkbox */}
              <div className="pt-1 flex items-start gap-2.5 text-xs text-[#202633]">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#245BDB] focus:ring-[#245BDB] cursor-pointer"
                />
                <label htmlFor="consentCheck" className="text-[11px] leading-relaxed cursor-pointer select-none">
                  أقر بموافقتي التامة على{' '}
                  <button
                    type="button"
                    onClick={() => onOpenPrivacy && onOpenPrivacy('terms')}
                    className="text-[#245BDB] font-bold underline"
                  >
                    شروط الاستخدام
                  </button>{' '}
                  و{' '}
                  <button
                    type="button"
                    onClick={() => onOpenPrivacy && onOpenPrivacy('privacy')}
                    className="text-[#245BDB] font-bold underline"
                  >
                    سياسة الخصوصية
                  </button>{' '}
                  الخاصة بمنصة فَرْزَة لنقل الركاب.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={!consentAccepted}
                  onClick={handleCompleteAuth}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] disabled:bg-gray-300 text-white font-black text-xs transition-all shadow-md shadow-[#245BDB]/20 cursor-pointer text-center"
                >
                  متابعة والدخول إلى المنصة
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole(null)}
                  className="py-3 px-4 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] text-xs font-medium border border-[#DCE4F0] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
