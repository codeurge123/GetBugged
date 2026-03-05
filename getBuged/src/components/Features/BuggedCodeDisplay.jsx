import React from "react";


export default function BuggedCodeDisplay({ code, level }) {
  const lines = code.split("\n");
  return (
    <div className="relative">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: level.id === 3
            ? "linear-gradient(90deg, #f87171, #f87171aa)"
            : level.id === 2
              ? "linear-gradient(90deg, #facc15, #facc15aa)"
              : "linear-gradient(90deg, #4ade80, #4ade8044)",
        }}
      />
      <div className="overflow-x-auto overflow-y-auto max-h-[480px] pt-8 pb-4">
        {lines.map((line, i) => (
          <div key={i} className="flex min-w-max">
            <span
              className="text-xs text-white/15 px-4 min-w-[48px] text-right select-none leading-[22px]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {i + 1}
            </span>
            <span
              className="text-xs text-white/85 leading-[22px] pr-6 whitespace-pre"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {line || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};