import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import GridBackground from "../../components/Effects/GridBackground.jsx";
import GlitchOverlay from "../../components/Effects/GlitchOverlay.jsx";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import LEVELS from "../../components/data/Level.js";
import CopyButton from "../../components/Features/CopyButton.jsx";
import BuggedCodeDisplay from "../../components/Features/BuggedCodeDisplay.jsx";
import LevelCard from "../../components/LevelCard.jsx";

export default function GetBuged() {
    const navigate = useNavigate();
    const { accessToken, apiBase } = useAuth();

    const [mode, setMode] = useState("bug"); // "bug" or "debug"
    const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
    const [inputCode, setInputCode] = useState("");
    const [outputCode, setOutputCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const outputRef = useRef(null);
    const [typedText, setTypedText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    const typingTexts = [
        "Injecting subtle bugs...",
        "Planting hidden traps...",
        "Corrupting your logic...",
        "Destroying your algorithm...",
        "Strengthening your debugging muscles...",
    ];

    useEffect(() => {
        const currentText = typingTexts[textIndex];
        if (charIndex < currentText.length) {
            const timeout = setTimeout(() => {
                setTypedText((prev) => prev + currentText[charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setTypedText("");
                setCharIndex(0);
                setTextIndex((prev) => (prev + 1) % typingTexts.length);
            }, 1400);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, textIndex]);

    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    const bugCode = async () => {
        if (!inputCode?.trim()) {
            setError("Paste some code first.");
            return;
        }
        setError("");
        setOutputCode("");
        setLoading(true);

        if (selectedLevel.id === 3) {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 1200);
        }

        try {
            const response = await fetch(
                `${apiBase}/playground/generate-bug`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: accessToken ? `Bearer ${accessToken}` : "",
                    },
                    body: JSON.stringify({
                        code: inputCode,
                        levelId: selectedLevel.id,
                    }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `API Error ${response.status}`);
            }

            const data = await response.json();
            const result = data.buggedCode || "";

            setOutputCode(result);
            setTimeout(
                () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                100
            );
        } catch (e) {
            setError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const debugCode = async () => {
        if (!inputCode?.trim()) {
            setError("Paste some code first.");
            return;
        }
        setError("");
        setOutputCode("");
        setLoading(true);

        try {
            const response = await fetch(`${apiBase}/playground/debug-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: inputCode }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `API Error ${response.status}`);
            }

            const data = await response.json();
            setOutputCode(data.analysis);
            setTimeout(
                () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                100
            );
        } catch (e) {
            setError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Save to sessionStorage and navigate to playground
    const openInPlayground = () => {
        // Store raw string values explicitly
        const buggedRaw = String(outputCode).trim();
        const originalRaw = String(inputCode).trim();

        sessionStorage.setItem("playground_bugged_code", buggedRaw);
        sessionStorage.setItem("playground_original_code", originalRaw);
        sessionStorage.setItem("playground_level", JSON.stringify({
            id: selectedLevel.id,
            label: selectedLevel.label,
            color: selectedLevel.color,
            name: selectedLevel.name,
        }));

        // Small delay to guarantee sessionStorage write before navigation
        requestAnimationFrame(() => {
            navigate("/playground");
        });
    };

    return (
        <div className="min-h-screen bg-black text-white relative">
            <GridBackground />
            <GlitchOverlay active={glitchActive} />

            <div className="relative z-[1]">
                <Navbar />

                {/* HERO */}
                <section
                    className="px-10 pt-[100px] pb-20 text-center border-b border-white/[0.06] relative overflow-hidden transition-all duration-700"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(24px)",
                        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none leading-none whitespace-nowrap italic"
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "clamp(80px, 18vw, 240px)",
                            color: "rgba(248,113,113,0.03)",
                            letterSpacing: "-0.04em",
                        }}
                    >
                        getBuged
                    </div>

                    <p className="text-[10px] tracking-[0.3em] text-white/50 mb-6 relative"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        DEBUGGING TRAINING TOOL
                    </p>
                    <h1
                        className="text-white font-normal mb-6 relative"
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "clamp(48px, 8vw, 110px)",
                            lineHeight: 0.95,
                        }}
                    >
                        Paste Code.
                        <br />
                        <span className="italic" style={{ color: "#f87171" }}>Get Wrecked.</span>
                    </h1>
                    <p
                        className="text-white/50 text-[13px] tracking-wider max-w-[500px] mx-auto leading-[1.7] relative"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Introduce real, sneaky bugs into your code using Gemini AI — then
                        practice finding them. Three levels of pain.
                    </p>

                    <div
                        className="inline-block mt-8 text-[14px] tracking-[0.15em] font-mono"
                        style={{ color: "#f87171" }}
                    >
                        {typedText}
                        <span className="animate-pulse ml-1">|</span>
                    </div>
                </section>

                {/* MAIN APP */}
                <div className="max-w-[1300px] mx-auto px-10 py-[60px]">
                    {/* MODE TOGGLE */}
                    <div className="mb-12 flex gap-4 items-center">
                        <button
                            onClick={() => { setMode("bug"); setOutputCode(""); setError(""); }}
                            className="px-8 py-4 border-2 text-sm tracking-widest font-bold transition-all duration-200"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                borderColor: mode === "bug" ? "#f87171" : "rgba(255,255,255,0.2)",
                                background: mode === "bug" ? "rgba(248,113,113,0.15)" : "transparent",
                                color: mode === "bug" ? "#f87171" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (mode !== "bug") e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                if (mode !== "bug") e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            }}
                        >
                            GET BUGGED
                        </button>
                        <button
                            onClick={() => { setMode("debug"); setOutputCode(""); setError(""); }}
                            className="px-8 py-4 border-2 text-sm tracking-widest font-bold transition-all duration-200"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                borderColor: mode === "debug" ? "#fbbf24" : "rgba(255,255,255,0.2)",
                                background: mode === "debug" ? "rgba(251,191,36,0.15)" : "transparent",
                                color: mode === "debug" ? "#fbbf24" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (mode !== "debug") e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                if (mode !== "debug") e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            }}
                        >
                            GET DEBUGGED
                        </button>
                    </div>

                    {/* LEVEL SELECTOR - Only show in BUG mode */}
                    {mode === "bug" && (
                        <div className="mb-12">
                            <p className="text-[10px] tracking-[0.25em] text-white/50 mb-5"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                SELECT DIFFICULTY
                            </p>
                            <div className="grid grid-cols-3 gap-px bg-white/5">
                                {LEVELS.map((l) => (
                                    <div key={l.id} className="bg-black">
                                        <LevelCard
                                            level={l}
                                            selected={selectedLevel.id === l.id}
                                            onClick={() => setSelectedLevel(l)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EDITOR SPLIT */}
                    <div className="grid grid-cols-2 gap-px p-3 bg-white/5 mb-6">
                        {/* INPUT */}
                        <div className="bg-black">
                            <div className="px-5 py-4 border-b-2 border-white/[0.06] flex justify-between items-center">
                                <span
                                    className="text-[10px] tracking-[0.2em] text-white/50 font-semibold"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    INPUT CODE
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
                                onChange={(e) => { setInputCode(e.target.value); setError(""); }}
                                placeholder={`// Paste your code here...\n// Any language works.\n\nfunction example(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`}
                                className="w-full min-h-[420px] bg-transparent border-none resize-none outline-none text-xs text-white/80 leading-[22px] p-5 tracking-wider"
                                style={{ fontFamily: "'Space Mono', monospace", caretColor: "#f87171" }}
                            />
                        </div>

                        {/* OUTPUT */}
                        <div ref={outputRef} className="bg-black relative">
                            <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
                                <span
                                    className="text-[10px] tracking-[0.2em]"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: mode === "bug" ? selectedLevel.color : "#fbbf24"
                                    }}
                                >
                                    {mode === "bug" ? `BUGGED OUTPUT — ${selectedLevel.label}` : "ANALYSIS REPORT"}
                                </span>
                                {outputCode && <CopyButton text={outputCode} />}
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center min-h-[420px] gap-5">
                                    <div
                                        className="w-12 h-12 rounded-full border-2"
                                        style={{
                                            borderColor: mode === "bug" ? `${selectedLevel.color}33` : "#fbbf2433",
                                            borderTopColor: mode === "bug" ? selectedLevel.color : "#fbbf24",
                                            animation: "spin 0.8s linear infinite",
                                        }}
                                    />
                                    <span
                                        className="text-[11px] tracking-[0.15em]"
                                        style={{
                                            fontFamily: "'Space Mono', monospace",
                                            color: mode === "bug" ? selectedLevel.color : "#fbbf24",
                                            animation: "blink 1s step-end infinite",
                                        }}
                                    >
                                        {mode === "bug" ? (
                                            selectedLevel.id === 3 ? "DESTROYING YOUR CODE..."
                                                : selectedLevel.id === 2 ? "PLANTING TRAPS..."
                                                    : "ADDING BUGS..."
                                        ) : "ANALYZING CODE..."}
                                    </span>
                                </div>
                            ) : outputCode ? (
                                mode === "bug" ? (
                                    <BuggedCodeDisplay code={outputCode} level={selectedLevel} />
                                ) : (
                                    <div className="min-h-[420px] overflow-y-auto p-5">
                                        {typeof outputCode === 'object' ? (
                                            <div className="space-y-6" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                {/* Summary */}
                                                <div className="border border-white/10 p-4">
                                                    <p className="text-[9px] tracking-widest text-white/40 mb-2">ANALYSIS SUMMARY</p>
                                                    <p className="text-[11px] text-white/80">{outputCode.summary || 'Code analysis complete'}</p>
                                                    {outputCode.bugFound === false && (
                                                        <p className="text-[11px] text-green-400 mt-2">✓ No bugs found in your code!</p>
                                                    )}
                                                </div>

                                                {/* Bugs Found */}
                                                {outputCode.bugFound && outputCode.bugs && outputCode.bugs.length > 0 && (
                                                    <div className="border border-red-400/20 p-4 bg-red-400/5">
                                                        <p className="text-[9px] tracking-widest text-red-300 mb-3">🐛 BUGS FOUND ({outputCode.bugs.length})</p>
                                                        <div className="space-y-3">
                                                            {outputCode.bugs.map((bug, idx) => (
                                                                <div key={idx} className="border-l-2 border-red-400/50 pl-3">
                                                                    <p className="text-[10px] text-red-300 font-bold">{bug.issue}</p>
                                                                    <p className="text-[9px] text-white/50 mt-1">Location: {bug.line}</p>
                                                                    <p className="text-[9px] text-white/50 mt-1">Severity: <span className={`font-bold ${bug.severity === 'critical' ? 'text-red-400' : bug.severity === 'major' ? 'text-yellow-400' : 'text-blue-400'}`}>{bug.severity}</span></p>
                                                                    <p className="text-[9px] text-white/60 mt-2">{bug.explanation}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Corrected Code */}
                                                {outputCode.correctedCode && (
                                                    <div className="border border-green-400/20 p-4 bg-green-400/5">
                                                        <p className="text-[9px] tracking-widest text-green-300 mb-3">✓ CORRECTED CODE</p>
                                                        <div className="bg-black/50 p-3 rounded overflow-x-auto">
                                                            <pre className="text-[9px] text-white/70 leading-[18px] whitespace-pre-wrap break-words">
                                                                {outputCode.correctedCode}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Best Practices */}
                                                {outputCode.bestPractices && outputCode.bestPractices.length > 0 && (
                                                    <div className="border border-blue-400/20 p-4 bg-blue-400/5">
                                                        <p className="text-[9px] tracking-widest text-blue-300 mb-3">💡 BEST PRACTICES</p>
                                                        <ul className="space-y-2">
                                                            {outputCode.bestPractices.map((practice, idx) => (
                                                                <li key={idx} className="text-[9px] text-white/70 flex gap-2">
                                                                    <span className="text-blue-400 flex-shrink-0">→</span>
                                                                    <span>{practice}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-white/80 leading-[22px] whitespace-pre-wrap break-words" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                {outputCode}
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
                                    <div className="text-4xl opacity-15">{mode === "bug" ? "🐛" : "🔍"}</div>
                                    <p
                                        className="text-[11px] text-white/20 tracking-widest"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        {mode === "bug" ? "BUGGED CODE WILL APPEAR HERE" : "ANALYSIS WILL APPEAR HERE"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            className="px-5 py-3.5 mb-6 text-[11px] tracking-wide"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                border: mode === "bug" ? "1px solid #f8717133" : "1px solid #fbbf2433",
                                background: mode === "bug" ? "rgba(248,113,113,0.05)" : "rgba(251,191,36,0.05)",
                                color: mode === "bug" ? "#f87171" : "#fbbf24",
                                animation: "shake 0.4s ease",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* BUTTONS ROW */}
                    <div className="flex justify-center items-center gap-4 flex-wrap">
                        {/* ACTION BUTTON */}
                        <button
                            onClick={mode === "bug" ? bugCode : debugCode}
                            disabled={loading}
                            className="px-16 py-[18px] border-none text-sm tracking-widest font-bold transition-all duration-200 flex items-center gap-3.5"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                background: loading ? "rgba(255,255,255,0.1)"
                                    : mode === "bug"
                                        ? selectedLevel.id === 3 ? "#f87171"
                                            : selectedLevel.id === 2 ? "#facc15"
                                                : "white"
                                        : "#fbbf24",
                                color: "black",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                                        style={{ animation: "spin 0.8s linear infinite" }}
                                    />
                                    {mode === "bug" ? "INJECTING BUGS..." : "ANALYZING..."}
                                </>
                            ) : (
                                <>
                                    {mode === "bug" ? (
                                        <>
                                            {selectedLevel.id === 3 ? "DESTROY MY CODE"
                                                : selectedLevel.id === 2 ? "PLANT THE TRAPS"
                                                    : "BUG MY CODE"} →
                                        </>
                                    ) : (
                                        <>ANALYZE CODE →</>
                                    )}
                                </>
                            )}
                        </button>

                        {/* ── PLAYGROUND BUTTON — appears only after code is bugged in BUG MODE ── */}
                        {outputCode && !loading && mode === "bug" && (
                            <button
                                onClick={openInPlayground}
                                className="px-10 py-[18px] text-sm tracking-widest font-bold transition-all duration-300 flex items-center gap-3 border"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    borderColor: selectedLevel.color,
                                    color: selectedLevel.color,
                                    background: `${selectedLevel.color}10`,
                                    animation: "fadeSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${selectedLevel.color}22`;
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = `${selectedLevel.color}10`;
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <span>🐛</span>
                                DEBUG IN PLAYGROUND →
                            </button>
                        )}
                    </div>

                    {/* Inline hint text when output is ready */}
                    {outputCode && !loading && mode === "bug" && (
                        <p
                            className="text-center text-[10px] text-white/25 mt-4 tracking-widest"
                            style={{ fontFamily: "'Space Mono', monospace", animation: "fadeSlideIn 0.5s 0.1s both" }}
                        >
                            CLICK TO ENTER PLAYGROUND AND DEBUG THE CODE
                        </p>
                    )}

                    {/* HOW IT WORKS */}
                    <div className="mt-[100px] border-t border-white/[0.06] pt-20">
                        <p className="text-[10px] tracking-[0.3em] text-white/50 mb-5"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            HOW IT WORKS
                        </p>
                        <h2
                            className="text-white font-normal mb-[60px]"
                            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px,4vw,60px)" }}
                        >
                            Your code.
                            <br />
                            <span className="italic" style={{ color: "#f87171" }}>Professionally sabotaged.</span>
                        </h2>
                        <div className="grid grid-cols-4 gap-0 border border-white/[0.14]">
                            {[
                                { n: "01", t: "Paste Code", d: "Drop any code into the input panel. Any language, any size." },
                                { n: "02", t: "Choose Level", d: "Pick how much pain you want. Level 1 teaches. Level 3 traumatizes." },
                                { n: "03", t: "Gemini API Magic", d: "Our Gemini API key calls the model which crafts realistic, natural-looking bugs." },
                                { n: "04", t: "Debug It", d: "Copy the bugged code, fire up your IDE, and find every single one." },
                            ].map((s, i) => (
                                <div key={i} className="p-8"
                                    style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                                    <div className="text-5xl text-white/[0.15] mb-3 font-normal"
                                        style={{ fontFamily: "'DM Serif Display', serif" }}>{s.n}</div>
                                    <div className="text-white text-xl mb-2.5 font-normal"
                                        style={{ fontFamily: "'DM Serif Display', serif" }}>{s.t}</div>
                                    <p className="text-white/35 text-[10px] leading-[1.8]"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>{s.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LEVEL LEGEND */}
                    <div className="mt-20 grid grid-cols-3 gap-px bg-white/5">
                        {LEVELS.map((l) => (
                            <div key={l.id} className="bg-black p-7 flex gap-4 items-start">
                                <div className="w-[3px] self-stretch flex-shrink-0" style={{ background: l.color }} />
                                <div>
                                    <div className="text-[9px] tracking-[0.2em] mb-2"
                                        style={{ fontFamily: "'Space Mono', monospace", color: l.color }}>
                                        {l.label}
                                    </div>
                                    <div className="text-white text-[22px] mb-2 font-normal"
                                        style={{ fontFamily: "'DM Serif Display', serif" }}>{l.name}</div>
                                    <p className="text-white/35 text-[10px] leading-[1.7]"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>{l.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>

            {/* animation keyframes */}
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}