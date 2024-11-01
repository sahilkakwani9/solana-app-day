import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image';

const GoogleDriveImage = ({
  fileId,
  alt,
  className = "object-cover rounded-xl",
  onError,
  priority = false
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (!fileId) {
          throw new Error('No file ID provided');
        }
        const url = await getBestImageUrl(fileId);
        setImageUrl(url);
      } catch (err) {
        console.error('Error loading image:', err);
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
      <div className="relative w-full h-36 bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <ImageOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-400">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-36">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={`${className} ${loading ? 'animate-pulse bg-gray-700' : ''}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default GoogleDriveImage;
