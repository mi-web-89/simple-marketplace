"use client";

import { useState, type SubmitEvent } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Masuk</h1>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="username"
            type="text"
            defaultValue="emilys" // DummyJSON test user
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            defaultValue="emilyspass"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Test: username <code>emilys</code> / password <code>emilyspass</code>
        </p>
      </form>
    </div>
  );
}