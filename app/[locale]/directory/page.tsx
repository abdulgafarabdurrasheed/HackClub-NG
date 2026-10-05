import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Force dynamic rendering since we are reading from the DB
export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let approvedClubs;
  
  try {
    // Fetch all approved clubs
    approvedClubs = await db
      .select()
      .from(clubs)
      .where(eq(clubs.isApproved, true))
      .orderBy(clubs.state);
  } catch (error) {
    console.error("Database connection failed:", error);
    approvedClubs = [];
  }

  // Group by State
  const clubsByState = approvedClubs.reduce((acc, club) => {
    if (!acc[club.state]) acc[club.state] = [];
    acc[club.state].push(club);
    return acc;
  }, {} as Record<string, typeof approvedClubs>);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              Nigerian <span className="text-[#ec3750]">Hack Clubs</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Find a local community of hackers near you. Browse verified high school and university clubs across Nigeria.
            </p>
          </div>

          {Object.keys(clubsByState).length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
              <h3 className="text-2xl font-bold text-zinc-300 mb-2">No clubs found yet</h3>
              <p className="text-zinc-500 mb-6">Be the first to bring Hack Club to your state!</p>
              <a href="/register" className="bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold py-3 px-6 rounded-lg transition-all">
                Register your club
              </a>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(clubsByState).map(([state, stateClubs]) => (
                <div key={state}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold text-white">{state}</h2>
                    <div className="h-px bg-zinc-800 flex-1"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stateClubs.map((club) => (
                      <div key={club.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white leading-tight">{club.name}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${club.schoolType === 'university' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                              {club.schoolType === 'university' ? 'Uni' : 'High School'}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {club.schoolName} • {club.city}
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
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
