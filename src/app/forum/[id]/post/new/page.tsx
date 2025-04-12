"use client";

import React, { useEffect, useState, useRef, useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createPost } from "@/actions/create-post";
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
import dynamic from "next/dynamic";

// Dynamically import Tiptap editor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/components/tiptap-editor"), {
  ssr: false,
  loading: () => <div className="h-[200px] border rounded-md p-4 bg-gray-50">Loading editor...</div>,
});


export default function CreatePostPage() {
  const router = useRouter();
  const params = useParams();
  const forumId = params?.id;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);


  const [state, formAction] = useActionState(createPost, {
    success: false,
    message: "",
    errors: null,
    data: null,
  });

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

  // Custom form action to include the editor content
  const handleSubmit = (formData: FormData) => {
    formData.set("content", editorContent);
    formData.set("forumId", forumId as string);
    if (imageBase64) {
      formData.set("image", imageBase64);
    }
    formAction(formData);
  };

  // Redirect on successful post creation
  useEffect(() => {
    if (state.success) {
      router.push(`/forum/${forumId}`);
    }
  }, [state.success, router, forumId]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating Post..." : "Create Post"}
      </Button>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Post</h1>
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
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
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