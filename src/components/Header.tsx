import React from 'react';
import { FarzaLogo } from './FarzaLogo';
import { Play, PhoneCall, Smartphone, Settings } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole | null;
  onSelectRole: (role: UserRole | null) => void;
  onReplayIntro: () => void;
  onOpenSupport: () => void;
  onOpenInstall: () => void;
  onOpenPrivacy?: () => void;
  onOpenSettings?: () => void;
  customerPhone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onReplayIntro,
  onOpenSupport,
  onOpenInstall,
  onOpenPrivacy,
  onOpenSettings,
  customerPhone = '739992781',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#245BDB]/15 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-xs">
      {/* Zone 1: Brand Wordmark + Logo */}
      <div
        onClick={() => onSelectRole(null)}
        className="flex items-center gap-3 cursor-pointer shrink-0 group"
      >
        <FarzaLogo size="sm" showText={false} />
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-[#202633] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight group-hover:text-[#245BDB] transition-colors">
            FARZA
          </span>
          <span className="text-xl font-black text-[#245BDB] font-['Cairo',sans-serif]">
            فَرْزَة
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#7B8494]">
        <button
          onClick={() => onSelectRole(null)}
          className={`hover:text-[#202633] transition-colors whitespace-nowrap cursor-pointer ${
            currentRole === null ? 'text-[#245BDB] font-bold' : ''
          }`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => onSelectRole('passenger')}
          className={`hover:text-[#202633] transition-colors whitespace-nowrap cursor-pointer ${
            currentRole === 'passenger' ? 'text-[#245BDB] font-bold' : ''
          }`}
        >
          حجز مقاعد (الراكب)
        </button>
        <button
          onClick={() => onSelectRole('driver')}
          className={`hover:text-[#202633] transition-colors whitespace-nowrap cursor-pointer ${
            currentRole === 'driver' ? 'text-[#245BDB] font-bold' : ''
          }`}
        >
          إدارة الرحلات (السائق)
        </button>
        <button
          onClick={() => onSelectRole('admin')}
          className={`hover:text-[#202633] transition-colors whitespace-nowrap cursor-pointer ${
            currentRole === 'admin' ? 'text-[#245BDB] font-bold' : ''
          }`}
        >
          لوحة الإدارة
        </button>
      </nav>

      {/* Zone 3: Actions & Support */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Universal Install Button (iOS, Android, Desktop) */}
        <button
          onClick={onOpenInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FF] hover:bg-[#D7E7FF] text-[#245BDB] text-xs font-bold border border-[#245BDB]/25 transition-all cursor-pointer whitespace-nowrap shadow-xs"
          title="تثبيت التطبيق على الهاتف أو الكمبيوتر"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#245BDB]" />
          <span className="hidden sm:inline">تثبيت التطبيق</span>
          <span className="sm:hidden">تثبيت</span>
        </button>

        {/* Replay Intro Animation button */}
        <button
          onClick={onReplayIntro}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] text-xs font-medium border border-[#DCE4F0] hover:border-[#245BDB]/40 transition-all cursor-pointer whitespace-nowrap"
          title="مشاهدة مقدمة فَرْزَة التفاعلية"
        >
          <Play className="w-3.5 h-3.5 text-[#245BDB] fill-[#245BDB]/20" />
          <span className="hidden sm:inline">المقدمة</span>
        </button>

        {/* Customer Support shortcut */}
        <button
          onClick={onOpenSupport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#245BDB] text-xs font-bold border border-[#245BDB]/20 transition-all cursor-pointer whitespace-nowrap"
          title="خدمة العملاء: 739992781"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{customerPhone}</span>
          <span className="md:hidden">دعم</span>
        </button>

        {/* Single Sleek Settings Icon Button at the corner */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#245BDB] hover:text-[#1769FF] flex items-center justify-center border border-[#245BDB]/25 transition-all cursor-pointer shadow-xs shrink-0"
            title="إعدادات الحساب"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        {/* Active Role Switcher Pill */}
        {currentRole && (
          <div className="flex items-center gap-1 p-1 bg-[#F5F7FB] border border-[#245BDB]/20 rounded-xl text-xs">
            <button
              onClick={() => onSelectRole('passenger')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'passenger'
                  ? 'bg-[#245BDB] text-white font-bold shadow-xs'
                  : 'text-[#7B8494] hover:text-[#202633]'
              }`}
            >
              راكب
            </button>
            <button
              onClick={() => onSelectRole('driver')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'driver'
                  ? 'bg-[#245BDB] text-white font-bold shadow-xs'
                  : 'text-[#7B8494] hover:text-[#202633]'
              }`}
            >
              سائق
            </button>
            <button
              onClick={() => onSelectRole('admin')}
              className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-[#245BDB] text-white font-bold shadow-xs'
                  : 'text-[#7B8494] hover:text-[#202633]'
              }`}
            >
              إدارة
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
