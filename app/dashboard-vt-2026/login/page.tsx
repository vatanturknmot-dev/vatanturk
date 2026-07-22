"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/dashboard-vt-2026");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04153f] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <h1 className="text-center text-3xl font-bold text-[#04153f]">
          VATAN TURK
        </h1>

        <p className="mt-2 text-center text-gray-500">
          لوحة الإدارة
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
          dir="rtl"
        >
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              اسم المستخدم
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="أدخل اسم المستخدم"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              كلمة المرور
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c58a08] py-3 font-bold text-white transition hover:bg-[#a66f00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

      </div>
    </main>
  );
}