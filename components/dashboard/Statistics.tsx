type StatisticsProps = {
  registrations?: number;
  messages?: number;
  universities?: number;
  scholarships?: number;
};

export default function Statistics({
  registrations = 0,
  messages = 0,
  universities = 0,
  scholarships = 0,
}: StatisticsProps) {
  const cards = [
    {
      title: "طلبات التسجيل",
      value: registrations,
      color: "bg-blue-50",
    },
    {
      title: "الرسائل",
      value: messages,
      color: "bg-green-50",
    },
    {
      title: "الجامعات",
      value: universities,
      color: "bg-yellow-50",
    },
    {
      title: "المنح الدراسية",
      value: scholarships,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-2xl ${card.color} p-6 shadow transition hover:shadow-lg`}
        >
          <p className="text-gray-500">{card.title}</p>

          <h2 className="mt-4 text-4xl font-bold text-[#04153f]">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}