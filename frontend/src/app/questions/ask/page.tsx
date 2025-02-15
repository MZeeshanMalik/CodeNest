"use client";
import React, { useState } from "react";
import QuillEditor from "@/components/questions/Editor";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import GoodQuestionBox from "./GoodQuestionBox";
import { Button } from "@/components/UI/button";
import CodeEditor from "@/components/questions/CodeEditor";
import ImageUploader from "@/components/questions/ImageUploader";
import TagInput from "@/components/questions/TagInput";

const Page = () => {
  const [content, setContent] = useState<string>("");

  const handleEditorChange = (data: {
    text: string;
    contents: any;
    html: string;
    editor: any;
    textLength: number;
  }) => {
    setContent(data.html); // Store as HTML
    console.log("Received HTML from Editor:", data.html);
  };

  return (
    <div className="mt-4">
      <h1 className="text-4xl font-semibold text-center mb-4">
        Ask a Question
      </h1>
      <div className="flex flex-col items-center">
        <GoodQuestionBox />
        <div className="w-full max-w-4xl mx-auto p-4">
          <Label className="text-lg ">Title</Label>
          <p className="text-sm text-gray-600 mb-1">
            Write a compelling title that sparks curiosity and discussion!
          </p>
          <Input placeholder="e.g. Why is my Node.js server crashing" />
        </div>
        <div className="w-full max-w-4xl mx-auto p-4">
          <Label className="text-lg ">
            What are the details of your problem?
          </Label>
          <p className="text-sm text-gray-600 mb-1">
            Provide more context for better answers and solutions.
          </p>
          <QuillEditor
            value={content}
            onChange={handleEditorChange}
            maxLength={1000}
            placeholder="e.g. I'm trying to fetch data using Axios in Next.js, but I keep getting a CORS error. How can I fix it?"
          />

          {/* <pre className="mt-2 p-2 bg-gray-200 text-sm rounded">
            {JSON.stringify(content, null, 2)}
          </pre> */}

          <div className="mt-6 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-semibold">
              Preview your question details
            </h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        <div>
          <Label className="text-lg ">
            Add code snippets or examples (optional)
          </Label>
          <p className="text-sm text-gray-600 mb-1">
            Provide some code snippets for better understanding.
          </p>
          <CodeEditor />
        </div>
        <div className="w-full max-w-4xl mx-auto p-4">
          <Label className="text-lg ">Add images (optional)</Label>
          <p className="text-sm text-gray-600 mb-1">
            Upload images to better explain your question.
          </p>
          <ImageUploader />
        </div>
        <div className="w-full max-w-4xl mx-auto p-4">
          <TagInput />
        </div>
        <div>
          <Button className="bg-btnColor hover:bg-btnHoverCol mb-2 w-full">
            Post question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
