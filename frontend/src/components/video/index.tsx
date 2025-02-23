"use client";

import { useWebRtc } from "@/hooks/useWebRtc";
import { useRef, useState } from "react";

const Video = () => {
  const [other, setOther] = useState<string>("");
  const meVideoRef = useRef<HTMLVideoElement>(null);
  const otherVideoRef = useRef<HTMLVideoElement>(null);

  const { call, camera } = useWebRtc({ meVideoRef, otherVideoRef });

  return (
    <div className="flex flex-col py-4 gap-4">
      <div className="flex items-center gap-4">
        <div>Start a video call</div>
        <input
          className="p-2 h-8 bg-red-50"
          placeholder="Enter username"
          onChange={(e) => setOther(e.target.value)}
        />
        <button
          className="bg-green-500 p-2 text-white"
          onClick={(e) => {
            e.preventDefault();
            call(other);
          }}
        >
          Connect
        </button>
      </div>
      <div className="grid grid-cols-12 w-full gap-8">
        <div className="flex flex-col col-span-6 gap-4">
          <video
            id="me"
            autoPlay
            playsInline
            className="w-full bg-gray-500 transform scaleX(-1)"
            ref={meVideoRef}
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
        <div className="flex flex-col col-span-6 gap-4">
          <video
            id="them"
            autoPlay
            playsInline
            className="w-full bg-gray-500"
            ref={otherVideoRef}
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      </div>
      <button
        className="bg-green-500 p-2 w-fit text-white self-center"
        onClick={camera}
      >
        Turn on webcam
      </button>
    </div>
  );
};

export default Video;
