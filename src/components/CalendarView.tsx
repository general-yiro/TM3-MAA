import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TournamentEvent, HikingEvent, TimetableClass } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
  Mountain,
  Dumbbell,
  Users,
  CheckCircle2,
  Share2,
  Download,
  Filter,
  Sparkles,
  Info,
  CalendarDays,
  List
} from 'lucide-react';

interface UnifiedCalendarItem {
  id: string;
  sourceType: 'tournament' | 'hike' | 'class';
  title: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string;
  location: string;
  category: 'taekwondo' | 'hiking' | 'class';
  organizer: string;
  spotsLeft: number;
  totalCapacity: number;
  isRegistered: boolean;
  cost: number;
  description: string;
  division?: string;
  rawEvent: TournamentEvent | HikingEvent | TimetableClass;
}

export const CalendarView: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const {
    tournaments,
    registerForTournament,
    hikes,
    joinHike,
    classes,
    bookClass,
    activeMember,
    role,
    language,
    showToast
  } = useApp();

  // Current viewed month: Start at November 2026 where all seed events are located
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 0-indexed, 10 = November
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<'all' | 'taekwondo' | 'hiking' | 'class'>('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedCalendarItem | null>(null);

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentMonthName = language === 'en' ? monthNamesEn[currentMonth] : monthNamesFr[currentMonth];

  // Helper to get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun

  // Transform tournaments into unified items
  const tournamentItems: UnifiedCalendarItem[] = tournaments.map((t) => {
    const isRegistered = activeMember ? t.registeredMemberIds.includes(activeMember.id) : false;
    return {
      id: t.id,
      sourceType: 'tournament',
      title: t.title,
      dateStr: t.date,
      timeStr: t.time,
      location: t.location,
      category: 'taekwondo',
      organizer: t.sanctionedBy,
      spotsLeft: Math.max(0, t.maxCompetitors - t.registeredMemberIds.length),
      totalCapacity: t.maxCompetitors,
      isRegistered,
      cost: t.registrationFee,
      description: t.description,
      division: t.division,
      rawEvent: t
    };
  });

  // Transform hikes into unified items (Seed dates: Nov 07 and Nov 22)
  const hikeDateMap: Record<string, string> = {
    'hike-1': '2026-11-07',
    'hike-2': '2026-11-22'
  };

  const hikeItems: UnifiedCalendarItem[] = hikes.map((h) => {
    const dateStr = hikeDateMap[h.id] || '2026-11-15';
    const isRegistered = activeMember ? h.registeredMemberIds.includes(activeMember.id) : false;
    return {
      id: h.id,
      sourceType: 'hike',
      title: h.title,
      dateStr,
      timeStr: h.date.split('·')[1]?.trim() || '07:30 AM',
      location: h.location,
      category: 'hiking',
      organizer: h.guide,
      spotsLeft: Math.max(0, h.maxCapacity - h.registeredMemberIds.length),
      totalCapacity: h.maxCapacity,
      isRegistered,
      cost: h.cost,
      description: `${h.description} · ${h.distance} · Elevation ${h.elevationGain} · Difficulty: ${h.difficulty}`,
      rawEvent: h
    };
  });

  // Project weekly timetable classes into the viewed month (for Tuesdays, Thursdays, Saturdays)
  const classItems: UnifiedCalendarItem[] = [];
  const dayNameMap: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };

  // Populate classes for month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentYear, currentMonth, day);
    const dayName = dayNameMap[dateObj.getDay()];
    const matchingClasses = classes.filter((c) => c.dayOfWeek === dayName);

    matchingClasses.forEach((cls) => {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;
      const isRegistered = activeMember ? cls.bookedMemberIds.includes(activeMember.id) : false;

      classItems.push({
        id: `${cls.id}-${fullDateStr}`,
        sourceType: 'class',
        title: cls.serviceName,
        dateStr: fullDateStr,
        timeStr: `${cls.startTime} – ${cls.endTime}`,
        location: cls.room,
        category: cls.serviceId.includes('taekwondo') ? 'taekwondo' : 'class',
        organizer: `Coach ${cls.instructor}`,
        spotsLeft: Math.max(0, cls.capacity - cls.bookedMemberIds.length),
        totalCapacity: cls.capacity,
        isRegistered,
        cost: 0,
        description: `Weekly studio session in ${cls.room} with ${cls.instructor}. Level: ${cls.level}.`,
        rawEvent: cls
      });
    });
  }

  // Combine and filter items
  const allItems: UnifiedCalendarItem[] = [...tournamentItems, ...hikeItems, ...classItems];

  const filteredItems = allItems.filter((item) => {
    if (filterType === 'taekwondo' && item.category !== 'taekwondo') return false;
    if (filterType === 'hiking' && item.category !== 'hiking') return false;
    if (filterType === 'class' && (item.category !== 'class' || item.sourceType !== 'class')) return false;
    return true;
  });

  // Group by date
  const itemsByDate: Record<string, UnifiedCalendarItem[]> = {};
  filteredItems.forEach((item) => {
    if (!itemsByDate[item.dateStr]) {
      itemsByDate[item.dateStr] = [];
    }
    itemsByDate[item.dateStr].push(item);
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToNovember = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
  };

  const handleRegisterAction = (item: UnifiedCalendarItem) => {
    if (!activeMember) {
      showToast('Please sign in or select an active member profile to register.');
      return;
    }

    if (item.sourceType === 'tournament') {
      const tourn = item.rawEvent as TournamentEvent;
      registerForTournament(tourn.id, activeMember.id);
    } else if (item.sourceType === 'hike') {
      const hike = item.rawEvent as HikingEvent;
      joinHike(hike.id, activeMember.id);
    } else if (item.sourceType === 'class') {
      const cls = item.rawEvent as TimetableClass;
      bookClass(cls.id, activeMember.id);
    }

    setSelectedItem((prev) => (prev ? { ...prev, isRegistered: true } : null));
  };

  const handleDownloadICS = (item: UnifiedCalendarItem) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TM Sports Club//Athletic Schedule//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${item.title}`,
      `DESCRIPTION:${item.description}`,
      `LOCATION:${item.location}`,
      `DTSTART:${item.dateStr.replace(/-/g, '')}T090000Z`,
      `DTEND:${item.dateStr.replace(/-/g, '')}T110000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Added ${item.title} to calendar (.ics exported)`);
  };

  // Build calendar matrix
  const calendarCells = [];
  // Empty leading days
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const getPillStyle = (item: UnifiedCalendarItem) => {
    if (item.sourceType === 'tournament') {
      return 'bg-[#feefc3] text-[#b06000] border-[#fbbc04]/70 hover:bg-[#fde293]';
    }
    if (item.sourceType === 'hike') {
      return 'bg-[#c4eed0] text-[#137333] border-[#34a853]/60 hover:bg-[#a8dab5]';
    }
    return 'bg-[#e8f0fe] text-[#1a73e8] border-[#d3e3fd] hover:bg-[#d2e3fc]';
  };

  return (
    <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Calendar Header with Google Calendar Styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e0e2ec]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5 text-[#1a73e8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1f1f1f]">
                {language === 'en' ? 'Club Events & Athletic Calendar' : 'Calendrier des Événements & Activités'}
              </h2>
              <p className="text-xs text-[#5f6368]">
                Integrated timetable for Taekwondo tournaments, mountain summit hikes, and weekly masterclasses.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle & Today Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleJumpToNovember}
            className="px-3.5 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#f0f4f9] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-full transition-colors"
          >
            November 2026 (Events)
          </button>

          <div className="flex items-center bg-[#f0f4f9] border border-[#dadce0] rounded-full p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#e9eef6] rounded-full text-[#444746] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 text-[#1f1f1f] min-w-[120px] text-center">
              {currentMonthName} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#e9eef6] rounded-full text-[#444746] transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-[#f0f4f9] border border-[#dadce0] rounded-full p-0.5">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-xs px-2.5 ${
                viewMode === 'month'
                  ? 'bg-[#ffffff] text-[#1a73e8] font-medium shadow-2xs'
                  : 'text-[#5f6368]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-xs px-2.5 ${
                viewMode === 'agenda'
                  ? 'bg-[#ffffff] text-[#1a73e8] font-medium shadow-2xs'
                  : 'text-[#5f6368]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filterType === 'all'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e9eef6]'
            }`}
          >
            All Events ({allItems.length})
          </button>
          <button
            onClick={() => setFilterType('taekwondo')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
              filterType === 'taekwondo'
                ? 'bg-[#b06000] text-white shadow-xs'
                : 'bg-[#feefc3] text-[#b06000] hover:bg-[#fde293]'
            }`}
          >
            <span>🥋</span>
            <span>Taekwondo & Tournaments ({tournaments.length})</span>
          </button>
          <button
            onClick={() => setFilterType('hiking')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
              filterType === 'hiking'
                ? 'bg-[#137333] text-white shadow-xs'
                : 'bg-[#c4eed0] text-[#137333] hover:bg-[#a8dab5]'
            }`}
          >
            <span>🏔️</span>
            <span>Mountain Hikes ({hikes.length})</span>
          </button>
          <button
            onClick={() => setFilterType('class')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
              filterType === 'class'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc]'
            }`}
          >
            <span>💪</span>
            <span>Studio Masterclasses</span>
          </button>
        </div>

        <div className="text-xs text-[#5f6368] flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
            <span>Tournaments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
            <span>Hikes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
            <span>Classes</span>
          </div>
        </div>
      </div>

      {/* Main View: Month Grid */}
      {viewMode === 'month' ? (
        <div className="border border-[#e0e2ec] rounded-2xl overflow-hidden bg-[#ffffff]">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 bg-[#f0f4f9] border-b border-[#dadce0] text-center text-xs font-semibold text-[#444746] py-2.5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#e0e2ec]">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[110px] bg-[#f8fafd]/60 p-2 text-right"
                  />
                );
              }

              const monthStr = String(currentMonth + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const cellDateStr = `${currentYear}-${monthStr}-${dayStr}`;
              const dayItems = itemsByDate[cellDateStr] || [];

              // Check if date has special tournament or hike
              const hasTournament = dayItems.some((i) => i.sourceType === 'tournament');
              const hasHike = dayItems.some((i) => i.sourceType === 'hike');

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors hover:bg-[#f8fafd] ${
                    hasTournament
                      ? 'bg-[#feefc3]/15'
                      : hasHike
                      ? 'bg-[#c4eed0]/15'
                      : 'bg-[#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                        day === 14 || day === 7 || day === 21 || day === 22
                          ? 'bg-[#1a73e8] text-white shadow-2xs'
                          : 'text-[#1f1f1f]'
                      }`}
                    >
                      {day}
                    </span>

                    {dayItems.length > 0 && (
                      <span className="text-[10px] font-mono text-[#5f6368]">
                        {dayItems.length} {dayItems.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px] scrollbar-none">
                    {dayItems.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`w-full text-left px-1.5 py-0.5 rounded-md text-[10px] font-medium border truncate transition-all block ${getPillStyle(
                          item
                        )}`}
                        title={item.title}
                      >
                        <span className="mr-1">
                          {item.sourceType === 'tournament'
                            ? '🥋'
                            : item.sourceType === 'hike'
                            ? '🏔️'
                            : '⚡'}
                        </span>
                        {item.title}
                      </button>
                    ))}
                    {dayItems.length > 3 && (
                      <button
                        onClick={() => setSelectedItem(dayItems[3])}
                        className="text-[10px] text-[#1a73e8] font-medium pl-1 hover:underline"
                      >
                        +{dayItems.length - 3} more...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Timeline List View */
        <div className="space-y-3">
          {Object.keys(itemsByDate).length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5f6368] bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
              No events found for this filter criteria in {currentMonthName} {currentYear}.
            </div>
          ) : (
            Object.entries(itemsByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateKey, items]) => (
                <div
                  key={dateKey}
                  className="bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] p-4 space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1a73e8]">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{dateKey}</span>
                    <span className="text-[10px] text-[#5f6368] font-normal">
                      ({items.length} {items.length === 1 ? 'event scheduled' : 'events scheduled'})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#ffffff] rounded-xl border border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-2xs transition-shadow cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {item.sourceType === 'tournament'
                                ? '🥋'
                                : item.sourceType === 'hike'
                                ? '🏔️'
                                : '💪'}
                            </span>
                            <span className="text-xs font-semibold text-[#1f1f1f]">
                              {item.title}
                            </span>
                            {item.isRegistered && (
                              <span className="text-[10px] bg-[#c4eed0] text-[#137333] px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Confirmed
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#5f6368] flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#747775]" /> {item.timeStr}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#747775]" /> {item.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-xs font-bold text-[#1a73e8]">
                            {item.cost === 0 ? 'FREE' : `$${item.cost}`}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="px-3 py-1 text-xs font-medium text-[#1a73e8] bg-[#f0f4f9] hover:bg-[#e8f0fe] rounded-full border border-[#dadce0] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Event Details Modal with RSVP & Calendar Integration */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#dadce0] shadow-xl text-[#1f1f1f] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#e0e2ec]">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shadow-xs shrink-0 ${
                    selectedItem.sourceType === 'tournament'
                      ? 'bg-[#feefc3] text-[#b06000]'
                      : selectedItem.sourceType === 'hike'
                      ? 'bg-[#c4eed0] text-[#137333]'
                      : 'bg-[#e8f0fe] text-[#1a73e8]'
                  }`}
                >
                  {selectedItem.sourceType === 'tournament'
                    ? '🥋'
                    : selectedItem.sourceType === 'hike'
                    ? '🏔️'
                    : '💪'}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a73e8]">
                    {selectedItem.sourceType === 'tournament'
                      ? 'Championship Sparring Tournament'
                      : selectedItem.sourceType === 'hike'
                      ? 'Outdoor Mountain Expedition'
                      : 'Weekly Studio Session'}
                  </span>
                  <h3 className="text-lg font-bold text-[#1f1f1f] leading-snug">
                    {selectedItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]"
              >
                ✕
              </button>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] space-y-0.5">
                <div className="text-[11px] text-[#5f6368] flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3 text-[#1a73e8]" />
                  <span>Date & Time</span>
                </div>
                <div className="font-semibold text-[#1f1f1f]">{selectedItem.dateStr}</div>
                <div className="text-[#5f6368]">{selectedItem.timeStr}</div>
              </div>

              <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] space-y-0.5">
                <div className="text-[11px] text-[#5f6368] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#137333]" />
                  <span>Location</span>
                </div>
                <div className="font-semibold text-[#1f1f1f] truncate">{selectedItem.location}</div>
                <div className="text-[#5f6368] truncate">{selectedItem.organizer}</div>
              </div>

              <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] space-y-0.5">
                <div className="text-[11px] text-[#5f6368] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#b06000]" />
                  <span>Capacity / Spots</span>
                </div>
                <div className="font-semibold text-[#1f1f1f]">
                  {selectedItem.spotsLeft} remaining spots
                </div>
                <div className="text-[#5f6368]">Capacity: {selectedItem.totalCapacity} athletes</div>
              </div>

              <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] space-y-0.5">
                <div className="text-[11px] text-[#5f6368] flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-[#ea4335]" />
                  <span>Registration Fee</span>
                </div>
                <div className="font-bold text-[#1a73e8] text-sm">
                  {selectedItem.cost === 0 ? 'FREE (Member Perk)' : `$${selectedItem.cost}.00`}
                </div>
                <div className="text-[#5f6368]">
                  {selectedItem.sourceType === 'tournament'
                    ? '+25 Sparring Pts bonus'
                    : '+15 Event Pts bonus'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 bg-[#f0f4f9] rounded-2xl text-xs text-[#444746] space-y-1">
              <div className="font-semibold text-[#1f1f1f]">Event Overview:</div>
              <p className="leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadICS(selectedItem)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] bg-[#ffffff] border border-[#dadce0] hover:bg-[#e8f0fe] rounded-full transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to Calendar (.ics)</span>
              </button>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
                >
                  Close
                </button>

                {selectedItem.isRegistered ? (
                  <div className="px-5 py-2 text-xs font-bold text-[#137333] bg-[#c4eed0] rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Already Registered</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRegisterAction(selectedItem)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                  >
                    Confirm & RSVP Spot
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
