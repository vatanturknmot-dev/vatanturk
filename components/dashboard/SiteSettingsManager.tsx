"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import {
  deleteSiteAsset,
  uploadSiteAsset,
} from "@/lib/storage";

type SiteSettings = {
  id: number;
  site_name: string;
  site_description: string;

  logo_url: string;
  logo_storage_path: string;

  favicon_url: string;
  favicon_storage_path: string;

  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_url: string;

  hero_image_url: string;
  hero_image_storage_path: string;

  created_at?: string;
  updated_at?: string;
};

type ErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

type UploadType = "logo" | "favicon" | "hero";

const defaultSettings: SiteSettings = {
  id: 1,
  site_name: "VATAN TURK",
  site_description: "",

  logo_url: "",
  logo_storage_path: "",

  favicon_url: "",
  favicon_storage_path: "",

  hero_title: "",
  hero_subtitle: "",
  hero_button_text: "",
  hero_button_url: "",

  hero_image_url: "",
  hero_image_storage_path: "",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const currentError = error as ErrorLike;

    const messages = [
      currentError.message,
      currentError.details,
      currentError.hint,
      currentError.code
        ? `رمز الخطأ: ${currentError.code}`
        : "",
    ].filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "حدث خطأ غير معروف.";
}

function validateImageFile(file: File): string | null {
  if (!allowedImageTypes.includes(file.type)) {
    return "نوع الملف غير مدعوم. اختر JPG أو PNG أو WEBP أو GIF.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "حجم الصورة أكبر من 10 ميغابايت.";
  }

  return null;
}

export default function SiteSettingsManager() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [faviconFile, setFaviconFile] =
    useState<File | null>(null);

  const [heroImageFile, setHeroImageFile] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [faviconPreview, setFaviconPreview] =
    useState("");

  const [heroImagePreview, setHeroImagePreview] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingType, setUploadingType] =
    useState<UploadType | null>(null);

  const [deletingType, setDeletingType] =
    useState<UploadType | null>(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          `
          id,
          site_name,
          site_description,
          logo_url,
          logo_storage_path,
          favicon_url,
          favicon_storage_path,
          hero_title,
          hero_subtitle,
          hero_button_text,
          hero_button_url,
          hero_image_url,
          hero_image_storage_path,
          created_at,
          updated_at
        `
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          "لم يتم العثور على سجل إعدادات الموقع برقم 1."
        );
      }

      const loadedSettings: SiteSettings = {
        id: Number(data.id),

        site_name: data.site_name ?? "",
        site_description:
          data.site_description ?? "",

        logo_url: data.logo_url ?? "",
        logo_storage_path:
          data.logo_storage_path ?? "",

        favicon_url: data.favicon_url ?? "",
        favicon_storage_path:
          data.favicon_storage_path ?? "",

        hero_title: data.hero_title ?? "",
        hero_subtitle:
          data.hero_subtitle ?? "",
        hero_button_text:
          data.hero_button_text ?? "",
        hero_button_url:
          data.hero_button_url ?? "",

        hero_image_url:
          data.hero_image_url ?? "",
        hero_image_storage_path:
          data.hero_image_storage_path ?? "",

        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setSettings(loadedSettings);

      setLogoPreview(loadedSettings.logo_url);
      setFaviconPreview(
        loadedSettings.favicon_url
      );
      setHeroImagePreview(
        loadedSettings.hero_image_url
      );

      setLogoFile(null);
      setFaviconFile(null);
      setHeroImageFile(null);
    } catch (error) {
      console.error(
        "خطأ في تحميل إعدادات الموقع:",
        error
      );

      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    return () => {
      if (
        logoPreview &&
        logoPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(logoPreview);
      }

      if (
        faviconPreview &&
        faviconPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          faviconPreview
        );
      }

      if (
        heroImagePreview &&
        heroImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          heroImagePreview
        );
      }
    };
  }, [
    logoPreview,
    faviconPreview,
    heroImagePreview,
  ]);

  function updateField(
    field: keyof SiteSettings,
    value: string
  ) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>,
    type: UploadType
  ) {
    setSuccessMessage("");
    setErrorMessage("");

    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const validationError =
      validateImageFile(file);

    if (validationError) {
      setErrorMessage(validationError);
      event.target.value = "";
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    if (type === "logo") {
      if (
        logoPreview &&
        logoPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(previewUrl);
    }

    if (type === "favicon") {
      if (
        faviconPreview &&
        faviconPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          faviconPreview
        );
      }

      setFaviconFile(file);
      setFaviconPreview(previewUrl);
    }

    if (type === "hero") {
      if (
        heroImagePreview &&
        heroImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          heroImagePreview
        );
      }

      setHeroImageFile(file);
      setHeroImagePreview(previewUrl);
    }
  }

  async function uploadImage(
    type: UploadType
  ) {
    setSuccessMessage("");
    setErrorMessage("");

    let selectedFile: File | null = null;
    let folder = "";
    let oldStoragePath = "";

    if (type === "logo") {
      selectedFile = logoFile;
      folder = "logos";
      oldStoragePath =
        settings.logo_storage_path;
    }

    if (type === "favicon") {
      selectedFile = faviconFile;
      folder = "favicons";
      oldStoragePath =
        settings.favicon_storage_path;
    }

    if (type === "hero") {
      selectedFile = heroImageFile;
      folder = "hero";
      oldStoragePath =
        settings.hero_image_storage_path;
    }

    if (!selectedFile) {
      setErrorMessage(
        "اختر صورة أولًا قبل الضغط على رفع."
      );
      return;
    }

    setUploadingType(type);

    try {
      const uploaded =
        await uploadSiteAsset(
          selectedFile,
          folder
        );

      const updateData =
        type === "logo"
          ? {
              logo_url: uploaded.url,
              logo_storage_path:
                uploaded.path,
              updated_at:
                new Date().toISOString(),
            }
          : type === "favicon"
            ? {
                favicon_url:
                  uploaded.url,
                favicon_storage_path:
                  uploaded.path,
                updated_at:
                  new Date().toISOString(),
              }
            : {
                hero_image_url:
                  uploaded.url,
                hero_image_storage_path:
                  uploaded.path,
                updated_at:
                  new Date().toISOString(),
              };

      const { error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", 1);

      if (error) {
        await deleteSiteAsset(
          uploaded.path
        );

        throw error;
      }

      if (
        oldStoragePath &&
        oldStoragePath !== uploaded.path
      ) {
        await deleteSiteAsset(
          oldStoragePath
        );
      }

      if (type === "logo") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            logo_url: uploaded.url,
            logo_storage_path:
              uploaded.path,
          })
        );

        setLogoPreview(uploaded.url);
        setLogoFile(null);

        const input =
          document.getElementById(
            "logo-file"
          ) as HTMLInputElement | null;

        if (input) {
          input.value = "";
        }
      }

      if (type === "favicon") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            favicon_url:
              uploaded.url,
            favicon_storage_path:
              uploaded.path,
          })
        );

        setFaviconPreview(uploaded.url);
        setFaviconFile(null);

        const input =
          document.getElementById(
            "favicon-file"
          ) as HTMLInputElement | null;

        if (input) {
          input.value = "";
        }
      }

      if (type === "hero") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            hero_image_url:
              uploaded.url,
            hero_image_storage_path:
              uploaded.path,
          })
        );

        setHeroImagePreview(
          uploaded.url
        );
        setHeroImageFile(null);

        const input =
          document.getElementById(
            "hero-image-file"
          ) as HTMLInputElement | null;

        if (input) {
          input.value = "";
        }
      }

      setSuccessMessage(
        type === "logo"
          ? "تم رفع الشعار بنجاح."
          : type === "favicon"
            ? "تم رفع Favicon بنجاح."
            : "تم رفع صورة الواجهة الرئيسية بنجاح."
      );
    } catch (error) {
      console.error(
        "خطأ في رفع الصورة:",
        error
      );

      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setUploadingType(null);
    }
  }

  async function deleteImage(
    type: UploadType
  ) {
    const title =
      type === "logo"
        ? "الشعار"
        : type === "favicon"
          ? "Favicon"
          : "صورة الواجهة الرئيسية";

    const confirmed =
      window.confirm(
        `هل تريد حذف ${title} نهائيًا؟`
      );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setDeletingType(type);

    try {
      let storagePath = "";

      if (type === "logo") {
        storagePath =
          settings.logo_storage_path;
      }

      if (type === "favicon") {
        storagePath =
          settings.favicon_storage_path;
      }

      if (type === "hero") {
        storagePath =
          settings.hero_image_storage_path;
      }

      const updateData =
        type === "logo"
          ? {
              logo_url: "",
              logo_storage_path: "",
              updated_at:
                new Date().toISOString(),
            }
          : type === "favicon"
            ? {
                favicon_url: "",
                favicon_storage_path:
                  "",
                updated_at:
                  new Date().toISOString(),
              }
            : {
                hero_image_url: "",
                hero_image_storage_path:
                  "",
                updated_at:
                  new Date().toISOString(),
              };

      const { error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", 1);

      if (error) {
        throw error;
      }

      if (storagePath) {
        await deleteSiteAsset(
          storagePath
        );
      }

      if (type === "logo") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            logo_url: "",
            logo_storage_path: "",
          })
        );

        setLogoPreview("");
        setLogoFile(null);
      }

      if (type === "favicon") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            favicon_url: "",
            favicon_storage_path: "",
          })
        );

        setFaviconPreview("");
        setFaviconFile(null);
      }

      if (type === "hero") {
        setSettings(
          (currentSettings) => ({
            ...currentSettings,
            hero_image_url: "",
            hero_image_storage_path:
              "",
          })
        );

        setHeroImagePreview("");
        setHeroImageFile(null);
      }

      setSuccessMessage(
        `تم حذف ${title} بنجاح.`
      );
    } catch (error) {
      console.error(
        "خطأ في حذف الصورة:",
        error
      );

      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setDeletingType(null);
    }
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!settings.site_name.trim()) {
      setErrorMessage(
        "اسم الموقع مطلوب."
      );
      return;
    }

    if (!settings.hero_title.trim()) {
      setErrorMessage(
        "عنوان الصفحة الرئيسية مطلوب."
      );
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          site_name:
            settings.site_name.trim(),

          site_description:
            settings.site_description.trim(),

          hero_title:
            settings.hero_title.trim(),

          hero_subtitle:
            settings.hero_subtitle.trim(),

          hero_button_text:
            settings.hero_button_text.trim(),

          hero_button_url:
            settings.hero_button_url.trim(),

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "تم حفظ إعدادات الموقع بنجاح."
      );
    } catch (error) {
      console.error(
        "خطأ في حفظ إعدادات الموقع:",
        error
      );

      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[300px] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#c58a08]" />

          <p className="mt-4 font-medium text-gray-600">
            جاري تحميل إعدادات الموقع...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="text-[#04153f]"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          إعدادات الموقع
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          عدّل معلومات الموقع ومحتوى الصفحة
          الرئيسية والشعار والصور.
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">
            تعذر تنفيذ العملية
          </p>

          <p className="mt-1 break-words text-sm">
            {errorMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid gap-6">
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-xl font-bold">
              المعلومات الأساسية
            </h3>

            <div className="mt-5 grid gap-5">
              <div>
                <label
                  htmlFor="site-name"
                  className="mb-2 block font-bold"
                >
                  اسم الموقع
                </label>

                <input
                  id="site-name"
                  type="text"
                  value={
                    settings.site_name
                  }
                  onChange={(event) =>
                    updateField(
                      "site_name",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="site-description"
                  className="mb-2 block font-bold"
                >
                  وصف الموقع
                </label>

                <textarea
                  id="site-description"
                  rows={4}
                  value={
                    settings.site_description
                  }
                  onChange={(event) =>
                    updateField(
                      "site_description",
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-xl font-bold">
              الواجهة الرئيسية Hero
            </h3>

            <div className="mt-5 grid gap-5">
              <div>
                <label
                  htmlFor="hero-title"
                  className="mb-2 block font-bold"
                >
                  العنوان الرئيسي
                </label>

                <input
                  id="hero-title"
                  type="text"
                  value={
                    settings.hero_title
                  }
                  onChange={(event) =>
                    updateField(
                      "hero_title",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="hero-subtitle"
                  className="mb-2 block font-bold"
                >
                  النص الفرعي
                </label>

                <textarea
                  id="hero-subtitle"
                  rows={3}
                  value={
                    settings.hero_subtitle
                  }
                  onChange={(event) =>
                    updateField(
                      "hero_subtitle",
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="hero-button-text"
                    className="mb-2 block font-bold"
                  >
                    نص الزر
                  </label>

                  <input
                    id="hero-button-text"
                    type="text"
                    value={
                      settings.hero_button_text
                    }
                    onChange={(event) =>
                      updateField(
                        "hero_button_text",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hero-button-url"
                    className="mb-2 block font-bold"
                  >
                    رابط الزر
                  </label>

                  <input
                    id="hero-button-url"
                    type="text"
                    dir="ltr"
                    value={
                      settings.hero_button_url
                    }
                    onChange={(event) =>
                      updateField(
                        "hero_button_url",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-5">
              <h3 className="text-xl font-bold">
                الصور والشعار
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                ارفع الشعار وFavicon وصورة
                الواجهة الرئيسية.
              </p>
            </div>

            <div className="grid gap-6">
              <AssetUploader
                title="شعار الموقع"
                description="يفضل استخدام شعار PNG أو WEBP بخلفية شفافة."
                inputId="logo-file"
                previewUrl={logoPreview}
                selectedFile={logoFile}
                previewClassName="h-40 object-contain"
                uploading={
                  uploadingType === "logo"
                }
                deleting={
                  deletingType === "logo"
                }
                hasSavedImage={
                  Boolean(
                    settings.logo_url
                  )
                }
                onChange={(event) =>
                  handleImageSelection(
                    event,
                    "logo"
                  )
                }
                onUpload={() =>
                  uploadImage("logo")
                }
                onDelete={() =>
                  deleteImage("logo")
                }
              />

              <AssetUploader
                title="Favicon"
                description="الأفضل صورة مربعة مثل 512×512 بكسل."
                inputId="favicon-file"
                previewUrl={
                  faviconPreview
                }
                selectedFile={
                  faviconFile
                }
                previewClassName="h-24 w-24 object-contain"
                uploading={
                  uploadingType ===
                  "favicon"
                }
                deleting={
                  deletingType ===
                  "favicon"
                }
                hasSavedImage={
                  Boolean(
                    settings.favicon_url
                  )
                }
                onChange={(event) =>
                  handleImageSelection(
                    event,
                    "favicon"
                  )
                }
                onUpload={() =>
                  uploadImage("favicon")
                }
                onDelete={() =>
                  deleteImage("favicon")
                }
              />

              <AssetUploader
                title="صورة الواجهة الرئيسية"
                description="يفضل استخدام صورة أفقية عالية الجودة."
                inputId="hero-image-file"
                previewUrl={
                  heroImagePreview
                }
                selectedFile={
                  heroImageFile
                }
                previewClassName="h-64 w-full object-cover"
                uploading={
                  uploadingType === "hero"
                }
                deleting={
                  deletingType === "hero"
                }
                hasSavedImage={
                  Boolean(
                    settings.hero_image_url
                  )
                }
                onChange={(event) =>
                  handleImageSelection(
                    event,
                    "hero"
                  )
                }
                onUpload={() =>
                  uploadImage("hero")
                }
                onDelete={() =>
                  deleteImage("hero")
                }
              />
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={
              saving ||
              uploadingType !== null ||
              deletingType !== null
            }
            className="rounded-xl bg-[#c58a08] px-8 py-3 font-bold text-white transition hover:bg-[#a97407] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "جاري حفظ الإعدادات..."
              : "حفظ الإعدادات النصية"}
          </button>

          <button
            type="button"
            onClick={loadSettings}
            disabled={
              saving ||
              uploadingType !== null ||
              deletingType !== null
            }
            className="rounded-xl border border-[#04153f] bg-white px-8 py-3 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white disabled:opacity-60"
          >
            إعادة تحميل البيانات
          </button>
        </div>
      </form>
    </div>
  );
}

type AssetUploaderProps = {
  title: string;
  description: string;
  inputId: string;
  previewUrl: string;
  selectedFile: File | null;
  previewClassName: string;
  uploading: boolean;
  deleting: boolean;
  hasSavedImage: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onUpload: () => void;
  onDelete: () => void;
};

function AssetUploader({
  title,
  description,
  inputId,
  previewUrl,
  selectedFile,
  previewClassName,
  uploading,
  deleting,
  hasSavedImage,
  onChange,
  onUpload,
  onDelete,
}: AssetUploaderProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#04153f]">
          {title}
        </h4>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      {previewUrl ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
          <img
            src={previewUrl}
            alt={title}
            className={`mx-auto rounded-lg ${previewClassName}`}
          />
        </div>
      ) : (
        <div className="mb-4 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="text-4xl">
              🖼️
            </div>

            <p className="mt-2 text-sm">
              لا توجد صورة حاليًا
            </p>
          </div>
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onChange}
        className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] file:ml-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#04153f] file:px-4 file:py-2 file:font-bold file:text-white"
      />

      {selectedFile && (
        <p className="mt-3 text-sm text-gray-600">
          الملف المختار:{" "}
          <span className="font-bold">
            {selectedFile.name}
          </span>
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onUpload}
          disabled={
            !selectedFile ||
            uploading ||
            deleting
          }
          className="rounded-xl bg-[#c58a08] px-6 py-3 font-bold text-white transition hover:bg-[#a97407] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "جاري الرفع..."
            : "رفع وحفظ"}
        </button>

        {hasSavedImage && (
          <button
            type="button"
            onClick={onDelete}
            disabled={
              uploading || deleting
            }
            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? "جاري الحذف..."
              : "حذف الصورة"}
          </button>
        )}
      </div>
    </div>
  );
}