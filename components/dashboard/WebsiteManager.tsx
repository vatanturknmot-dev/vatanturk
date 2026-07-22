"use client";

import { useState } from "react";
import ContactManager from "./ContactManager";
import GalleryManager from "./GalleryManager";
import SocialLinksManager from "./SocialLinksManager";
import SiteSettingsManager from "./SiteSettingsManager";

type WebsiteTab =
  | "settings"
  | "contact"
  | "social"
  | "gallery";

export default function WebsiteManager() {
  const [tab, setTab] =
    useState<WebsiteTab>("settings");

  const tabButtonClass = (
    currentTab: WebsiteTab
  ) =>
    `rounded-xl p-4 font-bold transition ${
      tab === currentTab
        ? "bg-[#04153f] text-white shadow"
        : "bg-white text-[#04153f] shadow hover:bg-gray-50"
    }`;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-[#04153f]">
          إدارة الموقع
        </h1>

        <p className="mt-2 text-gray-600">
          يمكنك إدارة معلومات الموقع وبيانات
          التواصل والروابط والصور من هنا.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setTab("settings")}
          className={tabButtonClass("settings")}
        >
          🏠 إعدادات الموقع
        </button>

        <button
          type="button"
          onClick={() => setTab("contact")}
          className={tabButtonClass("contact")}
        >
          📞 معلومات التواصل
        </button>

        <button
          type="button"
          onClick={() => setTab("social")}
          className={tabButtonClass("social")}
        >
          🌐 وسائل التواصل
        </button>

        <button
          type="button"
          onClick={() => setTab("gallery")}
          className={tabButtonClass("gallery")}
        >
          🖼️ ألبوم الصور
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        {tab === "settings" && (
          <SiteSettingsManager />
        )}

        {tab === "contact" && <ContactManager />}

        {tab === "social" && (
          <SocialLinksManager />
        )}

        {tab === "gallery" && <GalleryManager />}
      </div>
    </div>
  );
}