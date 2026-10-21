// FARZA (فَرْزَة) - Comprehensive Legal & Privacy Documentation
// Structured for Google Play, Apple App Store Connect, and Yemeni/International Data Protection Compliance.

export interface LegalSection {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
}

export const LEGAL_OPERATOR_PLACEHOLDERS = {
  operatorNameAr: 'شركة فَرْزَة للنقل الرقمي وتقنية المعلومات [اسم الكيان القانوني قيد التسجيل]',
  operatorNameEn: 'FARZA Digital Mobility & Logistics Co. [Entity Under Registration]',
  commercialRegister: 'رقم السجل التجاري: [يُحدد من قبل المالك - قيد الاستكمال]',
  jurisdictionAr: 'الجمهورية اليمنية',
  jurisdictionEn: 'Republic of Yemen',
  dpoEmail: 'privacy@farza-app.com [بريد مخصص للخصوصية]',
  supportPhone: '+967 739992781',
  physicalAddressAr: 'الجمهورية اليمنية، صنعاء / عدن - [العنوان البريدي للمقر الرئيسي]',
  physicalAddressEn: 'Sanaa / Aden, Republic of Yemen - [Headquarters Physical Address]',
  lastUpdatedAr: '21 أكتوبر 2026',
  lastUpdatedEn: 'October 21, 2026',
  policyVersion: 'v2.4-compliance',
};

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    id: 'scope-and-controller',
    titleAr: '1. نطاق السياسة والجهة المسؤولة عن معالجة البيانات',
    titleEn: '1. Policy Scope and Data Controller',
    contentAr: `تنطبق سياسة الخصوصية هذه على جميع مستخدمي تطبيق ومنصة «فَرْزَة FARZA» في الجمهورية اليمنية، بما يشمل الركاب (المسافرين)، والسائقين وملاك مركبات الهايلكس، وأي شخص يستخدم خدمات المنصة عبر تطبيقات الهاتف أو الموقع الإلكتروني.
الجهة المسؤولة عن معالجة بياناتك هي: ${LEGAL_OPERATOR_PLACEHOLDERS.operatorNameAr}، المسجلة في ${LEGAL_OPERATOR_PLACEHOLDERS.jurisdictionAr}.
نحن نتولى إدارة المنصة كوسيط تقني يربط الركاب الراغبين بالسفر بين المدن والمحافظات بالسائقين المستقلين المرخصين.`,
    contentEn: `This Privacy Policy applies to all users of the FARZA application and platform in the Republic of Yemen, including passengers (travelers), drivers and Hilux vehicle owners, and any visitor accessing our services via mobile applications or the website.
The data controller responsible for your personal information is: ${LEGAL_OPERATOR_PLACEHOLDERS.operatorNameEn}, registered in the ${LEGAL_OPERATOR_PLACEHOLDERS.jurisdictionEn}.
We operate as a digital intermediary platform connecting intercity travelers with verified independent licensed drivers.`,
  },
  {
    id: 'data-collected',
    titleAr: '2. فئات البيانات الشخصية التي نجمعها فعلياً',
    titleEn: '2. Categories of Personal Data We Actually Collect',
    contentAr: `نحن نطبق بدقة مبدأ «الحد الأدنى من البيانات» (Data Minimization)، ولا نجمع إلا البيانات الضرورية لتقديم خدمة النقل بين المدن:
أ) بيانات الحساب والهوية: الاسم الكامل، رقم الهاتف الجوال اليمني (لإرسال رموز التحقق OTP والتنسيق)، والصورة الشخصية (اختيارية للراكب وإلزامية لتوثيق السائق).
ب) بيانات الرحلات والحجوزات: مدينة ومحطة الانطلاق (مثل: صنعاء - جولة الرويشان)، مدينة ومحطة الوصول (مثل: عدن - المنصورة)، تاريخ وموعد الرحلة، عدد المقاعد المطلوبة، وملاحظات الأمتعة.
ج) بيانات السائق والمركبة والتحقق: صورة بطاقة الهوية الشخصية/الجواز، صورة رخصة القيادة السارية، رقم لوحة السيارة، موديل ونوع سيارة الهايلكس، صور المركبة، وإيصالات توريد عمولة المنصة (20%).
د) بيانات التواصل والمحادثات: سجل الرسائل اللحظية المتبادلة بين الراكب والسائق داخل التطبيق بعد تأكيد الرحلة لتنسيق موقع الركوب، وتذاكر خدمة العملاء.
هـ) البيانات التقنية وبيانات الأجهزة: عنوان IP، نوع الجهاز ونظام التشغيل (iOS / Android)، معرّف الإشعارات، وسجلات الأعطال التشخيصية لحماية النظام ومنع الاحتيال.`,
    contentEn: `We strictly adhere to the principle of Data Minimization, collecting only information vital for facilitating intercity journeys:
A) Account & Identity Data: Full name, Yemeni mobile telephone number (for SMS OTP verification and dispatch coordination), and profile picture (optional for riders, mandatory for driver verification).
B) Trip & Reservation Data: Departure city and area (e.g., Sana'a - Rowaishan), destination city and area (e.g., Aden - Mansoura), journey date, departure time, seat count, and luggage notes.
C) Driver, Vehicle & Verification Records: Copy of National ID/Passport, valid Driver's License, vehicle plate number, Toyota Hilux model and year, vehicle photos, and bank deposit transfer receipts for the 20% commission.
D) In-App Communications: Instant messages exchanged between passengers and assigned drivers following booking confirmation strictly for coordination, and customer support ticket details.
E) Technical & Diagnostics Data: IP address, operating system (iOS/Android), device identifier, notification tokens, and crash diagnostics utilized to ensure platform integrity and fraud prevention.`,
  },
  {
    id: 'location-policy',
    titleAr: '3. سياسة الموقع الجغرافي وحماية الخصوصية المكانية',
    titleEn: '3. Geolocation Data and Spatial Privacy',
    contentAr: `• الموقع التقريبي ومحطات الانطلاق: يعتمد تطبيق فَرْزَة على اختيار المستخدم للمدن والمحطات المعروفة مسبقاً (الفرزات والجولات الرئيسية).
• الموقع الجغرافي المباشر (GPS): نطلب إذن الموقع عند استخدام التطبيق فقط (Foreground Only) لمساعدة الراكب في اقتراح أقرب نقطة انطلاق أو تحديد مدينة تواجده.
• لا نقوم أبداً بجمع الموقع في الخلفية (No Background Location Tracking) دون علمك أو أثناء إغلاق التطبيق.
• لا يتم تتبع المسار الحي على مدار الساعة، ولا يتم بيع أو مشاركة بيانات مساراتك المكانية مع أي جهات تسويقية أو أطراف ثالثة إعلانية.`,
    contentEn: `• Approximate Location & Known Stations: FARZA intercity operations primarily rely on explicit station and city selections (known terminals and central squares).
• Foreground GPS: When enabled, device location is accessed strictly while the app is active in the foreground to assist in auto-detecting the nearest departure terminal or city.
• No Background Location Tracking: We NEVER monitor, track, or collect your GPS location in the background when the application is minimized or closed.
• Spatial data is strictly isolated to ride fulfillment and is never shared, monetized, or transferred to third-party ad networks.`,
  },
  {
    id: 'legal-bases-purposes',
    titleAr: '4. الأغراض القانونية ومعالجة البيانات',
    titleEn: '4. Legal Bases and Processing Purposes',
    contentAr: `نعالج بياناتك الشخصية بناءً على الأسس القانونية التالية:
1) تنفيذ العقد والخدمة: حجز المقاعد، إنشاء الرحلات، تأكيد الحجز، وتسهيل التقاء الراكب بالسائق.
2) الالتزام القانوني والتنظيمي: التحقق من هوية السائقين لمنع الجرائم الجنائية وضمان سلامة الركاب على الطرق السريعة بين المدن اليمنية، وتوثيق السجلات المالية للعمولات.
3) المصلحة المشروعة وحماية الأمان: مكافحة الحجوزات الوهمية والاحتيال، منع التلاعب بأسعار المقاعد، وتطوير أداء واستقرار التطبيق.
4) الموافقة الصريحة: عند تفعيل الإشعارات الفورية أو اختيار تسجيل الدخول عبر موفري الهوية المعتمدين.`,
    contentEn: `We process personal data under legitimate legal bases:
1) Contractual Performance: Reserving seats, dispatching intercity trips, confirming bookings, and enabling direct passenger-driver coordination.
2) Legal & Regulatory Compliance: Verifying driver credentials and national IDs to prevent passenger safety breaches along highway transit corridors, and preserving accounting records for commissions.
3) Legitimate Safety Interests: Preventing fraudulent reservations, blocking seat price manipulation, and optimizing mobile reliability.
4) Explicit User Consent: When authorizing push notifications or choosing social single sign-on providers.`,
  },
  {
    id: 'data-sharing',
    titleAr: '5. مشاركة البيانات مع الآخرين ومقدمي الخدمات',
    titleEn: '5. Data Sharing Between Users and Service Providers',
    contentAr: `• المشاركة بين الراكب والسائق: عند تأكيد الحجز فقط، يرى السائق اسم الراكب، ورقم هاتفه للتنسيق، وعدد المقاعد وموقع الانطلاق. ويرى الراكب اسم السائق، صورته، رقم هاتفه، موديل الهايلكس ورقم اللوحة، وتقييمه.
• عدم بيع البيانات: نؤكد بشكل قاطع أن فَرْزَة لا تبيع ولا تؤجر بيانات المستخدمين الشخصية لأي طرف تجاري أو إعلاني على الإطلاق.
• مزودو الخدمات الفنية الموثوقون:
  - خدمات الرسائل النصية والتحقق (SMS Gateways): لإرسال رموز التحقق لمرة واحدة OTP.
  - خوادم الاستضافة السحابية الآمنة وقواعد البيانات المشفرة: لتخزين بيانات التطبيق وفق معايير التشفير القياسية.
  - قنوات الدعم وخدمة العملاء: للرد على شكاوى الركاب والسائقين وحل النزاعات.`,
    contentEn: `• Sharing Between Passenger and Driver: Strictly upon confirmed reservation, the assigned driver views the passenger's name, verified phone number, seat count, and pickup point. Similarly, the passenger views the driver's verified name, photo, phone, vehicle plate, Hilux model, and safety rating.
• Zero Data Sale: FARZA explicitly does NOT sell, rent, or trade your personal records to third-party advertisers or brokers under any circumstances.
• Authorized Technical Processors:
  - Telecommunication & SMS Gateways: For delivering single-use OTP verification codes.
  - Secure Cloud Infrastructure: High-availability encrypted hosting preserving application integrity.
  - Customer Resolution & Support Channels: For mediating intercity transit disputes and passenger inquiries.`,
  },
  {
    id: 'third-party-auth',
    titleAr: '6. المصادقة عبر Google و Apple وحماية الهوية',
    titleEn: '6. Third-Party Authentication (Google & Apple) and Identity',
    contentAr: `عند اختيار تسجيل الدخول عبر حساب Google أو Apple:
• نتلقى فقط: المعرّف الفريد الآمن، الاسم المسجل، والبريد الإلكتروني (أو البريد المموّه المقدم من خدمة Private Relay من Apple).
• نحن لا نصل إطلاقاً ولا نطلب ولا نخزن كلمات المرور الخاصة بحسابك في Google أو Apple.
• يتم نقل وتخزين رموز التوثيق عبر قنوات اتصال مشفرة بتقنية HTTPS / TLS 1.3 فقط.`,
    contentEn: `When choosing to sign in via Google or Apple:
• We receive only the authorized unique ID, verified name, and email address (or Apple's masked Private Relay email).
• We NEVER access, request, or store your external Google or Apple account passwords.
• Authentication tokens are securely negotiated and exchanged strictly over TLS 1.3 / HTTPS encrypted connections.`,
  },
  {
    id: 'storage-and-retention',
    titleAr: '7. أمن البيانات ومدة الاحتفاظ بها',
    titleEn: '7. Data Security and Retention Schedule',
    contentAr: `• التشفير في النقل والتخزين: يتم تشفير جميع الاتصالات بين التطبيق والخوادم عبر بروتوكولات التشفير القياسية HTTPS/TLS، وتُحفظ المستندات الحساسة في حاويات تخزين آمنة ذات صلاحيات وصول مقيدة بدقة.
• فترة الاحتفاظ ببيانات الحساب: نحتفظ ببيانات حسابك طالما كان الحساب نشطاً ومستخدماً.
• سجلات الحجوزات والمالية: يتم الاحتفاظ بسجلات الحجوزات وإيصالات العمولات البنكية لمدة تقتضيها القوانين المحاسبية والمالية النافذة في اليمن (بما لا يقل عن 3 إلى 5 سنوات) للوفاء بالتزامات التدقيق الضريبي وفض النزاعات القانونية.
• الرسائل اللحظية للرحلة: تُحذف أو تُؤرشف تلقائياً بعد اكتمال الرحلة بـ 30 يوماً ما لم تكن مرتبطة بشكوى قائمة قيد المراجعة.`,
    contentEn: `• Encryption in Transit & Rest: All network payloads between the app and cloud servers are enforced via HTTPS/TLS. Sensitive driver verification documents reside in restricted, authenticated storage buckets.
• Account Data Duration: Profile records persist as long as your account remains active.
• Financial & Booking Ledgers: Ride manifests and bank commission remittance receipts are retained for the statutory financial period required under Yemeni trade and tax regulations (typically 3 to 5 years) for audit defense and legal disputes.
• Ride Communications: Ride-specific chat logs are purged or archived 30 days after trip completion unless flagged in an unresolved passenger dispute.`,
  },
  {
    id: 'user-rights-and-deletion',
    titleAr: '8. حقوق المستخدم وحذف الحساب والبيانات',
    titleEn: '8. User Rights and Account & Data Deletion',
    contentAr: `وفقاً لأفضل الممارسات الدولية وسياسات Google Play وApple App Store الصارمة، يتمتع مستخدم فَرْزَة بالحقوق الكاملة التالية:
1) حق الوصول وتصدير البيانات: يمكنك طلب نسخة كاملة بصيغة رقمية مقروءة (JSON) من جميع بياناتك المسجلة لدينا مباشرة من داخل «مركز الخصوصية» في التطبيق.
2) حق التصحيح: يمكنك تعديل اسمك ورقم هاتفك وبيانات مركبتك عبر إعدادات التطبيق أو التواصل مع الدعم.
3) حق حذف الحساب والبيانات بالكامل (Account Deletion):
   - نوفر زراً مباشراً داخل التطبيق في صفحة الخصوصية لطلب حذف الحساب.
   - نوفر رابط ويب عام مستقل لا يتطلب تسجيل الدخول لتقديم طلب الحذف امتثالاً لشروط المتاجر.
   - عند تأكيد الحذف، يتم إتلاف اسمك ورقم هاتفك وصورك وسجلات دخولك من قواعد البيانات التشغيلية فوراً، باستثناء السجلات المالية التي يُلزمنا القانون بالاحتفاظ بها مؤقتاً لأغراض التدقيق المحاسبي ومكافحة غسيل الأموال.`,
    contentEn: `In strict compliance with Google Play Data Safety and Apple App Store Review Guidelines, every FARZA user possesses the following rights:
1) Right to Access & Portability: You may request and download a full structured copy (JSON) of your stored personal records directly from the in-app Privacy Center.
2) Right to Rectification: You may update your display credentials, phone number, and vehicle details via your profile or customer support.
3) Right to Account & Data Erasure:
   - We offer an integrated, self-service Account Deletion workflow inside the in-app Privacy Center.
   - We provide an unauthenticated, publicly accessible HTTPS deletion request web page as mandated by app store policies.
   - Upon confirmed deletion, your credentials, contact information, photos, and active sessions are permanently erased from operational datastores, retaining only transaction ledgers legally mandated for fiscal accounting compliance.`,
  },
  {
    id: 'children-policy',
    titleAr: '9. سياسة خصوصية القاصرين والأطفال',
    titleEn: '9. Children and Minors Privacy Policy',
    contentAr: `خدمات فَرْزَة مخصصة للأفراد البالغين سن الرشد القانوني (18 عاماً فما فوق). نحن لا نجمع عن قصد أي بيانات شخصية من قاصرين دون 18 عاماً. إذا علمنا بأن طفلاً أو قاصراً دون السن القانوني قد زودنا ببياناته الشخصية دون موافقة ولي أمره الشرعي، فسنقوم بحذف تلك البيانات فوراً وإغلاق الحساب.`,
    contentEn: `FARZA services are intended exclusively for individuals of legal majority age (18 years and above). We do not knowingly solicit or collect personal information from minors under 18. If we discover that a minor has submitted personal data without verified parental guardianship consent, we will promptly purge such records and terminate the account.`,
  },
  {
    id: 'contact-and-dpo',
    titleAr: '10. مسؤول حماية البيانات وتقديم الشكاوى',
    titleEn: '10. Data Protection Officer and Privacy Inquiries',
    contentAr: `إذا كانت لديك أي استفسارات أو ملاحظات أو شكاوى تتعلق بمعالجة بياناتك الشخصية وحمايتها، يمكنك التواصل مع مسؤول حماية البيانات (DPO) عبر الوسائل التالية:
• البريد الإلكتروني المخصص للخصوصية: ${LEGAL_OPERATOR_PLACEHOLDERS.dpoEmail}
• هاتف خدمة العملاء والخصوصية المباشر: ${LEGAL_OPERATOR_PLACEHOLDERS.supportPhone}
• العنوان البريدي للمقر: ${LEGAL_OPERATOR_PLACEHOLDERS.physicalAddressAr}
نلتزم بالرد على جميع استفسارات وطلبات الخصوصية خلال مدة لا تتجاوز 7 أيام عمل.`,
    contentEn: `For any inquiries, requests, or privacy concerns regarding how your data is handled, please contact our Data Protection Officer (DPO) via:
• Dedicated Privacy Email: ${LEGAL_OPERATOR_PLACEHOLDERS.dpoEmail}
• Telephone Inquiries: ${LEGAL_OPERATOR_PLACEHOLDERS.supportPhone}
• Headquarters Physical Address: ${LEGAL_OPERATOR_PLACEHOLDERS.physicalAddressEn}
We commit to addressing and resolving all data rights requests within 7 business days.`,
  },
];

export const TERMS_OF_SERVICE_SECTIONS: LegalSection[] = [
  {
    id: 'terms-nature-of-service',
    titleAr: '1. طبيعة المنصة ودور فَرْزَة كصلة وصل تقنية',
    titleEn: '1. Platform Nature and Intermediary Role',
    contentAr: `منصة «فَرْزَة FARZA» هي منصة رقمية وسيطة تقدم حلاً تقنياً يربط المسافرين بين المحافظات اليمنية بسائقين مستقلين يمتلكون مركبات مرخصة (سيارات تويوتا هايلكس). المنصة ليست شركة نقل حافلات وليست مالكة لمركبات السائقين، ولا تتدخل في القيادة المباشرة على الطريق، بل توفر التقنية لتسهيل الحجز، جدولة المقاعد، واحتساب العمولات بأمان وشفافية.`,
    contentEn: `The FARZA platform acts as a digital technical intermediary connecting travelers between Yemeni provinces with licensed independent drivers operating pickup vehicles (Toyota Hilux). FARZA is not a transportation carrier or owner of the driver vehicles; rather, it supplies the marketplace technology enabling transparent seat reservation, scheduling, and commission settlement.`,
  },
  {
    id: 'terms-passenger-obligations',
    titleAr: '2. التزامات الراكب (المسافر)',
    titleEn: '2. Passenger Obligations and Code of Conduct',
    contentAr: `• التواجد في الموعد المحدد: يلتزم الراكب بالحضور إلى نقطة التجمع المتفق عليها (الفرزة أو الجولة المحددة) قبل موعد انطلاق الرحلة بـ 15 دقيقة على الأقل.
• صحة البيانات: يلتزم الراكب بتقديم اسمه الحقيقي ورقم هاتف فعال يستقبل المكالمات والرسائل.
• الالتزام بالقوانين وحمولة الأمتعة: يلتزم الراكب بعدم نقل أي مواد محظورة أو خطرة قانوناً، والالتزام بحجم الأمتعة المسموح به (حقيبتان متوسطتان كحد أقصى لكل مقعد محجوز) لتفادي تحميل المركبة فوق طاقتها.
• سداد أجرة المقعد: يلتزم الراكب بدفع قيمة المقاعد المتفق عليها للسائق نقداً أو عبر التحويل البنكي المتفق عليه عند الصعود أو الوصول.`,
    contentEn: `• Punctuality: Passengers must arrive at the designated departure station or terminal at least 15 minutes before the scheduled departure time.
• Accurate Information: Passengers must furnish their genuine full name and an active mobile number reachable via calls and SMS.
• Legal Compliance & Luggage Limits: Passengers are strictly prohibited from transporting hazardous, illegal, or contraband cargo, and must respect the luggage limit (maximum two medium bags per reserved seat) to avoid overloading.
• Fare Settlement: The passenger agrees to pay the stipulated seat fare directly to the driver in cash or agreed local bank transfer upon boarding or arrival.`,
  },
  {
    id: 'terms-driver-obligations',
    titleAr: '3. التزامات السائق ومواصفات المركبة',
    titleEn: '3. Driver Commitments and Vehicle Standards',
    contentAr: `• سلامة المركبة والترخيص: يلتزم السائق بتقديم رخصة قيادة سارية، وبطاقة هوية، ووثائق ملكية وفحص مركبة الهايلكس، والتأكد من عمل التكييف وسلامة الإطارات والمكابح وجاهزيتها للسفر الطويل.
• احترام مواعيد الانطلاق: يلتزم السائق بالانطلاق في الموعد المحدد وعدم إلغاء الرحلة إلا في الظروف القاهرة غير المتوقعة مع إشعار الركاب فوراً.
• التقيد بقوانين المرور والسلامة: يلتزم السائق بالسرعات القانونية المحددة على الطرق السريعة وعدم القيادة في حالات الإرهاق الشديد أو مخالفة آداب الطريق.
• توريد عمولة المنصة المحددة (20%): يلتزم السائق بتوريد نسبة العمولة المحددة (20% من إجمالي قيمة المقاعد المحجوزة عبر التطبيق) إلى حسابات فَرْزَة البنكية المعتمدة (مثل بنك الكريمي) ورفع إشعار التحويل البنكي للتوثيق لضمان استمرار حسابه في استقبال الحجوزات.`,
    contentEn: `• Vehicle Safety & Licensing: The driver warrants possessing a valid commercial driver's license, verified national identification, and roadworthy inspection records for the Toyota Hilux, verifying optimal air-conditioning and tire safety.
• Timely Departure: The driver must depart promptly at the advertised time and refrain from arbitrary cancellations except in documented force majeure emergencies with immediate passenger notification.
• Highway Safety Standards: The driver must adhere to statutory highway speed limits and exercise reasonable care during intercity mountain and desert routes.
• Commission Remittance (20%): The driver agrees to remit the platform fee (20% of seat fares booked via the platform) to FARZA's authorized bank accounts (e.g., Kuraimi Bank) and submit verifiable payment reference numbers to maintain active dispatch privileges.`,
  },
  {
    id: 'terms-cancellations-refunds',
    titleAr: '4. سياسة الإلغاء وحجز المقاعد',
    titleEn: '4. Cancellation and Seat Reservation Terms',
    contentAr: `• إلغاء الراكب: يحق للراكب إلغاء الحجز مجاناً قبل ساعتين على الأقل من موعد الانطلاق المجدول لإتاحة الفرصة لمسافرين آخرين.
• إلغاء السائق: في حال ألغى السائق رحلته، تلتزم المنصة بمساعدة الراكب في العثور على رحلة بديلة على نفس المسار في أقرب وقت متاح.
• التأخير: في حال تأخر الراكب عن موعد انطلاق الرحلة بأكثر من 15 دقيقة دون إشعار السائق هاتفياً، يحق للسائق الانطلاق لتفادي تعطيل باقي الركاب.`,
    contentEn: `• Passenger Cancellation: Passengers may cancel a reservation free of charge up to 2 hours prior to scheduled departure to release capacity for other travelers.
• Driver Cancellation: If a driver cancels, the platform will actively coordinate with the passenger to secure an alternative verified Hilux trip on the same route.
• Passenger Delay: If a passenger fails to arrive within 15 minutes of departure without telephone communication, the driver may proceed to avoid stranding other passengers.`,
  },
  {
    id: 'terms-liability-dispute',
    titleAr: '5. تسوية النزاعات والمسؤولية القانونية',
    titleEn: '5. Dispute Resolution and Balanced Liability',
    contentAr: `• فريق فض النزاعات: توفر فَرْزَة فريق خدمة عملاء متخصص لفض أي نزاع بين الراكب والسائق بشأن المقاعد أو المواعيد أو العمولات بصورة ودية وعادلة.
• القوة القاهرة: لا تتحمل المنصة أو السائق المسؤولية عن التأخير الناتج عن انقطاعات الطرق الجبلية، الظروف الجوية القاسية، أو التوقفات الإلزامية في النقاط الأمنية الرسمية.
• القانون الواجب التطبيق: تخضع هذه الشروط وتُفسر وفقاً للقوانين واللوائح النافذة في الجمهورية اليمنية، وتختص المحاكم المختصة بالنظر في أي نزاع يتعذر حله ودياً.`,
    contentEn: `• Dispute Mediation: FARZA maintains a dedicated customer support team to mediate fare, baggage, or scheduling disputes impartially and promptly.
• Force Majeure: Neither the platform nor drivers are liable for unforeseen delays triggered by road closures, severe weather, or statutory security checkpoints.
• Governing Law: These Terms are governed by and construed in accordance with the applicable laws of the Republic of Yemen, with jurisdiction vested in competent courts for disputes not resolved amicably.`,
  },
];
