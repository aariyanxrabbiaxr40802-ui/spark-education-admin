"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        <div className="hidden md:block">
          <h1 className="text-5xl font-bold leading-tight text-white">
            Professional access for your{" "}
            <span className="bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Spark Education
            </span>{" "}
            team.
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            Manage inquiries, monitor student pipelines, and control your admin
            system with a premium dashboard.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <p className="text-white font-semibold">🔐 Secure</p>
              <p className="text-gray-400 text-sm">Admin only access</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <p className="text-white font-semibold">⚡ Fast</p>
              <p className="text-gray-400 text-sm">Real-time workflow</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <p className="text-white font-semibold">📊 Smart</p>
              <p className="text-gray-400 text-sm">Data-driven insights</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>

            <p className="text-gray-400 mb-6">
              Welcome back to Spark Education
            </p>

            <input
              type="email"
              placeholder="Admin Email"
              className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
            >
              Sign In →
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Secure admin session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}