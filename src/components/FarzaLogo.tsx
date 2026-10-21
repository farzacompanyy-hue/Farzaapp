import React from 'react';

interface FarzaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  showSlogan?: boolean;
  animated?: boolean;
}

export const FarzaLogo: React.FC<FarzaLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  showSlogan = false,
  animated = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    custom: '',
  };

  const dimensionClasses = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem in Royal Blue (#245BDB) and Electric Blue (#1769FF) */}
      <div className={`relative shrink-0 ${dimensionClasses} flex items-center justify-center`}>
        <svg
          viewBox="0 0 320 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-[0_4px_16px_rgba(36,91,219,0.28)] ${
            animated ? 'animate-pulse' : ''
          }`}
        >
          <defs>
            {/* Royal Blue to Electric Blue Gradient */}
            <linearGradient id="royalBlueGrad" x1="50" y1="20" x2="280" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1769FF" />
              <stop offset="60%" stopColor="#245BDB" />
              <stop offset="100%" stopColor="#15356B" />
            </linearGradient>

            {/* Light Blue Highlight Gradient */}
            <linearGradient id="softBlueHighlight" x1="120" y1="80" x2="240" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EAF2FF" />
              <stop offset="100%" stopColor="#1769FF" />
            </linearGradient>

            {/* Dark Navy Roadway Gradient */}
            <linearGradient id="navyRoadGrad" x1="120" y1="110" x2="220" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#15356B" />
              <stop offset="60%" stopColor="#10254C" />
              <stop offset="100%" stopColor="#0B1A35" />
            </linearGradient>

            {/* Soft Blue Glow Filter */}
            <filter id="farzaBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Speed Bars on the left (Electric Blue & Royal Blue) */}
          {/* Dash 1 (Top - Electric Blue) */}
          <rect x="85" y="60" width="22" height="7" rx="3.5" fill="#1769FF" opacity="0.95" />
          {/* Dash 2 (Dark Navy with Royal Blue border) */}
          <rect x="68" y="78" width="46" height="7" rx="3.5" fill="#15356B" stroke="#245BDB" strokeWidth="1" />
          {/* Dash 3 (Dark Navy longer) */}
          <rect x="60" y="96" width="60" height="7" rx="3.5" fill="#15356B" stroke="#245BDB" strokeWidth="1" />
          {/* Dash 4 (Bottom - Royal Blue) */}
          <rect x="82" y="114" width="30" height="7" rx="3.5" fill="#245BDB" opacity="0.95" />

          {/* MAIN LETTER 'F' OUTER STREAMLINED HEAD & BODY IN ROYAL BLUE */}
          <path
            d="M 125 64
               C 145 28, 175 22, 225 22
               C 255 22, 275 24, 282 34
               C 287 42, 280 50, 260 56
               C 220 68, 180 72, 160 88
               C 152 94, 148 104, 142 120
               L 115 190
               C 108 208, 98 226, 85 242
               C 92 232, 102 216, 110 196
               L 134 135
               C 142 115, 150 96, 170 82
               C 192 68, 224 64, 252 54
               C 256 52, 258 50, 254 48
               C 246 44, 226 42, 202 42
               C 168 42, 145 48, 130 76
               Z"
            fill="url(#royalBlueGrad)"
            filter="url(#farzaBlueGlow)"
          />

          {/* Top Wing Fill in Royal Blue */}
          <path
            d="M 134 68
               C 150 42, 178 38, 218 36
               C 242 35, 265 37, 274 44
               C 278 48, 270 54, 252 59
               C 214 70, 180 74, 162 92
               C 152 102, 145 118, 138 136
               L 118 190
               C 112 206, 102 222, 90 236
               C 98 224, 106 208, 114 188
               L 132 138
               C 138 122, 144 108, 156 98
               C 172 84, 204 78, 238 68
               C 248 65, 252 61, 246 58
               C 238 54, 220 52, 198 52
               C 164 52, 144 58, 134 68
               Z"
            fill="#245BDB"
          />

          {/* LOWER ASPHALT ROADWAY IN DARK NAVY */}
          <path
            d="M 132 136
               C 138 122, 148 108, 168 100
               C 194 90, 226 90, 250 96
               C 256 98, 258 103, 250 108
               C 228 122, 195 136, 180 156
               C 165 176, 160 200, 156 242
               C 170 242, 192 238, 210 226
               C 216 222, 220 225, 216 230
               C 202 248, 175 258, 145 258
               C 125 258, 115 250, 118 238
               C 122 220, 126 195, 128 170
               Z"
            fill="url(#navyRoadGrad)"
            stroke="#1769FF"
            strokeWidth="1.5"
          />

          {/* ROAD CURVING INNER DIVIDER */}
          <path
            d="M 135 150
               C 142 135, 155 124, 172 118
               C 198 108, 228 108, 245 114
               C 238 118, 218 126, 200 138
               C 182 152, 172 170, 168 198
               C 164 218, 162 236, 160 250
               C 152 250, 142 246, 138 238
               C 134 228, 132 200, 132 176
               Z"
            fill="#10254C"
          />

          {/* HIGHWAY PERSPECTIVE CENTER DASHES IN WHITE & ELECTRIC BLUE */}
          <path d="M 188 122 L 180 126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M 178 140 L 168 146" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 166 162 L 156 170" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M 158 188 L 146 198" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 152 216 L 140 228" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

          {/* INNER SPEED ACCENT (ELECTRIC BLUE / WHITE HIGHLIGHT) */}
          <path
            d="M 138 135
               C 145 120, 155 108, 172 102
               C 192 95, 218 95, 235 100
               C 220 106, 196 114, 180 128
               C 165 142, 156 160, 152 186
               C 146 172, 142 152, 138 135
               Z"
            fill="url(#softBlueHighlight)"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-[#202633] font-['Plus_Jakarta_Sans',sans-serif]">
              FARZA
            </span>
            <span className="text-2xl font-black text-[#245BDB] font-['Cairo',sans-serif]">
              فَرْزَة
            </span>
          </div>
          {showSlogan && (
            <span className="text-xs text-[#7B8494] font-medium tracking-wide">
              احجز مقعدك وانطلق · نقل الركاب بين المدن
            </span>
          )}
        </div>
      )}
    </div>
  );
};
