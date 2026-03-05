import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const removeComments = (code) => {
    if (!code) return "";

    return code
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove single-line comments
      .replace(/\/\/.*$/gm, "")
      // Remove empty lines caused by comment removal
      .replace(/^\s*[\r\n]/gm, "");
  };

  const handleCopy = () => {
    const cleanedCode = removeComments(text);
    navigator.clipboard.writeText(cleanedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="border border-white/15 px-4 py-2 text-[10px] tracking-widest cursor-pointer transition-all duration-200"
      style={{
        fontFamily: "'Space Mono', monospace",
        background: copied ? "white" : "transparent",
        color: copied ? "black" : "rgba(255,255,255,0.5)",
      }}
    >
      {copied ? "✓ COPIED " : "COPY CODE"}
    </button>
  );
}