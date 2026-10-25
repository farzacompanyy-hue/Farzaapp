import React, { useState } from 'react';
import { Driver, Trip, Booking, SystemSettings, Complaint, SOSAlert } from '../types';
import {
  ShieldCheck,
  Receipt,
  Users,
  Car,
  CheckCircle2,
  XCircle,
  Settings,
  PhoneCall,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  ArrowRight,
  Lock,
  LogOut,
  KeyRound,
  AlertTriangle,
  Package,
  HeartHandshake,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface AdminViewProps {
  drivers: Driver[];
  trips: Trip[];
  bookings: Booking[];
  settings: SystemSettings;
  complaints: Complaint[];
  sosAlerts?: SOSAlert[];
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string) => void;
  onApproveCommission: (bookingId: string) => void;
  onRejectCommission: (bookingId: string) => void;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResolveSOS?: (alertId: string) => void;
  onBackToHome?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  drivers,
  trips,
  bookings,
  settings,
  complaints,
  sosAlerts = [],
  onApproveDriver,
  onRejectDriver,
  onApproveCommission,
  onRejectCommission,
  onUpdateSettings,
  onResolveSOS,
  onBackToHome,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wasla_admin_auth') === 'verified_session';
    } catch {
      return false;
    }
  });
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'commissions' | 'sos' | 'settings'>('overview');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.trim() === 'wasla@admin2025' || passkeyInput.trim() === 'admin73999') {
      try {
        sessionStorage.setItem('wasla_admin_auth', 'verified_session');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('رمز الدخول الأمني غير صحيح. هذا القسم مخصص لمدراء المنصة فقط.');
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('wasla_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasskeyInput('');
    if (onBackToHome) {
      onBackToHome();
    }
  };

  // If not authenticated, render secure authentication gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-[#202633]">
        <div className="bg-white border-2 border-[#0056B3]/20 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#EAF2FF] border border-[#0056B3]/30 rounded-2xl mx-auto flex items-center justify-center text-[#0056B3] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[#202633]">بوابة الإدارة المركزية</h2>
            <p className="text-xs text-[#7B8494] mt-1.5 leading-relaxed">
              هذه المنطقة الإدارية محمية بالكامل ومخصصة لإدارة العمليات والتحقق المالي فقط.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-[#202633] mb-1.5">
                مفتاح أمان الإدارة (Admin Master Key)
              </label>
              <div className="relative">
                <input
                  type="password"
                  dir="ltr"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-[#F5F7FB] border border-[#7B8494]/30 rounded-xl text-sm font-mono focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/20 outline-hidden transition-all text-center"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-[#7B8494] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-[#0056B3] to-[#007AFF] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تحقق وتسجيل الدخول للإدارة</span>
            </button>
          </form>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-full py-2.5 bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs rounded-xl border border-[#0056B3]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </button>
          )}

          <div className="pt-2 border-t border-[#7B8494]/15 text-[10px] text-[#7B8494]">
            منصة وَصْلَة للنقل بين المدن اليمنية • نظام الحماية المركزي
          </div>
        </div>
      </div>
    );
  }

  const pendingCommissions = bookings.filter(
    (b) => b.status === 'commission_pending_verification'
  );

  const pendingDrivers = drivers.filter((d) => d.verificationStatus === 'pending');

  const activeSOSList = sosAlerts.filter((s) => s.status === 'active');

  const totalRevenueCommission = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.commissionAmount, 0);

  const totalCargoBookings = bookings.filter((b) => b.bookingType === 'cargo').length;
  const totalCharterBookings = bookings.filter((b) => b.isFullVehicleCharter).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0056B3]/15 pb-4">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs border border-[#0056B3]/25 transition-all cursor-pointer shadow-2xs group shrink-0"
              title="الرجوع إلى الرئيسية"
            >
              <ArrowRight className="w-4 h-4 text-[#0056B3] group-hover:translate-x-0.5 transition-transform" />
              <span>الرئيسية</span>
            </button>
          )}

          <div>
            <h2 className="text-2xl font-black text-[#202633] flex items-center gap-2">
              <span>لوحة تحكم إدارة منصة وَصْلَة</span>
              <span className="text-xs text-[#0056B3] bg-[#EAF2FF] border border-[#0056B3]/30 px-2.5 py-0.5 rounded-full font-black">
                SUPER ADMIN
              </span>
            </h2>
            <p className="text-xs text-[#7B8494] mt-1">
              مراجعة السائقين، اعتماد مدفوعات العمولات البنكية، مراقبة الرحلات، وضبط إعدادات التطبيق.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F7FB] border border-[#0056B3]/20 rounded-2xl text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#0056B3] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            نظرة عامة
          </button>

          <button
            onClick={() => setActiveTab('sos')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sos' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>طوارئ SOS</span>
            {activeSOSList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-700 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {activeSOSList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'commissions' ? 'bg-[#0056B3] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>مراجعة العمولات</span>
            {pendingCommissions.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingCommissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'drivers' ? 'bg-[#0056B3] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>توثيق السائقين</span>
            {pendingDrivers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingDrivers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#0056B3] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            الإعدادات
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            title="تسجيل الخروج من لوحة الإدارة"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">إجمالي عمولات وَصْلَة المحصلة</div>
              <div className="text-2xl font-black text-[#0056B3] mt-2 tabular-nums">
                {totalRevenueCommission.toLocaleString()} <span className="text-xs font-normal text-[#7B8494]">ريال</span>
              </div>
              <div className="text-[10px] text-[#007AFF] font-semibold mt-1">نسبة العمولة: {settings.commissionRatePercent}%</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">سائقون موثقون نشطون</div>
              <div className="text-2xl font-black text-[#202633] mt-2 tabular-nums">
                {drivers.filter((d) => d.verifiedBadge).length}
              </div>
              <div className="text-[10px] text-[#7B8494] mt-1">من إجمالي {drivers.length} سائق</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">شحنات WASLA Express</div>
              <div className="text-2xl font-black text-emerald-700 mt-2 tabular-nums">
                {totalCargoBookings}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">طرود منقولة في الحوض</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">حجوزات العائلات الكاملة</div>
              <div className="text-2xl font-black text-purple-700 mt-2 tabular-nums">
                {totalCharterBookings}
              </div>
              <div className="text-[10px] text-purple-600 font-semibold mt-1">رحلات VIP خاصة</div>
            </div>
          </div>

          {/* Quick Action Alerts */}
          {activeSOSList.length > 0 && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 animate-bounce" />
                <div className="text-xs">
                  <strong className="text-red-950 font-black">نداء طوارئ نشط: </strong>
                  <span className="text-red-900">
                    هناك {activeSOSList.length} بلاغ استغاثة SOS نشط من مسافرين على الطريق بحاجة لمتابعة فورية.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('sos')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shrink-0 cursor-pointer shadow-md transition-all"
              >
                فتح غرفة العمليات
              </button>
            </div>
          )}

          {pendingCommissions.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#EAF2FF] border border-[#0056B3]/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#0056B3] shrink-0" />
                <div className="text-xs">
                  <strong className="text-[#15356B]">تنبيه إداري: </strong>
                  <span className="text-[#202633]">
                    هناك {pendingCommissions.length} إيصال دفع عمولة بانتظار مراجعتك لاعتمادها وفتح المحادثة بين الركاب والسائقين.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('commissions')}
                className="px-3.5 py-1.5 rounded-lg bg-[#0056B3] hover:bg-[#007AFF] text-white text-xs font-black shrink-0 cursor-pointer shadow-md transition-all"
              >
                مراجعة الآن
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB: EMERGENCY SOS MONITOR */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>مراقبة نداءات الاستغاثة الطارئة (SOS Emergency Control Room):</span>
            </span>
            <span className="font-mono text-xs font-black">{sosAlerts.length} بلاغ مسجل</span>
          </div>

          {sosAlerts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-[#202633]">لا توجد أي بلاغات طوارئ حالياً</p>
              <p className="text-xs text-[#7B8494]">جميع الرحلات تسير بأمان على الطرق بين المدن اليمنية.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sosAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    alert.status === 'active'
                      ? 'bg-red-50/80 border-red-300 shadow-sm'
                      : 'bg-white border-[#DCE4F0]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE4F0] pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        alert.status === 'active'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {alert.status === 'active' ? 'نداء استغاثة نشط' : 'تم حل البلاغ وتأمينه ✓'}
                      </span>
                      <span className="text-xs font-mono text-[#7B8494]">#{alert.id}</span>
                    </div>
                    <span className="text-xs text-[#7B8494]">
                      {new Date(alert.createdAt).toLocaleString('ar-YE')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[#7B8494] block">المستغيث:</span>
                      <strong className="text-[#202633] text-sm">{alert.userName}</strong>
                      <div className="font-mono text-[#0056B3]">{alert.userPhone}</div>
                    </div>

                    <div>
                      <span className="text-[#7B8494] block">تفاصيل السائق والسيارة:</span>
                      <strong className="text-[#202633]">{alert.driverName || 'غير محدد'}</strong>
                      <div className="text-[11px] text-[#7B8494] font-mono">{alert.vehiclePlate || 'لوحة سيارة مسجلة'}</div>
                    </div>

                    <div>
                      <span className="text-[#7B8494] block">الموقع الجغرافي GPS:</span>
                      <strong className="text-[#202633]">{alert.addressText || 'طريق السفر العام'}</strong>
                      {alert.coordinates && (
                        <div className="font-mono text-emerald-700 font-bold text-[11px]">
                          {alert.coordinates.latitude.toFixed(4)}, {alert.coordinates.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DCE4F0]">
                    {alert.coordinates ? (
                      <a
                        href={`https://maps.google.com/?q=${alert.coordinates.latitude},${alert.coordinates.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DCE4F0] hover:border-[#0056B3] text-[#0056B3] text-xs font-bold flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>فتح الموقع على خرائط Google</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-[#7B8494]">إحداثيات تقريبية على الطريق</span>
                    )}

                    {alert.status === 'active' && onResolveSOS && (
                      <button
                        onClick={() => onResolveSOS(alert.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تأكيد المتابعة وحل البلاغ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMISSIONS REVIEW */}
      {activeTab === 'commissions' && (
        <div className="space-y-4">
          <div className="text-xs text-[#7B8494]">
            مراجعة إيصالات التحويل البنكي لعمولة الـ 20%: بمجرد الضغط على «اعتماد التحقق»، تتحول حالة الحجز إلى مؤكد ويتم تفعيل شات التواصل فوراً.
          </div>

          {pendingCommissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#0056B3] mx-auto opacity-70" />
              <p className="text-sm font-bold text-[#202633]">لا توجد عمليات عمولة معلقة</p>
              <p className="text-xs text-[#7B8494]">جميع العمليات السابقة تم تدقيقها بنجاح.</p>
            </div>
          ) : (
            pendingCommissions.map((bk) => {
              const trip = trips.find((t) => t.id === bk.tripId);
              return (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#007AFF] transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#0056B3] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#0056B3]/30 font-bold">
                        {bk.id}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                        بانتظار التحقق من الإيداع البنكي
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#202633]">
                      مبلغ العمولة: <strong className="text-[#0056B3] text-base">{bk.commissionAmount.toLocaleString()} ريال</strong>
                    </div>

                    <div className="text-xs text-[#7B8494] space-y-1">
                      <div>السائق: <strong className="text-[#202633]">{trip?.driverName}</strong> ({trip?.driverPhone})</div>
                      <div>الراكب: <strong className="text-[#202633]">{bk.passengerName}</strong> ({bk.passengerPhone})</div>
                      <div>البنك: <strong className="text-[#202633]">{bk.paymentBank || 'الكريمي'}</strong> · رقم الحوالة: <strong className="text-[#0056B3] font-mono">{bk.paymentRef}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onApproveCommission(bk.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد التحقق وتأكيد الحجز</span>
                    </button>
                    <button
                      onClick={() => onRejectCommission(bk.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F5F7FB] text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض الإشعار</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: DRIVERS VERIFICATION */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drivers.map((drv) => (
              <div
                key={drv.id}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={drv.photo}
                      alt={drv.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#DCE4F0]"
                    />
                    <div>
                      <h4 className="text-sm font-black text-[#202633]">{drv.name}</h4>
                      <p className="text-xs text-[#7B8494] font-mono">{drv.phone}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    drv.verifiedBadge
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}>
                    {drv.verifiedBadge ? 'موثّق رسمي ✓' : 'قيد المراجعة'}
                  </span>
                </div>

                <div className="text-xs text-[#7B8494] space-y-1 bg-[#F5F7FB] p-3 rounded-xl border border-[#DCE4F0]">
                  <div>السيارة: <strong className="text-[#202633]">{drv.vehicle.model} ({drv.vehicle.plateNumber})</strong></div>
                  <div>المحافظة: {drv.baseCity} · عدد الرحلات المنجزة: {drv.completedTripsCount}</div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {!drv.verifiedBadge ? (
                    <button
                      onClick={() => onApproveDriver(drv.id)}
                      className="flex-1 py-2 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white text-xs font-bold cursor-pointer"
                    >
                      منح شارة التوثيق الرسمية
                    </button>
                  ) : (
                    <button
                      onClick={() => onRejectDriver(drv.id)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-rose-600 text-xs font-bold cursor-pointer"
                    >
                      إلغاء التوثيق مؤقتاً
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & POLICIES */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633]">رقم هاتف خدمة العملاء والطوارئ</label>
            <input
              type="text"
              value={settings.customerServicePhone}
              onChange={(e) => onUpdateSettings({ customerServicePhone: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono font-bold text-sm outline-none focus:border-[#007AFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633]">نسبة عمولة المنصة (%)</label>
            <input
              type="number"
              value={settings.commissionRatePercent}
              onChange={(e) => onUpdateSettings({ commissionRatePercent: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono font-bold text-sm outline-none focus:border-[#007AFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633]">شعار التطبيق السلوجان</label>
            <input
              type="text"
              value={settings.appSlogan}
              onChange={(e) => onUpdateSettings({ appSlogan: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-bold text-xs outline-none focus:border-[#007AFF]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
