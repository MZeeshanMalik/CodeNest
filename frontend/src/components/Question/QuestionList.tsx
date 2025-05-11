"use client";

import { useState } from "react";
import QuestionCard from "@/components/Question/QuestionCard";
import { SyncLoader } from "react-spinners";
import { Button } from "@/components/UI/button";
import Link from "next/link";

interface Question {
  _id: string;
  title: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
  votes: number;
  answers: any[];
  createdAt: string;
  tags: string[];
}

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyStateMessage?: string;
  selectedTag?: string | null;
}

export default function QuestionList({
  questions,
  loading,
  hasMore,
  onLoadMore,
  emptyStateMessage = "No questions found",
  selectedTag = null,
}: QuestionListProps) {
  return (
    <>
      {loading && questions.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md border border-gray-200">
          <SyncLoader color="#3b82f6" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}

          {hasMore && (
            <div className="text-center py-6">
              <Button
                onClick={onLoadMore}
                disabled={loading}
                variant="outline"
                className="px-6"
              >
                {loading ? (
                  <SyncLoader color="#3b82f6" size={8} />
                ) : (
                  "Load More Questions"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {emptyStateMessage}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedTag
              ? `There are no questions with the tag [${selectedTag}].`
              : "There are no questions available."}
          </p>
          <Link href="/questions/ask">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Ask the first question
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
