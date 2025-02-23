"use client";

import React from "react";
import Profile from "@/components/profile";

export default function CreateProfile() {
  const createMockFile = () => {
    return new File([""], "won_kim_resume.pdf", {
      type: "application/pdf",
    });
  };

  const initialData = {
    name: "Won Kim",
    email: "wonkim025@gmail.com",
    headline: "I'm from the top floor of JCC!",
    linkedin: "wonkim@linkedin",
    resume: createMockFile(),
    avatar: 5,
  };

  return (
    <div>
      <Profile edit={true} initialData={initialData} />
    </div>
  );
}
