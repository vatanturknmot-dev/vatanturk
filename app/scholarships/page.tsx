"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaGlobe,
  FaGraduationCap,
  FaMoneyBillWave,
  FaSearch,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";

type DegreeLevel =
  | "بكالوريوس"
  | "ماجستير"
  | "دكتوراه"
  | "جميع المراحل";

type FundingType =
  | "ممولة بالكامل"
  | "ممولة جزئيًا"
  | "خصم دراسي";

type ScholarshipStatus = "مفتوحة" | "قريبًا" | "مغلقة";

type Scholarship = {
  id: number;
  slug: string;
  title: string;
  organization: string;
  country: string;
  levels: DegreeLevel[];
  funding: FundingType;
  deadline: string;
  status: ScholarshipStatus;
  featured: boolean;
  description: string;
  benefits: string[];
  requirements: string[];
};

const scholarships: Scholarship[] = [
  {
    id: 1,
    slug: "turkiye-burslari",
    title: "منحة الحكومة التركية",
    organization: "Türkiye Bursları",
    country: "تركيا",
    levels: ["بكالوريوس", "ماجستير", "دكتوراه"],
    funding: "ممولة بالكامل",
    deadline: "يُعلن سنويًا",
    status: "قريبًا",
    featured: true,
    description:
      "منحة حكومية مخصصة للطلاب الدوليين، وتوفر فرصًا للدراسة في الجامعات التركية ضمن مراحل البكالوريوس والماجستير والدكتوراه.",
    benefits: [
      "إعفاء من الرسوم الدراسية",
      "راتب شهري",
      "تأمين صحي",
      "سكن طلابي",
      "سنة لتعلم اللغة التركية",
    ],
    requirements: [
      "توفر شهادة دراسية مناسبة للمرحلة المطلوبة",
      "تحقيق المعدل المطلوب حسب البرنامج",
      "تقديم الوثائق ضمن الموعد المحدد",
      "استيفاء شروط العمر المعلنة",
    ],
  },
  {
    id: 2,
    slug: "istanbul-medipol-scholarship",
    title: "منحة جامعة إسطنبول ميديبول",
    organization: "Istanbul Medipol University",
    country: "تركيا",
    levels: ["بكالوريوس", "ماجستير"],
    funding: "خصم دراسي",
    deadline: "حسب المقاعد المتاحة",
    status: "مفتوحة",
    featured: true,
    description:
      "خصومات دراسية مقدمة للطلاب الدوليين المقبولين في عدد من البرامج الطبية والهندسية والإدارية.",
    benefits: [
      "خصم على الرسوم الدراسية",
      "خيارات دفع مرنة",
      "دعم للطلاب الدوليين",
      "إمكانية التقديم على عدة برامج",
    ],
    requirements: [
      "شهادة الثانوية أو البكالوريوس حسب المرحلة",
      "كشف علامات",
      "جواز سفر ساري المفعول",
      "استيفاء شروط التخصص المطلوب",
    ],
  },
  {
    id: 3,
    slug: "bahcesehir-scholarship",
    title: "منحة جامعة بهتشه شهير",
    organization: "Bahçeşehir University",
    country: "تركيا",
    levels: ["بكالوريوس", "ماجستير"],
    funding: "ممولة جزئيًا",
    deadline: "حسب المقاعد المتاحة",
    status: "مفتوحة",
    featured: true,
    description:
      "فرص خصم ومنح جزئية للطلاب الدوليين في تخصصات الهندسة والإدارة والاتصال والعلوم الصحية.",
    benefits: [
      "تخفيض الرسوم الدراسية",
      "دراسة باللغة الإنجليزية في برامج مختارة",
      "بيئة تعليمية دولية",
      "دعم أكاديمي للطلاب",
    ],
    requirements: [
      "شهادة دراسية مترجمة",
      "كشف علامات",
      "صورة جواز السفر",
      "إثبات لغة لبعض البرامج",
    ],
  },
  {
    id: 4,
    slug: "sabanci-graduate-scholarship",
    title: "منحة جامعة سابانجي للدراسات العليا",
    organization: "Sabancı University",
    country: "تركيا",
    levels: ["ماجستير", "دكتوراه"],
    funding: "ممولة بالكامل",
    deadline: "يختلف حسب البرنامج",
    status: "مفتوحة",
    featured: true,
    description:
      "منحة أكاديمية لطلاب الدراسات العليا في برامج مختارة، وقد تشمل الإعفاء من الرسوم والدعم المالي.",
    benefits: [
      "إعفاء من الرسوم الدراسية",
      "دعم مالي شهري حسب البرنامج",
      "فرص بحثية",
      "العمل مع أعضاء هيئة التدريس",
    ],
    requirements: [
      "شهادة بكالوريوس أو ماجستير",
      "سجل أكاديمي جيد",
      "رسائل توصية",
      "خطاب دافع",
      "إثبات لغة عند طلبه",
    ],
  },
  {
    id: 5,
    slug: "koc-graduate-scholarship",
    title: "منحة جامعة كوتش للدراسات العليا",
    organization: "Koç University",
    country: "تركيا",
    levels: ["ماجستير", "دكتوراه"],
    funding: "ممولة بالكامل",
    deadline: "يختلف حسب البرنامج",
    status: "قريبًا",
    featured: true,
    description:
      "فرص تمويل لبرامج الماجستير والدكتوراه الموجهة للطلاب ذوي الأداء الأكاديمي المتميز.",
    benefits: [
      "إعفاء دراسي",
      "راتب شهري في بعض البرامج",
      "تأمين صحي",
      "دعم بحثي",
    ],
    requirements: [
      "معدل أكاديمي مناسب",
      "خطاب دافع",
      "رسائل توصية",
      "السيرة الذاتية",
      "متطلبات القسم الأكاديمي",
    ],
  },
  {
    id: 6,
    slug: "yeditepe-international-scholarship",
    title: "منحة جامعة يدي تبه",
    organization: "Yeditepe University",
    country: "تركيا",
    levels: ["بكالوريوس"],
    funding: "خصم دراسي",
    deadline: "حسب المقاعد المتاحة",
    status: "مفتوحة",
    featured: false,
    description:
      "خصومات دراسية للطلاب الدوليين في مجموعة من برامج البكالوريوس باللغة التركية أو الإنجليزية.",
    benefits: [
      "خصم على الرسوم",
      "برامج متنوعة",
      "إمكانية الدراسة باللغة الإنجليزية",
      "خدمات للطلاب الدوليين",
    ],
    requirements: [
      "شهادة الثانوية",
      "كشف العلامات",
      "جواز السفر",
      "شهادة لغة عند الحاجة",
    ],
  },
  {
    id: 7,
    slug: "ankara-medipol-scholarship",
    title: "منحة جامعة أنقرة ميديبول",
    organization: "Ankara Medipol University",
    country: "تركيا",
    levels: ["بكالوريوس"],
    funding: "خصم دراسي",
    deadline: "حسب المقاعد المتاحة",
    status: "مفتوحة",
    featured: false,
    description:
      "خصومات دراسية في تخصصات صحية وهندسية وإدارية للطلاب الدوليين.",
    benefits: [
      "خصم دراسي",
      "دعم في إجراءات القبول",
      "تخصصات صحية متنوعة",
      "خطط دفع مرنة",
    ],
    requirements: [
      "شهادة الثانوية",
      "كشف العلامات",
      "صورة شخصية",
      "جواز سفر ساري المفعول",
    ],
  },
  {
    id: 8,
    slug: "istanbul-aydin-scholarship",
    title: "منحة جامعة إسطنبول آيدن",
    organization: "Istanbul Aydın University",
    country: "تركيا",
    levels: ["بكالوريوس", "ماجستير"],
    funding: "ممولة جزئيًا",
    deadline: "حسب المقاعد المتاحة",
    status: "مفتوحة",
    featured: false,
    description:
      "فرص خصم جزئي في عدد من تخصصات البكالوريوس والدراسات العليا للطلاب الدوليين.",
    benefits: [
      "خصومات دراسية",
      "برامج باللغة التركية والإنجليزية",
      "دعم الطلاب الدوليين",
      "تخصصات أكاديمية متعددة",
    ],
    requirements: [
      "الشهادة الدراسية",
      "كشف العلامات",
      "جواز السفر",
      "وثائق إضافية حسب المرحلة",
    ],
  },
];

const degreeLevels = [
  "الكل",
  "بكالوريوس",
  "ماجستير",
  "دكتوراه",
];

const fundingTypes = [
  "الكل",
  "ممولة بالكامل",
  "ممولة جزئيًا",
  "خصم دراسي",
];

const statuses = ["الكل", "مفتوحة", "قريبًا", "مغلقة"];

function getStatusClasses(status: ScholarshipStatus) {
  if (status === "مفتوحة") {
    return "bg-emerald-500 text-white";
  }

  if (status === "قريبًا") {
    return "bg-amber-400 text-[#04153f]";
  }

  return "bg-red-500 text-white";
}

function getFundingClasses(funding: FundingType) {
  if (funding === "ممولة بالكامل") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (funding === "ممولة جزئيًا") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("الكل");
  const [selectedFunding, setSelectedFunding] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [openedScholarship, setOpenedScholarship] =
    useState<Scholarship | null>(null);

  const filteredScholarships = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return scholarships.filter((scholarship) => {
      const matchesSearch =
        scholarship.title.toLowerCase().includes(searchValue) ||
        scholarship.organization.toLowerCase().includes(searchValue);

      const matchesLevel =
        selectedLevel === "الكل" ||
        scholarship.levels.includes(selectedLevel as DegreeLevel);

      const matchesFunding =
        selectedFunding === "الكل" ||
        scholarship.funding === selectedFunding;

      const matchesStatus =
        selectedStatus === "الكل" ||
        scholarship.status === selectedStatus;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesFunding &&
        matchesStatus
      );
    });
  }, [
    search,
    selectedLevel,
    selectedFunding,
    selectedStatus,
  ]);

  function resetFilters() {
    setSearch("");
    setSelectedLevel("الكل");
    setSelectedFunding("الكل");
    setSelectedStatus("الكل");
  }

  return (
    <>
      <Header />

      <main dir="rtl" className="min-h-screen bg-[#f7f8fb]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88] pb-28 pt-36 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -bottom-40 -left-24 h-[450px] w-[450px] rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c58a08]/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-md">
                <FaGraduationCap className="text-[#e4a514]" />
                منح وفرص دراسية
              </span>

              <h1 className="mt-7 text-4xl font-black leading-tight md:text-6xl">
                اكتشف أفضل المنح
                <span className="block text-[#e4a514]">
                  للدراسة في تركيا
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/75">
                ابحث عن المنح والخصومات الدراسية المناسبة لمرحلتك
                الأكاديمية، وتعرّف على التمويل والشروط والمزايا.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  منح ممولة بالكامل
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  خصومات جامعية
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-400" />
                  متابعة طلب التقديم
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
                  placeholder="ابحث عن منحة أو جامعة..."
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pr-12 pl-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:bg-white focus:ring-4 focus:ring-[#c58a08]/10"
                />
              </div>

              <select
                value={selectedLevel}
                onChange={(event) =>
                  setSelectedLevel(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {degreeLevels.map((level) => (
                  <option key={level} value={level}>
                    {level === "الكل"
                      ? "المرحلة الدراسية"
                      : level}
                  </option>
                ))}
              </select>

              <select
                value={selectedFunding}
                onChange={(event) =>
                  setSelectedFunding(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {fundingTypes.map((funding) => (
                  <option key={funding} value={funding}>
                    {funding === "الكل"
                      ? "نوع التمويل"
                      : funding}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
                className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "الكل"
                      ? "حالة التقديم"
                      : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section
          id="scholarships"
          className="mx-auto max-w-7xl px-6 py-20"
        >
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-sm font-bold text-[#c58a08]">
                دليل المنح
              </span>

              <h2 className="mt-2 text-3xl font-black text-[#04153f] md:text-4xl">
                المنح المتاحة
              </h2>

              <p className="mt-3 text-gray-500">
                تم العثور على{" "}
                <span className="font-black text-[#04153f]">
                  {filteredScholarships.length}
                </span>{" "}
                منحة مطابقة لبحثك.
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

          {filteredScholarships.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredScholarships.map((scholarship) => (
                <article
                  key={scholarship.id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88]">
                    <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-white/10" />
                    <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FaGraduationCap className="text-5xl text-[#e4a514]" />
                    </div>

                    <span
                      className={`absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-bold shadow-lg ${getStatusClasses(
                        scholarship.status,
                      )}`}
                    >
                      التقديم {scholarship.status}
                    </span>

                    {scholarship.featured && (
                      <span className="absolute bottom-5 right-5 rounded-full bg-[#c58a08] px-4 py-2 text-xs font-bold text-white">
                        منحة مميزة
                      </span>
                    )}

                    <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                      {scholarship.country}
                    </span>
                  </div>

                  <div className="p-7">
                    <p className="text-sm font-bold text-[#c58a08]">
                      {scholarship.organization}
                    </p>

                    <h3 className="mt-2 min-h-[64px] text-2xl font-black leading-8 text-[#04153f]">
                      {scholarship.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                      {scholarship.description}
                    </p>

                    <div className="mt-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${getFundingClasses(
                          scholarship.funding,
                        )}`}
                      >
                        <FaMoneyBillWave />
                        {scholarship.funding}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                          <FaGraduationCap className="text-[#c58a08]" />
                          المراحل
                        </div>

                        <p
                          className="truncate font-black text-[#04153f]"
                          title={scholarship.levels.join("، ")}
                        >
                          {scholarship.levels.join("، ")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                          <FaCalendarAlt className="text-[#c58a08]" />
                          الموعد
                        </div>

                        <p className="truncate font-black text-[#04153f]">
                          {scholarship.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenedScholarship(scholarship)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#04153f] px-4 py-3 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white"
                      >
                        عرض الشروط
                        <FaGlobe />
                      </button>

                      <Link
                        href="/apply"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#c58a08] px-4 py-3 font-bold text-white shadow-lg shadow-[#c58a08]/20 transition hover:-translate-y-0.5 hover:bg-[#a66f00]"
                      >
                        اطلب المساعدة
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
                لم نعثر على منحة مطابقة
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-500">
                جرّب تغيير اسم البحث أو المرحلة الدراسية أو نوع
                التمويل أو حالة التقديم.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-7 rounded-xl bg-[#04153f] px-7 py-3 font-bold text-white transition hover:bg-[#09245e]"
              >
                عرض جميع المنح
              </button>
            </div>
          )}
        </section>

        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#04153f] px-7 py-14 text-center text-white md:px-16">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#c58a08]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <FaUniversity className="mx-auto text-5xl text-[#e4a514]" />

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                تحتاج إلى مساعدة في اختيار المنحة؟
              </h2>

              <p className="mt-4 text-lg leading-8 text-white/70">
                أرسل معلوماتك وسيساعدك فريق VATAN TURK في معرفة
                المنح والخصومات المناسبة لمعدلك ومرحلتك الدراسية.
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

        {openedScholarship && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04153f]/75 px-4 py-8 backdrop-blur-sm"
            onClick={() => setOpenedScholarship(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
                <div>
                  <p className="text-sm font-bold text-[#c58a08]">
                    {openedScholarship.organization}
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-[#04153f]">
                    {openedScholarship.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenedScholarship(null)}
                  aria-label="إغلاق"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-lg leading-8 text-gray-600">
                  {openedScholarship.description}
                </p>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-black text-[#04153f]">
                      <FaMoneyBillWave className="text-[#c58a08]" />
                      مزايا المنحة
                    </h3>

                    <div className="mt-5 space-y-3">
                      {openedScholarship.benefits.map(
                        (benefit) => (
                          <div
                            key={benefit}
                            className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                          >
                            <FaCheckCircle className="mt-1 shrink-0 text-emerald-500" />
                            <span className="text-gray-600">
                              {benefit}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-black text-[#04153f]">
                      <FaGraduationCap className="text-[#c58a08]" />
                      شروط التقديم
                    </h3>

                    <div className="mt-5 space-y-3">
                      {openedScholarship.requirements.map(
                        (requirement) => (
                          <div
                            key={requirement}
                            className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                          >
                            <FaCheckCircle className="mt-1 shrink-0 text-emerald-500" />
                            <span className="text-gray-600">
                              {requirement}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 rounded-3xl bg-[#04153f]/5 p-5 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      نوع التمويل
                    </p>
                    <p className="mt-1 font-black text-[#04153f]">
                      {openedScholarship.funding}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      موعد التقديم
                    </p>
                    <p className="mt-1 font-black text-[#04153f]">
                      {openedScholarship.deadline}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      حالة المنحة
                    </p>
                    <p className="mt-1 font-black text-[#04153f]">
                      {openedScholarship.status}
                    </p>
                  </div>
                </div>

                <Link
                  href="/apply"
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-7 py-4 text-lg font-black text-white transition hover:bg-[#a66f00]"
                >
                  اطلب المساعدة في التقديم
                  <FaArrowLeft />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}