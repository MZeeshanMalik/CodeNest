"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { format } from "date-fns";
import { MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/UI/button";
import QuillEditor from "@/components/questions/Editor";
// import { Textarea } from "@/components/UI/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

// import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import CodeEditor from "@/components/questions/CodeEditor";
import { AnimatePresence } from "framer-motion";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { postAnswer, voteAnswer } from "@/lib/answerQuery";
import { useInView } from "react-intersection-observer";
import { toast } from "@/hooks/use-toast";
import VoteButton from "@/components/UI/VoteButton";
import RelatedQuestions from "@/components/questions/RelatedQuestions";
import AnswerCard from "@/components/Answer/AnswerCard";
import { usePostAnswer } from "@/hooks/useAnswer";
// import { watch } from "react-hook-form";
// import QuillEditor from "@/components/questions/Editor";

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
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postAnswerMutation = usePostAnswer();

  const loadMoreAnswers = useCallback(async () => {
    if (!hasMore || !question) return;
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:3000/api/v1/question/${QuestionPage}`,
        { params: { page: page + 1 } }
      );

      if (data.data.answers.length === 0) {
        setHasMore(false);
        return;
      }

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answers: [...prev.answers, ...data.data.answers],
              pagination: data.data.pagination,
            }
          : null
      );
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more answers:", error);
    }
  }, [QuestionPage, page, hasMore, question]);

  useEffect(() => {
    if (inView) {
      loadMoreAnswers();
    }
  }, [inView, loadMoreAnswers]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:3000/api/v1/question/${QuestionPage}`,
          {
            withCredentials: true,
          }
        );
        setQuestion(data.data);
        setHasMore(data.data.pagination.hasNextPage);
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [QuestionPage]);

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
    } catch (error) {
      console.error("Answer submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-8">
        <SyncLoader color="#e02472" />
      </div>
    );
  if (!question)
    return (
      <div className="text-center p-8 text-red-500">Question not found</div>
    );

  const handleEditorChange = (content: string) => {
    setAnswer(content);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Question Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {question?.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Asked {format(new Date(question?.createdAt), "MMM d, yyyy")}
                  </span>
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
                    userId={question.author?._id}
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
                  {/* Problem Description */}
                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base break-words">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(question?.content),
                      }}
                    />
                  </div>

                  {/* Code Block */}
                  {question?.codeBlocks && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                        Code Example
                      </h3>
                      <div className="overflow-x-auto flex justify-center">
                        <div className="w-full max-w-full">
                          <CodeEditor
                            setCode={() => {}}
                            code={question.codeBlocks}
                            editable={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question?.tags?.map((tag) => (
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
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                        {question?.author?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {question?.author?.name}
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
                {question?.answers?.length} Answers
              </h2>
            </div>

            <div className="space-y-6">
              {question?.answers?.map((answer) => (
                <AnswerCard
                  key={answer._id}
                  answer={answer}
                  onUpdate={() => {
                    // Refresh the question data
                    const getData = async () => {
                      try {
                        const { data } = await axios.get(
                          `http://127.0.0.1:3000/api/v1/question/${QuestionPage}`
                        );
                        setQuestion(data.data);
                      } catch (error) {
                        console.error("Error fetching question:", error);
                      }
                    };
                    getData();
                  }}
                  onDelete={() => {
                    // Remove the answer from the state
                    setQuestion((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        answers: prev.answers.filter(
                          (a) => a._id !== answer._id
                        ),
                      };
                    });
                  }}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={ref} className="h-8 sm:h-10">
              {hasMore && (
                <div className="text-center p-3 sm:p-4">
                  <SyncLoader color="#e02472" size={6} />
                </div>
              )}
            </div>
          </div>

          {/* Post Answer Section */}
          <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
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
                  className="bg-btnColor hover:bg-btnColor/90 text-white"
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
          <div className="sticky top-6">
            <RelatedQuestions
              currentQuestionId={question._id}
              currentTags={question.tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
