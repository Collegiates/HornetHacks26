import { Download, Expand } from "lucide-react";
import { toThumbnailUrl } from "../lib/cloudinary";
import type { Photo } from "../types";

interface PhotoGridProps {
  photos: Photo[];
  onSelect: (index: number) => void;
}

export function PhotoGrid({ photos, onSelect }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          className="group relative overflow-hidden rounded-3xl bg-white text-left"
          onClick={() => onSelect(index)}
        >
          <img
            src={photo.thumbnailUrl || toThumbnailUrl(photo.cloudinaryUrl)}
            alt="Event photo thumbnail"
            className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/80 via-ink/20 to-transparent px-3 py-3 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <Download className="h-4 w-4" />
            <Expand className="h-4 w-4" />
          </div>
        </button>
      ))}
    </div>
  );
}
