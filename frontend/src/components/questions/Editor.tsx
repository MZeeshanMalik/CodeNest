"use client";

import React, { useEffect, useState } from "react";
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
import { div } from "framer-motion/client";

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

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent the default button behavior
    e.stopPropagation(); // Stop event from bubbling up
    action();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Text styling */}
      <button
        type="button" // Explicitly set type to button
        onClick={(e) =>
          handleButtonClick(e, () => editor.chain().focus().toggleBold().run())
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
      >
        <Bold className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleItalic().run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
      >
        <Italic className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleStrike().run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("strike") ? "bg-gray-200" : ""
        }`}
      >
        <Strikethrough className="h-5 w-5" />
      </button>

      {/* Headings */}
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
      >
        <Heading1 className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
      >
        <Heading2 className="h-5 w-5" />
      </button>

      {/* Lists */}
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleBulletList().run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
      >
        <List className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleOrderedList().run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
      >
        <ListOrdered className="h-5 w-5" />
      </button>

      {/* Link */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const url = window.prompt("URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
      >
        <LinkIcon className="h-5 w-5" />
      </button>

      {/* Alignment */}
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().setTextAlign("left").run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
        }`}
      >
        <AlignLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().setTextAlign("center").run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
        }`}
      >
        <AlignCenter className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().setTextAlign("right").run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
        }`}
      >
        <AlignRight className="h-5 w-5" />
      </button>

      {/* Quote */}
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () =>
            editor.chain().focus().toggleBlockquote().run()
          )
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
      >
        <Quote className="h-5 w-5" />
      </button>

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () => editor.chain().focus().undo().run())
        }
        className="p-2 rounded hover:bg-gray-200"
      >
        <Undo className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) =>
          handleButtonClick(e, () => editor.chain().focus().redo().run())
        }
        className="p-2 rounded hover:bg-gray-200"
      >
        <Redo className="h-5 w-5" />
      </button>
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
  const [isMounted, setIsMounted] = useState(false);

  // Only initialize the editor after component mounts to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    // Prevent hydration mismatch by disabling immediate rendering
    // This ensures the editor is only rendered client-side
    immediatelyRender: false,
  });
  return (
    <div className="relative w-full">
      <style>{customStyles}</style>
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        {isMounted && editor ? (
          <>
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
          </>
        ) : (
          <div className="min-h-[200px] sm:min-h-[250px] md:min-h-[200px] h-[200px] sm:h-[150px] md:h-[200px] flex items-center justify-center">
            <p className="text-gray-400">Loading editor...</p>
          </div>
        )}
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
