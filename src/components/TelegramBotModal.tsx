import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Bot, MessageSquare } from 'lucide-react';

export const TelegramBotModal: React.FC = () => {
  const { isTelegramOpen, setIsTelegramOpen, telegramMessages, sendTelegramBroadcast } = useApp();
  const [quickInput, setQuickInput] = useState('');

  if (!isTelegramOpen) return null;

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput) return;
    sendTelegramBroadcast(quickInput, 'announcement');
    setQuickInput('');
  };

  const triggerSimulatedAlert = (type: 'taekwondo' | 'expiry' | 'hiking') => {
    if (type === 'taekwondo') {
      sendTelegramBroadcast(
        '🥋 [TAEKWONDO] Child Lucas Lin has checked in for White/Yellow Belt training with Master Park. Scheduled pickup: 05:15 PM.',
        'reminder'
      );
    } else if (type === 'expiry') {
      sendTelegramBroadcast(
        '⚠️ [MEMBERSHIP ALERT] Your monthly athletic dues for Alex Rivers expire in 3 days. Tap to auto-renew via Stripe.',
        'reminder'
      );
    } else if (type === 'hiking') {
      sendTelegramBroadcast(
        '🥾 [HIKE ALERT] Saturday Cascade Ridge Trail weather forecast: 16°C & sunny. Shuttle departs TM facility at 07:30 AM sharp.',
        'event'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#ffffff] border border-[#dadce0] w-full max-w-lg rounded-3xl shadow-2xl flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Google Chat Style Header */}
        <div className="p-4 bg-[#f8fafd] border-b border-[#e0e2ec] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a73e8] flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1f1f1f]">TM Sports Telegram Channel</span>
                <span className="text-[10px] font-mono text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.2 rounded-full">
                  TIER 2 BOT
                </span>
              </div>
              <p className="text-[11px] text-[#34a853]">@TMSportsClub_bot · 240 members connected</p>
            </div>
          </div>
          <button
            onClick={() => setIsTelegramOpen(false)}
            className="p-1 rounded-full text-[#747775] hover:bg-[#e0e2ec]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google M3 Trigger Chips */}
        <div className="px-4 py-2 bg-[#ffffff] border-b border-[#f1f3f4] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#5f6368] font-medium whitespace-nowrap text-[11px]">Simulate:</span>
          <button
            onClick={() => triggerSimulatedAlert('taekwondo')}
            className="px-3 py-1 bg-[#feefc3] hover:bg-[#fde293] text-[#b06000] rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            🥋 Child Pickup Alert
          </button>
          <button
            onClick={() => triggerSimulatedAlert('expiry')}
            className="px-3 py-1 bg-[#fce8e6] hover:bg-[#fad2cf] text-[#c5221f] rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            ⚠️ Expiry Alert
          </button>
          <button
            onClick={() => triggerSimulatedAlert('hiking')}
            className="px-3 py-1 bg-[#c4eed0] hover:bg-[#a8dab5] text-[#137333] rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            🥾 Hike Reminder
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafd]">
          {telegramMessages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                msg.sender.includes('Admin')
                  ? 'bg-[#feefc3] text-[#202124] border border-[#f9ab00]/30 mr-auto'
                  : 'bg-[#ffffff] text-[#1f1f1f] border border-[#e0e2ec] mr-auto'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] text-[#5f6368] pb-1 border-b border-black/5">
                <span className="font-semibold text-[#1a73e8]">{msg.sender}</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSendQuick} className="p-3 bg-[#ffffff] border-t border-[#e0e2ec] flex items-center gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Broadcast a message to Telegram subscribers..."
            className="flex-1 px-4 py-2 bg-[#f0f4f9] border border-transparent focus:bg-[#ffffff] focus:border-[#dadce0] rounded-full text-xs text-[#1f1f1f] placeholder-[#5f6368] focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
