"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { login } from "@/actions/login";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState(login, {
    success: false,
    message: "",
    errors: null,
    data: null,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      localStorage.setItem("token", state.data.data.token);
      router.push("/");
    }
  }, [state]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Processing..." : "Register"}
      </Button>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-6 w-full lg:w-96", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>Enter your email below to post</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="john doe"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>

              {/* Display success/error messages */}
              {state.message && (
                <div
                  className={`text-sm ${
                    state.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {state.message}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <SubmitButton />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
