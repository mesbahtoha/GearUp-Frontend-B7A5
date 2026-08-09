import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, User, ArrowLeft, ChevronRight } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Blog Article - GearUp",
  description: "Gear guides and rental tips from the GearUp community",
};

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-primary-100 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 text-xs font-medium mb-3">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-primary-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />{" "}
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-10">
        <div
          className="h-64 md:h-80 rounded-xl bg-cover bg-center mb-8"
          style={{ backgroundImage: `url(${post.image})` }}
          role="img"
          aria-label={post.title}
        />
        <div className="space-y-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <Link href="/gear" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">
            Rent Gear Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
