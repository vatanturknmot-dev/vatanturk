"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "telegram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "other";

type SocialLink = {
  id: number;
  platform: SocialPlatform;
  title: string;
  url: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

type ErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📸",
  telegram: "✈️",
  tiktok: "🎵",
  youtube: "▶️",
  linkedin: "💼",
  x: "𝕏",
  other: "🌐",
};

const platformNames: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  telegram: "Telegram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  other: "رابط آخر",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const currentError = error as ErrorLike;

    const messages = [
      currentError.message,
      currentError.details,
      currentError.hint,
      currentError.code ? `رمز الخطأ: ${currentError.code}` : "",
    ].filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "حدث خطأ غير معروف.";
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("social_links")
        .select(
          "id, platform, title, url, is_active, display_order, created_at, updated_at"
        )
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      const loadedLinks: SocialLink[] = (data ?? []).map((link) => ({
        id: Number(link.id),
        platform: link.platform as SocialPlatform,
        title:
          link.title ||
          platformNames[link.platform as SocialPlatform] ||
          link.platform,
        url: link.url ?? "",
        is_active: link.is_active ?? true,
        display_order: link.display_order ?? 0,
        created_at: link.created_at,
        updated_at: link.updated_at,
      }));

      setLinks(loadedLinks);
    } catch (error) {
      console.error("خطأ في تحميل روابط التواصل:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  function updateLink(
    id: number,
    field: "title" | "url" | "is_active",
    value: string | boolean
  ) {
    setLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              [field]: value,
            }
          : link
      )
    );

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const invalidLink = links.find(
      (link) => link.url.trim() && !isValidUrl(link.url)
    );

    if (invalidLink) {
      setErrorMessage(
        `الرابط المكتوب في ${invalidLink.title || invalidLink.platform} غير صحيح. يجب أن يبدأ بـ http:// أو https://`
      );
      return;
    }

    setSaving(true);

    try {
      const updates = links.map((link) =>
        supabase
          .from("social_links")
          .update({
            title:
              link.title.trim() ||
              platformNames[link.platform] ||
              link.platform,
            url: link.url.trim(),
            is_active: link.is_active,
            display_order: link.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.id)
      );

      const results = await Promise.all(updates);

      const failedResult = results.find((result) => result.error);

      if (failedResult?.error) {
        throw failedResult.error;
      }

      setSuccessMessage("تم حفظ روابط وسائل التواصل بنجاح.");

      await loadLinks();
    } catch (error) {
      console.error("خطأ في حفظ روابط التواصل:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div dir="rtl" className="text-[#04153f]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#04153f]">
          وسائل التواصل الاجتماعي
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          أضف روابط صفحات VATAN TURK وحدد الروابط التي تريد إظهارها في الموقع.
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">تعذر تنفيذ العملية</p>
          <p className="mt-1 break-words text-sm">{errorMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-gray-200">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#c58a08]" />

            <p className="mt-4 font-medium text-gray-600">
              جاري تحميل روابط التواصل...
            </p>
          </div>
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center">
          <div className="text-5xl">🌐</div>

          <p className="mt-4 font-bold text-[#04153f]">
            لا توجد روابط في جدول social_links
          </p>

          <p className="mt-2 text-sm text-gray-500">
            تأكد من إضافة المنصات إلى الجدول في Supabase.
          </p>

          <button
            type="button"
            onClick={loadLinks}
            className="mt-5 rounded-xl bg-[#04153f] px-6 py-3 font-bold text-white transition hover:bg-[#09245e]"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="grid gap-5">
            {links.map((link) => (
              <div
                key={link.id}
                className={`rounded-2xl border p-5 transition ${
                  link.is_active
                    ? "border-gray-200 bg-white"
                    : "border-gray-200 bg-gray-50 opacity-75"
                }`}
              >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#04153f] text-xl text-white">
                      {platformIcons[link.platform] || "🌐"}
                    </div>

                    <div>
                      <h3 className="font-bold text-[#04153f]">
                        {platformNames[link.platform] || link.platform}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        ترتيب العرض: {link.display_order}
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        link.is_active
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {link.is_active ? "ظاهر في الموقع" : "مخفي"}
                    </span>

                    <input
                      type="checkbox"
                      checked={link.is_active}
                      onChange={(event) =>
                        updateLink(
                          link.id,
                          "is_active",
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 cursor-pointer accent-[#c58a08]"
                    />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
                  <div>
                    <label
                      htmlFor={`social-title-${link.id}`}
                      className="mb-2 block font-bold text-[#04153f]"
                    >
                      اسم المنصة
                    </label>

                    <input
                      id={`social-title-${link.id}`}
                      type="text"
                      value={link.title}
                      onChange={(event) =>
                        updateLink(link.id, "title", event.target.value)
                      }
                      placeholder={
                        platformNames[link.platform] || "اسم المنصة"
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] outline-none transition placeholder:text-gray-400 focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`social-url-${link.id}`}
                      className="mb-2 block font-bold text-[#04153f]"
                    >
                      رابط الصفحة
                    </label>

                    <input
                      id={`social-url-${link.id}`}
                      type="url"
                      dir="ltr"
                      value={link.url}
                      onChange={(event) =>
                        updateLink(link.id, "url", event.target.value)
                      }
                      placeholder={`https://${link.platform}.com/...`}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-[#04153f] outline-none transition placeholder:text-gray-400 focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                    />
                  </div>
                </div>

                {link.url.trim() && isValidUrl(link.url) && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c58a08] hover:underline"
                  >
                    فتح الرابط في نافذة جديدة
                    <span>↗</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#c58a08] px-8 py-3 font-bold text-white transition hover:bg-[#a97407] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "جاري حفظ الروابط..." : "حفظ جميع الروابط"}
            </button>

            <button
              type="button"
              onClick={loadLinks}
              disabled={saving}
              className="rounded-xl border border-[#04153f] bg-white px-8 py-3 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white disabled:opacity-60"
            >
              إعادة تحميل البيانات
            </button>
          </div>
        </form>
      )}
    </div>
  );
}