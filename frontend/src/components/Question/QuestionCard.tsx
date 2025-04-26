import Link from "next/link";
import VoteButton from "../UI/VoteButton";

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
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <VoteButton
          targetType="question"
          targetId={question._id}
          // voteCount={question.votes}
          userId={question.user._id}
        />
        <div className="flex-1">
          <Link href={`/questions/${question._id}`}>
            <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
              {question.title}
            </h2>
          </Link>
          <div
            className="mt-2 text-gray-600 line-clamp-2 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: question.content,
            }}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                by {question.user.name}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex space-x-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
