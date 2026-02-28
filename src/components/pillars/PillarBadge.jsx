import React from "react";

export default function PillarBadge({ text, color }) {
  return (
    <span
      style={{
        backgroundColor: color || "#f0ebe0",
        padding: "0.2rem 0.5rem",
        borderRadius: "0.25rem",
        fontSize: "0.75rem",
        fontWeight: 700,
      }}
    >
      {text}
    </span>
  );
}