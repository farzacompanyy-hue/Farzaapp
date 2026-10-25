import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MainRoleSelectScreen } from './components/MainRoleSelectScreen';
import { Header } from './components/Header';
import { WaslaLogo } from './components/WaslaLogo';
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
import { BottomNavBar, BottomNavTab } from './components/BottomNavBar';
import { NotificationsModal } from './components/NotificationsModal';
import {
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_SETTINGS,
  YEMEN_CITIES,
  INITIAL_COMPLAINTS,
  INITIAL_REVIEWS,
  INITIAL_SOS_ALERTS,
} from './data/mockData';
import {
  UserRole,
  Trip,
  Booking,
  Driver,
  SystemSettings,
  ChatMessage,
  Complaint,
  Review,
  SOSAlert,
  LuggageDetails,
  CargoDetails,
} from './types';

export default function App() {
  // Check standalone public legal URL parameter (?page=privacy | ?page=terms | ?page=delete-account)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const pageParam = urlParams.get('page') as 'privacy' | 'terms' | 'delete-account' | null;
  const [activeLegalPage, setActiveLegalPage] = useState<'privacy' | 'terms' | 'delete-account' | null>(pageParam);

  // Splash state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // Auth state & Bottom Nav visibility rule
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wasla_user_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // App state
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(INITIAL_SOS_ALERTS);

  // Authentication login / logout handlers
  const handleUserLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('wasla_user_authenticated', 'true');
    } catch {
      // ignore
    }
    navigateToRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('wasla_user_authenticated');
    } catch {
      // ignore
    }
    setCurrentRole(null);
  };

  // Active Modals: Chat, Support, Install, Privacy Center, Settings & Notifications
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showPassengerSettings, setShowPassengerSettings] = useState<boolean>(false);
  const [showDriverSettings, setShowDriverSettings] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [passengerTab, setPassengerTab] = useState<'search' | 'my_bookings'>('search');
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms' | 'consents' | 'delete' | 'contact'>('privacy');

  // Universal Navigation & Mobile / Android Hardware Back Button Handling
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 1. If any modal is open, close it first without navigating away
      if (showNotifications) {
        setShowNotifications(false);
        return;
      }
      if (showPassengerSettings) {
        setShowPassengerSettings(false);
        return;
      }
      if (showDriverSettings) {
        setShowDriverSettings(false);
        return;
      }
      if (showPrivacyModal) {
        setShowPrivacyModal(false);
        return;
      }
      if (showSupportModal) {
        setShowSupportModal(false);
        return;
      }
      if (showInstallModal) {
        setShowInstallModal(false);
        return;
      }
      if (activeChatBookingId) {
        setActiveChatBookingId(null);
        return;
      }

      // 2. If inside an inner role view (Passenger / Driver / Admin), return to Home
      if (currentRole !== null) {
        setCurrentRole(null);
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    showNotifications,
    showPassengerSettings,
    showDriverSettings,
    showPrivacyModal,
    showSupportModal,
    showInstallModal,
    activeChatBookingId,
    currentRole,
  ]);

  // Safe navigation helpers that push history states
  const navigateToRole = (role: UserRole | null) => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ role }, '', role ? `?role=${role}` : window.location.pathname);
    }
    setCurrentRole(role);
  };

  const openModalSafely = (setter: React.Dispatch<React.SetStateAction<boolean>>, name: string) => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ modal: name }, '', window.location.href);
    }
    setter(true);
  };

  const handleOpenPrivacy = (
    tab: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact' = 'privacy'
  ) => {
    setPrivacyTab(tab);
    openModalSafely(setShowPrivacyModal, 'privacy');
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
  const handleBookTrip = (
    tripId: string,
    seatsCount: number,
    name: string,
    phone: string,
    pickupPoint?: string,
    dropoffPoint?: string,
    seatNumbers?: number[],
    bookingType: 'seats' | 'cargo' | 'charter' = 'seats',
    luggage?: LuggageDetails,
    cargoDetails?: CargoDetails,
    isFullVehicleCharter?: boolean
  ) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    let totalAmount = seatsCount * trip.pricePerSeat;
    if (bookingType === 'cargo') {
      totalAmount = trip.cargoMinPrice || 3000;
    } else if (isFullVehicleCharter) {
      totalAmount = trip.charterPrice || Math.round(trip.totalSeats * trip.pricePerSeat * 0.95);
    }
    const commissionAmount = Math.round(totalAmount * (settings.commissionRatePercent / 100));

    const newBooking: Booking = {
      id: `bk-${Math.floor(100 + Math.random() * 900)}`,
      tripId,
      passengerId: 'usr-current',
      passengerName: name,
      passengerPhone: phone,
      bookingType,
      seatsCount: isFullVehicleCharter ? trip.totalSeats : seatsCount,
      seatNumbers: seatNumbers || [],
      pickupPoint: pickupPoint || trip.fromArea,
      dropoffPoint: dropoffPoint || trip.toArea,
      pricePerSeat: trip.pricePerSeat,
      totalAmount,
      commissionAmount,
      luggage,
      cargoDetails,
      isFullVehicleCharter,
      status: 'pending_driver',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update remaining seats on trip (only for passenger seats & charter)
    if (bookingType !== 'cargo') {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === tripId
            ? {
                ...t,
                availableSeats: isFullVehicleCharter ? 0 : Math.max(0, t.availableSeats - seatsCount),
              }
            : t
        )
      );
    }
  };

  const handleUpdateTripSeats = (tripId: string, newAvailableSeats: number) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, availableSeats: Math.max(0, Math.min(t.totalSeats, newAvailableSeats)) }
          : t
      )
    );
  };

  const handleRateDriver = (bookingId: string, rating: number, comment: string = '') => {
    const booking = bookings.find((b) => b.id === bookingId);
    const trip = booking ? trips.find((t) => t.id === booking.tripId) : undefined;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, hasRated: true, ratingScore: rating, ratingComment: comment }
          : b
      )
    );

    if (trip) {
      const newReview: Review = {
        id: `rev-${Date.now().toString().slice(-4)}`,
        driverId: trip.driverId,
        passengerId: booking?.passengerId || 'usr-current',
        passengerName: booking?.passengerName || 'راكب وَصْلَة',
        tripId: trip.id,
        bookingId,
        rating,
        comment: comment || 'خدمة ممتازة وسائق متميز.',
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
    }
  };

  const handleTriggerSOS = (alertData: Omit<SOSAlert, 'id' | 'createdAt' | 'status'>) => {
    const newAlert: SOSAlert = {
      ...alertData,
      id: `sos-${Date.now().toString().slice(-4)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setSosAlerts((prev) => [newAlert, ...prev]);
  };

  const handleResolveSOS = (alertId: string) => {
    setSosAlerts((prev) =>
      prev.map((s) => (s.id === alertId ? { ...s, status: 'resolved' } : s))
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
      userName: currentRole === 'driver' ? currentDriver.name : 'مستخدم وَصْلَة',
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

  // Active Bottom Nav Tab calculation
  const getBottomNavTab = (): BottomNavTab => {
    if (showNotifications) return 'notifications';
    if (showPassengerSettings || showDriverSettings) return 'profile';
    if (currentRole === 'driver') return 'trips';
    if (currentRole === 'passenger' && passengerTab === 'my_bookings') return 'trips';
    return 'home';
  };

  const activeTripsCount = currentRole === 'driver'
    ? trips.filter((t) => t.status === 'published').length
    : bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending_driver').length;

  const handleBottomNavSelect = (tab: BottomNavTab) => {
    if (tab === 'home') {
      setShowNotifications(false);
      setShowPassengerSettings(false);
      setShowDriverSettings(false);
      setShowPrivacyModal(false);
      setShowSupportModal(false);
      setShowInstallModal(false);
      setActiveChatBookingId(null);
      navigateToRole(null);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (tab === 'trips') {
      setShowNotifications(false);
      setShowPassengerSettings(false);
      setShowDriverSettings(false);
      if (currentRole === 'driver') {
        // stay in driver view
      } else {
        navigateToRole('passenger');
        setPassengerTab('my_bookings');
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (tab === 'notifications') {
      openModalSafely(setShowNotifications, 'notifications');
    } else if (tab === 'profile') {
      if (currentRole === 'driver') {
        openModalSafely(setShowDriverSettings, 'driver_settings');
      } else {
        openModalSafely(setShowPassengerSettings, 'passenger_settings');
      }
    }
  };

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
            onSelectRole={(role) => navigateToRole(role)}
            onReplayIntro={() => setShowSplash(true)}
            onOpenSupport={() => openModalSafely(setShowSupportModal, 'support')}
            onOpenInstall={() => openModalSafely(setShowInstallModal, 'install')}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
            onOpenSettings={() => {
              if (currentRole === 'driver') openModalSafely(setShowDriverSettings, 'driver_settings');
              else openModalSafely(setShowPassengerSettings, 'passenger_settings');
            }}
            customerPhone={settings.customerServicePhone}
          />

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1 pb-24 sm:pb-28">
            {currentRole === null ? (
              /* THE MAIN DASHBOARD SCREEN (Immediately follows the introduction) */
              <MainRoleSelectScreen
                onSelectRole={(role) => handleUserLogin(role)}
                onReplayIntro={() => setShowSplash(true)}
                onOpenSupport={() => openModalSafely(setShowSupportModal, 'support')}
                onOpenInstall={() => openModalSafely(setShowInstallModal, 'install')}
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
                reviews={reviews}
                onBookTrip={handleBookTrip}
                onOpenChat={(bookingId) => {
                  setActiveChatBookingId(bookingId);
                  if (typeof window !== 'undefined' && window.history) {
                    window.history.pushState({ modal: 'chat' }, '', window.location.href);
                  }
                }}
                onRateDriver={handleRateDriver}
                onTriggerSOS={handleTriggerSOS}
                onOpenSettings={() => openModalSafely(setShowPassengerSettings, 'passenger_settings')}
                initialTab={passengerTab}
                onBackToHome={() => navigateToRole(null)}
              />
            ) : currentRole === 'driver' ? (
              /* DRIVER INTERCITY FLEET & COMMISSION VIEW */
              <DriverView
                driver={currentDriver}
                trips={trips}
                bookings={bookings}
                cities={YEMEN_CITIES}
                reviews={reviews}
                commissionRate={settings.commissionRatePercent}
                onCreateTrip={handleCreateTrip}
                onAcceptBooking={handleAcceptBooking}
                onRejectBooking={handleRejectBooking}
                onSubmitCommissionReceipt={handleSubmitCommissionReceipt}
                onOpenChat={(bookingId) => {
                  setActiveChatBookingId(bookingId);
                  if (typeof window !== 'undefined' && window.history) {
                    window.history.pushState({ modal: 'chat' }, '', window.location.href);
                  }
                }}
                onOpenSettings={() => openModalSafely(setShowDriverSettings, 'driver_settings')}
                onBackToHome={() => navigateToRole(null)}
                onUpdateTripSeats={handleUpdateTripSeats}
              />
            ) : (
              /* ADMIN DASHBOARD & VERIFICATION VIEW */
              <AdminView
                drivers={drivers}
                trips={trips}
                bookings={bookings}
                settings={settings}
                complaints={complaints}
                sosAlerts={sosAlerts}
                onApproveDriver={handleApproveDriver}
                onRejectDriver={handleRejectDriver}
                onApproveCommission={handleApproveCommission}
                onRejectCommission={handleRejectCommission}
                onUpdateSettings={handleUpdateSettings}
                onResolveSOS={handleResolveSOS}
                onBackToHome={() => navigateToRole(null)}
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
                userName: 'مستخدم وَصْلَة (الحالي)',
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
                handleLogout();
              }}
              onAccountDeleted={(phone) => {
                setShowPassengerSettings(false);
                handleAccountDeleted(phone);
                handleLogout();
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
                handleLogout();
              }}
              onAccountDeleted={(phone) => {
                setShowDriverSettings(false);
                handleAccountDeleted(phone);
                handleLogout();
              }}
              customerPhone={settings.customerServicePhone}
            />
          )}

          {/* NOTIFICATIONS MODAL */}
          {showNotifications && (
            <NotificationsModal
              bookings={bookings}
              onClose={() => setShowNotifications(false)}
              onOpenChat={(bookingId) => {
                setShowNotifications(false);
                setActiveChatBookingId(bookingId);
                if (typeof window !== 'undefined' && window.history) {
                  window.history.pushState({ modal: 'chat' }, '', window.location.href);
                }
              }}
              onNavigateToTrips={() => {
                setShowNotifications(false);
                navigateToRole('passenger');
                setPassengerTab('my_bookings');
              }}
            />
          )}

          {/* FOOTER WITH COMPREHENSIVE PRIVACY & LEGAL LINKS */}
          <footer className="w-full py-6 px-4 border-t border-[#0056B3]/15 text-center text-xs text-[#7B8494] bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <WaslaLogo size="xs" showText={false} />
                <span className="font-black text-[#1A2536]">WASLA · وَصْلَة</span>
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
                  onClick={() => openModalSafely(setShowSupportModal, 'support')}
                  className="hover:text-[#245BDB] font-bold transition-colors cursor-pointer"
                >
                  خدمة العملاء ({settings.customerServicePhone})
                </button>
              </div>
            </div>
          </footer>

          {/* PERSISTENT BOTTOM NAVIGATION BAR (APP DOCK) - ONLY VISIBLE WHEN USER IS AUTHENTICATED */}
          {isAuthenticated && (
            <BottomNavBar
              activeTab={getBottomNavTab()}
              currentRole={currentRole}
              unreadNotificationsCount={2}
              activeTripsCount={activeTripsCount}
              onSelectTab={handleBottomNavSelect}
            />
          )}
        </>
      )}
    </div>
  );
}
