"use client";
import { useState } from "react";
import TiptapEditor from "../../../../components/admin/TiptapEditor";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("<h1>Write your blog here</h1>");

  const handleSaveDraft = () => {
    console.log("Saving draft...", { title, tags, content });
    alert("Draft saved successfully!");
  };

  const handlePublish = () => {
    console.log("Publishing...", { title, tags, content });
    alert("Blog published successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

      {/* Title Input */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter blog title"
        />
      </div>

      {/* Tags Input */}
      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., web development, javascript"
        />
      </div>

      {/* Tiptap Editor */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <TiptapEditor content={content} setContent={setContent} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
