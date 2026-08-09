import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions - GearUp",
  description: "The terms and conditions that govern the use of GearUp",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or using the GearUp platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use the service.",
  },
  {
    title: "2. The Service",
    body: "GearUp is a marketplace that connects customers who wish to rent sports and outdoor equipment with providers who own and list that equipment. GearUp facilitates the transaction but each rental agreement is made directly between the customer and the provider.",
  },
  {
    title: "3. User Accounts",
    body: "You must provide accurate information when registering. You are responsible for safeguarding your credentials and for all activity under your account. Accounts may be suspended for misuse, fraudulent activity or violation of these terms.",
  },
  {
    title: "4. Customer Responsibilities",
    body: "Customers must return rented equipment in the same condition received, within the agreed return date. Late returns may incur additional charges per the provider's rental policy. Damage beyond normal wear is the customer's responsibility as agreed with the provider at pickup.",
  },
  {
    title: "5. Provider Responsibilities",
    body: "Providers must accurately describe their equipment, keep availability and pricing up to date, confirm or decline orders promptly, and deliver equipment in the condition advertised. Providers are responsible for the maintenance and safety of their listed items.",
  },
  {
    title: "6. Payments & Refunds",
    body: "All payments are processed by Stripe. A rental becomes payable once confirmed by the provider. Cancellation eligibility depends on the order status: 'Placed' orders can be cancelled freely; confirmed or paid orders are subject to the provider's cancellation policy. Refund disputes should first be raised with the provider, then escalated to support@gearup.com.",
  },
  {
    title: "7. Prohibited Conduct",
    body: "Users may not misuse the platform, submit fraudulent orders or reviews, list counterfeit or unsafe equipment, attempt to access other users' accounts, or use the service for unlawful purposes. Violations may result in account suspension and legal action.",
  },
  {
    title: "8. Limitation of Liability",
    body: "GearUp provides the platform 'as is' and is not liable for damages arising from equipment condition, provider conduct, or use of rented items. Customers use equipment at their own risk and must follow all safety instructions provided by providers.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may revise these terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms. Material changes will be communicated on the platform.",
  },
  {
    title: "10. Contact",
    body: "For questions about these terms, contact us at support@gearup.com or through the Contact page.",
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms & Conditions</h1>
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
          <p>
            Also read our{" "}
            <Link href="/privacy" className="text-primary-600 dark:text-primary-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
