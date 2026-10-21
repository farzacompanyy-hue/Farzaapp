import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Share2,
  PlusSquare,
  Check,
  Copy,
  X,
  QrCode,
  Laptop,
  Download,
  Info,
} from 'lucide-react';

interface InstallIPhoneModalProps {
  appUrl: string;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstallPrompt?: () => void;
}

type TabType = 'ios' | 'android' | 'desktop';

export const InstallIPhoneModal: React.FC<InstallIPhoneModalProps> = ({
  appUrl,
  onClose,
  deferredPrompt,
  onTriggerInstallPrompt,
}) => {
  // Detect client platform
  const [activeTab, setActiveTab] = useState<TabType>('ios');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab('ios');
      } else if (/android/.test(ua)) {
        setActiveTab('android');
      } else if (/windows|macintosh|linux/.test(ua)) {
        setActiveTab('desktop');
      }
    }
  }, []);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // QR Code encoded image url in Royal Blue & White
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=255-255-255&color=36-91-219&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 sm:p-8 space-y-6 shadow-2xl my-6 text-right text-[#202633]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-center text-[#245BDB]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#202633]">تثبيت تطبيق «فَرْزَة» على جهازك</h3>
              <p className="text-[11px] text-[#7B8494]">يعمل كتطبيق أصلي سريع بدون الحاجة لمتجر التطبيقات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Tabs Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0]">
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>🍏</span>
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>🤖</span>
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'desktop'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>كمبيوتر</span>
          </button>
        </div>

        {/* Tab 1: iOS & iPadOS Instructions */}
        {activeTab === 'ios' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">افتح الرابط في متصفح Safari</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  تأكد من فتح الرابط عبر متصفح <strong>Safari</strong> الرسمي على جهازك.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <span>اضغط زر المشاركة</span>
                  <span className="p-1 rounded bg-[#EAF2FF] border border-[#245BDB]/30 text-[#245BDB]">
                    <Share2 className="w-3.5 h-3.5 inline" />
                  </span>
                  <span>أسفل شاشة Safari</span>
                </h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  أيقونة المربع ذو السهم للأعلى في الشريط السفلي.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <span>اختر «إضافة إلى الشاشة الرئيسية»</span>
                  <span className="p-1 rounded bg-[#EAF2FF] border border-[#245BDB]/30 text-[#245BDB]">
                    <PlusSquare className="w-3.5 h-3.5 inline" />
                  </span>
                </h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  مرر خيارات المشاركة لأسفل واضغط على <strong>Add to Home Screen</strong> ثم <strong>إضافة (Add)</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Android Instructions (Samsung, Xiaomi, Huawei, etc.) */}
        {activeTab === 'android' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Direct Install Button if supported by Chrome/Edge */}
            {deferredPrompt && onTriggerInstallPrompt && (
              <button
                onClick={onTriggerInstallPrompt}
                className="w-full py-3 px-4 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#245BDB]/25"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق بضغطة زر واحدة الآن</span>
              </button>
            )}

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">متصفح Chrome أو Samsung Internet</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  افتح الرابط في Google Chrome أو متصفح سامسونج الافتراضي على هاتفك الأندرويد.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">اضغط على زر القائمة (⋮)</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  ستجد قائمة الثلاث نقاط في أعلى أو أسفل المتصفح.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">اختر «تثبيت التطبيق» أو «الإضافة للشاشة الرئيسية»</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  اضغط <strong>Install app</strong> وسيتثبت تطبيق فَرْزَة على هاتفك وتجده في درج التطبيقات والشاشة الرئيسية.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Desktop & Laptop (Windows, macOS, Linux) */}
        {activeTab === 'desktop' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">أيقونة التثبيت في شريط العنوان (Chrome / Edge)</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  انظر إلى أقصى يمين شريط العنوان URL في متصفحك، ستجد أيقونة تثبيت صغيرة (شاشة مع سهم لأسفل أو علامة ⊕).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#245BDB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#202633]">اضغط «تثبيت» (Install)</h4>
                <p className="text-[11px] text-[#7B8494] leading-relaxed">
                  سيفتح تطبيق فَرْزَة في نافذة منفصلة سريعة مع أيقونة على سطح المكتب وشريط المهام.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* QR Code section for easy mobile scanning from PC */}
        <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-[#245BDB]/30 p-1 shrink-0 flex items-center justify-center shadow-xs">
            <img
              src={qrCodeUrl}
              alt="Scan QR code with your phone"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#202633]">
              <QrCode className="w-4 h-4 text-[#245BDB]" />
              <span>امسح الرمز بكاميرا هاتفك</span>
            </div>
            <p className="text-[11px] text-[#7B8494] leading-relaxed">
              افتح كاميرا أي هاتف (iPhone أو Android) ووجّهها نحو الرمز لفتح التطبيق وتثبيته فوراً.
            </p>
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono text-xs outline-none text-left"
            />
            <button
              onClick={handleCopy}
              className="h-11 px-4 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] hover:text-[#245BDB] text-xs font-bold border border-[#DCE4F0] hover:border-[#245BDB]/40 cursor-pointer transition-all"
          >
            حسناً، إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};
