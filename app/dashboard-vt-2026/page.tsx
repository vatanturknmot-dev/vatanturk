"use client";

import { useCallback, useEffect, useState } from "react";
import RegistrationTable from "@/components/dashboard/RegistrationTable";
import WebsiteManager from "@/components/dashboard/WebsiteManager";
import UniversitiesManager from "@/components/dashboard/UniversitiesManager";
import MessagesManager from "../../components/dashboard/MessagesManager";import { supabase } from "@/lib/supabase";

type DashboardCounts = {
  registrations: number;
  messages: number;
  universities: number;
  scholarships: number;
};

export default function DashboardPage() {
  const [page, setPage] = useState("home");

  const [counts, setCounts] = useState<DashboardCounts>({
    registrations: 0,
    messages: 0,
    universities: 0,
    scholarships: 0,
  });

  const [loadingCounts, setLoadingCounts] = useState(true);

  const fetchDashboardCounts = useCallback(async () => {
    setLoadingCounts(true);

    try {
      const [
        registrationsResult,
        universitiesResult,
        messagesResult,
      ] = await Promise.all([
        supabase
          .from("registrations")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("universities")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("messages")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("is_read", false),
      ]);

      if (registrationsResult.error) {
        console.error(
          "تعذر جلب عدد طلبات التسجيل:",
          registrationsResult.error.message
        );
      }

      if (universitiesResult.error) {
        console.error(
          "تعذر جلب عدد الجامعات:",
          universitiesResult.error.message
        );
      }

      if (messagesResult.error) {
        console.error(
          "تعذر جلب عدد الرسائل:",
          messagesResult.error.message
        );
      }

      setCounts((current) => ({
        ...current,
        registrations: registrationsResult.count ?? 0,
        universities: universitiesResult.count ?? 0,
        messages: messagesResult.count ?? 0,
      }));
    } catch (error) {
      console.error(
        "تعذر جلب إحصائيات لوحة التحكم:",
        error
      );
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardCounts();

    const channel = supabase
      .channel("dashboard-home-counts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        fetchDashboardCounts
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "universities",
        },
        fetchDashboardCounts
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        fetchDashboardCounts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardCounts]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("تعذر تسجيل الخروج:", error);
    } finally {
      window.location.href =
        "/dashboard-vt-2026/login";
    }
  }

  function renderContent() {
    switch (page) {
      case "registrations":
        return <RegistrationTable />;

      case "messages":
        return <MessagesManager />;

      case "universities":
        return <UniversitiesManager />;

      case "scholarships":
        return (
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#04153f]">
                  المنح الدراسية
                </h2>

                <p className="mt-2 text-gray-600">
                  إدارة المنح الدراسية ستتم إضافتها هنا.
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg bg-[#04153f] px-5 py-3 font-bold text-white transition hover:bg-[#09245e]"
              >
                إضافة منحة
              </button>
            </div>
          </div>
        );

      case "website":
        return <WebsiteManager />;

      default:
        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Card
                title="طلبات التسجيل"
                value={
                  loadingCounts
                    ? "..."
                    : String(counts.registrations)
                }
                onClick={() =>
                  setPage("registrations")
                }
              />

              <Card
                title="الرسائل الجديدة"
                value={
                  loadingCounts
                    ? "..."
                    : String(counts.messages)
                }
                onClick={() => setPage("messages")}
              />

              <Card
                title="الجامعات"
                value={
                  loadingCounts
                    ? "..."
                    : String(counts.universities)
                }
                onClick={() =>
                  setPage("universities")
                }
              />

              <Card
                title="المنح"
                value={
                  loadingCounts
                    ? "..."
                    : String(counts.scholarships)
                }
                onClick={() =>
                  setPage("scholarships")
                }
              />
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow">
              <h2 className="text-2xl font-bold text-[#04153f]">
                أهلًا بك في لوحة التحكم
              </h2>

              <p className="mt-3 text-gray-600">
                يمكنك إدارة طلبات التسجيل والرسائل
                والجامعات وبقية أقسام الموقع من القائمة
                الموجودة على اليمين.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setPage("registrations")
                  }
                  className="rounded-xl bg-[#c58a08] px-6 py-3 font-bold text-white transition hover:bg-[#e4a514]"
                >
                  عرض طلبات التسجيل
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage("messages")
                  }
                  className="rounded-xl bg-[#04153f] px-6 py-3 font-bold text-white transition hover:bg-[#09245e]"
                >
                  عرض الرسائل
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage("universities")
                  }
                  className="rounded-xl border border-[#04153f] bg-white px-6 py-3 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white"
                >
                  إدارة الجامعات
                </button>
              </div>
            </div>
          </>
        );
    }
  }

  return (
    <main
      className="min-h-screen bg-[#f7f8fb]"
      dir="rtl"
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-[#04153f] p-5 text-white lg:min-h-screen lg:w-72 lg:p-6">
          <h1 className="mb-6 text-center text-3xl font-black text-[#e4a514] lg:mb-10">
            VATAN TURK
          </h1>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block">
            <MenuButton
              title="الرئيسية"
              active={page === "home"}
              onClick={() => setPage("home")}
            />

            <MenuButton
              title="طلبات التسجيل"
              active={page === "registrations"}
              onClick={() =>
                setPage("registrations")
              }
            />

            <MenuButton
              title={
                counts.messages > 0
                  ? `الرسائل (${counts.messages})`
                  : "الرسائل"
              }
              active={page === "messages"}
              onClick={() =>
                setPage("messages")
              }
            />

            <MenuButton
              title="الجامعات"
              active={page === "universities"}
              onClick={() =>
                setPage("universities")
              }
            />

            <MenuButton
              title="المنح"
              active={page === "scholarships"}
              onClick={() =>
                setPage("scholarships")
              }
            />

            <MenuButton
              title="تعديل الموقع"
              active={page === "website"}
              onClick={() =>
                setPage("website")
              }
            />
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-red-600 py-3 font-bold transition hover:bg-red-700 lg:mt-10"
            onClick={handleLogout}
          >
            تسجيل الخروج
          </button>
        </aside>

        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-black text-[#04153f] sm:text-4xl">
              لوحة التحكم
            </h1>

            <p className="text-sm font-medium text-gray-500">
              إدارة موقع VATAN TURK
            </p>
          </div>

          {renderContent()}
        </section>
      </div>
    </main>
  );
}

function MenuButton({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg px-4 py-3 text-right font-bold transition lg:mb-3 ${
        active
          ? "bg-[#c58a08]"
          : "hover:bg-[#09245e]"
      }`}
    >
      {title}
    </button>
  );
}

function Card({
  title,
  value,
  onClick,
}: {
  title: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-white p-6 text-right shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-black text-[#04153f]">
        {value}
      </p>
    </button>
  );
}