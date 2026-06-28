"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("web-doctor-user", name.trim());
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#0f172a_45%,_#111827_100%)] px-6 py-16 text-slate-100">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Welcome</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to Web Doctor AI</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Use a name to access the dashboard and keep your reports in the current session.</p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none"
          placeholder="Your name"
        />
        <button
          onClick={handleLogin}
          className="mt-5 w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
