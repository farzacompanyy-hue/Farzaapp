import React from 'react';
import { motion } from 'motion/react';
import { Home, Compass, Bell, User } from 'lucide-react';
import { UserRole } from '../types';

export type BottomNavTab = 'home' | 'trips' | 'notifications' | 'profile';

interface BottomNavBarProps {
  activeTab: BottomNavTab;
  currentRole: UserRole | null;
  unreadNotificationsCount?: number;
  activeTripsCount?: number;
  onSelectTab: (tab: BottomNavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  currentRole,
  unreadNotificationsCount = 2,
  activeTripsCount = 1,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'home' as BottomNavTab,
      label: 'الرئيسية',
      icon: Home,
      badge: 0,
    },
    {
      id: 'trips' as BottomNavTab,
      label: currentRole === 'driver' ? 'رحلاتي' : 'حجوزاتي',
      icon: Compass,
      badge: activeTripsCount,
    },
    {
      id: 'notifications' as BottomNavTab,
      label: 'الإشعارات',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    {
      id: 'profile' as BottomNavTab,
      label: 'حسابي',
      icon: User,
      badge: 0,
    },
  ];

  return (
    <aside 
      aria-label="شريط التنقل السفلي"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/92 backdrop-blur-xl border-t border-[#0056B3]/15 shadow-[0_-4px_25px_rgba(0,86,179,0.08)] select-none"
    >
      <nav 
        role="navigation"
        aria-label="القائمة الرئيسية"
        className="max-w-lg mx-auto px-3 py-1.5 flex items-center justify-around gap-1 pb-[max(env(safe-area-inset-bottom),0.4rem)]"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer min-w-[68px] ${
                isActive
                  ? 'text-[#0056B3]'
                  : 'text-[#7B8494] hover:text-[#1A2536]'
              }`}
            >
              {/* Active Tab Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-[#EAF2FF] rounded-2xl border border-[#0056B3]/25 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#0056B3]' : 'text-[#7B8494]'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />

                {/* Notification / Trip Count Badge */}
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#0056B3] text-white text-[9px] font-black flex items-center justify-center shadow-xs border border-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-['Cairo',sans-serif] mt-1 transition-all ${
                  isActive ? 'font-black text-[#0056B3]' : 'font-semibold text-[#7B8494]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default BottomNavBar;
