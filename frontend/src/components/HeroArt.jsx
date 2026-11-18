// Decorative illustration for the hero. Each object sits on two nested layers:
// the outer one moves with the mouse (parallax, different depth per object), the inner one floats on its own.
export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 520 340" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#a855f7" stopOpacity=".55" /><stop offset="1" stopColor="#a855f7" stopOpacity="0" /></radialGradient>
        <linearGradient id="bag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c3aed" /><stop offset="1" stopColor="#3b1180" /></linearGradient>
        <linearGradient id="bottle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6d28d9" /><stop offset="1" stopColor="#4c1d95" /></linearGradient>
        <linearGradient id="podium" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a2a85" /><stop offset="1" stopColor="#1e1038" /></linearGradient>
      </defs>

      <g className="layer d0">
        <ellipse className="pulse" cx="270" cy="300" rx="250" ry="34" fill="url(#glow)" />
        <ellipse cx="270" cy="296" rx="215" ry="26" fill="url(#podium)" stroke="#8b5cf6" strokeOpacity=".5" />
      </g>

      <g className="layer d2"><g className="float f2">
        <path d="M205 120c0-30 20-48 52-48s52 18 52 48v152c0 10-8 18-18 18h-68c-10 0-18-8-18-18Z" fill="url(#bag)" stroke="#a78bfa" strokeOpacity=".6" strokeWidth="2" />
        <path d="M228 90c0-14 12-24 29-24s29 10 29 24" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
        <rect x="222" y="170" width="70" height="82" rx="14" fill="#5b21b6" stroke="#a78bfa" strokeOpacity=".5" strokeWidth="2" />
        <path d="M232 190h50" stroke="#c4b5fd" strokeWidth="4" strokeLinecap="round" />
        <rect x="241" y="128" width="32" height="18" rx="5" fill="#2e1065" stroke="#c4b5fd" strokeOpacity=".7" />
      </g></g>

      <g className="layer d3"><g className="float f1">
        <g transform="rotate(-8 140 240)">
          <rect x="104" y="170" width="72" height="124" rx="14" fill="#1a1230" stroke="#8b5cf6" strokeOpacity=".7" strokeWidth="2" />
          <rect x="112" y="180" width="56" height="104" rx="8" fill="#2a1a4f" />
          <circle cx="122" cy="190" r="4" fill="#0f0a1f" />
        </g>
      </g></g>

      <g className="layer d1"><g className="float f3">
        <rect x="376" y="96" width="30" height="16" rx="5" fill="#2e1065" />
        <path d="M368 124c0-8 8-12 23-12s23 4 23 12v152c0 9-7 16-16 16h-14c-9 0-16-7-16-16Z" fill="url(#bottle)" stroke="#a78bfa" strokeOpacity=".5" strokeWidth="2" />
        <path d="M376 150c12 6 28 6 30 0" stroke="#c4b5fd" strokeOpacity=".5" fill="none" strokeWidth="2" />
      </g></g>

      <g className="layer d4"><g className="float f4">
        <g transform="translate(318 196) rotate(12)">
          <circle cx="20" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="5" />
          <path d="M24 30 40 86" stroke="#d1d5db" strokeWidth="9" strokeLinecap="round" />
          <path d="M34 66h14M37 78h14" stroke="#9ca3af" strokeWidth="5" strokeLinecap="round" />
          <path d="M10 32 2 78" stroke="#c9a46b" strokeWidth="9" strokeLinecap="round" />
        </g>
      </g></g>

      <g className="layer d5"><g className="float f5">
        <circle className="pulse" cx="150" cy="86" r="52" fill="url(#glow)" />
        <path d="M150 140s38-34 38-66a38 38 0 0 0-76 0c0 32 38 66 38 66Z" fill="#8b5cf6" fillOpacity=".25" stroke="#d8b4fe" strokeWidth="5" />
        <circle cx="150" cy="74" r="14" fill="none" stroke="#e9d5ff" strokeWidth="5" />
      </g></g>
    </svg>
  );
}
