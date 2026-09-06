"use client";

import { useEffect, useState } from "react";

export type AvatarGesture =
  | "idle"
  | "wave"
  | "talk"
  | "talk-energetic"
  | "present"
  | "think"
  | "point"
  | "sleepy";

const frames: Record<AvatarGesture, string> = {
  idle: "/idle.png",
  wave: "/wave.png",
  talk: "/talk.png",
  "talk-energetic": "/talk-energetic.png",
  present: "/present.png",
  think: "/think.png",
  point: "/point.png",
  sleepy: "/sleepy.png",
};

type CareerTwinAvatarProps = {
  gesture?: AvatarGesture;
  isThinking?: boolean;
  isSpeaking?: boolean;
};

export default function CareerTwinAvatar({
  gesture = "idle",
  isThinking = false,
  isSpeaking = false,
}: CareerTwinAvatarProps) {
  const [frame, setFrame] = useState<AvatarGesture>("idle");

  useEffect(() => {
    if (isThinking) {
      setFrame("think");
    } else {
      setFrame(gesture);
    }
  }, [gesture, isSpeaking, isThinking]);

  return (
    <div className="career-twin-avatar" aria-label="Saksham's animated digital twin">
      {Object.entries(frames).map(([name, src]) => (
        <img
          key={name}
          src={src}
          alt=""
          aria-hidden="true"
          className={`career-twin-frame ${name === frame ? "active" : ""}`}
        />
      ))}
    </div>
  );
}
