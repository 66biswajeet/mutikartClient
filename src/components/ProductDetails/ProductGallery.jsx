"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, selectedImage, setSelectedImage, productName }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  const currentImageRaw = images[selectedImage];
  const resolveSrc = (src) => {
    if (!src) return "/placeholder.jpg";
    // absolute URL
    if (typeof src === "string" && /^(https?:)?\/\//.test(src)) return src;
    // relative path - prefix with admin API URL if available
    const admin = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    return admin ? `${admin.replace(/\/$/, "")}${src.startsWith("/") ? src : `/${src}`}` : src;
  };
  // Transform Cloudinary URLs to request optimized sizes when possible
  const transformCloudinary = (url, width) => {
    try {
      if (!url) return url;
      if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        return url.replace(/\/upload\//, `/upload/w_${width},f_auto,q_auto/`);
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const currentImageRawStr = typeof currentImageRaw === 'string' ? currentImageRaw : currentImageRaw?.url || currentImageRaw;
  let currentImage = resolveSrc(currentImageRawStr);
  currentImage = transformCloudinary(currentImage, 1200);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={currentImage || "/placeholder.jpg"}
          alt={productName || "Product image"}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          priority
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => {
                const imageSrcRaw = typeof image === 'string' ? image : image?.url || image;
                let imageSrc = resolveSrc(imageSrcRaw);
                imageSrc = transformCloudinary(imageSrc, 300);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={imageSrc || "/placeholder.jpg"}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
