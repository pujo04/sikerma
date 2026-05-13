"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import API from "@/lib/api-config";

/* GOOGLE ICON (UI ONLY) */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.1 1.53 7.5 2.8l5.5-5.5C33.7 3.6 29.3 1.5 24 1.5 14.9 1.5 7.2 6.8 3.5 14.5l6.4 5C12 13.3 17.6 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.1 24.5c0-1.5-.1-2.6-.3-3.8H24v7.2h12.7c-.6 3-2.4 5.6-5.1 7.3l7.8 6c4.6-4.2 6.7-10.4 6.7-16.7z"/>
    <path fill="#FBBC05" d="M9.9 28.5c-1-3-1-6.2 0-9.2l-6.4-5C.5 18.1.5 29.9 3.5 34.7l6.4-5.2z"/>
    <path fill="#34A853" d="M24 46.5c6.5 0 12-2.1 16-5.7l-7.8-6c-2.1 1.4-4.9 2.2-8.2 2.2-6.4 0-12-3.8-14.1-9.2l-6.4 5C7.2 41.2 14.9 46.5 24 46.5z"/>
  </svg>
);

/* ANIMATION */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 },
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* TITLE */
  useEffect(() => {
    document.title = "SIKERMA – Login";
  }, []);

  useEffect(() => {
    document.title = loading
      ? "SIKERMA – Memproses Login…"
      : "SIKERMA – Login";
  }, [loading]);

  /* ================= LOGIN HANDLER ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Email atau password salah");
        return;
      }

      // login sukses
      router.replace("/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  /* GOOGLE (UI ONLY) */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/dashboard");
    }, 1000);
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* BACKGROUND */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/img/unila-bg.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* OVERLAY */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-[#0079C4]/60 to-slate-900/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-white/20 bg-white/85 backdrop-blur-xl shadow-[0_25px_80px_-25px_rgba(0,0,0,0.6)] p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center bg-[#0079C4]/10">
              <Lock className="w-7 h-7 text-[#0079C4]" />
            </div>
            <h1 className="text-2xl font-semibold">SIKERMA</h1>
            <p className="text-sm text-muted-foreground">
              Sistem Informasi Kerjasama
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
                  placeholder="email@unila.ac.id"
                  className="w-full h-11 rounded-lg border pl-10 pr-3 text-sm focus:border-[#0079C4] focus:ring-2 focus:ring-[#0079C4]/30"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-lg border pl-10 pr-3 text-sm focus:border-[#0079C4] focus:ring-2 focus:ring-[#0079C4]/30"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 bg-[#0079C4] hover:bg-[#0063A3]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </Button>

          <div className="relative">
            <span className="absolute inset-0 flex items-center border-t" />
            <span className="relative bg-white px-3 text-xs text-muted-foreground">
              atau lanjutkan dengan
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border bg-white hover:bg-slate-50"
          >
            <GoogleIcon />
            Login dengan Google
          </button>

          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Universitas Lampung
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
