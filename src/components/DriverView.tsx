import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, Booking, City, Driver } from '../types';
import {
  Car,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Upload,
  MessageSquare,
  AlertTriangle,
  Receipt,
  FileCheck,
  Settings,
  ArrowRight,
} from 'lucide-react';

interface DriverViewProps {
  driver: Driver;
  trips: Trip[];
  bookings: Booking[];
  cities: City[];
  commissionRate: number;
  onCreateTrip: (newTrip: Partial<Trip>) => void;
  onAcceptBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onSubmitCommissionReceipt: (bookingId: string, bank: string, refNumber: string, receiptPhoto: string) => void;
  onOpenChat: (bookingId: string) => void;
  onOpenSettings?: () => void;
  onBackToHome?: () => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  driver,
  trips,
  bookings,
  cities,
  commissionRate = 20,
  onCreateTrip,
  onAcceptBooking,
  onRejectBooking,
  onSubmitCommissionReceipt,
  onOpenChat,
  onOpenSettings,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'bookings' | 'commissions'>('bookings');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Trip State
  const [fromCity, setFromCity] = useState<string>('صنعاء');
  const [fromArea, setFromArea] = useState<string>('حدة - جولة الرويشان');
  const [toCity, setToCity] = useState<string>('عدن');
  const [toArea, setToArea] = useState<string>('المنصورة - جولة كالتكس');
  const [date, setDate] = useState<string>('2026-10-21');
  const [departureTime, setDepartureTime] = useState<string>('06:00 صباحاً');
  const [totalSeats, setTotalSeats] = useState<number>(5);
  const [pricePerSeat, setPricePerSeat] = useState<number>(12000);
  const [notes, setNotes] = useState<string>('هايلكس حديثة ومكيفة، مقاعد مريحة.');
  const [vehiclePhoto, setVehiclePhoto] = useState<string>(
    driver.vehicle.photoUrl || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&fit=crop'
  );

  const handleVehiclePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setVehiclePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Commission Payment Modal State
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('بنك الكريمي للتمويل الأصغر');
  const [refNumber, setRefNumber] = useState<string>('KR-' + Math.floor(100000 + Math.random() * 900000));
  const [uploadedReceipt, setUploadedReceipt] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&fit=crop'
  );
  const [receiptSubmitted, setReceiptSubmitted] = useState<boolean>(false);

  const driverTrips = trips.filter((t) => t.driverId === driver.id);
  const driverBookings = bookings.filter((b) =>
    driverTrips.some((t) => t.id === b.tripId)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTrip({
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      driverPhoto: driver.photo,
      driverRating: driver.rating,
      isVerified: driver.verifiedBadge,
      fromCity,
      fromArea,
      toCity,
      toArea,
      date,
      departureTime,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      vehicleModel: driver.vehicle.model,
      vehicleColor: driver.vehicle.color,
      vehiclePlate: driver.vehicle.plateNumber,
      vehiclePhoto: vehiclePhoto || driver.vehicle.photoUrl,
      notes,
      status: 'published',
    });
    setShowCreateModal(false);
    setActiveTab('trips');
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBooking) return;
    onSubmitCommissionReceipt(payingBooking.id, selectedBank, refNumber, uploadedReceipt);
    setReceiptSubmitted(true);
    setTimeout(() => {
      setPayingBooking(null);
      setReceiptSubmitted(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* DRIVER PROFILE HEADER CARD (Soft Gray & Royal Blue Accents) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs border border-[#0056B3]/25 transition-all cursor-pointer shadow-2xs group shrink-0"
              title="الرجوع إلى الرئيسية"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>الرئيسية</span>
            </button>
          )}

          <div className="relative">
            <img
              src={driver.photo}
              alt={driver.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#245BDB] shadow-xs"
            />
            {driver.verifiedBadge && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#245BDB] text-white flex items-center justify-center font-black text-xs shadow-md">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#202633]">{driver.name}</h2>
              <span className="text-xs font-bold text-[#245BDB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#245BDB]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                سائق موثّق ✓
              </span>
            </div>
            <div className="text-xs text-[#7B8494] mt-1 flex flex-wrap items-center gap-3">
              <span>الهاتف: <strong className="text-[#202633] font-mono">{driver.phone}</strong></span>
              <span>·</span>
              <span>السيارة المعتمدة: <strong className="text-[#245BDB]">{driver.vehicle.model} ({driver.vehicle.color})</strong></span>
              <span>·</span>
              <span>رقم اللوحة: <strong className="text-[#202633] font-mono">{driver.vehicle.plateNumber}</strong></span>
            </div>
          </div>
        </div>

        {/* Action: Create New Trip & Settings */}
        <div className="flex items-center gap-2.5">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/25 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              title="إعدادات السائق مثل واتساب"
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات السائق</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#245BDB]/20 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>نشر رحلة جديدة</span>
          </button>
        </div>
      </div>

      {/* 4-METRIC STAT GRID (Apple iOS 18 Design Aesthetics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Active Trips */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-1 shadow-xs hover:border-[#245BDB]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>الرحلات المنشورة</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202633] tabular-nums font-mono">
            {driverTrips.length}
          </div>
          <div className="text-[11px] text-[#245BDB] font-semibold">رحلات معلنة نشطة</div>
        </div>

        {/* 2. Total Bookings */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-1 shadow-xs hover:border-[#245BDB]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>طلبات الركاب</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202633] tabular-nums font-mono">
            {driverBookings.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            {driverBookings.filter((b) => b.status === 'pending_driver').length} بانتظار الموافقة
          </div>
        </div>

        {/* 3. Confirmed Revenue */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-1 shadow-xs hover:border-[#245BDB]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>الإيراد المتوقع</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#245BDB] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#202633] tabular-nums font-mono">
            {driverBookings
              .filter((b) => b.status === 'confirmed' || b.status === 'accepted_unpaid_commission')
              .reduce((s, b) => s + b.totalAmount, 0)
              .toLocaleString()}
          </div>
          <div className="text-[11px] text-[#7B8494] font-semibold">ريال يمني (إجمالي)</div>
        </div>

        {/* 4. Farza Commission Rate */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-1 shadow-xs hover:border-[#245BDB]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>عمولة المنصة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums font-mono">
            {commissionRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">سداد آمن عبر الكريمي</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#245BDB]/15 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-[#245BDB] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB] border border-[#DCE4F0]'
            }`}
          >
            <span>طلبات الحجز الواردة</span>
            <span className="w-5 h-5 rounded-full bg-[#1769FF] text-white text-[10px] flex items-center justify-center font-bold">
              {driverBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'trips'
                ? 'bg-[#245BDB] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB] border border-[#DCE4F0]'
            }`}
          >
            رحلاتي المنشورة ({driverTrips.length})
          </button>
        </div>

        <div className="text-xs text-[#7B8494]">
          نسبة عمولة منصة وَصْلَة: <strong className="text-[#245BDB] font-bold">{commissionRate}%</strong>
        </div>
      </div>

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {driverBookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
              <Users className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#202633]">لا توجد طلبات حجز حالياً</p>
              <p className="text-xs text-[#7B8494]">عندما يقوم راكب بطلب مقعد في رحلتك، سيظهر هنا فوراً للموافقة عليه.</p>
            </div>
          ) : (
            driverBookings.map((bk) => {
              const trip = trips.find((t) => t.id === bk.tripId);
              const canPayCommission = bk.status === 'accepted_unpaid_commission';
              const isChatActive = bk.status === 'confirmed' || bk.status === 'commission_pending_verification';

              return (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#1769FF] transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#245BDB] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#245BDB]/30 font-bold">
                        طلب #{bk.id}
                      </span>
                      {bk.status === 'pending_driver' && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          بانتظار قبولك
                        </span>
                      )}
                      {bk.status === 'accepted_unpaid_commission' && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#1769FF] border border-[#1769FF]/40 flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          مقبول - يرجى دفع العمولة (20%)
                        </span>
                      )}
                      {bk.status === 'commission_pending_verification' && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          إشعار العمولة قيد المراجعة
                        </span>
                      )}
                      {bk.status === 'confirmed' && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          حجز مؤكد ومفعل ✓
                        </span>
                      )}
                    </div>

                    <div className="text-base font-bold text-[#202633]">
                      الراكب: <strong className="text-[#245BDB]">{bk.passengerName}</strong> · هاتف: {bk.passengerPhone}
                    </div>

                    {trip && (
                      <div className="text-xs text-[#7B8494]">
                        مسار الرحلة: {trip.fromCity} ({trip.fromArea}) ← {trip.toCity} ({trip.toArea}) · {trip.date} ({trip.departureTime})
                      </div>
                    )}

                    {/* Financial Breakdown Table */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#7B8494] font-bold">إجمالي الأجرة ({bk.seatsCount} مقاعد)</span>
                        <div className="font-black text-[#202633] font-mono text-sm">
                          {bk.totalAmount.toLocaleString()} ريال
                        </div>
                      </div>
                      <div className="space-y-0.5 border-x border-[#DCE4F0]">
                        <span className="text-[10px] text-[#245BDB] font-bold">عمولة وَصْلَة (20%)</span>
                        <div className="font-black text-[#245BDB] font-mono text-sm">
                          {bk.commissionAmount.toLocaleString()} ريال
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-700 font-bold">صافي دخل السائق</span>
                        <div className="font-black text-emerald-700 font-mono text-sm">
                          {(bk.totalAmount - bk.commissionAmount).toLocaleString()} ريال
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Actions per Booking Status */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Stage 1: Accept / Reject */}
                    {bk.status === 'pending_driver' && (
                      <>
                        <button
                          onClick={() => onAcceptBooking(bk.id)}
                          className="px-4 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>قبول الراكب</span>
                        </button>
                        <button
                          onClick={() => onRejectBooking(bk.id)}
                          className="px-4 py-2.5 rounded-xl bg-[#F5F7FB] hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>رفض</span>
                        </button>
                      </>
                    )}

                    {/* Stage 2: Pay 20% Commission to Farza */}
                    {canPayCommission && (
                      <button
                        onClick={() => setPayingBooking(bk)}
                        className="px-4 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#245BDB]/25 transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>دفع العمولة (20%) وإرفاق الإشعار</span>
                      </button>
                    )}

                    {/* If confirmed or under review, Chat is unlocked */}
                    {isChatActive && (
                      <button
                        onClick={() => onOpenChat(bk.id)}
                        className="px-4 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>فتح المحادثة مع الراكب</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT: TRIPS */}
      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {driverTrips.map((trip) => (
            <div
              key={trip.id}
              className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#1769FF] transition-all shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#245BDB] bg-[#EAF2FF] px-3 py-1 rounded-full border border-[#245BDB]/30">
                  رحلة نشطة
                </span>
                <span className="text-xs text-[#7B8494]">{trip.date}</span>
              </div>

              <div className="text-base font-black text-[#202633]">
                {trip.fromCity} ({trip.fromArea}) ← {trip.toCity} ({trip.toArea})
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs">
                <div>
                  <div className="text-[#7B8494]">المقاعد الشاغرة</div>
                  <div className="text-sm font-bold text-[#202633] mt-0.5">
                    <span className="text-[#245BDB]">{trip.availableSeats}</span> / {trip.totalSeats}
                  </div>
                </div>
                <div>
                  <div className="text-[#7B8494]">سعر المقعد</div>
                  <div className="text-sm font-bold text-[#202633] mt-0.5">
                    {trip.pricePerSeat.toLocaleString()} ريال
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#7B8494] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#245BDB]" />
                الانطلاق: <strong className="text-[#202633]">{trip.departureTime}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMMISSION PAYMENT WORKFLOW MODAL */}
      <AnimatePresence>
        {payingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 sm:p-8 space-y-6 shadow-2xl text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setPayingBooking(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors shadow-2xs group"
                    title="رجوع"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>رجوع</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#245BDB]" />
                    <h3 className="text-lg font-black text-[#202633]">دفع عمولة منصة وَصْلَة (20%)</h3>
                  </div>
                </div>
                <button
                  onClick={() => setPayingBooking(null)}
                  className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
                >
                  ✕
                </button>
              </div>

              {receiptSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#EAF2FF] border border-[#245BDB] text-[#245BDB] flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-[#202633]">تم إرسال إشعار الدفع بنجاح!</h4>
                  <p className="text-xs text-[#7B8494]">
                    يتم مراجعة إيصال التحويل الآن من قِبل إدارة وَصْلَة. فور التحقق سيتم تفعيل التواصل المباشر مع الراكب فوراً.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCommissionSubmit} className="space-y-4">
                  {/* Amount Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-2 text-xs">
                    <div className="flex justify-between text-[#7B8494]">
                      <span>قيمة الحجز ({payingBooking.seatsCount} مقعد):</span>
                      <span className="text-[#202633] font-bold">{payingBooking.totalAmount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between text-[#202633] font-bold text-sm pt-1 border-t border-[#DCE4F0]">
                      <span className="text-[#245BDB]">المبلغ المطلوب دفعه لوَصْلَة (20%):</span>
                      <span className="text-[#245BDB] text-base font-black">
                        {payingBooking.commissionAmount.toLocaleString()} ريال يمني
                      </span>
                    </div>
                  </div>

                  {/* Yemen Official Bank Accounts */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">بيانات التحويل البنكي المعتمد</label>
                    <div className="p-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#7B8494]">بنك الكريمي (حساب تجاري):</span>
                        <span className="font-mono text-[#245BDB] font-bold">120488219</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7B8494]">كاك بنك (CAC Bank):</span>
                        <span className="font-mono text-[#202633] font-bold">50491823</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7B8494]">اسم المستفيد:</span>
                        <span className="text-[#202633] font-bold">شركة وَصْلَة للنقل الرقمي</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Used */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">البنك المُحوّل منه</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                    >
                      <option value="بنك الكريمي للتمويل الأصغر">بنك الكريمي للتمويل الأصغر</option>
                      <option value="كاك بنك (CAC Bank)">كاك بنك (CAC Bank)</option>
                      <option value="بنك اليمن والكويت (YKB)">بنك اليمن والكويت (YKB)</option>
                      <option value="حوالة شبكة النجم / الامتياز">حوالة عبر شبكة النجم / الامتياز</option>
                    </select>
                  </div>

                  {/* Reference Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">رقم العملية / المرجع</label>
                    <input
                      type="text"
                      required
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="أدخل رقم الإيصال البنكي"
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-bold outline-none text-left focus:border-[#1769FF]"
                    />
                  </div>

                  {/* Receipt Preview */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633] flex items-center justify-between">
                      <span>صورة إيصال التحويل</span>
                      <span className="text-[10px] text-[#245BDB]">تم إرفاق إيصال افتراضي تجريبي</span>
                    </label>
                    <div className="h-24 w-full rounded-xl overflow-hidden border border-[#DCE4F0] bg-slate-900 relative">
                      <img
                        src={uploadedReceipt}
                        alt="Receipt"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white gap-1.5">
                        <Upload className="w-4 h-4 text-[#245BDB]" />
                        <span>إيصال التحويل جاهز للمراجعة</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    * ملاحظة أمنية: لا يتم اعتبار الدفع ناجحاً إلا بعد تحقق إدارة وَصْلَة وتأكيد المبلغ في الحساب البنكي.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#245BDB]/25 transition-all"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>إرسال طلب التحقق من الدفع</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayingBooking(null)}
                      className="h-12 px-5 rounded-xl bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] text-xs font-semibold cursor-pointer border border-[#DCE4F0]"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE TRIP MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors shadow-2xs group"
                    title="رجوع"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>رجوع</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#245BDB]" />
                    <h3 className="text-lg font-black text-[#202633]">نشر رحلة جديدة للسائق</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">مدينة الانطلاق</label>
                    <select
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#1769FF]"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.nameAr || (c as any).name}>
                          {c.nameAr || (c as any).name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">منطقة الانطلاق</label>
                    <input
                      type="text"
                      required
                      value={fromArea}
                      onChange={(e) => setFromArea(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">مدينة الوصول</label>
                    <select
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#1769FF]"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.nameAr || (c as any).name}>
                          {c.nameAr || (c as any).name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">منطقة الوصول</label>
                    <input
                      type="text"
                      required
                      value={toArea}
                      onChange={(e) => setToArea(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">تاريخ الانطلاق</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">وقت الانطلاق</label>
                    <input
                      type="text"
                      required
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      placeholder="06:30 صباحاً"
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">عدد المقاعد المتاحة</label>
                    <select
                      value={totalSeats}
                      onChange={(e) => setTotalSeats(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#1769FF]"
                    >
                      <option value={3}>3 مقاعد</option>
                      <option value={4}>4 مقاعد</option>
                      <option value={5}>5 مقاعد (هايلكس قياسي)</option>
                      <option value={6}>6 مقاعد</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">سعر المقعد (ريال يمني)</label>
                    <input
                      type="number"
                      required
                      step="500"
                      value={pricePerSeat}
                      onChange={(e) => setPricePerSeat(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-bold outline-none focus:border-[#1769FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202633]">ملاحظات وشروط الرحلة</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: شنط متوسطة، التزام بالموعد، مكيفة..."
                    className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                  />
                </div>

                {/* VEHICLE PHOTO UPLOAD FIELD */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#245BDB]" />
                      <span>صورة سيارة الهايلكس للرحلة</span>
                    </label>
                    <label
                      htmlFor="driver-trip-vehicle-input"
                      className="text-xs font-bold text-[#245BDB] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>تحميل صورة من جهازك</span>
                    </label>
                    <input
                      id="driver-trip-vehicle-input"
                      type="file"
                      accept="image/*"
                      onChange={handleVehiclePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#245BDB]/30 bg-slate-900 shrink-0 relative shadow-xs">
                      <img
                        src={vehiclePhoto}
                        alt="Vehicle preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="text-[11px] text-[#7B8494]">اختر أو ارفع صورة تظهر للركاب عند استعراض الرحلة:</div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setVehiclePhoto('https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&fit=crop')}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                            vehiclePhoto.includes('1559416523')
                              ? 'bg-[#245BDB] text-white border-[#245BDB]'
                              : 'bg-white text-[#202633] border-[#DCE4F0] hover:bg-[#EAF2FF]'
                          }`}
                        >
                          هايلكس بيضاء
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehiclePhoto('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&fit=crop')}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                            vehiclePhoto.includes('1533473359')
                              ? 'bg-[#245BDB] text-white border-[#245BDB]'
                              : 'bg-white text-[#202633] border-[#DCE4F0] hover:bg-[#EAF2FF]'
                          }`}
                        >
                          هايلكس سوداء
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#245BDB]/25 transition-all"
                  >
                    <span>نشر الرحلة للركاب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="h-12 px-5 rounded-xl bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] text-xs font-semibold cursor-pointer border border-[#DCE4F0]"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
