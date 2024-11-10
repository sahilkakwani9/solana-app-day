import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getBestImageUrl } from "@/lib/image";

const GoogleDriveImage = ({
  fileId,
  alt,
  className = "object-fill rounded-xl",
  onError,
  priority = false,
  height = 36,
}: {
  fileId: string;
  alt: string;
  className?: string;
  onError: (error: unknown) => void;
  priority?: boolean;
  height?: number;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (!fileId) {
          throw new Error("No file ID provided");
        }
        const url = await getBestImageUrl(fileId);
        setImageUrl(url);
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [fileId, onError]);

  if (error || !imageUrl) {
    return (
      <div className={`relative h-${height}`}>
        <Image
          src={`https://placehold.co/600x400/1a1a1a/FFF?text=${alt}`}
          alt={alt}
          fill
          className={`${className} ${
            loading ? "animate-pulse bg-gray-700" : "object-cover"
          }`}
          onError={() => setError(true)}
          onLoad={() => setLoading(false)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-${height}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={`${className} ${
          loading ? "animate-pulse bg-gray-700" : "object-fill"
        }`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default GoogleDriveImage;
