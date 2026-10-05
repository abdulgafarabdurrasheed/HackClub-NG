"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Wire up to Server Action / Drizzle ORM
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
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
              Already officially approved by Hack Club HQ? Add your club to the Nigerian directory so students can find you.
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
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="clubName" className="block text-sm font-medium text-zinc-300 mb-1">Club Name</label>
                  <input type="text" id="clubName" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] focus:border-transparent transition-all" placeholder="e.g. Yaba Tech Hack Club" />
                </div>

                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-zinc-300 mb-1">School Name</label>
                  <input type="text" id="schoolName" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" />
                </div>

                <div>
                  <label htmlFor="schoolType" className="block text-sm font-medium text-zinc-300 mb-1">School Type</label>
                  <select id="schoolType" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all appearance-none">
                    <option value="high_school">High School</option>
                    <option value="university">University</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-zinc-300 mb-1">State</label>
                  <select id="state" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all appearance-none">
                    <option value="">Select a state...</option>
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-zinc-300 mb-1">City / Town</label>
                  <input type="text" id="city" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="meetingInfo" className="block text-sm font-medium text-zinc-300 mb-1">Meeting Schedule</label>
                  <input type="text" id="meetingInfo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all" placeholder="e.g. Every Friday at 3:00 PM" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-zinc-300 mb-1">Short Bio</label>
                  <textarea id="bio" required rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] transition-all resize-none" placeholder="What is your club about? What do you build?"></textarea>
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
