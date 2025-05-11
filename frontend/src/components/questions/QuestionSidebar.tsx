"use client";

import { useEffect, useState } from "react";
import { ArrowUpCircle, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getTopVotedQuestions, getRandomQuestions } from "@/lib/questionQuery";

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

interface QuestionSidebarProps {
  className?: string;
  title?: string;
  type?: "top" | "recent" | "random";
  limit?: number;
}

export default function QuestionSidebar({
  className = "",
  title = "Popular Questions",
  type = "top",
  limit = 5,
}: QuestionSidebarProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let response;

        if (type === "top") {
          response = await getTopVotedQuestions();
        } else if (type === "random") {
          response = await getRandomQuestions(limit);
        } else {
          // For recent, we'll use random for now since there's no specific API
          // You could add a getRecentQuestions function to questionQuery.ts
          response = await getRandomQuestions(limit);
        }

        if (response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error(`Error fetching ${type} questions:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [type, limit]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {type === "top" && (
            <ArrowUpCircle className="w-5 h-5 text-blue-500 mr-2" />
          )}
          {type === "recent" && (
            <Clock className="w-5 h-5 text-blue-500 mr-2" />
          )}
          {type === "random" && (
            <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
          )}
          {title}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <>
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                {question.title}
              </h4>

              <div className="mt-2 flex flex-wrap gap-1">
                {question.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {question.votes} {question.votes === 1 ? "vote" : "votes"}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">{question?.author?.name}</span>
                  {question.createdAt && (
                    <span>
                      • {format(new Date(question.createdAt), "MMM d")}
                    </span>
                  )}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No questions found
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
        <Link
          href="/questions"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all questions →
        </Link>
      </div>
    </div>
  );
}
