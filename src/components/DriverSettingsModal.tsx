import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Car,
  ShieldCheck,
  Bell,
  Briefcase,
  DollarSign,
  Star,
  HelpCircle,
  Palette,
  Shield,
  LogOut,
  Trash2,
  X,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Save,
  PhoneCall,
  Clock,
  MapPin,
  Users,
  FileText,
  Lock,
  Camera,
  Upload,
} from 'lucide-react';
import { Driver, Trip, Booking } from '../types';

interface DriverSettingsModalProps {
  driver: Driver;
  trips: Trip[];
  bookings: Booking[];
  commissionRate: number;
  onClose: () => void;
  onOpenPrivacyCenter: (tab?: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact') => void;
  onLogout: () => void;
  onAccountDeleted: (phone: string) => void;
  customerPhone?: string;
}

export const DriverSettingsModal: React.FC<DriverSettingsModalProps> = ({
  driver,
  trips,
  bookings,
  commissionRate = 20,
  onClose,
  onOpenPrivacyCenter,
  onLogout,
  onAccountDeleted,
  customerPhone = '739992781',
}) => {
  const [activeSection, setActiveSection] = useState<
    'profile' | 'vehicle' | 'verification' | 'notifications' | 'trips' | 'finances' | 'ratings' | 'support' | 'appearance' | 'privacy' | null
  >(null);

  // Editable Profile & Photo Upload
  const [driverPhoto, setDriverPhoto] = useState(driver.photo);
  const [driverName, setDriverName] = useState(driver.name);
  const [driverPhone, setDriverPhone] = useState(driver.phone);
  const [baseCity, setBaseCity] = useState(driver.baseCity);
  const [profileSaved, setProfileSaved] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDriverPhoto(reader.result);
          driver.photo = reader.result;
          setProfileSaved(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Editable Vehicle
  const [vehicleModel, setVehicleModel] = useState(driver.vehicle.model);
  const [vehicleColor, setVehicleColor] = useState(driver.vehicle.color);
  const [vehicleTotalSeats, setVehicleTotalSeats] = useState(driver.vehicle.totalSeats);
  const [vehicleSaved, setVehicleSaved] = useState(false);

  // Notifications
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyTripReminder, setNotifyTripReminder] = useState(true);
  const [notifyChatSound, setNotifyChatSound] = useState(true);

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePhoneInput, setDeletePhoneInput] = useState('');

  // Financial Calculations
  const driverTrips = trips.filter((t) => t.driverId === driver.id);
  const driverBookings = bookings.filter((b) => driverTrips.some((t) => t.id === b.tripId));

  const confirmedBookings = driverBookings.filter((b) => b.status === 'confirmed');
  const totalGrossRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCommissionDue = confirmedBookings.reduce((sum, b) => sum + b.commissionAmount, 0);

  const pendingCommissionBookings = driverBookings.filter(
    (b) => b.status === 'accepted_unpaid_commission' || b.status === 'commission_pending_verification'
  );
  const totalPendingCommission = pendingCommissionBookings.reduce((sum, b) => sum + b.commissionAmount, 0);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleVehicleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleSaved(true);
    setTimeout(() => setVehicleSaved(false), 2500);
  };

  const handleExecuteDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePhoneInput.replace(/\s+/g, '') !== driver.phone.replace(/\s+/g, '')) {
      alert('رقم الهاتف المدخل لا يطابق رقم هاتف حساب السائق.');
      return;
    }
    onAccountDeleted(driver.phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/20 shadow-2xl text-right text-[#202633] overflow-hidden"
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-[#245BDB]/15 bg-[#F5F7FB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeSection !== null ? (
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF2FF] text-[#245BDB] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors shadow-2xs group"
                title="الرجوع لقائمة الإعدادات"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>رجوع</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF2FF] text-[#245BDB] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors shadow-2xs group"
                title="الرجوع إلى التطبيق"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>الرئيسية</span>
              </button>
            )}

            <div>
              <h3 className="text-lg font-black text-[#202633] flex items-center gap-2">
                <span>
                  {activeSection === null
                    ? 'إعدادات السائق'
                    : activeSection === 'profile'
                    ? 'الملف الشخصي للسائق'
                    : activeSection === 'vehicle'
                    ? 'بيانات المركبة والأسطول'
                    : activeSection === 'verification'
                    ? 'توثيق الحساب والمستندات'
                    : activeSection === 'notifications'
                    ? 'إشعارات الطلبات'
                    : activeSection === 'trips'
                    ? 'الرحلات وسعة المقاعد'
                    : activeSection === 'finances'
                    ? 'الإيرادات والعمولات'
                    : activeSection === 'ratings'
                    ? 'التقييمات والآراء'
                    : activeSection === 'support'
                    ? 'خدمة العملاء'
                    : activeSection === 'privacy'
                    ? 'الخصوصية وحماية البيانات'
                    : 'المظهر واللغة'}
                </span>
                <span className="text-[10px] bg-[#245BDB] text-white px-2 py-0.5 rounded-full font-bold">
                  سائق معتمد
                </span>
              </h3>
              <p className="text-[11px] text-[#7B8494]">
                {activeSection === null
                  ? 'إدارة حساب السائق، أسطول المركبات، وسجلات العمولات'
                  : 'تطبيق وَصْلَة — قسم إعدادات السائق'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF2FF] text-[#7B8494] hover:text-[#202633] flex items-center justify-center border border-[#DCE4F0] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ======================================================== */}
          {/* MAIN WHATSAPP-STYLE MENU LIST */}
          {/* ======================================================== */}
          {activeSection === null && (
            <div className="space-y-6">
              {/* Driver Summary Banner */}
              <div
                onClick={() => setActiveSection('profile')}
                className="p-4 rounded-3xl bg-[#F5F7FB] hover:bg-[#EAF2FF]/60 border border-[#245BDB]/20 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl bg-[#15356B] text-white flex items-center justify-center font-bold text-xl shadow-md overflow-hidden">
                    <img
                      src={driverPhoto}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        {driver.name}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        سائق موثّق
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#7B8494] mt-0.5">
                      <span className="font-mono">{driver.phone}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {driver.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#245BDB] font-medium mt-0.5">
                      {driver.vehicle.model} ({driver.vehicle.color})
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white text-[#7B8494] group-hover:text-[#245BDB] flex items-center justify-center border border-[#DCE4F0] group-hover:border-[#245BDB]/30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Sections Group */}
              <div className="rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 divide-y divide-[#DCE4F0] overflow-hidden">
                {/* 1. Profile */}
                <button
                  type="button"
                  onClick={() => setActiveSection('profile')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الملف الشخصي والمعلومات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">الاسم، رقم الهاتف، والمدينة الأساسية</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 2. Vehicle */}
                <button
                  type="button"
                  onClick={() => setActiveSection('vehicle')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        معلومات المركبة
                      </div>
                      <div className="text-[11px] text-[#7B8494]">طراز الهايلكس، اللون، وسعة المقاعد</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 3. Verification & Documents */}
                <button
                  type="button"
                  onClick={() => setActiveSection('verification')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        توثيق الحساب والمستندات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">شارة التوثيق الرسمية وحالة الرخص والمستندات</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 4. Trips & Capacity */}
                <button
                  type="button"
                  onClick={() => setActiveSection('trips')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الرحلات المنشورة وسعة المقاعد
                      </div>
                      <div className="text-[11px] text-[#7B8494]">المقاعد المحجوزة والمتبقية وتعديل مواعيد الانطلاق</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 5. Finances & Commissions */}
                <button
                  type="button"
                  onClick={() => setActiveSection('finances')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الإيرادات وحسابات العمولة (20%)
                      </div>
                      <div className="text-[11px] text-[#7B8494]">سجل المبالغ المسددة، المتبقية، وسندات البنوك</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 6. Ratings */}
                <button
                  type="button"
                  onClick={() => setActiveSection('ratings')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        التقييمات وآراء الركاب
                      </div>
                      <div className="text-[11px] text-[#7B8494]">متوسط التقييم العام وملاحظات المسافرين</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 7. Notifications */}
                <button
                  type="button"
                  onClick={() => setActiveSection('notifications')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        إشعارات وتنبيهات الطلبات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">تنبيه عند وصول طلب حجز مقعد جديد</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>

                {/* 8. Privacy & Security */}
                <button
                  type="button"
                  onClick={() => setActiveSection('privacy')}
                  className="w-full p-4 flex items-center justify-between text-right hover:bg-[#FFFFFF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202633] group-hover:text-[#245BDB] transition-colors">
                        الخصوصية وحماية البيانات
                      </div>
                      <div className="text-[11px] text-[#7B8494]">أذونات الموقع، حماية الحساب، وحذف الحساب</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#7B8494] group-hover:text-[#245BDB]" />
                </button>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#7B8494]">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من حساب السائق</span>
                </button>

                <button
                  onClick={() => onOpenPrivacyCenter('privacy')}
                  className="text-[#245BDB] hover:underline font-bold cursor-pointer"
                >
                  الخصوصية والشروط
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: PROFILE */}
          {/* ======================================================== */}
          {activeSection === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-4">
                {/* Driver Photo Upload */}
                <div className="flex items-center gap-4 pb-3 border-b border-[#DCE4F0]">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#245BDB] bg-[#15356B] shadow-sm shrink-0">
                    <img
                      src={driverPhoto}
                      alt={driverName}
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="driver-avatar-input"
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors text-white"
                      title="تحميل صورة شخصية جديدة"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                    <input
                      id="driver-avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202633]">الصورة الشخصية للسائق</span>
                      <label
                        htmlFor="driver-avatar-input"
                        className="text-[11px] font-bold text-[#245BDB] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>تحديث الصورة</span>
                      </label>
                    </div>
                    <p className="text-[11px] text-[#7B8494] leading-relaxed">
                      تظهر صورتك الشخصية للركاب في بطاقات الرحلات وعلى شارة السائق الموثّق.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B8494]">اسم السائق</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B8494]">رقم الهاتف</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-mono focus:border-[#245BDB] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B8494]">المدينة الأساسية</label>
                  <input
                    type="text"
                    value={baseCity}
                    onChange={(e) => setBaseCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات السائق</span>
                  </button>
                  {profileSaved && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      تم التحديث
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: VEHICLE */}
          {/* ======================================================== */}
          {activeSection === 'vehicle' && (
            <form onSubmit={handleVehicleSave} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B8494]">طراز المركبة</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#7B8494]">لون المركبة</label>
                    <input
                      type="text"
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#7B8494]">إجمالي سعة المقاعد</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={vehicleTotalSeats}
                      onChange={(e) => setVehicleTotalSeats(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold focus:border-[#245BDB] outline-none"
                    />
                  </div>
                </div>

                {/* Read-Only Protected Plate Number */}
                <div className="p-3 rounded-xl bg-white border border-[#DCE4F0] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#7B8494]">
                    <span>رقم اللوحة المرورية الرسمية (محمي)</span>
                    <Lock className="w-3.5 h-3.5 text-[#245BDB]" />
                  </div>
                  <div className="font-mono font-bold text-sm text-[#202633]">{driver.vehicle.plateNumber}</div>
                  <p className="text-[10px] text-[#7B8494]">
                    * لا يمكن تعديل رقم اللوحة يدوياً؛ يتطلب ذلك رفع صورة كرت تشغيل جديد لإدارة المنصة.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات المركبة</span>
                  </button>
                  {vehicleSaved && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      تم الحفظ
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: VERIFICATION */}
          {/* ======================================================== */}
          {activeSection === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>شارة التوثيق الرسمية معتمدة «✓ سائق موثّق»</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  حسابك مفعل وموثق رسميًا. تظهر علامتك الموثقة لجميع الركاب لزيادة الثقة والحجوزات.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-3 text-xs">
                <h4 className="font-bold text-[#202633]">حالة المستندات المرفوعة للنظام</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <div>
                      <div className="font-bold">رخصة القيادة المهنية</div>
                      <div className="text-[10px] text-[#7B8494]">سارية المفعول · معتمدة من الإدارة</div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      معتمدة
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <div>
                      <div className="font-bold">البطاقة الشخصية / الرقم الوطني</div>
                      <div className="text-[10px] text-[#7B8494] font-mono">{driver.nationalIdNumber}</div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      مطابقة
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#DCE4F0] flex items-center justify-between">
                    <div>
                      <div className="font-bold">كرت تشغيل المركبة وفحص الأمان</div>
                      <div className="text-[10px] text-[#7B8494]">فحص هايلكس أسود معتمد</div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      معتمد
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#EAF2FF] border border-[#245BDB]/20 text-[11px] text-[#15356B] leading-relaxed">
                  <strong>تنبيه الأمان:</strong> لا يمتلك السائق صلاحية تغيير حالة توثيق حسابه بنفسه. تخضع جميع المستندات لفحص وتدقيق إدارة العمليات المركزية لمنصة وَصْلَة لضمان أمان المسافرين.
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: FINANCES & COMMISSIONS */}
          {/* ======================================================== */}
          {activeSection === 'finances' && (
            <div className="space-y-5">
              {/* Gross Revenue & Commission Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 space-y-1">
                  <span className="text-[11px] font-bold text-[#7B8494]">إجمالي دخل الرحلات المحققة</span>
                  <div className="text-lg font-black text-[#202633] font-mono">
                    {totalGrossRevenue.toLocaleString()} ر.ي
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    من {confirmedBookings.length} حجوزات مؤكدة
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 space-y-1">
                  <span className="text-[11px] font-bold text-[#7B8494]">عمولة المنصة المسددة ({commissionRate}%)</span>
                  <div className="text-lg font-black text-[#245BDB] font-mono">
                    {totalCommissionDue.toLocaleString()} ر.ي
                  </div>
                  <span className="text-[10px] text-[#7B8494]">مدفوعة ومراجعة بالإشعار البنكي</span>
                </div>
              </div>

              {/* Pending Commissions Alert */}
              {totalPendingCommission > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>عمولات قيد التسوية أو التحقق: {totalPendingCommission.toLocaleString()} ر.ي</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    يرجى رفع إشعار السداد البنكي لتأكيد الحجز وفتح المحادثة المباشرة مع الركاب فوراً.
                  </p>
                </div>
              )}

              {/* Strict Notice: Driver cannot modify financial balances */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#7B8494] space-y-1">
                <div className="font-bold text-[#202633] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#245BDB]" />
                  <span>حوكمة القيود المالية والعمولات</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  تُحتسب الأرصدة والعمولات آلياً وفق سجلات الحجوزات الحقيقية المقبولة. لا يمكن للسائق تعديل المبالغ أو حالة السداد يدوياً؛ يتم اعتمادها بموجب رقم إشعار التحويل الموثق من البنك (الكريمي، بنك اليمن والكويت، أو ون كاش).
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: TRIPS & SEATS */}
          {/* ======================================================== */}
          {activeSection === 'trips' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#202633]">الرحلات المسجلة للسائق</h4>
              {driverTrips.length === 0 ? (
                <div className="p-6 text-center bg-[#F5F7FB] rounded-2xl border border-[#DCE4F0] text-xs text-[#7B8494]">
                  لا توجد رحلات منشورة حالياً.
                </div>
              ) : (
                <div className="space-y-3">
                  {driverTrips.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCE4F0] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#245BDB]">#{t.id}</span>
                          <span className="font-bold text-[#202633]">
                            {t.fromCity} ({t.fromArea}) ← {t.toCity} ({t.toArea})
                          </span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {t.status === 'published' ? 'منشورة ونشطة' : t.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7B8494]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#245BDB]" />
                          <span>الموعد: {t.departureTime} ({t.date})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#245BDB]" />
                          <span>
                            المقاعد: <strong>{t.availableSeats} متبقي</strong> من أصل {t.totalSeats}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-[#245BDB]" />
                          <span>السعر: {t.pricePerSeat.toLocaleString()} ر.ي / مقعد</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 6: RATINGS */}
          {/* ======================================================== */}
          {activeSection === 'ratings' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black text-[#202633] flex items-center gap-2">
                    <span>{driver.rating}</span>
                    <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                  </div>
                  <p className="text-xs text-[#7B8494] mt-1">
                    بناءً على {driver.ratingCount} تقييم من ركاب حقيقيين
                  </p>
                </div>
                <div className="text-left text-xs text-emerald-700 font-bold">
                  <div>نسبة الرضا 98%</div>
                  <div className="text-[10px] text-[#7B8494] font-normal">رحلات مكتملة: {driver.completedTripsCount}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-[#202633]">آخر آراء الركاب</h4>
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202633]">طارق القدسي</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-[11px] text-[#7B8494]">سائق ممتاز والتزام دقيق بالمواعيد والهايلكس نظيفة ومكيفة.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202633]">بلال الزبيري</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-[11px] text-[#7B8494]">رحلة مريحة وسريعة من صنعاء لعدن، سرعة قيادة متزنة وآمنة.</p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 7: NOTIFICATIONS */}
          {/* ======================================================== */}
          {activeSection === 'notifications' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#202633]">تنبيه عند حجز مقعد جديد</div>
                  <div className="text-[10px] text-[#7B8494]">إشعار صوتي فوري عند إرسال راكب لطلب حجز</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyNewBooking}
                  onChange={(e) => setNotifyNewBooking(e.target.checked)}
                  className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#202633]">تذكير بموعد انطلاق الرحلة</div>
                  <div className="text-[10px] text-[#7B8494]">تنبيه قبل التحرك بساعتين وساعة لتجهيز المركبة</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTripReminder}
                  onChange={(e) => setNotifyTripReminder(e.target.checked)}
                  className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#202633]">تنبيه صوتي لمحادثات الركاب</div>
                  <div className="text-[10px] text-[#7B8494]">نغمة تنبيه عند وصول رسالة جديدة من راكب مؤكد</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyChatSound}
                  onChange={(e) => setNotifyChatSound(e.target.checked)}
                  className="w-4 h-4 text-[#245BDB] rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 8: PRIVACY & DATA PROTECTION */}
          {/* ======================================================== */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              {/* Quick Launch into full Privacy Center */}
              <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#15356B]">مركز الخصوصية وحماية البيانات</h4>
                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    استعراض الوثائق الرسمية الكاملة، بنود الامتثال، والتواصل مع مسؤول الحماية (DPO).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPrivacyCenter('privacy')}
                  className="px-4 py-2 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-bold text-xs cursor-pointer whitespace-nowrap shadow-xs transition-colors"
                >
                  فتح المركز
                </button>
              </div>

              {/* Driver Privacy & Security Principles */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-2.5 text-xs">
                <h4 className="font-bold text-[#202633]">معايير أمان بيانات السائق</h4>
                <div className="space-y-2 text-[#7B8494]">
                  <p className="leading-relaxed">
                    • يتم تشفير صور رخص القيادة ووثائق المركبة وفق بروتوكولات حماية بيانات النقل.
                  </p>
                  <p className="leading-relaxed">
                    • رقم هاتف السائق يظهر فقط للركاب الذين لديهم حجز مؤكد ومقبول على نفس الرحلة.
                  </p>
                  <p className="leading-relaxed">
                    • لا يتم تخزين أو تتبع الموقع الجغرافي خارج مسار الرحلة المعلنة.
                  </p>
                </div>
              </div>

              {/* CRITICAL REQUIREMENT: ACCOUNT DELETION IS STRICTLY LOCATED INSIDE SETTINGS -> PRIVACY */}
              <div className="p-5 rounded-3xl bg-red-50 border border-red-200 space-y-3">
                <div className="flex items-center gap-2.5 text-red-700">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h4 className="text-sm font-black">حذف حساب السائق وإنهاء التسجيل</h4>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  يتطلب حذف حساب السائق تسوية كافة العمولات المستحقة للرحلات المنفذة أولاً لضمان عدم وجود مطالبات مالية معلقة. حذف الحساب نهائي وسيؤدي لإلغاء شارة التوثيق ومسح السجل.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>طلب حذف حساب السائق نهائياً</span>
                  </button>
                ) : (
                  <form onSubmit={handleExecuteDelete} className="space-y-3 pt-2 border-t border-red-200">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-900">
                        لتأكيد الحذف، أدخل رقم هاتفك المسجل ({driver.phone}):
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder={driver.phone}
                        value={deletePhoneInput}
                        onChange={(e) => setDeletePhoneInput(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-red-300 font-mono text-xs outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs cursor-pointer shadow-sm"
                      >
                        تأكيد طلب الحذف النهائي
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-2.5 px-4 rounded-xl bg-white border border-gray-300 font-bold text-gray-700 text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
