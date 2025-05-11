"use client";

import { useState, useEffect } from "react";
import { getAllQuestions } from "@/lib/questionQuery";

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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseQuestionsReturn {
  questions: Question[];
  pagination: Pagination | null;
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  changeSort: (sortOption: string) => void;
  filterByTag: (tag: string | null) => void;
}

export const useQuestions = (initialLimit = 10): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [tag, setTag] = useState<string | null>(null);
  const [limit] = useState(initialLimit);
  const fetchQuestions = async (pageToFetch: number, reset = false) => {
    setLoading(true);
    try {
      const data = await getAllQuestions(
        pageToFetch,
        limit,
        sort,
        tag || undefined
      );

      if (reset) {
        setQuestions(data.questions || []);
      } else {
        setQuestions((prev) => [...prev, ...(data.questions || [])]);
      }

      setPagination(data.pagination || null);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestions(1, true);
    // We're intentionally not including fetchQuestions in dependencies
    // as it would cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, tag]);

  const loadMore = () => {
    if (pagination?.hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQuestions(nextPage);
    }
  };

  const changeSort = (sortOption: string) => {
    if (sort !== sortOption) {
      setSort(sortOption);
      setPage(1);
    }
  };

  const filterByTag = (selectedTag: string | null) => {
    setTag(selectedTag);
    setPage(1);
  };

  return {
    questions,
    pagination,
    loading,
    error,
    loadMore,
    changeSort,
    filterByTag,
  };
};
