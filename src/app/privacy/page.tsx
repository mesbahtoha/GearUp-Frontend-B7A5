import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - GearUp",
  description: "How GearUp collects, uses and protects your personal information",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly, including your name, email address, phone number and profile photo when you register, rent gear or contact support. We also collect rental activity data such as orders, reviews and payment records needed to operate the marketplace.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to create and manage your account, process rental orders and payments, provide customer support, send service notifications, and improve our platform. Payment card details are processed exclusively by Stripe and are never stored on our servers.",
  },
  {
    title: "3. Sharing of Information",
    body: "We share limited profile information (name and contact details) with providers to coordinate your rentals, and with payment processors and legal authorities when required by law. We never sell your personal data to third parties.",
  },
  {
    title: "4. Data Security",
    body: "Passwords are hashed using industry-standard bcrypt, authentication is protected with signed JWT tokens, and all traffic between your browser and our servers is encrypted over HTTPS. Access to customer data is restricted to authorized personnel.",
  },
  {
    title: "5. Cookies & Local Storage",
    body: "We use cookies and browser local storage to keep you signed in and remember your preferences (such as light/dark mode). You can clear this data at any time from your browser settings — you'll simply need to sign in again.",
  },
  {
    title: "6. Your Rights",
    body: "You may access, correct or delete your personal information at any time from your Profile page. To request full account deletion, contact support@gearup.com and we will process the request within 30 days.",
  },
  {
    title: "7. Changes to This Policy",
    body: "We may update this policy from time to time. Material changes will be announced on the platform, and continued use of GearUp after changes take effect constitutes acceptance of the revised policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-primary-100 text-sm">Last updated: August 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>Questions about this policy? Contact us at{" "}
            <a href="mailto:support@gearup.com" className="text-primary-600 dark:text-primary-400">
              support@gearup.com
            </a>
            .
          </p>
          <p>
            Read our{" "}
            <Link href="/terms" className="text-primary-600 dark:text-primary-400">
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
