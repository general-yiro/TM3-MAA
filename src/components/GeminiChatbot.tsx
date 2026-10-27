import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Bot,
  User,
  HelpCircle,
  Swords,
  Mountain,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  '🥋 How do Taekwondo sparring points work?',
  '🏆 When is the next youth tournament?',
  '🥾 What should I bring to the Cascade Ridge hike?',
  '💪 Can you suggest a weekly training plan?'
];

export const GeminiChatbot: React.FC = () => {
  const { role, activeMember, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Hi there! 👋 I'm the **TM Sports AI Coach & Club Concierge**.\n\nI can help you with:\n• Olympic World Taekwondo sparring point rules & tactics\n• Upcoming championship tournaments and belt advancement exams\n• Weekend mountain trail summit hikes and gear lists\n• Class schedules and personal training programs\n\nHow can I help power your athletic training today?`,
        timestamp: 'Just now'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content
          })),
          userRole: role,
          memberName: activeMember?.fullName || 'Guest'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm ready for your next question!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          "In Olympic World Taekwondo sparring:\n• 1 pt for straight punch to chest guard\n• 2 pts for kick to chest sensor\n• 3 pts for head kick\n• 4-5 pts for spinning/turning kick to head\n\nCheck out the Tournaments & Calendar tab for our Nov 14 Youth Championship!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Conversation refreshed! How can I assist you with TM Sports schedules, tournaments, or sparring points?`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Basic markdown formatting helper for bold and bullets
  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            const bulletText = line.replace(/^[•-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#1a73e8] font-bold">•</span>
                <span>{renderBoldSpans(bulletText)}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return <div key={idx}>{renderBoldSpans(line)}</div>;
        })}
      </div>
    );
  };

  const renderBoldSpans = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[#1f1f1f] dark:text-[#ffffff]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#1a73e8] to-[#1557b0] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 group cursor-pointer border border-[#ffffff]/20"
          title="Open TM Sports AI Coach & Concierge"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#feefc3] animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
              <span>TM AI Coach</span>
              <span className="text-[9px] bg-[#34a853] text-white px-1.5 py-0.2 rounded-full font-bold uppercase">
                3.8 Flash
              </span>
            </div>
            <div className="text-[10px] text-white/80 -mt-0.5">Sparring & Club Advice</div>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[390px] sm:max-w-[430px] h-[580px] bg-[#ffffff] border border-[#dadce0] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#f0f4f9] border-b border-[#dadce0] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-[#feefc3]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#1f1f1f]">TM Sports AI Coach</span>
                  <span className="text-[9px] bg-[#e8f0fe] text-[#1a73e8] px-1.5 py-0.2 rounded-md font-bold">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <div className="text-[10px] text-[#5f6368]">
                  Martial Arts, Sparring & Event Concierge
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 text-[#5f6368] hover:text-[#1f1f1f] hover:bg-[#e9eef6] rounded-full transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#5f6368] hover:text-[#1f1f1f] hover:bg-[#e9eef6] rounded-full transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#ffffff]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#1a73e8] text-white rounded-br-xs'
                      : 'bg-[#f0f4f9] text-[#1f1f1f] rounded-bl-xs border border-[#e0e2ec]'
                  }`}
                >
                  {renderFormattedMessage(msg.content)}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-white/70' : 'text-[#747775]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {activeMember?.fullName[0] || 'U'}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#5f6368] pl-8">
                <div className="flex gap-1 items-center bg-[#f0f4f9] px-3 py-1.5 rounded-full border border-[#e0e2ec]">
                  <span className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full animate-bounce" />
                  <span className="text-[10px] ml-1">AI Coach thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 bg-[#f8fafd] border-t border-[#e0e2ec] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-[#ffffff] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-full text-[10px] text-[#444746] hover:text-[#1a73e8] whitespace-nowrap transition-colors shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-[#ffffff] border-t border-[#dadce0] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sparring points, tournaments, hikes..."
                className="flex-1 px-4 py-2 bg-[#f0f4f9] border border-[#dadce0] rounded-full text-xs text-[#1f1f1f] focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
