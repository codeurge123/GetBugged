import React, { useState } from "react";

export default function BlogList({ 
    blogs, 
    loading, 
    onBlogSelect, 
    onCreateClick, 
    onSearch,
    currentPage,
    totalPages,
    onPageChange,
    user,
    apiBase,
    accessToken
}) {
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchInput);
    };

    return (
        <div className="space-y-8">
            {/* Search and Create */}
            <div className="flex gap-4 items-center" style={{ fontFamily: "'Space Mono', monospace" }}>
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search blogs..."
                            className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-[11px] tracking-widest"
                        >
                            SEARCH
                        </button>
                    </div>
                </form>

                {user && (
                    <button
                        onClick={onCreateClick}
                        className="px-6 py-3 bg-white text-black text-[11px] tracking-widest font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
                    >
                        ✎ NEW BLOG
                    </button>
                )}
            </div>

            {/* Blog List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-20 border border-white/10 p-10">
                    <p className="text-[14px] text-white/50">No blogs found</p>
                    {user && (
                        <button
                            onClick={onCreateClick}
                            className="mt-6 px-8 py-3 bg-white text-black text-[11px] tracking-widest font-bold hover:bg-white/90"
                        >
                            Create First Blog →
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                onClick={() => onBlogSelect(blog)}
                                className="border border-white/10 p-6 hover:bg-white/5 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-white group-hover:text-white/80 transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                            {blog.title}
                                        </h3>
                                        <p className="text-[9px] text-white/40 mt-2">
                                            By <span className="font-bold">{blog.authorName}</span> · {new Date(blog.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-bold text-white/60">{blog.likeCount} ❤</p>
                                        <p className="text-[9px] text-white/40">{blog.views} views</p>
                                    </div>
                                </div>

                                <p className="text-[11px] text-white/60 line-clamp-2 mb-3">
                                    {blog.content}
                                </p>

                                <div className="flex gap-2 items-center">
                                    {blog.tags && blog.tags.map((tag, idx) => (
                                        <span key={idx} className="text-[9px] px-2 py-1 border border-white/20 text-white/50">
                                            #{tag}
                                        </span>
                                    ))}
                                    <span className="text-[8px] px-2 py-1 border border-white/10 text-white/40">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-4 py-2 text-[10px] tracking-widest transition-colors ${
                                        currentPage === page
                                            ? 'bg-white text-black font-bold'
                                            : 'border border-white/10 text-white/50 hover:text-white'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
