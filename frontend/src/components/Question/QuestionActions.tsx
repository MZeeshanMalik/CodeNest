"use client";

import { useState } from "react";
import { useAuth } from "@/services/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Edit, Trash2, Flag, Share } from "lucide-react";
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
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/navigation";
import { useDeleteQuestion } from "@/hooks/useQuestionActions";
import { API_URL } from "@/utils/apiRoutes";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  RedditIcon,
} from "react-share";

interface QuestionActionProps {
  questionId: string;
  authorId: string;
  title: string;
}

export default function QuestionActions({
  questionId,
  authorId,
  title,
}: QuestionActionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const deleteQuestionMutation = useDeleteQuestion();

  console.log("QuestionActions props:", { questionId, authorId, title });
  console.log("Current user:", user);

  // Force re-render of dialog when closed to clean up any stale state
  const handleDialogClose = () => {
    if (isReportDialogOpen) {
      setIsReportDialogOpen(false);
      setReportReason("");
    }
    if (isShareDialogOpen) {
      setIsShareDialogOpen(false);
    }
    // Force enable pointer events and remove any stale aria-hidden attributes
    document.body.style.pointerEvents = "auto";
    document.body.removeAttribute("aria-hidden");
    // Remove any lingering overlay elements
    const overlays = document.querySelectorAll("[data-radix-focus-guard]");
    overlays.forEach((overlay) => overlay.remove());
  };

  // More thorough check for author status
  const checkIsAuthor = () => {
    // If no user is logged in, they can't be the author
    if (!user || !user._id || !authorId) return false;

    // Convert both to strings to handle ObjectId vs string comparisons
    const userIdStr = String(user._id);
    const authorIdStr = String(authorId);

    // Log the actual string values being compared
    console.log("ID comparison:", {
      userIdStr,
      authorIdStr,
      equal: userIdStr === authorIdStr,
    });

    return userIdStr === authorIdStr;
  };

  const isAuthor = checkIsAuthor();

  console.log("Is author check:", {
    userID: user?._id,
    authorId,
    isAuthor,
    userObject: user,
    userIdTypeOf: typeof user?._id,
    authorIdTypeOf: typeof authorId,
  });

  const shareUrl = `${window.location.origin}/questions/${questionId}`;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteQuestionMutation.mutateAsync(questionId);
      router.push("/questions");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/questions/edit/${questionId}`);
  };

  const handleReport = async () => {
    try {
      // Check if questionId is defined
      if (!questionId) {
        toast({
          title: "Error",
          description: "Question ID is missing. Cannot report this question.",
          variant: "destructive",
        });
        return;
      }

      // Implement reporting functionality
      await fetch(`${API_URL}/api/v1/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          targetId: questionId,
          targetType: "question",
          reason: reportReason,
        }),
      });

      setIsReportDialogOpen(false);
      setReportReason("");

      toast({
        title: "Report Submitted",
        description:
          "Thank you for reporting this content. We will review it shortly.",
      });
    } catch (error) {
      console.error("Error reporting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Debug helper (only rendered in development)
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div className="fixed bottom-0 right-0 bg-black/70 text-white p-2 text-xs max-w-xs z-50 rounded-tl-md">
        <div>User ID: {user?._id ? String(user._id) : "No user"}</div>
        <div>Author ID: {authorId ? String(authorId) : "No author"}</div>
        <div>Is Author: {isAuthor ? "Yes" : "No"}</div>
      </div>
    );
  };

  return (
    <>
      {process.env.NODE_ENV === "development" && renderDebugInfo()}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>

          {isAuthor && (
            <>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}

          {!isAuthor && (
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

      {/* Report Dialog */}
      <Dialog
        open={isReportDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleDialogClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting this question..."
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

      {/* Share Dialog */}
      <Dialog
        open={isShareDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleDialogClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Question</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-medium text-sm mb-2">Share "{title}"</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>

              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>

              <RedditShareButton url={shareUrl} title={title}>
                <RedditIcon size={40} round />
              </RedditShareButton>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Or copy the link</p>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none"
                />
                <Button
                  className="rounded-l-none"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Link Copied",
                      description: "The link has been copied to your clipboard",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
