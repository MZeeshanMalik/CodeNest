import {
  getQuestions,
  postQuestion,
  searchQuestions,
} from "@/lib/questionQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePostQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

// export const useGetQuestions = (query: string, page = 1, limit = 10) => {
//   const queryClient = useQueryClient();

//   return useQuery({
//     queryKey: ["questions", query, page, limit], // Cache key for different queries
//     queryFn: () => getQuestions(query, page, limit),
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//     cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
//     refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
//     onSuccess: (data) => {
//       queryClient.setQueryData(["questions", query], data);
//     },
//   });
// };
export const useGetQuestions = (query: string, page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["questions", query, page, limit], // Cache key for different queries
    queryFn: () => getQuestions(query, page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
    onSuccess: (data) => {
      queryClient.setQueryData(["questions", query], data);
    },
  });
};
export const useSearchQuestions = (query: string, page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["questions", query, page, limit], // Cache key for different queries
    queryFn: () => searchQuestions(query, page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
    onSuccess: (data) => {
      queryClient.setQueryData(["questions", query], data);
    },
  });
};
