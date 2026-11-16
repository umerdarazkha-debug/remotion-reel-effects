// 17 reel effects for Remotion.
// Every effect takes `f` (frames since the effect started) plus optional content, fills a 1080x1920 frame at 30 fps,
// and is deterministic: the same `f` always draws the same picture, so it is safe to seek and render.
// Images are optional. Leave them out and a drawn scene or figure from placeholders.tsx is used.
// An image can be a file name in the public/ folder ("me.png") or a full URL.
// Demo of all 17: Gallery.tsx (composition EffectsGallery).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Figure, Scene } from "./placeholders";

export const { fontFamily: SIMPLE } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FPS = 30;
const ez = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const io = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const sp = (f: number, at = 0, damping = 13, stiffness = 170) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.6 } });
const WHITE = "#FFFFFF";
const PINK = "#FF4F86";

const url = (s: string) => (/^(https?:|data:|blob:|\/)/.test(s) ? s : staticFile(s));

/** A full-size picture: your image if you pass `src`, otherwise drawn scene number `n`. */
const Photo: React.FC<{ src?: string; n?: number; style?: React.CSSProperties }> = ({ src, n = 0, style }) =>
  src ? <Img src={url(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} /> : <Scene n={n} style={style} />;

/** The person in the shot: your cut-out (a PNG with a transparent background) if you pass `src`, otherwise a drawn figure. */
const Subject: React.FC<{ src?: string; style?: React.CSSProperties }> = ({ src, style }) => (src ? <Img src={url(src)} style={style} /> : <Figure style={style} />);

/** Gives its child the frame counted from the start of the surrounding <Sequence>: <At>{(f) => <Orbit f={f} />}</At> */
export const At: React.FC<{ children: (f: number) => React.ReactNode }> = ({ children }) => <>{children(useCurrentFrame())}</>;

/* 01 ORBIT: the camera circles a card in 3D while satellite cards orbit around it. */
export const Orbit: React.FC<{ f: number; src?: string }> = ({ f, src }) => {
  const a = (f / 90) * Math.PI * 2;
  return (
    <AbsoluteFill style={{ perspective: 1600, background: "radial-gradient(circle at 50% 45%, #2A1F4F, #07070C)" }}>
      <div style={{ position: "absolute", left: 290, top: 620, width: 500, height: 680, transformStyle: "preserve-3d", transform: `rotateY(${Math.sin(a) * 28}deg) rotateX(${Math.cos(a) * 8}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
          <Photo src={src} n={0} />
        </div>
        {[0, 1, 2, 3].map((i) => {
          const b = a + (i / 4) * Math.PI * 2;
          return <div key={i} style={{ position: "absolute", left: 200, top: 290, width: 110, height: 110, borderRadius: 24, background: [PINK, "#5B6CFF", "#FFAE6B", "#30D158"][i], transform: `translate3d(${Math.cos(b) * 460}px, ${Math.sin(b * 2) * 60}px, ${Math.sin(b) * 460}px)`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 02 COUCH WALL: the subject sits in front of a wall of screens that light up one by one behind them. */
export const CouchWall: React.FC<{ f: number; subject?: string; photos?: string[] }> = ({ f, subject, photos }) => (
  <AbsoluteFill style={{ background: "#0B0B10" }}>
    <div style={{ position: "absolute", left: -40, right: -40, top: 160, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, transform: `translateX(${Math.sin(f / 50) * 20}px)` }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const on = f > i * 3;
        return (
          <div key={i} style={{ height: 300, borderRadius: 14, overflow: "hidden", border: "4px solid #222", opacity: on ? 1 : 0.15, filter: on ? "none" : "grayscale(1)", transform: `scale(${on ? 1 : 0.9})` }}>
            <Photo src={photos?.length ? photos[i % photos.length] : undefined} n={i % 4} />
          </div>
        );
      })}
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.85))" }} />
    <Subject src={subject} style={{ position: "absolute", left: 60, bottom: -40, width: 960, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))" }} />
  </AbsoluteFill>
);

/* 03 UI WORLD: fly forward through a 3D space full of floating UI cards. */
export const UiWorld: React.FC<{ f: number }> = ({ f }) => {
  const cards = Array.from({ length: 28 }, (_, i) => ({ x: ((i * 397) % 760) - 380, y: ((i * 611) % 1100) - 550, z: -i * 260, c: [PINK, "#5B6CFF", "#FFAE6B", "#F2F2F7"][i % 4] }));
  const cam = 900 + f * 60;
  return (
    <AbsoluteFill style={{ perspective: 900, background: "radial-gradient(circle at 50% 50%, #1B1640, #05050A)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540, top: 960, transformStyle: "preserve-3d", transform: `translateZ(${cam}px)` }}>
        {cards.map((c, i) => {
          const z = c.z + cam;
          const fade = interpolate(z, [-6000, -2500, 200, 700], [0, 1, 1, 0], CLAMP);
          return (
            <div key={i} style={{ position: "absolute", left: c.x - 190, top: c.y - 115, width: 380, height: 230, borderRadius: 26, background: "rgba(255,255,255,0.1)", border: `3px solid ${c.c}`, transform: `translateZ(${c.z}px)`, opacity: fade, padding: 18 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: c.c }} />
              <div style={{ height: 14, width: "80%", borderRadius: 7, background: "rgba(255,255,255,0.5)", marginTop: 16 }} />
              <div style={{ height: 14, width: "55%", borderRadius: 7, background: "rgba(255,255,255,0.3)", marginTop: 10 }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 04 FRAME BREAK: the subject starts inside a picture frame, then steps out over its border. */
export const FrameBreak: React.FC<{ f: number; subject?: string; bg?: string }> = ({ f, subject, bg }) => {
  const k = io((f - 25) / 30);
  return (
    <AbsoluteFill style={{ background: "#ECE6DB" }}>
      <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 900, border: "26px solid #2B2118", boxShadow: "0 30px 70px rgba(0,0,0,0.35)", overflow: "hidden" }}>
        <Photo src={bg} n={0} style={{ filter: "blur(2px) brightness(0.8)" }} />
      </div>
      {/* inside the frame (clipped) */}
      <div style={{ position: "absolute", left: 166, top: 546, width: 748, height: 848, overflow: "hidden", opacity: 1 - k }}>
        <Subject src={subject} style={{ position: "absolute", left: 20, bottom: -60, width: 720 }} />
      </div>
      {/* breaking out (unclipped, bigger, in front of the frame) */}
      <Subject src={subject} style={{ position: "absolute", left: 186 - k * 120, bottom: 466 - 60 - k * 200, width: 720 + k * 300, opacity: k, filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.5))" }} />
    </AbsoluteFill>
  );
};

/* 05 DIGITAL ZOOM: a punch-in to a detail with a focus box, scanlines and a zoom readout. */
export const DigitalZoom: React.FC<{ f: number; src?: string; target?: [number, number] }> = ({ f, src, target = [0.64, 0.27] }) => {
  const k = io((f - 15) / 20);
  const z = 1 + k * 2.4;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${target[0] * 100}% ${target[1] * 100}%`, filter: `contrast(${1 + k * 0.2})` }}>
        <Photo src={src} n={0} />
      </div>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)", opacity: k }} />
      <div style={{ position: "absolute", left: target[0] * 1080 - 180, top: target[1] * 1920 - 140, width: 360, height: 280, border: `4px solid ${PINK}`, opacity: 1 - k }} />
      <div style={{ position: "absolute", left: 60, top: 260, fontFamily: "monospace", fontWeight: 700, fontSize: 40, color: PINK, background: "rgba(0,0,0,0.6)", padding: "6px 16px" }}>ZOOM {z.toFixed(1)}×</div>
    </AbsoluteFill>
  );
};

/* 06 PHONE MOCKUP: content plays inside a phone that tilts in 3D and settles. */
export const PhoneMockup: React.FC<{ f: number; src?: string; children?: React.ReactNode }> = ({ f, src, children }) => {
  const k = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ perspective: 1600, background: "radial-gradient(circle at 50% 40%, #3A2F55, #0B0A12)" }}>
      <div style={{ position: "absolute", left: 270, top: 380, width: 540, height: 1120, borderRadius: 80, background: "#111", padding: 22, transform: `rotateY(${(1 - k) * -40 + Math.sin(f / 30) * 6}deg) rotateX(${(1 - k) * 18}deg) translateY(${(1 - k) * 300}px)`, boxShadow: "0 60px 120px rgba(0,0,0,0.7), inset 0 0 0 4px #333" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 60, overflow: "hidden", position: "relative", background: "#000" }}>
          {children ?? <Photo src={src} n={1} style={{ transform: `scale(${1.1 - 0.1 * ez(f / 90)})` }} />}
          <div style={{ position: "absolute", left: "50%", top: 18, width: 150, height: 40, marginLeft: -75, borderRadius: 20, background: "#000" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 07 CHECKLIST: items arrive and tick off one by one with a strike. */
export const Checklist: React.FC<{ f: number; items?: string[] }> = ({ f, items = ["Write the hook", "Record the voice-over", "Build the motion", "Schedule the post"] }) => (
  <AbsoluteFill style={{ background: "#F5F1EA" }}>
    <div style={{ position: "absolute", left: 100, right: 100, top: 520 }}>
      {items.map((t, i) => {
        const at = 6 + i * 16;
        const k = sp(f, at);
        const done = ez((f - at - 8) / 8);
        return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 40, opacity: k, transform: `translateX(${(1 - k) * -80}px)` }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, border: "6px solid #16151C", background: done > 0.5 ? PINK : "transparent", display: "grid", placeItems: "center", fontSize: 50, color: WHITE, transform: `scale(${1 + 0.2 * Math.sin(Math.PI * done)})` }}>{done > 0.5 ? "✓" : ""}</div>
            <div style={{ position: "relative", fontFamily: SIMPLE, fontWeight: 800, fontSize: 64, color: done > 0.5 ? "rgba(22,21,28,0.4)" : "#16151C", letterSpacing: "-0.02em" }}>
              {t}
              <div style={{ position: "absolute", left: 0, right: 0, top: "52%", height: 7, background: PINK, transform: `scaleX(${done})`, transformOrigin: "0 50%" }} />
            </div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* 08 HEADLINE WALL: news headlines stack up on a wall, each one slamming in at an angle. */
export const HeadlineWall: React.FC<{ f: number; lines?: string[]; tag?: string }> = ({ f, tag = "EXAMPLE HEADLINE", lines = ["AI writes 40% of new code", "Search clicks fall again", "Agents join group chats", "Creators go faceless", "The feed is now AI-made", "Brands hire AI teams"] }) => (
  <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
    {lines.map((t, i) => {
      const k = sp(f, i * 7, 11, 260);
      return (
        <div key={t} style={{ position: "absolute", left: 50 + (i % 2) * 60, right: 50 - (i % 2) * 40, top: 300 + i * 220, background: i % 3 === 0 ? PINK : "#F4EFE6", padding: "26px 30px", transform: `rotate(${(i % 2 ? 2 : -2) * k}deg) scale(${2 - k})`, opacity: Math.min(1, k * 1.5), boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: SIMPLE, fontWeight: 800, fontSize: 60, letterSpacing: "-0.03em", color: i % 3 === 0 ? WHITE : "#111", textTransform: "uppercase" }}>{t}</div>
          <div style={{ fontFamily: "monospace", fontSize: 22, color: i % 3 === 0 ? "rgba(255,255,255,0.8)" : "#777", marginTop: 6 }}>{tag}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

/* 09 ZOOM-THROUGH CUT: zoom into a screen inside the shot until it becomes the next scene. */
export const ZoomThrough: React.FC<{ f: number; from?: string; to?: string; hole?: [number, number] }> = ({ f, from, to, hole = [0.64, 0.27] }) => {
  const k = io((f - 10) / 40);
  const z = Math.pow(9, k);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${hole[0] * 100}% ${hole[1] * 100}%`, filter: `blur(${Math.sin(Math.PI * k) * 6}px)` }}>
        <Photo src={from} n={0} />
      </div>
      <AbsoluteFill style={{ opacity: interpolate(k, [0.7, 0.95], [0, 1], CLAMP), transform: `scale(${1.4 - 0.4 * ez((f - 38) / 20)})` }}>
        <Photo src={to} n={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 10 CHART GROW: bars grow from the baseline with counting values; the last one wins. */
export const ChartGrow: React.FC<{ f: number; values?: number[]; labels?: string[]; note?: string }> = ({ f, values = [24, 38, 31, 52, 86], labels = ["Mon", "Tue", "Wed", "Thu", "Fri"], note = "EXAMPLE NUMBERS" }) => {
  const max = Math.max(...values);
  return (
    <AbsoluteFill style={{ background: "#0C0F1D" }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 420, height: 900, display: "flex", alignItems: "flex-end", gap: 30, borderBottom: "4px solid rgba(255,255,255,0.3)" }}>
        {values.map((v, i) => {
          const k = ez((f - 6 - i * 7) / 22);
          const last = i === values.length - 1;
          return (
            <div key={i} style={{ flex: 1, position: "relative", height: (v / max) * 820 * k, borderRadius: "18px 18px 0 0", background: last ? `linear-gradient(180deg, ${PINK}, #FFAE6B)` : "rgba(255,255,255,0.25)" }}>
              <div style={{ position: "absolute", top: -70, left: 0, right: 0, textAlign: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 50, color: last ? PINK : WHITE }}>{Math.round(v * k)}</div>
              <div style={{ position: "absolute", bottom: -64, left: 0, right: 0, textAlign: "center", fontFamily: SIMPLE, fontWeight: 700, fontSize: 34, color: "rgba(255,255,255,0.7)" }}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 90, top: 1440, fontFamily: "monospace", fontSize: 24, color: "rgba(255,255,255,0.5)" }}>{note}</div>
    </AbsoluteFill>
  );
};

/* 11 PULL-BACK REVEAL: start tight on a detail, pull back to reveal the whole scene and its context. */
export const PullBack: React.FC<{ f: number; src?: string; detail?: [number, number]; caption?: string }> = ({ f, src, detail = [0.4, 0.68], caption = "The bigger picture" }) => {
  const k = io((f - 12) / 45);
  const z = 4 - 3 * k;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${detail[0] * 100}% ${detail[1] * 100}%` }}>
        <Photo src={src} n={3} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 80, color: WHITE, opacity: interpolate(k, [0.8, 1], [0, 1], CLAMP), textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{caption}</div>
    </AbsoluteFill>
  );
};

/* 12 GREEN SCREEN: the cut-out subject stays put while the world behind them swaps. */
export const GreenScreen: React.FC<{ f: number; subject?: string; bgs?: string[] }> = ({ f, subject, bgs }) => {
  const seg = 25;
  const i = Math.max(0, Math.min((bgs?.length || 3) - 1, Math.floor(f / seg)));
  const local = f - i * seg;
  return (
    <AbsoluteFill style={{ background: "#00B140" }}>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - ez(local / 8) * 100}%)` }}>
        <Photo src={bgs?.[i]} n={[0, 2, 1][i % 3]} style={{ filter: "blur(3px) brightness(0.85)" }} />
      </AbsoluteFill>
      <Subject src={subject} style={{ position: "absolute", left: 60, bottom: -40, width: 960, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }} />
    </AbsoluteFill>
  );
};

/* 13 PAPER CUT: layered paper shapes slide in with hard drop shadows and a paper grain. */
export const PaperCut: React.FC<{ f: number; title?: string }> = ({ f, title = "Paper cut" }) => {
  const layers = ["#F2C14E", "#F78154", "#E0475F", "#4D9078", "#2E4057"];
  return (
    <AbsoluteFill style={{ background: "#F4EBDD", overflow: "hidden" }}>
      {/* back layer (highest) first so nearer layers overlap it */}
      {[...layers].reverse().map((c, j) => {
        const i = layers.length - 1 - j;
        const k = sp(f, j * 5, 14, 140);
        const y = 1920 - (i + 1) * 260;
        return (
          <svg key={c} width={1080} height={1200} viewBox="0 0 1080 1200" style={{ position: "absolute", left: 0, top: y, transform: `translateY(${(1 - k) * 600}px)`, filter: "drop-shadow(0 -14px 0 rgba(0,0,0,0.18))" }}>
            <path d={`M0 ${120 + Math.sin(i) * 40} Q 270 ${20 + i * 15} 540 ${110 - i * 10} T 1080 ${90 + i * 12} V 1200 H 0 Z`} fill={c} />
          </svg>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 130, color: "#2E4057", transform: `scale(${sp(f, 24)}) rotate(-3deg)`, textShadow: "8px 8px 0 rgba(0,0,0,0.15)" }}>{title}</div>
      <AbsoluteFill style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>\")", mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

/* 14 DOODLE BOIL: hand-drawn lines that "boil" (turbulence seed changes every 4 frames) around a word. */
export const DoodleBoil: React.FC<{ f: number; word?: string }> = ({ f, word = "doodle boil" }) => {
  const seed = Math.floor(f / 4) % 7;
  const draw = ez(f / 25);
  return (
    <AbsoluteFill style={{ background: "#FFF8E8" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="boilfx">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale={9} />
          </filter>
        </defs>
        <g filter="url(#boilfx)" fill="none" stroke="#16151C" strokeWidth={10} strokeLinecap="round">
          <ellipse cx={540} cy={900} rx={420} ry={220} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <path d="M200 1250 q60 -40 120 0 t120 0 t120 0 t120 0 t120 0 t120 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} stroke={PINK} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${840 + i * 40} ${560 - i * 30} l40 -60`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - 20 - i * 3) / 8)} />
          ))}
        </g>
        <g filter="url(#boilfx)">
          <text x={540} y={930} textAnchor="middle" fontFamily={SIMPLE} fontWeight={800} fontSize={110} fill="#16151C">
            {word}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* 15 VERTIGO: the dolly zoom: the subject stays the same size while the background stretches away. */
export const Vertigo: React.FC<{ f: number; subject?: string; bg?: string }> = ({ f, subject, bg }) => {
  const k = io(f / 70);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 1.6})`, filter: `blur(${k * 2}px)` }}>
        <Photo src={bg} n={2} />
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, transparent 30%, rgba(0,0,0,${0.3 + 0.4 * k}))` }} />
      <Subject src={subject} style={{ position: "absolute", left: 60, bottom: -40, width: 960, transform: `scale(${1 + Math.sin(f / 6) * 0.004})`, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }} />
    </AbsoluteFill>
  );
};

/* 16 COVER STORY: the subject becomes a magazine cover: masthead, cover lines, issue tag. */
export const CoverStory: React.FC<{ f: number; subject?: string; masthead?: string; lines?: string[] }> = ({ f, subject, masthead = "MAKER", lines = ["The AI issue", "Build a team that never sleeps", "17 effects to steal"] }) => {
  const k = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ background: "#E9E2D6" }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 260, bottom: 260, background: "linear-gradient(180deg, #F7C9B6, #E58F7A)", overflow: "hidden", transform: `scale(${0.85 + 0.15 * k}) rotate(${(1 - k) * -4}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 210, letterSpacing: "-0.06em", color: "#B5123A", lineHeight: 1 }}>{masthead}</div>
        <Subject src={subject} style={{ position: "absolute", left: 20, bottom: -30, width: 860 }} />
        {lines.map((t, i) => (
          <div key={t} style={{ position: "absolute", left: 36, top: 420 + i * 170, width: 330, fontFamily: SIMPLE, fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: i === 0 ? WHITE : "#1B1B1B", background: i === 0 ? "#B5123A" : "transparent", padding: i === 0 ? "6px 12px" : 0, opacity: sp(f, 10 + i * 6), transform: `translateX(${(1 - sp(f, 10 + i * 6)) * -60}px)` }}>{t}</div>
        ))}
        <div style={{ position: "absolute", right: 30, top: 300, width: 150, height: 150, borderRadius: 75, background: "#FFD23F", display: "grid", placeItems: "center", textAlign: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 30, color: "#111", transform: `rotate(12deg) scale(${sp(f, 26)})` }}>
          ISSUE
          <br />
          #01
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 17 GLASS TYPE: frosted-glass letters floating over a moving photo, with a sheen sweep. */
export const GlassType: React.FC<{ f: number; text?: string; bg?: string }> = ({ f, text = "GLASS", bg }) => {
  const sheen = ((f / 50) % 1.4) - 0.2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -60, transform: `translate(${Math.sin(f / 25) * 30}px, ${Math.cos(f / 30) * 30}px) scale(1.1)` }}>
        <Photo src={bg} n={2} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 680, height: 460, borderRadius: 40, overflow: "hidden", transform: `translateY(${(1 - sp(f)) * 80}px)` }}>
        {/* frosted panel cut to the letters via mask */}
        <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(18px) saturate(1.6) brightness(1.25)", WebkitMaskImage: "linear-gradient(#000, #000)", background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.45)", borderRadius: 40 }} />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: SIMPLE, fontWeight: 800, fontSize: 230, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.92)", textShadow: "0 2px 0 rgba(255,255,255,0.6), 0 20px 50px rgba(0,0,0,0.35)" }}>{text}</div>
        <div style={{ position: "absolute", top: -100, bottom: -100, left: `${sheen * 100}%`, width: 140, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "rotate(20deg)" }} />
      </div>
    </AbsoluteFill>
  );
};

export const EFFECTS: { name: string; C: React.FC<{ f: number }> }[] = [
  { name: "orbit", C: Orbit },
  { name: "couch wall", C: CouchWall },
  { name: "ui world", C: UiWorld },
  { name: "frame break", C: FrameBreak },
  { name: "digital zoom", C: DigitalZoom },
  { name: "phone mockup", C: PhoneMockup },
  { name: "checklist", C: Checklist },
  { name: "headline wall", C: HeadlineWall },
  { name: "zoom-through cut", C: ZoomThrough },
  { name: "chart grow", C: ChartGrow },
  { name: "pull-back reveal", C: PullBack },
  { name: "green screen", C: GreenScreen },
  { name: "paper cut", C: PaperCut },
  { name: "doodle boil", C: DoodleBoil },
  { name: "vertigo", C: Vertigo },
  { name: "cover story", C: CoverStory },
  { name: "glass type", C: GlassType },
];
