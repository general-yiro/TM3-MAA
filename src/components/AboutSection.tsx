import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Target, HeartHandshake, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language } = useApp();

  return (
    <section id="about" className="py-20 bg-[#ffffff] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Founder portrait */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-[#dadce0] bg-[#ffffff] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src="/src/assets/images/avatar_coach_marcus_1793107476857.jpg"
                  alt="Coach Marcus Vance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f1f1f]">
                      Coach Marcus Vance
                    </h3>
                    <div className="text-xs text-[#1a73e8] font-medium">
                      Athletic Director & Founder · CSCS, USAW-2
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                    Google Coach Verified
                  </span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed mt-3">
                  "At TM Sports, we build physical resilience through structured coaching, youth martial arts character, and the camaraderie of alpine trails."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Story & Pillars in Google 4 Colors */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider">
              About TM Sports Club
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f] leading-snug">
              Built for dedicated athletes across{' '}
              <span className="font-semibold text-[#1a73e8]">USA & Canada</span>.
            </h2>
            <p className="text-sm text-[#444746] leading-relaxed font-normal">
              {language === 'en'
                ? 'Founded to make elite conditioning accessible and organized. TM Sports brings together over 200 athletes across group cardio, barbell powerlifting, youth Taekwondo, and wilderness hikes with transparent digital membership.'
                : 'Fondé pour rendre l’entraînement d’élite accessible et rigoureux. TM Sports rassemble plus de 200 athlètes à travers le cardio, la force athlétique, les arts martiaux et les randonnées.'}
            </p>

            {/* 4 Google-Color Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <span>Progressive Strength</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Structured barbell cycles with Eleiko calibrated plates and certified coaching.
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#feefc3] text-[#b06000] flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Youth Martial Arts</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Taekwondo character, agility, and belt progression exams for ages 5–12.
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#c4eed0] text-[#137333] flex items-center justify-center">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span>Alpine Wilderness</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Wilderness First Responder guided weekend mountain treks and summit adventures.
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#fce8e6] text-[#c5221f] flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span>Transparent Membership</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Digital passes, auto-renewals, and instant Telegram bot announcements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
