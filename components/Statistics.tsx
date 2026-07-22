"use client";

import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaUniversity,
  FaGlobeAsia,
  FaFileAlt,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type StatisticsData = {
  students: number;
  universities: number;
  countries: number;
  applications: number;
};

export default function Statistics() {
  const [statistics, setStatistics] = useState<StatisticsData>({
    students: 0,
    universities: 0,
    countries: 0,
    applications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("registrations")
          .select("id, nationality, university");

        if (error) {
          console.error("حدث خطأ أثناء جلب الإحصائيات:", error.message);
          return;
        }

        const registrations = data ?? [];

        const uniqueUniversities = new Set(
          registrations
            .map((item) => item.university?.trim())
            .filter(Boolean)
        );

        const uniqueCountries = new Set(
          registrations
            .map((item) => item.nationality?.trim())
            .filter(Boolean)
        );

        setStatistics({
          students: registrations.length,
          universities: uniqueUniversities.size,
          countries: uniqueCountries.size,
          applications: registrations.length,
        });
      } catch (error) {
        console.error("حدث خطأ غير متوقع:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();

    const channel = supabase
      .channel("homepage-statistics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = [
    {
      icon: FaUserGraduate,
      number: statistics.students,
      title: "طالب مسجل",
    },
    {
      icon: FaUniversity,
      number: statistics.universities,
      title: "جامعة مختارة",
    },
    {
      icon: FaGlobeAsia,
      number: statistics.countries,
      title: "دولة",
    },
    {
      icon: FaFileAlt,
      number: statistics.applications,
      title: "طلب تسجيل",
    },
  ];

  return (
    <section className="bg-[#04153f] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            إنجازات وطن ترك
          </h2>

          <p className="mt-4 text-lg text-gray-300">
            نفتخر بثقة عملائنا ونسعى دائمًا لتقديم أفضل الخدمات.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white p-8 text-center shadow-xl transition duration-300 hover:-translate-y-2"
              >
                <div className="mb-5 flex justify-center">
                  <Icon className="text-[#c58a08]" size={42} />
                </div>

                <h3 className="text-5xl font-bold text-[#04153f]">
                  {loading ? (
                    <span className="inline-block h-12 w-24 animate-pulse rounded-lg bg-gray-200" />
                  ) : (
                    `${item.number}+`
                  )}
                </h3>

                <p className="mt-3 text-lg font-medium text-gray-600">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}