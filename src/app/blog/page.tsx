import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, User, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { blogPosts } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Blog - GearUp",
  description: "Gear guides, rental tips and outdoor stories from the GearUp community",
};

export default function BlogPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">The GearUp Blog</h1>
          <p className="text-primary-100 max-w-xl mx-auto">
            Gear guides, rental tips and stories from our community.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} hover className="overflow-hidden h-full flex flex-col">
              <div
                className="h-44 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
                role="img"
                aria-label={post.title}
              />
              <div className="p-5 space-y-3 flex flex-col flex-1">
                <span className="inline-block w-fit px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                  {post.category}
                </span>
                <h2 className="font-semibold text-lg leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />{" "}
                    {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
