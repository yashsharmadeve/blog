import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse through our collection of blog posts covering various topics and insights.",
  openGraph: {
    title: "Blog Posts",
    description: "Browse through our collection of blog posts covering various topics and insights.",
    type: "website",
  },
};

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?limit=10');
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="block">
            <article 
              key={post.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-3 capitalize">
                {post.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {post.body}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Post #{post.id} • User {post.userId}
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
