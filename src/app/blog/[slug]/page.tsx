import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { blogPosts } from "../posts";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">← Back to blog</Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{post.date}</p>
        <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
          {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <Button className="mt-8" variant="outline" asChild>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${post.slug}`} target="_blank" rel="noreferrer"><Share2 className="mr-2 h-4 w-4" /> Share this post</a>
        </Button>
      </main>
    </div>
  );
}
