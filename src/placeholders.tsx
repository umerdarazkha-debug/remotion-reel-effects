// Drawn stand-ins used when an effect gets no image: five scenes and one figure, all plain SVG.
// They exist so every effect renders out of the box. Pass your own images to replace them.
import React from "react";

const fill: React.CSSProperties = { width: "100%", height: "100%", display: "block" };
// deterministic pseudo-random number in 0..1 (no Math.random, so every render is identical)
const rnd = (i: number, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Sunset = () => (
  <>
    <defs>
      <linearGradient id="ph-sunset" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2B1B5A" />
        <stop offset="0.45" stopColor="#F2668B" />
        <stop offset="0.75" stopColor="#FFC56B" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ph-sunset)" />
    <circle cx="690" cy="520" r="230" fill="#FFE9A8" opacity="0.25" />
    <circle cx="690" cy="520" r="150" fill="#FFF1C2" />
    <path d="M0 1150 Q 200 980 420 1090 T 820 1040 T 1080 1120 V 1920 H 0 Z" fill="#8E3B76" />
    <path d="M0 1340 Q 260 1180 520 1300 T 1080 1250 V 1920 H 0 Z" fill="#5B2A6B" />
    <path d="M0 1560 Q 300 1420 620 1540 T 1080 1500 V 1920 H 0 Z" fill="#2E1747" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${90 + i * 118} ${1600 + rnd(i) * 60} l26 -${90 + rnd(i, 2) * 60} l26 ${90 + rnd(i, 2) * 60} Z`} fill="#1B0D2E" />
    ))}
  </>
);

const City = () => (
  <>
    <defs>
      <linearGradient id="ph-city" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B1033" />
        <stop offset="1" stopColor="#4A2F8A" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ph-city)" />
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={rnd(i) * 1080} cy={rnd(i, 2) * 900} r={1.5 + rnd(i, 3) * 2.5} fill="#FFFFFF" opacity={0.4 + rnd(i, 4) * 0.6} />
    ))}
    <circle cx="700" cy="420" r="95" fill="#FDF3C8" />
    <circle cx="735" cy="395" r="80" fill="#1A1A4D" opacity="0.35" />
    {Array.from({ length: 9 }, (_, b) => {
      const x = b * 124 - 10;
      const h = 520 + rnd(b, 5) * 620;
      const y = 1920 - h;
      return (
        <g key={b}>
          <rect x={x} y={y} width={112} height={h} fill={b % 2 ? "#141433" : "#1D1B45"} />
          {Array.from({ length: Math.floor(h / 70) * 3 }, (_, w) => {
            const lit = rnd(b * 97 + w, 6) > 0.45;
            return <rect key={w} x={x + 16 + (w % 3) * 30} y={y + 26 + Math.floor(w / 3) * 70} width={18} height={34} fill={lit ? "#FFD76B" : "#2C2A5E"} />;
          })}
        </g>
      );
    })}
  </>
);

const Sea = () => (
  <>
    <defs>
      <linearGradient id="ph-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#58BDF0" />
        <stop offset="1" stopColor="#E9F8FF" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ph-sea)" />
    <circle cx="300" cy="420" r="120" fill="#FFF6C9" />
    {[0, 1, 2].map((i) => (
      <g key={i} fill="#FFFFFF" opacity={0.85}>
        <ellipse cx={220 + i * 330} cy={700 + (i % 2) * 110} rx={130} ry={44} />
        <ellipse cx={290 + i * 330} cy={672 + (i % 2) * 110} rx={90} ry={50} />
      </g>
    ))}
    <rect y="1080" width="1080" height="840" fill="#1E7FB8" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M-40 ${1180 + i * 130} q 70 -34 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0`} fill="none" stroke={i % 2 ? "#7FD3F7" : "#BDEBFF"} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
    ))}
    <path d="M640 1060 h220 l-40 60 h-140 Z" fill="#2B2118" />
    <path d="M748 1050 V 800 l150 250 Z" fill="#FFFFFF" />
    <path d="M736 1050 V 850 l-110 200 Z" fill="#FF4F86" />
  </>
);

const Mountains = () => (
  <>
    <defs>
      <linearGradient id="ph-mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9FD4EE" />
        <stop offset="1" stopColor="#F6FBFF" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ph-mtn)" />
    <path d="M-60 1200 L 300 480 L 660 1200 Z" fill="#6E86A6" />
    <path d="M300 480 L 215 650 L 270 620 L 310 680 L 350 610 L 392 664 Z" fill="#FFFFFF" />
    <path d="M420 1200 L 800 380 L 1180 1200 Z" fill="#52698A" />
    <path d="M800 380 L 706 584 L 770 548 L 812 620 L 852 540 L 900 596 Z" fill="#FFFFFF" />
    <path d="M0 1200 Q 300 1100 560 1190 T 1080 1150 V 1920 H 0 Z" fill="#3F7D5C" />
    <path d="M0 1480 Q 320 1380 640 1470 T 1080 1440 V 1920 H 0 Z" fill="#2C5E45" />
    {Array.from({ length: 11 }, (_, i) => {
      const x = 40 + i * 100 + rnd(i) * 30;
      const y = 1250 + rnd(i, 2) * 90;
      if (x > 330 && x < 540) return null; // leave room for the cabin
      return <path key={i} d={`M${x} ${y} l40 -150 l40 150 Z`} fill="#1F4734" />;
    })}
    {/* cabin with a lit window: the "detail" the pull-back effect starts on */}
    <rect x="372" y="1270" width="120" height="80" fill="#6B4226" />
    <path d="M356 1274 L 432 1210 L 508 1274 Z" fill="#3B2314" />
    <rect x="416" y="1292" width="32" height="32" fill="#FFD76B" />
  </>
);

const Studio = () => (
  <>
    <defs>
      <linearGradient id="ph-studio" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFB199" />
        <stop offset="1" stopColor="#7A5CFF" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ph-studio)" />
    <circle cx="220" cy="460" r="260" fill="#FFE08A" opacity="0.55" />
    <circle cx="880" cy="1200" r="340" fill="#FF4F86" opacity="0.45" />
    <circle cx="380" cy="1560" r="240" fill="#5B6CFF" opacity="0.5" />
    <rect x="300" y="700" width="480" height="340" rx="36" fill="#FFFFFF" opacity="0.85" />
    <rect x="340" y="748" width="180" height="26" rx="13" fill="#16151C" opacity="0.8" />
    <rect x="340" y="800" width="400" height="18" rx="9" fill="#16151C" opacity="0.3" />
    <rect x="340" y="838" width="330" height="18" rx="9" fill="#16151C" opacity="0.3" />
    <rect x="340" y="930" width="150" height="64" rx="32" fill="#FF4F86" />
  </>
);

const SCENES = [Sunset, City, Sea, Mountains, Studio];

/** A drawn background scene. `n` picks one of five (0 sunset, 1 city, 2 sea, 3 mountains, 4 studio). */
export const Scene: React.FC<{ n?: number; style?: React.CSSProperties }> = ({ n = 0, style }) => {
  const S = SCENES[((n % SCENES.length) + SCENES.length) % SCENES.length];
  return (
    <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{ ...fill, ...style }}>
      <S />
    </svg>
  );
};

/** A drawn person with a transparent background, standing in for a cut-out photo of you. */
export const Figure: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 940 940" style={{ display: "block", aspectRatio: "1 / 1", ...style }}>
    <path d="M110 940 C 110 720 250 610 470 610 C 690 610 830 720 830 940 Z" fill="#FF4F86" />
    <path d="M360 620 Q 470 720 580 620 L 560 600 H 380 Z" fill="#E03D72" />
    <rect x="410" y="500" width="120" height="150" rx="50" fill="#D9A07A" />
    <ellipse cx="470" cy="380" rx="158" ry="182" fill="#E8B48F" />
    <path d="M306 372 C 290 190 400 150 480 156 C 600 150 660 240 634 380 C 612 290 560 262 470 264 C 380 262 330 292 306 372 Z" fill="#2B2118" />
    <rect x="336" y="352" width="118" height="74" rx="30" fill="#16151C" />
    <rect x="486" y="352" width="118" height="74" rx="30" fill="#16151C" />
    <rect x="446" y="372" width="48" height="14" fill="#16151C" />
    <path d="M410 478 Q 470 520 530 478" fill="none" stroke="#8A4B3A" strokeWidth="10" strokeLinecap="round" />
    <path d="M430 660 v120 M510 660 v120" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
  </svg>
);
