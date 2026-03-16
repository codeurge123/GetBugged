import React from "react";

export default function TestDetailModal({ testData, onClose }) {
    if (!testData || !testData.questions) {
        return null;
    }

    const totalCorrect = testData.answers?.filter(
        (ans, i) => ans === testData.questions?.[i]?.correct
    ).length || 0;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            <div className="bg-black border border-white/[0.08] max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-black border-b border-white/[0.08] p-6 flex justify-between items-center">
                    <div>
                        <p className="text-[9px] tracking-[0.3em] text-white/40 mb-1">TEST REVIEW</p>
                        <h2 className="text-xl text-white font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {testData.testTitle || 'Debugging Test'}
                        </h2>
                    </div>
                    <button onClick={onClose}
                        className="text-white/30 hover:text-white text-2xl transition-colors">
                        ✕
                    </button>
                </div>

                {/* Score Summary */}
                <div className="border-b border-white/[0.08] p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[9px] text-white/40 tracking-widest mb-2">SCORE</p>
                            <p className="text-3xl font-bold text-red-400">{testData.score}%</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-white/40 tracking-widest mb-2">CORRECT</p>
                            <p className="text-3xl font-bold text-green-400">{totalCorrect}/{testData.questions.length}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-white/40 tracking-widest mb-2">DIFFICULTY</p>
                            <p className="text-sm text-white/80 capitalize">{testData.testDifficulty}</p>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-0">
                    {testData.questions.map((q, i) => {
                        const userAnswer = testData.answers?.[i];
                        const isCorrect = userAnswer === q.correct;
                        
                        return (
                            <div key={i} className="border-b border-white/[0.08] p-6 last:border-b-0">
                                {/* Question Number and Status */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-[10px] text-white/40 tracking-widest font-bold">
                                        Q{String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className={`text-[8px] tracking-widest px-2 py-1 border ${
                                        isCorrect
                                            ? 'border-green-400/30 text-green-400'
                                            : 'border-red-400/30 text-red-400'
                                    }`}>
                                        {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                                    </span>
                                </div>

                                {/* Question Text */}
                                <p className="text-[11px] text-white leading-relaxed mb-4">
                                    {q.question}
                                </p>

                                {/* Options */}
                                <div className="space-y-2 mb-4">
                                    {q.options?.map((opt, optIdx) => {
                                        const isUserSelected = opt === userAnswer;
                                        const isCorrectAnswer = opt === q.correct;
                                        
                                        return (
                                            <div key={optIdx}
                                                className={`p-3 border text-[10px] ${
                                                    isCorrectAnswer && isUserSelected
                                                        ? 'border-green-400/50 bg-green-400/5 text-green-300'
                                                        : isCorrectAnswer
                                                        ? 'border-green-400/20 bg-green-400/5 text-white/70'
                                                        : isUserSelected
                                                        ? 'border-red-400/50 bg-red-400/5 text-red-300'
                                                        : 'border-white/[0.08] text-white/50'
                                }`}>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-white/40 font-mono w-6">{String.fromCharCode(65 + optIdx)})</span>
                                                    <span className="flex-1">{opt}</span>
                                                    {isCorrectAnswer && (
                                                        <span className="text-green-400 text-[9px] font-bold ml-2">✓</span>
                                                    )}
                                                    {isUserSelected && !isCorrectAnswer && (
                                                        <span className="text-red-400 text-[9px] font-bold ml-2">✗</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Answer Summary */}
                                <div className="bg-white/[0.02] border border-white/[0.08] p-3 text-[10px] space-y-1">
                                    <p>
                                        <span className="text-white/40">Your answer:</span>
                                        <span className={`ml-2 font-mono ${userAnswer ? 'text-white' : 'text-white/40'}`}>
                                            {userAnswer || '(no answer)'}
                                        </span>
                                    </p>
                                    {userAnswer !== q.correct && (
                                        <p>
                                            <span className="text-white/40">Correct answer:</span>
                                            <span className="ml-2 font-mono text-green-400">{q.correct}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.08] p-6">
                    <button onClick={onClose}
                        className="w-full py-3 text-[11px] tracking-widest font-bold bg-white text-black hover:bg-white/90 transition-colors">
                        CLOSE REVIEW
                    </button>
                </div>
            </div>
        </div>
    );
}
