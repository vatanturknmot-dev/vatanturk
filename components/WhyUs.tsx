import {
  FaHandshake,
  FaUniversity,
  FaClock,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: FaUniversity,
    title: "خبرة أكاديمية",
    description:
      "خبرة واسعة في القبولات الجامعية والمنح الدراسية داخل الجامعات التركية.",
  },
  {
    icon: FaHandshake,
    title: "موثوقية وشفافية",
    description:
      "نلتزم بالوضوح والشفافية في جميع مراحل تقديم الخدمات والمتابعة.",
  },
  {
    icon: FaClock,
    title: "سرعة الإنجاز",
    description:
      "ننجز معاملاتك بأسرع وقت ممكن مع متابعة مستمرة حتى الانتهاء.",
  },
  {
    icon: FaHeadset,
    title: "دعم مستمر",
    description:
      "فريق متخصص يجيب على استفساراتك ويقدم لك الدعم قبل وبعد الخدمة.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-[#04153f]">
            لماذا تختار وطن ترك؟
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            لأننا نؤمن أن نجاحك هو نجاحنا، ونسعى لتقديم أفضل الخدمات بأعلى معايير الجودة.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#c58a08] hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#04153f]">
                  <Icon className="text-[#c58a08]" size={28} />
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#04153f]">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}