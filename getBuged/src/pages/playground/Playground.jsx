import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import GridBackground from "../../components/Effects/GridBackground.jsx";
import GlitchOverlay from "../../components/Effects/GlitchOverlay.jsx";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import LEVELS from "../../components/data/Level.js";
import CopyButton from "../../components/Features/CopyButton.jsx";
import LevelCard from "../../components/LevelCard.jsx";
import ScorecardModal from "../../components/PlaygroundComponents/ScorecardModal.jsx";
import TestModal from "../../components/PlaygroundComponents/TestModal.jsx";


function computeScore(original, debugged) {
    const origLines = original.trim().split("\n");
    const debugLines = debugged.trim().split("\n");
    let matches = 0;
    origLines.forEach((line, i) => {
        if (debugLines[i] && debugLines[i].trim() === line.trim()) matches++;
    });
    return Math.round((matches / origLines.length) * 100);
}

function countDiffs(original, other) {
    const a = original.trim().split("\n");
    const b = other.trim().split("\n");
    let diff = 0;
    a.forEach((line, i) => { if (!b[i] || b[i].trim() !== line.trim()) diff++; });
    return diff;
}

// Main Playground 
export default function Playground() {
    const navigate = useNavigate();
    const { accessToken, apiBase, fetchProfile } = useAuth();

    const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
    const [inputCode, setInputCode] = useState("");
    const [buggedCode, setBuggedCode] = useState("");
    const [editableCode, setEditableCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const [mode, setMode] = useState("input"); // "input" | "debug"
    const [startTime, setStartTime] = useState(null);
    const [scorecard, setScorecard] = useState(null);
    const [cameFromHome, setCameFromHome] = useState(false);
    const outputRef = useRef(null);

    // Test generator
    const [showTestSetup, setShowTestSetup] = useState(false);
    const [testTitle, setTestTitle] = useState("");
    const [testLevel, setTestLevel] = useState("Easy");
    const [testLoading, setTestLoading] = useState(false);
    const [testQuestions, setTestQuestions] = useState(null);

    // ── On mount: check sessionStorage for data passed from home page ──
    useEffect(() => {
        const tryLoad = () => {
            const bugged = sessionStorage.getItem("playground_bugged_code");
            const original = sessionStorage.getItem("playground_original_code");
            const levelRaw = sessionStorage.getItem("playground_level");

            if (bugged && bugged.trim() && original && original.trim()) {
                if (levelRaw) {
                    try {
                        const saved = JSON.parse(levelRaw);
                        const match = LEVELS.find(l => l.id === saved.id);
                        if (match) setSelectedLevel(match);
                    } catch (_) { }
                }
                setBuggedCode(bugged.trim());
                setEditableCode(bugged.trim());
                setInputCode(original.trim());
                setMode("debug");
                setStartTime(Date.now());
                setCameFromHome(true);
                sessionStorage.removeItem("playground_bugged_code");
                sessionStorage.removeItem("playground_original_code");
                sessionStorage.removeItem("playground_level");
                // Scroll to debug area after render
                setTimeout(() => {
                    outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 200);
                return true;
            }
            return false;
        };

        // Try immediately; if nothing found, try again after next frame
        if (!tryLoad()) {
            const raf = requestAnimationFrame(tryLoad);
            return () => cancelAnimationFrame(raf);
        }
    }, []);

    // Separate mount animation effect
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    const bugCode = async () => {
        if (!inputCode?.trim()) { setError("Paste some code first."); return; }
        setError("");
        setBuggedCode("");
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
                        Authorization: `Bearer ${accessToken}`,
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

            setBuggedCode(result);
            setEditableCode(result);
            setMode("debug");
            setStartTime(Date.now());

            setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (e) {
            setError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const timeTaken = `${mins}m ${secs}s`;

        const score = computeScore(inputCode, editableCode);
        const totalBugs = Math.max(1, countDiffs(inputCode, buggedCode));
        const remaining = countDiffs(inputCode, editableCode);
        const bugsFound = Math.max(0, totalBugs - remaining);

        let feedback = "";
        if (score >= 90) feedback = "Outstanding! You're a debugging machine.";
        else if (score >= 75) feedback = "Great work — only a few slipped past you.";
        else if (score >= 50) feedback = "Decent effort. Some bugs still lurk in the shadows.";
        else feedback = "The bugs won this round. Keep training.";

        setScorecard({ score, feedback, bugsFound, totalBugs, timeTaken });

        // if user is authenticated send to server for history
        if (accessToken) {
            fetch(`${apiBase}/playground/submit-debugging`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ 
                    level: selectedLevel.name, 
                    score,
                    bugsFound,
                    totalBugs,
                    timeTaken,
                    originalCode: inputCode,
                    buggedCode: buggedCode,
                    fixedCode: editableCode,
                }),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Debugging result saved:', data);
                // Refresh user profile to update history in context
                fetchProfile();
            })
            .catch((err) => console.error('failed to save debugging result', err));
        }
    };

    const handleRetry = () => {
        setScorecard(null);
        setEditableCode(buggedCode);
        setStartTime(Date.now());
    };

    const handleReset = () => {
        setMode("input");
        setBuggedCode("");
        setEditableCode("");
        setScorecard(null);
        setStartTime(null);
        setCameFromHome(false);
        setInputCode("");
    };

    const generateTest = async () => {
        setTestLoading(true);
        try {
            const response = await fetch(
                `${apiBase}/playground/generate-test`,
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        difficulty: testLevel,
                    }),
                }
            );
            
            if (!response.ok) throw new Error((await response.json()).message || "API failed");
            
            const data = await response.json();
            setTestQuestions(data.questions);
            setShowTestSetup(false);
        } catch (e) {
            alert("Failed to generate test: " + e.message);
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative">
            <GridBackground />
            <GlitchOverlay active={glitchActive} />

            {/* Modals */}
            {scorecard && (
                <ScorecardModal {...scorecard} onClose={() => setScorecard(null)} onRetry={handleRetry} />
            )}
            {testQuestions && (
                <TestModal 
                    questions={testQuestions} 
                    title={testTitle || "Debugging Test"}
                    difficulty={testLevel}
                    onClose={() => setTestQuestions(null)}
                    apiBase={apiBase}
                    accessToken={accessToken}
                    fetchProfile={fetchProfile}
                />
            )}
            {showTestSetup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    <div className="bg-black border border-white/10 p-10 w-[480px]">
                        <p className="text-[9px] tracking-[0.3em] text-white/40 mb-1">CONFIGURE</p>
                        <h2 className="text-xl font-normal mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Generate Debugging Test
                        </h2>
                        <input
                            placeholder="Test title (optional)"
                            value={testTitle}
                            onChange={e => setTestTitle(e.target.value)}
                            className="w-full mb-4 bg-black border border-white/10 p-3 text-[11px] text-white outline-none focus:border-white/30 transition-colors"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        />
                        <select
                            value={testLevel}
                            onChange={e => setTestLevel(e.target.value)}
                            className="w-full mb-8 bg-black border border-white/10 p-3 text-[11px] text-white outline-none"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                        <div className="flex gap-3">
                            <button onClick={generateTest} disabled={testLoading}
                                className="flex-1 py-3 text-[11px] tracking-widest font-bold"
                                style={{ background: "white", color: "black", opacity: testLoading ? 0.5 : 1 }}>
                                {testLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full"
                                            style={{ animation: "spin 0.8s linear infinite" }} />
                                        GENERATING...
                                    </span>
                                ) : "GENERATE →"}
                            </button>
                            <button onClick={() => setShowTestSetup(false)}
                                className="px-5 py-3 text-[11px] tracking-widest border border-white/10 text-white/50 hover:text-white transition-colors">
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-[1]">
                <Navbar />

                <div className="max-w-[1300px] mx-auto px-10 py-[60px]">

                    {/* ── Header ── */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <div className="text-5xl tracking-wide text-white/60"
                                    style={{ fontFamily: "'Space Mono', monospace" }}>
                                    Playground
                                </div>
                                {/* breadcrumb if came from home */}
                                {cameFromHome && mode === "debug" && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => navigate("/")}
                                            className="text-[9px] tracking-widest text-white/30 hover:text-white/60 transition-colors"
                                            style={{ fontFamily: "'Space Mono', monospace" }}>
                                            ← BACK TO HOME
                                        </button>
                                    </div>
                                )}
                            </div>

                            {mode === "debug" && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-400"
                                            style={{ animation: "blink 1s step-end infinite" }} />
                                        <span className="text-[10px] tracking-widest text-red-400"
                                            style={{ fontFamily: "'Space Mono', monospace" }}>
                                            DEBUG MODE
                                        </span>
                                    </div>
                                    <button onClick={handleReset}
                                        className="text-[9px] tracking-widest text-white/30 hover:text-white/60 transition-colors border border-white/10 px-3 py-1.5"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        RESET ↩
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-[10px] tracking-[0.25em] text-white/50 mb-5"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            SELECT DIFFICULTY
                        </p>
                        <div className="grid grid-cols-3 gap-px bg-white/5">
                            {LEVELS.map(l => (
                                <div key={l.id} className="bg-black">
                                    <LevelCard
                                        level={l}
                                        selected={selectedLevel.id === l.id}
                                        onClick={() => mode === "input" && !loading && setSelectedLevel(l)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── INPUT MODE ── */}
                    {mode === "input" && (
                        <>
                            <div className="bg-white/5 p-3 mb-6">
                                <div className="bg-black">
                                    <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
                                        <span className="text-[10px] tracking-[0.2em] text-white/50 font-semibold"
                                            style={{ fontFamily: "'Space Mono', monospace" }}>INPUT CODE</span>
                                        {inputCode && (
                                            <button onClick={() => setInputCode("")}
                                                className="bg-transparent border-none text-white/40 text-[9px] tracking-widest cursor-pointer"
                                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                                CLEAR ✕
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={inputCode}
                                        onChange={e => { setInputCode(e.target.value); setError(""); }}
                                        placeholder={`// Paste your code here...\n// Any language works.`}
                                        className="w-full min-h-[420px] bg-transparent border-none resize-none outline-none text-xs text-white/80 leading-[22px] p-5 tracking-wider"
                                        style={{ fontFamily: "'Space Mono', monospace", caretColor: "#f87171" }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="px-5 py-3.5 mb-6 text-[11px] tracking-wide"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        border: "1px solid #f8717133",
                                        background: "rgba(248,113,113,0.05)",
                                        color: "#f87171",
                                    }}>
                                    ⚠ {error}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button onClick={bugCode} disabled={loading}
                                    className="px-16 py-[18px] text-sm tracking-widest font-bold transition-all duration-200 flex items-center gap-3.5"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        background: loading ? "rgba(255,255,255,0.1)"
                                            : selectedLevel.id === 3 ? "#f87171"
                                                : selectedLevel.id === 2 ? "#facc15"
                                                    : "white",
                                        color: "black",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.5 : 1,
                                    }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                                    {loading ? (
                                        <>
                                            <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                                                style={{ animation: "spin 0.8s linear infinite" }} />
                                            INJECTING BUGS...
                                        </>
                                    ) : (
                                        <>{selectedLevel.id === 3 ? "DESTROY MY CODE" : selectedLevel.id === 2 ? "PLANT THE TRAPS" : "BUG MY CODE"} →</>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── DEBUG MODE ── */}
                    {mode === "debug" && (
                        <div ref={outputRef}>
                            {/* Banner */}
                            <div className="mb-6 px-6 py-4 border flex items-center justify-between"
                                style={{
                                    borderColor: `${selectedLevel.color}33`,
                                    background: `${selectedLevel.color}08`,
                                    fontFamily: "'Space Mono', monospace",
                                }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">🐛</span>
                                    <div>
                                        <p className="text-[10px] tracking-widest mb-0.5" style={{ color: selectedLevel.color }}>
                                            BUGS INJECTED — {selectedLevel.label}
                                            {cameFromHome && (
                                                <span className="ml-3 text-white/30">· FROM HOME</span>
                                            )}
                                        </p>
                                        <p className="text-[10px] text-white/40">
                                            Edit the right panel to fix all bugs. Hit "Submit Debug" when done.
                                        </p>
                                    </div>
                                </div>
                                <CopyButton text={editableCode} />
                            </div>

                            {/* Side-by-side */}
                            <div className="grid grid-cols-2 gap-px bg-white/5 mb-6">
                                {/* LEFT: bugged reference */}
                                <div className="bg-black">
                                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                                        <span className="text-[10px] tracking-[0.2em] text-white/25"
                                            style={{ fontFamily: "'Space Mono', monospace" }}>
                                            BUGGED CODE (read-only)
                                        </span>
                                    </div>
                                    <pre className="w-full min-h-[500px] overflow-auto text-xs text-white/20 leading-[22px] p-5 select-none"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {buggedCode}
                                    </pre>
                                </div>

                                {/* RIGHT: editable */}
                                <div className="bg-black">
                                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full"
                                            style={{ background: selectedLevel.color, animation: "blink 1s step-end infinite" }} />
                                        <span className="text-[10px] tracking-[0.2em]"
                                            style={{ fontFamily: "'Space Mono', monospace", color: selectedLevel.color }}>
                                            YOUR DEBUG — EDIT HERE
                                        </span>
                                    </div>
                                    <textarea
                                        value={editableCode}
                                        onChange={e => setEditableCode(e.target.value)}
                                        spellCheck={false}
                                        className="w-full min-h-[500px] bg-transparent border-none resize-none outline-none text-xs text-white/85 leading-[22px] p-5 tracking-wider"
                                        style={{ fontFamily: "'Space Mono', monospace", caretColor: selectedLevel.color }}
                                    />
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-center gap-4">
                                <button onClick={handleSubmit}
                                    className="px-16 py-[18px] text-sm tracking-widest font-bold transition-all duration-200"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        background: selectedLevel.id === 3 ? "#f87171"
                                            : selectedLevel.id === 2 ? "#facc15"
                                                : "white",
                                        color: "black",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                    SUBMIT DEBUG →
                                </button>
                                <button onClick={() => setEditableCode(buggedCode)}
                                    className="px-6 py-[18px] text-[11px] tracking-widest border border-white/10 text-white/40 hover:text-white/70 transition-colors"
                                    style={{ fontFamily: "'Space Mono', monospace" }}>
                                    RESET CODE
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── GENERATE TEST ── */}
                    <div className="mt-20">
                        <div
                            onClick={() => setShowTestSetup(true)}
                            className="w-full border border-white/10 bg-white/[0.02] p-10 text-center cursor-pointer transition-all"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
                            <div className="text-3xl mb-3 text-white/70 font-normal"
                                style={{ fontFamily: "'DM Serif Display', serif" }}>
                                Generate Debugging Test
                            </div>
                            <p className="text-[10px] text-white/30 tracking-widest">
                                AI-POWERED MCQ TEST · 10 QUESTIONS · EASY / MEDIUM / HARD
                            </p>
                            <div className="mt-6 inline-block border border-white/10 px-6 py-2 text-[10px] tracking-widest text-white/40">
                                CREATE TEST →
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}