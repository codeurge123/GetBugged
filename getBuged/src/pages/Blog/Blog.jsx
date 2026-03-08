import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import GridBackground from "../../components/Effects/GridBackground.jsx";
import BlogList from "../../components/Blog/BlogList.jsx";
import BlogDetail from "../../components/Blog/BlogDetail.jsx";
import BlogForm from "../../components/Blog/BlogForm.jsx";

export default function Blog() {
    const { user, accessToken, apiBase } = useAuth();
    const [view, setView] = useState("list"); // "list", "detail", "create", "edit"
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    const fetchBlogs = async (page = 1, query = "") => {
        setLoading(true);
        try {
            const endpoint = query 
                ? `${apiBase}/blogs/search?query=${encodeURIComponent(query)}`
                : `${apiBase}/blogs?page=${page}`;
            
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error("Failed to fetch blogs");
            
            const data = await response.json();
            setBlogs(query ? data.blogs : data.blogs);
            setCurrentPage(page);
            setTotalPages(data.pages || 1);
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === "list" && !selectedBlog) {
            if (searchQuery) {
                fetchBlogs(1, searchQuery);
            } else {
                fetchBlogs(currentPage);
            }
        }
    }, [view, currentPage]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchBlogs(1, query);
    };

    const handleBlogCreated = (newBlog) => {
        setView("list");
        setCurrentPage(1);
        fetchBlogs(1);
    };

    const handleBlogUpdated = (updatedBlog) => {
        setSelectedBlog(updatedBlog);
        fetchBlogs(currentPage);
    };

    const handleBlogDeleted = () => {
        setView("list");
        setSelectedBlog(null);
        fetchBlogs(currentPage);
    };

    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setView("detail");
    };

    const handleEditBlog = () => {
        setView("edit");
    };

    const handleBack = () => {
        setView("list");
        setSelectedBlog(null);
    };

    return (
        <div className="min-h-screen bg-black text-white relative">
            <GridBackground />
            <div className="relative z-[1]">
                <Navbar />

                {/* Header */}
                <section className="px-10 pt-[60px] pb-10 border-b border-white/[0.06] relative overflow-hidden">
                    <div className="max-w-[1300px] mx-auto">
                        <div
                            style={{
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? "translateY(0)" : "translateY(24px)",
                                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                                transition: "all 700ms ease",
                            }}
                        >
                            <p className="text-[10px] tracking-[0.3em] text-white/50 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                COMMUNITY KNOWLEDGE.
                            </p>
                            <h1 className="text-5xl font-normal mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                Developer Blogs
                            </h1>
                            <p className="text-white/50 text-[13px] max-w-[600px]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Share your debugging stories, tips, and best practices with the community. Learn from others and grow together.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-[1300px] mx-auto px-10 py-[60px]">
                    {view === "list" && (
                        <BlogList 
                            blogs={blogs} 
                            loading={loading}
                            onBlogSelect={handleViewBlog}
                            onCreateClick={() => setView("create")}
                            onSearch={handleSearch}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            user={user}
                            apiBase={apiBase}
                            accessToken={accessToken}
                        />
                    )}

                    {view === "detail" && selectedBlog && (
                        <BlogDetail 
                            blog={selectedBlog}
                            onBack={handleBack}
                            onEdit={handleEditBlog}
                            onUpdate={handleBlogUpdated}
                            onDelete={handleBlogDeleted}
                            user={user}
                            apiBase={apiBase}
                            accessToken={accessToken}
                        />
                    )}

                    {view === "create" && (
                        <BlogForm 
                            onBack={handleBack}
                            onCreate={handleBlogCreated}
                            user={user}
                            apiBase={apiBase}
                            accessToken={accessToken}
                        />
                    )}

                    {view === "edit" && selectedBlog && (
                        <BlogForm 
                            blog={selectedBlog}
                            onBack={handleBack}
                            onUpdate={handleBlogUpdated}
                            user={user}
                            apiBase={apiBase}
                            accessToken={accessToken}
                        />
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
}
