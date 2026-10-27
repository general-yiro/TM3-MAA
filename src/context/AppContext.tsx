import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  SportService,
  TimetableClass,
  Announcement,
  HikingEvent,
  TelegramMessage,
  UserRole,
  Language,
  MembershipStatus
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_SERVICES,
  INITIAL_CLASSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_HIKES,
  INITIAL_TELEGRAM_MESSAGES
} from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeMember: Member | null;
  members: Member[];
  services: SportService[];
  classes: TimetableClass[];
  announcements: Announcement[];
  hikes: HikingEvent[];
  telegramMessages: TelegramMessage[];
  // Modals & triggers
  isRegistrationOpen: boolean;
  setIsRegistrationOpen: (open: boolean) => void;
  selectedServiceForJoin: string | null;
  setSelectedServiceForJoin: (serviceTitle: string | null) => void;
  isStripeModalOpen: boolean;
  setIsStripeModalOpen: (open: boolean) => void;
  stripeModalData: { memberId: string; amount: number; description: string } | null;
  openStripeCheckout: (memberId: string, amount: number, description: string) => void;
  isTelegramOpen: boolean;
  setIsTelegramOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (message: string) => void;

  // Actions
  registerNewMember: (data: Omit<Member, 'id' | 'status' | 'joinDate' | 'renewalDate' | 'qrCodeId'>) => Member;
  approveMember: (id: string) => void;
  rejectMember: (id: string, reason?: string) => void;
  changeMemberStatus: (id: string, status: MembershipStatus) => void;
  deleteMember: (id: string) => void;
  bookClass: (classId: string, memberId: string) => boolean;
  cancelClassBooking: (classId: string, memberId: string) => void;
  joinHike: (hikeId: string, memberId: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  completeStripePayment: (memberId: string, amount: number) => void;
  sendTelegramBroadcast: (text: string, type?: TelegramMessage['type']) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('visitor');
  const [language, setLanguage] = useState<Language>('en');

  // Load from localStorage or defaults
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('tm_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [classes, setClasses] = useState<TimetableClass[]>(() => {
    const saved = localStorage.getItem('tm_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('tm_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [hikes, setHikes] = useState<HikingEvent[]>(() => {
    const saved = localStorage.getItem('tm_hikes');
    return saved ? JSON.parse(saved) : INITIAL_HIKES;
  });

  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>(() => {
    const saved = localStorage.getItem('tm_telegram');
    return saved ? JSON.parse(saved) : INITIAL_TELEGRAM_MESSAGES;
  });

  const services = INITIAL_SERVICES;

  // Active member depends on role
  const activeMember: Member | null =
    role === 'member'
      ? members.find((m) => m.id === 'tm-mem-101') || members[0]
      : role === 'pending'
      ? members.find((m) => m.id === 'tm-mem-102') || members.find((m) => m.status === 'pending') || null
      : null;

  // Modals
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedServiceForJoin, setSelectedServiceForJoin] = useState<string | null>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeModalData, setStripeModalData] = useState<{ memberId: string; amount: number; description: string } | null>(null);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tm_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('tm_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('tm_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('tm_hikes', JSON.stringify(hikes));
  }, [hikes]);

  useEffect(() => {
    localStorage.setItem('tm_telegram', JSON.stringify(telegramMessages));
  }, [telegramMessages]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((curr) => (curr === message ? null : curr));
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'visitor') {
      showToast('Switched to Public Visitor view');
    } else if (newRole === 'member') {
      showToast('Switched to Active Member view (Alex Rivers)');
    } else if (newRole === 'pending') {
      showToast('Switched to Pending Applicant view (Sarah Lin)');
    } else if (newRole === 'admin') {
      showToast('Switched to Owner/Admin Console (Coach Marcus)');
    }
  };

  const openStripeCheckout = (memberId: string, amount: number, description: string) => {
    setStripeModalData({ memberId, amount, description });
    setIsStripeModalOpen(true);
  };

  const registerNewMember = (data: Omit<Member, 'id' | 'status' | 'joinDate' | 'renewalDate' | 'qrCodeId'>): Member => {
    const today = new Date().toISOString().split('T')[0];
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    const renewalDate = renewal.toISOString().split('T')[0];

    const newMember: Member = {
      ...data,
      id: `tm-mem-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      joinDate: today,
      renewalDate,
      qrCodeId: `TM-PASS-${Math.floor(1000 + Math.random() * 9000)}-P`,
      paymentMethod: 'in_person'
    };

    setMembers((prev) => [newMember, ...prev]);

    // Send telegram admin notification simulation
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'reminder',
      text: `🆕 [NEW APPLICATION] ${newMember.fullName} applied for: ${newMember.services.join(', ')}. Status: Pending Review.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Application submitted! Welcome ${newMember.fullName}. Review is pending.`);
    return newMember;
  };

  const approveMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'active' as MembershipStatus,
              qrCodeId: m.qrCodeId.replace('-P', '-A')
            }
          : m
      )
    );

    // Notify Telegram
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'announcement',
      text: `✅ [MEMBERSHIP ACTIVATED] Welcome ${member.fullName}! Your membership is now active. Access QR code generated.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Member ${member.fullName} has been approved & activated!`);
  };

  const rejectMember = (id: string, reason?: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'expired' as MembershipStatus,
              notes: `Application rejected: ${reason || 'Incomplete verification'}`
            }
          : m
      )
    );

    showToast(`Application for ${member.fullName} marked as rejected.`);
  };

  const changeMemberStatus = (id: string, status: MembershipStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast(`Membership status updated to ${status}.`);
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member removed from records.');
  };

  const bookClass = (classId: string, memberId: string): boolean => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return false;

    if (targetClass.bookedMemberIds.includes(memberId)) {
      showToast('You are already registered for this session.');
      return false;
    }

    if (targetClass.bookedMemberIds.length >= targetClass.capacity) {
      // Add to waitlist
      if (!targetClass.waitlistMemberIds.includes(memberId)) {
        setClasses((prev) =>
          prev.map((c) =>
            c.id === classId
              ? { ...c, waitlistMemberIds: [...c.waitlistMemberIds, memberId] }
              : c
          )
        );
        showToast('Class is full. You were added to the waitlist!');
      }
      return false;
    }

    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, bookedMemberIds: [...c.bookedMemberIds, memberId] }
          : c
      )
    );

    showToast(`Spot reserved for ${targetClass.serviceName}!`);
    return true;
  };

  const cancelClassBooking = (classId: string, memberId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              bookedMemberIds: c.bookedMemberIds.filter((id) => id !== memberId),
              waitlistMemberIds: c.waitlistMemberIds.filter((id) => id !== memberId)
            }
          : c
      )
    );
    showToast('Class registration cancelled.');
  };

  const joinHike = (hikeId: string, memberId: string) => {
    const targetHike = hikes.find((h) => h.id === hikeId);
    if (!targetHike) return;

    if (targetHike.registeredMemberIds.includes(memberId)) {
      showToast('You are already signed up for this hike.');
      return;
    }

    setHikes((prev) =>
      prev.map((h) =>
        h.id === hikeId
          ? { ...h, registeredMemberIds: [...h.registeredMemberIds, memberId] }
          : h
      )
    );

    // Telegram alert
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'event',
      text: `🥾 [HIKE REGISTRATION] Spot confirmed for ${targetHike.title}. Detailed packing list sent!`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Confirmed for ${targetHike.title}!`);
  };

  const createAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Send Telegram broadcast simulation
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Coach Marcus (Admin)',
      type: 'announcement',
      text: `📢 [BROADCAST] ${newAnn.title}: ${newAnn.content.slice(0, 120)}...`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast('Announcement published & broadcasted to members!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed.');
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  const completeStripePayment = (memberId: string, amount: number) => {
    const target = members.find((m) => m.id === memberId);
    const memberName = target ? target.fullName : 'Member';

    // Extend renewal by 30 days and activate
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    const renewalDate = renewal.toISOString().split('T')[0];

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: 'active' as MembershipStatus,
              renewalDate,
              paymentMethod: 'stripe',
              lastPaymentAmount: amount,
              qrCodeId: m.qrCodeId.replace('-P', '-A').replace('-E', '-A')
            }
          : m
      )
    );

    // Push Stripe receipt to Telegram
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'payment',
      text: `💳 [STRIPE SUCCESS] Payment of $${amount.toFixed(2)} received from ${memberName}. Subscription extended through ${renewalDate}.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Stripe payment of $${amount.toFixed(2)} successful! Account active.`);
  };

  const sendTelegramBroadcast = (text: string, type: TelegramMessage['type'] = 'announcement') => {
    const msg: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Coach Marcus (Admin)',
      type,
      text,
      read: false
    };
    setTelegramMessages((prev) => [msg, ...prev]);
    showToast('Telegram message broadcasted to member channel!');
  };

  const resetAllData = () => {
    setMembers(INITIAL_MEMBERS);
    setClasses(INITIAL_CLASSES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setHikes(INITIAL_HIKES);
    setTelegramMessages(INITIAL_TELEGRAM_MESSAGES);
    localStorage.removeItem('tm_members');
    localStorage.removeItem('tm_classes');
    localStorage.removeItem('tm_announcements');
    localStorage.removeItem('tm_hikes');
    localStorage.removeItem('tm_telegram');
    showToast('All demo data reset to default seed!');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeMember,
        members,
        services,
        classes,
        announcements,
        hikes,
        telegramMessages,
        isRegistrationOpen,
        setIsRegistrationOpen,
        selectedServiceForJoin,
        setSelectedServiceForJoin,
        isStripeModalOpen,
        setIsStripeModalOpen,
        stripeModalData,
        openStripeCheckout,
        isTelegramOpen,
        setIsTelegramOpen,
        toast,
        showToast,
        registerNewMember,
        approveMember,
        rejectMember,
        changeMemberStatus,
        deleteMember,
        bookClass,
        cancelClassBooking,
        joinHike,
        createAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        completeStripePayment,
        sendTelegramBroadcast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
