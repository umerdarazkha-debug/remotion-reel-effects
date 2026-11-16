// Gallery: all 17 effects from effects.tsx back to back, 3 seconds each, with a numbered label (51 seconds in total).
// Pass the prop `only` (0 to 16) to show a single effect.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EFFECTS, SIMPLE } from "./effects";

export const EFFECT_LEN = 90;
export const GALLERY_FRAMES = EFFECTS.length * EFFECT_LEN;

export const EffectsGallery: React.FC<{ only?: number }> = ({ only }) => {
  const frame = useCurrentFrame();
  const i = only !== undefined ? only : Math.min(EFFECTS.length - 1, Math.floor(frame / EFFECT_LEN));
  const f = only !== undefined ? frame : frame - i * EFFECT_LEN;
  const { name, C } = EFFECTS[i];
  return (
    <AbsoluteFill>
      <C f={f} />
      <div style={{ position: "absolute", left: 50, top: 120, display: "flex", alignItems: "center", gap: 14, background: "rgba(0,0,0,0.65)", padding: "10px 22px", borderRadius: 14 }}>
        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 30, color: "#FF4F86" }}>{String(i + 1).padStart(2, "0")}</div>
        <div style={{ fontFamily: SIMPLE, fontWeight: 800, fontSize: 40, color: "#fff" }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};
