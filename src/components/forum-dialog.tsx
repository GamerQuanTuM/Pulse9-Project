"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createForum } from "@/actions/create-forum";
import { updateForum } from "@/actions/update-forum";

const ForumDialog = ({
  isEditMode,
  forum,
}: {
  isEditMode?: boolean;
  forum?: Forum;
}) => {
  const router = useRouter();
  const [state, formAction] = useActionState(
    isEditMode ? updateForum : createForum,
    {
      success: false,
      message: "",
      errors: null,
      data: null,
    }
  );

  const [open, setOpen] = useState(false);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        size={isEditMode ? "sm" : "default"}
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? "Processing..."
          : `${isEditMode ? "Update" : "Create"} Forum`}
      </Button>
    );
  }

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={isEditMode ? "secondary" : "default"}>
            {isEditMode ? "Update Forum" : "Create Forum"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new forum</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your forum title"
                : "Please provide a title for your forum"}
            </DialogDescription>

            <form className="mt-5" action={formAction}>
              <div className="flex flex-col gap-6">
                {isEditMode && (
                  <div className="grid gap-3">
                    <Label htmlFor="title">Id</Label>
                    <Input
                      id="id"
                      name="id"
                      type="text"
                      value={forum?.id}
                      placeholder="AI Copyright Issues"
                      required
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={isEditMode ? forum?.title : ""}
                    placeholder="AI Copyright Issues"
                    required
                  />

                  <div className="flex flex-col gap-3">
                    <SubmitButton />
                  </div>
                </div>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForumDialog;
