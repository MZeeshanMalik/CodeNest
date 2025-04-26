import { API_URL } from "@/utils/apiRoutes";
import axiosInstance from "./axios";
import { AxiosResponse } from "axios";
import axios from "axios";

interface VoteData {
  targetType: "question" | "answer";
  targetId: string;
  value: 1 | -1;
}

interface VoteResponse {
  data: {
    value: 1 | -1 | null;
    voteCount: number;
  };
}

interface UserVoteResponse {
  data: {
    value: 1 | -1 | null;
  };
}

export const vote = async ({
  targetType,
  targetId,
  value,
}: VoteData): Promise<AxiosResponse<VoteResponse>> => {
  try {
    const response = await axiosInstance.post<VoteResponse>("/api/v1/vote", {
      targetType,
      targetId,
      value,
    });
    return response;
  } catch (error) {
    console.error("Vote error:", error);
    throw error;
  }
};

// export const getUserVote = async (
//   targetType: "question" | "answer",
//   targetId: string
// ): Promise<AxiosResponse<UserVoteResponse>> => {
//   try {
//     const response = await axiosInstance.get<UserVoteResponse>(
//       `/api/v1/vote/user/${targetType}/${targetId}`
//     );
//     return response;
//   } catch (error) {
//     if ((error as any)?.response?.status === 404) {
//       return {
//         data: {
//           data: {
//             value: null,
//           },
//         },
//       } as AxiosResponse<UserVoteResponse>;
//     }
//     console.error("Get user vote error:", error);
//     throw error;
//   }
// };
export function getUserVote(
  targetType: "question" | "answer",
  targetId: string
) {
  return axios.get(`${API_URL}/api/v1/vote/${targetType}/${targetId}`);
}

export async function getVoteStatus(
  targetType: "question" | "answer",
  targetId: string
) {
  try {
    // Get both the vote count and user's vote in parallel
    const [voteRes, itemRes] = await Promise.all([
      axiosInstance.get<{ data: { value: 1 | -1 | null } }>(
        `/api/v1/vote/${targetType}/${targetId}`
      ),
      axiosInstance.get<{
        data: { answer?: { votes: number }; votes?: number };
      }>(
        targetType === "question"
          ? `/api/v1/question/${targetId}`
          : `/api/v1/answer/${targetId}`
      ),
    ]);

    // Log the full responses for debugging
    console.log("Vote Response:", voteRes.data);
    console.log("Item Response:", itemRes.data);

    // Extract votes from the response - handle both question and answer response structures
    const votes =
      targetType === "question"
        ? itemRes.data.data?.votes ?? 0
        : itemRes.data.data?.answer?.votes ?? 0;

    const userVote = voteRes.data.data?.value ?? 0;

    console.log(`Vote status for ${targetType} ${targetId}:`, {
      votes,
      userVote,
      rawVoteResponse: voteRes.data,
      rawItemResponse: itemRes.data,
    });

    return {
      votes,
      userVote: userVote === 1 || userVote === -1 ? userVote : 0,
    };
  } catch (err) {
    const error = err as { response?: { data: any } };
    console.error("Error fetching vote status:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    // Return default values on error
    return {
      votes: 0,
      userVote: 0,
    };
  }
}
