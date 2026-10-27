import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, User, Clock, Eye, Send, RotateCcw, Globe, Sun, Moon } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, language, setLanguage, theme, toggleTheme, telegramMessages, setIsTelegramOpen, resetAllData } = useApp();

  const unreadTelegram = telegramMessages.filter((m) => !m.read).length;

  const roles: {
    id: UserRole;
    name: string;
    roleLabel: string;
    email: string;
    avatarBg: string;
    avatarText: string;
    initials: string;
  }[] = [
    {
      id: 'visitor',
      name: 'Public Visitor',
      roleLabel: 'Guest View',
      email: 'public.visitor@google.com',
      avatarBg: 'bg-[#e8f0fe] text-[#1a73e8]',
      avatarText: 'text-[#1a73e8]',
      initials: 'PV'
    },
    {
      id: 'member',
      name: 'Alex Rivers',
      roleLabel: 'Active Member',
      email: 'alex.rivers@tmsports.org',
      avatarBg: 'bg-[#c4eed0] text-[#137333]',
      avatarText: 'text-[#137333]',
      initials: 'AR'
    },
    {
      id: 'pending',
      name: 'Sarah Lin',
      roleLabel: 'Pending Applicant',
      email: 'sarah.lin@tmsports.org',
      avatarBg: 'bg-[#feefc3] text-[#b06000]',
      avatarText: 'text-[#b06000]',
      initials: 'SL'
    },
    {
      id: 'admin',
      name: 'Coach Marcus',
      roleLabel: 'Admin Owner',
      email: 'admin@tmsportsclub.com',
      avatarBg: 'bg-[#fce8e6] text-[#c5221f]',
      avatarText: 'text-[#c5221f]',
      initials: 'MV'
    }
  ];

  return (
    <div className="bg-[#ffffff] border-b border-[#e0e2ec] px-4 py-2 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.04)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Google-style account preview switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[#444746] font-medium text-[11px] mr-1 hidden sm:flex">
            {/* Google 4-color dots logo */}
            <div className="flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4285f4]" />
              <span className="w-2 h-2 rounded-full bg-[#ea4335]" />
              <span className="w-2 h-2 rounded-full bg-[#fbbc04]" />
              <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            </div>
            <span>Switch Account:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-full border border-[#dadce0]">
            {roles.map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-[#ffffff] text-[#1f1f1f] shadow-[0_1px_3px_rgba(0,0,0,0.12)] font-semibold'
                      : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-black/[0.04]'
                  }`}
                  title={`${r.name} · ${r.email}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${r.avatarBg}`}
                  >
                    {r.initials}
                  </span>
                  <span>{r.name}</span>
                  <span className="text-[10px] text-[#747775] font-normal hidden lg:inline">
                    ({r.roleLabel})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right utility buttons: Google style */}
        <div className="flex items-center gap-2">
          {/* Telegram Preview Launcher */}
          <button
            onClick={() => setIsTelegramOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] hover:bg-[#d3e3fd] transition-colors font-medium text-[11px]"
            title="Preview Telegram Bot Automation (Tier 2)"
          >
            <Send className="w-3 h-3 text-[#1a73e8]" />
            <span>Telegram Bot</span>
            {unreadTelegram > 0 && (
              <span className="bg-[#1a73e8] text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full">
                {unreadTelegram}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#dadce0] text-[#444746] hover:bg-[#f1f3f4] transition-colors text-[11px] font-medium"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-[#5f6368]" />
            <span className="uppercase font-mono">{language}</span>
          </button>

          {/* VS Code Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#dadce0] text-[#444746] hover:bg-[#f1f3f4] transition-colors text-[11px] font-medium"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to VS Code Dark Theme'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#fbbc04]" />
                <span className="font-mono text-[10px] text-[#4ec9b0]">VS Code Dark</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#5f6368]" />
                <span className="font-mono text-[10px] text-[#5f6368]">Dark</span>
              </>
            )}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetAllData}
            className="p-1.5 rounded-full bg-[#ffffff] border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1f1f1f] transition-colors"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
