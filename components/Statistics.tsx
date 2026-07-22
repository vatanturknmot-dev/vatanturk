import {
  FaUserGraduate,
  FaUniversity,
  FaGlobeAsia,
  FaFileAlt,
} from "react-icons/fa";

const stats = [
  {
    icon: FaUserGraduate,
    number: "5000+",
    title: "طالب تمت خدمته",
  },
  {
    icon: FaUniversity,
    number: "120+",
    title: "جامعة تركية",
  },
  {
    icon: FaGlobeAsia,
    number: "40+",
    title: "دولة",
  },
  {
    icon: FaFileAlt,
    number: "15000+",
    title: "معاملة منجزة",
  },
];

export default function Statistics() {
  return (
    <section className="bg-[#04153f] py-24">
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
                  <Icon
                    className="text-[#c58a08]"
                    size={42}
                  />
                </div>

                <h3 className="text-5xl font-bold text-[#04153f]">
                  {item.number}
                </h3>

                <p className="mt-3 text-lg text-gray-600">
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