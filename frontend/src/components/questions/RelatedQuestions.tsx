"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getRelatedQuestions } from "@/lib/questionQuery";

interface Question {
  _id: string;
  title: string;
  votes: number;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
  };
}

interface RelatedQuestionsProps {
  currentQuestionId: string;
  currentTags: string[];
}

export default function RelatedQuestions({
  currentQuestionId,
  currentTags,
}: RelatedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const response = await getRelatedQuestions(
          currentTags,
          currentQuestionId
        );

        if (response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentQuestionId, currentTags]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No questions found
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Related Questions
      </h3>
      <div className="space-y-4">
        {questions.map((question) => (
          <Link
            key={question._id}
            href={`/questions/${question._id}`}
            className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors mt-4"
          >
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm font-medium">{question.votes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                  {question.title}
                </h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {question.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Asked by {question?.author?.name} on{" "}
                  {format(new Date(question.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
