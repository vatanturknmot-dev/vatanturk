"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaGraduationCap,
  FaPhoneAlt,
  FaUniversity,
  FaUser,
} from "react-icons/fa";

const universityNames: Record<string, string> = {
  "istanbul-university": "جامعة إسطنبول",
  "istanbul-medipol-university": "جامعة إسطنبول ميديبول",
  "ankara-university": "جامعة أنقرة",
  "bahcesehir-university": "جامعة بهتشه شهير",
  "gazi-university": "جامعة غازي",
  "istinye-university": "جامعة إستينيا",
  "marmara-university": "جامعة مرمرة",
  "altinbas-university": "جامعة ألتن باش",
  "yeditepe-university": "جامعة يدي تبه",
  "hacettepe-university": "جامعة حجة تبه",
  "atilim-university": "جامعة أتيليم",
  "ankara-medipol-university": "جامعة أنقرة ميديبول",
};

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <ApplyContent />
    </Suspense>
  );
}

function ApplyContent() {
  const searchParams = useSearchParams();
  const universitySlug = searchParams.get("university") ?? "";

  const selectedUniversity =
    universityNames[universitySlug] ?? "لم يتم اختيار جامعة";

  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const nationality = String(formData.get("nationality") ?? "").trim();
    const specialization = String(
      formData.get("specialization") ?? ""
    ).trim();
    const notes = String(formData.get("message") ?? "").trim();

    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          nationality,
          university: selectedUniversity,
          specialization,
          notes,
          status: "new",
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase registration error:", error);
      setSubmitError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
      return;
    }

    setApplicationId(data.id);
    setSubmittedPhone(phone);
    form.reset();
    setSubmitted(true);
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-6 py-20"
      >
        <div className="w-full max-w-2xl rounded-[36px] border border-gray-100 bg-white p-10 text-center shadow-2xl shadow-gray-300/40">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <FaCheckCircle className="text-5xl text-emerald-500" />
          </div>

          <h1 className="mt-7 text-3xl font-black text-[#04153f] md:text-4xl">
            تم استلام طلبك بنجاح
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-600">
            شكرًا لتواصلك معنا. سيقوم أحد مستشارينا بمراجعة معلوماتك
            والتواصل معك في أقرب وقت ممكن.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#04153f]/5 p-5">
              <p className="text-sm text-gray-500">رقم متابعة الطلب</p>
              <p className="mt-2 text-2xl font-black tracking-wide text-[#04153f]">
                {applicationId
                  ? `VT-2026-${String(applicationId).padStart(6, "0")}`
                  : "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#04153f]/5 p-5">
              <p className="text-sm text-gray-500">الجامعة المختارة</p>
              <p className="mt-2 text-xl font-black text-[#04153f]">
                {selectedUniversity}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-900">
            احتفظ برقم الطلب ورقم الهاتف الذي سجلت به:
            <span dir="ltr" className="mx-1 inline-block">
              {submittedPhone}
            </span>
            لمتابعة حالة طلبك لاحقًا.
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/application-status"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-8 py-4 font-bold text-white transition hover:bg-[#a66f00]"
            >
              متابعة حالة الطلب
              <FaCheckCircle />
            </Link>

            <Link
              href="/universities"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#04153f] px-8 py-4 font-bold text-white transition hover:bg-[#09245e]"
            >
              العودة إلى الجامعات
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fb]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88] pb-28 pt-24 text-white">
        <div className="absolute -right-24 top-8 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"
          >
            <FaArrowRight />
            العودة إلى الجامعات
          </Link>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-md">
              <FaGraduationCap className="text-[#e4a514]" />
              طلب تقديم جامعي
            </span>

            <h1 className="mt-6 text-4xl font-black md:text-6xl">
              ابدأ رحلتك الجامعية معنا
            </h1>

            <p className="mt-5 text-lg leading-8 text-white/75">
              أدخل معلوماتك، وسيتواصل معك فريق VATAN TURK لمساعدتك في
              اختيار الجامعة والتخصص المناسبين.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-6 pb-24">
        <div className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-2xl shadow-gray-300/40">
          <div className="border-b border-gray-100 bg-[#04153f]/5 px-7 py-6 md:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#c58a08]">
                  الجامعة المختارة
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#04153f]">
                  {selectedUniversity}
                </h2>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#04153f]">
                <FaUniversity className="text-3xl text-[#e4a514]" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  الاسم الكامل
                </label>

                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7896]" />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="اكتب اسمك الكامل"
                    className="h-14 w-full rounded-2xl border border-gray-300 bg-white pr-11 pl-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  رقم الهاتف
                </label>

                <div className="relative">
                  <FaPhoneAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7896]" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+90 5XX XXX XX XX"
                    className="h-14 w-full rounded-2xl border border-gray-300 bg-white pr-11 pl-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7896]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="h-14 w-full rounded-2xl border border-gray-300 bg-white pr-11 pl-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nationality"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  الجنسية
                </label>

                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  required
                  placeholder="اكتب جنسيتك"
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="degree"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  المرحلة الدراسية
                </label>

                <select
                  id="degree"
                  name="degree"
                  required
                  defaultValue=""
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                >
                  <option value="" disabled>
                    اختر المرحلة الدراسية
                  </option>
                  <option value="bachelor">بكالوريوس</option>
                  <option value="master">ماجستير</option>
                  <option value="phd">دكتوراه</option>
                  <option value="language">معهد لغة</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="specialization"
                  className="mb-2 block text-base font-black text-[#04153f]"
                >
                  التخصص المطلوب
                </label>

                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  required
                  placeholder="مثال: الطب، الهندسة، إدارة الأعمال"
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="message"
                className="mb-2 block text-base font-black text-[#04153f]"
              >
                ملاحظات إضافية
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="اكتب أي معلومات أو استفسارات إضافية..."
                className="w-full resize-none rounded-2xl border border-gray-300 bg-white p-4 text-lg font-semibold text-[#04153f] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/20"
              />
            </div>

            {submitError && (
              <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center font-bold text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-8 py-4 text-lg font-black text-white shadow-xl shadow-[#c58a08]/20 transition hover:-translate-y-1 hover:bg-[#a66f00] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "جارٍ إرسال الطلب..." : "إرسال طلب التقديم"}
              <FaGraduationCap />
            </button>

            <p className="mt-4 text-center text-sm leading-6 text-gray-500">
              بإرسال الطلب، أنت توافق على تواصل فريق VATAN TURK معك لتقديم
              الاستشارة التعليمية.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}