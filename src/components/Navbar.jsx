import React from "react";
import { NavLink, Link } from "react-router-dom";
import bug from "../../public/getbug.png";
const Navbar = () => {
    return (
        <nav className="sticky top-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-10 h-[60px]">
            <div className="flex items-center gap-2.5">
                <span className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
                    GetBuged
                </span>
            </div>

            {/* ✅ NavLinks added here */}
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
                    to="/docs"
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
            </div>

            {/* ✅ GitHub link added */}
            <a
                href="https://github.com/codeurge123/getBuged"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-[10px] border-white/30 border hover:bg-white/10 hover:text-white tracking-widest cursor-pointer"
                style={{ fontFamily: "'Space Mono', monospace" }}
            >
                <div className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="gold" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                    </svg>
                    <p>Github Repo</p>
                </div>
            </a>
        </nav>
    );
};

export default Navbar;