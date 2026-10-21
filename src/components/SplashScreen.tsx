import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarzaLogo } from './FarzaLogo';
import { ASSETS } from '../data/mockData';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationSeconds?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationSeconds = 3.5,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(true);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);
    const t2 = setTimeout(() => setStage(2), 900);
    const t3 = setTimeout(() => setStage(3), 1700);
    const t4 = setTimeout(() => setStage(4), 2400);

    const totalTime = durationSeconds * 1000;
    const tEnd = setTimeout(() => {
      onComplete();
    }, Math.max(totalTime, 3500));

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, [durationSeconds, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0C1A33] flex flex-col items-center justify-center select-none text-white">
      {/* Top Controls: Skip & Audio */}
      <div className="absolute top-6 left-6 right-6 z-40 flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#15356B]/90 hover:bg-[#245BDB] text-white text-xs font-semibold backdrop-blur-md border border-[#1769FF]/40 transition-all cursor-pointer shadow-lg group"
        >
          <span>تخطي المقدمة</span>
          <ArrowLeft className="w-3.5 h-3.5 text-[#EAF2FF] group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#EAF2FF]/80 font-mono tracking-widest hidden sm:inline-block">
            FARZA NAVIGATION SYSTEM
          </span>
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="w-9 h-9 rounded-full bg-[#15356B]/90 flex items-center justify-center text-[#EAF2FF] hover:text-white border border-[#1769FF]/30 transition-colors"
            title={soundMuted ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1769FF]" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Ambient Glow Gradients (Navy & Electric Blue) */}
        <div className="absolute inset-0 bg-radial from-[#15356B]/60 via-[#0C1A33] to-[#071021] opacity-95" />
        
        {/* Modern GPS Navigation Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(23, 105, 255, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(23, 105, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
          }}
        />

        {/* Realistic Digital Map Background (Generated High-Res Royal Blue GPS Map) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: stage >= 1 ? 0.45 : 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <img
            src={ASSETS.digitalMap}
            alt="Yemen Intercity Digital Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover mix-blend-screen filter contrast-125 brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A33] via-transparent to-[#0C1A33]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1A33] via-transparent to-[#0C1A33]" />
        </motion.div>

        {/* Interactive SVG Winding Road & Hilux Trajectory */}
        <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] px-4 flex items-center justify-center">
          <svg
            viewBox="0 0 800 450"
            className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(23,105,255,0.3)]"
          >
            <defs>
              {/* Electric Blue to Royal Blue Route Gradient */}
              <linearGradient id="routeElectricGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15356B" />
                <stop offset="50%" stopColor="#245BDB" />
                <stop offset="100%" stopColor="#1769FF" />
              </linearGradient>

              {/* Electric Blue Glow Filter */}
              <filter id="routeElectricGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Secondary Connecting Roads */}
            <path
              d="M 120 380 Q 240 320 280 260 T 480 210 T 680 120"
              fill="none"
              stroke="#132B52"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 280 260 Q 320 360 440 390"
              fill="none"
              stroke="#132B52"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M 380 130 Q 420 180 480 210"
              fill="none"
              stroke="#132B52"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Asphalt Highway Bed in Deep Navy */}
            <path
              d="M 140 370 C 260 320, 290 280, 390 270 C 490 260, 520 180, 640 130"
              fill="none"
              stroke="#071224"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d="M 140 370 C 260 320, 290 280, 390 270 C 490 260, 520 180, 640 130"
              fill="none"
              stroke="#15356B"
              strokeWidth="22"
              strokeLinecap="round"
            />

            {/* The Animated Glowing Route (#1769FF) drawing from Sana'a to Aden */}
            <motion.path
              d="M 140 370 C 260 320, 290 280, 390 270 C 490 260, 520 180, 640 130"
              fill="none"
              stroke="url(#routeElectricGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
              filter="url(#routeElectricGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: stage >= 2 ? 1 : 0, 
                opacity: stage >= 2 ? 1 : 0 
              }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />

            {/* Dashed Center Road Stripe */}
            <motion.path
              d="M 140 370 C 260 320, 290 280, 390 270 C 490 260, 520 180, 640 130"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              opacity={stage >= 2 ? 0.85 : 0}
              transition={{ duration: 0.5 }}
            />

            {/* Departure City Node (صنعاء / Sana'a) */}
            <g transform="translate(140, 370)">
              <circle r="14" fill="#1769FF" opacity="0.3" className="animate-ping" />
              <circle r="7" fill="#0C1A33" stroke="#1769FF" strokeWidth="3" />
              <circle r="3" fill="#FFFFFF" />
              <text
                x="0"
                y="28"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13"
                fontWeight="700"
                fontFamily="Cairo"
                className="drop-shadow-md"
              >
                صنعاء (الانطلاق)
              </text>
            </g>

            {/* Waypoint: Dhamar (ذمار) */}
            <g transform="translate(290, 305)">
              <circle r="4" fill="#245BDB" opacity="0.9" />
              <text x="0" y="-12" textAnchor="middle" fill="#EAF2FF" fontSize="10" fontFamily="Cairo">
                ذمار
              </text>
            </g>

            {/* Waypoint: Ibb (إب) */}
            <g transform="translate(390, 270)">
              <circle r="4" fill="#245BDB" opacity="0.9" />
              <text x="0" y="-12" textAnchor="middle" fill="#EAF2FF" fontSize="10" fontFamily="Cairo">
                إب
              </text>
            </g>

            {/* Waypoint: Taiz (تعز) */}
            <g transform="translate(510, 210)">
              <circle r="4" fill="#245BDB" opacity="0.9" />
              <text x="0" y="-12" textAnchor="middle" fill="#EAF2FF" fontSize="10" fontFamily="Cairo">
                تعز
              </text>
            </g>

            {/* Destination City Node (عدن / Aden) */}
            <g transform="translate(640, 130)">
              <circle r="16" fill="#1769FF" opacity="0.3" className="animate-ping" />
              <circle r="8" fill="#0C1A33" stroke="#1769FF" strokeWidth="3" />
              <circle r="3.5" fill="#FFFFFF" />
              <text
                x="0"
                y="-18"
                textAnchor="middle"
                fill="#EAF2FF"
                fontSize="13"
                fontWeight="700"
                fontFamily="Cairo"
                className="drop-shadow-md"
              >
                عدن (الوجهة)
              </text>
            </g>

            {/* BLACK TOYOTA HILUX GLIDING ON THE ELECTRIC BLUE HIGHWAY */}
            {stage >= 3 && (
              <motion.g
                initial={{ offsetDistance: '0%', opacity: 0, scale: 0.8 }}
                animate={{ 
                  offsetDistance: ['5%', '65%'], 
                  opacity: [0, 1, 1],
                  scale: [0.8, 1, 1]
                }}
                transition={{ 
                  duration: 1.8, 
                  ease: 'easeOut',
                  times: [0, 0.2, 1]
                }}
                style={{
                  offsetPath: `path('M 140 370 C 260 320, 290 280, 390 270 C 490 260, 520 180, 640 130')`,
                  offsetRotate: 'auto',
                }}
              >
                {/* Electric Blue road reflection aura */}
                <ellipse cx="0" cy="8" rx="28" ry="12" fill="#1769FF" opacity="0.35" filter="url(#routeElectricGlow)" />
                <ellipse cx="0" cy="6" rx="20" ry="8" fill="#061226" opacity="0.8" />

                {/* Headlight Beams projecting forward */}
                <polygon
                  points="18,-4 58,-14 62,14 18,4"
                  fill="url(#routeElectricGrad)"
                  opacity="0.35"
                  filter="url(#routeElectricGlow)"
                />

                {/* Black Toyota Hilux Silhouette */}
                <g transform="translate(-24, -14) scale(0.68)">
                  <rect x="0" y="8" width="70" height="22" rx="4" fill="#0A101C" stroke="#245BDB" strokeWidth="1.5" />
                  <rect x="4" y="9" width="22" height="18" rx="2" fill="#060B14" stroke="#15356B" strokeWidth="1" />
                  <path
                    d="M 26 9 L 34 2 L 52 2 L 60 9 Z"
                    fill="#15356B"
                    stroke="#1769FF"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />
                  <polygon points="35,4 51,4 57,8 29,8" fill="#EAF2FF" opacity="0.4" />
                  
                  <rect x="68" y="11" width="3" height="15" rx="1.5" fill="#245BDB" />
                  
                  {/* Headlights in bright electric blue/white */}
                  <circle cx="69" cy="13" r="2.5" fill="#EAF2FF" filter="url(#routeElectricGlow)" />
                  <circle cx="69" cy="23" r="2.5" fill="#EAF2FF" filter="url(#routeElectricGlow)" />

                  <rect x="0" y="11" width="2" height="4" rx="1" fill="#FF4444" />
                  <rect x="0" y="21" width="2" height="4" rx="1" fill="#FF4444" />

                  <circle cx="16" cy="30" r="5.5" fill="#040810" stroke="#245BDB" strokeWidth="1.5" />
                  <circle cx="16" cy="30" r="2" fill="#1769FF" opacity="0.8" />
                  <circle cx="54" cy="30" r="5.5" fill="#040810" stroke="#245BDB" strokeWidth="1.5" />
                  <circle cx="54" cy="30" r="2" fill="#1769FF" opacity="0.8" />

                  <text x="35" y="23" fill="#EAF2FF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                    HILUX
                  </text>
                </g>
              </motion.g>
            )}
          </svg>

          {/* REALISTIC TOYOTA HILUX PREVIEW CARD */}
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-2 left-4 sm:left-10 z-30 flex items-center gap-3 p-2.5 rounded-2xl bg-[#15356B]/90 border border-[#1769FF]/40 backdrop-blur-md shadow-2xl"
            >
              <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-[#245BDB]/40 bg-black shrink-0">
                <img
                  src={ASSETS.hiluxBlack}
                  alt="Toyota Hilux Black"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>Toyota Hilux 4x4</span>
                  <span className="text-[10px] text-white bg-[#245BDB] px-1.5 py-0.5 rounded font-black">أسود</span>
                </div>
                <p className="text-[10px] text-[#EAF2FF]">السيارة المعتمدة للرحلات بين المحافظات</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* LOGO & SLOGAN REVEAL OVERLAY (Stage 4) */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none p-6"
            >
              {/* Glassmorphic Backdrop in Royal Blue / Dark Navy */}
              <div className="relative flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-[#0F2347]/90 border border-[#1769FF]/40 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(7,16,33,0.9)] max-w-md w-full text-center">
                
                {/* Luminous Glow behind Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#1769FF]/25 rounded-full blur-3xl pointer-events-none" />

                {/* FARZA Emblem Logo (Royal Blue & Electric Blue) */}
                <FarzaLogo size="xl" showText={false} animated={true} />

                {/* Brand Name Typography */}
                <div className="mt-4 flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                    FARZA
                  </h1>
                  <span className="text-3xl sm:text-4xl font-black text-[#1769FF] font-['Cairo',sans-serif]">
                    فَرْزَة
                  </span>
                </div>

                {/* Slogan */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-3 space-y-1"
                >
                  <p className="text-sm sm:text-base font-bold text-[#FFFFFF] drop-shadow-sm font-['Cairo',sans-serif]">
                    "من مدينة إلى مدينة... رحلتك تبدأ من فَرْزَة"
                  </p>
                  <p className="text-xs text-[#EAF2FF] font-medium">
                    احجز مقعدك وانطلق · منصة النقل الموثوقة في اليمن
                  </p>
                </motion.div>

                {/* Progress Indicator */}
                <div className="mt-6 w-36 h-1 bg-[#15356B] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#245BDB] via-[#1769FF] to-[#EAF2FF]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
