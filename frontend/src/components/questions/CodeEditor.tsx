// import { basicSetup } from "codemirror";
// import CodeMirror from "@uiw/react-codemirror";
// import { githubLight } from "@uiw/codemirror-theme-github";
// import { langs } from "@uiw/codemirror-extensions-langs";
// import { useState } from "react";

// const languageMap = {
//   javascript: langs.javascript(),
//   // …
// };

// export default function CodeEditor({ code, setCode, editable = true }) {
//   const [lang, setLang] = useState("javascript");
//   const [copied, setCopied] = useState(false);

//   return (
//     <div className="p-4 flex flex-col">
//       {editable && (
//         <select
//           className="mb-2 p-2 border rounded bg-gray-100"
//           value={lang}
//           onChange={(e) => setLang(e.target.value)}
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="typescript">TypeScript</option>
//           <option value="python">Python</option>
//           <option value="java">Java</option>
//           <option value="c">C</option>
//           <option value="cpp">C++</option>
//           <option value="css">Css</option>
//           {/* …other langs */}
//         </select>
//       )}

//       <button
//         onClick={async () => {
//           await navigator.clipboard.writeText(code);
//           setCopied(true);
//           setTimeout(() => setCopied(false), 2000);
//         }}
//         className="flex items-center gap-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
//       >
//         {copied ? "Copied!" : "Copy"}
//       </button>

//       <CodeMirror
//         value={code}
//         height="300px"
//         basicSetup // ← turn on all the usual CM6 goodies
//         theme={githubLight}
//         extensions={[basicSetup, languageMap[lang]]}
//         onChange={(value) => setCode(value)}
//         editable={editable}
//         className="border rounded w-full overflow-auto"
//       />
//     </div>
//   );
// }

import { basicSetup } from "codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useState, useMemo } from "react";

// Define the language map with all languages from the dropdown
const languageMap = {
  javascript: langs.javascript(),
  typescript: langs.typescript(),
  python: langs.python(),
  java: langs.java(),
  c: langs.c(),
  cpp: langs.cpp(),
  css: langs.css(),
  html: langs.html(),
  json: langs.json(),
  php: langs.php(),
  ruby: langs.ruby(),
  rust: langs.rust(),
  go: langs.go(),
  csharp: langs.csharp(),
  sql: langs.sql(),
  swift: langs.swift(),
  kotlin: langs.kotlin(),
  markdown: langs.markdown(),
  xml: langs.xml(),
  yaml: langs.yaml(),
};

export default function CodeEditor({ code, setCode, editable = true }) {
  const [lang, setLang] = useState("javascript");
  const [copied, setCopied] = useState(false);

  // Use useMemo to prevent unnecessary re-creation of extensions
  const extensions = useMemo(() => {
    // Default to javascript if the selected language isn't in our map
    const langExtension = languageMap[lang] || langs.javascript();
    return [basicSetup, langExtension];
  }, [lang]);

  return (
    <div className="p-4 flex flex-col w-full min-w-0 sm:min-w-[320px] md:min-w-[480px] lg:min-w-[640px] xl:min-w-[800px] max-w-full mx-auto">
      {editable && (
        <select
          className="mb-2 p-2 border rounded bg-gray-100"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="csharp">C#</option>
          <option value="sql">SQL</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="markdown">Markdown</option>
          <option value="xml">XML</option>
          <option value="yaml">YAML</option>
        </select>
      )}

      <button
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex items-center gap-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition mb-2"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <CodeMirror
        value={code}
        height="300px"
        width="100%"
        theme={githubLight}
        extensions={extensions}
        onChange={(value) => setCode(value)}
        editable={editable}
        className="border rounded overflow-auto"
      />
    </div>
  );
}
