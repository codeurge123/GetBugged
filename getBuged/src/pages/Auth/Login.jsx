import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { apiBase, login, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/playground";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      await fetchProfile();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="relative z-[1]">
        <Navbar />
        <div className="max-w-[480px] mx-auto px-6 py-16">
          <p
            className="text-[9px] tracking-[0.3em] text-white/40 mb-2"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            SIGN IN
          </p>
          <h1
            className="text-3xl mb-8 text-white/80"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Access the Playground
          </h1>

          {error && (
            <div
              className="mb-4 text-[11px] p-3 border border-red-500/40 bg-red-500/10"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[10px] tracking-[0.25em] text-white/40 mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 px-3 py-2 text-[11px] outline-none focus:border-white/30"
                style={{ fontFamily: "'Space Mono', monospace" }}
              />
            </div>

            <div>
              <label
                className="block text-[10px] tracking-[0.25em] text-white/40 mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 px-3 py-2 text-[11px] outline-none focus:border-white/30"
                style={{ fontFamily: "'Space Mono', monospace" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 text-[11px] tracking-widest font-bold bg-white text-black"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>

          {/* <button
            type="button"
            onClick={handleGoogle}
            className="w-full mt-4 py-3 text-[11px] tracking-widest border border-white/15 text-white/80 hover:bg-white/5"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            CONTINUE WITH GOOGLE
          </button> */}

          <p
            className="mt-6 text-[11px] text-white/40"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            No account yet?{" "}
            <Link to="/signup" className="text-white/80 underline">
              Create one
            </Link>
            .
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

