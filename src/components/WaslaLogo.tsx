import React from 'react';

export interface WaslaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  showSlogan?: boolean;
  animated?: boolean;
  variant?: 'light' | 'dark';
}

export const WaslaLogo: React.FC<WaslaLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  showSlogan = false,
  animated = false,
  variant = 'light',
}) => {
  // Proportional sizing for the 2.1:1 landscape emblem
  const sizeMap = {
    xs: 'h-6 w-12 sm:h-7 sm:w-14',
    sm: 'h-8 w-16 sm:h-9 sm:w-20',
    md: 'h-11 w-24 sm:h-12 sm:w-28',
    lg: 'h-16 w-36 sm:h-20 sm:w-44',
    xl: 'h-24 w-52 sm:h-28 sm:w-60',
    custom: '',
  };

  const dimensionClasses = sizeMap[size] || sizeMap.md;

  // Unique ID prefix to avoid SVG gradient collisions if rendered multiple times
  const idSuffix = React.useId().replace(/:/g, '');

  const leftRingGradId = `waslaLeftGrad_${idSuffix}`;
  const wawGradId = `waslaWawGrad_${idSuffix}`;
  const circuitGradId = `waslaCircuitGrad_${idSuffix}`;
  const sheenGradId = `waslaSheenGrad_${idSuffix}`;
  const glowFilterId = `waslaGlow_${idSuffix}`;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} dir="rtl">
      {/* SVG Emblem: Finalized Official WASLA (وَصْلَة) Design */}
      {/* Infinity dynamic loop uniting the Electric Blue origin ring, route circuit, and the Arabic 'و' (Waw) */}
      <div className={`relative shrink-0 ${dimensionClasses} flex items-center justify-center`}>
        <svg
          viewBox="0 0 540 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-[0_4px_16px_rgba(0,86,179,0.25)] transition-transform duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
        >
          <defs>
            {/* Left Ring Gradient: Vibrant Electric Blue to Royal Blue */}
            <linearGradient id={leftRingGradId} x1="70" y1="60" x2="220" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0088FF" />
              <stop offset="35%" stopColor="#0072F5" />
              <stop offset="70%" stopColor="#0056B3" />
              <stop offset="100%" stopColor="#00438F" />
            </linearGradient>

            {/* Arabic 'و' (Waw) Gradient: Royal Blue along bottom trough to Deep Luxury Midnight Sapphire */}
            <linearGradient id={wawGradId} x1="220" y1="225" x2="480" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0056B3" />
              <stop offset="30%" stopColor="#0B3175" />
              <stop offset="65%" stopColor="#122754" />
              <stop offset="100%" stopColor="#142144" />
            </linearGradient>

            {/* Circuit Route Track Gradient: Vivid Electric Cyan-Blue */}
            <linearGradient id={circuitGradId} x1="145" y1="160" x2="355" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#009BFF" />
              <stop offset="50%" stopColor="#007CF0" />
              <stop offset="100%" stopColor="#005FD8" />
            </linearGradient>

            {/* Specular Light Reflection along Top Curves */}
            <linearGradient id={sheenGradId} x1="100" y1="50" x2="190" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#CFE4FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id={glowFilterId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. SWEEPING TAIL OF 'و' & BOTTOM INFINITY CROSSING (Connecting smoothly to left ring) */}
          <path
            d="M 478 122
               C 478 180, 428 224, 350 224
               C 274 224, 218 198, 175 162
               L 194 136
               C 232 166, 278 190, 344 190
               C 402 190, 442 158, 444 122
               Z"
            fill={`url(#${wawGradId})`}
          />

          {/* 2. HEAD LOOP OF THE ARABIC 'و' (Waw) */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 424 54
               C 460 54, 484 82, 484 120
               C 484 154, 458 176, 424 176
               C 390 176, 364 148, 364 116
               C 364 80, 390 54, 424 54
               Z
               M 422 86
               C 404 86, 394 98, 394 116
               C 394 134, 406 144, 422 144
               C 440 144, 452 132, 452 116
               C 452 98, 440 86, 422 86
               Z"
            fill={`url(#${wawGradId})`}
            filter={`url(#${glowFilterId})`}
          />

          {/* 3. LEFT CIRCULAR RING (Electric Blue Torus) */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 145 54
               A 76 76 0 1 0 145 206
               A 76 76 0 1 0 145 54
               Z
               M 145 86
               A 44 44 0 1 1 145 174
               A 44 44 0 1 1 145 86
               Z"
            fill={`url(#${leftRingGradId})`}
            filter={`url(#${glowFilterId})`}
          />

          {/* 4. INNER CONNECTING S-TRACK (Route Linking Origin Node to Destination Node) */}
          <path
            d="M 145 150
               C 145 174, 168 188, 198 184
               C 228 180, 258 152, 282 122
               C 305 95, 330 86, 354 86"
            fill="none"
            stroke={`url(#${circuitGradId})`}
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* 5. SPEED ACCENT LINE (Paralleling the circuit track with tapered arrow tip) */}
          <path
            d="M 226 146
               C 250 122, 276 100, 305 90"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
          />
          {/* Arrow tip on speed line */}
          <polygon
            points="312,88 300,83 304,88 301,93"
            fill="#38BDF8"
          />

          {/* 6. NODE 1 (Center of Left Ring - Departure Origin Hub) */}
          <circle cx="145" cy="130" r="21" fill={`url(#${circuitGradId})`} />
          <circle cx="145" cy="130" r="9.5" fill={variant === 'dark' ? '#0C1A33' : '#FFFFFF'} />

          {/* 7. NODE 2 (Destination Hub at Upper Right of Track) */}
          <circle cx="355" cy="86" r="17" fill={`url(#${circuitGradId})`} />
          <circle cx="355" cy="86" r="7.5" fill={variant === 'dark' ? '#0C1A33' : '#FFFFFF'} />

          {/* 8. METALLIC SPECULAR SHEEN HIGHLIGHTS (Dynamic Light Reflection) */}
          <path
            d="M 145 57
               A 73 73 0 0 1 212 110"
            fill="none"
            stroke={`url(#${sheenGradId})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 424 58
               C 445 58, 465 72, 474 96"
            fill="none"
            stroke={`url(#${sheenGradId})`}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${
                variant === 'dark' ? 'text-white' : 'text-[#1A2536]'
              }`}
            >
              WASLA
            </span>
            <span className="text-2xl font-black text-[#0056B3] font-['Cairo',sans-serif]">
              وَصْلَة
            </span>
          </div>
          {showSlogan && (
            <span
              className={`text-xs font-semibold tracking-wide ${
                variant === 'dark' ? 'text-[#CFE4FF]' : 'text-[#64748B]'
              }`}
            >
              احجز مقعدك وانطلق · منصة النقل بين المدن اليمنية
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WaslaLogo;
