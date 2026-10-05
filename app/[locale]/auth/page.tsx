"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#17171d] text-white font-sans flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 lg:p-8">
        <Link href="/">
          <Image 
            src="/assets/hackClubLogoRed.svg" 
            alt="Hack Club" 
            width={120} 
            height={40} 
            className="opacity-90 hover:opacity-100 transition-opacity filter invert brightness-0"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          ← Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#1c1c21] border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
          <p className="text-sm text-zinc-400 mb-8">How do you want to sign in?</p>

          <div className="space-y-4 mb-8">
            {/* Leader Sign In */}
            <button 
              onClick={() => signIn("hackclub")}
              className="w-full text-left group bg-transparent border border-zinc-700/50 hover:border-zinc-500 rounded-xl p-5 flex items-start gap-5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#ec3750] flex items-center justify-center shrink-0 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Leaders & Staff</p>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-white">Sign in with Hack Club</h3>
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  For leaders, and members with Hack Club accounts.<br/>Uses your account at auth.hackclub.com.
                </p>
              </div>
            </button>

            {/* Member Sign In */}
            <button 
              onClick={() => signIn("email")}
              className="w-full text-left group bg-transparent border border-zinc-700/50 hover:border-zinc-500 rounded-xl p-5 flex items-start gap-5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#ec3750] flex items-center justify-center shrink-0 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Club Members</p>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-white">Sign in with email</h3>
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  For club members. We email you a one-time code - no Hack Club account needed.
                </p>
              </div>
            </button>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-sm text-zinc-500">
              Not part of a club yet? <Link href="/how-to-start" className="text-[#ec3750] hover:underline font-medium">Apply to start one</Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-6 flex justify-end">
        <p className="text-xs text-zinc-600 flex items-center gap-2">
          Hack Club Nigeria <span>•</span> {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
