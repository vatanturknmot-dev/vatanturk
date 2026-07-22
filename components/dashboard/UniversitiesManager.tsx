"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaBuildingColumns,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPen,
  FaPlus,
  FaRotate,
  FaTrash,
  FaUpload,
  FaXmark,
} from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

type UniversityType = "private" | "public";

type University = {
  id: number;
  name_ar: string;
  name_tr: string;
  slug: string;
  city: string;
  university_type: UniversityType;
  short_description: string;
  description: string;
  image_url: string;
  image_storage_path: string;
  logo_url: string;
  logo_storage_path: string;
  tuition_min: number | null;
  tuition_max: number | null;
  currency: string;
  application_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

type UniversityForm = Omit<
  University,
  "id" | "created_at" | "updated_at"
>;

type ErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

const emptyForm: UniversityForm = {
  name_ar: "",
  name_tr: "",
  slug: "",
  city: "",
  university_type: "private",
  short_description: "",
  description: "",
  image_url: "",
  image_storage_path: "",
  logo_url: "",
  logo_storage_path: "",
  tuition_min: null,
  tuition_max: null,
  currency: "USD",
  application_url: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const currentError = error as ErrorLike;

    const values = [
      currentError.message,
      currentError.details,
      currentError.hint,
      currentError.code ? `رمز الخطأ: ${currentError.code}` : "",
    ].filter(Boolean);

    if (values.length > 0) {
      return values.join(" — ");
    }
  }

  return "حدث خطأ غير معروف.";
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\u0600-\u06ffa-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeExternalUrl(value: string): string {
  const url = value.trim();

  if (!url) {
    return "";
  }

  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  return `https://${url}`;
}

function getPublicUniversityAssetUrl(path: string): string {
  if (!path) {
    return "";
  }

  const { data } = supabase.storage
    .from("universities")
    .getPublicUrl(path);

  return data.publicUrl;
}

async function uploadUniversityAsset(
  file: File,
  folder: "images" | "logos"
): Promise<{ publicUrl: string; storagePath: string }> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
  const storagePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("universities")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    publicUrl: getPublicUniversityAssetUrl(storagePath),
    storagePath,
  };
}

async function deleteUniversityAsset(path: string): Promise<void> {
  if (!path) {
    return;
  }

  const { error } = await supabase.storage
    .from("universities")
    .remove([path]);

  if (error) {
    console.error("تعذر حذف الملف من Storage:", error);
  }
}

function mapUniversity(row: Record<string, unknown>): University {
  return {
    id: Number(row.id),
    name_ar: typeof row.name_ar === "string" ? row.name_ar : "",
    name_tr: typeof row.name_tr === "string" ? row.name_tr : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    city: typeof row.city === "string" ? row.city : "",
    university_type:
      row.university_type === "public" ? "public" : "private",
    short_description:
      typeof row.short_description === "string"
        ? row.short_description
        : "",
    description:
      typeof row.description === "string" ? row.description : "",
    image_url: typeof row.image_url === "string" ? row.image_url : "",
    image_storage_path:
      typeof row.image_storage_path === "string"
        ? row.image_storage_path
        : "",
    logo_url: typeof row.logo_url === "string" ? row.logo_url : "",
    logo_storage_path:
      typeof row.logo_storage_path === "string"
        ? row.logo_storage_path
        : "",
    tuition_min:
      typeof row.tuition_min === "number"
        ? row.tuition_min
        : row.tuition_min !== null && row.tuition_min !== undefined
          ? Number(row.tuition_min)
          : null,
    tuition_max:
      typeof row.tuition_max === "number"
        ? row.tuition_max
        : row.tuition_max !== null && row.tuition_max !== undefined
          ? Number(row.tuition_max)
          : null,
    currency: typeof row.currency === "string" ? row.currency : "USD",
    application_url:
      typeof row.application_url === "string" ? row.application_url : "",
    is_featured:
      typeof row.is_featured === "boolean" ? row.is_featured : false,
    is_active: typeof row.is_active === "boolean" ? row.is_active : true,
    display_order:
      typeof row.display_order === "number"
        ? row.display_order
        : Number(row.display_order ?? 0),
    created_at:
      typeof row.created_at === "string" ? row.created_at : undefined,
    updated_at:
      typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

export default function UniversitiesManager() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [form, setForm] = useState<UniversityForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadUniversities = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setUniversities(
        (data ?? []).map((row) =>
          mapUniversity(row as Record<string, unknown>)
        )
      );
    } catch (error) {
      console.error("خطأ تحميل الجامعات:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [imagePreview, logoPreview]);

  const editingUniversity = useMemo(
    () =>
      editingId === null
        ? null
        : universities.find((item) => item.id === editingId) ?? null,
    [editingId, universities]
  );

  function updateForm<K extends keyof UniversityForm>(
    field: K,
    value: UniversityForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  function resetForm() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setLogoFile(null);
    setImagePreview("");
    setLogoPreview("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  function startEdit(university: University) {
    setEditingId(university.id);

    setForm({
      name_ar: university.name_ar,
      name_tr: university.name_tr,
      slug: university.slug,
      city: university.city,
      university_type: university.university_type,
      short_description: university.short_description,
      description: university.description,
      image_url: university.image_url,
      image_storage_path: university.image_storage_path,
      logo_url: university.logo_url,
      logo_storage_path: university.logo_storage_path,
      tuition_min: university.tuition_min,
      tuition_max: university.tuition_max,
      currency: university.currency,
      application_url: university.application_url,
      is_featured: university.is_featured,
      is_active: university.is_active,
      display_order: university.display_order,
    });

    setImageFile(null);
    setLogoFile(null);
    setImagePreview(
      university.image_url ||
        getPublicUniversityAssetUrl(university.image_storage_path)
    );
    setLogoPreview(
      university.logo_url ||
        getPublicUniversityAssetUrl(university.logo_storage_path)
    );

    setSuccessMessage("");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>,
    type: "image" | "logo"
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("يجب اختيار ملف صورة صالح.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("حجم الصورة يجب ألا يتجاوز 8 ميغابايت.");
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    if (type === "image") {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(preview);
    } else {
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(preview);
    }

    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const nameAr = form.name_ar.trim();
    const slug = createSlug(form.slug || form.name_tr || nameAr);

    if (!nameAr) {
      setErrorMessage("اسم الجامعة بالعربية مطلوب.");
      return;
    }

    if (!slug) {
      setErrorMessage("الرابط المختصر Slug غير صالح.");
      return;
    }

    if (
      form.tuition_min !== null &&
      form.tuition_max !== null &&
      form.tuition_min > form.tuition_max
    ) {
      setErrorMessage(
        "الحد الأدنى للرسوم لا يمكن أن يكون أكبر من الحد الأعلى."
      );
      return;
    }

    setSaving(true);

    let uploadedImagePath = "";
    let uploadedLogoPath = "";

    try {
      let nextImageUrl = form.image_url;
      let nextImagePath = form.image_storage_path;
      let nextLogoUrl = form.logo_url;
      let nextLogoPath = form.logo_storage_path;

      if (imageFile) {
        const uploaded = await uploadUniversityAsset(imageFile, "images");
        uploadedImagePath = uploaded.storagePath;
        nextImageUrl = uploaded.publicUrl;
        nextImagePath = uploaded.storagePath;
      }

      if (logoFile) {
        const uploaded = await uploadUniversityAsset(logoFile, "logos");
        uploadedLogoPath = uploaded.storagePath;
        nextLogoUrl = uploaded.publicUrl;
        nextLogoPath = uploaded.storagePath;
      }

      const payload = {
        name_ar: nameAr,
        name_tr: form.name_tr.trim(),
        slug,
        city: form.city.trim(),
        university_type: form.university_type,
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        image_url: nextImageUrl,
        image_storage_path: nextImagePath,
        logo_url: nextLogoUrl,
        logo_storage_path: nextLogoPath,
        tuition_min: form.tuition_min,
        tuition_max: form.tuition_max,
        currency: form.currency.trim() || "USD",
        application_url: normalizeExternalUrl(form.application_url),
        is_featured: form.is_featured,
        is_active: form.is_active,
        display_order: form.display_order,
        updated_at: new Date().toISOString(),
      };

      if (editingId === null) {
        const { data, error } = await supabase
          .from("universities")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        if (!data?.id) {
          throw new Error(
            "لم تتم إضافة الجامعة. تحقق من صلاحيات Supabase."
          );
        }

        setSuccessMessage("تمت إضافة الجامعة بنجاح.");
      } else {
        const { data, error } = await supabase
          .from("universities")
          .update(payload)
          .eq("id", editingId)
          .select("id");

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          throw new Error(
            "لم يتم تعديل الجامعة. تحقق من صلاحيات Supabase."
          );
        }

        if (
          imageFile &&
          editingUniversity?.image_storage_path &&
          editingUniversity.image_storage_path !== nextImagePath
        ) {
          await deleteUniversityAsset(
            editingUniversity.image_storage_path
          );
        }

        if (
          logoFile &&
          editingUniversity?.logo_storage_path &&
          editingUniversity.logo_storage_path !== nextLogoPath
        ) {
          await deleteUniversityAsset(
            editingUniversity.logo_storage_path
          );
        }

        setSuccessMessage("تم تعديل الجامعة بنجاح.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      setLogoFile(null);
      setImagePreview("");
      setLogoPreview("");

      await loadUniversities();
    } catch (error) {
      if (uploadedImagePath) {
        await deleteUniversityAsset(uploadedImagePath);
      }

      if (uploadedLogoPath) {
        await deleteUniversityAsset(uploadedLogoPath);
      }

      console.error("خطأ حفظ الجامعة:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(university: University) {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف جامعة "${university.name_ar}"؟`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(university.id);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("universities")
        .delete()
        .eq("id", university.id)
        .select("id");

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error(
          "لم يتم حذف الجامعة. تحقق من صلاحيات Supabase."
        );
      }

      await Promise.all([
        deleteUniversityAsset(university.image_storage_path),
        deleteUniversityAsset(university.logo_storage_path),
      ]);

      if (editingId === university.id) {
        resetForm();
      }

      setSuccessMessage("تم حذف الجامعة بنجاح.");
      await loadUniversities();
    } catch (error) {
      console.error("خطأ حذف الجامعة:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleUniversity(
    university: University,
    field: "is_active" | "is_featured"
  ) {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const nextValue = !university[field];

      const { data, error } = await supabase
        .from("universities")
        .update({
          [field]: nextValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", university.id)
        .select("id");

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error(
          "لم يتم تعديل الحالة. تحقق من صلاحيات Supabase."
        );
      }

      await loadUniversities();
    } catch (error) {
      console.error("خطأ تعديل الحالة:", error);
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <div dir="rtl" className="space-y-8 text-[#04153f]">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-7 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black">
              <FaBuildingColumns className="text-[#c58a08]" />
              {editingId === null ? "إضافة جامعة جديدة" : "تعديل الجامعة"}
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-600">
              أضف بيانات الجامعة وصورتها وشعارها ورسومها ورابط التقديم.
            </p>
          </div>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <FaXmark />
              إلغاء التعديل
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-bold text-green-700">
            <FaCheck />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <p className="font-black">تعذر تنفيذ العملية</p>
            <p className="mt-1 break-words text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="اسم الجامعة بالعربية" required>
              <input
                value={form.name_ar}
                onChange={(event) => {
                  const value = event.target.value;
                  updateForm("name_ar", value);

                  if (!editingId && !form.slug.trim()) {
                    updateForm("slug", createSlug(value));
                  }
                }}
                className={inputClassName}
                placeholder="مثال: جامعة إسطنبول ميديبول"
                required
              />
            </Field>

            <Field label="اسم الجامعة بالتركية">
              <input
                value={form.name_tr}
                onChange={(event) =>
                  updateForm("name_tr", event.target.value)
                }
                className={inputClassName}
                placeholder="İstanbul Medipol Üniversitesi"
              />
            </Field>

            <Field label="الرابط المختصر Slug" required>
              <input
                dir="ltr"
                value={form.slug}
                onChange={(event) =>
                  updateForm("slug", createSlug(event.target.value))
                }
                className={`${inputClassName} text-left`}
                placeholder="istanbul-medipol-university"
                required
              />
            </Field>

            <Field label="المدينة">
              <input
                value={form.city}
                onChange={(event) =>
                  updateForm("city", event.target.value)
                }
                className={inputClassName}
                placeholder="إسطنبول"
              />
            </Field>

            <Field label="نوع الجامعة">
              <select
                value={form.university_type}
                onChange={(event) =>
                  updateForm(
                    "university_type",
                    event.target.value as UniversityType
                  )
                }
                className={inputClassName}
              >
                <option value="private">خاصة</option>
                <option value="public">حكومية</option>
              </select>
            </Field>

            <Field label="ترتيب العرض">
              <input
                type="number"
                value={form.display_order}
                onChange={(event) =>
                  updateForm(
                    "display_order",
                    Number(event.target.value) || 0
                  )
                }
                className={inputClassName}
                min="0"
              />
            </Field>
          </div>

          <Field label="الوصف المختصر">
            <textarea
              value={form.short_description}
              onChange={(event) =>
                updateForm("short_description", event.target.value)
              }
              className={`${inputClassName} min-h-28 resize-y`}
              placeholder="وصف مختصر يظهر في بطاقة الجامعة..."
            />
          </Field>

          <Field label="الوصف الكامل">
            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className={`${inputClassName} min-h-44 resize-y`}
              placeholder="تفاصيل الجامعة، المميزات، البرامج والخدمات..."
            />
          </Field>

          <div className="grid gap-6 lg:grid-cols-2">
            <ImageUploadBox
              title="صورة الجامعة"
              preview={imagePreview || form.image_url}
              inputId="university-main-image"
              onChange={(event) =>
                handleImageSelection(event, "image")
              }
              onRemove={() => {
                setImageFile(null);
                setImagePreview("");
                updateForm("image_url", "");
                updateForm("image_storage_path", "");
              }}
            />

            <ImageUploadBox
              title="شعار الجامعة"
              preview={logoPreview || form.logo_url}
              inputId="university-logo"
              onChange={(event) =>
                handleImageSelection(event, "logo")
              }
              onRemove={() => {
                setLogoFile(null);
                setLogoPreview("");
                updateForm("logo_url", "");
                updateForm("logo_storage_path", "");
              }}
              contain
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="الحد الأدنى للرسوم">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tuition_min ?? ""}
                onChange={(event) =>
                  updateForm(
                    "tuition_min",
                    normalizeNumber(event.target.value)
                  )
                }
                className={inputClassName}
                placeholder="3000"
              />
            </Field>

            <Field label="الحد الأعلى للرسوم">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tuition_max ?? ""}
                onChange={(event) =>
                  updateForm(
                    "tuition_max",
                    normalizeNumber(event.target.value)
                  )
                }
                className={inputClassName}
                placeholder="12000"
              />
            </Field>

            <Field label="العملة">
              <select
                value={form.currency}
                onChange={(event) =>
                  updateForm("currency", event.target.value)
                }
                className={inputClassName}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </Field>
          </div>

          <Field label="رابط التقديم">
            <input
              type="url"
              dir="ltr"
              value={form.application_url}
              onChange={(event) =>
                updateForm("application_url", event.target.value)
              }
              className={`${inputClassName} text-left`}
              placeholder="https://example.com/apply"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <ToggleCard
              title="إظهار الجامعة في الموقع"
              description="عند تعطيلها لن تظهر الجامعة للزوار."
              checked={form.is_active}
              onChange={(checked) =>
                updateForm("is_active", checked)
              }
            />

            <ToggleCard
              title="جامعة مميزة"
              description="تظهر ضمن الجامعات المميزة في الصفحة الرئيسية."
              checked={form.is_featured}
              onChange={(checked) =>
                updateForm("is_featured", checked)
              }
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#c58a08] px-8 py-4 font-black text-white transition hover:bg-[#a97407] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FaRotate className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : editingId === null ? (
                <>
                  <FaPlus />
                  إضافة الجامعة
                </>
              ) : (
                <>
                  <FaCheck />
                  حفظ التعديلات
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="rounded-xl border border-[#04153f] bg-white px-8 py-4 font-black text-[#04153f] transition hover:bg-[#04153f] hover:text-white disabled:opacity-60"
            >
              تنظيف الحقول
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">الجامعات المضافة</h2>
            <p className="mt-2 text-sm text-gray-600">
              عدد الجامعات: {universities.length}
            </p>
          </div>

          <button
            type="button"
            onClick={loadUniversities}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <FaRotate className={loading ? "animate-spin" : ""} />
            تحديث القائمة
          </button>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-gray-100"
              />
            ))}
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 px-6 py-16 text-center">
            <FaBuildingColumns className="mx-auto text-5xl text-gray-300" />
            <h3 className="mt-5 text-xl font-black">
              لا توجد جامعات بعد
            </h3>
            <p className="mt-2 text-gray-500">
              استخدم النموذج أعلاه لإضافة أول جامعة.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {universities.map((university) => {
              const cover =
                university.image_url ||
                getPublicUniversityAssetUrl(
                  university.image_storage_path
                );

              const logo =
                university.logo_url ||
                getPublicUniversityAssetUrl(
                  university.logo_storage_path
                );

              return (
                <article
                  key={university.id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative h-48 bg-gray-100">
                    {cover ? (
                      <img
                        src={cover}
                        alt={university.name_ar}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FaImage className="text-5xl text-gray-300" />
                      </div>
                    )}

                    <div className="absolute right-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          university.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {university.is_active ? "ظاهرة" : "مخفية"}
                      </span>

                      {university.is_featured && (
                        <span className="rounded-full bg-[#c58a08] px-3 py-1 text-xs font-black text-white">
                          مميزة
                        </span>
                      )}
                    </div>

                    {logo && (
                      <div className="absolute -bottom-8 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-1 shadow-lg">
                        <img
                          src={logo}
                          alt={`شعار ${university.name_ar}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-5 pt-11">
                    <h3 className="text-xl font-black">
                      {university.name_ar}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                      {university.city && (
                        <span>{university.city}</span>
                      )}
                      <span>•</span>
                      <span>
                        {university.university_type === "public"
                          ? "حكومية"
                          : "خاصة"}
                      </span>
                      <span>•</span>
                      <span>ترتيب {university.display_order}</span>
                    </div>

                    {university.short_description && (
                      <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                        {university.short_description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(university)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#04153f] px-4 py-3 font-bold text-white transition hover:bg-[#09245e]"
                      >
                        <FaPen />
                        تعديل
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(university)
                        }
                        disabled={deletingId === university.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        <FaTrash />
                        {deletingId === university.id
                          ? "جاري الحذف"
                          : "حذف"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleUniversity(
                            university,
                            "is_active"
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
                      >
                        {university.is_active ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                        {university.is_active ? "إخفاء" : "إظهار"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleUniversity(
                            university,
                            "is_featured"
                          )
                        }
                        className="rounded-xl border border-[#c58a08]/30 bg-[#c58a08]/5 px-4 py-3 font-bold text-[#a97407] transition hover:bg-[#c58a08]/10"
                      >
                        {university.is_featured
                          ? "إلغاء التمييز"
                          : "جعلها مميزة"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] outline-none transition placeholder:text-gray-400 focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-black">
        {label}
        {required && (
          <span className="mr-1 text-red-600">*</span>
        )}
      </span>
      {children}
    </label>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-6 w-6 shrink-0 cursor-pointer accent-[#c58a08]"
      />
    </label>
  );
}

function ImageUploadBox({
  title,
  preview,
  inputId,
  onChange,
  onRemove,
  contain = false,
}: {
  title: string;
  preview: string;
  inputId: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  contain?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <p className="mb-4 font-black">{title}</p>

      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white">
        {preview ? (
          <>
            <img
              src={preview}
              alt={title}
              className={`h-full w-full ${
                contain ? "object-contain p-4" : "object-cover"
              }`}
            />

            <button
              type="button"
              onClick={onRemove}
              className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
              aria-label={`حذف ${title}`}
            >
              <FaTrash />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <FaImage className="mx-auto text-5xl" />
            <p className="mt-3 font-bold">لا توجد صورة</p>
          </div>
        )}
      </div>

      <label
        htmlFor={inputId}
        className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#04153f] px-5 py-3 font-black text-white transition hover:bg-[#09245e]"
      >
        <FaUpload />
        اختيار صورة
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      <p className="mt-3 text-center text-xs text-gray-500">
        الحد الأقصى 8 ميغابايت.
      </p>
    </div>
  );
}