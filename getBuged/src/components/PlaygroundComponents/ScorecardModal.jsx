import { useState, useEffect } from "react";

export default function ScorecardModal({ score, feedback, bugsFound, totalBugs, timeTaken, onClose, onRetry }) {
    const pct = Math.round(score);
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const [animDash, setAnimDash] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setAnimDash((pct / 100) * circ), 100);
        return () => clearTimeout(t);
    }, []);
    const grade =
        pct >= 90 ? { label: "S", color: "#f87171" } :
            pct >= 75 ? { label: "A", color: "#fb923c" } :
                pct >= 60 ? { label: "B", color: "#facc15" } :
                    pct >= 40 ? { label: "C", color: "#4ade80" } :
                        { label: "D", color: "#60a5fa" };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            <div className="bg-black border border-white/10 w-full max-w-[560px] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
                    }} />
                <div className="relative z-10 p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-[9px] tracking-[0.3em] text-white/40 mb-1">RESULT</p>
                            <h2 className="text-2xl text-white font-normal"
                                style={{ fontFamily: "'DM Serif Display', serif" }}>Debug Report</h2>
                        </div>
                        <button onClick={onClose}
                            className="text-white/30 hover:text-white/60 text-[11px] tracking-widest transition-colors">
                            CLOSE ✕
                        </button>
                    </div>

                    <div className="flex items-center gap-10 mb-10">
                        <div className="relative flex-shrink-0">
                            <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="64" cy="64" r={radius} fill="none"
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle cx="64" cy="64" r={radius} fill="none"
                                    stroke={grade.color} strokeWidth="6"
                                    strokeDasharray={`${animDash} ${circ}`}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold" style={{ color: grade.color }}>{pct}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-7xl font-normal mb-1"
                                style={{ fontFamily: "'DM Serif Display', serif", color: grade.color }}>
                                {grade.label}
                            </div>
                            <p className="text-white/50 text-[11px] leading-relaxed">{feedback}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-px bg-white/5 mb-8">
                        {[
                            { label: "BUGS FIXED", value: `${bugsFound}/${totalBugs}` },
                            { label: "ACCURACY", value: `${pct}%` },
                            { label: "TIME", value: timeTaken },
                        ].map((s, i) => (
                            <div key={i} className="bg-black p-5 text-center">
                                <p className="text-[8px] tracking-[0.25em] text-white/30 mb-2">{s.label}</p>
                                <p className="text-xl text-white">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border border-white/[0.08] p-4 mb-8"
                        style={{ background: `${grade.color}08` }}>
                        <p className="text-[10px] tracking-wider" style={{ color: grade.color }}>
                            ▸ {feedback}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onRetry}
                            className="flex-1 py-3 text-[11px] tracking-widest font-bold"
                            style={{ background: "white", color: "black" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            TRY AGAIN →
                        </button>
                        <button onClick={onClose}
                            className="px-6 py-3 text-[11px] tracking-widest border border-white/10 text-white/50 hover:text-white transition-colors">
                            DISMISS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}