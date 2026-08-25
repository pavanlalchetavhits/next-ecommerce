"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/contact', form);

      if (res.data?.success) {
        setSuccess(res.data.message || "Thank you! Your message has been sent successfully.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setError(res.data?.message || "Failed to send message.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Header Section */}
        <ScrollReveal direction="down">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-xl shadow-indigo-950/20 border border-indigo-900/50 text-center">
            {/* Ambient Glow Orbs */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#5b46f6]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-indigo-300 border border-white/10">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>We're Here To Help</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
                We Love To Hear From You
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                Have a question about our products, your order, or partnership opportunities? Our support team is ready 24/7.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-4 space-y-6">
            <ScrollReveal direction="right">
              <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-bold text-[#5b46f6]">
                    Get In Touch
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900 font-display">
                    Contact Info
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Reach out through any channel below and our support team will assist you promptly.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <ContactInfoCard
                    icon={<Mail className="h-5 w-5" />}
                    title="Email Us"
                    value="support@nexcart.com"
                    href="mailto:support@nexcart.com"
                    subtext="Fast response within 24h"
                  />
                  <ContactInfoCard
                    icon={<Phone className="h-5 w-5" />}
                    title="Call Us"
                    value="+91 98765 43210"
                    href="tel:+919876543210"
                    subtext="Mon - Sat, 10am - 6pm IST"
                  />
                  <ContactInfoCard
                    icon={<MapPin className="h-5 w-5" />}
                    title="Headquarters"
                    value="742 Evergreen Terrace, San Francisco, CA 94107"
                    subtext="Global Fulfillment Center"
                  />
                  <ContactInfoCard
                    icon={<Clock className="h-5 w-5" />}
                    title="Working Hours"
                    value="Monday - Saturday: 10:00 AM - 6:00 PM"
                    subtext="Sunday: Closed"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-8">
            <ScrollReveal direction="left">
              <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-10 shadow-xs space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Fill out the fields below and our team will get back to you right away.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-purple-100 bg-slate-50/40 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#5b46f6] focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-purple-100 bg-slate-50/40 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#5b46f6] focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl border border-purple-100 bg-slate-50/40 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#5b46f6] focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-1.5 block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Order inquiry, feedback, etc."
                        className="w-full rounded-xl border border-purple-100 bg-slate-50/40 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#5b46f6] focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-purple-100 bg-slate-50/40 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#5b46f6] focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{success}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5b46f6] px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#4338ca] hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Quick Answers & Policy Banner */}
        <ScrollReveal direction="up">
          <div className="rounded-3xl border border-purple-100 bg-white p-8 text-center space-y-4 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6] mx-auto">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Looking For Quick Answers?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Check out our detailed customer policies for immediate information on shipping rates, returns, and terms.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/shipping-policy"
                className="rounded-xl border border-purple-100 bg-purple-50/60 px-5 py-2.5 text-xs font-bold text-[#5b46f6] hover:bg-[#5b46f6] hover:text-white transition-all shadow-2xs"
              >
                Shipping Policy
              </Link>
              <Link
                href="/refund-policy"
                className="rounded-xl border border-purple-100 bg-purple-50/60 px-5 py-2.5 text-xs font-bold text-[#5b46f6] hover:bg-[#5b46f6] hover:text-white transition-all shadow-2xs"
              >
                Refund & Return Policy
              </Link>
              <Link
                href="/terms"
                className="rounded-xl border border-purple-100 bg-purple-50/60 px-5 py-2.5 text-xs font-bold text-[#5b46f6] hover:bg-[#5b46f6] hover:text-white transition-all shadow-2xs"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}

function ContactInfoCard({
  icon,
  title,
  value,
  href,
  subtext,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  subtext?: string;
}) {
  const content = (
    <div className="group flex items-start gap-3.5 rounded-2xl border border-purple-100/60 bg-white p-4 transition-all duration-300 hover:border-purple-200 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b46f6] group-hover:bg-[#5b46f6] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-700">{value}</p>
        {subtext && <p className="mt-0.5 text-[10px] text-slate-400">{subtext}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}
