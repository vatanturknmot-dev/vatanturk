"use client";

import Link from "next/link";
import {
  FaArrowLeft,
  FaBookOpen,
  FaBrain,
  FaBullhorn,
  FaChalkboardTeacher,
  FaChartLine,
  FaGraduationCap,
  FaHandsHelping,
  FaHome,
  FaIdCard,
  FaLanguage,
  FaPassport,
  FaPlaneDeparture,
  FaUniversity,
} from "react-icons/fa";

const services = [
  {
    title: "القبولات الجامعية",
    description:
      "نساعدك في اختيار الجامعة والتخصص المناسب والتقديم على الجامعات التركية.",
    icon: FaUniversity,
    href: "/universities",
  },
  {
    title: "المنح الدراسية",
    description:
      "نساعدك في البحث عن المنح التركية والدولية المناسبة ومتابعة خطوات التقديم.",
    icon: FaGraduationCap,
    href: "/scholarships",
  },
  {
    title: "المساعدة في البحث العلمي",
    description:
      "دعم أكاديمي في اختيار موضوع البحث وإعداد الخطة وتنظيم المصادر وتنسيق المراجع.",
    icon: FaBookOpen,
    href: "/apply",
  },
  {
    title: "الدورات الأكاديمية",
    description:
      "دورات متخصصة في كتابة الأبحاث والمقالات العلمية وتطوير المهارات الأكاديمية.",
    icon: FaChalkboardTeacher,
    href: "/apply",
  },
  {
    title: "كروت NFC الذكية",
    description:
      "تصميم وتجهيز بطاقات NFC ذكية لمشاركة معلوماتك ووسائل التواصل الخاصة بك بسهولة.",
    icon: FaIdCard,
    href: "/apply",
  },
  {
    title: "دورات التسويق الإلكتروني",
    description:
      "دورات عملية في التسويق الرقمي وإدارة منصات التواصل وصناعة المحتوى والإعلانات.",
    icon: FaBullhorn,
    href: "/apply",
  },
  {
    title: "جلسات العلاج النفسي",
    description:
      "جلسات دعم وعلاج نفسي فردية تساعد على التعامل مع الضغوط والمشكلات النفسية.",
    icon: FaBrain,
    href: "/apply",
  },
  {
    title: "الإرشاد الاجتماعي",
    description:
      "جلسات إرشاد اجتماعي وأسري للمساعدة في مواجهة المشكلات وتحسين العلاقات والتواصل.",
    icon: FaHandsHelping,
    href: "/apply",
  },
  {
    title: "التنمية البشرية",
    description:
      "برامج ودورات لتطوير الشخصية والمهارات القيادية والتواصل وإدارة الوقت وتحقيق الأهداف.",
    icon: FaChartLine,
    href: "/apply",
  },
  {
    title: "الإقامة الطلابية",
    description:
      "نساعدك في تجهيز ملف الإقامة الطلابية ومتابعة جميع الإجراءات المطلوبة.",
    icon: FaPassport,
    href: "/apply",
  },
  {
    title: "السكن الطلابي",
    description:
      "نوفر أفضل خيارات السكن الجامعي والخاص المناسبة لاحتياجات الطلاب.",
    icon: FaHome,
    href: "/apply",
  },
  {
    title: "دورات اللغة",
    description:
      "دورات اللغة التركية والإنجليزية لمساعدة الطلاب على الدراسة والاندماج.",
    icon: FaLanguage,
    href: "/apply",
  },
  {
    title: "الاستقبال من المطار",
    description:
      "استقبال الطلاب من المطار وتأمين النقل حتى الجامعة أو مكان الإقامة.",
    icon: FaPlaneDeparture,
    href: "/apply",
  },
];

const statistics = [
  {
    number: "13+",
    label: "خدمة متخصصة",
  },
  {
    number: "500+",
    label: "طالب ومستفيد",
  },
  {
    number: "24/7",
    label: "دعم ومتابعة",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7f9fd] to-[#eef3ff] py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c58a08]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-3xl" />

        <div className="absolute right-[12%] top-40 h-40 w-40 rounded-full border border-[#04153f]/5" />
        <div className="absolute left-[10%] top-24 h-64 w-64 rounded-full border border-[#c58a08]/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#c58a08]/20 bg-[#c58a08]/10 px-6 py-3 text-sm font-black text-[#c58a08] shadow-sm">
            خدماتنا
          </span>

          <h2 className="mt-8 text-4xl font-black leading-tight text-[#04153f] sm:text-5xl md:text-6xl">
            خدمات
            <span className="mx-3 text-[#c58a08]">VATAN TURK</span>
          </h2>

          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-[#c58a08]" />

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-gray-600 md:text-xl md:leading-10">
            نقدم خدمات تعليمية وأكاديمية وتقنية ونفسية واجتماعية متكاملة
            لمساعدة الطلاب والأفراد على تطوير مهاراتهم وتحقيق أهدافهم داخل
            تركيا وخارجها.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {statistics.map((statistic) => (
              <div
                key={statistic.label}
                className="rounded-3xl border border-white/80 bg-white/80 px-6 py-6 shadow-lg shadow-gray-200/50 backdrop-blur-md"
              >
                <p className="text-3xl font-black text-[#04153f] md:text-4xl">
                  {statistic.number}
                </p>

                <p className="mt-2 font-bold text-gray-500">
                  {statistic.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/50 transition duration-300 hover:-translate-y-2 hover:border-[#c58a08]/20 hover:shadow-2xl"
              >
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#c58a08]/5 transition duration-300 group-hover:scale-150" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#04153f] shadow-lg shadow-[#04153f]/20 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="text-4xl text-[#e4a514]" />
                </div>

                <h3 className="relative mt-7 text-2xl font-black leading-9 text-[#04153f]">
                  {service.title}
                </h3>

                <p className="relative mt-4 flex-1 leading-8 text-gray-600">
                  {service.description}
                </p>

                <div className="relative mt-7 border-t border-gray-100 pt-5">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 font-black text-[#c58a08] transition-all hover:gap-4 hover:text-[#a66f00]"
                  >
                    عرض الخدمة
                    <FaArrowLeft className="text-sm" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}