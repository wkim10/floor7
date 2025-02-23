"use client";

import React from "react";
import CareerFairTemplate from "@/components/CareerFairTemplate";
import RoomMap from "@/components/RoomMap";

export default function CareerFair() {
  const [joinModal, setJoinModal] = React.useState(false);
  const [queueModal, setQueueModal] = React.useState(false);
  const [leaveModal, setLeaveModal] = React.useState(false);

  return (
    <div>
      <CareerFairTemplate />
      <RoomMap />
      {joinModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#101828] opacity-40" />
          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl shadow-lg z-10 max-w-[402px]">
            <div className="flex justify-between items-center relative">
              <div className="text-[20px] font-bold">1:1 with recruiter</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="absolute cursor-pointer right-0 top-2"
                onClick={() => setJoinModal(false)}
              >
                <path
                  d="M1.16667 11.8332L0 10.6665L4.66667 5.99984L0 1.33317L1.16667 0.166504L5.83333 4.83317L10.5 0.166504L11.6667 1.33317L7 5.99984L11.6667 10.6665L10.5 11.8332L5.83333 7.1665L1.16667 11.8332Z"
                  fill="#5E5C5C"
                />
              </svg>
            </div>
            <div className="text-[#5E5C5C] text-sm">
              After you click join, you will have{" "}
              <span className="text-black font-bold">7 minutes</span> to chat
              with the recruiter.
            </div>
            <div className="text-[#5E5C5C] text-sm">
              Here are some recommendations:
            </div>
            <ul className="text-[#5E5C5C] list-disc pl-4 text-sm">
              <li>Ask any questions you have about any job openings</li>
              <li>
                Don&apos;t forget to send a thank you note to your recruiter
                after your chat!
              </li>
            </ul>
            <div className="bg-[#273CB2] mt-2 cursor-pointer rounded-xl p-3 text-white self-center">
              Join now
            </div>
          </div>
        </div>
      ) : null}
      {queueModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#101828] opacity-40" />
          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl shadow-lg z-10 max-w-[402px]">
            <div className="flex justify-between items-center relative">
              <div className="text-[20px] font-bold">
                Join queue for 1:1 with recruiter
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="absolute right-0 top-2 cursor-pointer"
                onClick={() => setQueueModal(false)}
              >
                <path
                  d="M1.16667 11.8332L0 10.6665L4.66667 5.99984L0 1.33317L1.16667 0.166504L5.83333 4.83317L10.5 0.166504L11.6667 1.33317L7 5.99984L11.6667 10.6665L10.5 11.8332L5.83333 7.1665L1.16667 11.8332Z"
                  fill="#5E5C5C"
                />
              </svg>
            </div>
            <div className="text-[#5E5C5C] text-sm">
              There are currently{" "}
              <span className="text-black font-bold">
                4 people on the queue
              </span>{" "}
              with an approximate{" "}
              <span className="text-black font-bold">
                28-32 minutes wait time.
              </span>
            </div>
            <div className="text-[#5E5C5C] text-sm">
              White you wait for your turn, feel free to explore other booths.
            </div>
            <div className="bg-[#FF6F00] mt-2 cursor-pointer rounded-xl p-3 text-white self-center">
              Join queue
            </div>
          </div>
        </div>
      ) : null}
      {leaveModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#101828] opacity-40" />
          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl shadow-lg z-10 max-w-[402px]">
            <div className="text-[20px] font-bold">Leave queue</div>
            <div className="text-[#5E5C5C] text-sm">
              If you leave the queue, you will lose your place in line and have
              to join the queue again.
            </div>
            <div className="flex justify-center gap-6">
              <div
                onClick={() => setLeaveModal(false)}
                className="bg-[#F5F5F5] mt-2 cursor-pointer rounded-xl p-3  self-center"
              >
                Cancel
              </div>
              <div className="bg-[#EB4C4C] mt-2 cursor-pointer rounded-xl p-3 text-white self-center">
                Leave
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
