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
} from 'lucide-react';

interface PassengerViewProps {
  trips: Trip[];
  bookings: Booking[];
  cities: City[];
  onBookTrip: (tripId: string, seatsCount: number, name: string, phone: string) => void;
  onOpenChat: (bookingId: string) => void;
  onRateDriver: (bookingId: string, rating: number) => void;
  onOpenSettings?: () => void;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  trips,
  bookings,
  cities,
  onBookTrip,
  onOpenChat,
  onRateDriver,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'my_bookings'>('search');
  const [fromCity, setFromCity] = useState<string>('صنعاء');
  const [toCity, setToCity] = useState<string>('عدن');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-18');
  const [requiredSeats, setRequiredSeats] = useState<number>(1);

  // Booking modal state
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [passengerName, setPassengerName] = useState<string>('محمد صالح');
  const [passengerPhone, setPassengerPhone] = useState<string>('773456789');
  const [bookingSeats, setBookingSeats] = useState<number>(1);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Filter trips based on search
  const filteredTrips = trips.filter((trip) => {
    const matchFrom = !fromCity || trip.fromCity === fromCity;
    const matchTo = !toCity || trip.toCity === toCity;
    const matchSeats = trip.availableSeats >= requiredSeats;
    return matchFrom && matchTo && matchSeats && trip.status === 'published';
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
          {/* SEARCH & FILTER WIDGET */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Origin City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#245BDB]" />
                  <span>مدينة الانطلاق</span>
                </label>
                <div className="relative">
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-semibold focus:border-[#1769FF] outline-none shadow-xs"
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

              {/* 2. Destination City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1769FF]" />
                  <span>مدينة الوصول</span>
                </label>
                <div className="relative">
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-semibold focus:border-[#1769FF] outline-none shadow-xs"
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

              {/* 3. Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#245BDB]" />
                  <span>تاريخ الرحلة</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-semibold focus:border-[#1769FF] outline-none shadow-xs"
                />
              </div>

              {/* 4. Seats Needed */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#202633] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#245BDB]" />
                  <span>عدد المقاعد المطلوبة</span>
                </label>
                <select
                  value={requiredSeats}
                  onChange={(e) => setRequiredSeats(Number(e.target.value))}
                  className="w-full h-12 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-sm font-semibold focus:border-[#1769FF] outline-none shadow-xs"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'مقعد واحد' : 'مقاعد'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick route chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DCE4F0] text-xs">
              <span className="text-[#7B8494]">خطوط سريعة ومطلوبة:</span>
              <button
                onClick={() => {
                  setFromCity('صنعاء');
                  setToCity('عدن');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EAF2FF] border border-[#DCE4F0] text-[#202633] hover:border-[#1769FF] transition-all cursor-pointer font-medium"
              >
                صنعاء ← عدن
              </button>
              <button
                onClick={() => {
                  setFromCity('عدن');
                  setToCity('تعز');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EAF2FF] border border-[#DCE4F0] text-[#202633] hover:border-[#1769FF] transition-all cursor-pointer font-medium"
              >
                عدن ← تعز
              </button>
              <button
                onClick={() => {
                  setFromCity('صنعاء');
                  setToCity('إب');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EAF2FF] border border-[#DCE4F0] text-[#202633] hover:border-[#1769FF] transition-all cursor-pointer font-medium"
              >
                صنعاء ← إب
              </button>
              <button
                onClick={() => {
                  setFromCity('مأرب');
                  setToCity('صنعاء');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EAF2FF] border border-[#DCE4F0] text-[#202633] hover:border-[#1769FF] transition-all cursor-pointer font-medium"
              >
                مأرب ← صنعاء
              </button>
            </div>
          </div>

          {/* AVAILABLE TRIPS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7B8494]">
              <span>الرحلات المتاحة حالياً ({filteredTrips.length} رحلة)</span>
              <span>أسطول سيارات تويوتا هايلكس ومقاعد مؤكدة</span>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
                <Car className="w-12 h-12 text-[#7B8494] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#202633]">لا توجد رحلات مطابقة لبحثك حالياً</h3>
                <p className="text-xs text-[#7B8494]">
                  جرب تغيير وجهة الوصول أو تاريخ السفر، أو تواصل مع خدمة العملاء لترتيب رحلة خاصة.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrips.map((trip) => {
                  const isAlmostFull = trip.availableSeats <= 2;
                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-3xl bg-[#FFFFFF] hover:bg-[#F5F7FB] border border-[#DCE4F0] hover:border-[#1769FF] transition-all shadow-sm hover:shadow-lg space-y-5 flex flex-col justify-between"
                    >
                      {/* Driver profile & Hilux header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={trip.driverPhoto}
                            alt={trip.driverName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#245BDB]/40 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#202633]">{trip.driverName}</h4>
                              {trip.isVerified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#245BDB] bg-[#EAF2FF] px-2 py-0.5 rounded-full border border-[#245BDB]/30">
                                  <ShieldCheck className="w-3 h-3 text-[#245BDB]" />
                                  موثّق
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#7B8494] mt-0.5">
                              <div className="flex items-center text-amber-500 font-bold">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500 ml-0.5" />
                                <span>{trip.driverRating.toFixed(1)}</span>
                              </div>
                              <span>·</span>
                              <span>{trip.vehicleModel}</span>
                              <span>·</span>
                              <span className="font-mono text-[11px] font-semibold text-[#202633]">{trip.vehiclePlate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hilux badge/preview thumbnail */}
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-[#DCE4F0] bg-slate-900 shrink-0">
                          <img
                            src={trip.vehiclePhoto}
                            alt="Toyota Hilux"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Route Path Indicator */}
                      <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1769FF]" />
                            <span className="text-base font-black text-[#202633]">{trip.fromCity}</span>
                            <span className="text-xs text-[#7B8494]">({trip.fromArea})</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#1769FF] rotate-180" />
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-[#245BDB]">{trip.toCity}</span>
                            <span className="text-xs text-[#7B8494]">({trip.toArea})</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#245BDB]" />
                          </div>
                        </div>

                        {/* Timing details */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCE4F0] text-xs text-[#7B8494]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#245BDB]" />
                            <span className="font-semibold text-[#202633]">{trip.departureTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#245BDB]" />
                            <span>{trip.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Seat Availability Footer */}
                      <div className="flex items-center justify-between gap-4 pt-1">
                        <div>
                          <div className="text-[11px] text-[#7B8494]">المقاعد المتاحة</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[#245BDB] text-lg font-black tabular-nums">
                              {trip.availableSeats}
                            </span>
                            <span className="text-xs text-[#7B8494]">/ {trip.totalSeats} مقاعد</span>
                            {isAlmostFull && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold mr-1">
                                أوشكت على الاكتمال
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-[11px] text-[#7B8494]">سعر المقعد</div>
                          <div className="text-lg font-black text-[#202633] tabular-nums">
                            {trip.pricePerSeat.toLocaleString()}{' '}
                            <span className="text-xs font-normal text-[#7B8494]">ريال يمني</span>
                          </div>
                        </div>
                      </div>

                      {/* Book CTA Button */}
                      <button
                        onClick={() => handleStartBooking(trip)}
                        disabled={trip.availableSeats === 0}
                        className="w-full h-12 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#245BDB]/20 cursor-pointer active:scale-[0.98]"
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
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#245BDB]" />
                  <h3 className="text-lg font-black text-[#202633]">تأكيد طلب حجز المقعد</h3>
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
    </div>
  );
};
