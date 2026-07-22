"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaImages,
  FaXmark,
} from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

type GalleryImage = {
  id: number | string;
  title: string;
  description: string;
  image_url: string;
  storage_path: string;
  is_active: boolean;
  sort_order: number;
};

function normalizeGalleryImage(
  item: Record<string, unknown>,
  index: number
): GalleryImage {
  return {
    id:
      typeof item.id === "number" ||
      typeof item.id === "string"
        ? item.id
        : index,

    title:
      typeof item.title === "string"
        ? item.title
        : typeof item.name === "string"
          ? item.name
          : "",

    description:
      typeof item.description === "string"
        ? item.description
        : typeof item.caption === "string"
          ? item.caption
          : "",

    image_url:
      typeof item.image_url === "string"
        ? item.image_url
        : typeof item.url === "string"
          ? item.url
          : "",

    storage_path:
      typeof item.storage_path === "string"
        ? item.storage_path
        : typeof item.image_path === "string"
          ? item.image_path
          : "",

    is_active:
      typeof item.is_active === "boolean"
        ? item.is_active
        : true,

    sort_order:
      typeof item.sort_order === "number"
        ? item.sort_order
        : index,
  };
}

function getGalleryImageUrl(image: GalleryImage) {
  if (image.image_url) {
    return image.image_url;
  }

  if (!image.storage_path) {
    return "";
  }

  const { data } = supabase.storage
    .from("gallery")
    .getPublicUrl(image.storage_path);

  return data.publicUrl;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGalleryImages() {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*");

        if (!isMounted) {
          return;
        }

        if (error) {
          throw error;
        }

        const normalizedImages = (data ?? [])
          .map((item, index) =>
            normalizeGalleryImage(
              item as Record<string, unknown>,
              index
            )
          )
          .filter((item) => item.is_active)
          .filter(
            (item) =>
              Boolean(item.image_url) ||
              Boolean(item.storage_path)
          )
          .sort((a, b) => a.sort_order - b.sort_order);

        setImages(normalizedImages);
      } catch (error) {
        console.error("Gallery loading error:", error);

        if (isMounted) {
          setErrorMessage(
            "تعذر تحميل ألبوم الصور حاليًا."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGalleryImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPreviousImage = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || images.length === 0) {
        return null;
      }

      return currentIndex === 0
        ? images.length - 1
        : currentIndex - 1;
    });
  }, [images.length]);

  const showNextImage = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || images.length === 0) {
        return null;
      }

      return currentIndex === images.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, [images.length]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (selectedIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showNextImage();
      }

      if (event.key === "ArrowRight") {
        showPreviousImage();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    selectedIndex,
    closeLightbox,
    showNextImage,
    showPreviousImage,
  ]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const selectedImage =
    selectedIndex !== null
      ? images[selectedIndex]
      : null;

  if (!loading && !errorMessage && images.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="gallery"
        dir="rtl"
        className="scroll-mt-24 bg-[#f7f8fb] py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#c58a08]/10 px-5 py-2 text-sm font-black text-[#a66f00]">
              <FaImages />
              معرض الصور
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#04153f] sm:text-4xl md:text-5xl">
              ألبوم VATAN TURK
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              جانب من نشاطاتنا وخدماتنا التعليمية
              والجامعات التي نتعاون معها.
            </p>
          </div>

          {loading ? (
            <GalleryLoading />
          ) : errorMessage ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center font-bold text-red-700">
              {errorMessage}
            </div>
          ) : (
            <div className="mt-14 grid auto-rows-[240px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => {
                const imageUrl =
                  getGalleryImageUrl(image);

                const largeImage =
                  index % 7 === 0 ||
                  index % 7 === 4;

                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() =>
                      setSelectedIndex(index)
                    }
                    className={`group relative overflow-hidden rounded-[28px] bg-gray-200 text-right shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      largeImage
                        ? "sm:row-span-2"
                        : ""
                    }`}
                    aria-label={
                      image.title
                        ? `عرض صورة ${image.title}`
                        : "عرض الصورة"
                    }
                  >
                    <img
                      src={imageUrl}
                      alt={
                        image.title ||
                        "صورة من معرض VATAN TURK"
                      }
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#04153f]/95 via-[#04153f]/10 to-transparent opacity-80 transition group-hover:opacity-100" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                      <div>
                        {image.title && (
                          <h3 className="text-xl font-black text-white">
                            {image.title}
                          </h3>
                        )}

                        {image.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
                            {image.description}
                          </p>
                        )}
                      </div>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition group-hover:bg-[#c58a08]">
                        <FaExpand />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="معرض الصور"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute left-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label="إغلاق"
          >
            <FaXmark />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur-md transition hover:bg-[#c58a08] md:right-8"
                aria-label="الصورة السابقة"
              >
                <FaChevronRight />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur-md transition hover:bg-[#c58a08] md:left-8"
                aria-label="الصورة التالية"
              >
                <FaChevronLeft />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[92vh] max-w-6xl flex-col items-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={getGalleryImageUrl(selectedImage)}
              alt={
                selectedImage.title ||
                "صورة من معرض VATAN TURK"
              }
              className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {(selectedImage.title ||
              selectedImage.description) && (
              <div className="mt-5 max-w-3xl text-center text-white">
                {selectedImage.title && (
                  <h3 className="text-xl font-black md:text-2xl">
                    {selectedImage.title}
                  </h3>
                )}

                {selectedImage.description && (
                  <p className="mt-2 leading-7 text-white/70">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}

            <p className="mt-4 text-sm font-bold text-white/50">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryLoading() {
  return (
    <div className="mt-14 grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-64 rounded-[28px] bg-gray-200"
        />
      ))}
    </div>
  );
}