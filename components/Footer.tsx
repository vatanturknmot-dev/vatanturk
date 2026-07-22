"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import {
  FaEnvelope,
  FaGlobe,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

import { supabase } from "@/lib/supabase";

type SiteSettings = {
  site_name: string;
  site_description: string;
  logo_url: string;
  logo_storage_path: string;
};

type ContactInfo = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
};

type SocialLink = {
  id: number | string;
  platform: string;
  title: string;
  url: string;
  is_active: boolean;
  display_order: number;
};

const defaultSettings: SiteSettings = {
  site_name: "VATAN TURK",
  site_description:
    "خدمات واستشارات تعليمية للطلاب الراغبين بالدراسة في تركيا.",
  logo_url: "",
  logo_storage_path: "",
};

const defaultContact: ContactInfo = {
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function getLogoUrl(settings: SiteSettings) {
  if (settings.logo_url) {
    return settings.logo_url;
  }

  if (!settings.logo_storage_path) {
    return "";
  }

  const { data } = supabase.storage
    .from("site-assets")
    .getPublicUrl(settings.logo_storage_path);

  return data.publicUrl;
}

function normalizeSocialLink(
  item: Record<string, unknown>,
  index: number
): SocialLink {
  return {
    id:
      typeof item.id === "number" ||
      typeof item.id === "string"
        ? item.id
        : index,

    platform:
      typeof item.platform === "string"
        ? item.platform
        : typeof item.name === "string"
          ? item.name
          : "website",

    title:
      typeof item.title === "string"
        ? item.title
        : typeof item.platform === "string"
          ? item.platform
          : "",

    url:
      typeof item.url === "string"
        ? item.url
        : typeof item.link === "string"
          ? item.link
          : "",

    is_active:
      typeof item.is_active === "boolean"
        ? item.is_active
        : true,

    display_order:
      typeof item.display_order === "number"
        ? item.display_order
        : index,
  };
}

function normalizeExternalUrl(url: string) {
  const value = url.trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  return `https://${value}`;
}

function getSocialIcon(platform: string) {
  const value = platform.toLowerCase().trim();

  if (
    value.includes("facebook") ||
    value.includes("فيس")
  ) {
    return <FaFacebookF />;
  }

  if (
    value.includes("instagram") ||
    value.includes("انستا")
  ) {
    return <FaInstagram />;
  }

  if (
    value === "x" ||
    value.includes("twitter") ||
    value.includes("تويتر")
  ) {
    return <FaXTwitter />;
  }

  if (
    value.includes("youtube") ||
    value.includes("يوتيوب")
  ) {
    return <FaYoutube />;
  }

  if (
    value.includes("tiktok") ||
    value.includes("تيك توك")
  ) {
    return <FaTiktok />;
  }

  if (
    value.includes("linkedin") ||
    value.includes("لينكد")
  ) {
    return <FaLinkedinIn />;
  }

  if (
    value.includes("telegram") ||
    value.includes("تلغرام") ||
    value.includes("تيليغرام")
  ) {
    return <FaTelegram />;
  }

  if (
    value.includes("whatsapp") ||
    value.includes("واتساب")
  ) {
    return <FaWhatsapp />;
  }

  return <FaGlobe />;
}

function getSocialName(platform: string) {
  const value = platform.toLowerCase().trim();

  if (value.includes("facebook")) return "Facebook";
  if (value.includes("instagram")) return "Instagram";
  if (value === "x" || value.includes("twitter"))
    return "X";
  if (value.includes("youtube")) return "YouTube";
  if (value.includes("tiktok")) return "TikTok";
  if (value.includes("linkedin")) return "LinkedIn";
  if (value.includes("telegram")) return "Telegram";
  if (value.includes("whatsapp")) return "WhatsApp";

  return platform || "رابط خارجي";
}

export default function Footer() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [contact, setContact] =
    useState<ContactInfo>(defaultContact);

  const [socialLinks, setSocialLinks] = useState<
    SocialLink[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFooterData() {
      setLoading(true);

      try {
        const [
          settingsResponse,
          contactResponse,
          socialResponse,
        ] = await Promise.all([
          supabase
            .from("site_settings")
            .select("*")
            .limit(1)
            .maybeSingle(),

          supabase
            .from("contact_info")
            .select("*")
            .limit(1)
            .maybeSingle(),

          supabase
            .from("social_links")
            .select("*"),
        ]);

        if (!isMounted) {
          return;
        }

        if (settingsResponse.error) {
          console.error(
            "Site settings error:",
            settingsResponse.error
          );
        }

        if (contactResponse.error) {
          console.error(
            "Contact info error:",
            contactResponse.error
          );
        }

        if (socialResponse.error) {
          console.error(
            "Social links error:",
            socialResponse.error
          );
        }

        const settingsData =
          settingsResponse.data as Record<
            string,
            unknown
          > | null;

        if (settingsData) {
          setSettings({
            site_name:
              typeof settingsData.site_name === "string"
                ? settingsData.site_name
                : defaultSettings.site_name,

            site_description:
              typeof settingsData.site_description ===
              "string"
                ? settingsData.site_description
                : defaultSettings.site_description,

            logo_url:
              typeof settingsData.logo_url === "string"
                ? settingsData.logo_url
                : "",

            logo_storage_path:
              typeof settingsData.logo_storage_path ===
              "string"
                ? settingsData.logo_storage_path
                : "",
          });
        }

        const contactData =
          contactResponse.data as Record<
            string,
            unknown
          > | null;

        if (contactData) {
          setContact({
            whatsapp:
              typeof contactData.whatsapp === "string"
                ? contactData.whatsapp
                : "",

            phone:
              typeof contactData.phone === "string"
                ? contactData.phone
                : "",

            email:
              typeof contactData.email === "string"
                ? contactData.email
                : "",

            address:
              typeof contactData.address === "string"
                ? contactData.address
                : "",
          });
        }

        const normalizedSocialLinks = (
          socialResponse.data ?? []
        )
          .map((item, index) =>
            normalizeSocialLink(
              item as Record<string, unknown>,
              index
            )
          )
          .filter((item) => item.is_active)
          .sort(
            (a, b) =>
              a.display_order - b.display_order
          );

        const contactWhatsapp =
          typeof contactData?.whatsapp === "string"
            ? contactData.whatsapp.replace(/\D/g, "")
            : "";

        const hasWhatsapp =
          normalizedSocialLinks.some((item) =>
            item.platform
              .toLowerCase()
              .includes("whatsapp")
          );

        if (contactWhatsapp && !hasWhatsapp) {
          normalizedSocialLinks.push({
            id: "contact-whatsapp",
            platform: "whatsapp",
            title: "WhatsApp",
            url: `https://wa.me/${contactWhatsapp}`,
            is_active: true,
            display_order: 999,
          });
        }

        setSocialLinks(normalizedSocialLinks);
      } catch (error) {
        console.error(
          "Footer loading error:",
          error
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFooterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const logoUrl = useMemo(
    () => getLogoUrl(settings),
    [settings]
  );

  const whatsappLink = useMemo(() => {
    const phone = normalizePhone(contact.whatsapp);

    return phone
      ? `https://wa.me/${phone}`
      : "";
  }, [contact.whatsapp]);

  const currentYear = new Date().getFullYear();

  const hasContactInfo =
    contact.phone ||
    contact.email ||
    contact.address ||
    contact.whatsapp;

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[#04153f] text-white"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c58a08]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#09245e] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a
              href="#"
              className="inline-flex items-center gap-4"
              aria-label="الصفحة الرئيسية"
            >
              {logoUrl ? (
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
                  <img
                    src={logoUrl}
                    alt={settings.site_name}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c58a08] text-2xl font-black">
                  VT
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black md:text-3xl">
                  {settings.site_name}
                </h2>

                <span className="mt-1 block text-sm font-bold text-[#e4a514]">
                  للدراسة والاستشارات التعليمية
                </span>
              </div>
            </a>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
              {settings.site_description}
            </p>

            {!loading &&
              socialLinks.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const socialUrl =
                      normalizeExternalUrl(social.url);

                    const socialName =
                      social.title ||
                      getSocialName(social.platform);

                    if (!socialUrl) {
                      return (
                        <span
                          key={social.id}
                          title={`${socialName} — أضف الرابط من لوحة التحكم`}
                          aria-label={socialName}
                          className="flex h-11 w-11 cursor-default items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white/60"
                        >
                          {getSocialIcon(
                            social.platform
                          )}
                        </span>
                      );
                    }

                    return (
                      <a
                        key={social.id}
                        href={socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={socialName}
                        aria-label={socialName}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white transition hover:-translate-y-1 hover:border-[#c58a08] hover:bg-[#c58a08]"
                      >
                        {getSocialIcon(
                          social.platform
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              روابط سريعة
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-[#c58a08]" />

            <nav className="mt-6 flex flex-col gap-4 text-white/65">
              <a
                href="#"
                className="transition hover:translate-x-[-4px] hover:text-[#e4a514]"
              >
                الصفحة الرئيسية
              </a>

              <a
                href="#services"
                className="transition hover:translate-x-[-4px] hover:text-[#e4a514]"
              >
                خدماتنا
              </a>

              <a
                href="#universities"
                className="transition hover:translate-x-[-4px] hover:text-[#e4a514]"
              >
                الجامعات
              </a>

              <a
                href="#gallery"
                className="transition hover:translate-x-[-4px] hover:text-[#e4a514]"
              >
                معرض الصور
              </a>

              <a
                href="#contact"
                className="transition hover:translate-x-[-4px] hover:text-[#e4a514]"
              >
                تواصل معنا
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              معلومات التواصل
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-[#c58a08]" />

            {hasContactInfo ? (
              <div className="mt-6 space-y-5">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(
                      /[^\d+]/g,
                      ""
                    )}`}
                    className="flex items-start gap-3 text-white/65 transition hover:text-white"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#e4a514]">
                      <FaPhone />
                    </span>

                    <span className="break-all leading-7">
                      {contact.phone}
                    </span>
                  </a>
                )}

                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-start gap-3 text-white/65 transition hover:text-white"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#e4a514]">
                      <FaEnvelope />
                    </span>

                    <span className="break-all leading-7">
                      {contact.email}
                    </span>
                  </a>
                )}

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-white/65 transition hover:text-white"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#e4a514]">
                      <FaWhatsapp />
                    </span>

                    <span className="break-all leading-7">
                      {contact.whatsapp}
                    </span>
                  </a>
                )}

                {contact.address && (
                  <div className="flex items-start gap-3 text-white/65">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#e4a514]">
                      <FaLocationDot />
                    </span>

                    <span className="leading-7">
                      {contact.address}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 leading-7 text-white/50">
                أضف معلومات التواصل من لوحة التحكم.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-white/50 md:flex-row">
            <p>
              © {currentYear}{" "}
              <span className="font-bold text-white/75">
                {settings.site_name}
              </span>
              . جميع الحقوق محفوظة.
            </p>

            <p>
              خدمات تعليمية للطلاب في تركيا
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}