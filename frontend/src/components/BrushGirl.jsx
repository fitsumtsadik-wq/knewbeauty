export default function BrushGirl() {
  return (
    <div className="brush-girl-wrapper" title="Find your perfect product!">
      <svg viewBox="0 0 80 110" className="brush-girl-svg" xmlns="http://www.w3.org/2000/svg">

        {/* Hair */}
        <ellipse cx="40" cy="14" rx="15" ry="16" fill="#1a0a00"/>
        <path d="M25 14 Q22 28 24 35" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M55 14 Q58 28 56 35" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>

        {/* Face */}
        <circle cx="40" cy="18" r="11" fill="#8B5E3C"/>

        {/* Eyes */}
        <ellipse cx="36" cy="16.5" rx="1.8" ry="2" fill="#1a0800"/>
        <ellipse cx="44" cy="16.5" rx="1.8" ry="2" fill="#1a0800"/>
        {/* Eye shine */}
        <circle cx="36.8" cy="15.8" r=".6" fill="white"/>
        <circle cx="44.8" cy="15.8" r=".6" fill="white"/>

        {/* Lashes */}
        <line x1="34" y1="13.5" x2="33" y2="12" stroke="#1a0800" strokeWidth=".8"/>
        <line x1="36" y1="13" x2="35.5" y2="11.5" stroke="#1a0800" strokeWidth=".8"/>
        <line x1="38" y1="13" x2="38" y2="11.5" stroke="#1a0800" strokeWidth=".8"/>
        <line x1="42" y1="13" x2="42" y2="11.5" stroke="#1a0800" strokeWidth=".8"/>
        <line x1="44" y1="13" x2="44.5" y2="11.5" stroke="#1a0800" strokeWidth=".8"/>
        <line x1="46" y1="13.5" x2="47" y2="12" stroke="#1a0800" strokeWidth=".8"/>

        {/* Nose */}
        <path d="M39 19 Q40 21 41 19" stroke="#6b4226" strokeWidth="1" fill="none"/>

        {/* Lips */}
        <path d="M36 23 Q40 26 44 23" fill="#b76e79"/>
        <path d="M36 23 Q40 21.5 44 23" fill="#d4899a"/>

        {/* Earrings */}
        <circle cx="28.5" cy="22" r="1.8" fill="#c9a84c"/>
        <circle cx="51.5" cy="22" r="1.8" fill="#c9a84c"/>

        {/* Neck */}
        <rect x="36.5" y="28" width="7" height="7" fill="#8B5E3C"/>

        {/* Dress */}
        <path d="M20 36 Q40 31 60 36 L64 95 Q40 100 16 95 Z" fill="#7B2FBE"/>
        {/* Dress shine */}
        <path d="M28 36 Q33 34 38 36 L36 70 Q30 68 26 70 Z" fill="rgba(255,255,255,.08)"/>

        {/* Neckline */}
        <path d="M36.5 35 Q40 40 43.5 35" fill="#9c3fd4" stroke="none"/>

        {/* Left arm (static, relaxed) */}
        <line x1="20" y1="45" x2="10" y2="65" stroke="#8B5E3C" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="9" cy="67" rx="4" ry="3" fill="#8B5E3C"/>

        {/* Right arm + brush (animated) */}
        <g className="brush-arm-anim">
          <line x1="60" y1="45" x2="72" y2="32" stroke="#8B5E3C" strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="73" cy="30" rx="3.5" ry="3" fill="#8B5E3C"/>
          {/* Brush handle */}
          <rect x="72" y="24" width="22" height="4" rx="2" fill="#c9a84c" transform="rotate(-20 72 26)"/>
          {/* Brush ferrule */}
          <rect x="91" y="19.5" width="5" height="5" rx="1" fill="#a0a0a0" transform="rotate(-20 93 22)"/>
          {/* Bristles */}
          <path d="M95 17 L104 12 L106 22 L97 23 Z" fill="#b76e79" transform="rotate(-20 100 18)"/>
          {/* Sparkles from brush */}
          <circle className="sparkle-1" cx="108" cy="10" r="1.5" fill="#c9a84c"/>
          <circle className="sparkle-2" cx="112" cy="15" r="1" fill="#b76e79"/>
          <circle className="sparkle-3" cx="106" cy="6" r="1" fill="#fff"/>
        </g>

        {/* Legs */}
        <rect x="31" y="93" width="7" height="14" rx="3.5" fill="#5a1f9a"/>
        <rect x="42" y="93" width="7" height="14" rx="3.5" fill="#5a1f9a"/>

        {/* Shoes */}
        <ellipse cx="34.5" cy="107" rx="5.5" ry="2.5" fill="#c9a84c"/>
        <ellipse cx="45.5" cy="107" rx="5.5" ry="2.5" fill="#c9a84c"/>

      </svg>
    </div>
  )
}
