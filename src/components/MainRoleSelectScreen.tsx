import React from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';

interface MainRoleSelectScreenProps {
  onSelectRole: (role: 'passenger' | 'driver' | 'admin') => void;
  onReplayIntro: () => void;
  onOpenSupport: () => void;
  onOpenInstall: () => void;
  customerPhone?: string;
  slogan?: string;
}

export const MainRoleSelectScreen: React.FC<MainRoleSelectScreenProps> = ({
  onSelectRole,
  onReplayIntro,
  onOpenSupport,
  onOpenInstall,
  customerPhone = '739992781',
  slogan = 'من مدينة إلى مدينة... رحلتك تبدأ من فَرْزَة',
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#FFFFFF] text-[#202633]">
      {/* Background Ambience & Digital Map Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial blue tints */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#EAF2FF] rounded-full blur-[140px] opacity-70" />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[350px] bg-[#1769FF]/5 rounded-full blur-[120px]" />
        
        {/* Subtle Map visual at low opacity */}
        <div className="absolute inset-0 opacity-5 mix-blend-multiply pointer-events-none">
          <img
            src={ASSETS.digitalMap}
            alt="Digital Grid Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-125"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto my-auto space-y-10 py-6">
        {/* HERO SECTION WITH PROMINENT LOGO & BRAND IDENTITY */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Official FARZA Emblem with Royal Blue Aura */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#245BDB]/15 rounded-full blur-2xl group-hover:bg-[#1769FF]/25 transition-all" />
              <FarzaLogo size="xl" showText={false} animated={false} />
            </div>
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

          {/* Quick iPhone Install Banner Card */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenInstall}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#EAF2FF] hover:bg-[#D9E8FF] border border-[#245BDB]/30 hover:border-[#1769FF] text-[#15356B] text-xs font-bold transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#245BDB] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[#202633]">هل تستخدم هاتف آيفون؟</span>
                <span className="text-[#245BDB] font-bold mr-1">اضغط هنا لتثبيت التطبيق على شاشتك الرئيسية فوراً</span>
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
            {/* Ambient card accent glow in Soft Blue */}
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

              {/* Rider Perks list */}
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

            {/* PRIMARY ROYAL BLUE CTA BUTTON */}
            <div className="pt-6 relative z-10">
              <button
                onClick={() => onSelectRole('passenger')}
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
            {/* Ambient card accent glow */}
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

              {/* Driver Perks list */}
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

            {/* PRIMARY ROYAL BLUE CTA BUTTON */}
            <div className="pt-6 relative z-10">
              <button
                onClick={() => onSelectRole('driver')}
                className="w-full h-14 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#245BDB]/25 active:scale-[0.98] cursor-pointer group-hover:shadow-[#1769FF]/40"
              >
                <span>الدخول بصفة سائق (Login as Driver)</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM UTILITY ACTIONS & ADMIN/SUPPORT ACCESS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0] text-xs">
          {/* Replay Intro Animation Button */}
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] border border-[#245BDB]/20 hover:border-[#245BDB] transition-all cursor-pointer shadow-sm group"
          >
            <Play className="w-4 h-4 text-[#245BDB] fill-[#245BDB]/20 group-hover:scale-110 transition-transform" />
            <span>مشاهدة مقدمة فَرْزَة التفاعلية (خريطة & هايلكس)</span>
          </button>

          {/* Customer Service Direct (739992781) */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] border border-[#245BDB]/20 hover:border-[#245BDB] transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#245BDB]" />
            <span>خدمة العملاء: <strong className="text-[#245BDB] font-mono tracking-wider">{customerPhone}</strong></span>
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => onSelectRole('admin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#245BDB] border border-[#E2E8F0] hover:border-[#245BDB]/40 transition-all cursor-pointer mr-auto"
          >
            <Settings className="w-4 h-4" />
            <span>لوحة تحكم الإدارة والتحقق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
