"use client";

import { useWebRtc } from "@/hooks/useWebRtc";
import useAppStore from "@/store";
import { useEffect, useRef, useState } from "react";

interface VideoProps {
  setShowModal: (showModal: boolean) => void;
}

const Video = ({ setShowModal }: VideoProps) => {
  const { other } = useAppStore();

  const meVideoRef = useRef<HTMLVideoElement>(null);
  const otherVideoRef = useRef<HTMLVideoElement>(null);

  const { call, camera, close } = useWebRtc({ meVideoRef, otherVideoRef });

  useEffect(() => {
    // Open camera for both
    camera();

    // Call after some time to account for camera setting up
    setTimeout(() => {
      if (other) {
        call(other);
      }
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col py-4 gap-4">
      {/* <div className="flex items-center gap-4">
        <div>Start a video call</div>
        <input
          className="p-2 h-8 bg-red-50"
          placeholder="Enter socket id"
          onChange={(e) => setLocalOther(e.target.value)}
        />
        <button
          className="bg-green-500 p-2 text-white"
          onClick={(e) => {
            e.preventDefault();
            call(localOther);
          }}
        >
          Connect
        </button>
      </div> */}
      <div className="grid grid-cols-12 w-full gap-8">
        <div className="flex flex-col col-span-6 gap-4 h-[300px]">
          <video
            id="me"
            autoPlay
            playsInline
            className="w-full h-full bg-gray-500 object-cover rounded-md transform scaleX(-1)"
            ref={meVideoRef}
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
        <div className="flex flex-col col-span-6 gap-4 h-[300px]">
          <video
            id="them"
            autoPlay
            playsInline
            className="w-full h-full bg-gray-500 rounded-md object-cover"
            ref={otherVideoRef}
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      </div>
      <div
        onClick={() => {
          close();
          setShowModal(false);
        }}
        className="bg-black cursor-pointer rounded-xl p-3 text-white bg-opacity-60 mt-4"
      >
        Leave Conversation
      </div>
      {/* <button
        className="bg-green-500 p-2 w-fit text-white self-center"
        onClick={camera}
      >
        Turn on webcam
      </button> */}
    </div>
  );
};

export default Video;
