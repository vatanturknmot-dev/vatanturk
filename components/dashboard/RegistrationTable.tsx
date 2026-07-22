"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type RegistrationStatus = "new" | "reviewing" | "accepted" | "rejected";

type Registration = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  university: string | null;
  specialization: string | null;
  notes: string | null;
  status: RegistrationStatus | null;
  created_at: string;
};

const statusOptions: {
  value: "all" | RegistrationStatus;
  label: string;
}[] = [
  { value: "all", label: "كل الحالات" },
  { value: "new", label: "جديد" },
  { value: "reviewing", label: "قيد المراجعة" },
  { value: "accepted", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
];

const statusStyles: Record<
  RegistrationStatus,
  { label: string; className: string }
> = {
  new: {
    label: "جديد",
    className: "bg-amber-100 text-amber-800",
  },
  reviewing: {
    label: "قيد المراجعة",
    className: "bg-blue-100 text-blue-800",
  },
  accepted: {
    label: "مقبول",
    className: "bg-emerald-100 text-emerald-800",
  },
  rejected: {
    label: "مرفوض",
    className: "bg-red-100 text-red-800",
  },
};

function normalizeStatus(status: Registration["status"]): RegistrationStatus {
  if (
    status === "reviewing" ||
    status === "accepted" ||
    status === "rejected"
  ) {
    return status;
  }

  return "new";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function RegistrationTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | RegistrationStatus
  >("all");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRegistrations = useCallback(async () => {
    setErrorMessage("");

    const { data, error } = await supabase
      .from("registrations")
      .select(
        "id, full_name, email, phone, nationality, university, specialization, notes, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("تعذر جلب الطلبات:", error);
      setErrorMessage("تعذر تحميل طلبات التسجيل. حاول تحديث الصفحة.");
      setLoading(false);
      return;
    }

    setRegistrations((data ?? []) as Registration[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel("registrations-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const itemStatus = normalizeStatus(item.status);

      const matchesStatus =
        statusFilter === "all" || itemStatus === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        [
          item.full_name,
          item.email,
          item.phone,
          item.nationality,
          item.university,
          item.specialization,
        ].some((value) => value?.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [registrations, search, statusFilter]);

  async function updateStatus(
    registration: Registration,
    status: RegistrationStatus
  ) {
    setUpdatingId(registration.id);
    setErrorMessage("");

    const previousStatus = registration.status;

    setRegistrations((current) =>
      current.map((item) =>
        item.id === registration.id ? { ...item, status } : item
      )
    );

    const { error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", registration.id);

    if (error) {
      console.error("تعذر تحديث الحالة:", error);

      setRegistrations((current) =>
        current.map((item) =>
          item.id === registration.id
            ? { ...item, status: previousStatus }
            : item
        )
      );

      setErrorMessage(
        "تعذر تحديث حالة الطلب. تأكد من إضافة سياسة UPDATE في Supabase."
      );
    } else {
      setSelectedRegistration((current) =>
        current?.id === registration.id ? { ...current, status } : current
      );
    }

    setUpdatingId(null);
  }

  return (
    <>
      <div
        className="rounded-3xl bg-white p-4 shadow-sm sm:p-6"
        dir="rtl"
      >
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#04153f]">
              طلبات التسجيل
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              إجمالي الطلبات: {registrations.length}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث بالاسم، الهاتف، الجامعة..."
              className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 font-medium text-[#04153f] placeholder:text-gray-400 outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/15 sm:min-w-80"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | RegistrationStatus
                )
              }
              className="h-12 rounded-xl border border-gray-300 bg-white px-4 font-bold text-[#04153f] outline-none transition focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/15"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchRegistrations();
              }}
              className="h-12 rounded-xl border border-[#04153f] px-5 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white"
            >
              تحديث
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[1050px] text-right">
            <thead className="bg-[#04153f] text-white">
              <tr>
                <th className="p-4">الاسم</th>
                <th className="p-4">الجنسية</th>
                <th className="p-4">الجامعة</th>
                <th className="p-4">التخصص</th>
                <th className="p-4">الهاتف</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    لا توجد طلبات مطابقة.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((registration) => {
                  const status = normalizeStatus(registration.status);
                  const statusInfo = statusStyles[status];
                  const isUpdating = updatingId === registration.id;

                  return (
                    <tr
                      key={registration.id}
                      className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4 font-bold text-[#04153f]">
                        {registration.full_name}
                      </td>

                      <td className="p-4 text-gray-700">
                        {registration.nationality || "—"}
                      </td>

                      <td className="p-4 text-gray-700">
                        {registration.university || "—"}
                      </td>

                      <td className="p-4 text-gray-700">
                        {registration.specialization || "—"}
                      </td>

                      <td className="p-4 text-left font-medium text-gray-700">
                        {registration.phone || "—"}
                      </td>

                      <td className="p-4 text-sm text-gray-500">
                        {formatDate(registration.created_at)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRegistration(registration)
                            }
                            className="rounded-lg bg-[#04153f] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#09245e]"
                          >
                            عرض
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(registration, "reviewing")
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            مراجعة
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(registration, "accepted")
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            قبول
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(registration, "rejected")
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRegistration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          dir="rtl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRegistration(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <p className="text-sm font-bold text-[#c58a08]">
                  تفاصيل الطلب رقم #{selectedRegistration.id}
                </p>

                <h3 className="mt-1 text-2xl font-black text-[#04153f]">
                  {selectedRegistration.full_name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 transition hover:bg-gray-200"
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <DetailItem
                label="البريد الإلكتروني"
                value={selectedRegistration.email}
              />

              <DetailItem
                label="رقم الهاتف"
                value={selectedRegistration.phone}
              />

              <DetailItem
                label="الجنسية"
                value={selectedRegistration.nationality}
              />

              <DetailItem
                label="الجامعة"
                value={selectedRegistration.university}
              />

              <DetailItem
                label="التخصص"
                value={selectedRegistration.specialization}
              />

              <DetailItem
                label="تاريخ الإرسال"
                value={formatDate(selectedRegistration.created_at)}
              />

              <div className="sm:col-span-2">
                <DetailItem
                  label="الملاحظات"
                  value={selectedRegistration.notes}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t p-6">
              <button
                type="button"
                onClick={() =>
                  updateStatus(selectedRegistration, "reviewing")
                }
                disabled={updatingId === selectedRegistration.id}
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                قيد المراجعة
              </button>

              <button
                type="button"
                onClick={() =>
                  updateStatus(selectedRegistration, "accepted")
                }
                disabled={updatingId === selectedRegistration.id}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                قبول الطلب
              </button>

              <button
                type="button"
                onClick={() =>
                  updateStatus(selectedRegistration, "rejected")
                }
                disabled={updatingId === selectedRegistration.id}
                className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                رفض الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-2 break-words font-bold text-[#04153f]">
        {value || "غير متوفر"}
      </p>
    </div>
  );
}