import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = () => {
  const [images, setImages] = useState<File[]>([]);

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow mt-1 mb-1">
      {/* <h2 className="text-xl font-semibold mb-4 text-center">Upload Images</h2> */}

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

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              {/* Remove Button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {/* <button className="mt-6 w-full bg-blue-600 text-white text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
        Upload
      </button> */}
    </div>
  );
};

export default ImageUploader;
