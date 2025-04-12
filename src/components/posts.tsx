"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { deletePost } from "@/actions/delete-post";
import { useRouter } from "next/navigation";

const Posts = ({
  posts,
  dbAuthorId,
  id,
}: {
  posts: Post[];
  dbAuthorId: string;
  id: string;
}) => {
  // Track pending state for each post separately
  const [pendingDeletes, setPendingDeletes] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: Post) => {
        const handleDelete = async () => {
          setPendingDeletes(prev => ({ ...prev, [post.id]: true }));
          
          try {
            await deletePost(post.id);
            router.refresh();
          } finally {
            setPendingDeletes(prev => ({ ...prev, [post.id]: false }));
          }
        };
        
        const isPending = pendingDeletes[post.id] || false;
        
        return (
          <Card
            key={post.id}
            className="h-full hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 h-40 bg-muted rounded-md overflow-hidden">
                <img
                  src={
                    post.image ??
                    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-5">
                By {post.author?.name || "Unknown"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              {/* Left: View Button - Using Next.js Link component */}
              <Button variant="outline" asChild>
                <NextLink href={`/forum/${id}/post/${post.id}`}>View Post</NextLink>
              </Button>

              {/* Right: Edit + Delete Buttons */}
              {dbAuthorId === post.author?.id && (
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <NextLink href={`/forum/${id}/post/${post.id}/edit`}>Edit</NextLink>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="cursor-pointer"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Posts;