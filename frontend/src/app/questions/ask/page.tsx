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
import { usePostQuestion } from "@/hooks/useQuestion";
import { useForm } from "react-hook-form";
import {
  QuestionFormValues,
  QuestionFormValuesSchema,
} from "@/types/questionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { SyncLoader } from "react-spinners";
import { useAuth } from "@/services/AuthProvider";
import AuthModal from "@/components/UI/AuthModal";
import { Code, Image as ImageIcon, Tag, PenLine, Send } from "lucide-react";
import QuestionSidebar from "@/components/questions/QuestionSidebar";

const Page = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const questionMutation = usePostQuestion();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(QuestionFormValuesSchema),
    mode: "onChange",
  });

  const onSubmit = (data: QuestionFormValues) => {
    if (!user) {
      setShowAuthModal(true);
      toast({
        title: "Sign in required",
        description: "Please log in to post a question.",
        variant: "default",
      });
      return;
    }
    setLoading(true);
    console.log("data", data);
    setTimeout(() => {
      questionMutation.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "✅ Question submitted successfully!",
            variant: "success",
          });
          console.log("Question submitted successfully");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              (error as any)?.response?.data?.message || "An error occurred",
            variant: "destructive",
          });
          console.log("Error submitting question: ", error);
        },
      });
      setLoading(false);
    }, 2000);
  };

  const handleEditorChange = (content: string) => {
    setValue("content", content, { shouldValidate: true });
    console.log("Received HTML from Editor:", content);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-btnColor to-btnHoverCol bg-clip-text text-transparent">
          Ask a Question
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Share your programming challenge with our community of developers and
          get expert solutions
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main form column */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <GoodQuestionBox />
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <PenLine className="w-5 h-5 text-blue-600" />
                  <Label className="text-xl font-semibold text-gray-800">
                    Title
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Write a clear, specific title that summarizes your coding
                  problem
                </p>
                <Input
                  {...register("title")}
                  placeholder="e.g. How to implement JWT authentication in Node.js"
                  className="text-base py-3 focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <PenLine className="w-5 h-5 text-btnColor" />
                  <Label className="text-xl font-semibold text-gray-800">
                    Problem Details
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Describe your problem in detail. Include what you've tried and
                  what you expected to happen.
                </p>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <QuillEditor
                    value={content}
                    onChange={handleEditorChange}
                    placeholder="Explain your problem in detail..."
                  />
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errors.content.message}
                  </p>
                )}

                {content && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Preview
                    </h3>
                    <div
                      className="preview-content p-3 bg-white rounded border"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                )}
              </div>{" "}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-btnColor" />
                  <Label className="text-xl font-semibold text-gray-800">
                    Code Example
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Share code snippets to help others understand your issue
                  better
                </p>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CodeEditor
                    setCode={(val: string) =>
                      setValue("codeBlocks", val, { shouldValidate: true })
                    }
                    code={watch("codeBlocks") || ""}
                  />
                </div>
                {errors.codeBlocks && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errors.codeBlocks.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-btnColor" />
                    <Label className="text-xl font-semibold text-gray-800">
                      Images
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload screenshots or diagrams to illustrate your problem
                  </p>
                  <ImageUploader
                    images={images}
                    setImages={setImages}
                    setValue={setValue}
                  />
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-2 font-medium">
                      {errors.images.message}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <Label className="text-xl font-semibold text-gray-800">
                      Tags
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Add relevant tags to help categorize your question
                  </p>
                  <TagInput
                    tags={watch("tags")}
                    setTags={(tags: string[]) =>
                      setValue("tags", tags, { shouldValidate: true })
                    }
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-sm mt-2 font-medium">
                      {errors.tags.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full font-semibold text-lg flex items-center gap-2 transition-all transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <SyncLoader color="#ffffff" size={8} />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Post Question
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <QuestionSidebar title="Popular Questions" type="top" limit={5} />

              <QuestionSidebar
                title="Random Questions"
                type="random"
                limit={3}
                className="mt-6"
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Page;
