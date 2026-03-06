import Link from "next/link";

export default function Home() {
  return (
      <div className="my-2">
        <h1 className="text-3xl font-bold underline text-center">Welcome to My Blogs</h1>
            <Link href={'/blog'} className="mt-3 text-blue-600 underline text-lg text-center block">Go to Blog</Link>
      </div>
  );
}
