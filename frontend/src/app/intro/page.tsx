"use client";

import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { ServerState, User } from "../types/index";
import useAppStore from "@/store";
import Video from "@/components/video";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const socket = io("http://localhost:8000");

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[25px]">
      <Image
        src="/images/jumbo.png"
        alt="jumbo"
        className="h-[188px] w-[188px] rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
        height={188}
        width={188}
      />
      <div className="text-[32px] text-center max-w-[638px] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white bg-opacity-90">
        Welcome to the Tufts University Virtual Career Fair!
      </div>
      <div className="flex gap-5">
        <div
          onClick={() => router.push("/create-profile")}
          className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#273CB2] cursor-pointer rounded-xl p-3 text-white"
        >
          Register to attend
        </div>
        {/* <div
          onClick={() => router.push("/welcome-back")}
          className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#273CB2] cursor-pointer rounded-xl p-3 text-white"
        >
          Continue to Career Fair
        </div> */}
      </div>
    </div>
  );
}
