import { getQuestionById } from "@/lib/questionQuery";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestionById = (id: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["question", id, page],
    queryFn: () => getQuestionById(id, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    refetchOnWindowFocus: false,
  });
};
