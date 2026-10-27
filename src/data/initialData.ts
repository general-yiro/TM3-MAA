import { SportService, Member, TimetableClass, Announcement, HikingEvent, TelegramMessage } from '../types';

export const INITIAL_SERVICES: SportService[] = [
  {
    id: 'aerobics',
    title: 'Group Aerobics & Cardio',
    tagline: 'High-energy rhythmic conditioning and athletic step intervals',
    category: 'aerobics',
    description: 'Electrifying 50-minute instructor-led sessions combining step choreography, athletic agility ladders, and heart-rate zone cardio. Built to enhance stamina, burn calories, and build endurance with motivating playlists.',
    scheduleSummary: 'Mon / Wed / Fri · 7:00 AM & 6:00 PM',
    pricingMonthly: 65,
    pricingLabel: '$65 / mo or included in Full Access',
    image: '/src/assets/images/service_aerobics_group_1793107475923.jpg',
    instructor: 'Coach Elena Ramos',
    capacity: 25,
    currentEnrolled: 22,
    features: ['High-impact & low-impact options', 'Step platforms & resistance bands', 'Heart rate pacing guidance', 'Morning & evening slots']
  },
  {
    id: 'strength',
    title: 'Strength & Weight Training',
    tagline: 'Progressive overload, barbell lifting, and functional athletic power',
    category: 'strength',
    description: 'Structured small-group strength programming led by certified strength coaches. Focus on squats, deadlifts, presses, and athletic kettlebell complexes with strict form correction and personalized weight tracking.',
    scheduleSummary: 'Tue / Thu / Sat · 8:00 AM & 5:30 PM',
    pricingMonthly: 85,
    pricingLabel: '$85 / mo',
    instructor: 'Coach Marcus Vance',
    capacity: 18,
    currentEnrolled: 16,
    features: ['Eleiko barbells & bumper plates', 'Squat racks & bench stations', 'Bi-weekly strength tracking logs', 'Targeted hypertrophy & power']
  },
  {
    id: 'taekwondo',
    title: 'Taekwondo for Kids',
    tagline: 'Character, discipline, and agility martial arts for youth ages 5–12',
    category: 'taekwondo',
    description: 'Separate dedicated youth martial arts program emphasizing core tenets: courtesy, integrity, perseverance, self-control, and indomitable spirit. Taught by certified 4th Dan masters with belt rank advancement exams.',
    scheduleSummary: 'Tue / Thu · 4:15 PM & Sat · 10:00 AM',
    pricingMonthly: 90,
    pricingLabel: '$90 / mo (Separate Youth Enrollment)',
    image: '/src/assets/images/service_taekwondo_kids_1793107475549.jpg',
    instructor: 'Master Jin-Woo Park (4th Dan)',
    capacity: 20,
    currentEnrolled: 18,
    features: ['Official belt advancement curriculum', 'Agility drills & sparring discipline', 'Parent pickup confirmation alerts', 'Quarterly belt tests & certificates']
  },
  {
    id: 'hiking',
    title: 'Outdoor Hiking & Trail Summits',
    tagline: 'Guided weekend mountain ridges, nature treks, and elevation challenges',
    category: 'hiking',
    description: 'Community trail excursions throughout regional mountain parks and alpine ridges. Led by certified wilderness guides with designated trail leaders, safety gear checks, and post-hike group socials. Mix of free & scenic paid permits.',
    scheduleSummary: 'Alternate Saturdays & Sundays · 7:30 AM departure',
    pricingMonthly: 0,
    pricingLabel: 'Free for members · $25/summit for permits/transport',
    image: '/src/assets/images/service_hiking_mountains_1793107477262.jpg',
    instructor: 'David Miller (Wilderness EMT)',
    capacity: 30,
    currentEnrolled: 24,
    features: ['Scenic 6km to 18km curated trails', 'Trek safety briefings & GPS route maps', 'Carpool coordination assistance', 'Post-summit recovery picnic']
  },
  {
    id: 'dance',
    title: 'Athletic Dance Classes',
    tagline: 'Cardio hip-hop, latin pulse, and athletic rhythm coordination',
    category: 'dance',
    description: 'Dynamic rhythm-fueled cardio dance sessions designed to challenge your agility, coordination, and aerobic fitness. Accessible to all skill levels with high-octane energy and infectious choreography.',
    scheduleSummary: 'Mon / Wed · 7:15 PM',
    pricingMonthly: 60,
    pricingLabel: '$60 / mo',
    instructor: 'Chloe Fontaine',
    capacity: 22,
    currentEnrolled: 19,
    features: ['High-energy playlist selections', 'Full-body cardiovascular burn', 'Coordination & mobility building', 'No prior dance experience needed']
  },
  {
    id: 'pt',
    title: '1-on-1 Personal Training',
    tagline: 'Customized periodization, mobility, and private athletic coaching',
    category: 'pt',
    description: 'Tailored private training packages designed around your specific athletic milestones, injury rehabilitation, or competition prep. Includes full bio-mechanical assessment and 3D nutrition tracking guidance.',
    scheduleSummary: 'By Appointment · Mon through Sat',
    pricingMonthly: 160,
    pricingLabel: '$160 / 4 sessions ($45/session drop-in)',
    instructor: 'Marcus Vance & Senior Staff',
    capacity: 12,
    currentEnrolled: 10,
    features: ['Individual movement screening', 'Custom periodization blueprint', 'Weekly body composition check-in', 'Direct 1-on-1 coach chat']
  },
  {
    id: 'opengym',
    title: 'Open Gym Access',
    tagline: 'Independent training floor access, cardio theater, and free weight zone',
    category: 'opengym',
    description: 'Unrestricted independent training access from 5:00 AM to 11:00 PM daily. Full access to Olympic platforms, dumbbells up to 125 lbs, cable stations, Assault bikes, Concept2 rowers, and locker amenities.',
    scheduleSummary: 'Daily · 5:00 AM – 11:00 PM',
    pricingMonthly: 50,
    pricingLabel: '$50 / mo (Included in Full Membership)',
    instructor: 'Floor Supervisor on Duty',
    capacity: 60,
    currentEnrolled: 54,
    features: ['Keycard & mobile QR scan entry', 'Olympic lifting chalk stations', 'Concept2 cardio conditioning rowers', 'Showers & private locker rooms']
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'tm-mem-101',
    fullName: 'Alex Rivers',
    email: 'alex.rivers@sportsmail.com',
    phone: '+1 (555) 234-8891',
    status: 'active',
    joinDate: '2026-02-15',
    renewalDate: '2026-11-15',
    services: ['Strength & Weight Training', 'Open Gym Access', 'Outdoor Hiking & Trail Summits'],
    emergencyContact: {
      name: 'Jordan Rivers',
      relationship: 'Spouse',
      phone: '+1 (555) 234-8892'
    },
    qrCodeId: 'TM-PASS-8472-A',
    paymentMethod: 'stripe',
    lastPaymentAmount: 85
  },
  {
    id: 'tm-mem-102',
    fullName: 'Sarah Lin',
    email: 'sarah.lin@community.ca',
    phone: '+1 (555) 782-3341',
    status: 'pending',
    joinDate: '2026-10-25',
    renewalDate: '2026-11-25',
    services: ['Taekwondo for Kids', 'Group Aerobics & Cardio'],
    emergencyContact: {
      name: 'David Lin',
      relationship: 'Brother',
      phone: '+1 (555) 782-9900'
    },
    childProfile: {
      childName: 'Lucas Lin',
      age: 8,
      beltRank: 'Yellow Stripe Belt',
      medicalNotes: 'Mild asthma (inhaler kept in sports backpack)'
    },
    notes: 'Registered online yesterday. Awaiting coach approval and in-person orientation.',
    qrCodeId: 'TM-PASS-9901-P',
    paymentMethod: 'in_person'
  },
  {
    id: 'tm-mem-103',
    fullName: 'Marcus Dubois',
    email: 'm.dubois@peakmail.org',
    phone: '+1 (555) 449-1204',
    status: 'expired',
    joinDate: '2025-08-10',
    renewalDate: '2026-10-10',
    services: ['1-on-1 Personal Training', 'Open Gym Access'],
    emergencyContact: {
      name: 'Claire Dubois',
      relationship: 'Partner',
      phone: '+1 (555) 449-8833'
    },
    notes: 'Membership expired 17 days ago. Sent renewal notice on Oct 12.',
    qrCodeId: 'TM-PASS-3112-E',
    paymentMethod: 'stripe',
    lastPaymentAmount: 160
  },
  {
    id: 'tm-mem-104',
    fullName: 'Liam O’Connor',
    email: 'liam.oc@athletics.net',
    phone: '+1 (555) 670-4492',
    status: 'active',
    joinDate: '2026-03-01',
    renewalDate: '2026-11-01',
    services: ['Group Aerobics & Cardio', 'Athletic Dance Classes', 'Outdoor Hiking & Trail Summits'],
    emergencyContact: {
      name: 'Fiona O’Connor',
      relationship: 'Mother',
      phone: '+1 (555) 670-1122'
    },
    qrCodeId: 'TM-PASS-4421-A',
    paymentMethod: 'stripe',
    lastPaymentAmount: 65
  },
  {
    id: 'tm-mem-105',
    fullName: 'Emily Chen-Morales',
    email: 'emily.chen@familyfitness.com',
    phone: '+1 (555) 819-2019',
    status: 'active',
    joinDate: '2026-01-18',
    renewalDate: '2026-11-18',
    services: ['Taekwondo for Kids', 'Open Gym Access'],
    emergencyContact: {
      name: 'Carlos Morales',
      relationship: 'Spouse',
      phone: '+1 (555) 819-5566'
    },
    childProfile: {
      childName: 'Mia Morales',
      age: 6,
      beltRank: 'Green Belt',
      medicalNotes: 'No allergies. Very eager to advance to Blue Belt.'
    },
    qrCodeId: 'TM-PASS-7734-A',
    paymentMethod: 'stripe',
    lastPaymentAmount: 90
  },
  {
    id: 'tm-mem-106',
    fullName: 'Jackson Taylor',
    email: 'jtaylor@northwestlift.com',
    phone: '+1 (555) 302-8814',
    status: 'active',
    joinDate: '2026-05-12',
    renewalDate: '2026-11-12',
    services: ['Strength & Weight Training', 'Open Gym Access'],
    emergencyContact: {
      name: 'Hannah Taylor',
      relationship: 'Sister',
      phone: '+1 (555) 302-9901'
    },
    qrCodeId: 'TM-PASS-5599-A',
    paymentMethod: 'in_person',
    lastPaymentAmount: 85
  }
];

export const INITIAL_CLASSES: TimetableClass[] = [
  {
    id: 'cls-1',
    serviceId: 'aerobics',
    serviceName: 'Group Aerobics (Sunrise Step)',
    dayOfWeek: 'Monday',
    startTime: '07:00 AM',
    endTime: '07:50 AM',
    room: 'Studio Alpha',
    instructor: 'Elena Ramos',
    capacity: 25,
    bookedMemberIds: ['tm-mem-101', 'tm-mem-104'],
    waitlistMemberIds: [],
    level: 'All Levels'
  },
  {
    id: 'cls-2',
    serviceId: 'dance',
    serviceName: 'Athletic Latin Cardio Fusion',
    dayOfWeek: 'Monday',
    startTime: '07:15 PM',
    endTime: '08:15 PM',
    room: 'Studio Alpha',
    instructor: 'Chloe Fontaine',
    capacity: 22,
    bookedMemberIds: ['tm-mem-104'],
    waitlistMemberIds: [],
    level: 'All Levels'
  },
  {
    id: 'cls-3',
    serviceId: 'strength',
    serviceName: 'Barbell Hypertrophy & Deadlift Lab',
    dayOfWeek: 'Tuesday',
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    room: 'Weight Rig Zone',
    instructor: 'Coach Marcus Vance',
    capacity: 18,
    bookedMemberIds: ['tm-mem-101', 'tm-mem-106'],
    waitlistMemberIds: [],
    level: 'Intermediate / Advanced'
  },
  {
    id: 'cls-4',
    serviceId: 'taekwondo',
    serviceName: 'Youth Taekwondo (White to Yellow Belts)',
    dayOfWeek: 'Tuesday',
    startTime: '04:15 PM',
    endTime: '05:15 PM',
    room: 'Dojo Hall B',
    instructor: 'Master Jin-Woo Park',
    capacity: 20,
    bookedMemberIds: ['tm-mem-105'],
    waitlistMemberIds: [],
    level: 'Kids 5-12'
  },
  {
    id: 'cls-5',
    serviceId: 'aerobics',
    serviceName: 'Athletic Step & Core Blast',
    dayOfWeek: 'Wednesday',
    startTime: '06:00 PM',
    endTime: '06:50 PM',
    room: 'Studio Alpha',
    instructor: 'Elena Ramos',
    capacity: 25,
    bookedMemberIds: ['tm-mem-104'],
    waitlistMemberIds: [],
    level: 'All Levels'
  },
  {
    id: 'cls-6',
    serviceId: 'strength',
    serviceName: 'Squat & Overhead Press Conditioning',
    dayOfWeek: 'Thursday',
    startTime: '05:30 PM',
    endTime: '06:30 PM',
    room: 'Weight Rig Zone',
    instructor: 'Coach Marcus Vance',
    capacity: 18,
    bookedMemberIds: ['tm-mem-101', 'tm-mem-106'],
    waitlistMemberIds: [],
    level: 'All Levels'
  },
  {
    id: 'cls-7',
    serviceId: 'taekwondo',
    serviceName: 'Youth Taekwondo (Green & Blue Belts)',
    dayOfWeek: 'Thursday',
    startTime: '04:15 PM',
    endTime: '05:15 PM',
    room: 'Dojo Hall B',
    instructor: 'Master Jin-Woo Park',
    capacity: 20,
    bookedMemberIds: ['tm-mem-105'],
    waitlistMemberIds: [],
    level: 'Kids 5-12'
  },
  {
    id: 'cls-8',
    serviceId: 'aerobics',
    serviceName: 'TGIF HIIT Cardio Party',
    dayOfWeek: 'Friday',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    room: 'Studio Alpha',
    instructor: 'Elena Ramos',
    capacity: 25,
    bookedMemberIds: ['tm-mem-101', 'tm-mem-104'],
    waitlistMemberIds: [],
    level: 'All Levels'
  },
  {
    id: 'cls-9',
    serviceId: 'taekwondo',
    serviceName: 'Youth Weekend Sparring & Poomsae',
    dayOfWeek: 'Saturday',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    room: 'Dojo Hall B',
    instructor: 'Master Jin-Woo Park',
    capacity: 20,
    bookedMemberIds: ['tm-mem-105'],
    waitlistMemberIds: [],
    level: 'Kids 5-12'
  },
  {
    id: 'cls-10',
    serviceId: 'strength',
    serviceName: 'Strongman & Functional Kettlebells',
    dayOfWeek: 'Saturday',
    startTime: '11:30 AM',
    endTime: '12:45 PM',
    room: 'Main Turf & Rig',
    instructor: 'Coach Marcus Vance',
    capacity: 18,
    bookedMemberIds: ['tm-mem-101'],
    waitlistMemberIds: [],
    level: 'All Levels'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Fall Ridge Summit Hike Scheduled for Next Saturday',
    content: 'Registration is now open for our November Alpine Ridge 12km hike. Departure at 7:30 AM from the TM facility parking lot. Carpools organized via the Telegram channel. Remember to bring sturdy ankle boots, 2L water, and snacks!',
    date: '2026-10-26',
    category: 'Hiking & Events',
    pinned: true,
    author: 'Coach Marcus Vance'
  },
  {
    id: 'ann-2',
    title: 'Kids Taekwondo Quarterly Belt Promotion Exam Date',
    content: 'Master Jin-Woo has announced the Autumn belt rank advancement testing on Saturday, November 14th at 2:00 PM. Parents of eligible yellow, green, and blue belt candidates will receive individual attendance confirmation notices.',
    date: '2026-10-24',
    category: 'Kids Program',
    pinned: true,
    author: 'Master Jin-Woo Park'
  },
  {
    id: 'ann-3',
    title: 'New Eleiko Competition Barbells & Calibrated Plates Arrived',
    content: 'We have upgraded the main weight room with four new Olympic barbells and 400kg of bumper plates to accommodate the growing morning strength team. Please ensure collars are used at all times and re-rack your weights.',
    date: '2026-10-20',
    category: 'Facility',
    pinned: false,
    author: 'Coach Marcus Vance'
  },
  {
    id: 'ann-4',
    title: 'Winter Class Timetable Adjustments Starting Nov 1',
    content: 'Check out the refreshed winter schedule. We are adding an extra 7:00 AM Aerobics class on Wednesdays and a Saturday morning kettlebell endurance session. Review the timetable tab to secure your spot.',
    date: '2026-10-18',
    category: 'Classes',
    pinned: false,
    author: 'Elena Ramos'
  }
];

export const INITIAL_HIKES: HikingEvent[] = [
  {
    id: 'hike-1',
    title: 'Cascade Ridge & Pine Valley Trail',
    date: 'Saturday, Nov 07 · 07:30 AM',
    location: 'Mount Sentinel Provincial Park',
    elevationGain: '540 m',
    distance: '11.8 km loop',
    difficulty: 'Moderate',
    cost: 0,
    maxCapacity: 25,
    registeredMemberIds: ['tm-mem-101', 'tm-mem-104'],
    guide: 'David Miller (Lead) & Marcus Vance',
    description: 'Scenic autumn canopy walk leading to panoramic 360-degree lookout over the valley. High-grade trail with moderate rock scramble near the summit crest.'
  },
  {
    id: 'hike-2',
    title: 'Black Bear Peak Summit & Alpine Lakes',
    date: 'Sunday, Nov 22 · 06:45 AM',
    location: 'Highland Alpine Wilderness',
    elevationGain: '920 m',
    distance: '16.4 km out-and-back',
    difficulty: 'Challenging',
    cost: 25,
    maxCapacity: 18,
    registeredMemberIds: ['tm-mem-101'],
    guide: 'David Miller & Sarah Jenkins',
    description: 'Advanced alpine push requiring steady endurance and windproof layers. Special park conservation permit included in fee with chartered minibus shuttle.'
  }
];

export const INITIAL_TELEGRAM_MESSAGES: TelegramMessage[] = [
  {
    id: 'tg-1',
    timestamp: 'Today at 08:30 AM',
    sender: 'TM Sports Bot',
    type: 'announcement',
    text: '📢 [ANNOUNCEMENT] Fall Ridge Summit Hike registration is now live! 18 spots remaining. Tap below to reserve your place.',
    read: false
  },
  {
    id: 'tg-2',
    timestamp: 'Yesterday at 05:15 PM',
    sender: 'TM Sports Bot',
    type: 'reminder',
    text: '👶 [TAEKWONDO] Child Lucas Lin has checked in for White/Yellow Belt training with Master Park. Scheduled pickup: 05:15 PM.',
    read: true
  },
  {
    id: 'tg-3',
    timestamp: 'Oct 25 at 09:00 AM',
    sender: 'TM Sports Bot',
    type: 'payment',
    text: '💳 [STRIPE RECEIPT] Payment of $85.00 confirmed for Strength & Weight Training (Monthly). Membership active until Nov 15.',
    read: true
  },
  {
    id: 'tg-4',
    timestamp: 'Oct 23 at 07:10 AM',
    sender: 'Coach Marcus (Admin)',
    type: 'schedule',
    text: '⚠️ Heads up team: Heavy rain predicted for this afternoon. All outdoor running conditioning will be moved to the indoor turf rig.',
    read: true
  }
];
