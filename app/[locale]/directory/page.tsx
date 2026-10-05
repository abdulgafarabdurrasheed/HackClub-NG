"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { searchNearestClubs, SearchResult, joinClubAction } from "./actions";

export default function DirectorySearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    setHasSearched(false);
    setError(null);

    const res = await searchNearestClubs(searchQuery);
    
    setIsSearching(false);
    setHasSearched(true);
    
    if (res.success && res.results) {
      setResults(res.results);
    } else {
      setError(res.error || "Search failed");
      setResults([]);
    }
  };

  // We consider a club "near" if it's within 20km
  const nearestClub = results.length > 0 ? results[0] : null;
  const isNearestClubTooFar = nearestClub ? nearestClub.distanceKm > 20 : true;

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
            <button type="submit" disabled={isSearching} className="absolute right-2 top-2 bottom-2 bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold px-6 rounded-full transition-colors disabled:opacity-50">
              {isSearching ? "..." : "Search"}
            </button>
          </form>

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {hasSearched && !error && (
          <div className="max-w-6xl mx-auto">
            {isNearestClubTooFar ? (
              <div className="max-w-3xl mx-auto text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">There is no Hack Club near you.</h3>
                {nearestClub && (
                  <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
                    The nearest one we found is <strong>{nearestClub.name}</strong>, which is <strong>{nearestClub.distanceKm.toFixed(1)} km away</strong>. That's a bit too far for a regular meeting.
                  </p>
                )}
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
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6">Closest Clubs to you:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((club) => (
                    <div key={club.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white leading-tight">{club.name}</h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${club.schoolType === 'university' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                            {club.distanceKm.toFixed(1)} km
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {club.schoolName}
                        </p>
                      </div>
                      
                      <p className="text-zinc-300 text-sm mb-6 flex-1 line-clamp-3">
                        {club.bio}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {club.meetingInfo}
                        </div>
                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors border border-zinc-700">
                          Join Club
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
