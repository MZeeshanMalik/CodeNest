import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import Resizable from "@tiptap/extension-resizable";
import { ResizableImageExtension } from "@/utils/ResizableImageExtension";
import TextAlign from "@tiptap/extension-text-align";

// import { createLowlight } from "lowlight";
// import css from "highlight.js/lib/languages/css";
// import js from "highlight.js/lib/languages/javascript";
// import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import typescript from "highlight.js/lib/languages/typescript";
import markdown from "highlight.js/lib/languages/markdown";
import yaml from "highlight.js/lib/languages/yaml";
import xml from "highlight.js/lib/languages/xml";
import shell from "highlight.js/lib/languages/shell";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import diff from "highlight.js/lib/languages/diff";
import ini from "highlight.js/lib/languages/ini";
import nginx from "highlight.js/lib/languages/nginx";
import scss from "highlight.js/lib/languages/scss";
import less from "highlight.js/lib/languages/less";
import stylus from "highlight.js/lib/languages/stylus";
import rust from "highlight.js/lib/languages/rust";
import kotlin from "highlight.js/lib/languages/kotlin";
import swift from "highlight.js/lib/languages/swift";
import dart from "highlight.js/lib/languages/dart";
import elixir from "highlight.js/lib/languages/elixir";
import erlang from "highlight.js/lib/languages/erlang";
import haskell from "highlight.js/lib/languages/haskell";
import lua from "highlight.js/lib/languages/lua";
import perl from "highlight.js/lib/languages/perl";
import r from "highlight.js/lib/languages/r";
import scala from "highlight.js/lib/languages/scala";
import vbscript from "highlight.js/lib/languages/vbscript";
import powershell from "highlight.js/lib/languages/powershell";
import groovy from "highlight.js/lib/languages/groovy";
import objectivec from "highlight.js/lib/languages/objectivec";
import matlab from "highlight.js/lib/languages/matlab";
import clojure from "highlight.js/lib/languages/clojure";
import coffeescript from "highlight.js/lib/languages/coffeescript";
import fsharp from "highlight.js/lib/languages/fsharp";
import julia from "highlight.js/lib/languages/julia";
import ocaml from "highlight.js/lib/languages/ocaml";
import scheme from "highlight.js/lib/languages/scheme";
import smalltalk from "highlight.js/lib/languages/smalltalk";
import vhdl from "highlight.js/lib/languages/vhdl";
import verilog from "highlight.js/lib/languages/verilog";
import ada from "highlight.js/lib/languages/ada";
import arduino from "highlight.js/lib/languages/arduino";
import asciidoc from "highlight.js/lib/languages/asciidoc";
import autohotkey from "highlight.js/lib/languages/autohotkey";
import awk from "highlight.js/lib/languages/awk";
import basic from "highlight.js/lib/languages/basic";
import bnf from "highlight.js/lib/languages/bnf";
import brainfuck from "highlight.js/lib/languages/brainfuck";
import c from "highlight.js/lib/languages/c";
import clojureRepl from "highlight.js/lib/languages/clojure-repl";
import cmake from "highlight.js/lib/languages/cmake";
import crystal from "highlight.js/lib/languages/crystal";
import d from "highlight.js/lib/languages/d";
import delphi from "highlight.js/lib/languages/delphi";
import dns from "highlight.js/lib/languages/dns";
import dos from "highlight.js/lib/languages/dos";
import elm from "highlight.js/lib/languages/elm";
import erlangRepl from "highlight.js/lib/languages/erlang-repl";
import excel from "highlight.js/lib/languages/excel";
import fix from "highlight.js/lib/languages/fix";
import fortran from "highlight.js/lib/languages/fortran";
import gcode from "highlight.js/lib/languages/gcode";
import gherkin from "highlight.js/lib/languages/gherkin";
import glsl from "highlight.js/lib/languages/glsl";
import golo from "highlight.js/lib/languages/golo";
import gradle from "highlight.js/lib/languages/gradle";
import haml from "highlight.js/lib/languages/haml";
import handlebars from "highlight.js/lib/languages/handlebars";
import haxe from "highlight.js/lib/languages/haxe";
import hsp from "highlight.js/lib/languages/hsp";
import http from "highlight.js/lib/languages/http";
import inform7 from "highlight.js/lib/languages/inform7";
import irpf90 from "highlight.js/lib/languages/irpf90";
import jbossCli from "highlight.js/lib/languages/jboss-cli";
import juliaRepl from "highlight.js/lib/languages/julia-repl";
import latex from "highlight.js/lib/languages/latex";
import ldif from "highlight.js/lib/languages/ldif";
import livescript from "highlight.js/lib/languages/livescript";
import llvm from "highlight.js/lib/languages/llvm";
import lsl from "highlight.js/lib/languages/lsl";
import makefile from "highlight.js/lib/languages/makefile";
import mathematica from "highlight.js/lib/languages/mathematica";
import maxima from "highlight.js/lib/languages/maxima";
import mel from "highlight.js/lib/languages/mel";
import mercury from "highlight.js/lib/languages/mercury";
import mipsasm from "highlight.js/lib/languages/mipsasm";
import mizar from "highlight.js/lib/languages/mizar";
import mojolicious from "highlight.js/lib/languages/mojolicious";
import monkey from "highlight.js/lib/languages/monkey";
import moonscript from "highlight.js/lib/languages/moonscript";
import n1ql from "highlight.js/lib/languages/n1ql";
import nim from "highlight.js/lib/languages/nim";
import nix from "highlight.js/lib/languages/nix";
import nsis from "highlight.js/lib/languages/nsis";
import openscad from "highlight.js/lib/languages/openscad";
import oxygene from "highlight.js/lib/languages/oxygene";
import parser3 from "highlight.js/lib/languages/parser3";
import pf from "highlight.js/lib/languages/pf";
import pgsql from "highlight.js/lib/languages/pgsql";
import plaintext from "highlight.js/lib/languages/plaintext";
import pony from "highlight.js/lib/languages/pony";
import processing from "highlight.js/lib/languages/processing";
import prolog from "highlight.js/lib/languages/prolog";
import properties from "highlight.js/lib/languages/properties";
import protobuf from "highlight.js/lib/languages/protobuf";
import puppet from "highlight.js/lib/languages/puppet";
import purebasic from "highlight.js/lib/languages/purebasic";
import q from "highlight.js/lib/languages/q";
import qml from "highlight.js/lib/languages/qml";
import rsl from "highlight.js/lib/languages/rsl";
import ruleslanguage from "highlight.js/lib/languages/ruleslanguage";
import sas from "highlight.js/lib/languages/sas";
import scilab from "highlight.js/lib/languages/scilab";
import sml from "highlight.js/lib/languages/sml";
import sqf from "highlight.js/lib/languages/sqf";
import stan from "highlight.js/lib/languages/stan";
import stata from "highlight.js/lib/languages/stata";
import step21 from "highlight.js/lib/languages/step21";
import subunit from "highlight.js/lib/languages/subunit";
import tap from "highlight.js/lib/languages/tap";
import tcl from "highlight.js/lib/languages/tcl";
import thrift from "highlight.js/lib/languages/thrift";
import tp from "highlight.js/lib/languages/tp";
import twig from "highlight.js/lib/languages/twig";
import vala from "highlight.js/lib/languages/vala";
import vbnet from "highlight.js/lib/languages/vbnet";
import vbscriptHtml from "highlight.js/lib/languages/vbscript-html";
import vim from "highlight.js/lib/languages/vim";
import x86asm from "highlight.js/lib/languages/x86asm";
import xl from "highlight.js/lib/languages/xl";
import xquery from "highlight.js/lib/languages/xquery";
import zephir from "highlight.js/lib/languages/zephir";
// import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/github.css";

import React from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";
const lowlight = createLowlight();

// Register all languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("javascript", js);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("bash", bash);
lowlight.register("json", json);
lowlight.register("sql", sql);
lowlight.register("php", php);
lowlight.register("ruby", ruby);
lowlight.register("go", go);
lowlight.register("typescript", typescript);
lowlight.register("markdown", markdown);
lowlight.register("yaml", yaml);
lowlight.register("xml", xml);
lowlight.register("shell", shell);
lowlight.register("dockerfile", dockerfile);
lowlight.register("diff", diff);
lowlight.register("ini", ini);
lowlight.register("nginx", nginx);
lowlight.register("scss", scss);
lowlight.register("less", less);
lowlight.register("stylus", stylus);
lowlight.register("rust", rust);
lowlight.register("kotlin", kotlin);
lowlight.register("swift", swift);
lowlight.register("dart", dart);
lowlight.register("elixir", elixir);
lowlight.register("erlang", erlang);
lowlight.register("haskell", haskell);
lowlight.register("lua", lua);
lowlight.register("perl", perl);
lowlight.register("r", r);
lowlight.register("scala", scala);
lowlight.register("vbscript", vbscript);
lowlight.register("powershell", powershell);
lowlight.register("groovy", groovy);
lowlight.register("objectivec", objectivec);
lowlight.register("matlab", matlab);
lowlight.register("clojure", clojure);
lowlight.register("coffeescript", coffeescript);
lowlight.register("fsharp", fsharp);
lowlight.register("julia", julia);
lowlight.register("ocaml", ocaml);
lowlight.register("scheme", scheme);
lowlight.register("smalltalk", smalltalk);
lowlight.register("vhdl", vhdl);
lowlight.register("verilog", verilog);
lowlight.register("ada", ada);
lowlight.register("arduino", arduino);
lowlight.register("asciidoc", asciidoc);
lowlight.register("autohotkey", autohotkey);
lowlight.register("awk", awk);
lowlight.register("basic", basic);
lowlight.register("bnf", bnf);
lowlight.register("brainfuck", brainfuck);
lowlight.register("c", c);
lowlight.register("clojure-repl", clojureRepl);
lowlight.register("cmake", cmake);
lowlight.register("crystal", crystal);
lowlight.register("d", d);
lowlight.register("delphi", delphi);
lowlight.register("dns", dns);
lowlight.register("dos", dos);
lowlight.register("elm", elm);
lowlight.register("erlang-repl", erlangRepl);
lowlight.register("excel", excel);
lowlight.register("fix", fix);
lowlight.register("fortran", fortran);
lowlight.register("gcode", gcode);
lowlight.register("gherkin", gherkin);
lowlight.register("glsl", glsl);
lowlight.register("golo", golo);
lowlight.register("gradle", gradle);
lowlight.register("haml", haml);
lowlight.register("handlebars", handlebars);
lowlight.register("haxe", haxe);
lowlight.register("hsp", hsp);
lowlight.register("http", http);
lowlight.register("inform7", inform7);
lowlight.register("irpf90", irpf90);
lowlight.register("jboss-cli", jbossCli);
lowlight.register("julia-repl", juliaRepl);
lowlight.register("latex", latex);
lowlight.register("ldif", ldif);
lowlight.register("livescript", livescript);
lowlight.register("llvm", llvm);
lowlight.register("lsl", lsl);
lowlight.register("makefile", makefile);
lowlight.register("mathematica", mathematica);
lowlight.register("maxima", maxima);
lowlight.register("mel", mel);
lowlight.register("mercury", mercury);
lowlight.register("mipsasm", mipsasm);
lowlight.register("mizar", mizar);
lowlight.register("mojolicious", mojolicious);
lowlight.register("monkey", monkey);
lowlight.register("moonscript", moonscript);
lowlight.register("n1ql", n1ql);
lowlight.register("nim", nim);
lowlight.register("nix", nix);
lowlight.register("nsis", nsis);
lowlight.register("openscad", openscad);
lowlight.register("oxygene", oxygene);
lowlight.register("parser3", parser3);
lowlight.register("pf", pf);
lowlight.register("pgsql", pgsql);
lowlight.register("plaintext", plaintext);
lowlight.register("pony", pony);
lowlight.register("processing", processing);
lowlight.register("prolog", prolog);
lowlight.register("properties", properties);
lowlight.register("protobuf", protobuf);
lowlight.register("puppet", puppet);
lowlight.register("purebasic", purebasic);
lowlight.register("q", q);
lowlight.register("qml", qml);
lowlight.register("rsl", rsl);
lowlight.register("ruleslanguage", ruleslanguage);
lowlight.register("sas", sas);
lowlight.register("scilab", scilab);
lowlight.register("sml", sml);
lowlight.register("sqf", sqf);
lowlight.register("stan", stan);
lowlight.register("stata", stata);
lowlight.register("step21", step21);
lowlight.register("subunit", subunit);
lowlight.register("tap", tap);
lowlight.register("tcl", tcl);
lowlight.register("thrift", thrift);
lowlight.register("tp", tp);
lowlight.register("twig", twig);
lowlight.register("vala", vala);
lowlight.register("vbnet", vbnet);
lowlight.register("vbscript-html", vbscriptHtml);
lowlight.register("vim", vim);
lowlight.register("x86asm", x86asm);
lowlight.register("xl", xl);
lowlight.register("xquery", xquery);
lowlight.register("zephir", zephir);

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }
  // // Handle image upload
  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const base64Image = e.target.result;
  //       editor.chain().focus().setImage({ src: base64Image }).run();
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e?.target?.result;
        editor
          .chain()
          .focus()
          .insertContent({
            type: "resizableImage", // Use the custom node type
            attrs: {
              src: base64Image,
              alt: "Uploaded Image",
              width: "auto",
              height: "auto",
            },
          })
          .run();
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    if (editor.isActive("resizableImage")) {
      editor.chain().focus().deleteNode("resizableImage").run();
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive("bold") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive("italic") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${
            editor.isActive("strike") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "codeBlock",
                attrs: {
                  language: "css", // Specify the language
                },
                content: [
                  {
                    type: "text",
                    text: " ",
                  },
                ],
              })
              .run()
          }
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded ${
            editor.isActive("code") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaCode />
        </button>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded ${
            editor.isActive("paragraph") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaParagraph />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          H3
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive("bulletList") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaListUl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive("orderedList") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaListOl />
        </button>

        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${
            editor.isActive("blockquote") ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <FaQuoteRight />
        </button>

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FaRedo />
        </button>
        {/* Image Upload */}
        <label className="p-2 rounded hover:bg-gray-100 cursor-pointer">
          <FaImage />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        {/* Delete Image */}
        {editor.isActive("image") && (
          <button
            onClick={handleDeleteImage}
            className="p-2 rounded hover:bg-gray-100"
          >
            Delete Image
          </button>
        )}
        {/* Text Alignment Buttons */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          <FaAlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          <FaAlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          <FaAlignRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
        >
          <FaAlignJustify />
        </button>
      </div>
    </>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Image,
  ResizableImageExtension,
  TextAlign.configure({
    types: ["heading", "paragraph", "image"], // Add "image" to enable alignment for images
    alignments: ["left", "center", "right", "justify"], // Supported alignments
    defaultAlignment: "left", // Default alignment
  }),
];

const content = `
<h1>Heading 1





</h1>
`;

const TiptapEditor = () => {
  return (
    <>
      {/* <style>{customStyles}</style> */}

      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
      ></EditorProvider>
    </>
  );
};

export default TiptapEditor;
