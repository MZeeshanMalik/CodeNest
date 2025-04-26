import { unknown, z } from "zod";

export const QuestionFormValuesSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(10, "Description must be at least 10 characters"),
  codeBlocks: z.string().optional(),
  tags: z.array(z.string()).min(1, "Please add at least one tag").default([]),
  // images: z.instanceof(File).optional(),
  images: z
    .array(z.instanceof(File))
    .max(5, "Only 5 images are allowed.")
    .optional(), // Handling file uploads
});
export type QuestionFormValues = z.infer<typeof QuestionFormValuesSchema>;
