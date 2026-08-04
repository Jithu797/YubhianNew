import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/useAuth";

const COOLDOWN_SECONDS = 30;
const MAX_ATTEMPTS = 3;

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      const from = (location.state as { from?: string })?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch {
      const next = attempts + 1;
      setAttempts(next);
      setError("Invalid email or password");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (next >= MAX_ATTEMPTS) {
        setCooldown(COOLDOWN_SECONDS);
        setAttempts(0);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: "var(--navy)" }}>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)" }}
      />
      <div
        className={`relative w-full max-w-[400px] rounded-2xl p-8 ${shake ? "animate-[shake_0.5s]" : ""}`}
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl overflow-hidden mx-auto mb-4">
            <img src="/logo.jpg" alt="Yubhian Technologies" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Admin Portal</h1>
          <p className="text-sm" style={{ color: "var(--gray)" }}>Directors &amp; admins only</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-2.5 rounded-lg text-sm text-center" style={{ background: "rgba(248,113,113,0.1)", color: "#dc2626", border: "1px solid rgba(248,113,113,0.25)" }}>
            {error}
          </div>
        )}

        {cooldown > 0 && (
          <div className="mb-5 px-4 py-2.5 rounded-lg text-sm text-center" style={{ background: "rgba(245,158,11,0.1)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.25)" }}>
            Too many attempts. Try again in {cooldown}s.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--gray)" }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              disabled={cooldown > 0}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none disabled:opacity-50"
              style={{ background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" }}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--gray)" }} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={cooldown > 0}
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none disabled:opacity-50"
              style={{ background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--gray)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: "var(--gray)" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[var(--blue)]" />
              Remember me
            </label>
            <a href="#" className="hover:text-[var(--white)] transition-colors" style={{ color: "var(--cyan)" }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="mt-2 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-60"
            style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(37,99,235,0.35)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
