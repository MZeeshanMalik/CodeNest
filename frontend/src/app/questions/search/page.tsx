"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchQuestions } from "@/lib/questionQuery";
import { SyncLoader } from "react-spinners";
import Link from "next/link";

interface Question {
  _id: string;
  title: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
  tags: string[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const { data } = await searchQuestions(query, page);
        setQuestions((prev) => [...prev, ...data.questions]);
        setHasMore(data.pagination.hasNextPage);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search Questions</h1>
        <p>Please enter a search query</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {loading && questions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <SyncLoader color="#e02472" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Link href={`/questions/${question._id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                  {question.title}
                </h2>
              </Link>
              <div className="mt-2 text-gray-600 line-clamp-2">
                {question.content}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    by {question.user.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <SyncLoader color="#ffffff" size={8} />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No questions found</p>
        </div>
      )}
    </div>
  );
}
