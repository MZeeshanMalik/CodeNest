import RichTextExample from "@/components/questions/RichTextEditor";
// import RichTextEditor from "@/components/questions/RichTextEditor";
import React from "react";

function page() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-center">Ask a Question</h1>
      <RichTextExample />
    </div>
  );
}

export default page;
