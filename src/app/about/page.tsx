import type { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, Target, HeartHandshake, ShieldCheck, Users, Globe } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us - GearUp",
  description: "Learn about GearUp - the platform for renting sports and outdoor gear",
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Make premium sports equipment accessible to everyone. No need to buy gear you use a few times a year — rent it at a fraction of the cost.",
  },
  {
    icon: HeartHandshake,
    title: "Community First",
    desc: "We connect local providers with local athletes, building a sharing economy that saves money and reduces waste.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    desc: "Every provider is vetted, every payment is protected by Stripe, and every rental is covered by our rental agreement.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    desc: "Renting extends the life of quality equipment and cuts down on manufacturing waste. Better for your wallet, better for the planet.",
  },
];

const milestones = [
  { year: "2024", title: "GearUp Launches", desc: "Started in Dhaka with a handful of providers and a big idea." },
  { year: "2025", title: "10,000+ Rentals", desc: "Crossed ten thousand successful rentals across sports categories." },
  { year: "2026", title: "Nationwide Network", desc: "Expanded to providers and customers across the country." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About GearUp</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            We believe great gear should never stand between you and your next adventure. GearUp is a
            rental marketplace where sports equipment lives to be used.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "10k+", label: "Rentals Completed" },
            { value: "50+", label: "Gear Providers" },
            { value: "200+", label: "Equipment Items" },
            { value: "4.8/5", label: "Average Rating" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 dark:bg-slate-900/60 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">Our Journey</h2>
        <div className="space-y-6">
          {milestones.map((milestone, i) => (
            <Card key={milestone.year} className="p-6 flex gap-6">
              <div className="shrink-0 w-20 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold text-sm">
                  {milestone.year}
                </span>
              </div>
              <div className={i === 0 ? "flex items-center gap-4" : ""}>
                <div>
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{milestone.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 dark:bg-slate-900/60 py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Users className="w-10 h-10 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-bold mb-3">Built by Athletes, for Athletes</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            The GearUp team designs, tests and lives the rental experience — from weekend campers to
            competitive cyclists, we make sure every item on the platform meets our own standards.
          </p>
          <Link href="/contact">
            <Button size="lg">Get in Touch</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
