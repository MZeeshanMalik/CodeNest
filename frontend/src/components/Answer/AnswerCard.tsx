import { useState, useEffect } from "react";
import VoteButton from "../UI/VoteButton";
import { MoreVertical, Edit, Trash2, Flag } from "lucide-react";
import { useAuth } from "@/services/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import Editor from "../questions/Editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { useUpdateAnswer, useDeleteAnswer } from "@/hooks/useAnswer";
import { API_URL } from "@/utils/apiRoutes";
import axiosInstance from "@/lib/axios";
import CodeEditor from "../questions/CodeEditor";

interface AnswerCardProps {
  answer: {
    _id: string;
    content: string;
    codeBlocks?: string;
    user: {
      _id: string;
      name: string;
    };
    votes: number;
    createdAt: string;
  };
  onUpdate?: () => void;
  onDelete?: () => void;
}

const AnswerCard = ({ answer, onUpdate, onDelete }: AnswerCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    content: answer.content,
    codeBlocks: answer.codeBlocks,
  });
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const updateAnswerMutation = useUpdateAnswer();
  const deleteAnswerMutation = useDeleteAnswer();

  const isAuthor = user?._id === answer.user._id;

  const handleUpdate = async () => {
    if (!editedContent.content.trim()) {
      toast({
        title: "Error",
        description: "Answer content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAnswerMutation.mutateAsync({
        answerId: answer._id,
        editedContent,
      });
      console.log("Answer updated successfully");
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating answer:", error);
      console.log(error);
      toast({
        title: "Error",
        description: `Failed to update answer. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    try {
      await deleteAnswerMutation.mutateAsync(answer._id);
      onDelete?.();
    } catch (error) {
      // console.log(error);
      console.error("Error deleting answer:", error);
    }
  };

  const handleReport = async () => {
    try {
      const response = await fetch(
        `
      ${API_URL}/api/v1/answer/${answer._id}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ reason: reportReason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to report answer");
      }

      toast({
        title: "Success",
        description: "Answer reported successfully",
      });

      setIsReportDialogOpen(false);
      setReportReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report answer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <VoteButton
          targetType="answer"
          targetId={answer._id}
          userId={answer.user._id}
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <Editor
                value={editedContent.content}
                onChange={(value: string) =>
                  setEditedContent({ ...editedContent, content: value })
                }
                // onChange={setEditedContent}
                onSubmit={handleUpdate}
              />
              {answer.codeBlocks && (
                <>
                  <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                      Code Example
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <CodeEditor
                      code={answer.codeBlocks}
                      setCode={(newcode: string) => {
                        setEditedContent({
                          ...editedContent,
                          codeBlocks: newcode,
                        });
                      }}
                      editable={true}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="text-gray-600 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: answer.content }}
              />
              {answer.codeBlocks && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                    Code Example
                  </h3>
                  <div className="overflow-x-auto">
                    <CodeEditor
                      code={answer.codeBlocks}
                      setCode={() => {}}
                      editable={false}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                by {answer.user.name}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(answer.createdAt).toLocaleDateString()}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthor ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => setIsReportDialogOpen(true)}
                    className="text-red-600"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Answer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting this answer..."
              className="w-full p-2 border rounded-md min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleReport}>Submit Report</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .prose pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
          font-family: "Fira Code", "Consolas", monospace;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #4b5563;
          font-style: italic;
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 1rem;
        }

        .prose code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: "Fira Code", "Consolas", monospace;
          font-size: 0.9em;
          color: #ef4444;
        }

        .dark .prose pre {
          background: #1a1a1a;
          color: #e5e5e5;
        }

        .dark .prose blockquote {
          background-color: #2d2d2d;
          color: #e5e5e5;
          border-left-color: #60a5fa;
        }

        .dark .prose code {
          background-color: #2d2d2d;
          color: #f87171;
        }
      `}</style>
    </div>
  );
};

export default AnswerCard;
