"use client";

import { Image } from "next-sanity/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface GalleryPhoto {
  thumbUrl: string;
  fullUrl: string;
  alt: string;
  caption: string;
  album: string;
}

export interface GalleryCategoryData {
  categoryTitle: string;
  photos: GalleryPhoto[];
}

interface GalleryClientProps {
  categories: GalleryCategoryData[];
}

interface IndexedPhoto {
  photo: GalleryPhoto;
  index: number;
}

interface AlbumGroup {
  album: string;
  photos: IndexedPhoto[];
}

interface Section {
  category: GalleryCategoryData;
  albumGroups: AlbumGroup[];
}

function groupByAlbum(photos: GalleryPhoto[], startIndex: number): {
  groups: AlbumGroup[];
  nextIndex: number;
} {
  const groups: AlbumGroup[] = [];
  let index = startIndex;
  for (const photo of photos) {
    const album = photo.album || "";
    let group = groups.find((g) => g.album === album);
    if (!group) {
      group = { album, photos: [] };
      groups.push(group);
    }
    group.photos.push({ photo, index });
    index += 1;
  }
  return { groups, nextIndex: index };
}

export default function GalleryClient({ categories }: GalleryClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { sections, flat } = useMemo(() => {
    const sections: Section[] = [];
    const flat: GalleryPhoto[] = [];
    for (const category of categories) {
      const { groups } = groupByAlbum(category.photos, flat.length);
      for (const group of groups) {
        for (const { photo } of group.photos) {
          flat.push(photo);
        }
      }
      sections.push({ category, albumGroups: groups });
    }
    return { sections, flat };
  }, [categories]);

  const isOpen = openIndex !== null;
  const currentIndex = openIndex ?? 0;
  const current = isOpen ? flat[currentIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i + 1) % flat.length,
      ),
    [flat.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null
          ? i
          : (i - 1 + flat.length) % flat.length,
      ),
    [flat.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, next, prev]);

  if (flat.length === 0) return null;

  return (
    <>
      <div className="space-y-12">
        {sections.map(({ category, albumGroups }) => (
          <section key={category.categoryTitle}>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">
              {category.categoryTitle}
            </h2>
            <div className="space-y-8">
              {albumGroups.map((group) => (
                <div key={group.album || "__no_album__"}>
                  {group.album && (
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">
                      {group.album}
                    </h3>
                  )}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {group.photos.map(({ photo, index }) => (
                      <button
                        key={`${category.categoryTitle}-${index}`}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        aria-label={
                          photo.caption
                            ? `Enlarge: ${photo.caption}`
                            : "Enlarge photo"
                        }
                        className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <Image
                          src={photo.thumbUrl}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {photo.caption && (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {photo.caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {isOpen && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="relative z-10 flex max-h-full w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute -top-2 right-0 z-10 -translate-y-full text-3xl text-white hover:opacity-70"
            >
              &times;
            </button>
            <div className="relative min-h-0 flex-1">
              <Image
                src={current.fullUrl}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-4 text-white">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                &larr; Prev
              </button>
              <p className="flex-1 text-center text-sm">
                {current.caption && (
                  <span className="block">{current.caption}</span>
                )}
                <span className="text-white/60">
                  {current.album
                    ? `${current.album} \u00B7 `
                    : ""}
                  {currentIndex + 1} / {flat.length}
                </span>
              </p>
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
