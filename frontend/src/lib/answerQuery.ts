import { API_URL } from "@/utils/apiRoutes";
import axiosInstance from "./axios";

export const postAnswer = async (
  questionId: string,
  content: string,
  codeBlocks?: string
) => {
  const response = await axiosInstance.post("/api/v1/answer", {
    content,
    question: questionId,
    codeBlocks,
  });
  return response.data;
};

export const getAnswers = async (questionId: string) => {
  const response = await axiosInstance.get(
    `/api/v1/answer/question/${questionId}`
  );
  return response.data;
};

export const updateAnswer = async (
  answerId: string,
  editedContent: { content: string; codeBlocks?: string }
) => {
  try {
    console.log("This is answer api");
    const response = await axiosInstance.patch(
      `${API_URL}/api/v1/answer/updateAnswer/${answerId}`,
      {
        content: editedContent.content,
        codeBlocks: editedContent.codeBlocks,
      }
    );
    console.log("response is", response);
    return response.data;
  } catch (error) {
    console.error("Update answer error:", error);
    throw error;
  }
};

export const deleteAnswer = async (answerId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/answer/${answerId}`);
    return response.data;
  } catch (error) {
    console.error("Delete answer error:", error);
    throw error;
  }
};

export const voteAnswer = async (
  answerId: string,
  type: "upvote" | "downvote"
) => {
  try {
    const value = type === "upvote" ? 1 : -1;
    const response = await axiosInstance.post("/api/v1/vote", {
      targetType: "answer",
      targetId: answerId,
      value,
    });
    return response.data;
  } catch (error) {
    console.error("Vote error:", error);
    throw error;
  }
};
