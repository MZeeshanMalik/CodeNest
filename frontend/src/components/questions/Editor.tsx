"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useToast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  // Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  // Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

// Add custom styles for code blocks and blockquotes
const customStyles = `
  .ProseMirror {
    outline: none !important;
    border: none !important;
    
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
      overflow-x: auto;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .hljs {
      background: transparent;
      padding: 0;
    }

    blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
      margin: 1rem 0;
      color: #4b5563;
      font-style: italic;
      background-color: #f3f4f6;
      border-radius: 0.25rem;
      padding: 1rem;
    }

    code {
      background-color: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9em;
      color: #ef4444;
    }

    p.is-editor-empty:first-child::before {
      color: #9ca3af;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }

  .tiptap {
    outline: none !important;
    border: none !important;
  }
`;

interface EditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("bold") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("italic") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("strike") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("bulletList") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("orderedList") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1  pr-2">
        <button
          onClick={() => {
            const url = window.prompt("Enter the URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("link") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        {/* <button
          onClick={() => {
            const url = window.prompt("Enter the image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button> */}
      </div>

      <div className="flex items-center gap-1 pr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        {/* <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("code") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button> */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("blockquote") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto  pl-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Editor = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder,
}: EditorProps) => {
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "code-block",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "blockquote",
          },
        },
      }),

      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder:
          placeholder ||
          "Share your thoughts, knowledge, or code examples here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
    autofocus: false,
  });

  return (
    <div className="relative w-full">
      <style>{customStyles}</style>
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <MenuBar editor={editor} />
        <div
          className="min-h-[200px] sm:min-h-[250px] md:min-h-[200px] h-[200px] sm:h-[150px] md:h-[200px] overflow-y-auto cursor-text"
          onClick={() => editor?.commands.focus()}
          style={{ outline: "none" }}
        >
          <EditorContent
            editor={editor}
            className="h-full px-4 sm:px-6 py-3 sm:py-4 prose dark:prose-invert max-w-none"
            style={{ outline: "none" }}
          />
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="h-8 w-8 animate-spin rounded-full" />
        </div>
      )}
    </div>
  );
};

export default Editor;
