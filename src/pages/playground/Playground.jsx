import { useState, useEffect, useRef } from "react";
import GridBackground from "../../components/Effects/GridBackground.jsx";
import GlitchOverlay from "../../components/Effects/GlitchOverlay.jsx";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import LEVELS from "../../components/data/Level.js";
import CopyButton from "../../components/Features/CopyButton.jsx";
import BuggedCodeDisplay from "../../components/Features/BuggedCodeDisplay.jsx";
import LevelCard from "../../components/LevelCard.jsx";
import env from "../../envdata.js";

export default function Playground() {
    const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
    const [inputCode, setInputCode] = useState("");
    const [outputCode, setOutputCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const outputRef = useRef(null);
    const [showTestSetup, setShowTestSetup] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [testTitle, setTestTitle] = useState("");
    const [testLevel, setTestLevel] = useState("Easy");
    const [testQuestions, setTestQuestions] = useState([]);
    const [testLoading, setTestLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");

    const calculateScore = () => {
        let correct = 0;

        testQuestions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                correct++;
            }
        });

        const totalScore = (correct / testQuestions.length) * 100;
        setScore(totalScore);

        let fb = "";
        if (totalScore > 80) fb = "Excellent debugging skills!";
        else if (totalScore > 50) fb = "Good, but needs improvement.";
        else fb = "Practice more debugging.";

        setFeedback(fb);

        setShowTestModal(false);

        setTimeout(() => {
            alert(`Score: ${totalScore}%\n${fb}`);
        }, 300);
    };

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
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env}R8AphF7I`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: selectedLevel.prompt(inputCode) }] }],
                        generationConfig: {
                            temperature: selectedLevel.id === 3 ? 1.0 : 0.7,
                            maxOutputTokens: 8192,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || `API Error ${response.status}`);
            }

            const data = await response.json();
            let result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            result = result
                .replace(/^```[\w]*\n?/m, "")
                .replace(/\n?```$/m, "")
                .trim();

            setOutputCode(result);
            setTimeout(
                () =>
                    outputRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    }),
                100
            );
        } catch (e) {
            setError(e.message || "Something went wrong. Check your API key.");
        } finally {
            setLoading(false);
        }
    };

    const generateTest = async () => {
        setTestLoading(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env}R8AphF7I`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `
Generate 10 debugging MCQ questions.
Difficulty: ${testLevel}
Each question should have:
- question
- 4 options
- correct answer
Return ONLY valid JSON array.
`
                            }]
                        }]
                    })
                }
            );

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("Full API Response:", data);

            if (!response.ok) {
                throw new Error(data.error?.message || "API failed");
            }

            if (!data.candidates) {
                throw new Error("No candidates returned");
            }

            const raw = data.candidates[0].content.parts[0].text;
            console.log("Raw Text:", raw);

            const parsed = JSON.parse(raw);

            setTestQuestions(parsed);
            setShowTestSetup(false);
            setShowTestModal(true);

        } catch (e) {
            console.error("ERROR:", e);
            alert("Failed to generate test. Check console.");
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative">

            <GridBackground />
            <GlitchOverlay active={glitchActive} />

            <div className="relative z-[1]">
                {/* NAV */}
                <Navbar />


                {/* MAIN APP */}
                <div className="max-w-[1300px] mx-auto px-10 py-[60px]">
                    {/* LEVEL SELECTOR */}
                    <div className="mb-12">
                        <div className="text-5xl mb-10  tracking-wide text-white/60"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Playground
                        </div>
                        <p
                            className="text-[10px] tracking-[0.25em] text-white/50 mb-5"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
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

                    {/* EDITOR SPLIT */}
                    <div className="grid grid-cols-2  gap-px p-3 bg-white/5 mb-6">
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
                                onChange={(e) => {
                                    setInputCode(e.target.value);
                                    setError("");
                                }}
                                placeholder={`// Paste your code here...\n// Any language works.\n\nfunction example(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`}
                                className="w-full min-h-[420px] bg-transparent border-none resize-none outline-none text-xs text-white/80 leading-[22px] p-5 tracking-wider"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    caretColor: "#f87171",
                                }}
                            />
                        </div>

                        {/* OUTPUT */}
                        <div ref={outputRef} className="bg-black relative">
                            <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
                                <span
                                    className="text-[10px] tracking-[0.2em]"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: selectedLevel.color,
                                    }}
                                >
                                    BUGGED OUTPUT — {selectedLevel.label}
                                </span>
                                {outputCode && <CopyButton text={outputCode} />}
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center min-h-[420px] gap-5">
                                    <div
                                        className="w-12 h-12 rounded-full border-2"
                                        style={{
                                            borderColor: `${selectedLevel.color}33`,
                                            borderTopColor: selectedLevel.color,
                                            animation: "spin 0.8s linear infinite",
                                        }}
                                    />
                                    <span
                                        className="text-[11px] tracking-[0.15em]"
                                        style={{
                                            fontFamily: "'Space Mono', monospace",
                                            color: selectedLevel.color,
                                            animation: "blink 1s step-end infinite",
                                        }}
                                    >
                                        {selectedLevel.id === 3
                                            ? "DESTROYING YOUR CODE..."
                                            : selectedLevel.id === 2
                                                ? "PLANTING TRAPS..."
                                                : "ADDING BUGS..."}
                                    </span>
                                </div>
                            ) : outputCode ? (
                                <BuggedCodeDisplay code={outputCode} level={selectedLevel} />
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
                                    <div className="text-4xl opacity-15">🐛</div>
                                    <p
                                        className="text-[11px] text-white/20 tracking-widest"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        BUGGED CODE WILL APPEAR HERE
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
                                border: "1px solid #f8717133",
                                background: "rgba(248,113,113,0.05)",
                                color: "#f87171",
                                animation: "shake 0.4s ease",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* BUG IT BUTTON */}
                    <div className="flex justify-center">
                        <button
                            onClick={bugCode}
                            disabled={loading}
                            className="px-16 py-[18px] border-none text-sm tracking-widest font-bold transition-all duration-200 flex items-center gap-3.5"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                background: loading
                                    ? "rgba(255,255,255,0.1)"
                                    : selectedLevel.id === 3
                                        ? "#f87171"
                                        : selectedLevel.id === 2
                                            ? "#facc15"
                                            : "white",
                                color: "black",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!loading)
                                    e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2 bg-white p-2">
                                    <span
                                        className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                                        style={{ animation: "spin 0.8s linear infinite" }}
                                    />
                                    INJECTING BUGS...
                                </div>
                            ) : (
                                <>
                                    {selectedLevel.id === 3
                                        ? "F**KED MY CODE"
                                        : selectedLevel.id === 2
                                            ? "PLANT THE TRAPS"
                                            : "BUG MY CODE"}
                                    {" →"}
                                </>
                            )}
                        </button>

                    </div>
                    {/* AI TEST GENERATOR BOX */}
                    <div className="mt-20 flex justify-center">
                        <div
                            onClick={() => setShowTestSetup(true)}
                            className="w-full max-w-[800px] border border-white/10 bg-white/[0.02] p-10 text-center cursor-pointer hover:bg-white/[0.05] transition"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            <div className="text-2xl mb-3">Generate Debugging Test</div>
                            <p className="text-xs text-white/40 tracking-widest">
                                CLICK TO CREATE AI GENERATED TEST
                            </p>
                        </div>
                    </div>
                </div>
                {showTestSetup && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-black border border-white/10 p-10 w-[500px]">
                            <h2 className="text-xl mb-6">Create Test</h2>

                            <input
                                placeholder="Test Title"
                                value={testTitle}
                                onChange={(e) => setTestTitle(e.target.value)}
                                className="w-full mb-4 bg-black border border-white/10 p-3 text-sm"
                            />

                            <select
                                value={testLevel}
                                onChange={(e) => setTestLevel(e.target.value)}
                                className="w-full  mb-6 bg-black border border-white/10 p-3 text-sm"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>

                            <div className="flex justify-between">
                                <button onClick={() => setShowTestSetup(false)}>Cancel</button>
                                <button
                                    onClick={() => alert("Test generation is currently unavailable. Please check back later.")}
                                    className="bg-white text-black px-6 py-2"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showTestModal && (
                    <div className="fixed inset-0 bg-black z-50 overflow-y-auto p-10">
                        <h1 className="text-3xl mb-8">{testTitle}</h1>

                        {testQuestions.map((q, index) => (
                            <div key={index} className="mb-10 border border-white/10 p-6">
                                <p className="mb-4">{index + 1}. {q.question}</p>

                                {q.options.map((opt, i) => (
                                    <label key={i} className="block mb-2">
                                        <input
                                            type="radio"
                                            name={`q${index}`}
                                            onChange={() =>
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [index]: opt
                                                }))
                                            }
                                        />
                                        {" "}{opt}
                                    </label>
                                ))}
                            </div>
                        ))}

                        <button
                            onClick={() => calculateScore()}
                            className="bg-white text-black px-8 py-3"
                        >
                            Submit Test
                        </button>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
}   