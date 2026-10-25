import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, Booking, City, Driver, Review } from '../types';
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
  Minus,
  X,
  Navigation,
  Briefcase,
  Package,
  HeartHandshake,
  Star,
  MessageCircle,
} from 'lucide-react';

interface DriverViewProps {
  driver: Driver;
  trips: Trip[];
  bookings: Booking[];
  cities: City[];
  reviews?: Review[];
  commissionRate: number;
  onCreateTrip: (newTrip: Partial<Trip>) => void;
  onAcceptBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onSubmitCommissionReceipt: (bookingId: string, bank: string, refNumber: string, receiptPhoto: string) => void;
  onOpenChat: (bookingId: string) => void;
  onOpenSettings?: () => void;
  onBackToHome?: () => void;
  onUpdateTripSeats?: (tripId: string, newAvailableSeats: number) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  driver,
  trips,
  bookings,
  cities,
  reviews = [],
  commissionRate = 20,
  onCreateTrip,
  onAcceptBooking,
  onRejectBooking,
  onSubmitCommissionReceipt,
  onOpenChat,
  onOpenSettings,
  onBackToHome,
  onUpdateTripSeats,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'bookings' | 'commissions' | 'reviews'>('bookings');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Trip State
  const [fromCity, setFromCity] = useState<string>('صنعاء');
  const [fromArea, setFromArea] = useState<string>('حدة - جولة الرويشان');
  const [toCity, setToCity] = useState<string>('عدن');
  const [toArea, setToArea] = useState<string>('المنصورة - جولة كالتكس');
  const [intermediateStops, setIntermediateStops] = useState<string[]>(['ذمار (جولة رداع)', 'إب (المعاين)']);
  const [newStopInput, setNewStopInput] = useState<string>('');
  const [date, setDate] = useState<string>('2026-10-21');
  const [departureTime, setDepartureTime] = useState<string>('06:00 صباحاً');
  const [totalSeats, setTotalSeats] = useState<number>(5);
  const [pricePerSeat, setPricePerSeat] = useState<number>(12000);
  const [charterPrice, setCharterPrice] = useState<number>(50000);
  const [isFamilyFriendly, setIsFamilyFriendly] = useState<boolean>(true);
  const [allowCargo, setAllowCargo] = useState<boolean>(true);
  const [cargoMinPrice, setCargoMinPrice] = useState<number>(3000);
  const [maxLuggagePieces, setMaxLuggagePieces] = useState<number>(8);
  const [notes, setNotes] = useState<string>('هايلكس حديثة ومكيفة، مقاعد مريحة وحوض مؤمّن للأمتعة والطرود.');
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
  const driverReviews = reviews.filter((r) => r.driverId === driver.id);

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
      intermediateStops,
      date,
      departureTime,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      charterPrice,
      isFamilyFriendly,
      allowCargo,
      cargoMinPrice,
      maxLuggagePieces,
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

  // WhatsApp Contact to Passenger
  const handleWhatsAppPassenger = (bk: Booking) => {
    const cleanPhone = bk.passengerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('967') ? cleanPhone : `967${cleanPhone}`;
    const text = `السلام عليكم أخي ${bk.passengerName}، حياك الله معك كابتن ${driver.name} بخصوص حجزك #${bk.id} في منصة وَصْلَة.`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* DRIVER PROFILE HEADER CARD (Soft Gray & Royal Blue Accents) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0056B3] shadow-xs"
            />
            {driver.verifiedBadge && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0056B3] text-white flex items-center justify-center font-black text-xs shadow-md">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#202633]">{driver.name}</h2>
              <span className="text-xs font-bold text-[#0056B3] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#0056B3]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                سائق موثّق ✓
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {driver.rating.toFixed(1)} ({driverReviews.length || 3} تقييمات)
              </span>
            </div>
            <div className="text-xs text-[#7B8494] mt-1 flex flex-wrap items-center gap-3">
              <span>الهاتف: <strong className="text-[#202633] font-mono">{driver.phone}</strong></span>
              <span>·</span>
              <span>السيارة المعتمدة: <strong className="text-[#0056B3]">{driver.vehicle.model} ({driver.vehicle.color})</strong></span>
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
              className="px-4 py-3 rounded-2xl bg-white hover:bg-[#EAF2FF] text-[#0056B3] border border-[#0056B3]/25 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              title="إعدادات السائق مثل واتساب"
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات السائق</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#0056B3]/20 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>نشر رحلة جديدة</span>
          </button>
        </div>
      </div>

      {/* 4-METRIC STAT GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Active Trips */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-1 shadow-xs hover:border-[#0056B3]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>الرحلات المنشورة</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#0056B3] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202633] tabular-nums font-mono">
            {driverTrips.length}
          </div>
          <div className="text-[11px] text-[#0056B3] font-semibold">رحلات معلنة نشطة</div>
        </div>

        {/* 2. Total Bookings */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-1 shadow-xs hover:border-[#0056B3]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>طلبات الركاب والطرود</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#0056B3] flex items-center justify-center">
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
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-1 shadow-xs hover:border-[#0056B3]/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7B8494] font-bold">
            <span>الإيراد المتوقع</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#0056B3] flex items-center justify-center">
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
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-1 shadow-xs hover:border-[#0056B3]/30 transition-colors">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0056B3]/15 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-[#0056B3] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB] border border-[#DCE4F0]'
            }`}
          >
            <span>طلبات الحجز والطرود</span>
            <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white text-[10px] flex items-center justify-center font-bold">
              {driverBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'trips'
                ? 'bg-[#0056B3] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB] border border-[#DCE4F0]'
            }`}
          >
            رحلاتي المنشورة ({driverTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-[#0056B3] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633] bg-[#F5F7FB] border border-[#DCE4F0]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>تقييمات الركاب ({driverReviews.length || 3})</span>
          </button>
        </div>

        <div className="text-xs text-[#7B8494]">
          نسبة عمولة منصة وَصْلَة: <strong className="text-[#0056B3] font-bold">{commissionRate}%</strong>
        </div>
      </div>

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {driverBookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-3">
              <Users className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#202633]">لا توجد طلبات حجز حالياً</p>
              <p className="text-xs text-[#7B8494]">عندما يقوم راكب بطلب مقعد أو طرد في رحلتك، سيظهر هنا فوراً للموافقة عليه.</p>
            </div>
          ) : (
            driverBookings.map((bk) => {
              const trip = trips.find((t) => t.id === bk.tripId);
              const canPayCommission = bk.status === 'accepted_unpaid_commission';
              const isChatActive = bk.status === 'confirmed' || bk.status === 'commission_pending_verification';

              return (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#007AFF] transition-all shadow-sm space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DCE4F0] pb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono text-[#0056B3] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#0056B3]/30 font-bold">
                          طلب #{bk.id}
                        </span>
                        {bk.bookingType === 'cargo' && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            شحنة طرد WASLA Express
                          </span>
                        )}
                        {bk.isFullVehicleCharter && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1">
                            <HeartHandshake className="w-3 h-3" />
                            حجز كامل للسيارة
                          </span>
                        )}
                        {bk.status === 'pending_driver' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            بانتظار قبولك
                          </span>
                        )}
                        {bk.status === 'accepted_unpaid_commission' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#007AFF] border border-[#007AFF]/40 flex items-center gap-1">
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
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#0056B3] border border-[#0056B3]/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            حجز مؤكد ومفعل ✓
                          </span>
                        )}
                      </div>

                      <div className="text-base font-bold text-[#202633]">
                        العميل: <strong className="text-[#0056B3]">{bk.passengerName}</strong> · هاتف: {bk.passengerPhone}
                      </div>

                      {trip && (
                        <div className="text-xs text-[#7B8494]">
                          مسار الرحلة: {trip.fromCity} ({bk.pickupPoint || trip.fromArea}) ← {trip.toCity} ({bk.dropoffPoint || trip.toArea}) · {trip.date} ({trip.departureTime})
                        </div>
                      )}
                    </div>

                    {/* Financial Breakdown Table */}
                    <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/15 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#7B8494] font-bold">
                          {bk.bookingType === 'cargo' ? 'أجرة الشحنة' : `الأجرة (${bk.seatsCount} مقاعد)`}
                        </span>
                        <div className="font-black text-[#202633] font-mono text-sm">
                          {bk.totalAmount.toLocaleString()} ريال
                        </div>
                      </div>
                      <div className="space-y-0.5 border-x border-[#DCE4F0]">
                        <span className="text-[10px] text-[#0056B3] font-bold">عمولة المنصة ({commissionRate}%)</span>
                        <div className="font-black text-[#0056B3] font-mono text-sm">
                          {bk.commissionAmount.toLocaleString()} ريال
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-700 font-bold">صافي دخل السائق</span>
                        <div className="font-black text-emerald-600 font-mono text-sm">
                          {(bk.totalAmount - bk.commissionAmount).toLocaleString()} ريال
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARGO & LUGGAGE INFO ON BOOKING CARD */}
                  {bk.cargoDetails && (
                    <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-700" />
                        <span>بيانات الطرد في حوض الهايلكس: {bk.cargoDetails.packageType} ({bk.cargoDetails.description})</span>
                      </div>
                      <div className="text-emerald-800 text-[11px] flex flex-wrap gap-4">
                        <span>مستلم الطرد: <strong>{bk.cargoDetails.receiverName}</strong></span>
                        <span>هاتف المستلم: <strong>{bk.cargoDetails.receiverPhone}</strong></span>
                        <span>الوزن: <strong>{bk.cargoDetails.weightKg || 5} كجم</strong></span>
                      </div>
                    </div>
                  )}

                  {bk.luggage && (
                    <div className="p-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs flex items-center gap-4 text-[#7B8494]">
                      <span className="font-bold text-[#202633] flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#0056B3]" />
                        <span>حمولة الأمتعة للراكب:</span>
                      </span>
                      <span>{bk.luggage.largeBags} حقائب كبيرة بالحوض</span>
                      <span>·</span>
                      <span>{bk.luggage.heavyBoxes} كراتين</span>
                      <span>·</span>
                      <span>{bk.luggage.smallBags} حقيبة كابينة</span>
                    </div>
                  )}

                  {/* Actions: Accept, Reject, Pay Commission, WhatsApp, Chat */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppPassenger(bk)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        title="مراسلة الراكب عبر واتساب"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>واتساب الراكب</span>
                      </button>

                      {isChatActive && (
                        <button
                          onClick={() => onOpenChat(bk.id)}
                          className="px-4 py-2 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>فتح المحادثة الفورية</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {bk.status === 'pending_driver' && (
                        <>
                          <button
                            onClick={() => onAcceptBooking(bk.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>قبول الطلب</span>
                          </button>
                          <button
                            onClick={() => onRejectBooking(bk.id)}
                            className="px-3 py-2 rounded-xl bg-[#F5F7FB] text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>اعتذار</span>
                          </button>
                        </>
                      )}

                      {canPayCommission && (
                        <button
                          onClick={() => setPayingBooking(bk)}
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-[#0056B3] to-[#007AFF] text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>دفع العمولة وتفعيل التواصل ({bk.commissionAmount.toLocaleString()} ريال)</span>
                        </button>
                      )}
                    </div>
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
          {driverTrips.map((trip) => {
            const bookedCount = trip.totalSeats - trip.availableSeats;
            const tripBookings = driverBookings.filter((b) => b.tripId === trip.id);
            const totalLargeLuggage = tripBookings.reduce(
              (acc, b) => acc + (b.luggage?.largeBags || 0) + (b.luggage?.heavyBoxes || 0),
              0
            );

            return (
              <div
                key={trip.id}
                className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#007AFF] transition-all shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0056B3]" />
                    <h3 className="text-base font-black text-[#202633]">
                      {trip.fromCity} ← {trip.toCity}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#0056B3] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#0056B3]/30 font-bold">
                    #{trip.id}
                  </span>
                </div>

                <div className="text-xs text-[#7B8494] space-y-1">
                  <div>نقطة الانطلاق: <strong className="text-[#202633]">{trip.fromArea}</strong></div>
                  <div>نقطة الوصول: <strong className="text-[#202633]">{trip.toArea}</strong></div>
                  {trip.intermediateStops && trip.intermediateStops.length > 0 && (
                    <div className="text-[11px] text-[#0056B3] font-semibold">
                      المحطات الوسيطة: {trip.intermediateStops.join(' ← ')}
                    </div>
                  )}
                </div>

                {/* HILUX BED CAPACITY & CARGO SUMMARY */}
                <div className="p-3 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202633] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0056B3]" />
                      <span>حالة حوض الهايلكس والأمتعة:</span>
                    </span>
                    <span className="font-mono font-bold text-[#0056B3]">
                      {totalLargeLuggage} / {trip.maxLuggagePieces || 8} أمتعة مشحونة
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCE4F0] overflow-hidden">
                    <div
                      className="h-full bg-[#0056B3] rounded-full"
                      style={{
                        width: `${Math.min(100, (totalLargeLuggage / (trip.maxLuggagePieces || 8)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* DYNAMIC SEATS STEPPER CONTROLLER */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#0056B3]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#202633] block">
                        تعديل المقاعد الشاغرة ديناميكياً:
                      </span>
                      <span className="text-[10px] text-[#7B8494]">
                        إجمالي سعة السيارة: {trip.totalSeats} مقاعد
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#F5F7FB] p-1 rounded-xl border border-[#DCE4F0]">
                      <button
                        type="button"
                        onClick={() => onUpdateTripSeats && onUpdateTripSeats(trip.id, Math.max(0, trip.availableSeats - 1))}
                        disabled={trip.availableSeats <= 0}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-rose-50 text-rose-600 disabled:opacity-30 flex items-center justify-center font-black cursor-pointer shadow-2xs"
                        title="إنقاص مقعد شاغر"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-7 text-center font-mono font-black text-sm text-[#0056B3]">
                        {trip.availableSeats}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateTripSeats && onUpdateTripSeats(trip.id, Math.min(trip.totalSeats, trip.availableSeats + 1))}
                        disabled={trip.availableSeats >= trip.totalSeats}
                        className="w-8 h-8 rounded-lg bg-[#0056B3] hover:bg-[#007AFF] text-white disabled:opacity-30 flex items-center justify-center font-black cursor-pointer shadow-2xs"
                        title="زيادة مقعد شاغر"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs">
                  <div>
                    <div className="text-[#7B8494]">سعر المقعد</div>
                    <div className="text-sm font-bold text-[#202633] mt-0.5 font-mono">
                      {trip.pricePerSeat.toLocaleString()} ريال
                    </div>
                  </div>
                  <div>
                    <div className="text-[#7B8494]">موعد الانطلاق</div>
                    <div className="text-sm font-bold text-[#0056B3] mt-0.5 font-mono">
                      {trip.date} ({trip.departureTime})
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: PASSENGER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-500 shadow-xs">
                <Star className="w-8 h-8 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#202633]">تقييمات ركاب منصة وَصْلَة</h3>
                <p className="text-xs text-[#7B8494] mt-0.5">
                  متوسط تقييمك العام: <strong className="text-amber-600 font-bold">{driver.rating.toFixed(1)} من 5 نجوم</strong>
                </p>
              </div>
            </div>
            <div className="text-left bg-white px-4 py-2.5 rounded-2xl border border-[#DCE4F0]">
              <span className="text-xs text-[#7B8494] block">نسبة الالتزام بالخدمة</span>
              <span className="text-base font-black text-emerald-600 font-mono">99.2% موثق</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-[#DCE4F0] space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#202633]">{rev.passengerName}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#555] leading-relaxed">"{rev.comment}"</p>
                <span className="text-[10px] text-[#7B8494] block text-left">
                  {new Date(rev.createdAt).toLocaleDateString('ar-YE')}
                </span>
              </div>
            ))}
          </div>
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
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#0056B3]/30 p-6 sm:p-8 space-y-6 shadow-2xl text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#0056B3]/15 pb-4">
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
                    <Receipt className="w-5 h-5 text-[#0056B3]" />
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
                  <div className="w-16 h-16 rounded-full bg-[#EAF2FF] border border-[#0056B3] text-[#0056B3] flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-[#202633]">تم إرسال إشعار الدفع بنجاح!</h4>
                  <p className="text-xs text-[#7B8494]">
                    يتم مراجعة إيصال التحويل الآن من قِبل إدارة وَصْلَة. فور التحقق سيتم تفعيل التواصل المباشر مع الراكب فوراً.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCommissionSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-2 text-xs">
                    <div className="flex justify-between text-[#7B8494]">
                      <span>قيمة الحجز ({payingBooking.seatsCount} مقعد):</span>
                      <span className="text-[#202633] font-bold">{payingBooking.totalAmount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between text-[#202633] font-bold text-sm pt-1 border-t border-[#DCE4F0]">
                      <span className="text-[#0056B3]">المبلغ المطلوب دفعه لوَصْلَة (20%):</span>
                      <span className="text-[#0056B3] text-base font-black">
                        {payingBooking.commissionAmount.toLocaleString()} ريال يمني
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">بيانات التحويل البنكي المعتمد</label>
                    <div className="p-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#7B8494]">بنك الكريمي (حساب تجاري):</span>
                        <span className="font-mono text-[#0056B3] font-bold">120488219</span>
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">البنك المُحوّل منه</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                    >
                      <option value="بنك الكريمي للتمويل الأصغر">بنك الكريمي للتمويل الأصغر</option>
                      <option value="كاك بنك (CAC Bank)">كاك بنك (CAC Bank)</option>
                      <option value="بنك اليمن والكويت (YKB)">بنك اليمن والكويت (YKB)</option>
                      <option value="حوالة شبكة النجم / الامتياز">حوالة عبر شبكة النجم / الامتياز</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#202633]">رقم الحوالة أو السند المرجعي</label>
                    <input
                      type="text"
                      required
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-bold outline-none focus:border-[#007AFF]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0056B3]/25 transition-all"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>إرسال إشعار السداد للمراجعة</span>
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
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#0056B3]/30 p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#0056B3]/15 pb-4">
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
                    <Plus className="w-5 h-5 text-[#0056B3]" />
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
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#007AFF]"
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
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">مدينة الوصول</label>
                    <select
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#007AFF]"
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
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                {/* Intermediate Stops along the Route */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#0056B3]" />
                      <span>المحطات والمدن الوسيطة (اختياري)</span>
                    </label>
                    <span className="text-[10px] text-[#7B8494]">تتيح للركاب النزول أو الصعود في الطريق</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newStopInput}
                      onChange={(e) => setNewStopInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newStopInput.trim() && !intermediateStops.includes(newStopInput.trim())) {
                            setIntermediateStops([...intermediateStops, newStopInput.trim()]);
                            setNewStopInput('');
                          }
                        }
                      }}
                      placeholder="أدخل اسم محطة أو فرزة وسيطة (مثال: ذمار، يريم)..."
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#202633] outline-none focus:border-[#0056B3]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newStopInput.trim() && !intermediateStops.includes(newStopInput.trim())) {
                          setIntermediateStops([...intermediateStops, newStopInput.trim()]);
                          setNewStopInput('');
                        }
                      }}
                      className="h-10 px-3.5 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      + إضافة
                    </button>
                  </div>

                  {intermediateStops.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#DCE4F0]">
                      <span className="text-[10px] font-bold text-[#0056B3]">المحطات المحددة:</span>
                      {intermediateStops.map((stop, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-lg bg-white border border-[#0056B3]/30 text-xs font-bold text-[#202633] flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{stop}</span>
                          <button
                            type="button"
                            onClick={() => setIntermediateStops(intermediateStops.filter((_, idx) => idx !== sIdx))}
                            className="text-rose-500 hover:text-rose-700 font-black cursor-pointer text-xs"
                            title="حذف"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">تاريخ الانطلاق</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
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
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">عدد المقاعد المتاحة</label>
                    <select
                      value={totalSeats}
                      onChange={(e) => setTotalSeats(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold outline-none focus:border-[#007AFF]"
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
                      className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-bold outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                {/* YEMEN SPECIFIC: CARGO & FAMILY CHARTER EXTENSION */}
                <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#202633]">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-purple-700" />
                      <span>حجز السيارة كاملة للعائلات (Charter):</span>
                    </span>
                    <input
                      type="number"
                      step="1000"
                      value={charterPrice}
                      onChange={(e) => setCharterPrice(Number(e.target.value))}
                      className="w-28 h-8 px-2 rounded-lg bg-white border border-[#DCE4F0] text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#202633] pt-2 border-t border-[#DCE4F0]">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-700" />
                      <span>شحن طرود في حوض الهايلكس (WASLA Express):</span>
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowCargo}
                        onChange={(e) => setAllowCargo(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {allowCargo && (
                    <div className="flex items-center justify-between text-xs pt-1 text-[#7B8494]">
                      <span>أقل سعر شحن لطرد:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="500"
                          value={cargoMinPrice}
                          onChange={(e) => setCargoMinPrice(Number(e.target.value))}
                          className="w-24 h-7 px-2 rounded-lg bg-white border border-[#DCE4F0] text-xs font-mono font-bold text-center"
                        />
                        <span>ريال</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202633]">ملاحظات وشروط الرحلة</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: شنط متوسطة، التزام بالموعد، مكيفة..."
                    className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0056B3]/25 transition-all"
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
