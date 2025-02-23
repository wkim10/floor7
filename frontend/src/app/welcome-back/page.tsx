"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function WelcomeBack() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[25px]">
      <div className="text-[32px] text-center max-w-[638px] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white bg-opacity-90">
        Welcome back!
      </div>
      <div className="text-[20px] max-w-[638px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white bg-opacity-90">
        <div>Enter your email</div>
        <input
          className="w-[419px] text-[16px] p-2 rounded-lg bg-[#D9D9D9] bg-opacity-90 mt-1 focus:outline-none focus:ring-2 focus:ring-[#273CB2] transition-all"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div
        onClick={() => router.push("/career-fair")}
        className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#273CB2] cursor-pointer rounded-xl p-3 text-white"
      >
        Enter career fair
      </div>
    </div>
  );
}
