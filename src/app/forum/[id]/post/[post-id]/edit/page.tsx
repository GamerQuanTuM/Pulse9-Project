"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { updatePost } from "@/actions/update-post";
import { getSinglePost } from "@/actions/get-single-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import dynamic from "next/dynamic";
import LoadingSkeleton from "@/components/loading-skeleton";

// Dynamically import Tiptap editor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/components/tiptap-editor"), {
  ssr: false,
  loading: () => <div className="h-[200px] border rounded-md p-4 bg-gray-50">Loading editor...</div>,
});

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const forumId = params?.id;
  const postId = params?.['post-id'];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");

  const [state, formAction] = useActionState(updatePost, {
    success: false,
    message: "",
    errors: null,
    data: null,
  });

  // Fetch post data on component mount
  useEffect(() => {
    async function fetchPost() {
      if (postId) {
        try {
          const response = await getSinglePost(postId as string);
          if (response.success && response.data) {
            // Set form values
            setTitle(response.data.title);
            setEditorContent(response.data.content);
            if (response.data.image) {
              setImagePreview(response.data.image);
            }
          } else {
            // Handle error
            console.error("Failed to fetch post");
            router.push(`/forum/${forumId}`);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          router.push(`/forum/${forumId}`);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchPost();
  }, [postId, forumId, router]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64("");  // Set to empty string instead of null
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Custom form action to include the editor content
  const handleSubmit = (formData: FormData) => {
    formData.set("content", editorContent);
    formData.set("forumId", forumId as string);
    formData.set("id", postId as string);
    formData.set("title", formData.get("title") as string);
    
    // Handle image - only include if changed
    if (imageBase64 !== null) {
      formData.set("image", imageBase64);
    }
    
    formAction(formData);
  };

  // Redirect on successful post update
  useEffect(() => {
    if (state.success) {
      router.push(`/forum/${forumId}`);
    }
  }, [state.success, router, forumId]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Updating Post..." : "Update Post"}
      </Button>
    );
  }

  if (isLoading) {
    return (
      <LoadingSkeleton/>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Button variant="outline" asChild>
          <Link href={`/forum/${forumId}`}>Back to Forum</Link>
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form 
          action={handleSubmit}
           className="space-y-6">
            {state.errors && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                <p>{state.message}</p>
                <ul className="list-disc pl-5 mt-2">
                  {Object.entries(state.errors).map(([key, value]) => (
                    <li key={key}>{value as string}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter post title"
                defaultValue={title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="min-h-[200px] border rounded-md">
                <TiptapEditor 
                  content={editorContent} 
                  onChange={setEditorContent} 
                  className="min-h-[200px]" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[200px] rounded-md object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <CardFooter className="px-0 pt-6">
              <SubmitButton />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}