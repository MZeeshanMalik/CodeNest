import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
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
  const [localImages, setLocalImages] = useState<File[]>(images || []);
  const [serverImages, setServerImages] = useState<string[]>(
    existingImages || []
  );

  useEffect(() => {
    if (images && images.length > 0) {
      setLocalImages(images);
    }
  }, [images]);
  // Only update server images on initial load or when existingImages is different
  useEffect(() => {
    // Compare current server images with incoming existingImages
    const currentImagesJSON = JSON.stringify(serverImages.sort());
    const incomingImagesJSON = JSON.stringify(
      [...(existingImages || [])].sort()
    );

    // Update if they're different
    if (incomingImagesJSON !== currentImagesJSON) {
      console.log("Updating server images:");
      console.log("- Current:", serverImages);
      console.log("- Incoming:", existingImages);
      setServerImages(existingImages || []);
    }
  }, [existingImages, serverImages]);

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    const updatedImages = [...localImages, ...acceptedFiles];

    if (setImages) {
      setImages(updatedImages);
    }

    if (setValue) {
      setValue("images", updatedImages);
    }

    if (onImagesChange) {
      onImagesChange(updatedImages);
    }

    setLocalImages(updatedImages);
  };
  // Remove image from local uploads
  const removeImage = (index: number) => {
    const updatedImages = localImages.filter((_, i) => i !== index);

    if (setImages) {
      setImages(updatedImages);
    }

    if (setValue) {
      setValue("images", updatedImages);
    }

    if (onImagesChange) {
      onImagesChange(updatedImages);
    }

    setLocalImages(updatedImages);
  }; // Remove image from server (previously uploaded images)
  const removeServerImage = (index: number) => {
    // Get the image that's being removed
    const imageBeingRemoved = serverImages[index];

    // Create new array without the removed image
    const updatedServerImages = serverImages.filter((_, i) => i !== index);

    // Update local state
    setServerImages(updatedServerImages);

    // Notify parent about updated existing images
    if (onExistingImagesChange) {
      console.log(
        `Notifying parent component that image has been removed:`,
        imageBeingRemoved
      );
      console.log(`New server images list:`, updatedServerImages);
      onExistingImagesChange(updatedServerImages);
    }

    // Log the removal for debugging
    console.log("Removed server image at index:", index);
    console.log("Image that was removed:", imageBeingRemoved);
    console.log("Updated server images:", updatedServerImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

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
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
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
              {" "}
              <Image
                src={
                  imagePath.startsWith("http")
                    ? imagePath
                    : `${API_URL}/api/v1/images/questionImages/${imagePath}`
                }
                alt="Existing image"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
                height={150}
                width={150}
                unoptimized={true} // Skip Next.js optimization for external files
                onError={(e) => {
                  console.error(`Failed to load image: ${imagePath}`);
                  console.log(`Trying fallback for: ${imagePath}`);
                  // Use a fallback image
                  (e.target as HTMLImageElement).src =
                    "/images/placeholder-image.png";
                }}
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeServerImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
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
