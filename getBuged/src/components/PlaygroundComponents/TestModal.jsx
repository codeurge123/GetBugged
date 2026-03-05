import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function TestModal({ questions, title, difficulty, onClose, apiBase, accessToken, fetchProfile }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        let correct = 0;
        const answerArray = [];
        
        questions.forEach((q, i) => { 
            const userAnswer = answers[i];
            answerArray.push(userAnswer || "");
            
            // Normalize comparison: trim whitespace and compare directly
            const isCorrect = userAnswer && userAnswer.trim() === (q.correct ? q.correct.toString().trim() : "");
            
            if (isCorrect) correct++;
            console.log(`Q${i}: User="${userAnswer}" | Correct="${q.correct}" | Match=${isCorrect}`);
        });
        
        const pct = Math.round((correct / questions.length) * 100);
        setResult({
            correct, total: questions.length, pct,
            feedback: pct >= 80 ? "Excellent debugging skills!" : pct >= 50 ? "Good, keep practicing." : "More practice needed!",
        });
        setSubmitted(true);
    };

    const handleSaveTest = async () => {
        if (!result) {
            alert('No test results to save');
            return;
        }

        if (!accessToken || !apiBase) {
            alert('Authentication required. Please log in again.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert answers object to array in correct order
            const answersArray = [];
            for (let i = 0; i < questions.length; i++) {
                answersArray.push(answers[i] || "");
            }
            
            console.log('Saving test:', {
                score: result.pct,
                correct: result.correct,
                total: result.total,
                questionsCount: questions.length,
                answersCount: answersArray.length,
            });
            
            const payload = {
                level: 'Debugging Test',
                score: parseFloat(result.pct),
                questions: questions,
                answers: answersArray,
                testTitle: title || 'Debugging Test',
                testDifficulty: difficulty || 'Medium',
            };
            
            const response = await fetch(`${apiBase}/playground/submit-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || `HTTP ${response.status}: Failed to save test`);
            }
            
            console.log('Test saved successfully:', responseData);
            alert('✓ Test saved to your profile!');
            if (fetchProfile) {
                await fetchProfile();
            }
        } catch (err) {
            console.error('Save test error:', err);
            alert(`Error saving test: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            <div className="max-w-[800px] mx-auto p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <p className="text-[9px] tracking-[0.3em] text-white/40 mb-1">DEBUGGING TEST</p>
                        <h1 className="text-2xl font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {title || "Debugging Challenge"}
                        </h1>
                    </div>
                    <button onClick={onClose}
                        className="text-white/30 hover:text-white text-[11px] tracking-widest transition-colors">
                        EXIT ✕
                    </button>
                </div>

                {!submitted ? (
                    <>
                        {questions.map((q, index) => (
                            <div key={index} className="mb-8 border border-white/[0.08] p-6">
                                <p className="text-[11px] text-white/80 leading-relaxed mb-5">
                                    <span className="text-white/30 mr-2">{String(index + 1).padStart(2, "0")}.</span>
                                    {q.question}
                                </p>
                                <div className="space-y-2">
                                    {q.options.map((opt, i) => (
                                        <label key={i}
                                            className="flex items-center gap-3 p-3 border cursor-pointer transition-all"
                                            style={{
                                                borderColor: answers[index] === opt ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.06)",
                                                background: answers[index] === opt ? "rgba(248,113,113,0.05)" : "transparent",
                                            }}>
                                            <input type="radio" name={`q${index}`} className="accent-red-400"
                                                onChange={() => setAnswers(prev => ({ ...prev, [index]: opt }))} />
                                            <span className="text-[10px] text-white/60">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={handleSubmit} disabled={isSubmitting}
                            className="w-full py-4 text-[12px] tracking-widest font-bold"
                            style={{ background: isSubmitting ? "rgba(255,255,255,0.5)" : "white", color: "black", cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                            {isSubmitting ? "SUBMITTING..." : "SUBMIT TEST →"}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-[9px] tracking-[0.3em] text-white/40 mb-4">FINAL SCORE</p>
                        <div className="text-8xl font-normal mb-4"
                            style={{ fontFamily: "'DM Serif Display', serif", color: "#f87171" }}>
                            {result.pct}%
                        </div>
                        <p className="text-white/50 text-[11px] mb-2">{result.correct} / {result.total} correct</p>
                        <p className="text-white/40 text-[10px] mb-10">{result.feedback}</p>
                        {questions.map((q, index) => (
                            <div key={index} className="mb-4 border p-5 text-left"
                                style={{
                                    borderColor: answers[index] === q.correct ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)",
                                    background: answers[index] === q.correct ? "rgba(74,222,128,0.03)" : "rgba(248,113,113,0.03)",
                                }}>
                                <p className="text-[10px] text-white/60 mb-2">{index + 1}. {q.question}</p>
                                <p className="text-[10px]"
                                    style={{ color: answers[index] === q.correct ? "#4ade80" : "#f87171" }}>
                                    Your answer: {answers[index] || "—"}
                                </p>
                                {answers[index] !== q.correct && (
                                    <p className="text-[10px] text-green-400 mt-1">Correct: {q.correct}</p>
                                )}
                            </div>
                        ))}
                        <div className="flex gap-3 justify-center mt-8">
                            <button onClick={handleSaveTest}
                                disabled={isSubmitting}
                                className="px-12 py-3 text-[11px] tracking-widest font-bold transition-all"
                                style={{ 
                                    background: isSubmitting ? "rgba(255,255,255,0.5)" : "white", 
                                    color: "black",
                                    cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}>
                                {isSubmitting ? "SAVING..." : "SAVE TO PROFILE →"}
                            </button>
                            <button onClick={onClose}
                                className="px-12 py-3 text-[11px] tracking-widest border border-white/30 hover:border-white/60 transition-colors"
                                style={{ color: "white" }}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
