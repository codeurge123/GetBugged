import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed top-8 h-[calc(100vh-64px)] bg-black">
            <Link to='/' className="p-5 text-2xl font-semibold">
                GetBugged
            </Link>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">

                <NavLink to="/docs/introduction" end className={linkStyle}>
                    Introduction
                </NavLink>

                <NavLink to="/docs/getting-started" className={linkStyle}>
                    Getting Started
                </NavLink>

                <NavLink to="/docs/levels" className={linkStyle}>
                    Levels
                </NavLink>

                <NavLink to="/docs/how-to-use" className={linkStyle}>
                    How To Use
                </NavLink>

                <NavLink to="/docs/debugging-guide" className={linkStyle}>
                    Debugging Guide
                </NavLink>

                <NavLink to="/docs/best-practices" className={linkStyle}>
                    Best Practices
                </NavLink>

                {/* Example of long list */}
                <NavLink to="/docs/common-errors" className={linkStyle}>
                    Common Errors
                </NavLink>

                <NavLink to="/docs/async-bugs" className={linkStyle}>
                    Async Bugs
                </NavLink>

                <NavLink to="/docs/react-bugs" className={linkStyle}>
                    React Bugs
                </NavLink>

                <NavLink to="/docs/performance-issues" className={linkStyle}>
                    Performance Issues
                </NavLink>

                <NavLink to="/docs/security-bugs" className={linkStyle}>
                    Security Bugs
                </NavLink>

            </nav>

            {/* Bottom Back Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => navigate("/")}
                    className="w-full py-2 text-sm bg-white/10 hover:bg-white/20 transition rounded-md"
                >
                    ← Back to Home
                </button>
            </div>

        </aside>
    );
}

const linkStyle = ({ isActive }) =>
    isActive
        ? "block text-white font-semibold"
        : "block text-white/50 hover:text-white";