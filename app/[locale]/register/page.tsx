"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { submitClubApplication } from "./actions";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitClubApplication(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              Register your <span className="text-[#ec3750]">Hack Club</span>
            </h1>
            <p className="text-lg text-zinc-400">
              Already officially approved by Hack Club HQ? Add your club to the Nigerian map so local students can find you.
            </p>
          </div>

          {submitted ? (
            <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
              <p className="text-zinc-400">
                Your club is now pending review by a State Admin. You'll be live on the directory soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="clubName" className="block text-sm font-medium text-zinc-300 mb-1">Club Name</label>
                  <input type="text" name="clubName" id="clubName" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" placeholder="e.g. Yaba Tech Hack Club" />
                </div>

                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-zinc-300 mb-1">School Name</label>
                  <input type="text" name="schoolName" id="schoolName" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" />
                </div>

                <div>
                  <label htmlFor="schoolType" className="block text-sm font-medium text-zinc-300 mb-1">School Type</label>
                  <select name="schoolType" id="schoolType" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all appearance-none">
                    <option value="high_school">High School</option>
                    <option value="university">University</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-zinc-300 mb-1">Exact Address (For Map Search)</label>
                  <input type="text" name="address" id="address" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" placeholder="e.g. 12 Herbert Macaulay Way, Yaba, Lagos" />
                  <p className="text-xs text-zinc-500 mt-1">We use this to calculate distance so students can find the club nearest to them.</p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="meetingInfo" className="block text-sm font-medium text-zinc-300 mb-1">Meeting Schedule</label>
                  <input type="text" name="meetingInfo" id="meetingInfo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" placeholder="e.g. Every Friday at 3:00 PM" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-zinc-300 mb-1">Short Bio</label>
                  <textarea name="bio" id="bio" required rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all resize-none" placeholder="What is your club about? What do you build?"></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Submit to Directory"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
