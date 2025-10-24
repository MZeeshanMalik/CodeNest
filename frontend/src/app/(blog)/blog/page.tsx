"use client";
import { CommentSection } from "@/components/blogComponents/Comment";

import { useState } from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: Comment[];
  showReply: boolean;
}

const BlogPage = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Doe",
      content: "Great article! Really enjoyed the insights about Next.js.",
      likes: 12,
      replies: [],
      showReply: false,
    },
  ]);
  const relatedArticles = [
    {
      id: "1",
      title: "Web Development Trends in 2024",
      author: "Michael Chen",
      date: "Dec 10, 2023",
      readTime: "5 min read",
      imageUrl: "/images/web-dev-trends.jpg",
      excerpt:
        "Explore the latest trends shaping the future of web development...",
    },
    {
      id: "2",
      title: "Modern JavaScript Frameworks Comparison",
      author: "Sarah Johnson",
      date: "Dec 5, 2023",
      readTime: "8 min read",
      imageUrl: "/images/js-frameworks.jpg",
      excerpt:
        "Detailed analysis of popular JavaScript frameworks and their best use cases...",
    },
    // Add more articles as needed
  ];
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const toggleReply = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReply: !comment.showReply }
          : comment
      )
    );
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      likes: 0,
      replies: [],
      showReply: false,
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  const addReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now().toString(),
                author: "Current User",
                content: replyText,
                likes: 0,
                replies: [],
                showReply: false,
              },
            ],
            showReply: false,
          };
        }
        return comment;
      })
    );
    setReplyText("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Blog Content */}
      <article className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Next.js 14: The Future of Full-Stack Development
        </h1>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
          <div>
            <p className="font-medium">Jane Smith</p>
            <p className="text-gray-500 text-sm">Nov 15, 2023 · 8 min read</p>
          </div>
        </div>
        <p className="text-lg mb-6">
          The latest release of Next.js brings groundbreaking features that are
          transforming...
          {/* Full blog content would go here */}
        </p>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>423</span>
          </button>
        </div>
      </article>

      <CommentSection />
      {/* <RelatedArticles articles={relatedArticles} /> */}
      {/* Related Articles */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Related Articles
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-medium">
              Mastering AI Prompt Engineering
            </h3>
            <p className="text-sm text-gray-500">June 28, 2024</p>
            <div className="mt-2 flex space-x-2">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                AI
              </span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                ChatGPT
              </span>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-medium">
              The Future of AI in Content Creation
            </h3>
            <p>
              The greated all time best is chatgpt Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Iusto cum aperiam veritatis,
              temporibus doloremque at. Possimus eaque id beatae dolore.
            </p>
            <p className="text-sm text-gray-500">July 2, 2024</p>
            <div className="mt-2 flex space-x-2">
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded">
                AI
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                Automation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  onLike,
  onReply,
  onAddReply,
  replyText,
  setReplyText,
}: any) => {
  return (
    <div className="mb-6 ml-4 border-l-2 pl-4">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
        <p className="font-medium">{comment.author}</p>
      </div>
      <p className="text-gray-600 mb-3">{comment.content}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onLike(comment.id)}
          className="flex items-center gap-1 text-gray-500 hover:text-red-500"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {comment.likes}
        </button>
        <button
          onClick={() => onReply(comment.id)}
          className="text-gray-500 hover:text-blue-600"
        >
          Reply
        </button>
      </div>

      {comment.showReply && (
        <div className="mt-4 ml-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Write a reply..."
            rows={2}
          />
          <button
            onClick={() => onAddReply(comment.id)}
            className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
          >
            Post Reply
          </button>
        </div>
      )}

      {/* {comment.replies.map((reply: Comment) => (
        <Comment
          key={reply.id}
          comment={reply}
          onLike={onLike}
          onReply={onReply}
          onAddReply={onAddReply}
          replyText={replyText}
          setReplyText={setReplyText}
        />
      ))} */}
    </div>
  );
};

export default BlogPage;
