"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaFileAlt,
  FaGlobe,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";

type University = {
  id: number;
  slug: string;
  name_ar: string;
  name_tr: string;
  city: string;
  university_type: "private" | "public";
  short_description: string;
  description: string;
  image_url: string;
  image_storage_path: string;
  logo_url: string;
  logo_storage_path: string;
  tuition_min: number | null;
  tuition_max: number | null;
  currency: string;
  application_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

function getPublicAssetUrl(path: string) {
  if (!path) return "";

  const { data } = supabase.storage
    .from("universities")
    .getPublicUrl(path);

  return data.publicUrl;
}

function formatTuition(university: University) {
  const formatter = new Intl.NumberFormat("ar", {
    maximumFractionDigits: 0,
  });

  const currency = university.currency || "USD";
  const min = university.tuition_min;
  const max = university.tuition_max;

  if (min !== null && max !== null) {
    return `${formatter.format(min)} - ${formatter.format(max)} ${currency}`;
  }

  if (min !== null) {
    return `تبدأ من ${formatter.format(min)} ${currency}`;
  }

  if (max !== null) {
    return `حتى ${formatter.format(max)} ${currency}`;
  }

  return "تُحدّد حسب التخصص";
}

const defaultRequirements = [
  "شهادة الثانوية العامة",
  "كشف علامات الثانوية",
  "جواز سفر ساري المفعول",
  "متطلبات إضافية حسب التخصص والجامعة",
];

const defaultDocuments = [
  "صورة عن جواز السفر",
  "صورة شخصية",
  "شهادة الثانوية",
  "كشف العلامات",
];

export default function UniversityDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => {
    const value = params?.slug;
    return Array.isArray(value) ? value[0] : value;
  }, [params]);

  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUniversity = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setNotFound(false);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("universities")
      .select(`
        id,
        slug,
        name_ar,
        name_tr,
        city,
        university_type,
        short_description,
        description,
        image_url,
        image_storage_path,
        logo_url,
        logo_storage_path,
        tuition_min,
        tuition_max,
        currency,
        application_url,
        is_featured,
        is_active,
        display_order
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("تعذر تحميل الجامعة:", error);
      setErrorMessage(error.message);
      setUniversity(null);
    } else if (!data) {
      setNotFound(true);
      setUniversity(null);
    } else {
      setUniversity(data as University);
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-6"
      >
        <div className="w-full max-w-xl animate-pulse rounded-3xl bg-white p-10 shadow-xl">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gray-200" />
          <div className="mx-auto mt-8 h-10 w-2/3 rounded-xl bg-gray-200" />
          <div className="mx-auto mt-4 h-5 w-1/2 rounded-lg bg-gray-100" />
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-6"
      >
        <div className="max-w-xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl">
          <FaUniversity className="mx-auto text-6xl text-red-300" />

          <h1 className="mt-6 text-3xl font-black text-[#04153f]">
            تعذر تحميل الجامعة
          </h1>

          <p className="mt-4 text-red-600">{errorMessage}</p>

          <button
            type="button"
            onClick={fetchUniversity}
            className="mt-7 rounded-2xl bg-[#04153f] px-7 py-4 font-bold text-white"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  if (notFound || !university) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-6"
      >
        <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <FaUniversity className="mx-auto text-6xl text-gray-300" />

          <h1 className="mt-6 text-3xl font-black text-[#04153f]">
            الجامعة غير موجودة
          </h1>

          <p className="mt-4 text-gray-500">
            لم نجد معلومات لهذه الجامعة.
          </p>

          <Link
            href="/universities"
            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#04153f] px-7 py-4 font-bold text-white"
          >
            العودة إلى الجامعات
            <FaArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  const image =
    university.image_url ||
    getPublicAssetUrl(university.image_storage_path);

  const logo =
    university.logo_url ||
    getPublicAssetUrl(university.logo_storage_path);

  const universityType =
    university.university_type === "public" ? "حكومية" : "خاصة";

  const description =
    university.description ||
    university.short_description ||
    "سيتم إضافة معلومات تفصيلية عن الجامعة قريبًا.";

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fb]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88] pb-24 pt-24 text-white">
        {image && (
          <>
            <img
              src={image}
              alt={university.name_ar}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#04153f]/85" />
          </>
        )}

        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 font-bold text-white/80 transition hover:text-white"
          >
            <FaArrowRight />
            العودة إلى الجامعات
          </Link>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex rounded-full bg-[#c58a08] px-5 py-2 text-sm font-bold">
                  جامعة {universityType}
                </span>

                {university.is_featured && (
                  <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur-md">
                    جامعة مميزة
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black md:text-6xl">
                {university.name_ar}
              </h1>

              {university.name_tr && (
                <p dir="ltr" className="mt-3 text-right text-xl text-[#e4a514]">
                  {university.name_tr}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-4">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3">
                  <FaMapMarkerAlt className="text-[#e4a514]" />
                  {university.city
                    ? `${university.city}، تركيا`
                    : "تركيا"}
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3">
                  <FaCalendarAlt className="text-[#e4a514]" />
                  التقديم متاح
                </span>
              </div>
            </div>

            <div className="flex h-72 items-center justify-center overflow-hidden rounded-[36px] border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              {logo ? (
                <img
                  src={logo}
                  alt={`شعار ${university.name_ar}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <FaUniversity className="text-8xl text-[#e4a514]" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-3xl font-black text-[#04153f]">
                نبذة عن الجامعة
              </h2>

              <p className="mt-5 whitespace-pre-line text-lg leading-9 text-gray-600">
                {description}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-3xl text-[#c58a08]" />

                <h2 className="text-3xl font-black text-[#04153f]">
                  شروط القبول العامة
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {defaultRequirements.map((requirement) => (
                  <div
                    key={requirement}
                    className="flex items-center gap-3"
                  >
                    <FaCheckCircle className="shrink-0 text-emerald-500" />
                    <span className="text-gray-600">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-3xl text-[#c58a08]" />

                <h2 className="text-3xl font-black text-[#04153f]">
                  الأوراق المطلوبة
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {defaultDocuments.map((document) => (
                  <div
                    key={document}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
                  >
                    <FaCheckCircle className="shrink-0 text-emerald-500" />
                    <span className="text-gray-600">{document}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-3xl bg-white p-7 shadow-xl">
              <h3 className="text-2xl font-black text-[#04153f]">
                معلومات الجامعة
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  <FaGlobe className="text-2xl text-[#c58a08]" />

                  <div>
                    <p className="text-sm text-gray-500">الموقع</p>
                    <p className="mt-1 font-bold text-[#04153f]">
                      {university.city || "تركيا"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  <FaMoneyBillWave className="text-2xl text-[#c58a08]" />

                  <div>
                    <p className="text-sm text-gray-500">
                      الرسوم الدراسية
                    </p>
                    <p className="mt-1 font-bold text-[#04153f]">
                      {formatTuition(university)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  <FaUniversity className="text-2xl text-[#c58a08]" />

                  <div>
                    <p className="text-sm text-gray-500">نوع الجامعة</p>
                    <p className="mt-1 font-bold text-[#04153f]">
                      جامعة {universityType}
                    </p>
                  </div>
                </div>
              </div>

              {university.application_url ? (
                <a
                  href={university.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-6 py-4 text-lg font-black text-white transition hover:bg-[#a66f00]"
                >
                  قدم الآن
                  <FaGraduationCap />
                </a>
              ) : (
                <Link
                  href={`/apply?university=${university.slug}`}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-6 py-4 text-lg font-black text-white transition hover:bg-[#a66f00]"
                >
                  قدم الآن
                  <FaGraduationCap />
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}