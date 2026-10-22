"use client";

import { useState } from "react";

const statuses = [
  ["to_research", "To research"],
  ["ready_to_visit", "Ready to visit"],
  ["contacted", "Contacted"],
  ["visited", "Visited"],
  ["onboarded", "Onboarded"],
  ["blocked", "Blocked"],
  ["not_now", "Not now"],
] as const;

export function OutreachPlanFields({
  initialStatus,
  initialBarrier,
}: {
  initialStatus: string;
  initialBarrier: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [barrier, setBarrier] = useState(initialBarrier);

  return (
    <>
      <div className="field field-full">
        <label htmlFor="status">Pipeline status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statuses.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {status !== "onboarded" && (
        <div className="field field-full">
          <label htmlFor="barrier">What is getting in the way?</label>
          <textarea
            id="barrier"
            name="barrier"
            maxLength={1200}
            value={barrier}
            onChange={(event) => setBarrier(event.target.value)}
            placeholder="e.g. waiting for a teacher sponsor; lab access not confirmed"
          />
        </div>
      )}
      {status === "onboarded" && (
        <p className="field-full inline-muted">
          This school is onboarded. Record ongoing check-ins in the follow-up log.
        </p>
      )}
    </>
  );
}
