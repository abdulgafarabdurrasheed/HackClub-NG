"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DirectorySearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Dummy function to simulate geospatial search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setHasSearched(true);
    // In the real implementation, this will hit an API route that geocodes the query 
    // and calculates Haversine distance to all approved clubs in the DB.
    // For now, we mock an empty result to show the "Start a club" UI you requested.
    setResults([]); 
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Find a <span className="text-[#ec3750]">Hack Club</span> near you
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Enter your address, city, or school name to find the closest high school and university hacker communities in Nigeria.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Yaba, Lagos or University of Ibadan" 
              className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-6 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ec3750] shadow-xl"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold px-6 rounded-full transition-colors">
              Search
            </button>
          </form>
        </div>

        {hasSearched && results.length === 0 && (
          <div className="max-w-3xl mx-auto text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">There is no Hack Club near you.</h3>
            <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
              The nearest one we found is located in <strong>Ikeja</strong>, which is <strong>14.2 km away</strong>. That's a bit too far for a regular meeting.
            </p>
            <div className="p-6 bg-zinc-900 border border-zinc-700 rounded-xl inline-block text-left">
              <h4 className="text-lg font-bold text-white mb-2">Want to change that?</h4>
              <p className="text-sm text-zinc-400 mb-4 max-w-sm">
                Start a Hack Club at your own school to help teens near you learn to code. We provide the curriculum, the community, and the perks.
              </p>
              <a href="/how-to-start" className="inline-block w-full text-center bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-zinc-200 transition-colors">
                Start a club at your school
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
