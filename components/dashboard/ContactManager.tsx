"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ContactMessage = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
            id,
            name,
            email,
            phone,
            subject,
            message,
            is_read,
            created_at
          `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(
        (data ?? []).map((item) => ({
          id: Number(item.id),
          name: item.name ?? "",
          email: item.email ?? null,
          phone: item.phone ?? null,
          subject: item.subject ?? null,
          message: item.message ?? "",
          is_read: Boolean(item.is_read),
          created_at: item.created_at,
        }))
      );
    } catch (error) {
      console.error("خطأ في تحميل الرسائل:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحميل الرسائل."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("dashboard-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages]);

  const unreadCount = useMemo(
    () => messages.filter((item) => !item.is_read).length,
    [messages]
  );

  async function toggleRead(message: ContactMessage) {
    setProcessingId(message.id);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("messages")
        .update({
          is_read: !message.is_read,
        })
        .eq("id", message.id);

      if (error) {
        throw error;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                is_read: !item.is_read,
              }
            : item
        )
      );
    } catch (error) {
      console.error("خطأ في تحديث الرسالة:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحديث حالة الرسالة."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteMessage(id: number) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه الرسالة؟"
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(id);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setMessages((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("خطأ في حذف الرسالة:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر حذف الرسالة."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#c58a08]" />

          <p className="mt-4 font-bold text-[#04153f]">
            جاري تحميل الرسائل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#04153f]">
            رسائل التواصل
          </h2>

          <p className="mt-2 text-gray-600">
            جميع الرسائل: {messages.length} — غير المقروءة:{" "}
            {unreadCount}
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="rounded-xl bg-[#04153f] px-6 py-3 font-bold text-white transition hover:bg-[#09245e]"
        >
          تحديث الرسائل
        </button>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">تعذر تنفيذ العملية</p>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-xl font-black text-[#04153f]">
            لا توجد رسائل حتى الآن
          </p>

          <p className="mt-2 text-gray-500">
            ستظهر هنا الرسائل المرسلة من نموذج التواصل.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition sm:p-6 ${
                item.is_read
                  ? "border-gray-200"
                  : "border-[#c58a08] bg-amber-50/30"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-[#04153f]">
                      {item.subject || "رسالة بدون عنوان"}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        item.is_read
                          ? "bg-gray-100 text-gray-600"
                          : "bg-[#c58a08] text-white"
                      }`}
                    >
                      {item.is_read ? "مقروءة" : "جديدة"}
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-[#04153f]">
                    المرسل: {item.name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="break-all hover:text-[#c58a08]"
                        dir="ltr"
                      >
                        {item.email}
                      </a>
                    )}

                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="hover:text-[#c58a08]"
                        dir="ltr"
                      >
                        {item.phone}
                      </a>
                    )}

                    <span>
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => toggleRead(item)}
                    className="rounded-lg bg-[#04153f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#09245e] disabled:opacity-50"
                  >
                    {item.is_read
                      ? "تحديد كغير مقروءة"
                      : "تحديد كمقروءة"}
                  </button>

                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => deleteMessage(item.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="mt-5 whitespace-pre-wrap rounded-xl bg-[#f7f8fb] p-4 leading-8 text-gray-700">
                {item.message}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ar", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}