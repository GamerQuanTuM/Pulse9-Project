import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center gap-y-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="mt-4">Could not find requested resource</p>
      <Link href="/" className="bg-primary px-4 py-2 rounded-lg text-sm text-white">
        Return Home
      </Link>
    </div>
  );
}
