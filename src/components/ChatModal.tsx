import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChatMessage, Booking, Trip } from '../types';
import { Send, X, ShieldCheck, CheckCheck } from 'lucide-react';

interface ChatModalProps {
  booking: Booking;
  trip?: Trip;
  messages: ChatMessage[];
  currentUserRole: 'passenger' | 'driver' | 'admin';
  onSendMessage: (bookingId: string, text: string) => void;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  booking,
  trip,
  messages,
  currentUserRole,
  onSendMessage,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');

  const currentBookingMessages = messages.filter((m) => m.bookingId === booking.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(booking.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-lg w-full h-[580px] rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 flex flex-col overflow-hidden shadow-2xl text-[#202633]"
      >
        {/* Header */}
        <div className="p-4 bg-[#F5F7FB] border-b border-[#245BDB]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF2FF] border border-[#245BDB]/30 flex items-center justify-center text-[#245BDB] font-black text-xs">
              {currentUserRole === 'passenger' ? 'سائق' : 'راكب'}
            </div>
            <div>
              <div className="text-sm font-bold text-[#202633] flex items-center gap-1.5">
                <span>{currentUserRole === 'passenger' ? trip?.driverName || 'السائق' : booking.passengerName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#245BDB]" />
              </div>
              <div className="text-[11px] text-[#7B8494]">
                محادثة الرحلة: {trip?.fromCity} ← {trip?.toCity} (حجز #{booking.id})
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFFFF] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Notification Banner */}
        <div className="px-4 py-2 bg-[#EAF2FF] border-b border-[#245BDB]/20 text-[11px] text-[#15356B] flex items-center justify-between font-bold">
          <span>✓ تم تفعيل المحادثة رسمياً بعد سداد وتوثيق عمولة فَرْزَة.</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFFFF]">
          {currentBookingMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#7B8494] space-y-2 p-6">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FB] border border-[#245BDB]/20 flex items-center justify-center text-lg">
                💬
              </div>
              <p className="text-xs">المحادثة مفتوحة الآن للتنسيق حول موعد ونقطة التجمع.</p>
            </div>
          ) : (
            currentBookingMessages.map((msg) => {
              const isMe = msg.senderRole === currentUserRole;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-[#7B8494] mb-0.5 px-1">{msg.senderName}</div>
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#245BDB] text-white font-medium rounded-br-none shadow-xs'
                        : 'bg-[#F5F7FB] text-[#202633] border border-[#DCE4F0] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[9px] text-[#7B8494] mt-0.5 flex items-center gap-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#245BDB]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#F5F7FB] border-t border-[#DCE4F0] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs outline-none focus:border-[#1769FF]"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs font-bold"
          >
            <Send className="w-4 h-4 rotate-180 stroke-[2.5]" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
