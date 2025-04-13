"use client";
import { useAuth } from "@/providers/auth-provider";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "./loading-skeleton";
import { useRouter } from "next/navigation";

const Footer = ({ authorName }: { authorName: string }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/auth"); // Redirect to the login page after logging out
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      <LoadingSkeleton />;
    }
  }, [loading]);

  return (
    <form
      onClick={handleLogout}
      className="absolute right-5 bottom-5 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
        {authorName?.[0]?.toUpperCase() || "P"}
      </div>
    </form>
  );
};

export default Footer;
