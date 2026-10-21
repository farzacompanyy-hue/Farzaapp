import React, { useState } from 'react';
import { FarzaLogo } from './FarzaLogo';
import {
  PRIVACY_POLICY_SECTIONS,
  TERMS_OF_SERVICE_SECTIONS,
  LEGAL_OPERATOR_PLACEHOLDERS,
} from '../data/legalContent';
import { Shield, FileText, Trash2, ArrowRight, Globe, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PublicLegalPageProps {
  initialType?: 'privacy' | 'terms' | 'delete-account';
  onNavigateHome?: () => void;
}

export const PublicLegalPage: React.FC<PublicLegalPageProps> = ({
  initialType = 'privacy',
  onNavigateHome,
}) => {
  const [view, setView] = useState<'privacy' | 'terms' | 'delete-account'>(initialType);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('no_longer_needed');
  const [submitted, setSubmitted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const ref = `REQ-DEL-${Date.now().toString().slice(-6)}`;
    setReceiptNumber(ref);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#202633] font-['Cairo',sans-serif] flex flex-col">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#245BDB]/15 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <FarzaLogo size="sm" showText={false} />
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-[#202633] font-['Plus_Jakarta_Sans',sans-serif]">FARZA</span>
            <span className="text-xl font-black text-[#245BDB]">فَرْزَة</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-xs font-bold text-[#202633] border border-[#DCE4F0] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#245BDB] hover:bg-[#1769FF] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>{lang === 'ar' ? 'العودة للتطبيق' : 'Back to App'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 text-right">
        {/* Navigation Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#245BDB]/15 shadow-xs text-xs font-bold">
          <button
            onClick={() => {
              setView('privacy');
              setSubmitted(false);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              view === 'privacy' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => {
              setView('terms');
              setSubmitted(false);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              view === 'terms' ? 'bg-[#245BDB] text-white shadow-xs' : 'text-[#7B8494] hover:text-[#202633]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => {
              setView('delete-account');
              setSubmitted(false);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              view === 'delete-account' ? 'bg-red-600 text-white shadow-xs' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طلب حذف الحساب' : 'Delete Account'}</span>
          </button>
        </div>

        {/* View 1: Privacy Policy */}
        {view === 'privacy' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/20 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#245BDB] font-bold">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'وثيقة الخصوصية وحماية البيانات الرسمية' : 'Official Privacy Policy Document'}</span>
                </span>
                <span>{lang === 'ar' ? LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedAr : LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedEn}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#202633]">
                {lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات — منصة فَرْزَة' : 'FARZA Platform Privacy & Data Protection Policy'}
              </h1>
              <p className="text-xs text-[#7B8494] leading-relaxed">
                {lang === 'ar'
                  ? 'تم إعداد هذه السياسة للامتثال لمتطلبات متجر Google Play، ومتجر Apple App Store، والقوانين واللوائح المنظمة للخدمات الرقمية في الجمهورية اليمنية.'
                  : 'Formulated in strict adherence to Google Play Data Safety, Apple App Store Review Guidelines, and applicable digital regulatory standards.'}
              </p>
            </div>

            <div className="space-y-4">
              {PRIVACY_POLICY_SECTIONS.map((sec) => (
                <div key={sec.id} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/15 shadow-xs space-y-3">
                  <h2 className="text-base font-black text-[#245BDB]">
                    {lang === 'ar' ? sec.titleAr : sec.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#202633] leading-relaxed whitespace-pre-line font-medium">
                    {lang === 'ar' ? sec.contentAr : sec.contentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 2: Terms of Service */}
        {view === 'terms' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/20 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#245BDB] font-bold">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'شروط وأحكام الاستخدام والتعاقد' : 'Terms of Service Agreement'}</span>
                </span>
                <span>{lang === 'ar' ? LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedAr : LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedEn}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#202633]">
                {lang === 'ar' ? 'اتفاقية شروط استخدام منصة فَرْزَة لنقل الركاب' : 'FARZA Platform Terms of Service Agreement'}
              </h1>
              <p className="text-xs text-[#7B8494] leading-relaxed">
                {lang === 'ar'
                  ? 'تحدد هذه الوثيقة الحقوق والالتزامات المتبادلة بين المنصة، والمسافرين، والسائقين المستقلين بسيارات الهايلكس بين المحافظات اليمنية.'
                  : 'Governing the reciprocal obligations between the marketplace platform, intercity riders, and independent Hilux vehicle drivers.'}
              </p>
            </div>

            <div className="space-y-4">
              {TERMS_OF_SERVICE_SECTIONS.map((sec) => (
                <div key={sec.id} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/15 shadow-xs space-y-3">
                  <h2 className="text-base font-black text-[#245BDB]">
                    {lang === 'ar' ? sec.titleAr : sec.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#202633] leading-relaxed whitespace-pre-line font-medium">
                    {lang === 'ar' ? sec.contentAr : sec.contentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Account Deletion Public Web Page (Mandated by Google Play & Apple App Store) */}
        {view === 'delete-account' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-red-200 shadow-xs space-y-3 text-center sm:text-right">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto sm:mr-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-black text-[#202633]">
                {lang === 'ar' ? 'البوابة العامة لطلب حذف الحساب والبيانات' : 'Public Account & Data Deletion Portal'}
              </h1>
              <p className="text-xs text-[#7B8494] leading-relaxed">
                {lang === 'ar'
                  ? 'امتثالاً لسياسات Google Play وApple App Store الخاصة بحذف الحسابات، يمكن للمستخدمين تقديم طلب حذف حساباتهم وبياناتهم عبر هذا الرابط المباشر حتى دون الحاجة لتثبيت التطبيق.'
                  : 'In compliance with Google Play and Apple App Store account deletion policies, users may request the erasure of their accounts and associated personal data directly via this web page.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-emerald-300 shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#202633]">
                  {lang === 'ar' ? 'تم استلام وتوثيق طلب حذف الحساب' : 'Deletion Request Successfully Received'}
                </h3>
                <p className="text-xs text-[#7B8494] leading-relaxed">
                  {lang === 'ar'
                    ? `تم تسجيل طلب حذف الحساب المرتبط برقم الهاتف (${phone}). رقم التتبع المرجعي لطلبك:`
                    : `Your deletion request for phone (${phone}) has been logged. Your tracking reference:`}
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-[#F5F7FB] border border-[#245BDB]/30 font-mono font-bold text-[#245BDB]">
                  {receiptNumber}
                </div>
                <p className="text-[11px] text-[#7B8494] pt-2">
                  {lang === 'ar'
                    ? 'سيتم حذف جميع المعرفات والبيانات الشخصية خلال 48 ساعة، مع الاحتفاظ فقط بالدفاتر المالية المحاسبية الملزمة قانوناً.'
                    : 'Personal credentials will be permanently erased within 48 hours, preserving only statutory financial audit records.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleDeleteSubmit} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#DCE4F0] shadow-xs space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {lang === 'ar'
                      ? 'سيؤدي حذف الحساب إلى إلغاء أي رحلات غير مكتملة، ومسح بيانات الهوية والتقييمات والمحادثات نهائياً.'
                      : 'Deleting your account will cancel pending rides and permanently erase identity credentials, ratings, and chat records.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202633]">
                    {lang === 'ar' ? 'رقم الهاتف المسجل في فَرْزَة' : 'Registered Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="77XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs font-mono outline-none focus:border-red-500 text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202633]">
                    {lang === 'ar' ? 'سبب طلب الحذف' : 'Reason for Deletion'}
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs outline-none"
                  >
                    <option value="no_longer_needed">{lang === 'ar' ? 'لم أعد بحاجة للخدمة' : 'No longer need the service'}</option>
                    <option value="privacy">{lang === 'ar' ? 'أسباب تتعلق بالخصوصية' : 'Privacy reasons'}</option>
                    <option value="change_number">{lang === 'ar' ? 'تغيير رقم الهاتف' : 'Changing phone number'}</option>
                    <option value="other">{lang === 'ar' ? 'سبب آخر' : 'Other'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-red-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إرسال طلب الحذف النهائي' : 'Submit Account Deletion Request'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-[#245BDB]/15 text-center text-xs text-[#7B8494] bg-[#FFFFFF] mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{LEGAL_OPERATOR_PLACEHOLDERS.operatorNameAr}</span>
          <span className="font-mono">{LEGAL_OPERATOR_PLACEHOLDERS.dpoEmail}</span>
        </div>
      </footer>
    </div>
  );
};
