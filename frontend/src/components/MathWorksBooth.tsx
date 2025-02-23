"use client";

import Booth from "@/components/Booth";

interface props {
  setShowModal: (showModal: boolean) => void;
  setConversationModal: (showConversation: boolean) => void;
}

export default function MathWorks({
  setShowModal,
  setConversationModal,
}: props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-[#101828] opacity-40" />
      <div className="flex flex-col items-center relative max-h-screen">
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
            onClick={() => setShowModal(false)}
            className="bg-black cursor-pointer rounded-xl p-3 text-white bg-opacity-60"
          >
            Back
          </div>
          <div
            onClick={() => {
              setShowModal(false);
              setConversationModal(true);
            }}
            className="bg-[#273CB2] cursor-pointer rounded-xl p-3 text-white"
          >
            Chat 1:1 with Kristen
          </div>
        </div>
      </div>
    </div>
  );
}
