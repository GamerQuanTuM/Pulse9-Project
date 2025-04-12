"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSinglePost } from "@/actions/get-single-post";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { serverProfile } from "@/actions/server-profile";
import "./styles.css";
import LoadingSkeleton from "@/components/loading-skeleton";

export default function ViewPostPage() {
  const router = useRouter();
  const params = useParams();
  const forumId = params?.id as string;
  const postId = params?.["post-id"] as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Author | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post data
        const postResponse = await getSinglePost(postId);
        if (!postResponse.success || !postResponse.data) {
          setError("Post not found");
          return;
        }

        setPost(postResponse.data);

        // Fetch current user profile
        const profileResponse = await serverProfile();
        if (profileResponse?.data?.data) {
          setCurrentUser(profileResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Post not found"}
          </h1>
          <Button asChild>
            <Link href={`/forum/${forumId}`}>Back to Forum</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = currentUser?.id === post.authorId;
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation and actions */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" asChild>
          <Link href={`/forum/${forumId}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Forum
          </Link>
        </Button>

        {isAuthor && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/forum/${forumId}/post/${postId}/edit`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                Edit Post
              </Link>
            </Button>
            <Button variant="destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Post content */}
      <Card className="w-full mb-8 overflow-hidden">
        {/* Post header */}
        <CardHeader className="pb-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold break-words">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              <span>Posted by {post.author?.name || "Unknown"}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardHeader>

        {/* Post image */}

        <div className="px-6 pt-6">
          <div className="rounded-lg overflow-hidden max-h-[500px] flex items-center justify-center bg-muted/30">
            <img
              src={
                post.image ??
                "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
              }
              alt={post.title}
              className="w-full h-full object-contain max-h-[500px]"
            />
          </div>
        </div>

        {/* Post content */}
        <CardContent className="pt-6">
          <div className="prose max-w-none dark:prose-invert mx-auto">
            <div className="tiptap-content">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              Like
            </Button>
            <Button variant="outline" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comment
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Comments section - placeholder for future implementation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>Comments feature coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
