import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JoinClubButton } from "./JoinClubButton";
import Link from "next/link";

export default async function ClubPage({ params }: { params: { id: string } }) {
  // Validate UUID (rough check to prevent DB errors if invalid string is passed)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(params.id)) {
    notFound();
  }

  const club = await db.select().from(clubs).where(eq(clubs.id, params.id)).limit(1).then(res => res[0]);

  if (!club || !club.isApproved) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/directory" className="text-zinc-400 hover:text-white mb-8 inline-flex items-center text-sm transition-colors">
            ← Back to Directory
          </Link>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-[#ec3750] to-[#ff8c37]"></div>
            
            <div className="p-8 sm:p-12 relative">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 -mt-16 sm:-mt-20">
                <div className="w-24 h-24 bg-zinc-800 border-4 border-zinc-900 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {club.clubFocus === 'hardware' ? '🤖' : club.clubFocus === 'software' ? '💻' : '🚀'}
                </div>
                <div className="flex-shrink-0">
                  <JoinClubButton clubId={club.id} />
                </div>
              </div>

              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-2">{club.name}</h1>
                <p className="text-xl text-zinc-400">{club.schoolName} ({club.schoolType.replace('_', ' ')})</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">About the Club</h2>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {club.bio || "This club hasn't added a bio yet, but they are ready to hack!"}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Focus Area</h2>
                    <div className="inline-flex items-center px-4 py-2 bg-zinc-800 rounded-full text-zinc-300 border border-zinc-700">
                      <span className="mr-2">
                        {club.clubFocus === 'hardware' ? '🛠️' : club.clubFocus === 'software' ? '👨‍💻' : '✨'}
                      </span>
                      <span className="capitalize">{club.clubFocus}</span>
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Meeting Info</h3>
                    <div className="flex items-start space-x-3 text-zinc-300">
                      <span className="mt-0.5">📅</span>
                      <p>{club.meetingInfo || "Schedule TBD"}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Location</h3>
                    <div className="flex items-start space-x-3 text-zinc-300">
                      <span className="mt-0.5">📍</span>
                      <p>{club.address}</p>
                    </div>
                  </div>

                  {club.publicEmail && (
                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Contact</h3>
                      <div className="flex items-start space-x-3 text-zinc-300">
                        <span className="mt-0.5">✉️</span>
                        <a href={`mailto:${club.publicEmail}`} className="text-[#ec3750] hover:underline break-all">
                          {club.publicEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Members</h3>
                    <div className="flex items-center space-x-3 text-zinc-300">
                      <span className="text-2xl">🧑‍🤝‍🧑</span>
                      <span className="text-xl font-bold">{club.memberCount} hackers</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
