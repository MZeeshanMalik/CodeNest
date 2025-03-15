import React, { useState } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";

const languageMap: { [key: string]: any } = {
  javascript: langs.javascript(),
  typescript: langs.typescript(),
  python: langs.python(),
  java: langs.java(),
  c: langs.c(),
  cpp: langs.cpp(),
  csharp: langs.csharp(),
  php: langs.php(),
  ruby: langs.ruby(),
  swift: langs.swift(),
  go: langs.go(),
  rust: langs.rust(),
  kotlin: langs.kotlin(),
  sql: langs.sql(),
  markdown: langs.markdown(),
  yaml: langs.yaml(),
  json: langs.json(),
  xml: langs.xml(),
  html: langs.html(),
  css: langs.css(),
};

const CodeEditor = ({ code, setCode }) => {
  // const [code, setCode] = useState("// Paste your code sample here...");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="p-4">
      <select
        className="mb-2 p-2 border rounded bg-gray-100"
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="swift">Swift</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="kotlin">Kotlin</option>
        <option value="sql">SQL</option>
        <option value="markdown">Markdown</option>
        <option value="yaml">YAML</option>
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <CodeMirror
        className="border rounded w-full min-h-[300px] max-w-[100vw] sm:max-w-[600px] md:min-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px]"
        value={code}
        height="300px"
        extensions={[languageMap[language] || langs.javascript()]}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
};

export default CodeEditor;
