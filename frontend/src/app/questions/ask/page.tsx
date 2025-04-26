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

const Page = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

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
    <div className="mt-4">
      <h1 className="text-4xl font-semibold text-center mb-4">
        Ask a Question
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <GoodQuestionBox />
          <div className="w-full max-w-4xl mx-auto p-4">
            <Label className="text-lg ">Title</Label>
            <p className="text-sm text-gray-600 mb-1">
              Write a compelling title that sparks curiosity and discussion!
            </p>
            <Input
              {...register("title")}
              placeholder="e.g. Why is my Node.js server crashing"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
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
              placeholder="e.g. I'm trying to fetch data using Axios in Next.js, but I keep getting a CORS error. How can I fix it?"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}

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
            <CodeEditor
              setCode={(val: string) =>
                setValue("codeBlocks", val, { shouldValidate: true })
              }
              code={watch("codeBlocks")}
            />
            {errors.codeBlocks && (
              <p className="text-red-500 text-sm mt-1">
                {errors.codeBlocks.message}
              </p>
            )}
          </div>
          <div className="w-full max-w-4xl mx-auto p-4">
            <Label className="text-lg ">Add images (optional)</Label>
            <p className="text-sm text-gray-600 mb-1">
              Upload images to better explain your question.
            </p>
            <ImageUploader
              images={images}
              setImages={setImages}
              setValue={setValue}
            />

            {errors.images && (
              <p className="text-red-500 text-sm mt-1">
                {errors.images.message}
              </p>
            )}
          </div>
          <div className="w-full max-w-4xl mx-auto p-4 ">
            <TagInput
              tags={watch("tags")}
              setTags={(tags: string[]) =>
                setValue("tags", tags, { shouldValidate: true })
              }
            />
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>
          <div>
            <Button
              type="submit"
              className="bg-btnColor hover:bg-btnHoverCol mb-2 w-full"
              disabled={loading}
            >
              {loading ? <SyncLoader color="#f1f3f2" /> : "Post question"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
