import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MainRoleSelectScreen } from './components/MainRoleSelectScreen';
import { Header } from './components/Header';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { AdminView } from './components/AdminView';
import { ChatModal } from './components/ChatModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { InstallIPhoneModal } from './components/InstallIPhoneModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { PublicLegalPage } from './components/PublicLegalPage';
import { PassengerSettingsModal } from './components/PassengerSettingsModal';
import { DriverSettingsModal } from './components/DriverSettingsModal';
import {
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_SETTINGS,
  YEMEN_CITIES,
  INITIAL_COMPLAINTS,
} from './data/mockData';
import { UserRole, Trip, Booking, Driver, SystemSettings, ChatMessage, Complaint } from './types';

export default function App() {
  // Check standalone public legal URL parameter (?page=privacy | ?page=terms | ?page=delete-account)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const pageParam = urlParams.get('page') as 'privacy' | 'terms' | 'delete-account' | null;
  const [activeLegalPage, setActiveLegalPage] = useState<'privacy' | 'terms' | 'delete-account' | null>(pageParam);

  // Splash state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // App state
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);

  // Active Modals: Chat, Support, Install, Privacy Center & Settings
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showPassengerSettings, setShowPassengerSettings] = useState<boolean>(false);
  const [showDriverSettings, setShowDriverSettings] = useState<boolean>(false);
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms' | 'consents' | 'delete' | 'contact'>('privacy');

  const handleOpenPrivacy = (
    tab: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact' = 'privacy'
  ) => {
    setPrivacyTab(tab);
    setShowPrivacyModal(true);
  };

  const handleAccountDeleted = (phone: string) => {
    // Erase matching bookings and reset session
    setBookings((prev) => prev.filter((b) => b.passengerPhone !== phone));
    setComplaints((prev) => prev.filter((c) => c.userId !== phone));
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Restore available seats on trip
    setTrips((prev) =>
      prev.map((t) =>
        t.id === booking.tripId
          ? { ...t, availableSeats: Math.min(t.totalSeats, t.availableSeats + booking.seatsCount) }
          : t
      )
    );
  };

  // Network State & Universal PWA Install Prompt Listener
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleTriggerInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  // In-app chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      bookingId: 'bk-501',
      senderId: 'drv-1',
      senderName: 'أحمد محمد الشامي (السائق)',
      senderRole: 'driver',
      text: 'أهلاً بك أخي طارق! موعد انطلاقنا الساعة 6:30 صباحاً من جولة الرويشان بصنعاء، سيارة الهايلكس جاهزة ومكيفة.',
      timestamp: '12:20 م',
      isRead: true,
    },
    {
      id: 'msg-2',
      bookingId: 'bk-501',
      senderId: 'usr-1',
      senderName: 'طارق عبد الله (الراكب)',
      senderRole: 'passenger',
      text: 'حياك الله كابتن أحمد، سأكون في الموعد بالضبط ومعي حقيبتان متوسطتان.',
      timestamp: '12:25 م',
      isRead: true,
    },
  ]);

  // Current active driver for driver view
  const currentDriver = drivers[0]; // Ahmed Al-Shami

  // Passenger actions
  const handleBookTrip = (tripId: string, seatsCount: number, name: string, phone: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const totalAmount = seatsCount * trip.pricePerSeat;
    const commissionAmount = Math.round(totalAmount * (settings.commissionRatePercent / 100));

    const newBooking: Booking = {
      id: `bk-${Math.floor(100 + Math.random() * 900)}`,
      tripId,
      passengerId: 'usr-current',
      passengerName: name,
      passengerPhone: phone,
      seatsCount,
      pricePerSeat: trip.pricePerSeat,
      totalAmount,
      commissionAmount,
      status: 'pending_driver',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update remaining seats on trip
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, availableSeats: Math.max(0, t.availableSeats - seatsCount) } : t
      )
    );
  };

  const handleRateDriver = (bookingId: string, rating: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hasRated: true } : b))
    );
  };

  // Driver actions
  const handleCreateTrip = (newTripData: Partial<Trip>) => {
    const newTrip: Trip = {
      id: `trip-${Date.now().toString().slice(-4)}`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      driverPhone: currentDriver.phone,
      driverPhoto: currentDriver.photo,
      driverRating: currentDriver.rating,
      isVerified: currentDriver.verifiedBadge,
      fromCity: newTripData.fromCity || 'صنعاء',
      fromArea: newTripData.fromArea || 'حدة',
      toCity: newTripData.toCity || 'عدن',
      toArea: newTripData.toArea || 'المنصورة',
      date: newTripData.date || '2026-10-21',
      departureTime: newTripData.departureTime || '07:00 ص',
      totalSeats: newTripData.totalSeats || 5,
      availableSeats: newTripData.totalSeats || 5,
      pricePerSeat: newTripData.pricePerSeat || 10000,
      vehicleModel: newTripData.vehicleModel || 'Toyota Hilux Black',
      vehicleColor: newTripData.vehicleColor || 'أسود',
      vehiclePlate: newTripData.vehiclePlate || '48291 / اليمن',
      vehiclePhoto: newTripData.vehiclePhoto || currentDriver.vehicle.photoUrl,
      notes: newTripData.notes,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'accepted_unpaid_commission' } : b
      )
    );
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b))
    );
  };

  const handleSubmitCommissionReceipt = (
    bookingId: string,
    bank: string,
    refNumber: string,
    receiptPhoto: string
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'commission_pending_verification',
              paymentBank: bank,
              paymentRef: refNumber,
              paymentReceiptUrl: receiptPhoto,
            }
          : b
      )
    );
  };

  // Admin actions
  const handleApproveCommission = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'confirmed',
              commissionApprovedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const handleRejectCommission = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'accepted_unpaid_commission' } : b
      )
    );
  };

  const handleApproveDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, verificationStatus: 'verified', verifiedBadge: true }
          : d
      )
    );
  };

  const handleRejectDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, verificationStatus: 'rejected' } : d
      )
    );
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Chat message send
  const handleSendMessage = (bookingId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: currentRole === 'driver' ? currentDriver.id : 'usr-current',
      senderName: currentRole === 'driver' ? currentDriver.name : 'الراكب',
      senderRole: currentRole === 'driver' ? 'driver' : 'passenger',
      text,
      timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleSupportTicket = (issueType: string, description: string) => {
    const newComplaint: Complaint = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      userId: 'usr-current',
      userName: currentRole === 'driver' ? currentDriver.name : 'مستخدم فَرْزَة',
      userRole: currentRole || 'passenger',
      issueType,
      description,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  // Find active booking for chat modal
  const activeChatBooking = bookings.find((b) => b.id === activeChatBookingId);
  const activeChatTrip = activeChatBooking
    ? trips.find((t) => t.id === activeChatBooking.tripId)
    : undefined;

  // If standalone legal URL parameter is active (?page=privacy | terms | delete-account)
  if (activeLegalPage) {
    return (
      <PublicLegalPage
        initialType={activeLegalPage}
        onNavigateHome={() => {
          setActiveLegalPage(null);
          if (typeof window !== 'undefined' && window.history) {
            window.history.pushState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202633] flex flex-col selection:bg-[#245BDB] selection:text-white">
      {/* 1. INTRO SPLASH SCREEN (Stage 0 to 4: Digital GPS Map, Toyota Hilux & Farza Logo) */}
      {showSplash ? (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          durationSeconds={settings.splashDurationSeconds}
        />
      ) : (
        <>
          {/* Network Offline Alert Banner */}
          {!isOnline && (
            <div className="bg-[#15356B] text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 border-b border-[#245BDB]/40 shadow-sm sticky top-0 z-50">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>أنت الآن في وضع عدم الاتصال (Offline) - يمكنك استعراض الرحلات والبيانات المحفوظة محلياً.</span>
            </div>
          )}

          {/* Top Bar Navigation */}
          <Header
            currentRole={currentRole}
            onSelectRole={(role) => setCurrentRole(role)}
            onReplayIntro={() => setShowSplash(true)}
            onOpenSupport={() => setShowSupportModal(true)}
            onOpenInstall={() => setShowInstallModal(true)}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
            onOpenSettings={() => {
              if (currentRole === 'passenger') setShowPassengerSettings(true);
              else if (currentRole === 'driver') setShowDriverSettings(true);
            }}
            customerPhone={settings.customerServicePhone}
          />

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1">
            {currentRole === null ? (
              /* THE MAIN DASHBOARD SCREEN (Immediately follows the introduction) */
              <MainRoleSelectScreen
                onSelectRole={(role) => setCurrentRole(role)}
                onReplayIntro={() => setShowSplash(true)}
                onOpenSupport={() => setShowSupportModal(true)}
                onOpenInstall={() => setShowInstallModal(true)}
                onOpenPrivacy={handleOpenPrivacy}
                customerPhone={settings.customerServicePhone}
                slogan={settings.appSlogan}
              />
            ) : currentRole === 'passenger' ? (
              /* PASSENGER INTERCITY SEAT BOOKING VIEW */
              <PassengerView
                trips={trips}
                bookings={bookings}
                cities={YEMEN_CITIES}
                onBookTrip={handleBookTrip}
                onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
                onRateDriver={handleRateDriver}
                onOpenSettings={() => setShowPassengerSettings(true)}
              />
            ) : currentRole === 'driver' ? (
              /* DRIVER INTERCITY FLEET & COMMISSION VIEW */
              <DriverView
                driver={currentDriver}
                trips={trips}
                bookings={bookings}
                cities={YEMEN_CITIES}
                commissionRate={settings.commissionRatePercent}
                onCreateTrip={handleCreateTrip}
                onAcceptBooking={handleAcceptBooking}
                onRejectBooking={handleRejectBooking}
                onSubmitCommissionReceipt={handleSubmitCommissionReceipt}
                onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
                onOpenSettings={() => setShowDriverSettings(true)}
              />
            ) : (
              /* ADMIN DASHBOARD & VERIFICATION VIEW */
              <AdminView
                drivers={drivers}
                trips={trips}
                bookings={bookings}
                settings={settings}
                complaints={complaints}
                onApproveDriver={handleApproveDriver}
                onRejectDriver={handleRejectDriver}
                onApproveCommission={handleApproveCommission}
                onRejectCommission={handleRejectCommission}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </main>

          {/* CHAT MODAL (Strictly Gated after Commission Approval) */}
          {activeChatBooking && (
            <ChatModal
              booking={activeChatBooking}
              trip={activeChatTrip}
              messages={chatMessages}
              currentUserRole={currentRole || 'passenger'}
              onSendMessage={handleSendMessage}
              onClose={() => setActiveChatBookingId(null)}
            />
          )}

          {/* CUSTOMER SERVICE MODAL (Phone: 739992781 & WhatsApp) */}
          {showSupportModal && (
            <CustomerSupportModal
              phone={settings.customerServicePhone}
              onClose={() => setShowSupportModal(false)}
              onSubmitTicket={handleSupportTicket}
            />
          )}

          {/* UNIVERSAL MULTI-DEVICE INSTALL GUIDE MODAL */}
          {showInstallModal && (
            <InstallIPhoneModal
              appUrl="https://ais-pre-bfx4qrvcad337g45exuu57-587517713088.europe-west3.run.app"
              onClose={() => setShowInstallModal(false)}
              deferredPrompt={deferredPrompt}
              onTriggerInstallPrompt={handleTriggerInstall}
            />
          )}

          {/* IN-APP PRIVACY & LEGAL CENTER MODAL */}
          {showPrivacyModal && (
            <PrivacyCenterModal
              initialTab={privacyTab}
              onClose={() => setShowPrivacyModal(false)}
              userData={{
                userId: 'usr-current',
                userName: 'مستخدم فَرْزَة (الحالي)',
                userPhone: '771239999',
                userRole: currentRole || 'passenger',
                bookings,
                trips,
                chatMessages,
                complaints,
              }}
              onAccountDeleted={handleAccountDeleted}
            />
          )}

          {/* PASSENGER USER SETTINGS MODAL (WHATSAPP-STYLE) */}
          {showPassengerSettings && (
            <PassengerSettingsModal
              onClose={() => setShowPassengerSettings(false)}
              bookings={bookings}
              trips={trips}
              onCancelBooking={handleCancelBooking}
              onOpenChat={(bookingId) => {
                setShowPassengerSettings(false);
                setActiveChatBookingId(bookingId);
              }}
              onOpenPrivacyCenter={(tab) => {
                setShowPassengerSettings(false);
                handleOpenPrivacy(tab);
              }}
              onLogout={() => {
                setShowPassengerSettings(false);
                setCurrentRole(null);
              }}
              onAccountDeleted={(phone) => {
                setShowPassengerSettings(false);
                handleAccountDeleted(phone);
                setCurrentRole(null);
              }}
              customerPhone={settings.customerServicePhone}
            />
          )}

          {/* DRIVER SETTINGS MODAL (WHATSAPP-STYLE) */}
          {showDriverSettings && (
            <DriverSettingsModal
              driver={currentDriver}
              trips={trips}
              bookings={bookings}
              commissionRate={settings.commissionRatePercent}
              onClose={() => setShowDriverSettings(false)}
              onOpenPrivacyCenter={(tab) => {
                setShowDriverSettings(false);
                handleOpenPrivacy(tab);
              }}
              onLogout={() => {
                setShowDriverSettings(false);
                setCurrentRole(null);
              }}
              onAccountDeleted={(phone) => {
                setShowDriverSettings(false);
                handleAccountDeleted(phone);
                setCurrentRole(null);
              }}
              customerPhone={settings.customerServicePhone}
            />
          )}

          {/* FOOTER WITH COMPREHENSIVE PRIVACY & LEGAL LINKS */}
          <footer className="w-full py-6 px-4 border-t border-[#245BDB]/15 text-center text-xs text-[#7B8494] bg-[#F5F7FB]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#202633]">FARZA · فَرْزَة</span>
                <span>—</span>
                <span>منصة حجز مقاعد النقل بين المدن اليمنية</span>
              </div>

              {/* Legal & Compliance Quick Links */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
                <button
                  onClick={() => handleOpenPrivacy('privacy')}
                  className="hover:text-[#245BDB] font-medium transition-colors cursor-pointer"
                >
                  سياسة الخصوصية
                </button>
                <span>·</span>
                <button
                  onClick={() => handleOpenPrivacy('terms')}
                  className="hover:text-[#245BDB] font-medium transition-colors cursor-pointer"
                >
                  شروط الاستخدام
                </button>
                <span>·</span>
                <button
                  onClick={() => handleOpenPrivacy('consents')}
                  className="hover:text-[#245BDB] font-medium transition-colors cursor-pointer"
                >
                  مركز الخصوصية والأذونات
                </button>
                <span>·</span>
                <button
                  onClick={() => setShowSplash(true)}
                  className="hover:text-[#245BDB] transition-colors cursor-pointer"
                >
                  المقدمة
                </button>
                <span>·</span>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="hover:text-[#245BDB] font-bold transition-colors cursor-pointer"
                >
                  خدمة العملاء ({settings.customerServicePhone})
                </button>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
