import React from "react";

const ResizableImageComponent = ({ node, deleteImage }: any) => {
  const { src, alt, width, height } = node.attrs;

  const handleDelete = () => {
    deleteImage(src); // Call the delete function passed from the parent
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          padding: "4px 8px",
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ResizableImageComponent;
