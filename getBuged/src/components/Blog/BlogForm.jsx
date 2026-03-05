import React, { useState } from "react";

export default function BlogForm({ 
    blog, 
    onBack, 
    onCreate, 
    onUpdate,
    user,
    apiBase,
    accessToken
}) {
    const [title, setTitle] = useState(blog?.title || "");
    const [content, setContent] = useState(blog?.content || "");
    const [category, setCategory] = useState(blog?.category || "General");
    const [tags, setTags] = useState(blog?.tags?.join(", ") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!blog;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setLoading(true);
        try {
            const tagArray = tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag);

            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${apiBase}/blogs/${blog._id}` : `${apiBase}/blogs`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    category: category.trim(),
                    tags: tagArray,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `Failed to ${isEditing ? 'update' : 'create'} blog`);
            }

            const data = await response.json();
            
            if (isEditing) {
                onUpdate(data.blog);
            } else {
                onCreate(data.blog);
            }
        } catch (err) {
            console.error('Blog error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[900px] mx-auto" style={{ fontFamily: "'Space Mono', monospace" }}>
            {/* Back Button */}
            <button
                onClick={onBack}
                className="text-[11px] tracking-widest text-white/50 hover:text-white mb-8 transition-colors"
            >
                ← BACK
            </button>

            {/* Form */}
            <div className="border border-white/10 p-8 bg-white/[0.02]">
                <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {isEditing ? "Edit Blog" : "Create New Blog"}
                </h2>

                {error && (
                    <div className="mb-6 p-4 border border-red-400/30 bg-red-400/5 text-red-400 text-[11px]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="text-[10px] tracking-widest text-white/50 block mb-2">TITLE</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30 transition-colors"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-[10px] tracking-widest text-white/50 block mb-2">CATEGORY</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30"
                        >
                            <option>General</option>
                            <option>Debugging</option>
                            <option>JavaScript</option>
                            <option>React</option>
                            <option>Performance</option>
                            <option>Best Practices</option>
                            <option>Tips & Tricks</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-[10px] tracking-widest text-white/50 block mb-2">TAGS (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. debugging, javascript, performance"
                            className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30 transition-colors"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-[10px] tracking-widest text-white/50 block mb-2">CONTENT</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your blog content here..."
                            rows={16}
                            className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30 transition-colors resize-none"
                        />
                        <p className="text-[9px] text-white/30 mt-2">Characters: {content.length}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 text-[11px] tracking-widest font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "PUBLISHING..." : isEditing ? "UPDATE BLOG" : "PUBLISH BLOG"}
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 py-3 text-[11px] tracking-widest border border-white/30 text-white hover:bg-white/10 transition-colors"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
