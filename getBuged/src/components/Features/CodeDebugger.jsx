import { useState } from "react";
import CopyButton from "./CopyButton.jsx";

export default function CodeDebugger() {
  const [inputCode, setInputCode] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debugCode = async () => {
    if (!inputCode.trim()) {
      setError("Paste some code first.");
      return;
    }
    setError("");
    setAnalysis("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/playground/debug-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `API Error ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[80px] border-t border-white/[0.06] pt-20 pb-20">
      <p
        className="text-[10px] tracking-[0.3em] text-white/50 mb-5"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        CODE DEBUGGER
      </p>
      <h2
        className="text-white font-normal mb-[60px]"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px,4vw,60px)" }}
      >
        Paste your code.
        <br />
        <span className="italic" style={{ color: "#fbbf24" }}>Get intelligent insights.</span>
      </h2>

      {/* EDITOR SPLIT */}
      <div className="grid grid-cols-2 gap-px p-3 bg-white/5">
        {/* INPUT */}
        <div className="bg-black">
          <div className="px-5 py-4 border-b-2 border-white/[0.06] flex justify-between items-center">
            <span
              className="text-[10px] tracking-[0.2em] text-white/50 font-semibold"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              YOUR CODE
            </span>
            {inputCode && (
              <button
                onClick={() => setInputCode("")}
                className="bg-transparent border-none text-white/40 text-[9px] tracking-widest cursor-pointer"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                CLEAR ✕
              </button>
            )}
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              setError("");
            }}
            placeholder={`// Paste your code here for analysis...\n// Any language works.\n\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}`}
            className="w-full min-h-[420px] bg-transparent border-none resize-none outline-none text-xs text-white/80 leading-[22px] p-5 tracking-wider"
            style={{ fontFamily: "'Space Mono', monospace", caretColor: "#fbbf24" }}
          />
        </div>

        {/* OUTPUT */}
        <div className="bg-black relative">
          <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
            <span
              className="text-[10px] tracking-[0.2em]"
              style={{ fontFamily: "'Space Mono', monospace", color: "#fbbf24" }}
            >
              ANALYSIS REPORT
            </span>
            {analysis && <CopyButton text={analysis} />}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-5">
              <div
                className="w-12 h-12 rounded-full border-2"
                style={{
                  borderColor: "#fbbf2433",
                  borderTopColor: "#fbbf24",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span
                className="text-[11px] tracking-[0.15em]"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "#fbbf24",
                  animation: "blink 1s step-end infinite",
                }}
              >
                ANALYZING CODE...
              </span>
            </div>
          ) : analysis ? (
            <div className="min-h-[420px] overflow-y-auto p-5">
              <div
                className="text-xs text-white/80 leading-[22px] whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {analysis}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
              <div className="text-4xl opacity-15">🔍</div>
              <p
                className="text-[11px] text-white/20 tracking-widest"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                ANALYSIS WILL APPEAR HERE
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="px-5 py-3.5 mt-6 text-[11px] tracking-wide"
          style={{
            fontFamily: "'Space Mono', monospace",
            border: "1px solid #fbbf2433",
            background: "rgba(251,191,36,0.05)",
            color: "#fbbf24",
            animation: "shake 0.4s ease",
          }}
        >
          {error}
        </div>
      )}

      {/* BUTTON */}
      <div className="flex justify-center items-center gap-4 flex-wrap mt-6">
        <button
          onClick={debugCode}
          disabled={loading}
          className="px-16 py-[18px] border-none text-sm tracking-widest font-bold transition-all duration-200"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: loading ? "rgba(255,255,255,0.1)" : "#fbbf24",
            color: "black",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "ANALYZING..." : "ANALYZE CODE →"}
        </button>
      </div>
    </div>
  );
}
