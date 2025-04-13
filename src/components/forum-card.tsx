"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ForumDialog from "./forum-dialog";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuth } from "@/providers/auth-provider";
import { deleteForum } from "@/actions/delete-forum";
import LoadingSkeleton from "./loading-skeleton";

interface ForumCardProps {
  forum: Forum;
  user: Author;
}

const ForumCard = ({ forum, user: author }: ForumCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const handleDelete = async () => {
    startTransition(async () => {
      await deleteForum(forum.id);
      router.refresh();
    });
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{forum.title}</CardTitle>
        <CardDescription>
          Created on {new Date(forum.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {forum.posts?.length || 0} posts in this forum
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/forum/${forum.id}`}>View</Link>
        </Button>
        {forum.authorId === author?.id && (
          <div className="flex items-center gap:2 lg:gap-4">
            <ForumDialog isEditMode forum={forum} />
            <form action={handleDelete}>
              <Button variant="destructive" size="sm" disabled={isPending}>
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForumCard;
