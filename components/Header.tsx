"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type HeaderSettings = {
  site_name: string;
  site_description: string;
  logo_url: string;
};

type ContactInfo = {
  whatsapp: string;
};

const defaultSettings: HeaderSettings = {
  site_name: "VATAN TURK",
  site_description: "مستقبلك يبدأ من تركيا",
  logo_url: "",
};

function createWhatsAppLink(phone: string) {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!normalizedPhone) {
    return "";
  }

  return `https://wa.me/${normalizedPhone}`;
}

export default function Header() {
  const [settings, setSettings] =
    useState<HeaderSettings>(defaultSettings);

  const [contact, setContact] = useState<ContactInfo>({
    whatsapp: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHeaderData() {
      try {
        const [settingsResult, contactResult] = await Promise.all([
          supabase
            .from("site_settings")
            .select("site_name, site_description, logo_url")
            .eq("id", 1)
            .maybeSingle(),

          supabase
            .from("contact_info")
            .select("whatsapp")
            .order("id", { ascending: true })
            .limit(1)
            .maybeSingle(),
        ]);

        if (!isMounted) {
          return;
        }

        if (settingsResult.error) {
          console.error(
            "Header site settings error:",
            settingsResult.error
          );
        }

        if (contactResult.error) {
          console.error(
            "Header contact info error:",
            contactResult.error
          );
        }

        if (settingsResult.data) {
          setSettings({
            site_name:
              settingsResult.data.site_name ||
              defaultSettings.site_name,

            site_description:
              settingsResult.data.site_description ||
              defaultSettings.site_description,

            logo_url:
              settingsResult.data.logo_url || "",
          });
        }

        if (contactResult.data) {
          setContact({
            whatsapp:
              contactResult.data.whatsapp || "",
          });
        }
      } catch (error) {
        console.error(
          "Failed to load header data:",
          error
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHeaderData();

    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappLink = useMemo(
    () => createWhatsAppLink(contact.whatsapp),
    [contact.whatsapp]
  );

  return (
    <header
      dir="rtl"
      className="relative z-50 bg-[#04153f] text-white shadow-lg"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
        >
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.site_name}
              className="h-14 w-14 shrink-0 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg font-black text-[#e4a514]">
              VT
            </div>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black sm:text-2xl">
              {settings.site_name}
            </h1>

            <p className="mt-1 hidden truncate text-sm text-gray-300 sm:block">
              {settings.site_description}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className="font-semibold transition hover:text-[#c58a08]"
          >
            الرئيسية
          </Link>

          <Link
            href="/#services"
            className="font-semibold transition hover:text-[#c58a08]"
          >
            الخدمات
          </Link>

          <Link
            href="/universities"
            className="font-semibold transition hover:text-[#c58a08]"
          >
            الجامعات
          </Link>

          <Link
            href="/#contact"
            className="font-semibold transition hover:text-[#c58a08]"
          >
            تواصل معنا
          </Link>
        </nav>

        {loading ? (
          <div className="h-11 w-24 animate-pulse rounded-xl bg-white/10" />
        ) : whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-[#c58a08] px-4 py-3 text-sm font-bold transition hover:bg-[#e4a514] sm:px-5 sm:text-base"
          >
            واتساب
          </a>
        ) : (
          <Link
            href="/#contact"
            className="shrink-0 rounded-xl bg-[#c58a08] px-4 py-3 text-sm font-bold transition hover:bg-[#e4a514] sm:px-5 sm:text-base"
          >
            تواصل معنا
          </Link>
        )}
      </div>
    </header>
  );
}