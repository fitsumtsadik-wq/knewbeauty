export default function BrushGirl() {
  return (
    <div className="brush-girl-wrapper">
      <svg viewBox="0 0 90 115" className="brush-girl-svg" xmlns="http://www.w3.org/2000/svg">

        {/* Hair - natural voluminous */}
        <ellipse cx="40" cy="12" rx="16" ry="17" fill="#0d0400"/>
        <path d="M24 12 Q20 26 22 38" stroke="#0d0400" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M56 12 Q60 26 58 38" stroke="#0d0400" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M26 8 Q40 2 54 8" stroke="#0d0400" strokeWidth="6" fill="none"/>

        {/* Face */}
        <circle cx="40" cy="18" r="11.5" fill="#6B3A2A"/>

        {/* Subtle makeup glow */}
        <ellipse cx="34" cy="21" rx="4" ry="2" fill="rgba(183,110,121,.25)"/>
        <ellipse cx="46" cy="21" rx="4" ry="2" fill="rgba(183,110,121,.25)"/>

        {/* Eyes */}
        <ellipse cx="36" cy="16" rx="2" ry="2.2" fill="#0d0400"/>
        <ellipse cx="44" cy="16" rx="2" ry="2.2" fill="#0d0400"/>
        <circle cx="37" cy="15.2" r=".7" fill="white"/>
        <circle cx="45" cy="15.2" r=".7" fill="white"/>

        {/* Lashes */}
        <line x1="34.2" y1="13.2" x2="33" y2="11.5" stroke="#0d0400" strokeWidth=".9"/>
        <line x1="36" y1="12.8" x2="35.5" y2="11" stroke="#0d0400" strokeWidth=".9"/>
        <line x1="38" y1="12.7" x2="38" y2="11" stroke="#0d0400" strokeWidth=".9"/>
        <line x1="42" y1="12.7" x2="42" y2="11" stroke="#0d0400" strokeWidth=".9"/>
        <line x1="44" y1="12.8" x2="44.5" y2="11" stroke="#0d0400" strokeWidth=".9"/>
        <line x1="45.8" y1="13.2" x2="47" y2="11.5" stroke="#0d0400" strokeWidth=".9"/>

        {/* Eyebrows */}
        <path d="M33 12.5 Q36 11 39 12" stroke="#0d0400" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M41 12 Q44 11 47 12.5" stroke="#0d0400" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

        {/* Nose */}
        <path d="M39 20 Q40 22 41 20" stroke="#4a2416" strokeWidth="1" fill="none"/>

        {/* Lips */}
        <path d="M35.5 24 Q40 27.5 44.5 24" fill="#c9a84c"/>
        <path d="M35.5 24 Q40 22 44.5 24" fill="#e8d5a3"/>
        <line x1="37.5" y1="24" x2="42.5" y2="24" stroke="#a07830" strokeWidth=".5"/>

        {/* Gold earrings */}
        <circle cx="27.5" cy="22" r="2.2" fill="#c9a84c"/>
        <line x1="27.5" y1="24.2" x2="27.5" y2="28" stroke="#c9a84c" strokeWidth="1.2"/>
        <circle cx="27.5" cy="29" r="1.5" fill="#c9a84c"/>
        <circle cx="52.5" cy="22" r="2.2" fill="#c9a84c"/>
        <line x1="52.5" y1="24.2" x2="52.5" y2="28" stroke="#c9a84c" strokeWidth="1.2"/>
        <circle cx="52.5" cy="29" r="1.5" fill="#c9a84c"/>

        {/* Neck */}
        <rect x="36.5" y="29" width="7" height="7" fill="#6B3A2A"/>

        {/* Gold necklace */}
        <path d="M32 36 Q40 40 48 36" stroke="#c9a84c" strokeWidth="1.2" fill="none"/>
        <circle cx="40" cy="40" r="1.5" fill="#c9a84c"/>

        {/* Black dress */}
        <path d="M22 37 Q40 32 58 37 L62 98 Q40 103 18 98 Z" fill="#111111"/>
        {/* Gold dress trim */}
        <path d="M22 37 Q40 32 58 37" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
        <path d="M20 98 Q40 103 60 98" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
        {/* Dress shimmer */}
        <path d="M30 38 Q35 36 40 38 L38 72 Q32 70 29 72 Z" fill="rgba(201,168,76,.06)"/>

        {/* Left arm */}
        <line x1="22" y1="46" x2="11" y2="66" stroke="#6B3A2A" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="10" cy="68" rx="4" ry="3" fill="#6B3A2A"/>

        {/* Right arm + brush (animated) */}
        <g className="brush-arm-anim">
          <line x1="58" y1="46" x2="70" y2="33" stroke="#6B3A2A" strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="71" cy="31" rx="3.5" ry="3" fill="#6B3A2A"/>
          {/* Brush handle - gold */}
          <rect x="68" y="22" width="24" height="4" rx="2" fill="#c9a84c" transform="rotate(-25 68 24)"/>
          {/* Brush ferrule */}
          <rect x="89" y="15" width="5" height="5.5" rx="1" fill="#888" transform="rotate(-25 91 17)"/>
          {/* Bristles - rose */}
          <path d="M93 11 L103 6 L105 17 L95 18 Z" fill="#b76e79" transform="rotate(-25 99 12)"/>
          {/* Sparkles */}
          <circle className="sparkle-1" cx="107" cy="5" r="2" fill="#c9a84c"/>
          <circle className="sparkle-2" cx="112" cy="11" r="1.3" fill="#b76e79"/>
          <circle className="sparkle-3" cx="104" cy="1" r="1.3" fill="white"/>
          <circle className="sparkle-4" cx="115" cy="5" r="1" fill="#c9a84c"/>
        </g>

        {/* Legs */}
        <rect x="31" y="96" width="7" height="15" rx="3.5" fill="#0d0400"/>
        <rect x="42" y="96" width="7" height="15" rx="3.5" fill="#0d0400"/>

        {/* Gold heels */}
        <ellipse cx="34.5" cy="111" rx="5.5" ry="2.5" fill="#c9a84c"/>
        <rect x="38" y="108" width="2" height="5" rx="1" fill="#c9a84c"/>
        <ellipse cx="45.5" cy="111" rx="5.5" ry="2.5" fill="#c9a84c"/>
        <rect x="49" y="108" width="2" height="5" rx="1" fill="#c9a84c"/>

      </svg>
    </div>
  )
}
