import type { Metadata } from "next";
import Link from "next/link";
import {
  LifeBuoy,
  UserPlus,
  Search,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Help & Support - GearUp",
  description: "Get help with renting, payments, returns and your GearUp account",
};

const topics = [
  {
    icon: UserPlus,
    title: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "Click 'Register' in the top navigation, fill in your name, email and password, and choose your role — Customer to rent gear or Provider to list your own gear." },
      { q: "Can I change my role later?", a: "Your role is set at registration. Contact support@gearup.com if you'd like to switch from Customer to Provider." },
    ],
  },
  {
    icon: Search,
    title: "Finding & Renting Gear",
    items: [
      { q: "How do I search for gear?", a: "Use the Browse Gear page. You can search by keyword and filter by category and price range, then sort results by newest, price or name." },
      { q: "How do I place a rental order?", a: "Open a gear's details page, pick your start and end dates, choose quantity, and click 'Rent Now'. Your order goes to the provider for confirmation." },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "All payments are processed securely through Stripe using credit or debit cards. Your payment is only taken after the provider confirms your order." },
      { q: "When am I charged?", a: "You'll receive a checkout link once your rental is confirmed. The charge is completed when you finish payment at the Stripe checkout page." },
    ],
  },
  {
    icon: RefreshCcw,
    title: "Orders, Returns & Cancellations",
    items: [
      { q: "How do I cancel an order?", a: "Go to Dashboard → My Orders. Orders with 'Placed' status can be cancelled directly. Orders that are confirmed or paid must be cancelled in contact with the provider." },
      { q: "What is the return process?", a: "Return the gear to the provider on your end date. The provider inspects the gear and marks the rental as returned — you'll receive the updated status in your dashboard." },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    items: [
      { q: "How do I change my password?", a: "Go to Dashboard → Profile → Change Password. You'll need your current password to set a new one." },
      { q: "My account was suspended. What now?", a: "Suspended accounts are usually flagged for policy violations. Contact support@gearup.com with your account email and we'll review your case." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <LifeBuoy className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Help & Support</h1>
          <p className="text-primary-100 max-w-xl mx-auto">
            Answers to the most common questions about renting, payments and your account.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div key={topic.title}>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <span className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                {topic.title}
              </h2>
              <div className="space-y-3">
                {topic.items.map((item) => (
                  <Card key={item.q} className="p-5">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      {item.q}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed pl-6">{item.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        <div className="text-center pt-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Still need help? Our support team replies within one business day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
