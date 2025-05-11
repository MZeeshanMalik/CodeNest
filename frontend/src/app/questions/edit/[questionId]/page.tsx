"use client";
/* This is explicitly declared as a client component to fix React Server Component warnings.
   Next.js hooks like useParams() can only be used in client components. */

import React, { useState, useEffect } from "react";
import QuillEditor from "@/components/questions/Editor";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import CodeEditor from "@/components/questions/CodeEditor";
import ImageUploader from "@/components/questions/ImageUploader";
import TagInput from "@/components/questions/TagInput";
import { useUpdateQuestion } from "@/hooks/useQuestionActions";
import { useGetQuestionById } from "@/hooks/useQuestionDetail";
import { useForm } from "react-hook-form";
import {
  QuestionFormValues,
  QuestionFormValuesSchema,
} from "@/types/questionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { SyncLoader } from "react-spinners";
import { useAuth } from "@/services/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import AuthModal from "@/components/UI/AuthModal";
import { Code, Image as ImageIcon, Tag, PenLine, Send } from "lucide-react";
import QuestionSidebar from "@/components/questions/QuestionSidebar";

// Helper function to safely debug nested objects
const debugObjectStructure = (obj: any, name = "object") => {
  if (!obj) {
    console.log(`${name} is null or undefined`);
    return;
  }

  try {
    console.log(`${name} keys:`, Object.keys(obj));
    console.log(`${name} type:`, typeof obj);

    if (Array.isArray(obj)) {
      console.log(`${name} is an array with ${obj.length} items`);
      if (obj.length > 0) {
        console.log(`${name}[0] type:`, typeof obj[0]);
        if (typeof obj[0] === "object" && obj[0] !== null) {
          console.log(`${name}[0] keys:`, Object.keys(obj[0]));
        }
      }
    }
  } catch (error) {
    console.error(`Error debugging ${name}:`, error);
  }
};

export default function EditQuestionPage() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const questionId = params.questionId as string;

  const { data: question, isLoading: isLoadingQuestion } =
    useGetQuestionById(questionId);
  const updateQuestionMutation = useUpdateQuestion();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(QuestionFormValuesSchema),
    mode: "onChange",
  }); // Populate form with existing question data
  useEffect(() => {
    if (!question) return;
    debugObjectStructure(question, "question");
    if (question.tags) debugObjectStructure(question.tags, "question.tags");
    if (question.images)
      debugObjectStructure(question.images, "question.images");
    setValue("title", question.title || "");
    const questionContent = question.content || "";
    setContent(questionContent);
    setValue("content", questionContent);
    const questionTags = question.tags || [];
    setValue("tags", questionTags);
    if (question.codeBlocks) {
      setValue("codeBlocks", question.codeBlocks);
      setCode(question.codeBlocks);
    }

    // Track existing images in local state
    if (question.images && question.images.length > 0) {
      setExistingImages(question.images);
    }

    // Images are handled by ImageUploader via existingImages prop
    console.log("Form populated with:", {
      title: question.title,
      content: questionContent,
      tags: questionTags,
      codeBlocks: question.codeBlocks,
      existingImages: question.images,
    });
  }, [question, setValue]);

  // Check if user is the author
  useEffect(() => {
    if (!user || !question) return;
    console.log("Author check:", {
      questionUserId: question.user,
      userId: user._id,
      isEqual: question.user === user._id,
    });
    if (question.user !== user._id) {
      toast({
        title: "Unauthorized",
        description: "You can only edit your own questions",
        variant: "destructive",
      });
      router.push(`/questions/${questionId}`);
    }
  }, [question, user, questionId, router]);
  const onSubmit = (data: QuestionFormValues) => {
    if (!user) {
      setShowAuthModal(true);
      toast({
        title: "Sign in required",
        description: "Please log in to edit a question.",
        variant: "default",
      });
      return;
    }

    // Validate form data
    if (!data.title || !data.content || !data.tags || data.tags.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Make sure code blocks are included in the form data
    data.codeBlocks = code;

    // Include existing images in the submission
    data.existingImages = existingImages;

    // Debug form data before submission
    console.log("Preparing question update:", {
      ...data,
      questionId,
      tags: data.tags || [],
      content: data.content
        ? `Content length: ${data.content.length}`
        : "No content",
      images: data.images
        ? `${data.images.length} new images`
        : "No new images",
      existingImages:
        existingImages.length > 0
          ? `${existingImages.length} existing images`
          : "No existing images",
      codeBlocks: data.codeBlocks
        ? `Code length: ${data.codeBlocks.length}`
        : "No code",
    });
    setLoading(true);
    updateQuestionMutation.mutate(
      { questionId, data },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "✅ Question updated successfully!",
            variant: "success",
          });
          router.push(`/questions/${questionId}`);
        },
        onError: (error) => {
          console.error("Error updating question:", error);
          toast({
            title: "Error",
            description:
              (error as any)?.response?.data?.message || "An error occurred",
            variant: "destructive",
          });
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  const handleEditorChange = (content: string) => {
    setValue("content", content, { shouldValidate: true });
  };

  if (isLoadingQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SyncLoader color="#0070f3" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-btnColor to-btnHoverCol bg-clip-text text-transparent">
          Edit Question
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <Label htmlFor="title">Question Title</Label>
                    <Input
                      id="title"
                      placeholder="What's your programming question?"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  {/* Editor */}
                  <div>
                    <Label>Question Details</Label>
                    {typeof window !== "undefined" && (
                      <QuillEditor
                        value={content}
                        onChange={handleEditorChange}
                        placeholder="Explain your question in detail..."
                      />
                    )}
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.content.message}
                      </p>
                    )}
                  </div>
                  {/* Code Editor */}
                  <div>
                    <Label>Code Example (Optional)</Label>
                    <CodeEditor
                      code={code}
                      setCode={(newCode: string) => {
                        setCode(newCode);
                        setValue("codeBlocks", newCode, {
                          shouldValidate: true,
                        });
                      }}
                      editable={true}
                    />
                  </div>
                  {/* Tags */}
                  <div>
                    <Label>Tags</Label>
                    <TagInput
                      onTagsChange={(tags) =>
                        setValue("tags", tags, { shouldValidate: true })
                      }
                      initialTags={question?.tags || []}
                    />
                    {errors.tags && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tags.message}
                      </p>
                    )}
                  </div>{" "}
                  {/* Images */}
                  <div>
                    <Label>Images (Optional)</Label>{" "}
                    <ImageUploader
                      onImagesChange={(files) =>
                        setValue("images", files, { shouldValidate: true })
                      }
                      existingImages={question?.images || []}
                      onExistingImagesChange={(paths) => {
                        console.log(
                          "ImageUploader reported image change:",
                          paths
                        );
                        setExistingImages(paths);
                        // Make sure form knows about this change too
                        setValue("existingImages", paths, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    {errors.images && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.images.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/questions/${questionId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-btnColor hover:bg-btnHoverCol text-white"
                >
                  {loading ? (
                    <SyncLoader color="#ffffff" size={8} />
                  ) : (
                    <>
                      <PenLine className="w-4 h-4 mr-2" />
                      Update Question
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuestionSidebar />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    </>
  );
}
