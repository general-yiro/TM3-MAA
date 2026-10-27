import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Calendar, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreServices: () => void;
  onViewSchedule: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewSchedule }) => {
  const { setIsRegistrationOpen, members, language } = useApp();

  const activeCount = members.filter((m) => m.status === 'active').length;

  return (
    <section className="bg-[#f8fafd] border-b border-[#e0e2ec] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Google Style Typography & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Google Badge / Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] text-xs font-medium text-[#1a73e8]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
              </div>
              <span>TM Sports for Athletes · USA & Canada</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1f1f1f] leading-[1.12]">
              Elevate your athletic discipline with{' '}
              <span className="font-semibold text-[#1a73e8]">TM Sports</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#444746] leading-relaxed max-w-xl font-normal">
              {language === 'en'
                ? 'A modern multi-sport training ecosystem. Connect with certified coaches for youth Taekwondo, barbell strength training, group aerobics, and weekend mountain expeditions.'
                : 'Un écosystème d’entraînement multisport moderne. Rejoignez nos entraîneurs certifiés en Taekwondo jeunesse, musculation, aérobic et randonnées en montagne.'}
            </p>

            {/* Google M3 Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium shadow-xs hover:shadow-md transition-all whitespace-nowrap"
              >
                <span>{language === 'en' ? 'Join TM Sports' : 'Rejoindre le Club'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3 rounded-full bg-[#ffffff] hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] text-sm font-medium transition-colors whitespace-nowrap"
              >
                {language === 'en' ? 'Explore 7 Programs' : 'Voir les 7 Disciplines'}
              </button>

              <button
                onClick={onViewSchedule}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-medium text-[#444746] hover:text-[#1f1f1f] hover:bg-[#eef2fa] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#1a73e8]" />
                <span>{language === 'en' ? 'Weekly Timetable' : 'Consulter l’Horaire'}</span>
              </button>
            </div>

            {/* Google trust checks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-[#5f6368]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>150–300 Active Members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>Certified CSCS Coaches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>Secure Digital Check-in</span>
              </div>
            </div>
          </div>

          {/* Right Column: Google Style Media Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#ffffff] border border-[#dadce0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-2">
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96">
                <img
                  src="/src/assets/images/hero_athletic_training_1793107474900.jpg"
                  alt="TM Sports athletic facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-xs font-medium text-[#c4eed0] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                    <span>Facility Open · 05:00 AM – 11:00 PM</span>
                  </div>
                  <div className="text-sm font-semibold mt-0.5">Pacific Rim Athletic Campus</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Google Workspace Style Metric Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Core Disciplines</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">7</div>
            <div className="text-[11px] text-[#747775] mt-1">Multi-sport programs</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Active Athletes</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
            </div>
            <div className="text-3xl font-normal text-[#34a853] font-mono tabular-nums">{activeCount}+</div>
            <div className="text-[11px] text-[#747775] mt-1">USA & Canada members</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Weekly Sessions</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">32</div>
            <div className="text-[11px] text-[#747775] mt-1">Coach-led classes</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Coach Certification</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">100%</div>
            <div className="text-[11px] text-[#747775] mt-1">Verified credentials</div>
          </div>
        </div>
      </div>
    </section>
  );
};
