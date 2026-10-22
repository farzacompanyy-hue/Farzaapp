import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, MessageCircle, Send, X, CheckCircle2, Shield, HelpCircle } from 'lucide-react';

interface CustomerSupportModalProps {
  phone?: string;
  onClose: () => void;
  onSubmitTicket: (issueType: string, description: string) => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  phone = '739992781',
  onClose,
  onSubmitTicket,
}) => {
  const [issueType, setIssueType] = useState('استفسار عن حجز رحلة');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmitTicket(issueType, description.trim());
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-md w-full rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/30 p-6 sm:p-8 space-y-6 shadow-2xl text-right text-[#202633]"
      >
        <div className="flex items-center justify-between border-b border-[#245BDB]/15 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0056B3]" />
            <h3 className="text-lg font-black text-[#1A2536]">خدمة عملاء وَصْلَة</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EAF2FF] border border-[#0056B3] text-[#0056B3] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-[#1A2536]">تم استلام رسالتك بنجاح</h4>
            <p className="text-xs text-[#7B8494]">
              فريق دعم وَصْلَة متاح لخدمتك على مدار الساعة وسيقوم بالرد الفوري عليك.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Contact Buttons (Call & WhatsApp) */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/967${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#F5F7FB] hover:bg-[#EAF2FF] border border-[#DCE4F0] hover:border-[#245BDB] flex flex-col items-center justify-center gap-2 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#202633]">محادثة واتساب</span>
                <span className="text-[10px] text-[#7B8494] font-mono">{phone}</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="p-4 rounded-2xl bg-[#F5F7FB] hover:bg-[#EAF2FF] border border-[#DCE4F0] hover:border-[#245BDB] flex flex-col items-center justify-center gap-2 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#202633]">اتصال هاتفي مباشر</span>
                <span className="text-[10px] text-[#245BDB] font-mono font-bold">{phone}</span>
              </a>
            </div>

            {/* In-App Support Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#DCE4F0]">
              <div className="text-xs font-bold text-[#202633]">أو أرسل رسالة للدعم الفني</div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7B8494]">نوع المشكلة أو الاستفسار</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs outline-none focus:border-[#1769FF]"
                >
                  <option value="استفسار عن حجز رحلة">استفسار عن حجز رحلة</option>
                  <option value="استفسار سائق عن العمولة">استفسار سائق عن العمولة والدفع</option>
                  <option value="طلب توثيق حساب سائق">طلب توثيق حساب سائق</option>
                  <option value="شكوى بخصوص موعد أو راكب">شكوى بخصوص موعد أو راكب</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7B8494]">تفاصيل الرسالة</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب استفسارك بالتفصيل..."
                  className="w-full p-3 rounded-xl bg-[#FFFFFF] border border-[#DCE4F0] text-[#202633] text-xs outline-none focus:border-[#1769FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5 rotate-180 stroke-[2.5]" />
                <span>إرسال للدعم الفني</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
