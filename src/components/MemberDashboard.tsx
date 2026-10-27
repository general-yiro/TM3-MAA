import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  CreditCard,
  Send,
  Calendar,
  Mountain,
  Sparkles,
  RefreshCw,
  Wallet,
  ArrowRight,
  Edit3,
  Phone,
  HeartHandshake,
  Shield,
  Save,
  X,
  Check,
  Activity,
  Trophy,
  CalendarDays
} from 'lucide-react';
import { LeaderboardSection } from './LeaderboardSection';
import { CalendarView } from './CalendarView';

const ALL_DISCIPLINES = [
  'Taekwondo (Ages 4-17)',
  'Taekwondo Adults & Sparring',
  'Aerobics & High-Intensity Cardio',
  'Strength & Functional Fitness',
  'Outdoor Mountain Hiking',
  'Bodybuilding & Open Gym',
  'Private 1-on-1 Martial Arts Coaching'
];

interface MemberDashboardProps {
  onBackToHome: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onBackToHome }) => {
  const {
    activeMember,
    updateMemberProfile,
    classes,
    cancelClassBooking,
    hikes,
    joinHike,
    openStripeCheckout,
    setIsTelegramOpen,
    role,
    setRole,
    showToast,
    language
  } = useApp();

  const [dashboardTab, setDashboardTab] = useState<'overview' | 'leaderboard' | 'calendar'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  useEffect(() => {
    if (activeMember) {
      setEmergencyName(activeMember.emergencyContact?.name || '');
      setEmergencyRelation(activeMember.emergencyContact?.relationship || 'Spouse');
      setEmergencyPhone(activeMember.emergencyContact?.phone || '');
      setSelectedDisciplines(activeMember.services || []);
    }
  }, [activeMember]);

  const handleToggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember) return;
    if (selectedDisciplines.length === 0) {
      showToast('Please select at least one primary athletic interest.');
      return;
    }
    updateMemberProfile(activeMember.id, {
      emergencyContact: {
        name: emergencyName.trim() || 'Not specified',
        relationship: emergencyRelation,
        phone: emergencyPhone.trim() || 'Not specified'
      },
      services: selectedDisciplines
    });
    setIsEditingProfile(false);
  };

  if (!activeMember) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-10 space-y-4 shadow-xs">
          <Clock className="w-12 h-12 text-[#fbbc04] mx-auto" />
          <h2 className="text-2xl font-normal text-[#1f1f1f]">
            No Active Member Session Selected
          </h2>
          <p className="text-sm text-[#5f6368] max-w-md mx-auto">
            You are currently viewing in Guest Visitor mode. Use the Google account switcher above to switch to Alex Rivers (Active) or Sarah Lin (Pending).
          </p>
          <button
            onClick={() => setRole('member')}
            className="px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
          >
            Switch to Active Member View (Alex Rivers)
          </button>
        </div>
      </div>
    );
  }

  const bookedClasses = classes.filter((c) => c.bookedMemberIds.includes(activeMember.id));
  const isPending = activeMember.status === 'pending';
  const isExpired = activeMember.status === 'expired';
  const isActive = activeMember.status === 'active';

  const handleManualRenewalRequest = () => {
    showToast('Manual renewal notice submitted to Coach Marcus Vance.');
  };

  return (
    <div className="py-10 bg-[#f8fafd] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Google Account Profile Header */}
        <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
              {activeMember.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-semibold text-[#1f1f1f]">
                  {activeMember.fullName}
                </h1>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#c4eed0] text-[#137333]'
                      : isPending
                      ? 'bg-[#feefc3] text-[#b06000]'
                      : 'bg-[#fce8e6] text-[#c5221f]'
                  }`}
                >
                  {isActive && <CheckCircle2 className="w-3 h-3" />}
                  {isPending && <Clock className="w-3 h-3" />}
                  {isExpired && <AlertTriangle className="w-3 h-3" />}
                  <span className="uppercase text-[11px] font-bold">{activeMember.status}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5f6368] mt-1">
                <span>Pass: {activeMember.qrCodeId}</span>
                <span aria-hidden="true">·</span>
                <span>Member since {activeMember.joinDate}</span>
                <span aria-hidden="true">·</span>
                <span>Renewal Cycle: {activeMember.renewalDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-colors border shadow-xs ${
                isEditingProfile
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                  : 'text-[#1a73e8] bg-[#ffffff] border-[#dadce0] hover:bg-[#e8f0fe]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Close Editor' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => setIsTelegramOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d3e3fd] rounded-full transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Telegram Alerts</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
            >
              Public Catalog
            </button>
          </div>
        </div>

        {/* PENDING / EXPIRED BANNER */}
        {isPending && (
          <div className="p-5 bg-[#feefc3] border border-[#f9ab00]/40 rounded-2xl text-[#b06000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#b06000] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Application Under Coach Review</div>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Coach Marcus activates registered members daily. Simulate online Stripe card payment to test instant auto-activation (Tier 2).
                </p>
              </div>
            </div>
            <button
              onClick={() => openStripeCheckout(activeMember.id, 90, 'Taekwondo & Aerobics Membership')}
              className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors whitespace-nowrap shadow-xs shrink-0"
            >
              Test Instant Activation (Stripe)
            </button>
          </div>
        )}

        {isExpired && (
          <div className="p-5 bg-[#fce8e6] border border-[#ea4335]/30 rounded-2xl text-[#c5221f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ea4335] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Membership Expired on {activeMember.renewalDate}</div>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Please renew to reactivate turnstile access and reserve workout spots.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRenewalRequest}
                className="px-4 py-2 text-xs font-medium text-[#444746] bg-[#ffffff] border border-[#dadce0] rounded-full hover:bg-[#f1f3f4]"
              >
                In-Person Renewal
              </button>
              <button
                onClick={() => openStripeCheckout(activeMember.id, 85, 'Monthly Membership Renewal')}
                className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs"
              >
                Renew with Stripe
              </button>
            </div>
          </div>
        )}

        {/* Google Workspace Styled Member Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#ffffff] border border-[#e0e2ec] rounded-2xl shadow-2xs">
          <button
            onClick={() => setDashboardTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              dashboardTab === 'overview'
                ? 'bg-[#1a73e8] text-white shadow-xs font-semibold'
                : 'text-[#444746] hover:bg-[#f1f3f4]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Pass, Profile & Schedule</span>
          </button>

          <button
            onClick={() => setDashboardTab('leaderboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              dashboardTab === 'leaderboard'
                ? 'bg-[#1a73e8] text-white shadow-xs font-semibold'
                : 'text-[#444746] hover:bg-[#f1f3f4]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#fbbc04]" />
            <span>🥋 Sparring & Event Leaderboard</span>
          </button>

          <button
            onClick={() => setDashboardTab('calendar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              dashboardTab === 'calendar'
                ? 'bg-[#1a73e8] text-white shadow-xs font-semibold'
                : 'text-[#444746] hover:bg-[#f1f3f4]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#34a853]" />
            <span>📅 Club Calendar & Tournaments</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {dashboardTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Google Wallet Digital Pass */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#ffffff] border border-[#dadce0] rounded-3xl p-6 shadow-xs relative overflow-hidden">
              {/* Google Wallet Header Style */}
              <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f4]">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#1a73e8]" />
                  <span className="text-xs font-medium text-[#1f1f1f]">Google Wallet Pass</span>
                </div>
                <span className="text-[10px] font-mono text-[#5f6368]">{activeMember.qrCodeId}</span>
              </div>

              {/* Barcode & Pass representation */}
              <div className="bg-[#f8fafd] border border-[#e0e2ec] p-6 rounded-2xl flex flex-col items-center justify-center my-5">
                <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center border border-[#dadce0] shadow-xs">
                  <QrCode className="w-20 h-20 text-[#1f1f1f]" />
                </div>
                <div className="mt-3 text-[#1f1f1f] font-mono text-xs font-semibold tracking-wider">
                  {activeMember.qrCodeId}
                </div>
                <div className="text-[11px] text-[#5f6368] mt-0.5">
                  Hold near Google Wallet reader at turnstile
                </div>
              </div>

              {/* Pass details */}
              <div className="space-y-2 text-xs text-[#444746]">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Cardholder:</span>
                  <span className="font-semibold text-[#1f1f1f]">{activeMember.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Access Level:</span>
                  <span className={isActive ? 'text-[#137333] font-semibold' : 'text-[#b06000] font-semibold'}>
                    {isActive ? 'Full Access Granted' : 'Verification Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Valid Through:</span>
                  <span className="font-mono">{activeMember.renewalDate}</span>
                </div>
              </div>

              {/* Google Wallet Renewal Button */}
              {isActive && (
                <div className="mt-5 pt-4 border-t border-[#f1f3f4] flex items-center justify-between">
                  <button
                    onClick={() => openStripeCheckout(activeMember.id, 85, 'Auto-Renew Membership (Stripe)')}
                    className="flex items-center gap-1.5 text-xs text-[#1a73e8] hover:underline font-medium"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Manage Billing & Renewal</span>
                  </button>
                  <button
                    onClick={handleManualRenewalRequest}
                    className="text-[11px] text-[#5f6368] hover:text-[#1f1f1f]"
                  >
                    Cash Receipt
                  </button>
                </div>
              )}
            </div>

            {/* Child Profile for Taekwondo */}
            {activeMember.childProfile && (
              <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#b06000]">
                  <Sparkles className="w-4 h-4 text-[#fbbc04]" />
                  <span>Youth Taekwondo Student Profile</span>
                </div>
                <div className="space-y-2 text-xs text-[#444746]">
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Student Name:</span>
                    <span className="font-semibold text-[#1f1f1f]">{activeMember.childProfile.childName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Age:</span>
                    <span>{activeMember.childProfile.age} years old</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Rank:</span>
                    <span className="font-semibold text-[#b06000]">
                      {activeMember.childProfile.beltRank || 'Yellow Belt'}
                    </span>
                  </div>
                  {activeMember.childProfile.medicalNotes && (
                    <div className="p-3 bg-[#f8fafd] rounded-xl text-[11px] text-[#5f6368] border border-[#e0e2ec]">
                      <span className="font-medium text-[#1f1f1f]">Notes: </span>
                      {activeMember.childProfile.medicalNotes}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Active Programs, Classes, Hikes */}
          <div className="lg:col-span-7 space-y-6">
            {/* Member Profile, Emergency Contact & Athletic Interests Section */}
            <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                <div>
                  <h3 className="text-base font-semibold text-[#1f1f1f] flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#1a73e8]" />
                    <span>Emergency Contact & Athletic Interests</span>
                  </h3>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Keep your safety contact updated and customize your active athletic disciplines.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d3e3fd] rounded-full transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                /* INLINE EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="bg-[#f8fafd] p-4 rounded-2xl border border-[#dadce0] space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1f1f1f]">
                      <Shield className="w-4 h-4 text-[#ea4335]" />
                      <span>Emergency Safety Contact</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#444746] mb-1">
                          Contact Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="e.g. Maria Rivers"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-xl focus:border-[#1a73e8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#444746] mb-1">
                          Relationship
                        </label>
                        <select
                          value={emergencyRelation}
                          onChange={(e) => setEmergencyRelation(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-xl focus:border-[#1a73e8] focus:outline-none"
                        >
                          <option value="Spouse">Spouse / Partner</option>
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Adult Child</option>
                          <option value="Friend">Friend / Colleague</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#444746] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 234-5678"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#dadce0] rounded-xl focus:border-[#1a73e8] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Athletic Disciplines Multi-select */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#1f1f1f] flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#34a853]" />
                        <span>Primary Athletic Interests & Disciplines</span>
                      </label>
                      <span className="text-[11px] text-[#5f6368]">
                        {selectedDisciplines.length} selected
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5f6368]">
                      Click to toggle disciplines you participate in or want class updates for:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ALL_DISCIPLINES.map((disc) => {
                        const isSelected = selectedDisciplines.includes(disc);
                        return (
                          <button
                            type="button"
                            key={disc}
                            onClick={() => handleToggleDiscipline(disc)}
                            className={`p-3 rounded-2xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] shadow-xs'
                                : 'bg-[#ffffff] border-[#dadce0] text-[#444746] hover:bg-[#f8fafd]'
                            }`}
                          >
                            <span className="truncate pr-2">{disc}</span>
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                                isSelected
                                  ? 'bg-[#1a73e8] text-white'
                                  : 'border border-[#dadce0] text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f1f3f4]">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY DISPLAY */
                <div className="space-y-4">
                  {/* Emergency Contact Summary Box */}
                  <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fce8e6] text-[#ea4335] flex items-center justify-center font-bold shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#1f1f1f]">
                            {activeMember.emergencyContact?.name || 'No contact configured'}
                          </span>
                          <span className="text-[10px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full">
                            {activeMember.emergencyContact?.relationship || 'Contact'}
                          </span>
                        </div>
                        <div className="text-xs text-[#5f6368] font-mono mt-0.5">
                          {activeMember.emergencyContact?.phone || 'Phone number missing'}
                        </div>
                      </div>
                    </div>

                    {activeMember.emergencyContact?.phone && (
                      <a
                        href={`tel:${activeMember.emergencyContact.phone}`}
                        className="px-3.5 py-1.5 text-xs font-medium text-[#137333] bg-[#c4eed0] hover:bg-[#a8dab5] rounded-full transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Emergency Contact</span>
                      </a>
                    )}
                  </div>

                  {/* Primary Athletic Disciplines */}
                  <div>
                    <div className="text-xs font-medium text-[#5f6368] mb-2.5">
                      Enrolled & Priority Athletic Disciplines ({activeMember.services.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeMember.services.map((srv, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#ffffff] rounded-2xl border border-[#dadce0] shadow-2xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="w-2 h-2 rounded-full bg-[#1a73e8] shrink-0" />
                            <span className="text-xs font-medium text-[#1f1f1f] truncate">
                              {srv}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium bg-[#c4eed0] text-[#137333] px-2 py-0.5 rounded-full shrink-0">
                            ACTIVE
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booked Sessions */}
            <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#1f1f1f]">
                  My Booked Classes ({bookedClasses.length})
                </h3>
              </div>

              {bookedClasses.length === 0 ? (
                <div className="p-8 text-center text-[#5f6368] bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] text-xs">
                  <Calendar className="w-6 h-6 text-[#747775] mx-auto mb-2" />
                  No classes reserved yet. Select a class from the weekly schedule.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#1a73e8]">
                          {cls.dayOfWeek} · {cls.startTime} ({cls.room})
                        </div>
                        <h4 className="text-sm font-semibold text-[#1f1f1f] mt-0.5">
                          {cls.serviceName}
                        </h4>
                        <div className="text-[11px] text-[#5f6368]">
                          Coach {cls.instructor} · {cls.level}
                        </div>
                      </div>

                      <button
                        onClick={() => cancelClassBooking(cls.id, activeMember.id)}
                        className="px-3.5 py-1.5 text-xs text-[#c5221f] hover:bg-[#fce8e6] border border-[#dadce0] rounded-full transition-colors whitespace-nowrap"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hiking Events */}
            <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-semibold text-[#1f1f1f] mb-3">
                Outdoor Mountain Expeditions
              </h3>
              <div className="space-y-3">
                {hikes.map((hike) => {
                  const isJoined = hike.registeredMemberIds.includes(activeMember.id);
                  return (
                    <div
                      key={hike.id}
                      className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[#137333]">
                          {hike.date} · {hike.distance} · {hike.elevationGain}
                        </div>
                        <h4 className="text-sm font-semibold text-[#1f1f1f]">
                          {hike.title}
                        </h4>
                        <p className="text-xs text-[#5f6368] line-clamp-1">{hike.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-semibold text-[#1f1f1f]">
                            {hike.cost === 0 ? 'FREE' : `$${hike.cost} PERMIT`}
                          </div>
                          <div className="text-[10px] text-[#747775]">
                            {hike.registeredMemberIds.length} / {hike.maxCapacity} spots
                          </div>
                        </div>

                        {isJoined ? (
                          <span className="px-3.5 py-1.5 text-xs font-medium text-[#137333] bg-[#c4eed0] rounded-full">
                            Confirmed
                          </span>
                        ) : (
                          <button
                            onClick={() => joinHike(hike.id, activeMember.id)}
                            className="px-4 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors whitespace-nowrap shadow-xs"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Leaderboard Preview card in Overview */}
        <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#feefc3] text-[#b06000] flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              🥋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#1f1f1f]">
                  Taekwondo Sparring Rankings & Points
                </h4>
                <span className="text-[10px] font-bold bg-[#c4eed0] text-[#137333] px-2 py-0.2 rounded-full">
                  LIVE LEADERBOARD
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Active Athlete Standing: {activeMember.sparringPoints || 680} Sparring Points · Record matches, check Olympic rules, and challenge club fighters.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDashboardTab('leaderboard')}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors whitespace-nowrap shadow-xs"
          >
            Open Full Leaderboard
          </button>
        </div>
      </div>
    )}

    {/* Tab 2: Taekwondo Sparring & Event Leaderboard */}
    {dashboardTab === 'leaderboard' && <LeaderboardSection />}

    {/* Tab 3: Club Calendar & Tournaments */}
    {dashboardTab === 'calendar' && <CalendarView />}
  </div>
</div>
);
};
