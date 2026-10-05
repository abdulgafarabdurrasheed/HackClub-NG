"use client";

import { useState } from "react";
import { joinClubAction } from "../../directory/actions";

export function JoinClubButton({ clubId }: { clubId: string }) {
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    const res = await joinClubAction(clubId);
    setJoining(false);
    
    if (res.success) {
      alert("Successfully applied to join! The club leader will review your request.");
    } else {
      alert(res.error || "Failed to join club. Make sure you are signed in.");
    }
  };

  return (
    <button 
      onClick={handleJoin}
      disabled={joining}
      className="bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 shadow-md"
    >
      {joining ? "Requesting..." : "Join Club"}
    </button>
  );
}
