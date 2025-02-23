"use client";

import Booth from "@/components/Booth";
import { useRouter } from "next/navigation";

export default function MathWorks() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="mb-[30px] rounded-xl p-3 bg-white bg-opacity-90 text-[32px] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        MathWorks
      </div>
      <Booth
        color="#E43E04"
        company="mathworks"
        recruiter="Kristen White"
        linkedin="linkedin.com/kristenwhite"
        position="https://www.mathworks.com/company/jobs/opportunities"
      />
      <div className="flex gap-[10.5px] mt-[13px]">
        <div
          onClick={() => router.push("/career-fair")}
          className="bg-black cursor-pointer rounded-xl p-3 text-white bg-opacity-60"
        >
          Back to booths
        </div>
        <div className="bg-[#273CB2] cursor-pointer rounded-xl p-3 text-white">
          Chat 1:1 with Kristen
        </div>
      </div>
    </div>
  );
}
