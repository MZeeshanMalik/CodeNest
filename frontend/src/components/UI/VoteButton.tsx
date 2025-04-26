"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { vote as voteApi, getVoteStatus } from "@/lib/voteQuery";
import { useAuth } from "@/services/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "./AuthModal";

export default function VoteButton({
  targetType,
  targetId,
  userId, // owner of the content
  showVoteType = "both",
}: {
  targetType: "question" | "answer";
  targetId: string;
  userId?: string;
  showVoteType?: "both" | "up" | "down";
}) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Local state comes _only_ from server on mount
  const [currentVote, setCurrentVote] = useState<0 | 1 | -1>(0);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 1️⃣ On mount, fetch both the vote count + my vote
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { votes, userVote } = await getVoteStatus(targetType, targetId);
        if (!cancelled) {
          setVoteCount(votes);
          setCurrentVote(userVote === 1 || userVote === -1 ? userVote : 0);
        }
      } catch (err) {
        console.error("Error loading vote status", err);
        toast({
          title: "Error",
          description: "Could not load votes. Try refreshing.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetType, targetId, toast]);

  const handleVote = async (value: 1 | -1) => {
    if (isVoting || loading) return;
    setIsVoting(true);

    // 2️⃣ guard rails
    if (!user) {
      setShowAuthModal(true);
      toast({
        title: "Sign in required",
        description: "Please log in to vote.",
        variant: "default",
      });
      setIsVoting(false);
      return;
    }
    if (user._id === userId) {
      toast({
        title: "Oops",
        description: "You cannot vote on your own content.",
        variant: "destructive",
      });
      setIsVoting(false);
      return;
    }

    // 3️⃣ calculate new states
    let newVote: 0 | 1 | -1;
    let newCount: number;

    if (currentVote === value) {
      // un-vote
      newVote = 0;
      newCount = voteCount - value;
    } else if (currentVote === -value) {
      // switch
      newVote = value;
      newCount = voteCount + 2 * value;
    } else {
      // brand new
      newVote = value;
      newCount = voteCount + value;
    }

    // 4️⃣ optimistic UI
    setCurrentVote(newVote);
    setVoteCount(newCount);

    try {
      await voteApi({ targetType, targetId, value });
    } catch (err) {
      console.error("Vote failed", err);
      // rollback
      setCurrentVote(currentVote);
      setVoteCount(voteCount);
      toast({
        title: "Error",
        description: "Could not register vote, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  // While loading initial state, you might render a spinner or grey-out
  if (loading) {
    return <div className="opacity-50">Loading votes…</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        {(showVoteType === "both" || showVoteType === "up") && (
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            aria-label="Upvote"
            className={`
              p-1 rounded hover:bg-gray-100 transition-colors
              ${currentVote === 1 ? "text-green-500" : "text-gray-500"}
              ${isVoting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}

        <span className="text-sm font-medium">{voteCount}</span>

        {(showVoteType === "both" || showVoteType === "down") && (
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            aria-label="Downvote"
            className={`
              p-1 rounded hover:bg-gray-100 transition-colors
              ${currentVote === -1 ? "text-red-500" : "text-gray-500"}
              ${isVoting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
