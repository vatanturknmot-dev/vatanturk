import Link from "next/link";
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

type University = {
  slug: string;
  name: string;
  englishName: string;
  city: string;
  type: "حكومية" | "خاصة";
  languages: string[];
  tuition: string;
  applicationStatus: string;
  description: string;
  programs: string[];
  requirements: string[];
  documents: string[];
};

const universities: University[] = [
  {
    slug: "istanbul-university",
    name: "جامعة إسطنبول",
    englishName: "Istanbul University",
    city: "إسطنبول",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية", "العربية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    description:
      "تعد جامعة إسطنبول من أقدم وأشهر الجامعات التركية، وتضم عددًا كبيرًا من الكليات والتخصصات في مختلف المجالات العلمية والإنسانية.",
    programs: [
      "الطب البشري",
      "طب الأسنان",
      "الصيدلة",
      "الهندسة",
      "إدارة الأعمال",
      "علم النفس",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "إثبات لغة حسب التخصص",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
  {
    slug: "istanbul-medipol-university",
    name: "جامعة إسطنبول ميديبول",
    englishName: "Istanbul Medipol University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    description:
      "جامعة إسطنبول ميديبول من الجامعات الخاصة المعروفة ببرامجها الصحية والطبية، وتوفر تخصصات متنوعة باللغة التركية والإنجليزية.",
    programs: [
      "الطب البشري",
      "طب الأسنان",
      "الصيدلة",
      "الهندسة",
      "التمريض",
      "إدارة الأعمال",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "متطلبات إضافية لبعض التخصصات",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
  {
    slug: "ankara-university",
    name: "جامعة أنقرة",
    englishName: "Ankara University",
    city: "أنقرة",
    type: "حكومية",
    languages: ["التركية", "الإنجليزية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "قريبًا",
    description:
      "جامعة أنقرة من الجامعات الحكومية المرموقة في تركيا، وتضم كليات متعددة في العلوم والطب والهندسة والعلوم الإنسانية.",
    programs: [
      "الطب البشري",
      "الهندسة",
      "العلوم السياسية",
      "الحقوق",
      "علم النفس",
      "إدارة الأعمال",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "امتحان قبول حسب إعلان الجامعة",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
  {
    slug: "bahcesehir-university",
    name: "جامعة بهتشه شهير",
    englishName: "Bahçeşehir University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    description:
      "جامعة بهتشه شهير من الجامعات الخاصة المعروفة ببرامجها الدولية وتنوع تخصصاتها، خاصة الهندسة والإدارة والاتصال.",
    programs: [
      "الهندسة المعمارية",
      "هندسة البرمجيات",
      "إدارة الأعمال",
      "الإعلام",
      "الحقوق",
      "علم النفس",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "إثبات لغة عند الحاجة",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
  {
    slug: "gazi-university",
    name: "جامعة غازي",
    englishName: "Gazi University",
    city: "أنقرة",
    type: "حكومية",
    languages: ["التركية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "قريبًا",
    description:
      "جامعة غازي من الجامعات الحكومية الكبيرة في أنقرة، وتتميز بكليات التربية والهندسة والعلوم الصحية.",
    programs: [
      "الهندسة",
      "التربية",
      "الطب",
      "العلوم الصحية",
      "الإدارة",
      "العلوم",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "متطلبات قبول الجامعة",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
  {
    slug: "istinye-university",
    name: "جامعة إستينيا",
    englishName: "Istinye University",
    city: "إسطنبول",
    type: "خاصة",
    languages: ["التركية", "الإنجليزية", "العربية"],
    tuition: "تُحدّد حسب التخصص",
    applicationStatus: "مفتوح",
    description:
      "جامعة إستينيا جامعة خاصة حديثة تهتم بالتخصصات الطبية والهندسية وتوفر بيئة تعليمية متطورة للطلاب الدوليين.",
    programs: [
      "الطب البشري",
      "طب الأسنان",
      "الصيدلة",
      "هندسة البرمجيات",
      "العلاج الطبيعي",
      "علم النفس",
    ],
    requirements: [
      "شهادة الثانوية العامة",
      "كشف علامات الثانوية",
      "جواز سفر ساري المفعول",
      "إثبات لغة لبعض البرامج",
    ],
    documents: [
      "صورة عن جواز السفر",
      "صورة شخصية",
      "شهادة الثانوية",
      "كشف العلامات",
    ],
  },
];

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function UniversityDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const university = universities.find(
    (item) => item.slug === slug,
  );

  if (!university) {
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

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fb]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#04153f] via-[#09245e] to-[#0f3b88] pb-24 pt-24 text-white">
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
              <span className="inline-flex rounded-full bg-[#c58a08] px-5 py-2 text-sm font-bold">
                جامعة {university.type}
              </span>

              <h1 className="mt-6 text-4xl font-black md:text-6xl">
                {university.name}
              </h1>

              <p className="mt-3 text-xl text-[#e4a514]">
                {university.englishName}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3">
                  <FaMapMarkerAlt className="text-[#e4a514]" />
                  {university.city}، تركيا
                </span>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3">
                  <FaCalendarAlt className="text-[#e4a514]" />
                  التقديم {university.applicationStatus}
                </span>
              </div>
            </div>

            <div className="flex h-72 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 backdrop-blur-md">
              <FaUniversity className="text-8xl text-[#e4a514]" />
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

              <p className="mt-5 text-lg leading-9 text-gray-600">
                {university.description}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-3xl text-[#c58a08]" />

                <h2 className="text-3xl font-black text-[#04153f]">
                  أبرز التخصصات
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {university.programs.map((program) => (
                  <div
                    key={program}
                    className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4"
                  >
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="font-bold text-[#04153f]">
                      {program}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-3xl text-[#c58a08]" />

                <h2 className="text-3xl font-black text-[#04153f]">
                  شروط القبول
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {university.requirements.map((requirement) => (
                  <div
                    key={requirement}
                    className="flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-gray-600">
                      {requirement}
                    </span>
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
                {university.documents.map((document) => (
                  <div
                    key={document}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
                  >
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-gray-600">
                      {document}
                    </span>
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
                    <p className="text-sm text-gray-500">
                      لغة الدراسة
                    </p>

                    <p className="mt-1 font-bold text-[#04153f]">
                      {university.languages.join("، ")}
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
                      {university.tuition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  <FaUniversity className="text-2xl text-[#c58a08]" />

                  <div>
                    <p className="text-sm text-gray-500">
                      نوع الجامعة
                    </p>

                    <p className="mt-1 font-bold text-[#04153f]">
                      جامعة {university.type}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/apply?university=${university.slug}`}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-6 py-4 text-lg font-black text-white transition hover:bg-[#a66f00]"
              >
                قدم الآن
                <FaGraduationCap />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}