import { QuestionFormValues } from "@/types/questionTypes";
import { API_URL } from "@/utils/apiRoutes";
import axios from "axios";

// export const postQuestion = async (data: QuestionFormValues) => {
//   console.log("data in query", data);

//   const response = await axios.post(`${API_URL}/api/v1/question`, data, {
//     withCredentials: true,
//     headers: {
//       //   "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };
export const postQuestion = async (data: QuestionFormValues) => {
  console.log("data in query", data);

  const formData = new FormData();

  // Append non-file fields
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("tags", JSON.stringify(data.tags)); // Convert array to string

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

// export const postQuestion = async (data: QuestionFormValues) => {
//   const formData = new FormData();

//   // Append regular fields
//   formData.append("title", data.title);
//   formData.append("content", data.content);
//   data.tags.forEach((tag) => formData.append("tags", tag));

//   // Append files correctly
//   if (data.images && data.images.length > 0) {
//     data.images.forEach((file) => {
//       // Ensure this is a File object, not just path information
//       formData.append("images", file); // Use the field name your backend expects
//     });
//   }

//   console.log("FormData contents:");
//   for (let [key, value] of formData.entries()) {
//     console.log(key, value);
//   }

//   const response = await axios.post(`${API_URL}/api/v1/question`, formData, {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "multipart/form-data", // Let Axios set boundary automatically
//     },
//   });

//   return response.data;
// };

// export const postQuestion = async (
//   data: QuestionFormValues & { images?: File[] }
// ) => {
//   const formData = new FormData();

//   // Append text fields
//   formData.append("title", data.title);
//   formData.append("content", data.content);
//   // formData.append("tags", data.tags);
//   formData.append("tags", JSON.stringify(data.tags));

//   // Append images if they exist
//   if (data.images && data.images.length > 0) {
//     data.images.forEach((image) => {
//       formData.append("images", image); // Ensure "images" matches the backend field name
//     });
//   }

//   // Send request with FormData
//   const response = await axios.post(`${API_URL}/api/v1/question`, formData, {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response.data;
// };
export const getQuestions = async () => {
  const response = await axios.get(`${API_URL}/api/v1/questions`, {
    withCredentials: true,
  });
  return response.data;
};
