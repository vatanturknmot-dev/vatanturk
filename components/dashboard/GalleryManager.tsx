"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type GalleryImage = {
  id: number;
  title: string;
  image_url: string;
  storage_path: string;
  alt_text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

type ErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedFileTypes = [
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
      currentError.code ? `رمز الخطأ: ${currentError.code}` : "",
    ].filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "حدث خطأ غير معروف.";
}

function createSafeFileName(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const randomPart = Math.random().toString(36).slice(2, 10);

  return `${Date.now()}-${randomPart}.${extension}`;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select(
          "id, title, image_url, storage_path, alt_text, is_active, sort_order, created_at"
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setImages(
        (data ?? []).map((image) => ({
          id: image.id,
          title: image.title ?? "",
          image_url: image.image_url ?? "",
          storage_path: image.storage_path ?? "",
          alt_text: image.alt_text ?? "",
          is_active: image.is_active ?? true,
          sort_order: image.sort_order ?? 0,
          created_at: image.created_at ?? "",
        }))
      );
    } catch (error) {
      console.error("خطأ في تحميل الصور:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSuccessMessage("");
    setErrorMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      setSelectedFile(null);
      event.target.value = "";

      setErrorMessage(
        "نوع الملف غير مدعوم. اختر صورة JPG أو PNG أو WEBP أو GIF."
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      event.target.value = "";

      setErrorMessage("حجم الصورة أكبر من 10 ميغابايت.");

      return;
    }

    setSelectedFile(file);

    if (!altText.trim()) {
      setAltText(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedFile) {
      setErrorMessage("اختر صورة أولًا.");
      return;
    }

    setUploading(true);

    let uploadedStoragePath = "";

    try {
      const fileName = createSafeFileName(selectedFile);
      const storagePath = `uploads/${fileName}`;

      uploadedStoragePath = storagePath;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(storagePath);

      if (!publicUrl) {
        throw new Error("تعذر إنشاء رابط عام للصورة.");
      }

      const nextSortOrder =
        images.length > 0
          ? Math.max(...images.map((image) => image.sort_order)) + 1
          : 0;

      const { error: databaseError } = await supabase
        .from("gallery_images")
        .insert({
          title: title.trim(),
          image_url: publicUrl,
          storage_path: storagePath,
          alt_text: altText.trim(),
          is_active: true,
          sort_order: nextSortOrder,
          updated_at: new Date().toISOString(),
        });

      if (databaseError) {
        await supabase.storage.from("gallery").remove([storagePath]);
        throw databaseError;
      }

      setSelectedFile(null);
      setTitle("");
      setAltText("");

      const fileInput = document.getElementById(
        "gallery-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setSuccessMessage("تم رفع الصورة وحفظها بنجاح.");

      await loadImages();
    } catch (error) {
      console.error("خطأ في رفع الصورة:", error);

      if (uploadedStoragePath) {
        console.log("مسار الصورة المرفوعة:", uploadedStoragePath);
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: GalleryImage) {
    const confirmed = window.confirm(
      `هل تريد حذف الصورة${
        image.title ? `: ${image.title}` : ""
      } نهائيًا؟`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(image.id);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("gallery")
          .remove([image.storage_path]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error: databaseError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (databaseError) {
        throw databaseError;
      }

      setImages((currentImages) =>
        currentImages.filter((currentImage) => currentImage.id !== image.id)
      );

      setSuccessMessage("تم حذف الصورة بنجاح.");
    } catch (error) {
      console.error("خطأ في حذف الصورة:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleImageStatus(image: GalleryImage) {
    setUpdatingId(image.id);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const newStatus = !image.is_active;

      const { error } = await supabase
        .from("gallery_images")
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id);

      if (error) {
        throw error;
      }

      setImages((currentImages) =>
        currentImages.map((currentImage) =>
          currentImage.id === image.id
            ? {
                ...currentImage,
                is_active: newStatus,
              }
            : currentImage
        )
      );

      setSuccessMessage(
        newStatus
          ? "تم إظهار الصورة في الموقع."
          : "تم إخفاء الصورة من الموقع."
      );
    } catch (error) {
      console.error("خطأ في تحديث حالة الصورة:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div dir="rtl" className="text-[#04153f]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#04153f]">
          ألبوم الصور
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          ارفع الصور واعرضها أو أخفها أو احذفها من لوحة التحكم.
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">تعذر تنفيذ العملية</p>
          <p className="mt-1 break-words text-sm">{errorMessage}</p>
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5"
      >
        <h3 className="mb-5 text-xl font-bold text-[#04153f]">
          رفع صورة جديدة
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="gallery-title"
              className="mb-2 block font-bold text-[#04153f]"
            >
              عنوان الصورة
            </label>

            <input
              id="gallery-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="مثال: طلاب VATAN TURK"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] placeholder:text-gray-400 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
            />
          </div>

          <div>
            <label
              htmlFor="gallery-alt"
              className="mb-2 block font-bold text-[#04153f]"
            >
              وصف الصورة
            </label>

            <input
              id="gallery-alt"
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="وصف مختصر للصورة"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] placeholder:text-gray-400 outline-none transition focus:border-[#c58a08] focus:ring-2 focus:ring-[#c58a08]/20"
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="gallery-file"
            className="mb-2 block font-bold text-[#04153f]"
          >
            اختر الصورة
          </label>

          <input
            id="gallery-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#04153f] file:ml-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#04153f] file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-[#09245e]"
          />

          <p className="mt-2 text-xs text-gray-500">
            الأنواع المسموحة: JPG وPNG وWEBP وGIF. الحد الأقصى 10 MB.
          </p>

          {selectedFile && (
            <div className="mt-3 rounded-lg bg-white px-4 py-3 text-sm text-[#04153f]">
              الملف المختار:{" "}
              <span className="font-bold">{selectedFile.name}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="mt-5 rounded-xl bg-[#c58a08] px-8 py-3 font-bold text-white transition hover:bg-[#a97407] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "جاري رفع الصورة..." : "رفع الصورة"}
        </button>
      </form>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#04153f]">
            الصور المرفوعة
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            عدد الصور: {images.length}
          </p>
        </div>

        <button
          type="button"
          onClick={loadImages}
          disabled={loading}
          className="rounded-xl border border-[#04153f] bg-white px-5 py-2 font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white disabled:opacity-50"
        >
          {loading ? "جاري التحميل..." : "تحديث الصور"}
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-gray-200">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#c58a08]" />

            <p className="mt-4 font-medium text-gray-600">
              جاري تحميل الصور...
            </p>
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl">🖼️</div>

          <p className="mt-4 font-bold text-[#04153f]">
            لا توجد صور حاليًا
          </p>

          <p className="mt-2 text-sm text-gray-500">
            ارفع أول صورة باستخدام النموذج الموجود في الأعلى.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={image.image_url}
                  alt={image.alt_text || image.title || "صورة من المعرض"}
                  className="h-full w-full object-cover"
                />

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    image.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {image.is_active ? "ظاهرة" : "مخفية"}
                </span>
              </div>

              <div className="p-4">
                <h4 className="truncate text-lg font-bold text-[#04153f]">
                  {image.title || "بدون عنوان"}
                </h4>

                <p className="mt-2 min-h-10 text-sm text-gray-500">
                  {image.alt_text || "لا يوجد وصف للصورة."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={
                      updatingId === image.id || deletingId === image.id
                    }
                    onClick={() => toggleImageStatus(image)}
                    className="rounded-lg border border-[#04153f] px-3 py-2 text-sm font-bold text-[#04153f] transition hover:bg-[#04153f] hover:text-white disabled:opacity-50"
                  >
                    {updatingId === image.id
                      ? "جاري التحديث..."
                      : image.is_active
                        ? "إخفاء"
                        : "إظهار"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId === image.id || updatingId === image.id
                    }
                    onClick={() => handleDelete(image)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === image.id
                      ? "جاري الحذف..."
                      : "حذف"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}