"use client";

import { useState } from "react";

type Scholarship = {
  id: number;
  title: string;
  university: string;
  deadline: string;
  status: string;
};

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([
    {
      id: 1,
      title: "منحة البكالوريوس",
      university: "جامعة ماردين أرتوكلو",
      deadline: "31/08/2026",
      status: "مفتوحة",
    },
    {
      id: 2,
      title: "منحة الماجستير",
      university: "جامعة غازي عنتاب",
      deadline: "15/09/2026",
      status: "مفتوحة",
    },
  ]);

  const deleteScholarship = (id: number) => {
    setScholarships(scholarships.filter((s) => s.id !== id));
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-[#04153f]">
          المنح الدراسية
        </h2>

        <button className="rounded-xl bg-[#04153f] px-5 py-3 text-white hover:bg-[#09245e]">
          + إضافة منحة
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-right">

          <thead>
            <tr className="border-b">
              <th className="p-3">المنحة</th>
              <th className="p-3">الجامعة</th>
              <th className="p-3">آخر موعد</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>

          <tbody>

            {scholarships.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{item.title}</td>

                <td className="p-3">{item.university}</td>

                <td className="p-3">{item.deadline}</td>

                <td className="p-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                    {item.status}
                  </span>
                </td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <button className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                      تعديل
                    </button>

                    <button
                      onClick={() => deleteScholarship(item.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      حذف
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}