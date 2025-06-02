"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { format } from "date-fns";
import {
  MessageSquare,
  ArrowUp,
  ArrowDown,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import QuillEditor from "@/components/questions/Editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
import "highlight.js/styles/github-dark.css";
import CodeEditor from "@/components/questions/CodeEditor";
import { AnimatePresence, motion } from "framer-motion";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { useInView } from "react-intersection-observer";
import { toast } from "@/hooks/use-toast";
import VoteButton from "@/components/UI/VoteButton";
import RelatedQuestions from "@/components/questions/RelatedQuestions";
import QuestionSidebar from "@/components/questions/QuestionSidebar";
import AnswerCard from "@/components/Answer/AnswerCard";
import { usePostAnswer } from "@/hooks/useAnswer";
import { useGetQuestionById } from "@/hooks/useQuestionDetail";
import QuestionActions from "@/components/Question/QuestionActions";
import { useAuth } from "@/services/AuthProvider";
import { API_URL } from "@/utils/apiRoutes";
import Image from "next/image";

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  votes: number;
  answers: Answer[];
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  codeBlocks: string;
  images?: string[];
  user?: string;
  pagination: {
    hasNextPage: boolean;
  };
}

interface Answer {
  _id: string;
  content: string;
  codeBlocks?: string;
  votes: number;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const QuestionPage = () => {
  const { QuestionPage } = useParams();
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postAnswerMutation = usePostAnswer();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

  const {
    data: question,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useGetQuestionById(QuestionPage as string, page);

  const hasMore = question?.pagination?.hasNextPage || false;
  const loadMoreAnswers = useCallback(async () => {
    if (!hasMore || !question) return;
    setPage((prev) => prev + 1);
  }, [hasMore, question]);

  useEffect(() => {
    if (inView) {
      loadMoreAnswers();
    }
  }, [inView, loadMoreAnswers]);

  const handleAnswerSubmit = async () => {
    if (!question) return;

    const plainText = answer.replace(/<[^>]*>/g, "");
    const wordCount = plainText.trim().split(/\s+/).length;
    const MIN_WORDS = 4;

    if (!answer || wordCount < MIN_WORDS) {
      toast({
        title: "Validation Error",
        description: `Your answer must contain at least ${MIN_WORDS} words. Current word count: ${wordCount}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await postAnswerMutation.mutateAsync({
        questionId: question._id,
        content: answer,
        codeBlocks: code,
      });
      setAnswer("");
      setCode("");
      setShowEditor(false);
      refetch(); // Refetch the question data to get the new answer
      toast({
        title: "Success",
        description: "Your answer has been posted",
        variant: "default",
      });
    } catch (error) {
      console.error("Answer submission failed:", error);
      toast({
        title: "Error",
        description: "Failed to post your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!question?.images) return;
      setSelectedImageIndex((prevIndex) => {
        const newIndex =
          prevIndex <= 0 ? question.images!.length - 1 : prevIndex - 1;
        setSelectedImage(question.images![newIndex]);
        return newIndex;
      });
    },
    [question?.images]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!question?.images) return;
      setSelectedImageIndex((prevIndex) => {
        const newIndex =
          prevIndex >= question.images!.length - 1 ? 0 : prevIndex + 1;
        setSelectedImage(question.images![newIndex]);
        return newIndex;
      });
    },
    [question?.images]
  );

  const handleImageClick = (imagePath: string, index: number) => {
    setSelectedImage(imagePath);
    setSelectedImageIndex(index);
  };

  const handleCloseLightbox = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setSelectedImageIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft") {
        handlePreviousImage(e as any);
      } else if (e.key === "ArrowRight") {
        handleNextImage(e as any);
      } else if (e.key === "Escape") {
        setSelectedImage(null);
        setSelectedImageIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePreviousImage, handleNextImage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <div className="text-center">
          <SyncLoader color="#e02472" margin={6} size={12} />
          <p className="mt-6 text-gray-600 dark:text-gray-400 animate-pulse">
            Loading question details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-red-200 dark:border-red-900">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Question not found
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          The question you're looking for might have been removed or is
          temporarily unavailable.
        </p>
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const handleEditorChange = (content: string) => {
    setAnswer(content);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Question Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {question.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Asked {format(new Date(question.createdAt), "MMM d, yyyy")}
                  </span>
                  <QuestionActions
                    questionId={question._id}
                    authorId={question.user._id}
                    title={question.title}
                  />
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-4 sm:p-6">
              <div className="flex gap-4 sm:gap-6">
                {/* Voting Section */}
                <div className="flex-shrink-0">
                  <VoteButton
                    targetType="question"
                    targetId={question._id}
                    userId={question.user?._id}
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
                  {/* Problem Description */}
                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base break-words">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(question.content),
                      }}
                    />
                  </div>

                  {/* Image Gallery */}
                  {question.images && question.images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <ZoomIn className="w-5 h-5" />
                        Attached Images ({question.images.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {question.images.map(
                          (imagePath: string, index: number) => (
                            <div
                              key={index}
                              className="relative group cursor-pointer rounded-lg overflow-hidden aspect-[4/3]"
                              onClick={() => handleImageClick(imagePath, index)}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={
                                    imagePath.startsWith("http")
                                      ? imagePath
                                      : `${API_URL}/uploads/questionImages/${imagePath}`
                                  }
                                  alt={`Question image ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lightbox */}
                  <AnimatePresence>
                    {selectedImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                          setSelectedImage(null);
                          setSelectedImageIndex(-1);
                        }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 md:p-8 flex items-center justify-center"
                      >
                        <button
                          onClick={handleCloseLightbox}
                          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
                        >
                          <X className="w-8 h-8" />
                        </button>

                        {/* Navigation Buttons */}
                        {question?.images && question.images.length > 1 && (
                          <>
                            <button
                              onClick={handlePreviousImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
                            >
                              <ChevronLeft className="w-10 h-10" />
                            </button>
                            <button
                              onClick={handleNextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
                            >
                              <ChevronRight className="w-10 h-10" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        {question?.images && question.images.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                            {selectedImageIndex + 1} / {question.images.length}
                          </div>
                        )}

                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.9 }}
                          className="relative max-w-7xl w-full h-full flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image
                            src={
                              selectedImage.startsWith("http")
                                ? selectedImage
                                : `${API_URL}/uploads/questionImages/${selectedImage}`
                            }
                            alt="Full size image"
                            fill
                            className="object-contain"
                            unoptimized={true}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Code Block */}
                  {question.codeBlocks && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                        Code Example
                      </h3>
                      <div className="overflow-x-auto">
                        <div className="w-full">
                          <CodeEditor
                            code={question.codeBlocks}
                            setCode={() => {}}
                            editable={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full dark:bg-blue-900/50 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-auto h-8  sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-semibold p-2">
                        {question.user?.name}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {question.author?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Author
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                {question.answers.length} Answers
              </h2>
            </div>
            <div className="space-y-6">
              {question.answers.map((answer: Answer) => (
                <AnswerCard
                  key={answer._id}
                  answer={answer}
                  onUpdate={() => {
                    refetch();
                  }}
                  onDelete={() => {
                    refetch();
                  }}
                />
              ))}
            </div>
            <div ref={ref} className="h-8 sm:h-10">
              {hasMore && (
                <div className="text-center p-3 sm:p-4">
                  <SyncLoader color="#e02472" size={6} />
                </div>
              )}
            </div>
          </div>

          {/* Post Answer Section */}
          <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Answer
              </h2>
              <QuillEditor
                value={answer}
                onChange={handleEditorChange}
                placeholder="Write your answer here (Markdown supported)..."
              />

              <div className="mt-3 sm:mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Provide some code snippets if available
                  </p>
                  <Button
                    onClick={() => setShowEditor(!showEditor)}
                    className="text-xs sm:text-sm bg-btnColor hover:bg-btnColor/90 text-white"
                  >
                    {showEditor ? "Remove Code block" : "Add Code block"}
                  </Button>
                </div>
                {showEditor && (
                  <BoxReveal>
                    <div className="mt-3 overflow-x-auto">
                      <CodeEditor
                        code={code}
                        setCode={(val: string) => setCode(val)}
                        editable={true}
                      />
                    </div>
                  </BoxReveal>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={isSubmitting}
                  className="bg-btnColor hover:bg-btnColor/90 text-white px-6 py-2 rounded-md"
                >
                  {isSubmitting ? (
                    <SyncLoader color="#f1f3f2" size={6} />
                  ) : (
                    "Post Answer"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Questions Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <RelatedQuestions
              currentQuestionId={question._id}
              currentTags={question.tags}
            />
            <QuestionSidebar title="Top Questions" type="top" limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
