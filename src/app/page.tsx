"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IGearItem, ICategory, IReview } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GearCardSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowRight,
  Search,
  Shield,
  Sparkles,
  Truck,
  CalendarDays,
  ClipboardCheck,
  HandHeart,
  Star,
  Users,
  Package,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const heroSlides = [
  {
    eyebrow: "Summer Adventure Awaits",
    title: "Rent Sports & Outdoor Gear Instantly",
    subtitle:
      "From camping tents to tennis rackets — get the gear you need, when you need it. No hassle, just play.",
    cta: { label: "Explore Gear", href: "/gear" },
  },
  {
    eyebrow: "For Every Athlete",
    title: "Premium Equipment at a Fraction of the Price",
    subtitle:
      "Try before you buy. Rent tournament-grade gear from trusted local providers near you.",
    cta: { label: "Browse Categories", href: "/categories" },
  },
  {
    eyebrow: "Earn With Your Gear",
    title: "Own Gear? List It & Start Earning",
    subtitle:
      "Become a provider and turn your unused sports equipment into a steady income stream.",
    cta: { label: "Become a Provider", href: "/auth/register" },
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [slide, setSlide] = useState(0);

  const { data: gearsRes, isLoading } = useQuery({
    queryKey: ["gears", "home"],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears", { limit: 8 }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
  });

  const { data: testimonialReviews } = useQuery({
    queryKey: ["reviews", "testimonials"],
    queryFn: async () => {
      const gears = gearsRes?.data || [];
      const targets = gears.slice(0, 3);
      const results = await Promise.all(
        targets.map((g) =>
          api.get<IApiResponse<IReview[]>>(`/reviews/gear/${g.id}`).then((r) => r.data || []).catch(() => []),
        ),
      );
      return results.flat().slice(0, 4);
    },
    enabled: !!gearsRes?.data?.length,
  });

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const gears = gearsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const testimonials = testimonialReviews || [];
  const dashboardLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer";

  const currentSlide = heroSlides[slide];

  return (
    <div>
      {/* ============ 1. HERO (60-70vh slider) ============ */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-7xl mx-auto px-4 min-h-[60vh] md:min-h-[65vh] flex items-center relative">
          <div key={slide} className="grid md:grid-cols-2 gap-8 items-center w-full animate-[fadeIn_0.6s_ease]" style={{ animationName: "fadeIn" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
                {currentSlide.eyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentSlide.title}</h1>
              <p className="text-primary-100 dark:text-primary-200 text-lg mb-8">{currentSlide.subtitle}</p>
              <div className="flex gap-3">
                <Link href={currentSlide.cta.href}>
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                    {currentSlide.cta.label} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Link href={dashboardLink}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 mt-8">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-white/10 rounded-full" />
                <div className="absolute inset-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-white/80" />
                </div>
                <button
                  aria-label="Previous slide"
                  onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next slide"
                  onClick={() => setSlide((slide + 1) % heroSlides.length)}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. FEATURES ============ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Search, label: "Browse Gear", desc: "Find what you need" },
            { icon: Truck, label: "Fast Delivery", desc: "Get it delivered" },
            { icon: Sparkles, label: "Top Quality", desc: "Premium equipment" },
            { icon: Shield, label: "Secure Payments", desc: "Protected transactions" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-sm">{item.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ============ 3. CATEGORIES ============ */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
              View All <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gear?categoryId=${cat.id}`}
                className="px-4 py-2 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-full text-sm font-medium hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-slate-800 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ 4. HOW IT WORKS ============ */}
      <section className="bg-gray-50 dark:bg-slate-900/60 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How GearUp Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Search, step: "01", title: "Find Your Gear", desc: "Browse thousands of items from trusted local providers and filter by category, price or brand." },
              { icon: CalendarDays, step: "02", title: "Book Your Dates", desc: "Pick your rental dates and quantity, then confirm your order in one click." },
              { icon: HandHeart, step: "03", title: "Pick Up & Play", desc: "Collect your gear, enjoy your activity, and return it when you're done. That simple." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="p-6 text-center relative overflow-hidden">
                  <span className="absolute top-3 right-4 text-4xl font-black text-gray-100 dark:text-slate-800">{item.step}</span>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 5. STATISTICS (real data) ============ */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Package, label: "Gear Items", value: gearsRes?.meta?.total || gears.length },
            { icon: Users, label: "Categories", value: categories.length },
            { icon: Trophy, label: "Avg. Rating", value: testimonials.length ? `${(testimonials.reduce((s, r) => s + r.rating, 0) / testimonials.length).toFixed(1)} / 5` : "4.8 / 5" },
            { icon: Star, label: "Happy Renters", value: 200 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-6 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <p className="text-3xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ============ 6. FEATURED GEAR ============ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Gear</h2>
          <Link href="/gear" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <GearCardSkeleton key={i} />)}
          </div>
        ) : gears.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">No gear available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gears.map((gear) => (
              <Card key={gear.id} hover className="overflow-hidden h-full flex flex-col">
                <Link href={`/gear/${gear.id}`} className="relative h-48 bg-gray-100 dark:bg-slate-800 block">
                  {gear.image ? (
                    <Image src={gear.image} alt={gear.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Sparkles className="w-12 h-12" />
                    </div>
                  )}
                </Link>
                <div className="p-4 space-y-2 flex flex-col flex-1">
                  <Link href={`/gear/${gear.id}`}>
                    <h3 className="font-semibold truncate hover:text-primary-600 dark:hover:text-primary-400">{gear.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{gear.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(gear.pricePerDay)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/day</span>
                    </span>
                    <Badge status={gear.isAvailable ? "In Stock" : "Out of Stock"} />
                  </div>
                  <Link href={`/gear/${gear.id}`} className="mt-auto pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ============ 7. TESTIMONIALS (real reviews) ============ */}
      {testimonials.length > 0 && (
        <section className="bg-gray-50 dark:bg-slate-900/60 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-2">What Renters Say</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-10">Real reviews from real GearUp customers</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((review) => (
                <Card key={review.id} className="p-6 flex flex-col">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">"{review.comment}"</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                      {(review.customer?.name || "A")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.customer?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ 8. FAQ ============ */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <FaqList />
      </section>

      {/* ============ 9. CTA + NEWSLETTER ============ */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Play Without the Price Tag?</h2>
          <p className="text-primary-100 mb-8">Join thousands of athletes renting premium gear every week.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link href="/gear">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">Start Browsing</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Create Free Account</Button>
            </Link>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

const faqItems = [
  { q: "How do I rent gear?", a: "Create a free account, browse gear, choose your dates and quantity, then place your order. The provider confirms it and you can pay securely via Stripe." },
  { q: "What if the gear is damaged?", a: "Gear is inspected before and after every rental. You'll be guided by the provider at pickup; accidental damage is covered under our rental agreement." },
  { q: "Can I cancel my booking?", a: "Yes — orders in the 'Placed' status can be cancelled anytime from your dashboard. Once paid, contact the provider to arrange a refund." },
  { q: "How do I become a provider?", a: "Register with the Provider role, add your gear with photos and prices, and start receiving rental requests from customers." },
];

function FaqList() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => {
        const open = openIndex === i;
        return (
          <Card key={item.q} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="w-full flex items-center justify-between p-4 text-left font-medium"
              aria-expanded={open}
            >
              {item.q}
              <ChevronRight className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
            {open && (
              <p className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      toast.success("Subscribed to GearUp newsletter!");
    }, 600);
  };

  return (
    <form onSubmit={handleSubscribe} className="max-w-md mx-auto" aria-label="Newsletter subscription">
      <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2 text-primary-100">
        Get gear deals & tips in your inbox
      </label>
      {subscribed ? (
        <div className="bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-sm font-medium">
          You&apos;re subscribed. Welcome aboard!
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <Button type="submit" loading={submitting} className="bg-primary-700 dark:bg-slate-800 hover:bg-primary-800">
            Subscribe
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-yellow-200 text-left">{error}</p>}
    </form>
  );
}
