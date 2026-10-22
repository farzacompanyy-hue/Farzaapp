import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaslaLogo } from './WaslaLogo';
import { AuthLoginModal } from './AuthLoginModal';
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
  onOpenPrivacy?: (tab?: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact') => void;
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
  slogan = 'من مدينة إلى مدينة... رحلتك تبدأ من وَصْلَة',
}) => {
  // Auth Modal State
  const [authRole, setAuthRole] = useState<'passenger' | 'driver' | null>(null);

  const handleStartAuth = (role: 'passenger' | 'driver') => {
    setAuthRole(role);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#FFFFFF] text-[#202633]">
      {/* Background Ambience & Digital Map Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Glows in Royal Blue & Light Gray */}
        <div className="absolute top-1/4 -right-28 w-96 h-96 bg-[#EAF2FF] rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-10 -left-28 w-96 h-96 bg-[#007AFF]/10 rounded-full blur-3xl opacity-80" />
        
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
        {/* HERO SECTION WITH WASLA LOGO & SLOGAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Official Wasla Emblem Logo */}
          <div className="flex justify-center pb-1">
            <WaslaLogo size="lg" showText={false} animated={false} />
          </div>

          {/* Typography Lockup */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-[#1A2536] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                WASLA
              </span>
              <span className="text-4xl sm:text-5xl font-black text-[#0056B3] font-['Cairo',sans-serif]">
                وَصْلَة
              </span>
            </div>
            
            <p className="text-lg sm:text-xl font-bold text-[#1A2536] max-w-xl mx-auto leading-relaxed">
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
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#EAF2FF] hover:bg-[#D9E8FF] border border-[#0056B3]/30 hover:border-[#007AFF] text-[#003D82] text-xs font-bold transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0056B3] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[#1A2536]">تثبيت تطبيق وَصْلَة على جهازك؟</span>
                <span className="text-[#0056B3] font-bold mr-1">اضغط هنا لإضافته لشاشتك الرئيسية فوراً</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-[#0056B3] group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* TWO DISTINCT CALL-TO-ACTION CARDS (RIDER & DRIVER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* 1. LOGIN AS RIDER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#0056B3]/40 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#EAF2FF] rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#0056B3]/20 flex items-center justify-center text-[#0056B3] shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#0056B3]/30 text-[#0056B3] tracking-wide">
                  حجز فوري وتأكيد مباشر
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#202633] group-hover:text-[#0056B3] transition-colors">
                  خدمة الركاب والمسافرين
                </h3>
                <p className="text-sm font-medium text-[#7B8494] leading-relaxed">
                  احجز مقعدك فوراً في رحلات الهايلكس اليومية بين المدن اليمنية، بأسعار ثابتة وسائقين معتمدين.
                </p>
              </div>

              {/* Apple-style Quick Highlight Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  سعر المقعد محدد مسبقاً
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  محادثة وتنسيق مباشر
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  أسطول هايلكس حديث
                </span>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <button
                onClick={() => handleStartAuth('passenger')}
                className="w-full h-14 rounded-2xl bg-[#0056B3] hover:bg-[#1769FF] text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#0056B3]/25 active:scale-[0.98] cursor-pointer group-hover:shadow-[#1769FF]/35"
              >
                <span>متابعة كـ راكب</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* 2. LOGIN AS DRIVER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="group relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#0056B3]/40 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#EAF2FF] rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#0056B3]/20 flex items-center justify-center text-[#0056B3] shadow-xs group-hover:scale-105 transition-transform">
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#0056B3]/30 text-[#0056B3] tracking-wide">
                  سائق معتمد · عمولة عادلة
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#202633] group-hover:text-[#0056B3] transition-colors">
                  بوابة السائقين والأسطول
                </h3>
                <p className="text-sm font-medium text-[#7B8494] leading-relaxed">
                  انشر رحلاتك بين المحافظات واستقبل طلبات الحجز الموثقة مع سداد آمن للعمولة وأعلى إيراد يومي.
                </p>
              </div>

              {/* Apple-style Quick Highlight Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  شارة التوثيق الرسمية
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  عمولة المنصة 20% فقط
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#F5F7FB] text-[#202633] border border-[#E2E8F0]">
                  دفع إلكتروني عبر الكريمي
                </span>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <button
                onClick={() => handleStartAuth('driver')}
                className="w-full h-14 rounded-2xl bg-[#0056B3] hover:bg-[#1769FF] text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#0056B3]/25 active:scale-[0.98] cursor-pointer group-hover:shadow-[#1769FF]/35"
              >
                <span>متابعة كـ سائق</span>
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
            <span> لمنصة وَصْلَة.</span>
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
          <AuthLoginModal
            role={authRole}
            onClose={() => setAuthRole(null)}
            onSuccess={(role) => {
              onSelectRole(role);
              setAuthRole(null);
            }}
            onOpenPrivacy={onOpenPrivacy}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
