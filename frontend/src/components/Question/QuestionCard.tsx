import Link from "next/link";
import VoteButton from "../UI/VoteButton";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import DOMPurify from "dompurify";

interface QuestionCardProps {
  question: {
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
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        <VoteButton
          targetType="question"
          targetId={question._id}
          userId={question.user._id}
        />
        <div className="flex-1">
          <Link href={`/questions/${question._id}`}>
            <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
              {question.title}
            </h2>
          </Link>

          <div
            className="mt-2 text-gray-600 line-clamp-2 prose dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question.content),
            }}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Link
                key={tag}
                href={`/questions?tag=${tag}`}
                className="px-2.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                {question.answers?.length || 0}{" "}
                {question.answers?.length === 1 ? "answer" : "answers"}
              </span>
              <span>
                {question.votes}{" "}
                {Math.abs(question.votes) === 1 ? "vote" : "votes"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="hidden xs:inline">Asked by</span>
              <span className="font-medium">{question.user.name}</span>
              <span className="mx-1">on</span>
              <span>{format(new Date(question.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
