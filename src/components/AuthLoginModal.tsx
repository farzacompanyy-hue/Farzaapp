import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaslaLogo } from './WaslaLogo';
import {
  Smartphone,
  ArrowLeft,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface AuthLoginModalProps {
  role: 'passenger' | 'driver';
  onClose: () => void;
  onSuccess: (role: 'passenger' | 'driver', userDetails: { name: string; phone: string; email?: string; provider: 'phone' | 'google' | 'apple' }) => void;
  onOpenPrivacy?: (tab: 'privacy' | 'terms') => void;
}

const COUNTRY_CODES = [
  { code: '+967', country: 'اليمن', flag: '🇾🇪', sample: '77XXXXXXX', minLength: 9 },
  { code: '+966', country: 'السعودية', flag: '🇸🇦', sample: '5XXXXXXXX', minLength: 9 },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪', sample: '5XXXXXXXX', minLength: 9 },
  { code: '+20', country: 'مصر', flag: '🇪🇬', sample: '10XXXXXXXX', minLength: 10 },
  { code: '+968', country: 'عُمان', flag: '🇴🇲', sample: '9XXXXXXX', minLength: 8 },
  { code: '+974', country: 'قطر', flag: '🇶🇦', sample: '3XXXXXXX', minLength: 8 },
  { code: '+965', country: 'الكويت', flag: '🇰🇼', sample: '5XXXXXXX', minLength: 8 },
  { code: '+962', country: 'الأردن', flag: '🇯🇴', sample: '7XXXXXXXX', minLength: 9 },
];

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  role,
  onClose,
  onSuccess,
  onOpenPrivacy,
}) => {
  const [view, setView] = useState<'methods' | 'phone_input' | 'otp_verify'>('methods');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeProvider, setActiveProvider] = useState<'google' | 'apple' | 'phone' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone auth state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Detect iOS / Apple ecosystem
  const isApplePlatform =
    typeof navigator !== 'undefined' &&
    (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (view === 'otp_verify' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timerSeconds]);

  // 1. Google OAuth Flow
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setActiveProvider('google');
    setErrorMessage(null);

    // Secure Google Sign-In Simulation / Handshake
    setTimeout(() => {
      setIsLoading(false);
      setActiveProvider(null);
      onSuccess(role, {
        name: role === 'driver' ? 'أحمد الشامي (Google)' : 'محمد صالح (Google)',
        phone: '771239999',
        email: 'user.wasla@gmail.com',
        provider: 'google',
      });
    }, 1200);
  };

  // 2. Apple Sign In Flow
  const handleAppleLogin = () => {
    setIsLoading(true);
    setActiveProvider('apple');
    setErrorMessage(null);

    // Apple Identity Services Handshake
    setTimeout(() => {
      setIsLoading(false);
      setActiveProvider(null);
      onSuccess(role, {
        name: role === 'driver' ? 'كابتن وَصْلَة (Apple)' : 'مسافر وَصْلَة (Apple)',
        phone: '773456789',
        email: 'privaterelay@appleid.apple.com',
        provider: 'apple',
      });
    }, 1200);
  };

  // 3. Phone SMS Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    if (cleanNumber.length < selectedCountry.minLength) {
      setErrorMessage(`يرجى إدخال رقم هاتف صحيح لا يقل عن ${selectedCountry.minLength} أرقام.`);
      return;
    }

    setIsLoading(true);
    setActiveProvider('phone');
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setActiveProvider(null);
      setView('otp_verify');
      setTimerSeconds(60);
      setCanResend(false);
      // Mock code for instant testing while SMS gateway is integrated
      setOtpCode('5829');
    }, 900);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimerSeconds(60);
    setErrorMessage(null);
    setOtpCode('5829');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMessage('يرجى إدخال رمز التحقق المكون من 4 أرقام.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const fullPhone = `${selectedCountry.code}${phoneNumber}`;
      onSuccess(role, {
        name: role === 'driver' ? 'أحمد محمد الشامي' : 'محمد صالح القدسي',
        phone: fullPhone,
        provider: 'phone',
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative max-w-md w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/25 p-6 sm:p-8 space-y-6 shadow-2xl text-right text-[#202633] overflow-hidden"
      >
        {/* Subtle Brand Background Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#EAF2FF] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
          <div className="flex items-center gap-3">
            <WaslaLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-[#1A2536] font-['Plus_Jakarta_Sans',sans-serif]">WASLA</span>
                <span className="text-base font-black text-[#0056B3] font-['Cairo',sans-serif]">وَصْلَة</span>
              </div>
              <span className="text-[11px] font-bold text-[#0056B3]">
                {role === 'passenger' ? 'تسجيل دخول الراكب' : 'تسجيل دخول السائق'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VIEW 1: MAIN AUTH METHODS */}
        {view === 'methods' && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-[#202633]">
                مرحبًا بك في وَصْلَة
              </h3>
              <p className="text-xs sm:text-sm text-[#7B8494] max-w-xs mx-auto leading-relaxed">
                سافر بين المحافظات اليمنية بأمان أو أدر أسطول رحلاتك وعمولاتك بكل موثوقية.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Provider Buttons Stack */}
            <div className="space-y-3">
              {/* 1. Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-13 px-4 rounded-2xl bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#DCE4F0] hover:border-[#CBD5E1] text-[#202633] font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs disabled:opacity-60 relative group"
              >
                {isLoading && activeProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 text-[#245BDB] animate-spin" />
                ) : (
                  <>
                    {/* Official Multi-Color Google G Logo */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>المتابعة باستخدام Google</span>
                  </>
                )}
              </button>

              {/* 2. Apple Sign-In Button (Optimized for Apple Guidelines) */}
              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="w-full h-13 px-4 rounded-2xl bg-[#000000] hover:bg-[#1A1A1A] active:bg-[#262626] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs disabled:opacity-60 relative group"
              >
                {isLoading && activeProvider === 'apple' ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <>
                    {/* Official Apple Logo */}
                    <svg className="w-5 h-5 fill-white shrink-0 mb-0.5" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.7-14.43-6-9.57-10.74-20.44-14.22-32.61-3.48-12.17-5.22-23.47-5.22-33.9 0-16.53 4.13-30.2 12.39-41.01 8.26-10.82 18.6-16.35 31.02-16.61 4.79 0 10.24 1.25 16.36 3.76 6.12 2.51 10.02 3.82 11.7 3.93 2.01 0 6.08-1.42 12.21-4.25 6.14-2.83 11.75-4.13 16.85-3.9 12.61.65 22.84 5.34 30.68 14.07-11.09 6.74-16.53 16.1-16.31 28.06.22 9.57 3.86 17.5 10.92 23.82 7.07 6.31 15.39 9.9 24.96 10.77-2.17 6.74-4.78 13.48-7.83 20.23zM119.22 31.84c0-7.39 2.66-14.35 7.99-20.88 5.32-6.53 11.85-10.49 19.57-11.89.87 7.61-1.63 14.68-7.51 21.2-5.87 6.52-12.56 10.38-20.05 11.57z" />
                    </svg>
                    <span>المتابعة باستخدام Apple</span>
                    {isApplePlatform && (
                      <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full mr-auto">
                        موصى به
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* 3. Phone SMS Button */}
              <button
                type="button"
                onClick={() => {
                  setView('phone_input');
                  setErrorMessage(null);
                }}
                disabled={isLoading}
                className="w-full h-13 px-4 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] active:bg-[#15356B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md shadow-[#245BDB]/25 disabled:opacity-60 group"
              >
                <Smartphone className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                <span>المتابعة برقم الهاتف</span>
              </button>
            </div>

            {/* Legal Disclosures & Security Footer */}
            <div className="pt-2 border-t border-[#DCE4F0] text-center space-y-2">
              <div className="text-[11px] text-[#7B8494] leading-relaxed">
                <span>بالمتابعة، فإنك توافق على </span>
                <button
                  type="button"
                  onClick={() => onOpenPrivacy && onOpenPrivacy('terms')}
                  className="text-[#245BDB] font-bold hover:underline cursor-pointer"
                >
                  شروط الاستخدام
                </button>
                <span> و </span>
                <button
                  type="button"
                  onClick={() => onOpenPrivacy && onOpenPrivacy('privacy')}
                  className="text-[#245BDB] font-bold hover:underline cursor-pointer"
                >
                  سياسة الخصوصية
                </button>
                <span> لمنصة وَصْلَة.</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] text-[#7B8494]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#245BDB]" />
                  <span>تشفير اتصالات HTTPS</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#245BDB]" />
                  <span>حماية كاملة للبيانات</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PHONE NUMBER ENTRY */}
        {view === 'phone_input' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-[#202633]">أدخل رقم هاتفك</h4>
                <p className="text-xs text-[#7B8494] mt-0.5">سنرسل لك رمز تحقق عبر رسالة نصية قصيرة (SMS)</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setView('methods');
                  setErrorMessage(null);
                }}
                className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#202633]">رقم الهاتف</label>
              <div className="flex items-center gap-2" dir="ltr">
                {/* Country Code Picker */}
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="h-12 px-3 pr-8 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs font-bold appearance-none cursor-pointer focus:border-[#245BDB] outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7B8494] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  placeholder={selectedCountry.sample}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  autoFocus
                  className="flex-1 h-12 px-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] text-sm font-mono tracking-wider focus:border-[#245BDB] focus:bg-white outline-none shadow-xs transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#7B8494] text-right">
                مثال لليمن: 77XXXXXXX أو 73XXXXXXX أو 71XXXXXXX
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length < 5}
              className="w-full h-13 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] active:bg-[#15356B] disabled:bg-gray-300 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#245BDB]/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ إرسال الرمز...</span>
                </>
              ) : (
                <span>إرسال رمز التحقق</span>
              )}
            </button>
          </form>
        )}

        {/* VIEW 3: OTP VERIFICATION ENTRY */}
        {view === 'otp_verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-[#202633]">رمز التحقق</h4>
                <p className="text-xs text-[#7B8494] mt-0.5">
                  تم إرسال الرمز إلى {selectedCountry.code} {phoneNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView('phone_input')}
                className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-[#202633] block text-right">
                أدخل رمز التحقق (4 أرقام)
              </label>
              <input
                type="text"
                maxLength={4}
                dir="ltr"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
                placeholder="••••"
                className="w-48 mx-auto h-14 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/40 text-[#245BDB] font-black focus:border-[#245BDB] focus:bg-white outline-none shadow-xs"
              />
              <div className="flex items-center justify-between pt-1 text-xs">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#245BDB] font-bold hover:underline flex items-center gap-1 cursor-pointer mr-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة إرسال الرمز الآن</span>
                  </button>
                ) : (
                  <span className="text-[#7B8494] font-mono mr-auto">
                    إعادة الإرسال بعد {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                    {String(timerSeconds % 60).padStart(2, '0')}
                  </span>
                )}
                <span className="text-[11px] text-emerald-600 font-medium">رمز تجريبي: 5829</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full h-13 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] active:bg-[#15356B] disabled:bg-gray-300 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#245BDB]/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ التحقق والدخول...</span>
                </>
              ) : (
                <span>تأكيد والدخول</span>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
