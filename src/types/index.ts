export type UserRole = 'passenger' | 'driver' | 'admin';

export type DriverVerificationStatus = 'new' | 'pending' | 'verified' | 'rejected' | 'suspended';

export type BookingStatus =
  | 'pending_driver'
  | 'accepted_unpaid_commission'
  | 'commission_pending_verification'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type TripStatus =
  | 'draft'
  | 'published'
  | 'active'
  | 'full'
  | 'in_transit'
  | 'arrived'
  | 'completed'
  | 'cancelled';

export interface Vehicle {
  model: string;
  type: string;
  year: number;
  color: string;
  plateNumber: string;
  totalSeats: number;
  photoUrl: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  nationalIdNumber: string;
  rating: number;
  ratingCount: number;
  verificationStatus: DriverVerificationStatus;
  verifiedBadge: boolean;
  vehicle: Vehicle;
  baseCity: string;
  servicedCities: string[];
  completedTripsCount: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  driverRating: number;
  isVerified: boolean;
  fromCity: string;
  fromArea: string;
  toCity: string;
  toArea: string;
  intermediateStops?: string[]; // Intermediate cities or stops along route
  date: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number; // in YER
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  vehiclePhoto: string;
  notes?: string;
  status: TripStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  tripId: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerPhoto?: string;
  seatsCount: number;
  seatNumbers?: number[];
  pickupPoint?: string; // e.g. 'فرزة باب اليمن - جولة خولان'
  dropoffPoint?: string; // e.g. 'الشيخ عثمان - جولة كراع'
  pricePerSeat: number;
  totalAmount: number; // in YER
  commissionAmount: number; // 20%
  status: BookingStatus;
  paymentRef?: string;
  paymentBank?: string;
  paymentReceiptUrl?: string;
  commissionPaidAt?: string;
  commissionApprovedAt?: string;
  createdAt: string;
  hasRated?: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'passenger' | 'driver' | 'admin';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface CommissionPayment {
  id: string;
  bookingId: string;
  tripId: string;
  driverId: string;
  driverName: string;
  amount: number;
  bankName: string;
  refNumber: string;
  receiptPhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  areas: string[];
  active: boolean;
  coordinates?: { x: number; y: number };
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  tripId?: string;
  bookingId?: string;
  issueType: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
}

export interface SystemSettings {
  commissionRatePercent: number; // default 20%
  customerServicePhone: string; // '739992781'
  splashDurationSeconds: number; // default 3.5
  splashAdEnabled: boolean;
  splashAdTitle: string;
  splashAdDescription: string;
  splashAdImage: string;
  appSlogan: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  allowLocation: boolean;
  notificationsEnabled: boolean;
  bookingAlerts: boolean;
  tripReminders: boolean;
  promotionsAlerts: boolean;
  chatSound: boolean;
  favoriteCities: string[];
  preferredSeat: 'front' | 'window' | 'any';
}

export interface PassengerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  connectedProviders: ('phone' | 'google' | 'apple')[];
  createdAt: string;
}

