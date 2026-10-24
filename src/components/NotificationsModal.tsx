import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Car,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  X,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Booking } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'trip' | 'commission' | 'chat' | 'system';
  isRead: boolean;
  actionText?: string;
  bookingId?: string;
}

interface NotificationsModalProps {
  onClose: () => void;
  bookings: Booking[];
  onOpenChat?: (bookingId: string) => void;
  onNavigateToTrips?: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'تأكيد الحجز بنجاح ✓',
    body: 'تم قبول طلب حجزك في رحلة صنعاء ← عدن مع الكابتن أحمد الشامي. انطلاق الرحلة الساعة 6:30 ص.',
    time: 'منذ 15 دقيقة',
    category: 'trip',
    isRead: false,
    actionText: 'فتح المحادثة',
    bookingId: 'bk-501',
  },
  {
    id: 'notif-2',
    title: 'رحلة جديدة على مسارك المفضل',
    body: 'أضاف الكابتن ياسر عبده رحلة جديدة من صنعاء (حدة) إلى تعز (الحوبان) غداً الساعة 7:00 صباحاً.',
    time: 'منذ ساعة',
    category: 'trip',
    isRead: false,
    actionText: 'استعراض المقاعد',
  },
  {
    id: 'notif-3',
    title: 'اعتماد إشعار سداد العمولة',
    body: 'تمت مراجعة حوالة العمولة رقم #REF-99214 واعتمادها رسمياً من قبل الإدارة المالية لمنصة وَصْلَة.',
    time: 'منذ 3 ساعات',
    category: 'commission',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'تحديث منصة وَصْلَة',
    body: 'تم تفعيل المسارات السريعة وتحديث واجهة الملاحة الذكية لضمان تجربة سفر مريحة وآمنة.',
    time: 'أمس',
    category: 'system',
    isRead: true,
  },
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  bookings,
  onOpenChat,
  onNavigateToTrips,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trip' | 'commission'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'trip') return n.category === 'trip';
    if (activeFilter === 'commission') return n.category === 'commission';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative max-w-xl w-full max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/25 shadow-2xl overflow-hidden text-right text-[#202633]"
      >
        {/* HEADER BAR WITH BACK BUTTON */}
        <div className="p-4 sm:p-5 border-b border-[#245BDB]/15 bg-[#F5F7FB] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Top Header Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF2FF] text-[#245BDB] font-bold text-xs border border-[#DCE4F0] hover:border-[#245BDB]/30 transition-all cursor-pointer shadow-2xs group"
              title="الرجوع"
            >
              <ArrowRight className="w-4 h-4 text-[#245BDB] group-hover:translate-x-0.5 transition-transform" />
              <span>رجوع</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-center text-[#245BDB] shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#1A2536]">مركز الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-[#245BDB] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#7B8494]">تحديثات الرحلات المباشرة وحالة الحجوزات</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#202633] flex items-center justify-center border border-[#DCE4F0] cursor-pointer transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTROLS & FILTER TABS */}
        <div className="p-3 bg-[#FFFFFF] border-b border-[#DCE4F0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#245BDB] text-white shadow-2xs'
                  : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB]'
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'unread'
                  ? 'bg-[#245BDB] text-white shadow-2xs'
                  : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB]'
              }`}
            >
              غير المقروءة ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('trip')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'trip'
                  ? 'bg-[#245BDB] text-white shadow-2xs'
                  : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB]'
              }`}
            >
              الرحلات
            </button>
            <button
              onClick={() => setActiveFilter('commission')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'commission'
                  ? 'bg-[#245BDB] text-white shadow-2xs'
                  : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB]'
              }`}
            >
              العمولات
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[#245BDB] hover:text-[#1769FF] font-bold text-[11px] cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[#7B8494] hover:text-rose-600 text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-10 text-center space-y-3 text-[#7B8494]">
              <div className="w-14 h-14 rounded-full bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-center mx-auto text-[#7B8494]">
                <Bell className="w-7 h-7 opacity-40" />
              </div>
              <p className="text-sm font-bold text-[#202633]">لا توجد إشعارات حالياً</p>
              <p className="text-xs">ستصلك هنا إشعارات فورية عن حجوزاتك، تأكيدات السائقين، وتحديثات الرحلات.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const iconMap = {
                trip: <Car className="w-4 h-4 text-[#245BDB]" />,
                commission: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
                chat: <MessageSquare className="w-4 h-4 text-indigo-600" />,
                system: <Sparkles className="w-4 h-4 text-amber-600" />,
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => handleToggleRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-right flex items-start gap-3.5 ${
                    !notif.isRead
                      ? 'bg-[#EAF2FF]/50 border-[#245BDB]/30 shadow-2xs'
                      : 'bg-[#FFFFFF] border-[#DCE4F0] hover:bg-[#F5F7FB]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {iconMap[notif.category] || <Bell className="w-4 h-4 text-[#245BDB]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1A2536]">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#245BDB] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#7B8494] font-medium">{notif.time}</span>
                    </div>

                    <p className="text-xs text-[#4A5568] leading-relaxed">{notif.body}</p>

                    {notif.actionText && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.bookingId && onOpenChat) {
                              onOpenChat(notif.bookingId);
                              onClose();
                            } else if (onNavigateToTrips) {
                              onNavigateToTrips();
                              onClose();
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-[#245BDB] hover:bg-[#1769FF] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>{notif.actionText}</span>
                          <ArrowRight className="w-3 h-3 rotate-180" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#F5F7FB] border-t border-[#DCE4F0] flex items-center justify-between text-xs text-[#7B8494]">
          <span className="text-[11px]">منصة وَصْلَة — تنبيهات الرحلات الآلية</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-[#EAF2FF] text-[#245BDB] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsModal;
