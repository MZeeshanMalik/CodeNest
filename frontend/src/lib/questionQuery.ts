import { QuestionFormValues } from "@/types/questionTypes";
import { API_URL } from "@/utils/apiRoutes";
import axios from "axios";

export const postQuestion = async (data: QuestionFormValues) => {
  console.log("data in query", data);

  const formData = new FormData();

  // Append non-file fields
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("tags", JSON.stringify(data.tags));

  // If images exist, append them
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append(`images`, image); // Send each file
    });
  }

  const response = await axios.post(`${API_URL}/api/v1/question`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// query question by id or slug
export const getQuestions = async (query: string, page = 1, limit = 10) => {
  console.log(`${API_URL}/api/question/${query}`);
  const { data } = await axios.get(`${API_URL}/api/v1/question/${query}`, {
    params: { page, limit },
  });
  return data;
};

export const getQuestionById = async (id: string, page = 1, limit = 10) => {
  try {
    console.log(`Fetching question with id: ${id}`);
    const response = await axios.get(`${API_URL}/api/v1/question/${id}`, {
      params: { page, limit },
      withCredentials: true,
    });

    // Log the response data structure
    console.log("Question API response structure:", {
      status: response.status,
      hasData: !!response.data,
      questionFields: response.data.data ? Object.keys(response.data.data) : [],
      tags: response.data.data?.tags || [],
      images: response.data.data?.images || [],
      codeBlocks: response.data.data?.codeBlocks ? "present" : "absent",
      userInfo: response.data.data?.user ? "present" : "absent",
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const searchQuestions = async (query: string, page = 1, limit = 10) => {
  console.log("Searching for:", query); // Debug log
  const response = await axios.get(`${API_URL}/api/v1/question/search`, {
    params: { query, page, limit },
    withCredentials: true,
  });
  console.log("Search response:", response.data); // Debug log
  return response.data.data; // Return the nested data structure
};

export const getRelatedQuestions = async (
  tags: string[],
  excludeId: string
) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/question/related`, {
      params: {
        tags: tags.join(","),
        excludeId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching related questions:", error);
    throw error;
  }
};

export const getTopVotedQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/question/top-voted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top voted questions:", error);
    throw error;
  }
};

export const getRandomQuestions = async (limit: number = 5) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/question/random`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching random questions:", error);
    throw error;
  }
};

export const getAllQuestions = async (
  page = 1,
  limit = 10,
  sort = "newest",
  tag?: string
) => {
  try {
    // Use the search endpoint with empty query to get all questions
    // We'll filter by tag if specified
    const params: any = { page, limit, sort };
    if (tag) {
      params.tag = tag;
    }

    const response = await axios.get(`${API_URL}/api/v1/question/search`, {
      params,
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    throw error;
  }
};

export const updateQuestion = async (
  id: string,
  data: Partial<QuestionFormValues>
) => {
  console.log("data before sending", data);
  try {
    const formData = new FormData();

    // Append non-file fields
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.tags) formData.append("tags", JSON.stringify(data.tags));
    if (data.codeBlocks) formData.append("codeBlocks", data.codeBlocks);

    // Add existing images information
    if (data.existingImages) {
      formData.append("existingImages", JSON.stringify(data.existingImages));
    } // If images exist, append them
    if (data.images && data.images.length > 0) {
      console.log(`Adding ${data.images.length} new images to form data`);
      data.images.forEach((image, index) => {
        if (data.images) {
          console.log(
            `Adding image ${index + 1}/${data.images.length}: ${image.name}`
          );
        }
        formData.append(`images`, image); // Send each file
      });
    }

    console.log("Sending update request for question:", {
      id,
      title: data.title,
      tagsCount: data.tags?.length || 0,
      imagesCount: data.images?.length || 0,
      existingImagesCount: data.existingImages?.length || 0,
      hasContent: !!data.content,
      hasCodeBlocks: !!data.codeBlocks,
    });

    const response = await axios.put(
      `${API_URL}/api/v1/question/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Question update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/v1/question/${id}`, {
    withCredentials: true,
  });

  return response.data;
};
