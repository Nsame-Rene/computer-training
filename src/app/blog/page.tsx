import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { blogPosts } from "./posts";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Simple computer training insights</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">Short, useful posts students can read and share.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-slate-500">{post.date}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-slate-600">{post.excerpt}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild><Link href={`/blog/${post.slug}`}>Read More</Link></Button>
                  <Button variant="outline" asChild>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${post.slug}`} target="_blank" rel="noreferrer"><Share2 className="mr-2 h-4 w-4" /> Share</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
