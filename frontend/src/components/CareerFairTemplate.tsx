"use state";

import React from "react";

export default function CareerFairTemplate() {
  const [showAnnouncements, setShowAnnouncements] = React.useState(false);
  const [showNotes, setShowNotes] = React.useState(false);

  return (
    <div>
      <div className="w-[330px] absolute top-[3%] left-[3%] z-10 shadow-[0_0_8px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white bg-opacity-90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <mask
                id="mask0_32_1975"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_32_1975)">
                <path
                  d="M18 13V11H22V13H18ZM19.2 20L16 17.6L17.2 16L20.4 18.4L19.2 20ZM17.2 8L16 6.4L19.2 4L20.4 5.6L17.2 8ZM5 19V15H4C3.45 15 2.97917 14.8042 2.5875 14.4125C2.19583 14.0208 2 13.55 2 13V11C2 10.45 2.19583 9.97917 2.5875 9.5875C2.97917 9.19583 3.45 9 4 9H8L13 6V18L8 15H7V19H5ZM11 14.45V9.55L8.55 11H4V13H8.55L11 14.45ZM14 15.35V8.65C14.45 9.05 14.8125 9.5375 15.0875 10.1125C15.3625 10.6875 15.5 11.3167 15.5 12C15.5 12.6833 15.3625 13.3125 15.0875 13.8875C14.8125 14.4625 14.45 14.95 14 15.35Z"
                  fill="#1C1B1F"
                />
              </g>
            </svg>
            <div className="font-bold select-none">Announcements</div>
          </div>
          {showAnnouncements ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="cursor-pointer"
              onClick={() => setShowAnnouncements(false)}
            >
              <mask id="mask0_7_2138" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" transform="matrix(1 0 0 -1 0 24)" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_7_2138)">
                <path d="M12 13.2L7.4 8.6L6 10L12 16L18 10L16.6 8.6L12 13.2Z" fill="#1C1B1F" />
              </g>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="cursor-pointer"
              onClick={() => setShowAnnouncements(true)}
            >
              <mask
                id="mask0_32_1979"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_32_1979)">
                <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="#1C1B1F" />
              </g>
            </svg>
          )}
        </div>
        {!showAnnouncements ? (
          <div className="select-none mt-[10px] text-sm">
            The career fair will be over in 10 minutes!
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 z-10 absolute top-[3%] right-[3%]">
        <div className="flex gap-4">
          <div className="font-bold select-none shadow-[0_0_8px_0_rgba(0,0,0,0.25)] gap-2 p-3 rounded-xl bg-white bg-opacity-90 z-50">
            Your position (Spotify): 4
          </div>
          <div className="shadow-[0_0_8px_0_rgba(0,0,0,0.25)] flex items-center justify-between w-[183px] p-3 rounded-xl bg-white bg-opacity-90 z-50">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <mask
                  id="mask0_32_1986"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_32_1986)">
                  <path
                    d="M8 18H16V16H8V18ZM8 14H16V12H8V14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 9V4H6V20H18V9H13Z"
                    fill="#1C1B1F"
                  />
                </g>
              </svg>
              <div className="font-bold select-none">My notes</div>
            </div>
            {showNotes ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="cursor-pointer"
                onClick={() => setShowNotes(false)}
              >
                <mask
                  id="mask0_32_1979"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_32_1979)">
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="#1C1B1F" />
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="cursor-pointer"
                onClick={() => setShowNotes(true)}
              >
                <mask
                  id="mask0_7_2138"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" transform="matrix(1 0 0 -1 0 24)" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7_2138)">
                  <path d="M12 13.2L7.4 8.6L6 10L12 16L18 10L16.6 8.6L12 13.2Z" fill="#1C1B1F" />
                </g>
              </svg>
            )}
          </div>
        </div>
        {showNotes ? (
          <div className="self-end flex flex-col gap-[10px] w-[253px] shadow-[0_0_8px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white bg-opacity-90">
            <div className="font-bold p-[10px] bg-[#79C0F6E5] rounded-xl h-[78px] bg-opacity-90">
              Anna (Spotify)
            </div>
            <div className="font-bold p-[10px] bg-[#6AEBAFE5] rounded-xl h-[78px] bg-opacity-90">
              Jamie (MathWorks)
            </div>
            <div className="font-bold p-[10px] bg-[#EFF682E5] rounded-xl h-[78px] bg-opacity-90">
              Emma (Epic)
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute bottom-[3%] z-10 left-[3%] flex shadow-[0_0_8px_0_rgba(0,0,0,0.25)] cursor-pointer items-center gap-[10px] bg-white p-3 rounded-xl justify-self-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="19"
          viewBox="0 0 22 19"
          fill="none"
        >
          <path
            d="M19 14L21 16L19 18"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 1L21 3L19 5"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3H17.5C13.9102 3 11 5.91015 11 9.5C11 13.0898 13.9102 16 17.5 16H21"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 16H4.5C8.08985 16 11 13.0898 11 9.5C11 5.91015 8.08985 3 4.5 3H1"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="select-none">Shuffle background</div>
      </div>
    </div>
  );
}
