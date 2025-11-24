"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  user_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

interface TalentGalleryProps {
  userId: string;
  isOwnProfile: boolean;
}

export default function TalentGallery({ userId, isOwnProfile }: TalentGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadGallery();
  }, [userId]);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/gallery?userId=${userId}`);
      const data = await response.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten imágenes");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Error uploading file");
      }

      // Add to gallery
      const galleryResponse = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: uploadData.url,
          title: null,
          description: null,
          display_order: images.length,
          is_cover: false,
        }),
      });

      if (galleryResponse.ok) {
        loadGallery();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen. Por favor intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;

    try {
      const response = await fetch(`/api/gallery?imageId=${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadGallery();
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      const response = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId,
          is_cover: true,
        }),
      });

      if (response.ok) {
        loadGallery();
      }
    } catch (error) {
      console.error("Error setting cover image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black">Galería</h3>
        {isOwnProfile && (
          <label className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold cursor-pointer flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isUploading ? "Subiendo..." : "Agregar Foto"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No hay imágenes en la galería</p>
          {isOwnProfile && (
            <p className="text-sm mt-2">Sube tu primera imagen para comenzar</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.image_url}
                alt={image.title || "Gallery image"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized
              />
              {image.is_cover && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                  Portada
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery image"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Actions */}
            {isOwnProfile && (
              <div className="mt-4 flex gap-3 justify-end">
                {!selectedImage.is_cover && (
                  <button
                    onClick={() => handleSetCover(selectedImage.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Establecer como portada
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedImage.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
