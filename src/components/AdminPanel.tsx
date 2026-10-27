import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Member, MembershipStatus, Announcement } from '../types';
import {
  Shield,
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Send,
  Pin,
  TrendingUp,
  CreditCard,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  X
} from 'lucide-react';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome }) => {
  const {
    members,
    approveMember,
    rejectMember,
    changeMemberStatus,
    deleteMember,
    announcements,
    createAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    hikes,
    sendTelegramBroadcast,
    setIsTelegramOpen,
    openStripeCheckout,
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<'pending' | 'members' | 'announcements' | 'events' | 'broadcast'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MembershipStatus>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('General');
  const [annPinned, setAnnPinned] = useState(false);

  const [broadcastText, setBroadcastText] = useState('');

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const pendingMembers = members.filter((m) => m.status === 'pending');
  const expiredMembers = members.filter((m) => m.status === 'expired').length;

  const estimatedRevenue = members.reduce((acc, m) => {
    if (m.status === 'active') {
      return acc + (m.lastPaymentAmount || 75);
    }
    return acc;
  }, 0);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    createAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      pinned: annPinned,
      date: new Date().toISOString().split('T')[0],
      author: 'Coach Marcus Vance'
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnPinned(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText) return;
    sendTelegramBroadcast(broadcastText, 'announcement');
    setBroadcastText('');
  };

  return (
    <div className="py-8 bg-[#f8fafd] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Google Admin Header */}
        <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ea4335] text-white flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium text-[#1f1f1f]">
                  Google Admin console · TM Sports
                </h1>
                <span className="text-[10px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full">
                  Single Owner (T1)
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Logged in as Coach Marcus Vance (admin@tmsportsclub.com)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsTelegramOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d3e3fd] rounded-full transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Telegram Bot Logs</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
            >
              Public Catalog
            </button>
          </div>
        </div>

        {/* Google Admin KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-medium text-[#5f6368]">Total Roster Users</div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono mt-1">{totalMembers}</div>
            <div className="text-[11px] text-[#747775] mt-1">150–300 capacity scale</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-medium text-[#137333]">Active Passes</div>
            <div className="text-3xl font-normal text-[#34a853] font-mono mt-1">{activeMembers}</div>
            <div className="text-[11px] text-[#747775] mt-1">Full access granted</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-medium text-[#b06000]">Pending Approval</div>
            <div className="text-3xl font-normal text-[#f9ab00] font-mono mt-1">{pendingMembers.length}</div>
            <div className="text-[11px] text-[#747775] mt-1">Verification required</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-medium text-[#1a73e8]">Monthly Dues Run-rate</div>
            <div className="text-3xl font-normal text-[#1a73e8] font-mono mt-1">
              ${estimatedRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#747775] mt-1">Projected recurring</div>
          </div>
        </div>

        {/* Google Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#dadce0] pb-2">
          {[
            { id: 'pending', label: `Pending Approvals (${pendingMembers.length})` },
            { id: 'members', label: `Directory Users (${members.length})` },
            { id: 'announcements', label: `Announcements (${announcements.length})` },
            { id: 'events', label: `Hiking Events (${hikes.length})` },
            { id: 'broadcast', label: 'Telegram Broadcast' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold'
                  : 'text-[#444746] hover:bg-[#f1f3f4] hover:text-[#1f1f1f]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PENDING APPROVALS */}
        {adminTab === 'pending' && (
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1f1f1f]">
                  Pending Membership Registrations
                </h3>
                <p className="text-xs text-[#5f6368]">
                  Review applicant profiles, approve access passes, or request additional verification.
                </p>
              </div>
            </div>

            {pendingMembers.length === 0 ? (
              <div className="p-12 text-center text-[#5f6368] bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <CheckCircle2 className="w-8 h-8 text-[#34a853] mx-auto mb-2" />
                <div className="font-semibold text-[#1f1f1f] text-sm">No Pending Applications</div>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  All member registrations are verified and active.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-5 bg-[#ffffff] rounded-2xl border border-[#dadce0] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#feefc3] text-[#b06000] font-bold text-xs flex items-center justify-center">
                          {member.fullName.slice(0, 2).toUpperCase()}
                        </span>
                        <h4 className="text-sm font-semibold text-[#1f1f1f]">
                          {member.fullName}
                        </h4>
                        <span className="font-mono text-[10px] text-[#5f6368] bg-[#f1f3f4] px-2 py-0.5 rounded-full">
                          {member.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5f6368] pt-1">
                        <span>{member.email}</span>
                        <span aria-hidden="true">·</span>
                        <span>{member.phone}</span>
                        <span aria-hidden="true">·</span>
                        <span>Registered on {member.joinDate}</span>
                      </div>

                      <div className="text-xs text-[#444746] pt-1">
                        <span className="font-medium text-[#1f1f1f]">Disciplines: </span>
                        <span>{member.services.join(', ')}</span>
                      </div>

                      {member.childProfile && (
                        <div className="p-2.5 bg-[#feefc3]/60 rounded-xl text-xs text-[#b06000] border border-[#f9ab00]/30 mt-1">
                          <span className="font-semibold">Youth Taekwondo Student: </span>
                          {member.childProfile.childName} (Age {member.childProfile.age}) ·{' '}
                          {member.childProfile.medicalNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveMember(member.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#34a853] hover:bg-[#2d9247] rounded-full transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Activate</span>
                      </button>
                      <button
                        onClick={() => rejectMember(member.id, 'Incomplete verification')}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#c5221f] hover:bg-[#fce8e6] border border-[#dadce0] rounded-full transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEMBER DIRECTORY (Google Admin Table) */}
        {adminTab === 'members' && (
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-[#1f1f1f]">
                Users Directory
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="pl-8 pr-3 py-1.5 bg-[#f0f4f9] border border-transparent focus:bg-[#ffffff] focus:border-[#dadce0] rounded-full text-xs text-[#1f1f1f] placeholder-[#5f6368] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-full border border-[#dadce0]">
                  {(['all', 'active', 'pending', 'expired'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${
                        statusFilter === st
                          ? 'bg-[#ffffff] text-[#1f1f1f] shadow-xs font-semibold'
                          : 'text-[#5f6368] hover:text-[#1f1f1f]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#e0e2ec]">
              <table className="w-full text-left text-xs text-[#444746]">
                <thead className="bg-[#f8fafd] text-[#5f6368] font-medium text-[11px] border-b border-[#e0e2ec]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Disciplines</th>
                    <th className="py-3 px-4">Pass ID</th>
                    <th className="py-3 px-4">Renewal Cycle</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f4] bg-[#ffffff]">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#f8fafd] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1f1f1f]">{member.fullName}</div>
                        <div className="text-[11px] text-[#747775]">{member.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                            member.status === 'active'
                              ? 'bg-[#c4eed0] text-[#137333]'
                              : member.status === 'pending'
                              ? 'bg-[#feefc3] text-[#b06000]'
                              : 'bg-[#fce8e6] text-[#c5221f]'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {member.services.join(', ')}
                        {member.childProfile && (
                          <span className="text-[#1a73e8] ml-1 text-[11px]">
                            (+ Child: {member.childProfile.childName})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#5f6368]">{member.qrCodeId}</td>
                      <td className="py-3.5 px-4 font-mono">{member.renewalDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="px-2.5 py-1 text-xs bg-[#f1f3f4] hover:bg-[#e0e2ec] text-[#1f1f1f] rounded-full transition-colors"
                          >
                            Details
                          </button>
                          {member.status === 'active' ? (
                            <button
                              onClick={() => changeMemberStatus(member.id, 'expired')}
                              className="px-2.5 py-1 text-xs text-[#c5221f] hover:bg-[#fce8e6] rounded-full transition-colors"
                            >
                              Expire
                            </button>
                          ) : (
                            <button
                              onClick={() => changeMemberStatus(member.id, 'active')}
                              className="px-2.5 py-1 text-xs text-[#137333] hover:bg-[#c4eed0] rounded-full transition-colors"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => deleteMember(member.id)}
                            className="p-1 text-[#747775] hover:text-[#c5221f] rounded-full transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS */}
        {adminTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-semibold text-[#1f1f1f] mb-3">
                Post Stream Announcement
              </h3>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#444746] mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Winter Schedule Adjustments"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#444746] mb-1">
                      Category
                    </label>
                    <select
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                    >
                      <option value="General">General</option>
                      <option value="Classes">Classes</option>
                      <option value="Hiking & Events">Hiking & Events</option>
                      <option value="Kids Program">Kids Program</option>
                      <option value="Facility">Facility</option>
                    </select>
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#444746] font-medium">
                      <input
                        type="checkbox"
                        checked={annPinned}
                        onChange={(e) => setAnnPinned(e.target.checked)}
                        className="w-4 h-4 text-[#1a73e8] rounded border-[#dadce0]"
                      />
                      <span>Pin to Top</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444746] mb-1">
                    Content
                  </label>
                  <textarea
                    rows={4}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Provide details..."
                    required
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post to Stream & Telegram</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="text-base font-semibold text-[#1f1f1f] mb-3">
                Active Posts ({announcements.length})
              </h3>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-xs text-[#5f6368] mb-1">
                      <span className="text-[#1a73e8] font-medium">{ann.category}</span> · {ann.date}
                    </div>
                    <h4 className="text-sm font-semibold text-[#1f1f1f]">{ann.title}</h4>
                    <p className="text-xs text-[#5f6368] mt-1 line-clamp-2">{ann.content}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => togglePinAnnouncement(ann.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        ann.pinned
                          ? 'bg-[#feefc3] text-[#b06000]'
                          : 'text-[#747775] hover:bg-[#e0e2ec]'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-[#747775] hover:text-[#c5221f] rounded-full transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HIKING */}
        {adminTab === 'events' && (
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-[#1f1f1f]">
              Hiking & Summit Expeditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hikes.map((hike) => (
                <div key={hike.id} className="p-5 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-[#137333] font-medium">{hike.date}</div>
                      <h4 className="text-base font-semibold text-[#1f1f1f]">{hike.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#ffffff] border border-[#dadce0] rounded-full text-[#1f1f1f]">
                      {hike.cost === 0 ? 'FREE' : `$${hike.cost}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#5f6368]">{hike.description}</p>
                  <div className="text-xs text-[#444746] pt-2 border-t border-[#e0e2ec]">
                    Enrolled: {hike.registeredMemberIds.length} / {hike.maxCapacity} · Guide: {hike.guide}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BROADCAST */}
        {adminTab === 'broadcast' && (
          <div className="max-w-2xl bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1a73e8] flex items-center justify-center text-white">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1f1f1f]">
                  Telegram Channel Broadcast (Tier 2 Automation)
                </h3>
                <p className="text-xs text-[#5f6368]">
                  Sends high-priority push notifications to all 200+ members connected to the bot.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <textarea
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Write an announcement to broadcast to member phones..."
                required
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsTelegramOpen(true)}
                  className="text-xs text-[#1a73e8] hover:underline"
                >
                  Open Telegram Bot Logs
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                >
                  Transmit Broadcast
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MEMBER DETAIL MODAL */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-[#ffffff] border border-[#dadce0] w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                <div>
                  <h3 className="text-lg font-semibold text-[#1f1f1f]">
                    {selectedMember.fullName}
                  </h3>
                  <div className="text-xs text-[#5f6368]">{selectedMember.email}</div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-[#747775] hover:text-[#1f1f1f] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#444746]">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Phone:</span>
                  <span>{selectedMember.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Status:</span>
                  <span className="font-semibold uppercase text-[#1a73e8]">{selectedMember.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Disciplines:</span>
                  <span className="font-semibold text-[#1f1f1f]">{selectedMember.services.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Pass ID:</span>
                  <span className="font-mono">{selectedMember.qrCodeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Member Since:</span>
                  <span>{selectedMember.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Next Renewal:</span>
                  <span>{selectedMember.renewalDate}</span>
                </div>

                {selectedMember.childProfile && (
                  <div className="p-3 bg-[#feefc3]/60 rounded-xl border border-[#f9ab00]/30 mt-3 space-y-1">
                    <div className="font-semibold text-[#b06000]">Youth Taekwondo Student</div>
                    <div>Name: {selectedMember.childProfile.childName} (Age {selectedMember.childProfile.age})</div>
                    <div>Rank: {selectedMember.childProfile.beltRank || 'Yellow Belt'}</div>
                    {selectedMember.childProfile.medicalNotes && (
                      <div>Notes: {selectedMember.childProfile.medicalNotes}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-[#f1f3f4]">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
