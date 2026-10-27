import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeaderboardAthlete } from '../types';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Swords,
  ChevronUp,
  ChevronDown,
  Minus,
  Sparkles,
  Mountain,
  Calendar,
  ShieldAlert,
  Info,
  CheckCircle2,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export const LeaderboardSection: React.FC = () => {
  const { leaderboard, activeMember, logSparringMatch, language, showToast } = useApp();
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'Youth' | 'Adult'>('all');
  const [sortBy, setSortBy] = useState<'sparring' | 'events'>('sparring');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<'win' | 'loss' | 'draw'>('win');
  const [pointsInput, setPointsInput] = useState<number>(30);
  const [boutNote, setBoutNote] = useState('Weekend Dojo Sparring Match');

  // Filter and sort athletes
  const filteredAthletes = leaderboard
    .filter((a) => {
      if (divisionFilter !== 'all' && a.division !== divisionFilter) return false;
      if (searchQuery.trim() && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'events') {
        return b.eventsAttended - a.eventsAttended || b.sparringPoints - a.sparringPoints;
      }
      return b.sparringPoints - a.sparringPoints || b.wins - a.wins;
    });

  // Identify current member in leaderboard
  const currentAthlete = leaderboard.find(
    (a) => a.memberId === activeMember?.id || a.name.toLowerCase() === activeMember?.fullName.toLowerCase()
  );
  const currentMemberRank = currentAthlete
    ? leaderboard
        .slice()
        .sort((a, b) => b.sparringPoints - a.sparringPoints)
        .findIndex((a) => a.id === currentAthlete.id) + 1
    : null;

  const topThree = filteredAthletes.slice(0, 3);

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAthlete && !activeMember) {
      showToast('No active member found.');
      return;
    }
    const athleteId = currentAthlete ? currentAthlete.id : activeMember!.id;
    const pts = selectedResult === 'win' ? pointsInput : selectedResult === 'draw' ? 10 : 5;
    logSparringMatch(athleteId, selectedResult, pts, boutNote);
    setIsLogModalOpen(false);
  };

  const getBeltBadgeColor = (belt: string) => {
    const b = belt.toLowerCase();
    if (b.includes('black')) return 'bg-[#1f1f1f] text-white border-[#3c3c3c]';
    if (b.includes('red')) return 'bg-[#ea4335] text-white border-[#ea4335]';
    if (b.includes('blue')) return 'bg-[#1a73e8] text-white border-[#1a73e8]';
    if (b.includes('green')) return 'bg-[#34a853] text-white border-[#34a853]';
    if (b.includes('yellow')) return 'bg-[#fbbc04] text-[#202124] border-[#e37400]';
    return 'bg-[#e0e2ec] text-[#444746] border-[#dadce0]';
  };

  return (
    <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e0e2ec]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#1a73e8]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1f1f1f]">
              {language === 'en'
                ? 'Taekwondo Sparring & Event Leaderboard'
                : 'Classement Combat Taekwondo & Événements'}
            </h3>
          </div>
          <p className="text-xs text-[#5f6368] mt-1 max-w-2xl">
            Official ranking standings based on Olympic WTF sparring bouts, tournament medals, and outdoor summit hike participation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#f0f4f9] hover:bg-[#e8f0fe] rounded-full border border-[#dadce0] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Sparring Point Rules</span>
          </button>

          {activeMember && (
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Sparring Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Member Standings Banner */}
      {currentAthlete && (
        <div className="bg-gradient-to-r from-[#e8f0fe] via-[#f0f4f9] to-[#ffffff] border border-[#d3e3fd] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a73e8] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              #{currentMemberRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#1a73e8]">
                  Your Ranking Standing
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getBeltBadgeColor(currentAthlete.beltRank)}`}>
                  {currentAthlete.beltRank}
                </span>
              </div>
              <h4 className="text-base font-semibold text-[#1f1f1f]">
                {currentAthlete.name} · {currentAthlete.sparringPoints} Sparring Points
              </h4>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Record: {currentAthlete.wins}W - {currentAthlete.losses}L · {currentAthlete.eventsAttended} Club Events Attended ({currentAthlete.streak})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-[#137333]">
                {Math.round((currentAthlete.wins / Math.max(1, currentAthlete.wins + currentAthlete.losses)) * 100)}% Win Rate
              </div>
              <div className="text-[10px] text-[#5f6368]">
                {currentAthlete.tournamentsEntered} Tournaments Entered
              </div>
            </div>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#ffffff] border border-[#dadce0] rounded-full hover:bg-[#e8f0fe] transition-colors"
            >
              + Record Bout
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setDivisionFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              divisionFilter === 'all'
                ? 'bg-[#1a73e8] text-white'
                : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e9eef6]'
            }`}
          >
            All Divisions
          </button>
          <button
            onClick={() => setDivisionFilter('Youth')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              divisionFilter === 'Youth'
                ? 'bg-[#1a73e8] text-white'
                : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e9eef6]'
            }`}
          >
            Youth Sparring (Ages 5-14)
          </button>
          <button
            onClick={() => setDivisionFilter('Adult')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              divisionFilter === 'Adult'
                ? 'bg-[#1a73e8] text-white'
                : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e9eef6]'
            }`}
          >
            Adult Division (15+)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f0f4f9] rounded-full p-0.5 border border-[#dadce0]">
            <button
              onClick={() => setSortBy('sparring')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                sortBy === 'sparring' ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs' : 'text-[#5f6368]'
              }`}
            >
              Sparring Points
            </button>
            <button
              onClick={() => setSortBy('events')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                sortBy === 'events' ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs' : 'text-[#5f6368]'
              }`}
            >
              Event Count
            </button>
          </div>

          <input
            type="text"
            placeholder="Search fighter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1 text-xs bg-[#f0f4f9] border border-[#dadce0] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8] text-[#1f1f1f] w-36 sm:w-44"
          />
        </div>
      </div>

      {/* Top 3 Podiums */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          <div className="bg-[#f8fafd] border border-[#e0e2ec] rounded-2xl p-5 flex flex-col items-center text-center relative order-2 md:order-1 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#dadce0] text-[#444746] flex items-center justify-center font-bold text-base mb-2">
              🥈 2nd
            </div>
            <h4 className="text-sm font-semibold text-[#1f1f1f] truncate w-full">
              {topThree[1].name}
            </h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 ${getBeltBadgeColor(topThree[1].beltRank)}`}>
              {topThree[1].beltRank}
            </span>
            <div className="text-lg font-bold text-[#1a73e8] mt-2">
              {topThree[1].sparringPoints} <span className="text-xs font-normal text-[#5f6368]">pts</span>
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1">
              {topThree[1].wins}W - {topThree[1].losses}L · {topThree[1].eventsAttended} events
            </div>
            <div className="text-[10px] text-[#137333] font-medium mt-1">
              {topThree[1].streak}
            </div>
          </div>

          {/* #1 Gold - Elevated */}
          <div className="bg-gradient-to-b from-[#feefc3]/40 to-[#ffffff] border-2 border-[#fbbc04] rounded-2xl p-6 flex flex-col items-center text-center relative order-1 md:order-2 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#fbbc04] text-[#202124] flex items-center justify-center font-bold text-lg mb-2 shadow-xs">
              👑 1st
            </div>
            <span className="text-[10px] font-bold text-[#b06000] uppercase tracking-wider mb-0.5">
              Club Champion
            </span>
            <h4 className="text-base font-bold text-[#1f1f1f] truncate w-full">
              {topThree[0].name}
            </h4>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold mt-1 ${getBeltBadgeColor(topThree[0].beltRank)}`}>
              {topThree[0].beltRank}
            </span>
            <div className="text-2xl font-black text-[#1a73e8] mt-2">
              {topThree[0].sparringPoints} <span className="text-xs font-medium text-[#5f6368]">pts</span>
            </div>
            <div className="text-xs text-[#5f6368] mt-1">
              {topThree[0].wins}W - {topThree[0].losses}L · {topThree[0].eventsAttended} events
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
              {topThree[0].badges.map((b, i) => (
                <span key={i} className="text-[10px] bg-[#feefc3] text-[#b06000] px-2 py-0.5 rounded-full font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="bg-[#f8fafd] border border-[#e0e2ec] rounded-2xl p-5 flex flex-col items-center text-center relative order-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#e8eaed] text-[#5f6368] flex items-center justify-center font-bold text-base mb-2">
              🥉 3rd
            </div>
            <h4 className="text-sm font-semibold text-[#1f1f1f] truncate w-full">
              {topThree[2].name}
            </h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 ${getBeltBadgeColor(topThree[2].beltRank)}`}>
              {topThree[2].beltRank}
            </span>
            <div className="text-lg font-bold text-[#1a73e8] mt-2">
              {topThree[2].sparringPoints} <span className="text-xs font-normal text-[#5f6368]">pts</span>
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1">
              {topThree[2].wins}W - {topThree[2].losses}L · {topThree[2].eventsAttended} events
            </div>
            <div className="text-[10px] text-[#137333] font-medium mt-1">
              {topThree[2].streak}
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#e0e2ec]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f0f4f9] border-b border-[#dadce0] text-[#444746] font-semibold">
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Athlete</th>
              <th className="py-3 px-4">Belt Rank</th>
              <th className="py-3 px-4 text-right">Sparring Pts</th>
              <th className="py-3 px-4 text-center">Bouts (W-L-D)</th>
              <th className="py-3 px-4 text-center">Win Rate</th>
              <th className="py-3 px-4 text-center">Events & Hikes</th>
              <th className="py-3 px-4">Badges & Streak</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e2ec] bg-[#ffffff]">
            {filteredAthletes.map((athlete, idx) => {
              const isCurrent =
                athlete.memberId === activeMember?.id ||
                athlete.name.toLowerCase() === activeMember?.fullName.toLowerCase();
              const winRate = Math.round(
                (athlete.wins / Math.max(1, athlete.wins + athlete.losses)) * 100
              );

              return (
                <tr
                  key={athlete.id}
                  className={`hover:bg-[#f8fafd] transition-colors ${
                    isCurrent ? 'bg-[#e8f0fe]/60 font-medium' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold">
                      {idx === 0 ? (
                        <span className="text-base">🥇</span>
                      ) : idx === 1 ? (
                        <span className="text-base">🥈</span>
                      ) : idx === 2 ? (
                        <span className="text-base">🥉</span>
                      ) : (
                        <span className="text-[#5f6368]">#{idx + 1}</span>
                      )}
                      {athlete.rankChange === 'up' && (
                        <ChevronUp className="w-3 h-3 text-[#137333]" />
                      )}
                      {athlete.rankChange === 'down' && (
                        <ChevronDown className="w-3 h-3 text-[#c5221f]" />
                      )}
                      {athlete.rankChange === 'same' && (
                        <Minus className="w-2.5 h-2.5 text-[#747775]" />
                      )}
                    </div>
                  </td>

                  {/* Athlete Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] font-bold flex items-center justify-center text-xs shrink-0">
                        {athlete.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1f1f1f] flex items-center gap-1.5">
                          <span>{athlete.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#c4eed0] text-[#137333] px-1.5 py-0.2 rounded-full font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#5f6368]">
                          {athlete.division} Division
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Belt */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium ${getBeltBadgeColor(athlete.beltRank)}`}>
                      {athlete.beltRank}
                    </span>
                  </td>

                  {/* Sparring Points */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-sm text-[#1a73e8]">
                      {athlete.sparringPoints}
                    </span>
                  </td>

                  {/* Bouts */}
                  <td className="py-3.5 px-4 text-center font-mono text-xs">
                    <span className="text-[#137333] font-semibold">{athlete.wins}W</span>
                    {' - '}
                    <span className="text-[#c5221f]">{athlete.losses}L</span>
                    {athlete.draws > 0 && (
                      <span className="text-[#5f6368]"> - {athlete.draws}D</span>
                    )}
                  </td>

                  {/* Win Rate */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-[#e0e2ec] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#1a73e8] h-full rounded-full"
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#5f6368] font-medium">{winRate}%</span>
                    </div>
                  </td>

                  {/* Events & Hikes */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="text-xs font-semibold text-[#1f1f1f]">
                      {athlete.eventsAttended} events
                    </div>
                    <div className="text-[10px] text-[#5f6368]">
                      {athlete.hikesCompleted} hikes · {athlete.tournamentsEntered} tourns
                    </div>
                  </td>

                  {/* Badges & Streak */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-medium bg-[#f0f4f9] text-[#1f1f1f] px-2 py-0.5 rounded-full border border-[#dadce0]">
                        {athlete.streak}
                      </span>
                      {athlete.badges.slice(0, 2).map((b, i) => (
                        <span key={i} className="text-[10px] bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full font-medium">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        showToast(`Sparring invitation sent to ${athlete.name}!`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] rounded-full transition-colors whitespace-nowrap"
                    >
                      Challenge
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#dadce0] shadow-xl text-[#1f1f1f]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e2ec]">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-[#1a73e8]" />
                <h3 className="text-lg font-semibold">Taekwondo Sparring Points Guide</h3>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#444746]">
              <p>
                TM Sports follows official Olympic World Taekwondo (WT) point scoring standards equipped with electronic trunk sensors:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#1f1f1f]">Valid Punch to Trunk</div>
                    <div className="text-[#5f6368]">Straight punch with proper fist impact to chest guard</div>
                  </div>
                  <span className="font-bold text-[#1a73e8] text-sm">+1 Point</span>
                </div>

                <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#1f1f1f]">Valid Kick to Trunk Protector</div>
                    <div className="text-[#5f6368]">Roundhouse kick, push kick, or cut kick to chest sensor</div>
                  </div>
                  <span className="font-bold text-[#1a73e8] text-sm">+2 Points</span>
                </div>

                <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#1f1f1f]">Valid Kick to Head / Helmet</div>
                    <div className="text-[#5f6368]">High kick making contact with headgear</div>
                  </div>
                  <span className="font-bold text-[#1a73e8] text-sm">+3 Points</span>
                </div>

                <div className="p-3 bg-[#f8fafd] rounded-xl border border-[#e0e2ec] flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#1f1f1f]">Turning / Spinning Kick to Head</div>
                    <div className="text-[#5f6368]">Spinning hook kick, back kick, or tornado kick</div>
                  </div>
                  <span className="font-bold text-[#1a73e8] text-sm">+4 or +5 Points</span>
                </div>

                <div className="p-3 bg-[#feefc3]/50 rounded-xl border border-[#fbbc04]/60 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#b06000]">Gam-Jeom (Penalty)</div>
                    <div className="text-[#5f6368]">Crossing boundary, falling, holding, or unsportsmanlike conduct</div>
                  </div>
                  <span className="font-bold text-[#c5221f] text-sm">+1 pt to opponent</span>
                </div>
              </div>

              <div className="p-3 bg-[#e8f0fe] rounded-xl text-[#041e49]">
                <span className="font-semibold">Event Participation Bonus:</span> Every official tournament entered awards <span className="font-bold">+25 Sparring Points</span>; every weekend mountain hike awards <span className="font-bold">+15 Points</span> towards overall athletic standings.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Sparring Match Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-[#dadce0] shadow-xl text-[#1f1f1f]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e2ec]">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-[#1a73e8]" />
                <h3 className="text-lg font-semibold">Log Sparring Match</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickLog} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">
                  Fighter / Athlete
                </label>
                <input
                  type="text"
                  disabled
                  value={currentAthlete?.name || activeMember?.fullName || 'Active Member'}
                  className="w-full px-3.5 py-2 bg-[#f0f4f9] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">
                  Bout Outcome
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResult('win');
                      setPointsInput(30);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      selectedResult === 'win'
                        ? 'bg-[#c4eed0] text-[#137333] border-[#137333]'
                        : 'bg-[#f8fafd] text-[#5f6368] border-[#dadce0]'
                    }`}
                  >
                    Victory (Win)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResult('draw');
                      setPointsInput(10);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      selectedResult === 'draw'
                        ? 'bg-[#feefc3] text-[#b06000] border-[#fbbc04]'
                        : 'bg-[#f8fafd] text-[#5f6368] border-[#dadce0]'
                    }`}
                  >
                    Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResult('loss');
                      setPointsInput(5);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      selectedResult === 'loss'
                        ? 'bg-[#fce8e6] text-[#c5221f] border-[#ea4335]'
                        : 'bg-[#f8fafd] text-[#5f6368] border-[#dadce0]'
                    }`}
                  >
                    Loss (+5 exp)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">
                  Points Earned for Match
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] font-mono focus:ring-2 focus:ring-[#1a73e8] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">
                  Bout Notes / Sparring Opponent
                </label>
                <input
                  type="text"
                  value={boutNote}
                  onChange={(e) => setBoutNote(e.target.value)}
                  placeholder="e.g. Scrimmage against Maya Lin"
                  className="w-full px-3.5 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:ring-2 focus:ring-[#1a73e8] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                >
                  Submit Bout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
