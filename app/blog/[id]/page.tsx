import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

async function getImage(id: string): Promise<string> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}/photos`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch image');
  }
  
  const data = await res.json();
  return data[0].url;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  
  return {
    title: `${post.title}`,
    description: post.body.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.body.substring(0, 160),
      type: "article",
    },
  };
}

const Page = async ({params}: {
    params: {id: string}
}) => {
    const { id } = await params;
    const post = await getPost(id);
    const imageUrl = await getImage(id);
    console.log(imageUrl)
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/blog" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to all posts
        </Link>
        
        <article className="border border-gray-200 rounded-lg p-8">
          <div className="mb-4 text-sm text-gray-500">
            Post #{post.id} • User {post.userId}
          </div>

          <Image 
            src={imageUrl} 
            alt={post.title} 
            width={600} 
            height={600} 
            className="mb-6 rounded-lg w-full h-auto" 
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            quality={85}
          />
          
          <h1 className="text-4xl font-bold mb-6 capitalize">
            {post.title}
          </h1>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            {post.body}
          </p>
        </article>
      </div>
    </div>
  );
}

export default Page