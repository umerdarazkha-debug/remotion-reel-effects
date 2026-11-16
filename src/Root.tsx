import React from "react";
import { Composition, Folder } from "remotion";
import { EFFECTS } from "./effects";
import { EXAMPLE_FRAMES, Example } from "./Example";
import { EFFECT_LEN, EffectsGallery, GALLERY_FRAMES } from "./Gallery";

// Each <Composition> shows up in the Remotion Studio sidebar.
export const RemotionRoot: React.FC = () => (
  <>
    {/* all 17 effects back to back: npm run render */}
    <Composition id="EffectsGallery" component={EffectsGallery} durationInFrames={GALLERY_FRAMES} fps={30} width={1080} height={1920} defaultProps={{}} />
    {/* three effects with your own text and numbers: copy this one to start your own video */}
    <Composition id="Example" component={Example} durationInFrames={EXAMPLE_FRAMES} fps={30} width={1080} height={1920} />
    <Folder name="Single-effects">
      {EFFECTS.map((e, i) => (
        <Composition key={e.name} id={`${String(i + 1).padStart(2, "0")}-${e.name.replace(/[^a-z0-9]+/g, "-")}`} component={EffectsGallery} durationInFrames={EFFECT_LEN} fps={30} width={1080} height={1920} defaultProps={{ only: i }} />
      ))}
    </Folder>
  </>
);
