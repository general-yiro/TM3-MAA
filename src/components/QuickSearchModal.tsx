import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Calendar,
  Dumbbell,
  Bell,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  MapPin,
  Shield,
  CreditCard,
  Send,
  CornerDownLeft
} from 'lucide-react';

interface QuickSearchModalProps {
  onNavigateToTab: (tab: string) => void;
}

type SearchCategory = 'all' | 'classes' | 'disciplines' | 'announcements' | 'actions';

interface SearchResultItem {
  id: string;
  type: 'class' | 'discipline' | 'announcement' | 'action';
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
  badgeColor: string;
  action: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ onNavigateToTab }) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    classes,
    services,
    announcements,
    setIsRegistrationOpen,
    setSelectedServiceForJoin,
    openStripeCheckout,
    setIsTelegramOpen,
    setRole,
    role,
    language
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  // Compile search results
  const lowerQ = query.toLowerCase().trim();

  // 1. Classes
  const classResults: SearchResultItem[] = classes
    .filter(
      (c) =>
        !lowerQ ||
        c.serviceName.toLowerCase().includes(lowerQ) ||
        c.instructor.toLowerCase().includes(lowerQ) ||
        c.room.toLowerCase().includes(lowerQ) ||
        c.dayOfWeek.toLowerCase().includes(lowerQ) ||
        c.level.toLowerCase().includes(lowerQ)
    )
    .map((c) => ({
      id: `class-${c.id}`,
      type: 'class' as const,
      title: c.serviceName,
      subtitle: `${c.dayOfWeek} · ${c.startTime} – ${c.endTime} with Coach ${c.instructor}`,
      meta: c.room,
      badge: 'Class',
      badgeColor: 'bg-[#e8f0fe] text-[#1a73e8]',
      action: () => {
        onNavigateToTab('schedule');
        handleClose();
        setTimeout(() => {
          const el = document.getElementById('schedule');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }));

  // 2. Disciplines / Services
  const disciplineResults: SearchResultItem[] = services
    .filter(
      (s) =>
        !lowerQ ||
        s.title.toLowerCase().includes(lowerQ) ||
        s.description.toLowerCase().includes(lowerQ) ||
        s.category.toLowerCase().includes(lowerQ) ||
        s.instructor.toLowerCase().includes(lowerQ) ||
        s.features.some((f) => f.toLowerCase().includes(lowerQ))
    )
    .map((s) => ({
      id: `service-${s.id}`,
      type: 'discipline' as const,
      title: s.title,
      subtitle: `${s.tagline} · $${s.pricingMonthly}/mo`,
      meta: s.scheduleSummary,
      badge: 'Discipline',
      badgeColor: 'bg-[#feefc3] text-[#b06000]',
      action: () => {
        onNavigateToTab('services');
        handleClose();
        setTimeout(() => {
          const el = document.getElementById('services');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }));

  // 3. Announcements
  const announcementResults: SearchResultItem[] = announcements
    .filter(
      (a) =>
        !lowerQ ||
        a.title.toLowerCase().includes(lowerQ) ||
        a.content.toLowerCase().includes(lowerQ) ||
        a.category.toLowerCase().includes(lowerQ) ||
        a.author.toLowerCase().includes(lowerQ)
    )
    .map((a) => ({
      id: `ann-${a.id}`,
      type: 'announcement' as const,
      title: a.title,
      subtitle: `${a.date} · Posted by ${a.author}`,
      meta: a.category,
      badge: 'News',
      badgeColor: 'bg-[#fce8e6] text-[#c5221f]',
      action: () => {
        onNavigateToTab('announcements');
        handleClose();
        setTimeout(() => {
          const el = document.getElementById('announcements');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }));

  // 4. Quick Actions
  const actionResults: SearchResultItem[] = [
    {
      id: 'action-register',
      type: 'action' as const,
      title: 'Register for Membership (Onboarding)',
      subtitle: 'Apply for TM Sports athletic programs with emergency contact & waiver',
      meta: 'Application',
      badge: 'Action',
      badgeColor: 'bg-[#c4eed0] text-[#137333]',
      action: () => {
        handleClose();
        setIsRegistrationOpen(true);
      }
    },
    {
      id: 'action-schedule',
      type: 'action' as const,
      title: 'View Full Weekly Class Timetable',
      subtitle: 'Google Calendar sync view of all training sessions across the facility',
      meta: 'Calendar',
      badge: 'Action',
      badgeColor: 'bg-[#c4eed0] text-[#137333]',
      action: () => {
        onNavigateToTab('schedule');
        handleClose();
      }
    },
    {
      id: 'action-telegram',
      type: 'action' as const,
      title: 'Open Telegram Bot Channel Simulator',
      subtitle: 'View live alerts for announcements, child pickup confirmations, and reminders',
      meta: 'Tier 2 Bot',
      badge: 'Action',
      badgeColor: 'bg-[#c4eed0] text-[#137333]',
      action: () => {
        handleClose();
        setIsTelegramOpen(true);
      }
    },
    {
      id: 'action-stripe',
      type: 'action' as const,
      title: 'Simulate Stripe Online Payment',
      subtitle: 'Instant test card checkout for dues renewal & auto-activation',
      meta: 'Tier 2 Pay',
      badge: 'Action',
      badgeColor: 'bg-[#c4eed0] text-[#137333]',
      action: () => {
        handleClose();
        openStripeCheckout('tm-mem-101', 85, 'Monthly Athletic Membership Renewal');
      }
    },
    {
      id: 'action-admin',
      type: 'action' as const,
      title: 'Switch to Coach Marcus (Admin Console)',
      subtitle: 'Manage pending applications, roster directory, and stream announcements',
      meta: 'Admin HQ',
      badge: 'Action',
      badgeColor: 'bg-[#c4eed0] text-[#137333]',
      action: () => {
        setRole('admin');
        onNavigateToTab('admin-panel');
        handleClose();
      }
    }
  ].filter(
    (act) =>
      !lowerQ ||
      act.title.toLowerCase().includes(lowerQ) ||
      act.subtitle.toLowerCase().includes(lowerQ) ||
      act.meta.toLowerCase().includes(lowerQ)
  );

  // Filter by active category
  let combinedResults: SearchResultItem[] = [];
  if (activeCategory === 'all') {
    combinedResults = [...actionResults, ...disciplineResults, ...classResults, ...announcementResults];
  } else if (activeCategory === 'classes') {
    combinedResults = classResults;
  } else if (activeCategory === 'disciplines') {
    combinedResults = disciplineResults;
  } else if (activeCategory === 'announcements') {
    combinedResults = announcementResults;
  } else if (activeCategory === 'actions') {
    combinedResults = actionResults;
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < combinedResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : combinedResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedResults[selectedIndex]) {
        combinedResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="bg-[#ffffff] border border-[#dadce0] w-full max-w-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (Google style) */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#e0e2ec] bg-[#f8fafd]">
          <Search className="w-5 h-5 text-[#1a73e8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'en'
                ? 'Search classes, disciplines, announcements, or commands...'
                : 'Rechercher cours, disciplines, annonces ou actions...'
            }
            className="w-full bg-transparent text-sm text-[#1f1f1f] placeholder-[#5f6368] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-[#747775] hover:text-[#1f1f1f] hover:bg-[#e0e2ec]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#5f6368] bg-[#ffffff] border border-[#dadce0] px-2 py-0.5 rounded-md shadow-2xs shrink-0">
            <span>ESC</span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#ffffff] border-b border-[#f1f3f4] overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${combinedResults.length})` },
            { id: 'disciplines', label: `Disciplines (${disciplineResults.length})` },
            { id: 'classes', label: `Classes (${classResults.length})` },
            { id: 'announcements', label: `Announcements (${announcementResults.length})` },
            { id: 'actions', label: `Quick Actions (${actionResults.length})` }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as SearchCategory);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#1a73e8] text-white shadow-2xs'
                    : 'text-[#444746] hover:bg-[#f1f3f4] hover:text-[#1f1f1f]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#f1f3f4]">
          {combinedResults.length === 0 ? (
            <div className="p-12 text-center text-[#5f6368] space-y-2">
              <Search className="w-8 h-8 text-[#dadce0] mx-auto" />
              <div className="text-sm font-medium text-[#1f1f1f]">
                No matching results found
              </div>
              <p className="text-xs text-[#747775]">
                Try searching for "Taekwondo", "Aerobics", "Deadlift", "Marcus", or "Hike".
              </p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 rounded-2xl cursor-pointer flex items-center justify-between gap-4 transition-all ${
                    isSelected
                      ? 'bg-[#e8f0fe] text-[#041e49] shadow-2xs'
                      : 'hover:bg-[#f8fafd] text-[#1f1f1f]'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'class'
                          ? 'bg-[#e8f0fe] text-[#1a73e8]'
                          : item.type === 'discipline'
                          ? 'bg-[#feefc3] text-[#b06000]'
                          : item.type === 'announcement'
                          ? 'bg-[#fce8e6] text-[#c5221f]'
                          : 'bg-[#c4eed0] text-[#137333]'
                      }`}
                    >
                      {item.type === 'class' && <Calendar className="w-4 h-4" />}
                      {item.type === 'discipline' && <Dumbbell className="w-4 h-4" />}
                      {item.type === 'announcement' && <Bell className="w-4 h-4" />}
                      {item.type === 'action' && <Sparkles className="w-4 h-4" />}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1f1f1f] truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.2 rounded-full shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5f6368] truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#747775] font-mono hidden sm:inline">
                      {item.meta}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-4 h-4 text-[#1a73e8]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-5 py-2.5 bg-[#f8fafd] border-t border-[#e0e2ec] flex items-center justify-between text-[11px] text-[#5f6368]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#ffffff] border border-[#dadce0] rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-[#ffffff] border border-[#dadce0] rounded font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#ffffff] border border-[#dadce0] rounded font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span>Quick Find · TM Sports</span>
        </div>
      </div>
    </div>
  );
};
