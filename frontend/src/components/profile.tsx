"use client";

import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProfileData = {
  name: string;
  email: string;
  headline: string;
  linkedin: string;
  resume: File;
  avatar: number;
};

interface ProfileProps {
  edit?: boolean;
  initialData?: ProfileData;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function Profile({ edit, initialData, setShowModal }: ProfileProps) {
  const router = useRouter();

  const [name, setName] = React.useState(initialData?.name || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [headline, setHeadline] = React.useState(initialData?.headline || "");
  const [linkedin, setLinkedin] = React.useState(initialData?.linkedin || "");
  const [resume, setResume] = React.useState<File | undefined>(
    initialData?.resume || undefined
  );
  const [currentAvatar, setCurrentAvatar] = React.useState(
    initialData?.avatar || 1
  );
  const [isSaved, setIsSaved] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const handleNextAvatar = () => {
    setCurrentAvatar((prev) => (prev % 6) + 1);
  };

  const handlePreviousAvatar = () => {
    setCurrentAvatar((prev) => (prev === 1 ? 6 : prev - 1));
  };

  const handleClick = () => {
    if (edit && !isSaved) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
      setShowModal(false);
      // router.push("/career-fair");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#101828] opacity-40" />
    <div className="flex flex-col gap-6 mt-[45px] items-center relative">
      {edit ? (
        <div
          onClick={() => router.push("/career-fair")}
          className="absolute left-[3%] top-[5%] p-3 cursor-pointer text-white bg-black bg-opacity-60 rounded-xl"
        >
          Back
        </div>
      ) : null}
      <div className="font-bold text-3xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl bg-white bg-opacity-90 p-3">
        {edit ? "Edit Profile" : "Register"}
      </div>

      <div className="flex select-none items-center gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-1 select-none outline-none cursor-pointer bg-white rounded-[4px]"
          onClick={handlePreviousAvatar}
        >
          <mask
            id="mask0_7_1147"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect
              width="24"
              height="24"
              transform="matrix(-1 0 0 1 24 0)"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask0_7_1147)">
            <path
              d="M15.975 22L17.75 20.225L9.525 12L17.75 3.775L15.975 2L5.975 12L15.975 22Z"
              fill="#1C1B1F"
            />
          </g>
        </svg>
        <Image
          src={`/images/avatar${currentAvatar}.png`}
          alt={`Avatar ${currentAvatar}`}
          width={150}
          height={150}
          className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full select-none"
          draggable={false}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="p-1 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] select-none outline-none cursor-pointer bg-white rounded-[4px]"
          onClick={handleNextAvatar}
        >
          <mask
            id="mask0_7_1132"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_7_1132)">
            <path
              d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2L18.025 12L8.025 22Z"
              fill="#1C1B1F"
            />
          </g>
        </svg>
      </div>

      <div className="p-3 flex flex-col shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] gap-5 bg-white bg-opacity-90 rounded-xl">
        <div>
          <div className="text-xl mb-1">Name</div>
          <input
            className="w-[419px] p-2 rounded-lg bg-[#D9D9D9] bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#273CB2] transition-all"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="text-xl mb-1">Email</div>
          <input
            className="w-[419px] p-2 rounded-lg bg-[#D9D9D9] bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#273CB2] transition-all"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="text-xl mb-1">Headline</div>
          <input
            className="w-[419px] p-2 rounded-lg bg-[#D9D9D9] bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#273CB2] transition-all"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={220}
          />
          <div className="w-[419px] flex justify-end">
            <span
              className={`text-sm mt-1 ${
                headline.length === 220 ? "text-red-500" : "text-[#5E5C5C]"
              }`}
            >
              {headline.length}/220
            </span>
          </div>
        </div>
        <div className="mt-[-20px]">
          <div className="text-xl mb-1">LinkedIn Profile</div>
          <input
            className="w-[419px] p-2 rounded-lg bg-[#D9D9D9] bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#273CB2] transition-all"
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>
        <div>
          <div className="text-xl mb-1">Resume (.pdf)</div>
          {resume ? (
            <div className="inline-flex gap-4 items-center text-white bg-[#5E5C5C] p-[10px] rounded-lg">
              <div className="text-sm">{resume.name}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="cursor-pointer"
                onClick={() => {
                  setResume(undefined);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <mask
                  id="mask0_7_2343"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <rect width="20" height="20" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7_2343)">
                  <path
                    d="M5.33366 15.8332L4.16699 14.6665L8.83366 9.99984L4.16699 5.33317L5.33366 4.1665L10.0003 8.83317L14.667 4.1665L15.8337 5.33317L11.167 9.99984L15.8337 14.6665L14.667 15.8332L10.0003 11.1665L5.33366 15.8332Z"
                    fill="#D9D9D9"
                    fillOpacity="0.9"
                  />
                </g>
              </svg>
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              className="text-[#5E5C5C] text-sm cursor-pointer inline-block bg-[#D9D9D9] bg-opacity-90 p-[10px] rounded-lg"
            >
              Upload file
            </div>
          )}
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            type="file"
            accept=".pdf"
          />
        </div>
      </div>
      <div
        onClick={handleClick}
        className={`shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 rounded-xl justify-self-center col-start-2 
          transition-all duration-300 ${
            isSaved
              ? "bg-green-500 scale-[0.98] cursor-default"
              : "bg-[#273CB2] cursor-pointer"
          } text-white`}
      >
        {edit ? (isSaved ? "Saved ✓" : "Save Changes") : "Enter career fair"}
      </div>
    </div>
    </div>
  );
}
