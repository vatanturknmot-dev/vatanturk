"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
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
    languages: ["التركية", "الإنجليزية", "العربية"],
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
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 70,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
  {
    id: 7,
    slug: "marmara-university",
    name: "جامعة مرمرة",
    englishName: "Marmara University",
    city: "إسطنبول",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية"],
    programs: 160,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: false,
  },
  {
    id: 8,
    slug: "altinbas-university",
    name: "جامعة ألتن باش",
    englishName: "Altınbaş University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 65,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: true,
  },
  {
    id: 9,
    slug: "yeditepe-university",
    name: "جامعة يدي تبه",
    englishName: "Yeditepe University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية"],
    programs: 85,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: false,
  },
  {
    id: 10,
    slug: "hacettepe-university",
    name: "جامعة حجة تبه",
    englishName: "Hacettepe University",
    city: "أنقرة",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية"],
    programs: 145,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "قريبًا",
    featured: true,
  },
  {
    id: 11,
    slug: "atilim-university",
    name: "جامعة أتيليم",
    englishName: "Atılım University",
    city: "أنقرة",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 60,
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    featured: false,
  },
  {
    id: 12,
    slug: "ankara-medipol-university",
    name: "جامعة أنقرة ميديبول",
    englishName: "Ankara Medipol University",
    city: "أنقرة",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    programs: 55,
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

export default function UniversitiesPage() {
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
        university.languages.includes(
          selectedLanguage as StudyLanguage,
        );

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
    <>
      <Header />

      <main dir="rtl" className="min-h-screen bg-[#f7f8fb]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88] pb-28 pt-36 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 top-10 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -left-32 bottom-[-160px] h-[450px] w-[450px] rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c58a08]/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-md">
                <FaUniversity className="text-[#e4a514]" />
                الجامعات التركية
              </span>

              <h1 className="mt-7 text-4xl font-black leading-tight md:text-6xl">
                ابحث عن الجامعة المناسبة
                <span className="block text-[#e4a514]">
                  لمستقبلك الأكاديمي
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/75">
                استكشف الجامعات التركية الحكومية والخاصة، وقارن
                بين التخصصات ولغات الدراسة وحالة التسجيل.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  جامعات حكومية وخاصة
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  استشارة مجانية
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  متابعة حتى القبول
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-300/40">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
              <div className="relative">
                <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="ابحث باسم الجامعة..."
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pr-12 pl-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:bg-white focus:ring-4 focus:ring-[#c58a08]/10"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(event) =>
                  setSelectedCity(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === "الكل"
                      ? "جميع الولايات"
                      : city}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {universityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "الكل"
                      ? "نوع الجامعة"
                      : `جامعة ${type}`}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(event) =>
                  setSelectedLanguage(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {studyLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language === "الكل"
                      ? "لغة الدراسة"
                      : language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-sm font-bold text-[#c58a08]">
                دليل الجامعات
              </span>

              <h2 className="mt-2 text-3xl font-black text-[#04153f] md:text-4xl">
                جميع الجامعات
              </h2>

              <p className="mt-3 text-gray-500">
                تم العثور على{" "}
                <span className="font-black text-[#04153f]">
                  {filteredUniversities.length}
                </span>{" "}
                جامعة مطابقة لبحثك.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-[#04153f] transition hover:border-[#c58a08] hover:text-[#c58a08]"
            >
              إعادة ضبط البحث
            </button>
          </div>

          {filteredUniversities.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.map((university) => (
                <article
                  key={university.id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88]">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white" />
                      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white" />
                    </div>

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FaUniversity className="text-5xl text-[#e4a514]" />
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
                        جامعة مميزة
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

                        <p
                          className="truncate font-black text-[#04153f]"
                          title={university.languages.join("، ")}
                        >
                          {university.languages.join("، ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#04153f]/5 bg-[#04153f]/5 p-4">
                      <span className="text-sm text-gray-500">
                        الرسوم الدراسية
                      </span>

                      <span className="text-left font-black text-[#04153f]">
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
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <FaSearch className="text-3xl text-gray-400" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#04153f]">
                لم نعثر على جامعة مطابقة
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-500">
                غيّر اسم الجامعة أو المدينة أو نوع الجامعة أو
                لغة الدراسة، ثم حاول مرة أخرى.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-7 rounded-xl bg-[#04153f] px-7 py-3 font-bold text-white transition hover:bg-[#09245e]"
              >
                عرض جميع الجامعات
              </button>
            </div>
          )}
        </section>

        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#04153f] px-7 py-14 text-center text-white md:px-16">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#c58a08]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <FaGraduationCap className="mx-auto text-5xl text-[#e4a514]" />

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                لم تعرف أي جامعة تناسبك؟
              </h2>

              <p className="mt-4 text-lg leading-8 text-white/70">
                تواصل مع مستشارينا للحصول على ترشيحات جامعية
                مناسبة لمعدلك وميزانيتك والتخصص الذي ترغب بدراسته.
              </p>

              <Link
                href="/apply"
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#c58a08] px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#a66f00]"
              >
                احصل على استشارة مجانية
                <FaArrowLeft />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}