"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type HeroSettings = {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_url: string;
  hero_image_url: string;
};

type ContactInfo = {
  whatsapp: string;
};

const defaultSettings: HeroSettings = {
  site_name: "VATAN TURK",

  hero_title: "مستقبلك يبدأ من تركيا",

  hero_subtitle:
    "نقدم خدمات القبولات الجامعية، التأشيرات، الإقامات، الترجمة، التصديق، التسويق الإلكتروني وتنظيم الفعاليات باحترافية عالية.",

  hero_button_text: "تواصل معنا",

  hero_button_url: "#contact",

  hero_image_url: "/images/vatan-background.png",
};

function createWhatsAppLink(phone: string) {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!normalizedPhone) {
    return "";
  }

  return `https://wa.me/${normalizedPhone}`;
}

function isExternalLink(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

export default function Hero() {
  const [settings, setSettings] =
    useState<HeroSettings>(defaultSettings);

  const [contact, setContact] = useState<ContactInfo>({
    whatsapp: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHeroData() {
      try {
        const [settingsResult, contactResult] = await Promise.all([
          supabase
            .from("site_settings")
            .select(
              `
              site_name,
              hero_title,
              hero_subtitle,
              hero_button_text,
              hero_button_url,
              hero_image_url
            `
            )
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
            "Hero site settings error:",
            settingsResult.error
          );
        }

        if (contactResult.error) {
          console.error(
            "Hero contact info error:",
            contactResult.error
          );
        }

        if (settingsResult.data) {
          setSettings({
            site_name:
              settingsResult.data.site_name ||
              defaultSettings.site_name,

            hero_title:
              settingsResult.data.hero_title ||
              defaultSettings.hero_title,

            hero_subtitle:
              settingsResult.data.hero_subtitle ||
              defaultSettings.hero_subtitle,

            hero_button_text:
              settingsResult.data.hero_button_text ||
              defaultSettings.hero_button_text,

            hero_button_url:
              settingsResult.data.hero_button_url ||
              defaultSettings.hero_button_url,

            hero_image_url:
              settingsResult.data.hero_image_url ||
              defaultSettings.hero_image_url,
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
          "Failed to load hero data:",
          error
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHeroData();

    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappLink = useMemo(
    () => createWhatsAppLink(contact.whatsapp),
    [contact.whatsapp]
  );

  const primaryButtonUrl =
    settings.hero_button_url.trim() ||
    defaultSettings.hero_button_url;

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-r from-[#04153f] to-[#0b2d6b] text-white"
    >
      <div className="absolute inset-0">
        <img
          src={settings.hero_image_url}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-[#04153f]/55" />
      </div>

      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full border border-white/10" />

      <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full border border-white/10" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 font-bold tracking-widest text-[#e4a514]">
            {settings.site_name}
          </p>

          {loading ? (
            <div className="space-y-4">
              <div className="h-14 w-full max-w-xl animate-pulse rounded-2xl bg-white/10" />

              <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-white/10" />

              <div className="mt-6 h-24 w-full max-w-xl animate-pulse rounded-2xl bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                {settings.hero_title}
              </h1>

              <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-gray-200">
                {settings.hero_subtitle}
              </p>
            </>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            {isExternalLink(primaryButtonUrl) ? (
              <a
                href={primaryButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#c58a08] px-7 py-4 font-bold transition hover:bg-[#a66f00]"
              >
                {settings.hero_button_text}
              </a>
            ) : (
              <Link
                href={primaryButtonUrl}
                className="rounded-xl bg-[#c58a08] px-7 py-4 font-bold transition hover:bg-[#a66f00]"
              >
                {settings.hero_button_text}
              </Link>
            )}

            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white px-7 py-4 font-bold transition hover:bg-white hover:text-[#04153f]"
              >
                تواصل عبر واتساب
              </a>
            ) : (
              <Link
                href="/#services"
                className="rounded-xl border border-white px-7 py-4 font-bold transition hover:bg-white hover:text-[#04153f]"
              >
                خدماتنا
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex h-[310px] w-[310px] items-center justify-center rounded-full border-[5px] border-[#c58a08] bg-white/10 shadow-[0_0_60px_rgba(197,138,8,0.35)] backdrop-blur-md sm:h-[390px] sm:w-[390px] lg:h-[430px] lg:w-[430px]">
            <img
              src={settings.hero_image_url}
              alt={settings.site_name}
              className="h-[230px] w-[230px] rounded-full object-cover transition duration-500 hover:scale-105 sm:h-[290px] sm:w-[290px] lg:h-[320px] lg:w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}