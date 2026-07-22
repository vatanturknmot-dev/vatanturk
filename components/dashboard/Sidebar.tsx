"use client";

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const menu = [
  { id: "home", title: "الرئيسية" },
  { id: "registrations", title: "طلبات التسجيل" },
  { id: "messages", title: "الرسائل" },
  { id: "universities", title: "الجامعات" },
  { id: "scholarships", title: "المنح الدراسية" },
  { id: "website", title: "إدارة الموقع" },
  { id: "settings", title: "الإعدادات" },
];

export default function Sidebar({
  currentPage,
  setCurrentPage,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-[#04153f] text-white flex flex-col">

      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-bold text-[#e4a514]">
          VATAN TURK
        </h1>

        <p className="text-sm mt-2 text-gray-300">
          لوحة التحكم
        </p>
      </div>

      <nav className="flex-1 p-5">

        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full rounded-xl px-5 py-4 mb-3 text-right transition-all duration-200 ${
              currentPage === item.id
                ? "bg-[#c58a08] text-white shadow-lg"
                : "hover:bg-[#09245e]"
            }`}
          >
            {item.title}
          </button>
        ))}

      </nav>

      <div className="p-5 border-t border-white/10">

        <button
          onClick={async () => {
            await fetch("/api/admin/logout", {
              method: "POST",
            });

            window.location.href = "/dashboard-vt-2026/login";
          }}
          className="w-full rounded-xl bg-red-600 py-4 font-bold hover:bg-red-700 transition"
        >
          تسجيل الخروج
        </button>

      </div>
    </aside>
  );
}