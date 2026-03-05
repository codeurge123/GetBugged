import React from "react";
import { useState } from "react";

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div style={{ position: "relative", marginTop: "20px" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "12px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          cursor: "pointer",
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <pre
        style={{
          background: "#0f0f0f",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto",
          color: "#e5e5e5",
          margin:"1rem 0px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}