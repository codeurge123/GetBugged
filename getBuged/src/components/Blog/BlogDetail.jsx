import React, { useState } from "react";

export default function BlogDetail({ 
    blog, 
    onBack, 
    onEdit, 
    onUpdate, 
    onDelete,
    user,
    apiBase,
    accessToken
}) {
    const [isLiked, setIsLiked] = useState(blog.likes?.some(like => like._id === user?.id) || false);
    const [likeCount, setLikeCount] = useState(blog.likeCount || 0);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAuthor = user && blog.author._id === user.id;

    const handleLike = async () => {
        if (!user) {
            alert("Please login to like blogs");
            return;
        }

        try {
            const response = await fetch(`${apiBase}/blogs/${blog._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to like blog');
            const data = await response.json();
            setIsLiked(data.liked);
            setLikeCount(data.likeCount);
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${apiBase}/blogs/${blog._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete blog');
            onDelete();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete blog');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-[900px] mx-auto" style={{ fontFamily: "'Space Mono', monospace" }}>
            {/* Back Button */}
            <button
                onClick={onBack}
                className="text-[11px] tracking-widest text-white/50 hover:text-white mb-8 transition-colors"
            >
                ← BACK TO BLOGS
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {blog.title}
                </h1>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div>
                        <p className="text-[11px] text-white/60 mb-1">
                            By <span className="font-bold">{blog.authorName}</span>
                        </p>
                        <p className="text-[10px] text-white/40">
                            {new Date(blog.createdAt).toLocaleDateString()} · {blog.views} views
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isAuthor && (
                            <>
                                <button
                                    onClick={onEdit}
                                    className="px-4 py-2 text-[10px] tracking-widest border border-white/30 text-white hover:bg-white/10 transition-colors"
                                >
                                    EDIT
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-[10px] tracking-widest border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'DELETING...' : 'DELETE'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Category and Tags */}
            <div className="flex gap-2 items-center mb-8 flex-wrap">
                <span className="text-[9px] px-3 py-1 border border-white/20 text-white/60">
                    {blog.category}
                </span>
                {blog.tags && blog.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] px-3 py-1 border border-white/10 text-white/40">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Content */}
            <div className="border border-white/10 p-8 bg-white/[0.02] mb-8">
                <p className="text-[12px] text-white/80 leading-[24px] whitespace-pre-wrap break-words">
                    {blog.content}
                </p>
            </div>

            {/* Like Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLike}
                    className={`px-6 py-3 text-[12px] tracking-widest font-bold transition-colors ${
                        isLiked
                            ? 'bg-red-400 text-white'
                            : 'border border-white/30 text-white hover:bg-white/10'
                    }`}
                >
                    {isLiked ? `❤ LIKED (${likeCount})` : `🤍 LIKE (${likeCount})`}
                </button>
            </div>
        </div>
    );
}
