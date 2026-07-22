"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";

type ApplicationStatus = "new" | "reviewing" | "accepted" | "rejected";

type ApplicationResult = {
  id: number;
  full_name: string;
  university: string | null;
  specialization: string | null;
  status: ApplicationStatus | null;
  created_at: string;
};

const statusInfo: Record<
  ApplicationStatus,
  {
    title: string;
    description: string;
    className: string;
    icon: typeof FaClock;
  }
> = {
  new: {
    title: "تم استلام الطلب",
    description: "طلبك وصل إلينا بنجاح وينتظر بدء المراجعة.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: FaClock,
  },
  reviewing: {
    title: "الطلب قيد المراجعة",
    description: "يقوم فريقنا حاليًا بمراجعة معلوماتك وسنتواصل معك قريبًا.",
    className: "border-blue-200 bg-blue-50 text-blue-800",
    icon: FaHourglassHalf,
  },
  accepted: {
    title: "تم قبول الطلب",
    description: "تهانينا، تم قبول طلبك. سيتواصل معك فريق VATAN TURK لاستكمال الإجراءات.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: FaCheckCircle,
  },
  rejected: {
    title: "لم يتم قبول الطلب",
    description: "نأسف، لم يتم قبول الطلب في وضعه الحالي. يمكنك التواصل معنا لمعرفة التفاصيل والخيارات البديلة.",
    className: "border-red-200 bg-red-50 text-red-800",
    icon: FaTimesCircle,
  },
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function parseApplicationId(value: string) {
  const cleaned = value.trim().toUpperCase();

  if (/^\d+$/.test(cleaned)) {
    return Number(cleaned);
  }

  const match = cleaned.match(/^VT-\d{4}-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function normalizeStatus(status: ApplicationResult["status"]): ApplicationStatus {
  if (
    status === "reviewing" ||
    status === "accepted" ||
    status === "rejected"
  ) {
    return status;
  }

  return "new";
}

export default function ApplicationStatusPage() {
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const applicationCode = String(
      formData.get("applicationCode") ?? ""
    ).trim();
    const phone = String(formData.get("phone") ?? "").trim();

    const applicationId = parseApplicationId(applicationCode);

    setResult(null);
    setErrorMessage("");

    if (!applicationId) {
      setErrorMessage(
        "رقم الطلب غير صحيح. مثال: VT-2026-000123"
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select(
        "id, full_name, phone, university, specialization, status, created_at"
      )
      .eq("id", applicationId)
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error("Application status lookup error:", error);
      setErrorMessage("تعذر التحقق من الطلب الآن. حاول مرة أخرى.");
      return;
    }

    if (!data || normalizePhone(data.phone ?? "") !== normalizePhone(phone)) {
      setErrorMessage("لم يتم العثور على طلب مطابق لرقم الطلب ورقم الهاتف.");
      return;
    }

    setResult({
      id: data.id,
      full_name: data.full_name,
      university: data.university,
      specialization: data.specialization,
      status: data.status,
      created_at: data.created_at,
    });
  }

  const currentStatus = result ? normalizeStatus(result.status) : null;
  const currentStatusInfo = currentStatus
    ? statusInfo[currentStatus]
    : null;
  const StatusIcon = currentStatusInfo?.icon;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f8fb] px-5 py-14 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-[#04153f] transition hover:text-[#c58a08]"
        >
          <FaArrowRight />
          العودة إلى الرئيسية
        </Link>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-gray-300/30">
          <div className="bg-[#04153f] px-6 py-10 text-center text-white sm:px-10">
            <h1 className="text-3xl font-black sm:text-4xl">
              متابعة حالة الطلب
            </h1>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-white/75">
              أدخل رقم الطلب ورقم الهاتف المستخدم أثناء التسجيل لمعرفة آخر تحديث.
            </p>
          </div>

          <form onSubmit={handleSearch} className="p-6 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="applicationCode"
                  className="mb-2 block font-black text-[#04153f]"
                >
                  رقم الطلب
                </label>

                <input
                  id="applicationCode"
                  name="applicationCode"
                  required
                  placeholder="VT-2026-000123"
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-lg font-bold text-[#04153f] placeholder:text-gray-400 outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-black text-[#04153f]"
                >
                  رقم الهاتف
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+90 5XX XXX XX XX"
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-lg font-bold text-[#04153f] placeholder:text-gray-400 outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-6 text-lg font-black text-white transition hover:bg-[#a66f00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSearch />
              {loading ? "جارٍ التحقق..." : "عرض حالة الطلب"}
            </button>
          </form>

          {result && currentStatusInfo && StatusIcon && (
            <div className="border-t border-gray-100 p-6 sm:p-10">
              <div
                className={`rounded-3xl border p-6 text-center ${currentStatusInfo.className}`}
              >
                <StatusIcon className="mx-auto text-5xl" />

                <h2 className="mt-4 text-2xl font-black">
                  {currentStatusInfo.title}
                </h2>

                <p className="mx-auto mt-3 max-w-xl leading-7">
                  {currentStatusInfo.description}
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoItem label="اسم الطالب" value={result.full_name} />

                <InfoItem
                  label="رقم الطلب"
                  value={`VT-2026-${String(result.id).padStart(6, "0")}`}
                />

                <InfoItem
                  label="الجامعة"
                  value={result.university || "لم يتم اختيار جامعة"}
                />

                <InfoItem
                  label="التخصص"
                  value={result.specialization || "غير محدد"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-2 break-words font-black text-[#04153f]">
        {value}
      </p>
    </div>
  );
}