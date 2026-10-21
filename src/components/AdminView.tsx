import React, { useState } from 'react';
import { Driver, Trip, Booking, SystemSettings, Complaint } from '../types';
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
} from 'lucide-react';

interface AdminViewProps {
  drivers: Driver[];
  trips: Trip[];
  bookings: Booking[];
  settings: SystemSettings;
  complaints: Complaint[];
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string) => void;
  onApproveCommission: (bookingId: string) => void;
  onRejectCommission: (bookingId: string) => void;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  drivers,
  trips,
  bookings,
  settings,
  complaints,
  onApproveDriver,
  onRejectDriver,
  onApproveCommission,
  onRejectCommission,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'commissions' | 'settings'>('overview');

  const pendingCommissions = bookings.filter(
    (b) => b.status === 'commission_pending_verification'
  );

  const pendingDrivers = drivers.filter((d) => d.verificationStatus === 'pending');

  const totalRevenueCommission = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.commissionAmount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#245BDB]/15 pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#202633] flex items-center gap-2">
            <span>لوحة تحكم إدارة منصة فَرْزَة</span>
            <span className="text-xs text-[#245BDB] bg-[#EAF2FF] border border-[#245BDB]/30 px-2.5 py-0.5 rounded-full font-black">
              SUPER ADMIN
            </span>
          </h2>
          <p className="text-xs text-[#7B8494] mt-1">
            مراجعة السائقين، اعتماد مدفوعات العمولات البنكية، مراقبة الرحلات، وضبط إعدادات التطبيق.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F7FB] border border-[#245BDB]/20 rounded-2xl text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'commissions' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
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
              activeTab === 'drivers' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
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
              activeTab === 'settings' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            الإعدادات والإعلانات
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">إجمالي عمولات فَرْزَة المحصلة</div>
              <div className="text-2xl font-black text-[#245BDB] mt-2 tabular-nums">
                {totalRevenueCommission.toLocaleString()} <span className="text-xs font-normal text-[#7B8494]">ريال</span>
              </div>
              <div className="text-[10px] text-[#1769FF] font-semibold mt-1">نسبة العمولة: {settings.commissionRatePercent}%</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">سائقون موثقون نشطون</div>
              <div className="text-2xl font-black text-[#202633] mt-2 tabular-nums">
                {drivers.filter((d) => d.verifiedBadge).length}
              </div>
              <div className="text-[10px] text-[#7B8494] mt-1">من إجمالي {drivers.length} سائق</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">الرحلات المنشورة</div>
              <div className="text-2xl font-black text-[#202633] mt-2 tabular-nums">
                {trips.length}
              </div>
              <div className="text-[10px] text-[#245BDB] font-semibold mt-1">صنعاء، عدن، تعز، إب</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F5F7FB] border border-[#DCE4F0] shadow-xs">
              <div className="text-xs text-[#7B8494]">الحجوزات الإجمالية</div>
              <div className="text-2xl font-black text-[#202633] mt-2 tabular-nums">
                {bookings.length}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">{pendingCommissions.length} بانتظار التحقق</div>
            </div>
          </div>

          {/* Quick Action Alerts */}
          {pendingCommissions.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#245BDB] shrink-0" />
                <div className="text-xs">
                  <strong className="text-[#15356B]">تنبيه إداري: </strong>
                  <span className="text-[#202633]">
                    هناك {pendingCommissions.length} إيصال دفع عمولة بانتظار مراجعتك لاعتمادها وفتح المحادثة بين الركاب والسائقين.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('commissions')}
                className="px-3.5 py-1.5 rounded-lg bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-black shrink-0 cursor-pointer shadow-md transition-all"
              >
                مراجعة الآن
              </button>
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
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#245BDB] mx-auto opacity-70" />
              <p className="text-sm font-bold text-[#202633]">لا توجد عمليات عمولة معلقة</p>
              <p className="text-xs text-[#7B8494]">جميع العمليات السابقة تم تدقيقها بنجاح.</p>
            </div>
          ) : (
            pendingCommissions.map((bk) => {
              const trip = trips.find((t) => t.id === bk.tripId);
              return (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#1769FF] transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#245BDB] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#245BDB]/30 font-bold">
                        {bk.id}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                        بانتظار التحقق من الإيداع البنكي
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#202633]">
                      مبلغ العمولة: <strong className="text-[#245BDB] text-base">{bk.commissionAmount.toLocaleString()} ريال</strong>
                    </div>

                    <div className="text-xs text-[#7B8494] space-y-1">
                      <div>الراكب: <strong className="text-[#202633]">{bk.passengerName}</strong> ({bk.passengerPhone})</div>
                      <div>البنك: <strong className="text-[#202633]">{bk.paymentBank || 'بنك الكريمي'}</strong></div>
                      <div>رقم المرجع / الإيصال: <strong className="text-[#202633] font-mono">{bk.paymentRef}</strong></div>
                      {trip && <div>الرحلة: {trip.fromCity} ← {trip.toCity} (السائق: {trip.driverName})</div>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onApproveCommission(bk.id)}
                      className="px-5 py-3 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>اعتماد وتفعيل التواصل ✓</span>
                    </button>
                    <button
                      onClick={() => onRejectCommission(bk.id)}
                      className="px-4 py-3 rounded-xl bg-[#F5F7FB] hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض الإيصال</span>
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
          <div className="text-xs text-[#7B8494]">
            قائمة السائقين والتحقق من الهوية وصور سيارات الهايلكس ورقم اللوحات.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drivers.map((drv) => (
              <div
                key={drv.id}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={drv.photo}
                      alt={drv.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#245BDB]/40 shadow-xs"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#202633]">{drv.name}</div>
                      <div className="text-xs text-[#7B8494] font-mono">{drv.phone}</div>
                    </div>
                  </div>

                  {drv.verifiedBadge ? (
                    <span className="text-xs font-bold text-[#245BDB] bg-[#EAF2FF] px-2.5 py-1 rounded-full border border-[#245BDB]/30">
                      موثّق ✓
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                      قيد المراجعة
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs space-y-1">
                  <div>السيارة: <strong className="text-[#202633]">{drv.vehicle.model} ({drv.vehicle.color})</strong></div>
                  <div>رقم اللوحة: <strong className="text-[#202633] font-mono">{drv.vehicle.plateNumber}</strong></div>
                  <div>الهوية الوطنية: <strong className="text-[#7B8494] font-mono">{drv.nationalIdNumber}</strong></div>
                </div>

                {!drv.verifiedBadge && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onApproveDriver(drv.id)}
                      className="flex-1 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs cursor-pointer shadow-md transition-all"
                    >
                      قبول وتوثيق السائق ✓
                    </button>
                    <button
                      onClick={() => onRejectDriver(drv.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F5F7FB] text-rose-600 border border-rose-200 text-xs cursor-pointer"
                    >
                      رفض
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & ADVERTISING */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] shadow-sm space-y-6 max-w-2xl">
          <h3 className="text-lg font-black text-[#202633] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#245BDB]" />
            <span>إعدادات النظام، الإعلانات، وخدمة العملاء</span>
          </h3>

          {/* Customer Service Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>رقم خدمة العملاء المعتمد (اتصال وواتساب)</span>
            </label>
            <input
              type="text"
              value={settings.customerServicePhone}
              onChange={(e) => onUpdateSettings({ customerServicePhone: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono font-bold text-sm outline-none text-left focus:border-[#1769FF]"
            />
          </div>

          {/* Commission rate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>نسبة عمولة منصة فَرْزَة (%)</span>
            </label>
            <input
              type="number"
              value={settings.commissionRatePercent}
              onChange={(e) => onUpdateSettings({ commissionRatePercent: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono font-bold text-sm outline-none focus:border-[#1769FF]"
            />
          </div>

          {/* Splash Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>مدة شاشة البداية Splash Screen (بالثواني)</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="1.5"
              max="5"
              value={settings.splashDurationSeconds}
              onChange={(e) => onUpdateSettings({ splashDurationSeconds: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-mono font-bold text-sm outline-none focus:border-[#1769FF]"
            />
          </div>
          {/* Legal Compliance & App Store Safety Overview */}
          <div className="p-5 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/25 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#202633]">
              <span className="flex items-center gap-1.5 text-[#245BDB]">
                <ShieldCheck className="w-4 h-4" />
                <span>الامتثال القانوني ومتطلبات متاجر التطبيقات (Google Play & Apple)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#245BDB] text-[10px] font-mono">
                جاهز للرفع والتضمين
              </span>
            </div>

            <p className="text-[11px] text-[#7B8494] leading-relaxed">
              تم تجهيز السياسات بروابط عامة ثابتة HTTPS وبوابات حذف الحساب المستقلة لتلبية معايير مراجعة التطبيقات:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white border border-[#DCE4F0] hover:border-[#245BDB] flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-[#202633]">رابط سياسة الخصوصية العام</div>
                  <div className="text-[10px] text-[#7B8494] font-mono">/privacy.html</div>
                </div>
                <FileText className="w-4 h-4 text-[#245BDB]" />
              </a>

              <a
                href="/delete-account.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white border border-[#DCE4F0] hover:border-red-500 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-red-600">بوابة طلب حذف الحساب العامة</div>
                  <div className="text-[10px] text-[#7B8494] font-mono">/delete-account.html</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-red-500" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
