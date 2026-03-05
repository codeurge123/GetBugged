import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import GridBackground from "../../components/Effects/GridBackground.jsx";

export default function Profile() {
    const { user, accessToken, apiBase, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const history = user?.history || [];
    const debuggingHistory = history.filter(h => h.type === 'debugging');
    const testHistory = history.filter(h => h.type === 'test');
    const [expandedId, setExpandedId] = useState(null);
    const [editingName, setEditingName] = useState(user?.name || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    const handleUpdateName = async () => {
        if (!editingName.trim()) {
            setUpdateMessage("Name cannot be empty");
            return;
        }

        if (editingName.trim() === user?.name) {
            setUpdateMessage("Name is the same as current");
            setTimeout(() => setUpdateMessage(""), 3000);
            return;
        }

        setIsUpdating(true);
        try {
            const response = await fetch(`${apiBase}/auth/update-name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ name: editingName.trim() }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update name');
            }

            const data = await response.json();
            setUpdateMessage("Name updated successfully!");
            // Update the user in context
            await updateUser(data.user);
            setTimeout(() => setUpdateMessage(""), 3000);
        } catch (err) {
            console.error('Update name error:', err);
            setUpdateMessage(err.message || "Failed to update name");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const renderHistoryItem = (item, idx, type) => {
        const isExpanded = expandedId === `${type}-${idx}`;
        
        return (
            <div
                key={`${type}-${idx}`}
                className="border border-white/[0.08] overflow-hidden transition-all"
            >
                <div
                    onClick={() => setExpandedId(isExpanded ? null : `${type}-${idx}`)}
                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[8px] tracking-widest px-2 py-1 border ${
                                    type === 'debugging' 
                                        ? 'border-red-400/30 text-red-300' 
                                        : 'border-blue-400/30 text-blue-300'
                                }`}>
                                    {type === 'debugging' ? 'DEBUGGING' : 'TEST'}
                                </span>
                                {item.testDifficulty && (
                                    <span className="text-[8px] text-white/40">{item.testDifficulty}</span>
                                )}
                            </div>
                            <p className="text-white text-[11px] font-mono">
                                {item.level} {item.testTitle && `· ${item.testTitle}`}
                            </p>
                            <p className="text-white/50 text-[10px] mt-1">
                                {new Date(item.date).toLocaleDateString()} at{" "}
                                {new Date(item.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-[14px] font-bold ${
                                item.score >= 80 ? 'text-green-400' : item.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {item.score}%
                            </p>
                            <p className="text-[9px] text-white/40">Score</p>
                        </div>
                    </div>
                    {type === 'debugging' && (
                        <p className="text-[9px] text-white/30">
                            Time: {item.timeTaken} · Bugs: {item.bugsFound}/{item.totalBugs}
                        </p>
                    )}
                    {type === 'test' && (
                        <p className="text-[9px] text-white/30">
                            {item.questions?.length || 0} questions
                        </p>
                    )}
                </div>

                {isExpanded && (
                    <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                        {type === 'debugging' ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-[10px]">
                                    <div>
                                        <p className="text-white/40">Score</p>
                                        <p className="text-white font-mono">{item.score}%</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40">Bugs Found</p>
                                        <p className="text-white font-mono">{item.bugsFound}/{item.totalBugs}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40">Time Taken</p>
                                        <p className="text-white font-mono">{item.timeTaken}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-[10px]">
                                    <p className="text-white/40 mb-2">Correct: {item.answers?.filter((ans, i) => ans === item.questions?.[i]?.correct).length}/{item.questions?.length || 0}</p>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {item.questions?.map((q, i) => {
                                            const isCorrect = item.answers?.[i] === q.correct;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`p-2 border ${
                                                        isCorrect
                                                            ? 'border-green-400/20 bg-green-400/5'
                                                            : 'border-red-400/20 bg-red-400/5'
                                                    }`}
                                                >
                                                    <p className="text-white/70 text-[9px] mb-1">Q{i + 1}: {q.question}</p>
                                                    <p className={`text-[9px] ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                        Your answer: {item.answers?.[i] || '—'}
                                                    </p>
                                                    {!isCorrect && (
                                                        <p className="text-green-400 text-[9px] mt-0.5">
                                                            Correct: {q.correct}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white relative"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            <GridBackground />
            
            {/* Header */}
            <div className="relative z-10 sticky top-0 bg-black border-b border-white/10 backdrop-blur">
                <div className="max-w-[1200px] mx-auto px-8 py-8 flex justify-between items-center">
                    <div>
                        <p className="text-[9px] tracking-[0.3em] text-white/40 mb-2">USER PROFILE</p>
                        <h1 className="text-4xl text-white font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {editingName || "User"}
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-white/50 hover:text-white text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-12">
                <div className="space-y-12">
                    {/* User Info */}
                    <div className="space-y-4">
                        <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Account Information</p>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[9px] text-white/50 block mb-2">NAME</label>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => {
                                        setEditingName(e.target.value);
                                        setUpdateMessage("");
                                    }}
                                    className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30 transition-colors"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-white/50 block mb-1">EMAIL</label>
                                <p className="text-white text-[12px] break-all">{user?.email || "—"}</p>
                            </div>
                            {updateMessage && (
                                <div className={`text-[10px] p-2 border ${
                                    updateMessage.includes('success') 
                                        ? 'border-green-400/30 text-green-400' 
                                        : 'border-red-400/30 text-red-400'
                                }`}>
                                    {updateMessage}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-4">
                        <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Overall Stats</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-white/10 p-4">
                                <p className="text-white/40 text-[9px] mb-2">DEBUGGING</p>
                                <p className="text-white text-[16px] font-bold">{user?.debuggingStats?.total || 0}</p>
                                <p className="text-white/50 text-[10px] mt-1">Avg: {user?.debuggingStats?.avgScore || 0}%</p>
                            </div>
                            <div className="border border-white/10 p-4">
                                <p className="text-white/40 text-[9px] mb-2">TESTS</p>
                                <p className="text-white text-[16px] font-bold">{user?.testStats?.total || 0}</p>
                                <p className="text-white/50 text-[10px] mt-1">Avg: {user?.testStats?.avgScore || 0}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Debugging History Section */}
                    {debuggingHistory.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] tracking-[0.25em] text-red-300/60 uppercase">Debugging History</p>
                                <span className="text-[11px] text-white/60">{debuggingHistory.length} attempts</span>
                            </div>
                            <div className="space-y-2">
                                {debuggingHistory.map((item, idx) => renderHistoryItem(item, idx, 'debugging'))}
                            </div>
                        </div>
                    )}

                    {/* Test History Section */}
                    {testHistory.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] tracking-[0.25em] text-blue-300/60 uppercase">Test History</p>
                                <span className="text-[11px] text-white/60">{testHistory.length} tests</span>
                            </div>
                            <div className="space-y-2">
                                {testHistory.map((item, idx) => renderHistoryItem(item, idx, 'test'))}
                            </div>
                        </div>
                    )}

                    {history.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[11px] text-white/40">No activities yet</p>
                            <p className="text-[10px] text-white/30 mt-2">Start debugging and taking tests to see your history</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t border-white/10 pt-8 flex gap-3">
                        <button
                            onClick={handleUpdateName}
                            disabled={isUpdating}
                            className="flex-1 py-3 text-[11px] tracking-widest bg-white text-black font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "UPDATING..." : "UPDATE NAME"}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 py-3 text-[11px] tracking-widest border border-white/15 text-white/80 hover:bg-white/5 transition-colors"
                        >
                            HOME
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-3 text-[11px] tracking-widest bg-white/10 text-white hover:bg-white/[0.15] transition-colors border border-white/20"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
