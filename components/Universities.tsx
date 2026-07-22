"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaBuildingColumns,
  FaLocationDot,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

type University = {
  id: number;
  name_ar: string;
  name_tr: string;
  slug: string;
  city: string;
  university_type: "private" | "public";
  short_description: string;
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

function getPublicAssetUrl(path: string): string {
  if (!path) return "";

  const { data } = supabase.storage
    .from("universities")
    .getPublicUrl(path);

  return data.publicUrl;
}

function formatTuition(
  min: number | null,
  max: number | null,
  currency: string
) {
  const formatter = new Intl.NumberFormat("ar", {
    maximumFractionDigits: 0,
  });

  if (min !== null && max !== null) {
    return `${formatter.format(min)} - ${formatter.format(max)} ${currency}`;
  }

  if (min !== null) {
    return `تبدأ من ${formatter.format(min)} ${currency}`;
  }

  if (max !== null) {
    return `حتى ${formatter.format(max)} ${currency}`;
  }

  return "تواصل معنا لمعرفة الرسوم";
}

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("universities")
      .select(`
        id,
        name_ar,
        name_tr,
        slug,
        city,
        university_type,
        short_description,
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
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("تعذر تحميل الجامعات:", error);
      setErrorMessage(error.message);
      setUniversities([]);
    } else {
      setUniversities((data ?? []) as University[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUniversities();

    const channel = supabase
      .channel("public-universities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "universities",
        },
        () => {
          fetchUniversities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUniversities]);

  return (
    <section
      id="universities"
      dir="rtl"
      className="bg-[#f7f8fb] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c58a08]/10 px-4 py-2 text-sm font-black text-[#a97407]">
            <FaBuildingColumns />
            الجامعات
          </span>

          <h2 className="mt-5 text-3xl font-black text-[#04153f] sm:text-4xl">
            اكتشف الجامعات المتاحة
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            اختر الجامعة المناسبة واطّلع على المدينة والرسوم ومعلومات التقديم.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="font-black">تعذر تحميل الجامعات</p>
            <p className="mt-2 text-sm">{errorMessage}</p>

            <button
              type="button"
              onClick={fetchUniversities}
              className="mt-5 rounded-xl bg-[#04153f] px-6 py-3 font-bold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <FaBuildingColumns className="mx-auto text-6xl text-gray-300" />
            <h3 className="mt-5 text-xl font-black text-[#04153f]">
              لا توجد جامعات متاحة حاليًا
            </h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {universities.map((university) => {
              const image =
                university.image_url ||
                getPublicAssetUrl(university.image_storage_path);

              const logo =
                university.logo_url ||
                getPublicAssetUrl(university.logo_storage_path);

              return (
                <article
                  key={university.id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={university.name_ar}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FaBuildingColumns className="text-6xl text-gray-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#04153f]/70 via-transparent to-transparent" />

                    {university.is_featured && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#c58a08] px-3 py-2 text-xs font-black text-white shadow">
                        <FaStar />
                        جامعة مميزة
                      </span>
                    )}

                    <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-[#04153f] shadow">
                      {university.university_type === "public"
                        ? "جامعة حكومية"
                        : "جامعة خاصة"}
                    </span>

                    {logo && (
                      <div className="absolute -bottom-0 left-4 flex h-16 w-16 translate-y-1/2 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-1 shadow-lg">
                        <img
                          src={logo}
                          alt={`شعار ${university.name_ar}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-10">
                    <h3 className="text-xl font-black text-[#04153f]">
                      {university.name_ar}
                    </h3>

                    {university.name_tr && (
                      <p dir="ltr" className="mt-1 text-right text-sm text-gray-500">
                        {university.name_tr}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-gray-600">
                      {university.city && (
                        <span className="inline-flex items-center gap-2">
                          <FaLocationDot className="text-[#c58a08]" />
                          {university.city}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#c58a08]" />
                        {formatTuition(
                          university.tuition_min,
                          university.tuition_max,
                          university.currency || "USD"
                        )}
                      </span>
                    </div>

                    {university.short_description && (
                      <p className="mt-5 line-clamp-3 leading-7 text-gray-600">
                        {university.short_description}
                      </p>
                    )}

                    <div className="mt-6 flex gap-3">
                      {university.slug && (
                        <a
                          href={`/universities/${university.slug}`}
                          className="flex-1 rounded-xl bg-[#04153f] px-5 py-3 text-center font-black text-white transition hover:bg-[#09245e]"
                        >
                          عرض التفاصيل
                        </a>
                      )}

                      {university.application_url && (
                        <a
                          href={university.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-xl bg-[#c58a08] px-5 py-3 text-center font-black text-white transition hover:bg-[#e4a514]"
                        >
                          قدّم الآن
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}