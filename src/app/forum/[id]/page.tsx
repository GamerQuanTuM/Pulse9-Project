import Link from "next/link";
import React from "react";
import { getSingleForum } from "@/actions/get-single-forum";

import { Button } from "@/components/ui/button";
import { serverProfile } from "@/actions/server-profile";
import Posts from "@/components/posts";

const SingleForum = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const forum = await getSingleForum(id);
  const dbAuthor = await serverProfile();


  if (!forum.success || !forum.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Forum not found</h1>
          <Button asChild>
            <Link href="/">Go back to forums</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { title, createdAt, posts, authorName } = forum.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Forum Header */}
      <div className="mb-8 bg-card rounded-xl border p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-muted-foreground">
          <p>
            Created by {authorName || "Unknown"} on{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <p>{posts.length} posts in this forum</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          <Button variant="default" asChild>
            <Link href={`/forum/${id}/post/new`}>Create Post</Link>
          </Button>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-xl">
            <p className="text-muted-foreground">No posts in this forum yet</p>
          </div>
        ) : (
          <Posts posts={posts} dbAuthorId={dbAuthor.data.data.id} id={id} />
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/">Back to Forums</Link>
        </Button>
      </div>
    </div>
  );
};

export default SingleForum;
