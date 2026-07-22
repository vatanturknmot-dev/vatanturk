"use client";

import { useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  date: string;
};

export default function Messages() {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      name: "محمد أحمد",
      email: "mohamed@gmail.com",
      subject: "أريد التسجيل في الجامعة",
      date: "22/07/2026",
    },
    {
      id: 2,
      name: "أحمد علي",
      email: "ahmed@gmail.com",
      subject: "استفسار عن المنح",
      date: "21/07/2026",
    },
  ]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#04153f]">
          الرسائل الواردة
        </h2>

        <span className="rounded-lg bg-[#04153f] px-4 py-2 text-white">
          {messages.length} رسالة
        </span>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-right">

          <thead>

            <tr className="border-b">

              <th className="p-3">الاسم</th>
              <th className="p-3">البريد</th>
              <th className="p-3">الموضوع</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">الإجراءات</th>

            </tr>

          </thead>

          <tbody>

            {messages.map((msg) => (
              <tr
                key={msg.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{msg.name}</td>
                <td className="p-3">{msg.email}</td>
                <td className="p-3">{msg.subject}</td>
                <td className="p-3">{msg.date}</td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <button className="rounded-lg bg-[#04153f] px-3 py-2 text-white hover:bg-[#09245e]">
                      فتح
                    </button>

                    <button className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700">
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