"use client";

import React from "react";
import Profile from "@/components/profile";
import CareerFair from "../career-fair/page";

export default function CreateProfile() {
  const [showModal, setShowModal] = React.useState(true);

  return (
    <div>
      {showModal ? <Profile setShowModal={setShowModal} /> : null}
      <CareerFair />
    </div>
  );
}
