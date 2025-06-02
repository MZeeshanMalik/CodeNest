import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { API_URL } from "@/utils/apiRoutes";

interface ImageUploaderProps {
  images?: File[];
  setImages?: (images: File[]) => void;
  setValue?: (name: string, value: any, options?: any) => void;
  onImagesChange?: (files: File[]) => void;
  existingImages?: string[];
  onExistingImagesChange?: (paths: string[]) => void;
}

const ImageUploader = ({
  images = [],
  setImages,
  setValue,
  onImagesChange,
  existingImages = [],
  onExistingImagesChange,
}: ImageUploaderProps) => {
  const [localImages, setLocalImages] = useState<File[]>(images);
  const [serverImages, setServerImages] = useState<string[]>(existingImages);

  // Memoize the update handlers to prevent unnecessary re-renders
  const updateLocalImages = useCallback(
    (newImages: File[]) => {
      setLocalImages(newImages);
      if (setImages) {
        setImages(newImages);
      }
      if (setValue) {
        setValue("images", newImages, { shouldValidate: true });
      }
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    },
    [setImages, setValue, onImagesChange]
  );

  const updateServerImages = useCallback(
    (newPaths: string[]) => {
      setServerImages(newPaths);
      if (onExistingImagesChange) {
        onExistingImagesChange(newPaths);
      }
    },
    [onExistingImagesChange]
  );

  // Update server images only when existingImages prop changes
  useEffect(() => {
    if (JSON.stringify(serverImages) !== JSON.stringify(existingImages)) {
      updateServerImages(existingImages);
    }
  }, [existingImages, serverImages, updateServerImages]);

  // Handle file drop with memoized callback
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedImages = [...localImages, ...acceptedFiles];
      updateLocalImages(updatedImages);
    },
    [localImages, updateLocalImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    multiple: true,
    maxSize: 5242880, // 5MB max file size
    maxFiles: 5, // Max 5 files, matching backend configuration
  });

  // Remove local image
  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = localImages.filter((_, i) => i !== index);
      updateLocalImages(updatedImages);
    },
    [localImages, updateLocalImages]
  );

  // Remove server image
  const removeServerImage = useCallback(
    (index: number) => {
      const updatedServerImages = serverImages.filter((_, i) => i !== index);
      updateServerImages(updatedServerImages);
    },
    [serverImages, updateServerImages]
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow mt-1 mb-1">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-8 text-center cursor-pointer bg-gray-100 rounded-lg"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 text-lg">
          Drag & drop images here, or click to select
        </p>
      </div>

      {/* Local Images Preview */}
      {localImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {localImages.map((file: File, index: number) => (
            <div key={`local-${index}`} className="relative">
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
                height={150}
                width={150}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Server Images Preview */}
      {serverImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {serverImages.map((imagePath, index) => (
            <div key={`server-${index}`} className="relative">
              <Image
                src={
                  imagePath.startsWith("http")
                    ? imagePath
                    : `${API_URL}/uploads/questionImages/${imagePath}`
                }
                alt="Existing image"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
                height={150}
                width={150}
                unoptimized={true}
                onError={(e) => {
                  console.error(`Failed to load image: ${imagePath}`);
                  (e.target as HTMLImageElement).src =
                    "/images/placeholder-image.png";
                }}
              />
              <button
                type="button"
                onClick={() => removeServerImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
