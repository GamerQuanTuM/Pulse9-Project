"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

interface PostFormProps {
  isEditMode?: boolean;
  initialData?: {
    title?: string;
    content?: string;
    image?: string;
  };
  forumId: string;
  postId?: string;
  onSubmit: (formData: FormData) => void;
  formState: {
    success: boolean;
    message: string;
    errors: Record<string, string> | null;
    data: any;
  };
}

export default function PostForm({
  isEditMode = false,
  initialData = {},
  forumId,
  postId,
  onSubmit,
  formState,
}: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
  const [editorContent, setEditorContent] = useState(initialData.content || "");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

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
    formData.set("forumId", forumId);
    if (isEditMode && postId) {
      formData.set("id", postId);
    }
    if (imageBase64) {
      formData.set("image", imageBase64);
    }
    onSubmit(formData);
  };

  // Redirect on successful post creation/update
  useEffect(() => {
    if (formState.success) {
      router.push(`/forum/${forumId}`);
    }
  }, [formState.success, router, forumId]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending 
          ? isEditMode ? "Updating Post..." : "Creating Post..." 
          : isEditMode ? "Update Post" : "Create Post"}
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Post Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          action={handleSubmit}
          className="space-y-6">
          {formState.errors && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              <p>{formState.message}</p>
              <ul className="list-disc pl-5 mt-2">
                {Object.entries(formState.errors).map(([key, value]) => (
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
              defaultValue={initialData.title}
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
  );
}