import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  FileText,
  Sliders,
  Trash2,
  Mail,
  X,
  Search,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  Smartphone,
  Info,
} from 'lucide-react';
import {
  PRIVACY_POLICY_SECTIONS,
  TERMS_OF_SERVICE_SECTIONS,
  LEGAL_OPERATOR_PLACEHOLDERS,
} from '../data/legalContent';
import { Booking, Trip, ChatMessage, Complaint } from '../types';

interface PrivacyCenterModalProps {
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'consents' | 'delete' | 'contact';
  userData?: {
    userId?: string;
    userName?: string;
    userPhone?: string;
    userRole?: string;
    bookings?: Booking[];
    trips?: Trip[];
    chatMessages?: ChatMessage[];
    complaints?: Complaint[];
  };
  onAccountDeleted?: (phone: string) => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  onClose,
  initialTab = 'privacy',
  userData,
  onAccountDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'consents' | 'delete' | 'contact'>(
    initialTab
  );
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [searchQuery, setSearchQuery] = useState('');

  // Consent states
  const [allowLocation, setAllowLocation] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [allowDiagnostics, setAllowDiagnostics] = useState(false);
  const [consentsSaved, setConsentsSaved] = useState(false);

  // Deletion state
  const [deletePhone, setDeletePhone] = useState(userData?.userPhone || '');
  const [deleteReason, setDeleteReason] = useState('no_longer_needed');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deletionReceipt, setDeletionReceipt] = useState<string | null>(null);

  // Contact DPO Form
  const [contactSubject, setContactSubject] = useState('access_request');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Real Account Deletion Execution
  const handleExecuteDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePhone || deletePhone.trim().length < 8) return;

    const receiptId = `DEL-${Date.now().toString().slice(-6)}`;
    setDeletionReceipt(receiptId);
    setDeleteConfirmed(true);

    if (onAccountDeleted) {
      onAccountDeleted(deletePhone);
    }
  };

  // Filter sections by search query
  const filteredPrivacySections = PRIVACY_POLICY_SECTIONS.filter((s) => {
    const text = lang === 'ar' ? s.titleAr + s.contentAr : s.titleEn + s.contentEn;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredTermsSections = TERMS_OF_SERVICE_SECTIONS.filter((s) => {
    const text = lang === 'ar' ? s.titleAr + s.contentAr : s.titleEn + s.contentEn;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 15 }}
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#245BDB]/25 shadow-2xl overflow-hidden text-[#202633]"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-[#FFFFFF] border-b border-[#245BDB]/15 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 text-[#245BDB] flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#202633]">
                  {lang === 'ar' ? 'مركز الخصوصية وحماية البيانات والامتثال' : 'Privacy, Compliance & Legal Center'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#245BDB] border border-[#245BDB]/30 hidden sm:inline">
                  {LEGAL_OPERATOR_PLACEHOLDERS.policyVersion}
                </span>
              </div>
              <p className="text-[11px] text-[#7B8494]">
                {lang === 'ar'
                  ? 'منصة فَرْزَة — حماية البيانات وحقوق المستخدمين وفق أعلى المعايير'
                  : 'FARZA Platform — Protecting user privacy and compliance standards'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EAF2FF] text-[#202633] text-xs font-bold border border-[#DCE4F0] hover:border-[#245BDB]/40 transition-colors cursor-pointer"
              title="تغيير اللغة / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F5F7FB] text-[#7B8494] hover:text-[#202633] flex items-center justify-center cursor-pointer border border-[#DCE4F0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-[#F5F7FB] border-b border-[#245BDB]/15 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#FFFFFF]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#FFFFFF]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => setActiveTab('consents')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'consents'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#FFFFFF]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إدارة الأذونات' : 'Permissions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('delete')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'delete'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'حذف الحساب' : 'Delete Account'}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#245BDB] text-white shadow-xs'
                : 'text-[#7B8494] hover:text-[#202633] hover:bg-[#FFFFFF]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مسؤول الخصوصية' : 'Contact DPO'}</span>
          </button>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 text-right">
              {/* Operator Identification Box */}
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#245BDB]/20 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#245BDB] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إفصاح المشغل القانوني المعتمد' : 'Official Legal Operator Disclosure'}</span>
                  </span>
                  <span>{lang === 'ar' ? LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedAr : LEGAL_OPERATOR_PLACEHOLDERS.lastUpdatedEn}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#7B8494]">
                  <div>
                    <strong className="text-[#202633]">{lang === 'ar' ? 'الجهة المشغلة:' : 'Operating Entity:'} </strong>
                    <span>{lang === 'ar' ? LEGAL_OPERATOR_PLACEHOLDERS.operatorNameAr : LEGAL_OPERATOR_PLACEHOLDERS.operatorNameEn}</span>
                  </div>
                  <div>
                    <strong className="text-[#202633]">{lang === 'ar' ? 'السجل التجاري:' : 'Commercial Registry:'} </strong>
                    <span>{LEGAL_OPERATOR_PLACEHOLDERS.commercialRegister}</span>
                  </div>
                  <div>
                    <strong className="text-[#202633]">{lang === 'ar' ? 'البريد المخصص للخصوصية:' : 'Privacy Desk:'} </strong>
                    <span>{LEGAL_OPERATOR_PLACEHOLDERS.dpoEmail}</span>
                  </div>
                  <div>
                    <strong className="text-[#202633]">{lang === 'ar' ? 'النطاق الجغرافي:' : 'Jurisdiction:'} </strong>
                    <span>{lang === 'ar' ? LEGAL_OPERATOR_PLACEHOLDERS.jurisdictionAr : LEGAL_OPERATOR_PLACEHOLDERS.jurisdictionEn}</span>
                  </div>
                </div>
              </div>

              {/* Search Within Policy */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#7B8494] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'ابحث في بنود سياسة الخصوصية...' : 'Search within privacy clauses...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs text-[#202633] outline-none focus:border-[#245BDB]"
                />
              </div>

              {/* Policy Sections */}
              <div className="space-y-4">
                {filteredPrivacySections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#245BDB]/15 shadow-xs space-y-2.5"
                  >
                    <h4 className="text-sm font-black text-[#245BDB]">
                      {lang === 'ar' ? sec.titleAr : sec.titleEn}
                    </h4>
                    <p className="text-xs text-[#202633] leading-relaxed whitespace-pre-line font-medium">
                      {lang === 'ar' ? sec.contentAr : sec.contentEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5 text-right">
              {/* Policy Sections */}
              <div className="space-y-4">
                {filteredTermsSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#245BDB]/15 shadow-xs space-y-2.5"
                  >
                    <h4 className="text-sm font-black text-[#245BDB]">
                      {lang === 'ar' ? sec.titleAr : sec.titleEn}
                    </h4>
                    <p className="text-xs text-[#202633] leading-relaxed whitespace-pre-line font-medium">
                      {lang === 'ar' ? sec.contentAr : sec.contentEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONSENT & PERMISSION MANAGEMENT */}
          {activeTab === 'consents' && (
            <div className="space-y-5 text-right max-w-2xl mx-auto">
              <div>
                <h4 className="text-sm font-black text-[#202633]">إدارة أذونات وموافقات الخصوصية</h4>
                <p className="text-xs text-[#7B8494]">
                  لك كامل الحرية في تفعيل أو إلغاء الأذونات الاختيارية في أي وقت دون المساس بحسابك.
                </p>
              </div>

              <div className="space-y-3">
                {/* Geolocation Permission */}
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#202633]">الموقع الجغرافي المباشر (Foreground GPS)</div>
                    <p className="text-[11px] text-[#7B8494] leading-relaxed">
                      يُستخدم فقط أثناء فتح التطبيق لاقتراح محطة الانطلاق القريبة منك. لا يتم تتبع موقعك في الخلفية إطلاقاً.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAllowLocation(!allowLocation);
                      setConsentsSaved(true);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      allowLocation ? 'bg-[#245BDB]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                        allowLocation ? 'left-0.5 translate-x-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications Permission */}
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#202633]">الإشعارات اللحظية للرحلات (Push Notifications)</div>
                    <p className="text-[11px] text-[#7B8494] leading-relaxed">
                      تنبيهك فور قبول السائق لطلبك، أو وصول رسالة جديدة في محادثة الرحلة، أو اقتراب موعد الانطلاق.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAllowNotifications(!allowNotifications);
                      setConsentsSaved(true);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      allowNotifications ? 'bg-[#245BDB]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                        allowNotifications ? 'left-0.5 translate-x-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Diagnostic Telemetry */}
                <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-[#DCE4F0] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#202633]">البيانات التشخيصية المجهولة (Crash Telemetry)</div>
                    <p className="text-[11px] text-[#7B8494] leading-relaxed">
                      إرسال تقارير مجهولة الهوية عند حدوث خلل تقني لمساعدتنا في إصلاح الأعطال وتحسين السرعة.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAllowDiagnostics(!allowDiagnostics);
                      setConsentsSaved(true);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      allowDiagnostics ? 'bg-[#245BDB]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                        allowDiagnostics ? 'left-0.5 translate-x-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {consentsSaved && (
                <div className="p-3 rounded-xl bg-[#EAF2FF] border border-[#245BDB]/30 text-xs text-[#245BDB] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ تفضيلات الخصوصية الخاصة بك بنجاح.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCOUNT & DATA DELETION */}
          {activeTab === 'delete' && (
            <div className="space-y-5 text-right max-w-xl mx-auto">
              {deleteConfirmed ? (
                <div className="p-6 rounded-3xl bg-[#F5F7FB] border border-[#245BDB]/20 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-[#202633]">تم استلام وتنفيذ طلب حذف الحساب</h4>
                  <p className="text-xs text-[#7B8494] leading-relaxed">
                    تم إتلاف ملفك الشخصي وأرقام الاتصال والجلسات النشطة من النظام. رقم الإشعار المرجعي لطلبك:
                  </p>
                  <div className="inline-block px-4 py-2 rounded-xl bg-white border border-[#245BDB]/30 font-mono font-bold text-[#245BDB] text-sm">
                    {deletionReceipt}
                  </div>
                  <p className="text-[11px] text-[#7B8494] pt-2">
                    * يُرجى ملاحظة أنه وفق القوانين المحاسبية النافذة في اليمن، يتم الاحتفاظ بسجلات المعاملات المالية للعمولات فقط في أرشيف مالي منفصل ومغلق لأغراض التدقيق القانوني.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExecuteDeletion} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-red-700">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>تنبيه هام بشأن حذف الحساب والبيانات</span>
                    </div>
                    <p className="leading-relaxed">
                      هذا الإجراء نهائي ولا يمكن التراجع عنه. عند حذف الحساب، سيتم إنهاء جلساتك، وحذف ملفك الشخصي، وإلغاء أي حجوزات غير مؤكدة، ومسح بياناتك من النظام التشغيلي.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">أدخل رقم هاتفك لتأكيد الملكية</label>
                    <input
                      type="tel"
                      required
                      placeholder="77XXXXXXX"
                      value={deletePhone}
                      onChange={(e) => setDeletePhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs text-[#202633] font-mono outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">سبب طلب الحذف (اختياري)</label>
                    <select
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs text-[#202633] outline-none"
                    >
                      <option value="no_longer_needed">لم أعد بحاجة لاستخدام الخدمة</option>
                      <option value="privacy_concerns">مخاوف تتعلق بالخصوصية</option>
                      <option value="switching_phone">تغيير رقم الهاتف أو إنشاء حساب جديد</option>
                      <option value="other">أسباب أخرى</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-red-600/25"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>تأكيد حذف الحساب وجميع البيانات نهائياً</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: CONTACT DPO */}
          {activeTab === 'contact' && (
            <div className="space-y-5 text-right max-w-xl mx-auto">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#202633]">التواصل مع مسؤول حماية البيانات (DPO)</h4>
                <p className="text-xs text-[#7B8494]">
                  إذا كان لديك اعتراض أو شكوى أو رغبة في تصحيح بياناتك، يمكنك إرسال رسالتك مباشرة لفريق الخصوصية القانوني.
                </p>
              </div>

              {contactSent ? (
                <div className="p-6 rounded-2xl bg-[#EAF2FF] border border-[#245BDB]/30 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#245BDB] mx-auto" />
                  <div className="text-sm font-bold text-[#202633]">تم إرسال رسالتك إلى مسؤول الخصوصية</div>
                  <p className="text-xs text-[#7B8494]">
                    سيقوم فريق حماية البيانات بمراجعة طلبك والرد عليك عبر رقم هاتفك أو بريدك خلال مدة أقصاها 7 أيام عمل.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactMessage.trim()) return;
                    setContactSent(true);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">نوع الطلب أو الاستفسار</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs text-[#202633] outline-none"
                    >
                      <option value="access_request">طلب وصول أو نسخة من البيانات</option>
                      <option value="rectification">طلب تصحيح أو تحديث بيانات خاطئة</option>
                      <option value="objection">اعتراض على معالجة معينة للبيانات</option>
                      <option value="complaint">شكوى رسمية تتعلق بالخصوصية</option>
                      <option value="other">استفسار عام عن شروط الخصوصية</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202633]">تفاصيل طلبك</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="اكتب استفسارك بالتفصيل لمسؤول حماية البيانات..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#F5F7FB] border border-[#DCE4F0] text-xs text-[#202633] outline-none focus:border-[#245BDB] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#245BDB] hover:bg-[#1769FF] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#245BDB]/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب إلى مسؤول الخصوصية</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-[#F5F7FB] border-t border-[#245BDB]/15 text-center text-[11px] text-[#7B8494] flex items-center justify-between px-6 shrink-0">
          <span>{LEGAL_OPERATOR_PLACEHOLDERS.operatorNameAr}</span>
          <span className="font-mono">{LEGAL_OPERATOR_PLACEHOLDERS.dpoEmail}</span>
        </div>
      </motion.div>
    </div>
  );
};
