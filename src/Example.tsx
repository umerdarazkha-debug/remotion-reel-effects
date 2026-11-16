// A 9-second example: three effects in a row, each with its own text or numbers.
// Copy this file to start your own video, then swap the effects and the content.
import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { At, ChartGrow, Checklist, GlassType } from "./effects";

export const EXAMPLE_FRAMES = 270;

export const Example: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Series>
      <Series.Sequence durationInFrames={90}>
        <At>{(f) => <Checklist f={f} items={["Pick one idea", "Write the hook", "Add three effects", "Render the reel"]} />}</At>
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <At>{(f) => <ChartGrow f={f} values={[12, 19, 27, 41, 64]} labels={["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"]} note="SIGN-UPS PER WEEK (EXAMPLE)" />}</At>
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        {/* to use your own picture: put photo.jpg in the public/ folder and add bg="photo.jpg" */}
        <At>{(f) => <GlassType f={f} text="DONE" />}</At>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
