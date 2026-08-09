"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactChannels = [
  { icon: Mail, label: "Email Us", value: "support@gearup.com", href: "mailto:support@gearup.com" },
  { icon: Phone, label: "Call Us", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Visit Us", value: "Level 2, Gulshan Avenue, Dhaka, Bangladesh", href: "#" },
  { icon: Clock, label: "Support Hours", value: "Sun - Thu, 9:00 AM - 6:00 PM", href: "#" },
];

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      reset();
      setTimeout(() => setSent(false), 5000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-primary-100 max-w-xl mx-auto">
            Questions about a rental, a provider account, or an order? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.label} className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{channel.label}</p>
                    {channel.href !== "#" ? (
                      <a
                        href={channel.href}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-words"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">{channel.value}</p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1">Send us a message</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Fill out the form and our support team will respond within one business day.
              </p>

              {sent ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                  <p className="font-semibold text-green-700 dark:text-green-300 mb-1">Message sent successfully!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="contact-name"
                      label="Full Name"
                      placeholder="Your name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      id="contact-email"
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>
                  <Input
                    id="contact-subject"
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />
                  <Textarea
                    id="contact-message"
                    label="Message"
                    rows={5}
                    placeholder="Write your message here..."
                    error={errors.message?.message}
                    {...register("message")}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Prefer email? Reach us at{" "}
                      <a href="mailto:support@gearup.com" className="text-primary-600 dark:text-primary-400">
                        support@gearup.com
                      </a>
                    </p>
                    <Button type="submit" loading={sending}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      <section className="pb-14 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Looking for help with your account? Visit our{" "}
          <Link href="/help" className="text-primary-600 dark:text-primary-400 font-medium">
            Help Center
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
