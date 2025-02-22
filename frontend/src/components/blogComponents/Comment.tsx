"use client";
import { useState, useRef, useEffect } from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: Comment[];
  timestamp: string;
  isOwner?: boolean;
}

interface CommentProps {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
  level?: number;
}

const CommentComponent = ({
  comment,
  onReply,
  onLike,
  onDelete,
  onReport,
  level = 0,
}: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (commentId: string) => {
    setOpenMenuId(openMenuId === commentId ? null : commentId);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  return (
    <div
      className={`ml-${
        level * 8
      } mt-4 pl-4 border-l-2 border-gray-100 hover:border-gray-200 transition-colors`}
    >
      <div className="flex gap-4 group">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>

        <div className="flex-grow relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{comment.author}</h4>
              <p className="text-sm text-gray-500">{comment.timestamp}</p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => handleMenuToggle(comment.id)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {openMenuId === comment.id && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onReport(comment.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Report
                    </button>
                    {comment.isOwner && (
                      <button
                        onClick={() => {
                          onDelete(comment.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-3">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg
                className={`w-5 h-5 ${comment.likes ? "fill-current" : ""}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm">{comment.likes}</span>
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post Reply
                </button>
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies.map((reply) => (
        <CommentComponent
          key={reply.id}
          comment={{ ...reply, isOwner: reply.author === "Current User" }}
          onReply={onReply}
          onLike={onLike}
          onDelete={onDelete}
          onReport={onReport}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Current User",
      content: "This is my initial comment",
      likes: 2,
      replies: [],
      timestamp: "2 hours ago",
      isOwner: true,
    },
    {
      id: "2",
      author: "John Doe",
      content: "Great article! Thanks for sharing",
      likes: 5,
      replies: [
        {
          id: "3",
          author: "Current User",
          content: "Thanks for the feedback!",
          likes: 1,
          replies: [],
          timestamp: "1 hour ago",
          isOwner: true,
        },
      ],
      timestamp: "3 hours ago",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        likes: 0,
        replies: [],
        timestamp: "Just now",
        isOwner: true,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleReply = (parentId: string, content: string) => {
    const addReplyToComment = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now().toString(),
                author: "Current User",
                content,
                likes: 0,
                replies: [],
                timestamp: "Just now",
                isOwner: true,
              },
            ],
          };
        }
        return {
          ...comment,
          replies: addReplyToComment(comment.replies),
        };
      });
    };

    setComments(addReplyToComment(comments));
  };

  const handleLike = (commentId: string) => {
    const updateLikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return {
          ...comment,
          replies: updateLikes(comment.replies),
        };
      });
    };

    setComments(updateLikes(comments));
  };

  const handleDelete = (commentId: string) => {
    const deleteComment = (comments: Comment[]): Comment[] => {
      return comments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: deleteComment(comment.replies),
        }));
    };

    setComments(deleteComment(comments));
  };

  const handleReport = (commentId: string) => {
    console.log(`Reported comment: ${commentId}`);
    alert(`Comment ${commentId} has been reported to moderators.`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h3 className="text-2xl font-bold mb-6">
        Discussion ({comments.length})
      </h3>

      <div className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Join the discussion..."
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post Comment
        </button>
      </div>

      <div className="space-y-8">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={{ ...comment, isOwner: comment.author === "Current User" }}
            onReply={handleReply}
            onLike={handleLike}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
      </div>
    </div>
  );
};
