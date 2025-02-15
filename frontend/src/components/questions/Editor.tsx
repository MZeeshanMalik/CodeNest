"use client";
import React, { useState, useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";

interface QuillEditorProps {
  value: string;
  onChange?: (data: {
    text: string;
    contents: any;
    html: string;
    editor: any;
    textLength: number;
  }) => void;
  toolbar?: any;
  placeholder?: string;
  theme?: string;
  readOnly?: boolean;
  spellCheck?: boolean;
  maxLength?: number;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  toolbar,
  placeholder = "Type message here",
  theme = "snow",
  readOnly = false,
  spellCheck = false,
  maxLength,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;
      const Syntax = Quill.import("modules/syntax");
      const hljs = require("highlight.js");

      Quill.register("modules/syntax", Syntax);
      hljs.configure({ languages: ["javascript", "python", "html", "css"] });

      const quillInstance = new Quill(editorRef.current!, {
        modules: {
          toolbar: toolbar || defaultToolbar,
          syntax: {
            hljs: hljs,
          },
        },
        placeholder,
        theme,
        readOnly,
      });

      quillInstance.on("text-change", () => {
        const text = quillInstance.getText();
        const html = quillInstance.root.innerHTML;

        if (maxLength && text.trim().length > maxLength) return;

        onChange?.({
          text,
          contents: quillInstance.getContents(),
          html,
          editor: quillInstance,
          textLength: text.trim().length,
        });
      });

      // Initialize content
      if (value && quillInstance.root.innerHTML !== value) {
        quillInstance.clipboard.dangerouslyPasteHTML(value);
      }

      setQuill(quillInstance);
    });
  }, []);

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value, quill]);

  return (
    <div ref={editorRef} style={{ height: "200px" }} spellCheck={spellCheck} />
  );
};

const defaultToolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike", "link"],
  ["blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["clean"],
];

export default QuillEditor;
