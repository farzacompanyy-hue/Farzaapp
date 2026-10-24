import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, Booking, City } from '../types';
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
} from 'lucide-react';

interface PassengerViewProps {
  trips: Trip[];
  bookings: Booking[];
  cities: City[];
  onBookTrip: (tripId: string, seatsCount: number, name: string, phone: string) => void;
  onOpenChat: (bookingId: string) => void;
  onRateDriver: (bookingId: string, rating: number) => void;
  onOpenSettings?: () => void;
  initialTab?: 'search' | 'my_bookings';
  onBackToHome?: () => void;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  trips,
  bookings,
  cities,
  onBookTrip,
  onOpenChat,
  onRateDriver,
  onOpenSettings,
  initialTab,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'my_bookings'>(initialTab || 'search');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [fromCity, setFromCity] = useState<string>('صنعاء');
  const [toCity, setToCity] = useState<string>('عدن');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-18');
  const [requiredSeats, setRequiredSeats] = useState<number>(1);
  const [activeFilterPill, setActiveFilterPill] = useState<'all' | 'today' | 'morning' | 'ac' | 'family' | 'instant'>('all');

  // Booking modal state
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [passengerName, setPassengerName] = useState<string>('محمد صالح');
  const [passengerPhone, setPassengerPhone] = useState<string>('773456789');
  const [bookingSeats, setBookingSeats] = useState<number>(1);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  // Filter trips based on search and interactive pills
  const filteredTrips = trips.filter((trip) => {
    const matchFrom = !fromCity || trip.fromCity === fromCity;
    const matchTo = !toCity || trip.toCity === toCity;
    const matchSeats = trip.availableSeats >= requiredSeats;

    let matchPill = true;
    if (activeFilterPill === 'today') {
      matchPill = trip.date === selectedDate || trip.date.includes('2026-10-18') || trip.date.includes('2026-10-21');
    } else if (activeFilterPill === 'morning') {
      matchPill = trip.departureTime.includes('ص') || trip.departureTime.includes('صباحاً');
    } else if (activeFilterPill === 'ac') {
      matchPill = true; // All Toyota Hilux fleet are AC-equipped
    } else if (activeFilterPill === 'family') {
      matchPill = trip.availableSeats >= 3;
    } else if (activeFilterPill === 'instant') {
      matchPill = trip.availableSeats >= 1;
    }

    return matchFrom && matchTo && matchSeats && matchPill && trip.status === 'published';
  });

  const handleStartBooking = (trip: Trip) => {
    setBookingTrip(trip);
    setBookingSeats(Math.min(1, trip.availableSeats));
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTrip) return;
    onBookTrip(bookingTrip.id, bookingSeats, passengerName, passengerPhone);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingTrip(null);
      setBookingSuccess(false);
      setActiveTab('my_bookings');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 bg-[#FFFFFF] text-[#202633]">
      {/* Top Segmented Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#245BDB]/15 pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#202633] flex items-center gap-2">
            <span>منصة حجز المقاعد بين المدن</span>
            <span className="text-xs text-white bg-[#245BDB] px-2.5 py-0.5 rounded-full font-bold">
              الراكب
            </span>
          </h2>
          <p className="text-xs text-[#7B8494] mt-1">
            سافر بأمان في سيارات Toyota Hilux وسيارات حديثة ومكيفة مع سائقين موثقين.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F7FB] border border-[#245BDB]/20 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#245BDB] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            البحث عن رحلة
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_bookings'
                ? 'bg-[#245BDB] text-white shadow-sm'
                : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <span>حجوزاتي</span>
            {bookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1769FF] text-white text-[10px] font-black flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </button>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[#245BDB] bg-white hover:bg-[#EAF2FF] border border-[#245BDB]/25 shadow-xs"
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
          {/* GLASSMORPHISM ROUTE SEARCH & FILTER WIDGET */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#245BDB]/25 shadow-lg space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* 1. Origin City */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#245BDB]" />
                  <span>مدينة الانطلاق</span>
                </label>
                <div className="relative">
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-bold focus:border-[#245BDB] outline-none shadow-xs"
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
                  className="w-11 h-11 rounded-2xl bg-[#EAF2FF] hover:bg-[#D7E7FF] text-[#245BDB] flex items-center justify-center border border-[#245BDB]/30 shadow-xs cursor-pointer hover:rotate-180 transition-transform duration-300"
                  title="تبديل مدينة الانطلاق والوصول"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Destination City */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1769FF]" />
                  <span>مدينة الوصول</span>
                </label>
                <div className="relative">
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-bold focus:border-[#245BDB] outline-none shadow-xs"
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
                    <Calendar className="w-3.5 h-3.5 text-[#245BDB]" />
                    <span>التاريخ</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold focus:border-[#245BDB] outline-none shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#202633] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#245BDB]" />
                    <span>المقاعد</span>
                  </label>
                  <select
                    value={requiredSeats}
                    onChange={(e) => setRequiredSeats(Number(e.target.value))}
                    className="w-full h-12 px-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-bold focus:border-[#245BDB] outline-none shadow-xs"
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

            {/* INTERACTIVE FILTER PILLS (Apple-style Segmented Pills) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DCE4F0]">
              <span className="text-xs text-[#7B8494] font-bold flex items-center gap-1 ml-1">
                <Filter className="w-3.5 h-3.5 text-[#245BDB]" />
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
                onClick={() => setActiveFilterPill('today')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'today'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>المغادرة اليوم</span>
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
                <span>فترة الصباح</span>
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

              <button
                type="button"
                onClick={() => setActiveFilterPill('family')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'family'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>عوائل (3+ مقاعد)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterPill('instant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilterPill === 'instant'
                    ? 'bg-[#0056B3] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#202633] hover:bg-[#EAF2FF] border border-[#DCE4F0]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تأكيد فوري</span>
              </button>
            </div>
          </div>

          {/* AVAILABLE TRIPS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7B8494]">
              <span>الرحلات المتاحة ({filteredTrips.length} رحلة)</span>
              <span>أسطول سيارات تويوتا هايلكس معتمدة</span>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
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
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                          <Car className="w-3.5 h-3.5 text-[#0056B3]" />
                          <span>{trip.vehicleModel}</span>
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
                              <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{trip.driverRating.toFixed(1)}</span>
                                <span className="text-white/80 text-[10px] mr-1">سائق معتمد</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                            <span className="text-[10px] text-white/80 block">سعر المقعد</span>
                            <span className="text-base font-black text-amber-300 font-mono">
                              {trip.pricePerSeat.toLocaleString()}{' '}
                              <span className="text-[10px] text-white">ريال</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. ROUTE PATH INDICATOR */}
                      <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
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

                        {/* Timing details */}
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
                            <Wind className="w-3 h-3 text-emerald-600" />
                            <span>تكييف مركزي</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. VISUAL SEAT MAP & AVAILABILITY PROGRESS BAR */}
                      <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-[#E2E8F0] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#202633] flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#0056B3]" />
                            <span>خريطة مقاعد الهايلكس:</span>
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
                          {isAlmostFull && (
                            <div className="text-[10px] text-amber-700 font-bold text-left">
                              سارع بالحجز: المقاعد على وشك النفاد
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. BOOK CTA BUTTON */}
                      <button
                        onClick={() => handleStartBooking(trip)}
                        disabled={trip.availableSeats === 0}
                        className="w-full h-12 rounded-xl bg-[#0056B3] hover:bg-[#1769FF] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0056B3]/25 cursor-pointer active:scale-[0.98]"
                      >
                        <Car className="w-4 h-4" />
                        <span>{trip.availableSeats > 0 ? 'حجز مقعد الآن' : 'المقاعد مكتملة'}</span>
                      </button>
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
            <span>تواصل مباشر مع السائق بعد قبول الحجز وتأكيده</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
              <Users className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[#202633]">لا توجد لديك أي حجوزات حتى الآن</h3>
              <p className="text-xs text-[#7B8494]">ابحث عن الرحلات اليومية واحجز مقعدك بين المدن بسهولة.</p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
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
                    className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] hover:border-[#1769FF] transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#245BDB] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#245BDB]/30 font-bold">
                          #{booking.id}
                        </span>
                        {booking.status === 'pending_driver' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            بانتظار موافقة السائق
                          </span>
                        )}
                        {booking.status === 'accepted_unpaid_commission' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#1769FF] border border-[#1769FF]/40 flex items-center gap-1">
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
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/30 flex items-center gap-1">
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
                          <span>السائق: <strong className="text-[#202633]">{trip.driverName}</strong></span>
                          <span>·</span>
                          <span>الموعد: {trip.date} ({trip.departureTime})</span>
                          <span>·</span>
                          <span>السيارة: {trip.vehicleModel}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs pt-1 text-[#202633]">
                        <span>المقاعد المحجوزة: <strong className="text-[#245BDB]">{booking.seatsCount} مقعد</strong></span>
                        <span>الإجمالي: <strong className="text-[#245BDB]">{booking.totalAmount.toLocaleString()} ريال</strong></span>
                      </div>
                    </div>

                    {/* Actions: Chat & Rating */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {canChat ? (
                        <button
                          onClick={() => onOpenChat(booking.id)}
                          className="px-4 py-2.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#245BDB]/20"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>فتح المحادثة مع السائق</span>
                        </button>
                      ) : (
                        <div className="text-[11px] text-[#7B8494] bg-[#F5F7FB] px-3 py-2 rounded-xl border border-[#DCE4F0]">
                          تُفتح المحادثة بعد قبول السائق وتأكيد الرحلة
                        </div>
                      )}

                      {booking.status === 'confirmed' && !booking.hasRated && (
                        <div className="flex items-center gap-1 bg-[#F5F7FB] p-1.5 rounded-xl border border-[#DCE4F0]">
                          <span className="text-[10px] text-[#7B8494] px-1">تقييم:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => onRateDriver(booking.id, star)}
                              className="p-1 hover:text-amber-500 text-gray-300 transition-colors cursor-pointer"
                              title={`تقييم ${star} نجوم`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                          ))}
                        </div>
                      )}

                      {booking.hasRated && (
                        <span className="text-xs text-[#245BDB] bg-[#EAF2FF] border border-[#245BDB]/30 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تم التقييم
                        </span>
                      )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 sm:p-8 space-y-6 shadow-2xl text-[#202633]"
            >
              <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
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
                    <CheckCircle2 className="w-5 h-5 text-[#245BDB]" />
                    <h3 className="text-lg font-black text-[#202633]">تأكيد طلب حجز المقعد</h3>
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
                  <div className="w-16 h-16 rounded-full bg-[#EAF2FF] border border-[#245BDB] text-[#245BDB] flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-[#202633]">تم إرسال طلب الحجز بنجاح!</h4>
                  <p className="text-xs text-[#7B8494]">
                    سيصل إشعار للسائق «{bookingTrip.driverName}» للموافقة وتأكيد حجزك، وستتمكن بعدها من التواصل المباشر.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Trip Summary box */}
                  <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#202633]">
                      <span>مسار الرحلة:</span>
                      <span className="text-[#245BDB]">
                        {bookingTrip.fromCity} ({bookingTrip.fromArea}) ← {bookingTrip.toCity} ({bookingTrip.toArea})
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7B8494]">
                      <span>موعد الانطلاق:</span>
                      <span className="text-[#202633] font-semibold">{bookingTrip.date} الساعة {bookingTrip.departureTime}</span>
                    </div>
                    <div className="flex justify-between text-[#7B8494]">
                      <span>السيارة والسائق:</span>
                      <span className="text-[#202633] font-semibold">{bookingTrip.vehicleModel} - {bookingTrip.driverName}</span>
                    </div>
                  </div>

                  {/* Passenger Name & Phone */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633]">عدد المقاعد:</label>
                      <div className="flex items-center gap-3">
                        <select
                          value={bookingSeats}
                          onChange={(e) => setBookingSeats(Number(e.target.value))}
                          className="flex-1 h-12 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] font-bold outline-none focus:border-[#1769FF]"
                        >
                          {Array.from({ length: bookingTrip.availableSeats }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'مقعد واحد' : 'مقاعد'}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-[#7B8494]">
                          (المتاح: {bookingTrip.availableSeats} مقاعد)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633]">اسم الراكب بالكامل:</label>
                      <input
                        type="text"
                        required
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="مثال: محمد صالح العمري"
                        className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-semibold outline-none focus:border-[#1769FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202633]">رقم هاتف الراكب (للتواصل في اليمن):</label>
                      <input
                        type="tel"
                        required
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="مثال: 773456789"
                        className="w-full h-11 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs font-mono font-semibold outline-none text-left focus:border-[#1769FF]"
                      />
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-between">
                    <span className="text-xs text-[#15356B] font-bold">المبلغ الإجمالي المطلوب:</span>
                    <span className="text-xl font-black text-[#245BDB] tabular-nums">
                      {(bookingSeats * bookingTrip.pricePerSeat).toLocaleString()} ريال يمني
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7B8494] leading-relaxed">
                    * تدفع قيمة المقعد نقداً للسائق عند الركوب أو حسب الاتفاق، وتتكفل المنصة بمطابقة البيانات وتوفير وسيلة تواصل آمنة.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#245BDB]/25 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأكيد الحجز الآن</span>
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

      {/* APPLE-STYLE BOTTOM NAVIGATION BAR (Quick Switcher) */}
      <div className="sticky bottom-4 z-30 max-w-md mx-auto w-full px-4 pt-4">
        <div className="bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#245BDB]/25 rounded-2xl shadow-xl p-1.5 flex items-center justify-around text-xs">
          {/* 1. Explore / Search */}
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

          {/* 2. My Bookings */}
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

          {/* 3. Account / Settings */}
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
