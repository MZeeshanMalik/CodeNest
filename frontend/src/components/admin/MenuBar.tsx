import { Editor } from "@tiptap/react";

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive("bold") ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic") ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-100"
            : "hover:bg-gray-100"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive("bulletList") ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        Bullet List
      </button>
    </div>
  );
};
