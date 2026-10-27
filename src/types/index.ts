export type MembershipStatus = 'active' | 'pending' | 'expired';

export type UserRole = 'visitor' | 'member' | 'pending' | 'admin';

export type Language = 'en' | 'fr';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ChildProfile {
  childName: string;
  age: number;
  beltRank?: string;
  medicalNotes?: string;
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: MembershipStatus;
  joinDate: string;
  renewalDate: string;
  services: string[]; // e.g., 'Taekwondo for Kids', 'Group Aerobics'
  emergencyContact: EmergencyContact;
  childProfile?: ChildProfile;
  notes?: string;
  qrCodeId: string;
  paymentMethod?: 'in_person' | 'stripe';
  lastPaymentAmount?: number;
}

export interface SportService {
  id: string;
  title: string;
  tagline: string;
  category: 'aerobics' | 'strength' | 'dance' | 'taekwondo' | 'pt' | 'opengym' | 'hiking';
  description: string;
  scheduleSummary: string;
  pricingMonthly: number;
  pricingLabel: string;
  image?: string;
  instructor: string;
  capacity: number;
  currentEnrolled: number;
  features: string[];
}

export interface TimetableClass {
  id: string;
  serviceId: string;
  serviceName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  capacity: number;
  bookedMemberIds: string[];
  waitlistMemberIds: string[];
  level: 'All Levels' | 'Beginner' | 'Intermediate / Advanced' | 'Kids 5-12';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Classes' | 'Hiking & Events' | 'Kids Program' | 'Facility';
  pinned?: boolean;
  author: string;
}

export interface HikingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  elevationGain: string;
  distance: string;
  difficulty: 'Moderate' | 'Challenging' | 'Family Friendly';
  cost: number; // 0 = free
  maxCapacity: number;
  registeredMemberIds: string[];
  guide: string;
  description: string;
}

export interface TelegramMessage {
  id: string;
  timestamp: string;
  sender: 'TM Sports Bot' | 'Coach Marcus (Admin)';
  type: 'announcement' | 'reminder' | 'payment' | 'event' | 'schedule';
  text: string;
  read: boolean;
}
