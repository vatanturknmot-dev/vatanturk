"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaBookOpen,
  FaGlobe,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaSearch,
  FaUniversity,
} from "react-icons/fa";

type UniversityType = "حكومية" | "خاصة";
type ApplicationStatus = "مفتوح" | "قريبًا" | "مغلق";
type StudyLanguage = "العربية" | "التركية" | "الإنجليزية";

type University = {
  id: number;
  slug: string;
  name: string;
  englishName: string;
  city: string;
  type: UniversityType;
  languages: StudyLanguage[];
  programs: number;
  tuition: string;
  applicationStatus: ApplicationStatus;
  featured: boolean;
};

const universities: University[] = [
  {
    id: 1,
    slug: "istanbul-university",
    name: "جامعة إسطنبول",
    englishName: "Istanbul University",
    city: "إسطنبول",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 180,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
  {
    id: 2,
    slug: "istanbul-medipol-university",
    name: "جامعة إسطنبول ميديبول",
    englishName: "Istanbul Medipol University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 95,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
  {
    id: 3,
    slug: "ankara-university",
    name: "جامعة أنقرة",
    englishName: "Ankara University",
    city: "أنقرة",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية"],
    programs: 150,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "قريبًا",
    featured: false,
  },
  {
    id: 4,
    slug: "bahcesehir-university",
    name: "جامعة بهتشه شهير",
    englishName: "Bahçeşehir University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["الإنجليزية", "التركية", "العربية"],
    programs: 80,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
  {
    id: 5,
    slug: "gazi-university",
    name: "جامعة غازي",
    englishName: "Gazi University",
    city: "أنقرة",
    type: "حكومية",
    languages: ["التركية"],
    programs: 130,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "قريبًا",
    featured: false,
  },
  {
    id: 6,
    slug: "istinye-university",
    name: "جامعة إستينيا",
    englishName: "Istinye University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["الإنجليزية", "التركية", "العربية"],
    programs: 70,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
];

const cities = ["الكل", "إسطنبول", "أنقرة"];
const universityTypes = ["الكل", "حكومية", "خاصة"];
const studyLanguages = ["الكل", "العربية", "التركية", "الإنجليزية"];

function getStatusClasses(status: ApplicationStatus) {
  if (status === "مفتوح") {
    return "bg-emerald-500 text-white";
  }

  if (status === "قريبًا") {
    return "bg-amber-400 text-[#04153f]";
  }

  return "bg-red-500 text-white";
}

export default function Universities() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedLanguage, setSelectedLanguage] = useState("الكل");

  const filteredUniversities = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return universities.filter((university) => {
      const matchesSearch =
        university.name.toLowerCase().includes(searchValue) ||
        university.englishName.toLowerCase().includes(searchValue);

      const matchesCity =
        selectedCity === "الكل" || university.city === selectedCity;

      const matchesType =
        selectedType === "الكل" || university.type === selectedType;

      const matchesLanguage =
        selectedLanguage === "الكل" ||
        university.languages.includes(selectedLanguage as StudyLanguage);

      return (
        matchesSearch &&
        matchesCity &&
        matchesType &&
        matchesLanguage
      );
    });
  }, [search, selectedCity, selectedType, selectedLanguage]);

  function resetFilters() {
    setSearch("");
    setSelectedCity("الكل");
    setSelectedType("الكل");
    setSelectedLanguage("الكل");
  }

  return (
    <section
      id="universities"
      dir="rtl"
      className="relative overflow-hidden bg-[#f7f8fb] py-24"
    >
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#c58a08]/10 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-[#04153f]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c58a08]/20 bg-[#c58a08]/10 px-5 py-2 text-sm font-bold text-[#9a6b00]">
            <FaUniversity />
            دليلك للدراسة في تركيا
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight text-[#04153f] md:text-5xl">
            اكتشف الجامعة المناسبة لمستقبلك
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            ابحث وقارن بين الجامعات الحكومية والخاصة، وتعرّف على التخصصات
            ولغات الدراسة وحالة التقديم.
          </p>
        </div>

        <div className="mb-12 rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/60">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="relative">
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث باسم الجامعة..."
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pr-12 pl-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:bg-white focus:ring-4 focus:ring-[#c58a08]/10"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "الكل" ? "جميع الولايات" : city}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
            >
              {universityTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "الكل" ? "نوع الجامعة" : `جامعة ${type}`}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
              className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
            >
              {studyLanguages.map((language) => (
                <option key={language} value={language}>
                  {language === "الكل" ? "لغة الدراسة" : language}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            تم العثور على{" "}
            <span className="font-black text-[#04153f]">
              {filteredUniversities.length}
            </span>{" "}
            جامعة
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-[#04153f] transition hover:border-[#c58a08] hover:text-[#c58a08]"
          >
            إعادة ضبط البحث
          </button>
        </div>

        {filteredUniversities.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredUniversities.map((university) => (
              <article
                key={university.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/60 transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88]">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white" />
                    <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white" />
                  </div>

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <FaUniversity className="text-5xl text-[#d89a00]" />
                  </div>

                  <span
                    className={`absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-bold shadow-lg ${getStatusClasses(
                      university.applicationStatus,
                    )}`}
                  >
                    التقديم {university.applicationStatus}
                  </span>

                  <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                    جامعة {university.type}
                  </span>

                  {university.featured && (
                    <span className="absolute bottom-5 right-5 rounded-full bg-[#c58a08] px-4 py-2 text-xs font-bold text-white">
                      مميزة
                    </span>
                  )}
                </div>

                <div className="p-7">
                  <p className="text-sm font-bold text-[#c58a08]">
                    {university.englishName}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-[#04153f]">
                    {university.name}
                  </h3>

                  <div className="mt-5 flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-[#c58a08]" />
                    <span>{university.city}، تركيا</span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <FaGraduationCap className="text-[#c58a08]" />
                        التخصصات
                      </div>

                      <p className="font-black text-[#04153f]">
                        {university.programs}+ برنامج
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <FaGlobe className="text-[#c58a08]" />
                        لغة الدراسة
                      </div>

                      <p className="line-clamp-1 font-black text-[#04153f]">
                        {university.languages.join("، ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#04153f]/5 bg-[#04153f]/5 p-4">
                    <span className="text-sm text-gray-500">
                      الرسوم الدراسية
                    </span>

                    <span className="font-black text-[#04153f]">
                      {university.tuition}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href={`/universities/${university.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#04153f] px-4 py-3 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white"
                    >
                      <FaBookOpen />
                      التفاصيل
                    </Link>

                    <Link
                      href={`/apply?university=${university.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#c58a08] px-4 py-3 font-bold text-white shadow-lg shadow-[#c58a08]/20 transition hover:-translate-y-0.5 hover:bg-[#a66f00]"
                    >
                      قدم الآن
                      <FaArrowLeft />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <FaSearch className="mx-auto text-5xl text-gray-300" />

            <h3 className="mt-5 text-2xl font-black text-[#04153f]">
              لم نعثر على جامعة مطابقة
            </h3>

            <p className="mt-2 text-gray-500">
              غيّر اسم البحث أو خيارات التصفية ثم حاول مرة أخرى.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-[#04153f] px-6 py-3 font-bold text-white transition hover:bg-[#09245e]"
            >
              عرض جميع الجامعات
            </button>
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/universities"
            className="inline-flex items-center gap-3 rounded-2xl bg-[#04153f] px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#09245e]"
          >
            استكشف جميع الجامعات
            <FaArrowLeft className="text-[#c58a08]" />
          </Link>
        </div>
      </div>
    </section>
  );
}