import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-10 h-[60px]">
            <div className="flex items-center gap-2.5">
                <span className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
                    GetBugged
                </span>
            </div>

            <div className="flex gap-8 text-[11px] text-white/40 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `cursor-pointer transition-colors duration-200 hover:text-white ${isActive ? "text-white" : ""}`
                    }
                >
                    HOME
                </NavLink>

                <NavLink
                    to="/docs/introduction"
                    className={({ isActive }) =>
                        `cursor-pointer transition-colors duration-200 hover:text-white ${isActive ? "text-white" : ""}`
                    }
                >
                    DOCS
                </NavLink>

                <NavLink
                    to="/playground"
                    className={({ isActive }) =>
                        `cursor-pointer transition-colors duration-200 hover:text-white ${isActive ? "text-white" : ""}`
                    }
                >
                    Playground
                </NavLink>

                <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                        `cursor-pointer transition-colors duration-200 hover:text-white ${isActive ? "text-white" : ""}`
                    }
                >
                    Blogs
                </NavLink>
            </div>

            <div className="flex gap-3">
                {!user ? (
                    <>
                        <Link
                            to="/login"
                            className="px-5 py-2 text-[10px] border-white/30 border hover:bg-white/10 hover:text-white tracking-widest cursor-pointer transition-colors"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            SIGN IN
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2 text-[10px] bg-white text-black hover:bg-white/90 tracking-widest cursor-pointer transition-colors font-bold"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            SIGN UP
                        </Link>
                    </>
                ) : (
                    <Link
                        to="/profile"
                        className="px-5 py-2 text-[10px] border-white/30 border hover:bg-white/10 hover:text-white tracking-widest cursor-pointer transition-colors"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        PROFILE
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;