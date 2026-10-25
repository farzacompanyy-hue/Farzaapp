import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, Booking, City, Review, SOSAlert, LuggageDetails, CargoDetails } from '../types';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Car,
  Clock,
  ArrowRight,
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  ChevronDown,
  Settings,
  ArrowLeftRight,
  Wind,
  Sparkles,
  Filter,
  Compass,
  Share2,
  Navigation,
  Check,
  Package,
  AlertTriangle,
  PhoneCall,
  Briefcase,
  HeartHandshake,
  MessageCircle,
  Send,
  Eye,
  WifiOff,
} from 'lucide-react';

export const POPULAR_ASSEMBLY_POINTS: Record<string, string[]> = {
  'صنعاء': [
    'فرزة باب اليمن - جولة خولان',
    'فرزة عصر - شارع الستين',
    'جولة الرويشان - حدة',
    'فرزة الحثيلي - دار سلم',
    'فرزة عمران - الجراف',
    'مذبح - جولة شيراتون',
  ],
  'عدن': [
    'فرزة الشيخ عثمان - جولة السفينة',
    'المنصورة - جولة كالتكس',
    'خور مكسر - جولة المطار',
    'المعلا - الشارع الرئيسي',
    'إنماء - بوابة الجامعة',
  ],
  'تعز': [
    'فرزة الحوبان - جولة الذكرى',
    'شارع جمال - أمام فندق السعيد',
    'بير باشا - فرزة النشمة',
    'المسبح - ديلوكس',
    'الضباب - المفرق',
  ],
  'إب': [
    'فرزة المعاين - الدائري الغربي',
    'فرزة يريم',
    'فرزة القاعدة',
    'مفرق جبلة',
  ],
  'ذمار': [
    'جولة رداع - فرزة الجنوب',
    'معبر - الخط العام',
    'شارع صنعاء - الفرزة الرئيسية',
  ],
  'المكلا': [
    'فرزة الديس',
    'فرزة فوه',
    'الرواد - الخط الساحلي',
  ],
  'مأرب': [
    'المجمع الرئيسي',
    'فرزة شارع صنعاء',
  ],
  'الحديدة': [
    'فرزة باجل',
    'شارع صنعاء - كيلو 7',
  ],
};

interface PassengerViewProps {
  trips: Trip[];
  bookings: Booking[];
  cities: City[];
  reviews?: Review[];
  onBookTrip: (
    tripId: string,
    seatsCount: number,
    name: string,
    phone: string,
    pickupPoint?: string,
    dropoffPoint?: string,
    seatNumbers?: number[],
    bookingType?: 'seats' | 'cargo' | 'charter',
    luggage?: LuggageDetails,
    cargoDetails?: CargoDetails,
    isFullVehicleCharter?: boolean
  ) => void;
  onOpenChat: (bookingId: string) => void;
  onRateDriver: (bookingId: string, rating: number, comment?: string) => void;
  onTriggerSOS?: (alert: Omit<SOSAlert, 'id' | 'createdAt' | 'status'>) => void;
  onOpenSettings?: () => void;
  initialTab?: 'search' | 'my_bookings';
  onBackToHome?: () => void;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  trips,
  bookings,
  cities,
  reviews = [],
  onBookTrip,
  onOpenChat,
  onRateDriver,
  onTriggerSOS,
  onOpenSettings,
  initialTab,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'my_bookings'>(initialTab || 'search');

  // Search mode: Seats vs Wasla Express Cargo
  const [serviceType, setServiceType] = useState<'seats' | 'cargo'>('seats');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Offline Booking Cache in LocalStorage
  useEffect(() => {
    try {
      if (bookings && bookings.length > 0) {
        localStorage.setItem('wasla_offline_bookings_cache', JSON.stringify(bookings));
      }
    } catch {
      // ignore
    }
  }, [bookings]);

  const [fromCity, setFromCity] = useState<string>('صنعاء');
  const [toCity, setToCity] = useState<string>('عدن');
  const [pickupAssemblyPoint, setPickupAssemblyPoint] = useState<string>('');
  const [dropoffAssemblyPoint, setDropoffAssemblyPoint] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-18');
  const [requiredSeats, setRequiredSeats] = useState<number>(1);
  const [activeFilterPill, setActiveFilterPill] = useState<'all' | 'today' | 'morning' | 'ac' | 'family' | 'cargo' | 'charter'>('all');

  // Booking modal state
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [passengerName, setPassengerName] = useState<string>('محمد صالح');
  const [passengerPhone, setPassengerPhone] = useState<string>('773456789');
  const [customPickupPoint, setCustomPickupPoint] = useState<string>('');
  const [customDropoffPoint, setCustomDropoffPoint] = useState<string>('');
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([1]);
  const [isFullVehicleCharter, setIsFullVehicleCharter] = useState<boolean>(false);

  // Luggage Tracker State
  const [luggageSmallBags, setLuggageSmallBags] = useState<number>(1); // cabin
  const [luggageLargeBags, setLuggageLargeBags] = useState<number>(1); // hilux bed
  const [luggageHeavyBoxes, setLuggageHeavyBoxes] = useState<number>(0); // hilux bed

  // WASLA Express Cargo Modal State
  const [cargoPackageType, setCargoPackageType] = useState<string>('حقيبة / طرد شخصي');
  const [cargoDescription, setCargoDescription] = useState<string>('أغراض شخصية وملابس مغلفة');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(5);
  const [cargoReceiverName, setCargoReceiverName] = useState<string>('عمر أحمد');
  const [cargoReceiverPhone, setCargoReceiverPhone] = useState<string>('733112233');

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reviews Dialog State
  const [selectedDriverReviews, setSelectedDriverReviews] = useState<{ driverName: string; reviews: Review[] } | null>(null);

  // Post-trip Rating Dialog State
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  // Emergency SOS Modal State
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [sosSentSuccess, setSosSentSuccess] = useState<boolean>(false);

  const handleSwapCities = () => {
    const tempCity = fromCity;
    const tempAssembly = pickupAssemblyPoint;
    setFromCity(toCity);
    setToCity(tempCity);
    setPickupAssemblyPoint(dropoffAssemblyPoint);
    setDropoffAssemblyPoint(tempAssembly);
  };

  // WhatsApp Trip & Safety Sharing
  const handleShareTrip = (trip: Trip, booking?: Booking) => {
    const pickup = booking?.pickupPoint || trip.fromArea || 'الفرزة الرئيسية';
    const dropoff = booking?.dropoffPoint || trip.toArea || 'فرزة الوصول';
    const seatsText = booking
      ? `• رمز الحجز: #${booking.id}\n• المقاعد المحجوزة: ${booking.seatsCount} مقعد`
      : `• المقاعد المتاحة: ${trip.availableSeats} من أصل ${trip.totalSeats} مقاعد`;
    const intermediateText =
      trip.intermediateStops && trip.intermediateStops.length > 0
        ? `\n• المحطات والمدن الوسيطة: ${trip.intermediateStops.join(' ← ')}`
        : '';
    const charterInfo = booking?.isFullVehicleCharter
      ? `\n• نوع الحجز: حجز السيارة كاملة للعائلة (Toyota Hilux Charter VIP)`
      : '';

    const shareText = `🚨 *تفاصيل رحلتي عبر تطبيق وَصْلَة (WASLA) - سلامة السفر* 🚗💨
━━━━━━━━━━━━━━━━━━━━
📍 *خط السير:* من ${trip.fromCity} (${pickup}) إلى ${trip.toCity} (${dropoff})
⏰ *موعد الانطلاق:* ${trip.date} الساعة ${trip.departureTime}
👤 *السائق:* ${trip.driverName} (سائق موثق رسمي ⭐️ ${trip.driverRating.toFixed(1)})
📞 *رقم هاتف السائق:* ${trip.driverPhone}
🚘 *السيارة:* ${trip.vehicleModel} (${trip.vehicleColor})
🔢 *رقم لوحة السيارة:* ${trip.vehiclePlate}
${seatsText}${charterInfo}${intermediateText}
━━━━━━━━━━━━━━━━━━━━
🛡 *خدمة العملاء وطوارئ المنصة:* 739992781
📱 حجز مقاعد مؤكد عبر منصة وَصْلَة للنقل بين المدن اليمنية.`;

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any).share({
        title: `تفاصيل رحلة وَصْلَة: ${trip.fromCity} - ${trip.toCity}`,
        text: shareText,
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }

    setToastMessage('تم تجهيز تفاصيل الرحلة وفتح واتساب للمشاركة!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // SMS Offline Sharing (Direct GSM SMS without 3G/4G Data)
  const handleShareViaSMS = (trip: Trip, booking: Booking) => {
    const pickup = booking.pickupPoint || trip.fromArea || 'الفرزة';
    const dropoff = booking.dropoffPoint || trip.toArea || 'المقصد';
    const smsBody = `حجز وَصْلَة #${booking.id}
من: ${trip.fromCity} (${pickup})
إلى: ${trip.toCity} (${dropoff})
السائق: ${trip.driverName}
هاتف السائق: ${trip.driverPhone}
السيارة: ${trip.vehicleModel} (${trip.vehiclePlate})
الموعد: ${trip.date} ${trip.departureTime}
المقاعد: ${booking.seatsCount} مقعد
طوارئ المنصة: 739992781`;

    const smsUrl = `sms:?body=${encodeURIComponent(smsBody)}`;
    window.location.href = smsUrl;
    setToastMessage('تم فتح تطبيق الرسائل النصية SMS للمشاركة بدون إنترنت');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // One-Tap Driver WhatsApp Contact with Location Pin
  const handleWhatsAppDriverLocation = (trip: Trip, booking: Booking) => {
    const cleanPhone = trip.driverPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('967') ? cleanPhone : `967${cleanPhone}`;
    const pickup = booking.pickupPoint || trip.fromArea || 'مكان التجمع المتفق عليه';
    const text = `السلام عليكم كابتن ${trip.driverName}، أنا الراكب (${booking.passengerName}) حجز #${booking.id} لرحلة ${trip.fromCity} إلى ${trip.toCity}.\nأنا موجود حالياً في (${pickup})، وهذا موقعي المباشر للتنسيق معك:`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Filter trips based on search, assembly points and interactive pills
  const filteredTrips = trips.filter((trip) => {
    const matchFrom = !fromCity || trip.fromCity === fromCity;
    const matchTo = !toCity || trip.toCity === toCity;
    const matchSeats = serviceType === 'cargo' ? true : trip.availableSeats >= requiredSeats;
    const matchPickup = !pickupAssemblyPoint || trip.fromArea.toLowerCase().includes(pickupAssemblyPoint.toLowerCase());
    const matchDropoff = !dropoffAssemblyPoint || trip.toArea.toLowerCase().includes(dropoffAssemblyPoint.toLowerCase());

    let matchPill = true;
    if (activeFilterPill === 'today') {
      matchPill = trip.date === selectedDate || trip.date.includes('2026-10-18') || trip.date.includes('2026-10-21');
    } else if (activeFilterPill === 'morning') {
      matchPill = trip.departureTime.includes('ص') || trip.departureTime.includes('صباحاً');
    } else if (activeFilterPill === 'ac') {
      matchPill = true;
    } else if (activeFilterPill === 'family') {
      matchPill = trip.isFamilyFriendly === true || trip.availableSeats >= 3;
    } else if (activeFilterPill === 'cargo') {
      matchPill = trip.allowCargo === true;
    } else if (activeFilterPill === 'charter') {
      matchPill = (trip.charterPrice ?? 0) > 0 || trip.availableSeats >= 4;
    }

    const matchCargoService = serviceType === 'cargo' ? trip.allowCargo === true : true;

    return matchFrom && matchTo && matchSeats && matchPickup && matchDropoff && matchPill && matchCargoService && trip.status === 'published';
  });

  const handleStartBooking = (trip: Trip, asCharter: boolean = false) => {
    setBookingTrip(trip);
    setIsFullVehicleCharter(asCharter);
    setCustomPickupPoint(pickupAssemblyPoint || trip.fromArea || 'فرزة باب اليمن - جولة خولان');
    setCustomDropoffPoint(dropoffAssemblyPoint || trip.toArea || 'فرزة الشيخ عثمان - جولة السفينة');
    if (asCharter) {
      setSelectedSeatNumbers([1, 2, 3, 4, 5].slice(0, trip.totalSeats));
    } else {
      setSelectedSeatNumbers([1]); // default front VIP seat
    }
    setLuggageSmallBags(1);
    setLuggageLargeBags(1);
    setLuggageHeavyBoxes(0);
    setBookingSuccess(false);
  };

  const handleToggleSeat = (seatNum: number) => {
    if (!bookingTrip || isFullVehicleCharter) return;
    if (selectedSeatNumbers.includes(seatNum)) {
      if (selectedSeatNumbers.length > 1) {
        setSelectedSeatNumbers(selectedSeatNumbers.filter((s) => s !== seatNum));
      }
    } else {
      if (selectedSeatNumbers.length < bookingTrip.availableSeats) {
        setSelectedSeatNumbers([...selectedSeatNumbers, seatNum].sort());
      }
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTrip) return;

    const bType = serviceType === 'cargo' ? 'cargo' : isFullVehicleCharter ? 'charter' : 'seats';
    const seatsToBook = isFullVehicleCharter ? bookingTrip.availableSeats : selectedSeatNumbers.length;
    const seatList = isFullVehicleCharter ? [1, 2, 3, 4, 5].slice(0, bookingTrip.totalSeats) : selectedSeatNumbers;

    const luggage: LuggageDetails = {
      smallBags: luggageSmallBags,
      largeBags: luggageLargeBags,
      heavyBoxes: luggageHeavyBoxes,
    };

    const cargo: CargoDetails | undefined =
      serviceType === 'cargo'
        ? {
            packageType: cargoPackageType,
            description: cargoDescription,
            weightKg: cargoWeightKg,
            receiverName: cargoReceiverName,
            receiverPhone: cargoReceiverPhone,
            receiverArea: customDropoffPoint,
          }
        : undefined;

    onBookTrip(
      bookingTrip.id,
      seatsToBook,
      passengerName,
      passengerPhone,
      customPickupPoint || bookingTrip.fromArea,
      customDropoffPoint || bookingTrip.toArea,
      seatList,
      bType,
      luggage,
      cargo,
      isFullVehicleCharter
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingTrip(null);
      setBookingSuccess(false);
      setActiveTab('my_bookings');
    }, 1400);
  };

  // Submit Rating Feedback
  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingBooking) return;
    onRateDriver(ratingBooking.id, ratingStars, ratingComment);
    setToastMessage(`شكراً لك! تم تسجيل تقييمك (${ratingStars} نجوم) للسائق بنجاح.`);
    setTimeout(() => setToastMessage(null), 3500);
    setRatingBooking(null);
    setRatingComment('');
  };

  // Trigger Emergency SOS Flow
  const handleOpenSOS = () => {
    setShowSOSModal(true);
    setSosSentSuccess(false);
    setLocationLoading(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        () => {
          // Fallback coords (e.g. Sana'a / Aden Highway)
          setLiveLocation({ lat: 14.823, lng: 44.254 });
          setLocationLoading(false);
        },
        { timeout: 7000 }
      );
    } else {
      setLiveLocation({ lat: 14.823, lng: 44.254 });
      setLocationLoading(false);
    }
  };

  const handleSendSOSDistress = () => {
    const activeBooking = bookings.find((b) => b.status === 'confirmed' || b.status === 'accepted_unpaid_commission');
    const activeTrip = activeBooking ? trips.find((t) => t.id === activeBooking.tripId) : trips[0];

    if (onTriggerSOS) {
      onTriggerSOS({
        userId: 'usr-current',
        userName: passengerName || 'راكب منصة وَصْلَة',
        userPhone: passengerPhone || '773456789',
        userRole: 'passenger',
        tripId: activeTrip?.id,
        bookingId: activeBooking?.id,
        coordinates: liveLocation ? { latitude: liveLocation.lat, longitude: liveLocation.lng } : undefined,
        addressText: `${activeTrip ? `${activeTrip.fromCity} ← ${activeTrip.toCity}` : 'طريق السفر بين المدن'} (تحديد GPS مباشر)`,
        driverName: activeTrip?.driverName,
        vehiclePlate: activeTrip?.vehiclePlate,
      });
    }

    setSosSentSuccess(true);
    setToastMessage('تم إرسال نداء الاستغاثة الفوري لإدارة المنصة وفرق الطوارئ!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* TOP EMERGENCY SOS FLOATING / PROMINENT BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border border-red-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm animate-pulse">
            SOS
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-red-950 flex items-center gap-1.5">
              <span>زر الطوارئ وسلامة المسافرين (Emergency SOS)</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">24/7</span>
            </h4>
            <p className="text-[11px] text-red-800/80 mt-0.5">
              مشاركة إحداثيات موقعك المباشر GPS فوراً مع إدارة المنصة ورقم الطوارئ 739992781.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenSOS}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-red-600/25 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>فتح نداء الطوارئ SOS</span>
        </button>
      </div>

      {/* Top Segmented Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#245BDB]/15 pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#202633] flex items-center gap-2">
            <span>منصة حجز المقاعد والشحن بين المدن</span>
            <span className="text-xs text-white bg-[#0056B3] px-2.5 py-0.5 rounded-full font-bold">
              الراكب
            </span>
          </h2>
          <p className="text-xs text-[#7B8494] mt-1">
            سافر بأمان في سيارات Toyota Hilux وسيارات حديثة ومكيفة مع سائقين موثقين، أو أرسل طرودك عبر WASLA Express.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F7FB] border border-[#245BDB]/20 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#0056B3] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            البحث عن رحلة
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_bookings'
                ? 'bg-[#0056B3] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>حجوزاتي</span>
            {bookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white text-[10px] font-black flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </button>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[#0056B3] bg-white hover:bg-[#EAF2FF] border border-[#0056B3]/25 shadow-xs"
              title="إعدادات الحساب مثل واتساب"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>الإعدادات</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="space-y-8">
          {/* SERVICE TOGGLE: SEATS vs WASLA EXPRESS CARGO */}
          <div className="flex items-center justify-center">
            <div className="bg-[#F5F7FB] p-1.5 rounded-2xl border border-[#DCE4F0] flex items-center gap-1 max-w-md w-full">
              <button
                type="button"
                onClick={() => setServiceType('seats')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceType === 'seats'
                    ? 'bg-[#0056B3] text-white shadow-sm'
                    : 'text-[#7B8494] hover:text-[#202633]'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>حجز مقاعد ركاب</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setServiceType('cargo');
                  setActiveFilterPill('cargo');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceType === 'cargo'
                    ? 'bg-[#0056B3] text-white shadow-sm'
                    : 'text-[#7B8494] hover:text-[#202633]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>شحن طرود (WASLA Express)</span>
              </button>
            </div>
          </div>

          {/* GLASSMORPHISM ROUTE SEARCH & FILTER WIDGET */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#0056B3]/25 shadow-lg space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* 1. Origin City */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0056B3]" />
                  <span>مدينة الانطلاق</span>
                </label>
                <div className="relative">
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-bold focus:border-[#0056B3] outline-none shadow-xs"
                  >
                    <option value="">جميع المحافظات</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.nameAr}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button (Apple Circular Toggle) */}
              <div className="lg:col-span-1 flex items-center justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="w-11 h-11 rounded-2xl bg-[#EAF2FF] hover:bg-[#D7E7FF] text-[#0056B3] flex items-center justify-center border border-[#0056B3]/30 shadow-xs cursor-pointer hover:rotate-180 transition-transform duration-300"
                  title="تبديل مدينة الانطلاق والوصول"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Destination City */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#007AFF]" />
                  <span>مدينة الوصول</span>
                </label>
                <div className="relative">
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-bold focus:border-[#0056B3] outline-none shadow-xs"
                  >
                    <option value="">جميع المحافظات</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.nameAr}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Seats Needed & Date */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#202633] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0056B3]" />
                    <span>التاريخ</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold focus:border-[#0056B3] outline-none shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#202633] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#0056B3]" />
                    <span>المقاعد</span>
                  </label>
                  <select
                    value={requiredSeats}
                    disabled={serviceType === 'cargo'}
                    onChange={(e) => setRequiredSeats(Number(e.target.value))}
                    className="w-full h-12 px-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold focus:border-[#0056B3] outline-none shadow-xs disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'مقعد' : 'مقاعد'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Detailed Pickup and Drop-off Assembly Points (فرزة الانطلاق والتنزيل) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DCE4F0]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#202633] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#0056B3]" />
                    <span>نقطة التجمع / الفرزة في {fromCity || 'المغادرة'}:</span>
                  </span>
                  <span className="text-[10px] text-[#7B8494]">اختياري للفلترة</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="pickup-points-list"
                    value={pickupAssemblyPoint}
                    onChange={(e) => setPickupAssemblyPoint(e.target.value)}
                    placeholder="مثال: فرزة باب اليمن، جولة خولان، عصر..."
                    className="w-full h-11 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#202633] font-medium outline-none focus:border-[#0056B3] shadow-2xs"
                  />
                  <datalist id="pickup-points-list">
                    {(POPULAR_ASSEMBLY_POINTS[fromCity] || []).map((pt) => (
                      <option key={pt} value={pt} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#202633] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span>نقطة الوصول والتنزيل في {toCity || 'الوصول'}:</span>
                  </span>
                  <span className="text-[10px] text-[#7B8494]">اختياري للفلترة</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="dropoff-points-list"
                    value={dropoffAssemblyPoint}
                    onChange={(e) => setDropoffAssemblyPoint(e.target.value)}
                    placeholder="مثال: فرزة الشيخ عثمان، جولة كالتكس..."
                    className="w-full h-11 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#202633] font-medium outline-none focus:border-[#0056B3] shadow-2xs"
                  />
                  <datalist id="dropoff-points-list">
                    {(POPULAR_ASSEMBLY_POINTS[toCity] || []).map((pt) => (
                      <option key={pt} value={pt} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* INTERACTIVE FILTER PILLS (With Family-Friendly & Cargo Filters) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DCE4F0]">
              <span className="text-xs text-[#7B8494] font-bold flex items-center gap-1 ml-1">
                <Filter className="w-3.5 h-3.5 text-[#0056B3]" />
                <span>تصفية سريعة:</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveFilterPill('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilterPill === 'all'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                جميع الرحلات
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('family')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'family'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>عائلي وساتر (خصوصية)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('charter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'charter'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>حجز سيارة كاملة (Charter VIP)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('cargo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'cargo'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>شحن طرود في الحوض</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('morning')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'morning'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>صباحية مبكرة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('ac')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'ac'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>مكيفة بالكامل</span>
              </button>
            </div>
          </div>

          {/* AVAILABLE TRIPS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7B8494]">
              <span>
                {serviceType === 'cargo'
                  ? `رحلات متاح فيها شحن الطرود (${filteredTrips.length} رحلة)`
                  : `الرحلات المتاحة (${filteredTrips.length} رحلة)`}
              </span>
              <span>أسطول سيارات تويوتا هايلكس معتمدة مع حوض مؤمّن</span>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-3">
                <Car className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#202633]">لا توجد رحلات مطابقة لمعايير البحث حالياً</h3>
                <p className="text-xs text-[#7B8494]">
                  جرب تغيير وجهة الوصول أو تاريخ السفر، أو تواصل مع خدمة العملاء لترتيب رحلة خاصة.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrips.map((trip) => {
                  const isAlmostFull = trip.availableSeats <= 2;
                  const bookedSeatsCount = Math.max(0, trip.totalSeats - trip.availableSeats);
                  const occupancyPercent = Math.round((trip.availableSeats / trip.totalSeats) * 100);
                  const driverReviews = reviews.filter((r) => r.driverId === trip.driverId);

                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] hover:bg-[#F9FAFC] border border-[#E2E8F0] hover:border-[#0056B3]/40 transition-all shadow-md hover:shadow-xl space-y-5 flex flex-col justify-between"
                    >
                      {/* 1. VEHICLE PHOTO SHOWCASE WITH FLOATING BADGES */}
                      <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden bg-slate-900 group">
                        <img
                          src={trip.vehiclePhoto}
                          alt={trip.vehicleModel}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                        {/* Top Left/Right Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                          <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-[#0056B3]" />
                            <span>{trip.vehicleModel}</span>
                          </div>
                          {trip.isFamilyFriendly && (
                            <span className="bg-purple-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                              <HeartHandshake className="w-3 h-3" />
                              عائلي وساتر
                            </span>
                          )}
                          {trip.allowCargo && (
                            <span className="bg-emerald-600/90 text-white text-[10px] font-black px-2 py-1 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              شحن طرود
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 left-3 bg-[#0056B3]/90 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                          {trip.vehiclePlate}
                        </div>

                        {/* Driver lockup inside image bottom */}
                        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={trip.driverPhoto}
                              alt={trip.driverName}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 text-sm font-black text-white drop-shadow-sm">
                                <span>{trip.driverName}</span>
                                {trip.isVerified && (
                                  <span className="w-4 h-4 rounded-full bg-[#0056B3] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedDriverReviews({ driverName: trip.driverName, reviews: driverReviews })}
                                className="flex items-center gap-1 text-[11px] text-amber-300 font-bold hover:underline cursor-pointer"
                                title="عرض تقييمات الركاب"
                              >
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{trip.driverRating.toFixed(1)}</span>
                                <span className="text-white/80 text-[10px] mr-1">
                                  ({driverReviews.length || 3} تقييم موثق)
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="text-left bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                            {serviceType === 'cargo' ? (
                              <>
                                <span className="text-[10px] text-emerald-300 block font-bold">طرد / شحنة من</span>
                                <span className="text-base font-black text-amber-300 font-mono">
                                  {(trip.cargoMinPrice || 3000).toLocaleString()}{' '}
                                  <span className="text-[10px] text-white">ريال</span>
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] text-white/80 block">سعر المقعد</span>
                                <span className="text-base font-black text-amber-300 font-mono">
                                  {trip.pricePerSeat.toLocaleString()}{' '}
                                  <span className="text-[10px] text-white">ريال</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. ROUTE PATH INDICATOR */}
                      <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0056B3]" />
                            <span className="text-base font-black text-[#202633]">{trip.fromCity}</span>
                            <span className="text-xs text-[#7B8494]">({trip.fromArea})</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#0056B3] rotate-180" />
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-[#0056B3]">{trip.toCity}</span>
                            <span className="text-xs text-[#7B8494]">({trip.toArea})</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0056B3]" />
                          </div>
                        </div>

                        {/* Timing and Hilux Bed capacity details */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCE4F0] text-xs text-[#7B8494]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#0056B3]" />
                            <span className="font-bold text-[#202633]">{trip.departureTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#0056B3]" />
                            <span>{trip.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <Briefcase className="w-3 h-3 text-emerald-600" />
                            <span>سعة الحوض: {trip.maxLuggagePieces || 8} حقائب</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. VISUAL SEAT MAP & AVAILABILITY PROGRESS BAR */}
                      <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#E2E8F0] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#202633] flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#0056B3]" />
                            <span>كابينة تويوتا هايلكس غمارتين:</span>
                          </span>
                          <span className="text-[#0056B3] font-bold text-xs font-mono">
                            {trip.availableSeats} من أصل {trip.totalSeats} مقاعد متاحة
                          </span>
                        </div>

                        {/* Interactive Visual Mini-Map of 5 Seats */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#DCE4F0] text-[10px]">
                          {/* Front Row (Driver + Passenger 1) */}
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 font-bold border border-gray-200">
                              السائق
                            </span>
                            <span
                              className={`px-2 py-1 rounded-md font-bold border ${
                                trip.availableSeats >= 1
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                              }`}
                            >
                              مقدمة (يمين)
                            </span>
                          </div>

                          <span className="text-gray-300">|</span>

                          {/* Rear Row (3 Passengers) */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((seatIndex) => {
                              const isAvailable = trip.availableSeats >= seatIndex + (trip.availableSeats > 3 ? 1 : 0);
                              return (
                                <span
                                  key={seatIndex}
                                  className={`px-1.5 py-1 rounded-md font-bold border ${
                                    isAvailable
                                      ? 'bg-[#EAF2FF] text-[#0056B3] border-[#0056B3]/30'
                                      : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                                  }`}
                                >
                                  خلف {seatIndex}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isAlmostFull ? 'bg-amber-500' : 'bg-[#0056B3]'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Intermediate Stops along the Route */}
                      {trip.intermediateStops && trip.intermediateStops.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#7B8494] bg-[#F5F7FB] px-3 py-2 rounded-xl border border-[#DCE4F0]">
                          <span className="font-bold text-[#0056B3] flex items-center gap-1">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>المحطات الوسيطة:</span>
                          </span>
                          {trip.intermediateStops.map((stop, sIdx) => (
                            <span key={sIdx} className="inline-flex items-center gap-1 text-[#202633] font-semibold">
                              <span>{stop}</span>
                              {sIdx < (trip.intermediateStops?.length || 0) - 1 && (
                                <span className="text-[#0056B3] font-bold">←</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 4. ACTIONS: BOOK SEAT, CHARTER FULL VEHICLE, OR EXPRESS CARGO */}
                      <div className="space-y-2 pt-1">
                        {serviceType === 'cargo' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartBooking(trip, false)}
                              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer active:scale-[0.98]"
                            >
                              <Package className="w-4 h-4" />
                              <span>إرسال طرد عبر WASLA Express</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareTrip(trip)}
                              className="h-12 px-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex items-center justify-center gap-1.5 font-bold text-xs transition-colors cursor-pointer shrink-0"
                              title="مشاركة تفاصيل الرحلة"
                            >
                              <Share2 className="w-4 h-4 text-[#25D366]" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStartBooking(trip, false)}
                                disabled={trip.availableSeats === 0}
                                className="flex-1 h-12 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0056B3]/25 cursor-pointer active:scale-[0.98]"
                              >
                                <Car className="w-4 h-4" />
                                <span>{trip.availableSeats > 0 ? 'حجز مقعد الآن' : 'المقاعد مكتملة'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareTrip(trip)}
                                className="h-12 px-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex items-center justify-center gap-1.5 font-bold text-xs transition-colors cursor-pointer shrink-0"
                                title="مشاركة تفاصيل الرحلة ورقم اللوحة والسائق عبر واتساب"
                              >
                                <Share2 className="w-4 h-4 text-[#25D366]" />
                                <span className="hidden sm:inline">مشاركة</span>
                              </button>
                            </div>

                            {/* Full Toyota Hilux Charter Option */}
                            {trip.charterPrice && trip.availableSeats >= 3 && (
                              <button
                                type="button"
                                onClick={() => handleStartBooking(trip, true)}
                                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <HeartHandshake className="w-3.5 h-3.5 text-purple-700" />
                                  <span>طلب حجز الهايلكس كاملة للعائلة (VIP)</span>
                                </span>
                                <span className="font-mono font-black text-purple-800">
                                  {trip.charterPrice.toLocaleString()} ريال
                                </span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MY BOOKINGS TAB */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#7B8494]">
            <span>سجل الحجوزات الخاصة بي ({bookings.length} حجز)</span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>محفوظ تلقائياً للعمل بدون إنترنت (Offline Cache)</span>
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-3">
              <Users className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[#202633]">لا توجد لديك أي حجوزات حتى الآن</h3>
              <p className="text-xs text-[#7B8494]">ابحث عن الرحلات اليومية واحجز مقعدك بين المدن بسهولة.</p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                تصفح الرحلات المتاحة
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const trip = trips.find((t) => t.id === booking.tripId);
                const canChat =
                  booking.status === 'confirmed' || booking.status === 'commission_pending_verification';

                return (
                  <div
                    key={booking.id}
                    className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#007AFF] transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE4F0] pb-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-mono text-[#0056B3] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#0056B3]/30 font-bold">
                            #{booking.id}
                          </span>

                          {booking.bookingType === 'cargo' && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              شحنة طرد WASLA Express
                            </span>
                          )}

                          {booking.isFullVehicleCharter && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1">
                              <HeartHandshake className="w-3 h-3" />
                              حجز سيارة كاملة للعائلة
                            </span>
                          )}

                          {booking.status === 'pending_driver' && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              بانتظار موافقة السائق
                            </span>
                          )}
                          {booking.status === 'accepted_unpaid_commission' && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#007AFF] border border-[#007AFF]/40 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5" />
                              تم قبول الطلب (بانتظار تأكيد العمولة)
                            </span>
                          )}
                          {booking.status === 'commission_pending_verification' && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              إشعار العمولة قيد مراجعة الإدارة
                            </span>
                          )}
                          {booking.status === 'confirmed' && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              مؤكد وجاهز للانطلاق ✓
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-black text-[#202633]">
                          {trip ? `${trip.fromCity} ← ${trip.toCity}` : 'رحلة بين المدن'}
                        </h4>

                        {trip && (
                          <div className="text-xs text-[#7B8494] flex flex-wrap items-center gap-3">
                            <span>السائق: <strong className="text-[#202633]">{trip.driverName}</strong> ({trip.driverPhone})</span>
                            <span>·</span>
                            <span>السيارة: {trip.vehicleModel} ({trip.vehiclePlate})</span>
                            <span>·</span>
                            <span>الموعد: {trip.date} ({trip.departureTime})</span>
                          </div>
                        )}
                      </div>

                      <div className="text-left md:text-right bg-[#F5F7FB] p-3 rounded-2xl border border-[#DCE4F0]">
                        <span className="text-[11px] text-[#7B8494] block">الإجمالي المطلوب:</span>
                        <span className="text-lg font-black text-[#0056B3] font-mono">
                          {booking.totalAmount.toLocaleString()} ريال يمني
                        </span>
                        <span className="text-[10px] text-[#7B8494] block">
                          {booking.bookingType === 'cargo'
                            ? 'شحن طرد في حوض الهايلكس'
                            : `${booking.seatsCount} مقاعد محجوزة`}
                        </span>
                      </div>
                    </div>

                    {/* Cargo or Luggage Information */}
                    {booking.cargoDetails && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تفاصيل الطرد: {booking.cargoDetails.packageType} ({booking.cargoDetails.description})</span>
                        </div>
                        <div className="text-emerald-800 text-[11px] flex flex-wrap gap-4">
                          <span>المستلم: <strong>{booking.cargoDetails.receiverName}</strong></span>
                          <span>هاتف المستلم: <strong>{booking.cargoDetails.receiverPhone}</strong></span>
                          <span>الوزن التقديري: <strong>{booking.cargoDetails.weightKg || 5} كجم</strong></span>
                        </div>
                      </div>
                    )}

                    {booking.luggage && (
                      <div className="p-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs flex items-center gap-4 text-[#7B8494]">
                        <span className="font-bold text-[#202633] flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#0056B3]" />
                          <span>الأمتعة في الحوض:</span>
                        </span>
                        <span>{booking.luggage.largeBags} شنطة كبيرة</span>
                        <span>·</span>
                        <span>{booking.luggage.heavyBoxes} كرتون</span>
                        <span>·</span>
                        <span>{booking.luggage.smallBags} حقيبة كابينة</span>
                      </div>
                    )}

                    {/* Operational Action Buttons (Offline SMS, WhatsApp Location, Chat, Review) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {trip && (
                          <>
                            {/* WhatsApp Location Pin to Driver */}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppDriverLocation(trip, booking)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                              title="إرسال موقعي للسائق عبر واتساب"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                              <span>إرسال الموقع للسائق واتساب</span>
                            </button>

                            {/* Offline SMS Share (No Internet Needed) */}
                            <button
                              type="button"
                              onClick={() => handleShareViaSMS(trip, booking)}
                              className="px-3.5 py-2 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] border border-[#0056B3]/30 text-[#0056B3] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                              title="مشاركة تفاصيل الحجز عبر رسالة SMS بدون إنترنت"
                            >
                              <WifiOff className="w-3.5 h-3.5" />
                              <span>مشاركة عبر SMS (بدون إنترنت)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleShareTrip(trip, booking)}
                              className="px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="مشاركة الأمان"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>مشاركة الأمان</span>
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {canChat ? (
                          <button
                            onClick={() => onOpenChat(booking.id)}
                            className="px-4 py-2 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>محادثة السائق</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#7B8494] bg-[#F5F7FB] px-3 py-2 rounded-xl border border-[#DCE4F0]">
                            تُفتح المحادثة بعد موافقة السائق
                          </span>
                        )}

                        {booking.status === 'confirmed' && !booking.hasRated && (
                          <button
                            onClick={() => {
                              setRatingBooking(booking);
                              setRatingStars(5);
                              setRatingComment('');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>تقييم السائق</span>
                          </button>
                        )}

                        {booking.hasRated && (
                          <span className="text-xs text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>تم التقييم ({booking.ratingScore || 5}★)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL POPUP */}
      <AnimatePresence>
        {bookingTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#0056B3]/30 p-6 sm:p-8 space-y-5 shadow-2xl text-[#202633] my-8 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#0056B3]/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setBookingTrip(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#0056B3] font-bold text-xs border border-[#DCE4F0] cursor-pointer transition-colors shadow-2xs group"
                    title="رجوع"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>رجوع</span>
                  </button>
                  <div className="flex items-center gap-2">
                    {serviceType === 'cargo' ? (
                      <Package className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-[#0056B3]" />
                    )}
                    <h3 className="text-lg font-black text-[#202633]">
                      {serviceType === 'cargo'
                        ? 'إرسال طرد عبر WASLA Express'
                        : isFullVehicleCharter
                        ? 'حجز السيارة كاملة للعائلة (Hilux Charter VIP)'
                        : 'تأكيد حجز مقاعد السفر'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setBookingTrip(null)}
                  className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#EAF2FF] border border-[#0056B3] text-[#0056B3] flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-[#202633]">تم إرسال الطلب بنجاح!</h4>
                  <p className="text-xs text-[#7B8494]">
                    سيصل إشعار للسائق «{bookingTrip.driverName}» للموافقة الفورية والتنسيق المباشر معك.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Trip Summary box */}
                  <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/15 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#202633]">
                      <span>مسار الرحلة:</span>
                      <span className="text-[#0056B3]">
                        {bookingTrip.fromCity} ← {bookingTrip.toCity}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7B8494]">
                      <span>موعد الانطلاق:</span>
                      <span className="text-[#202633] font-semibold">{bookingTrip.date} الساعة {bookingTrip.departureTime}</span>
                    </div>
                    <div className="flex justify-between text-[#7B8494]">
                      <span>السيارة والسائق:</span>
                      <span className="text-[#202633] font-semibold">{bookingTrip.vehicleModel} ({bookingTrip.vehiclePlate}) - {bookingTrip.driverName}</span>
                    </div>
                  </div>

                  {/* CARGO FORM SECTION OR SEAT PICKER */}
                  {serviceType === 'cargo' ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                        <Package className="w-4 h-4 text-emerald-700" />
                        <span>بيانات الطرد أو البضاعة المشحونة:</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#202633]">نوع الشحنة / الطرد:</label>
                        <select
                          value={cargoPackageType}
                          onChange={(e) => setCargoPackageType(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs font-bold outline-none"
                        >
                          <option value="حقيبة / طرد شخصي">حقيبة / طرد شخصي</option>
                          <option value="مستندات وأوراق رسمية">مستندات وأوراق رسمية</option>
                          <option value="كرتون تجاري / بضائع">كرتون تجاري / بضائع</option>
                          <option value="قطع غيار / أجهزة">قطع غيار / أجهزة</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#202633]">وصف المحتويات والوزن التقديري:</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            value={cargoDescription}
                            onChange={(e) => setCargoDescription(e.target.value)}
                            placeholder="مثال: ملابس، هدايا..."
                            className="col-span-2 h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs outline-none"
                          />
                          <div className="flex items-center bg-white border border-[#DCE4F0] rounded-xl px-2">
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={cargoWeightKg}
                              onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                              className="w-full text-center text-xs font-bold outline-none"
                            />
                            <span className="text-[10px] text-[#7B8494] shrink-0">كجم</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#202633]">اسم الشخص المستلم:</label>
                          <input
                            type="text"
                            required
                            value={cargoReceiverName}
                            onChange={(e) => setCargoReceiverName(e.target.value)}
                            placeholder="اسم المستلم في مدينة الوصول"
                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#202633]">رقم هاتف المستلم:</label>
                          <input
                            type="tel"
                            required
                            value={cargoReceiverPhone}
                            onChange={(e) => setCargoReceiverPhone(e.target.value)}
                            placeholder="77XXXXXXX"
                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs font-mono text-left outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* VISUAL HILUX SEAT PICKER INTERFACE */}
                      {!isFullVehicleCharter && (
                        <div className="space-y-2.5 p-4 rounded-2xl bg-[#F8FAFC] border border-[#0056B3]/20">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-[#202633] flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-[#0056B3]" />
                              <span>اختيار المقاعد (كابينة تويوتا هايلكس غمارتين):</span>
                            </label>
                            <span className="text-xs font-bold text-[#0056B3] bg-white px-2 py-0.5 rounded-lg border border-[#0056B3]/25">
                              {selectedSeatNumbers.length} مقاعد محددة
                            </span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-white border border-[#DCE4F0] space-y-3 shadow-inner">
                            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#EAF2FF] text-[#0056B3] text-[10px] font-bold border border-[#0056B3]/20">
                              <span className="flex items-center gap-1">
                                <Wind className="w-3 h-3 text-[#0056B3]" />
                                <span>مقدمة الهايلكس • تكييف مركزي مباشر</span>
                              </span>
                              <span>الزجاج الأمامي 🚗</span>
                            </div>

                            {/* Front Row (Driver + Front VIP Seat) */}
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#7B8494] font-bold block">الصف الأمامي (المقدمة):</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-center select-none opacity-60">
                                  <span className="text-xs text-gray-400 block">🛞</span>
                                  <span className="text-xs font-bold text-gray-500">السائق</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleSeat(1)}
                                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                                    selectedSeatNumbers.includes(1)
                                      ? 'bg-gradient-to-b from-[#0056B3] to-[#007AFF] text-white border-[#0056B3] shadow-md ring-2 ring-[#0056B3]/30 scale-[1.02]'
                                      : 'bg-[#EAF2FF]/60 hover:bg-[#EAF2FF] border-[#0056B3]/30 text-[#202633]'
                                  }`}
                                >
                                  <span className="text-xs block">👑</span>
                                  <span className="text-xs font-black block">مقعد المقدمة VIP</span>
                                  <span className={`text-[10px] block mt-0.5 ${selectedSeatNumbers.includes(1) ? 'text-white/90 font-bold' : 'text-[#0056B3] font-semibold'}`}>
                                    {selectedSeatNumbers.includes(1) ? '✓ تم الاختيار' : 'واسع ومريح'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Rear Row (3 Passenger Seats) */}
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] text-[#7B8494] font-bold block">الصف الخلفي (3 مقاعد):</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { num: 2, label: 'نافذة (يسار)', icon: '🪟' },
                                  { num: 3, label: 'الوسط', icon: '💺' },
                                  { num: 4, label: 'نافذة (يمين)', icon: '🪟' },
                                ].map((seat) => {
                                  const isSelected = selectedSeatNumbers.includes(seat.num);
                                  const isAvailable = bookingTrip.availableSeats >= seat.num;

                                  return (
                                    <button
                                      key={seat.num}
                                      type="button"
                                      disabled={!isAvailable}
                                      onClick={() => handleToggleSeat(seat.num)}
                                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                                        !isAvailable
                                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                          : isSelected
                                          ? 'bg-gradient-to-b from-[#0056B3] to-[#007AFF] text-white border-[#0056B3] shadow-md ring-2 ring-[#0056B3]/30 scale-[1.02]'
                                          : 'bg-white hover:bg-[#F5F7FB] border-[#DCE4F0] text-[#202633]'
                                      }`}
                                    >
                                      <span className="text-xs block">{seat.icon}</span>
                                      <span className="text-[11px] font-bold block mt-0.5">{seat.label}</span>
                                      <span className={`text-[9px] block mt-0.5 ${isSelected ? 'text-white font-bold' : 'text-[#7B8494]'}`}>
                                        {!isAvailable ? 'محجوز' : isSelected ? '✓ محدد' : `مقعد ${seat.num}`}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* LUGGAGE TRACKER (حوض الهايلكس والأمتعة) */}
                      <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#0056B3]/20 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-black text-[#202633] flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-[#0056B3]" />
                            <span>حمولة الأمتعة وحقائب السفر في حوض الهايلكس:</span>
                          </label>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            حوض مؤمّن ومغطى
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 bg-white rounded-xl border border-[#DCE4F0] text-center space-y-1">
                            <span className="text-[10px] text-[#7B8494] block font-bold">شنط كبيرة (حوض)</span>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setLuggageLargeBags((p) => Math.max(0, p - 1))}
                                className="w-6 h-6 rounded-md bg-[#F5F7FB] text-[#202633] font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-black text-sm">{luggageLargeBags}</span>
                              <button
                                type="button"
                                onClick={() => setLuggageLargeBags((p) => Math.min(5, p + 1))}
                                className="w-6 h-6 rounded-md bg-[#0056B3] text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-[#DCE4F0] text-center space-y-1">
                            <span className="text-[10px] text-[#7B8494] block font-bold">كراتين / طرود</span>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setLuggageHeavyBoxes((p) => Math.max(0, p - 1))}
                                className="w-6 h-6 rounded-md bg-[#F5F7FB] text-[#202633] font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-black text-sm">{luggageHeavyBoxes}</span>
                              <button
                                type="button"
                                onClick={() => setLuggageHeavyBoxes((p) => Math.min(4, p + 1))}
                                className="w-6 h-6 rounded-md bg-[#0056B3] text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-[#DCE4F0] text-center space-y-1">
                            <span className="text-[10px] text-[#7B8494] block font-bold">حقائب يد (كابينة)</span>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setLuggageSmallBags((p) => Math.max(0, p - 1))}
                                className="w-6 h-6 rounded-md bg-[#F5F7FB] text-[#202633] font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-black text-sm">{luggageSmallBags}</span>
                              <button
                                type="button"
                                onClick={() => setLuggageSmallBags((p) => Math.min(4, p + 1))}
                                className="w-6 h-6 rounded-md bg-[#0056B3] text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Assembly Points Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633] flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-[#0056B3]" />
                        <span>نقطة التجمع (الفرزة):</span>
                      </label>
                      <input
                        type="text"
                        list="modal-pickup-list"
                        required
                        value={customPickupPoint}
                        onChange={(e) => setCustomPickupPoint(e.target.value)}
                        placeholder="فرزة باب اليمن، عصر..."
                        className="w-full h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#202633] font-medium outline-none focus:border-[#0056B3]"
                      />
                      <datalist id="modal-pickup-list">
                        {(POPULAR_ASSEMBLY_POINTS[bookingTrip.fromCity] || []).map((p) => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633] flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-[#007AFF]" />
                        <span>نقطة الوصول والتنزيل:</span>
                      </label>
                      <input
                        type="text"
                        list="modal-dropoff-list"
                        required
                        value={customDropoffPoint}
                        onChange={(e) => setCustomDropoffPoint(e.target.value)}
                        placeholder="فرزة الشيخ عثمان..."
                        className="w-full h-10 px-3 rounded-xl bg-white border border-[#DCE4F0] text-xs text-[#202633] font-medium outline-none focus:border-[#0056B3]"
                      />
                      <datalist id="modal-dropoff-list">
                        {(POPULAR_ASSEMBLY_POINTS[bookingTrip.toCity] || []).map((p) => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Passenger Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633]">اسم الحاجز / الراسل:</label>
                      <input
                        type="text"
                        required
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="محمد صالح العمري"
                        className="w-full h-10 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#007AFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633]">رقم الهاتف للتواصل:</label>
                      <input
                        type="tel"
                        required
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="773456789"
                        className="w-full h-10 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-semibold outline-none text-left focus:border-[#007AFF]"
                      />
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#0056B3]/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#15356B] font-bold block">المبلغ الإجمالي المطلوب:</span>
                      <span className="text-[10px] text-[#7B8494]">
                        {serviceType === 'cargo'
                          ? `(شحن طرد وزنه ~${cargoWeightKg} كجم)`
                          : isFullVehicleCharter
                          ? `(باقة استئجار الهايلكس كاملة للعائلة)`
                          : `(${selectedSeatNumbers.length} مقاعد × ${bookingTrip.pricePerSeat.toLocaleString()} ريال)`}
                      </span>
                    </div>
                    <span className="text-xl font-black text-[#0056B3] tabular-nums">
                      {(serviceType === 'cargo'
                        ? bookingTrip.cargoMinPrice || 3000
                        : isFullVehicleCharter
                        ? bookingTrip.charterPrice || bookingTrip.totalSeats * bookingTrip.pricePerSeat * 0.95
                        : selectedSeatNumbers.length * bookingTrip.pricePerSeat
                      ).toLocaleString()}{' '}
                      ريال يمني
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    * تدفع القيمة نقداً للسائق عند الركوب / استلام الطرد، وتتكفل المنصة بمطابقة البيانات وتوفير وسيلة تواصل آمنة.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#0056B3] to-[#007AFF] hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0056B3]/25 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{serviceType === 'cargo' ? 'تأكيد طلب الشحن الآن' : 'تأكيد الحجز الآن'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingTrip(null)}
                      className="h-12 px-5 rounded-xl bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] text-xs font-semibold cursor-pointer border border-[#DCE4F0]"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVIEWS LIST POPUP MODAL */}
      <AnimatePresence>
        {selectedDriverReviews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl bg-white border border-[#DCE4F0] p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#DCE4F0] pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <h3 className="text-base font-black text-[#202633]">
                    تقييمات السائق: {selectedDriverReviews.driverName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDriverReviews(null)}
                  className="w-7 h-7 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDriverReviews.reviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7B8494] space-y-2">
                  <p>لا توجد مراجعات مكتوبة بعد لهذا السائق.</p>
                  <p className="font-semibold text-[#0056B3]">تقييم السائق الإجمالي: 4.9★ من ركاب موثقين.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDriverReviews.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#202633]">{rev.passengerName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#555] leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-[#7B8494] block text-left">
                        {new Date(rev.createdAt).toLocaleDateString('ar-YE')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POST-TRIP RATING DIALOG MODAL */}
      <AnimatePresence>
        {ratingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl bg-white border border-[#0056B3]/25 p-6 space-y-4 shadow-2xl text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#DCE4F0] pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <h3 className="text-base font-black text-[#202633]">تقييم تجربة الرحلة والسائق</h3>
                </div>
                <button
                  onClick={() => setRatingBooking(null)}
                  className="w-7 h-7 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitRating} className="space-y-4">
                <div className="text-center space-y-2 py-2">
                  <p className="text-xs text-[#7B8494]">
                    كيف كانت تجربتك في السفر مع السائق؟ ساعدنا في تحسين جودة النقل بين المدن.
                  </p>
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#0056B3]">
                    {ratingStars === 5
                      ? 'ممتاز جداً ⭐️⭐️⭐️⭐️⭐️'
                      : ratingStars === 4
                      ? 'جيد جداً ⭐️⭐️⭐️⭐️'
                      : ratingStars === 3
                      ? 'متوسط ⭐️⭐️⭐️'
                      : 'يحتاج تحسين'}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202633]">رأيك وتعليقك (اختياري):</label>
                  <textarea
                    rows={3}
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="مثال: التزام ممتاز بالموعد، قيادة هادئة وسيارة هايلكس نظيفة ومكيفة..."
                    className="w-full p-3 rounded-xl border border-[#DCE4F0] text-xs outline-none focus:border-[#0056B3]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#0056B3] hover:bg-[#007AFF] text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    إرسال التقييم
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatingBooking(null)}
                    className="py-3 px-4 rounded-xl bg-[#F5F7FB] text-[#7B8494] text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMERGENCY SOS MODAL POPUP */}
      <AnimatePresence>
        {showSOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl bg-white border-2 border-red-500 p-6 space-y-5 shadow-2xl text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="text-lg font-black text-red-950">نداء طوارئ المسافرين SOS</h3>
                </div>
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="w-7 h-7 rounded-full bg-red-50 text-red-700 hover:text-red-900 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {sosSentSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-black text-emerald-950">تم إرسال إشارة الاستغاثة بنجاح</h4>
                  <p className="text-xs text-emerald-800">
                    تم استلام بلاغك من عمليات المنصة مع إحداثيات موقعك الجغرافي. يمكنك أيضاً الاتصال المباشر.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs space-y-2">
                    <p className="text-red-900 font-bold leading-relaxed">
                      استخدم هذا الزر في الحالات الطارئة على الطريق لمشاركة موقعك المباشر مع غرفة عمليات وَصْلَة وفرق المساندة.
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-red-200 text-[11px] text-red-800">
                      <span>إحداثيات GPS الحالية:</span>
                      <span className="font-mono font-bold">
                        {locationLoading
                          ? 'جاري تحديد القمر الصناعي...'
                          : liveLocation
                          ? `${liveLocation.lat.toFixed(4)}, ${liveLocation.lng.toFixed(4)}`
                          : '14.823, 44.254'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Instant Admin Dispatch */}
                    <button
                      type="button"
                      onClick={handleSendSOSDistress}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال نداء فوري لإدارة المنصة</span>
                    </button>

                    {/* Direct Emergency Phone Hotline */}
                    <a
                      href="tel:739992781"
                      className="w-full py-3 rounded-xl bg-[#202633] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      <span>اتصال فوري بطوارئ المنصة (739992781)</span>
                    </a>

                    {/* Send Live GPS via WhatsApp */}
                    <button
                      type="button"
                      onClick={() => {
                        const locText = liveLocation
                          ? `https://maps.google.com/?q=${liveLocation.lat},${liveLocation.lng}`
                          : 'طريق السفر الرئيسي بين المدن';
                        const text = `🚨 *نداء استغاثة طارئ SOS - مسافر عبر تطبيق وَصْلَة*\nأنا بحاجة لمساعدة طارئة على طريق السفر.\n📍 موقعي المباشر:\n${locText}`;
                        window.open(`https://wa.me/967739992781?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>إرسال إحداثيات الموقع عبر واتساب الطوارئ</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="text-xs text-[#7B8494] hover:underline"
                >
                  إغلاق نافذة الطوارئ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST FEEDBACK ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-white/20"
          >
            <Share2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPLE-STYLE BOTTOM NAVIGATION BAR (Quick Switcher) */}
      <div className="sticky bottom-4 z-30 max-w-md mx-auto w-full px-4 pt-4">
        <div className="bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#0056B3]/25 rounded-2xl shadow-xl p-1.5 flex items-center justify-around text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#0056B3] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#F5F7FB]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_bookings')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer relative ${
              activeTab === 'my_bookings'
                ? 'bg-[#0056B3] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#F5F7FB]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>رحلاتي</span>
            {bookings.length > 0 && (
              <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                activeTab === 'my_bookings' ? 'bg-white text-[#0056B3]' : 'bg-[#0056B3] text-white'
              }`}>
                {bookings.length}
              </span>
            )}
          </button>

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[#7B8494] hover:text-[#202633] hover:bg-[#F5F7FB] transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>الحساب</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
