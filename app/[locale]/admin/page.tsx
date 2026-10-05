import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { approveClub, deleteClub } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let allClubs;
  
  try {
    allClubs = await db.select().from(clubs);
  } catch (error) {
    console.error("Database connection failed:", error);
    allClubs = [];
  }

  const pendingClubs = allClubs.filter(c => !c.isApproved);
  const approvedClubs = allClubs.filter(c => c.isApproved);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
                Super Admin <span className="text-[#ec3750]">Dashboard</span>
              </h1>
              <p className="text-zinc-400">Manage Nigerian Hack Club registrations.</p>
            </div>
            <div className="text-sm font-bold bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg">
              Total Clubs: <span className="text-[#ec3750]">{allClubs.length}</span>
            </div>
          </div>

          <div className="space-y-12">
            {/* Pending Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Pending Approval
                  <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">{pendingClubs.length}</span>
                </h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>

              {pendingClubs.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                  No pending club applications.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingClubs.map(club => (
                    <div key={club.id} className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full -z-10"></div>
                      
                      <h3 className="text-xl font-bold text-white mb-1">{club.name}</h3>
                      <p className="text-sm text-zinc-400 mb-4">{club.schoolName} • {club.schoolType === 'university' ? 'University' : 'High School'}</p>
                      
                      <div className="space-y-2 mb-6">
                        <p className="text-sm"><strong className="text-zinc-300">Address:</strong> <span className="text-zinc-500">{club.address}</span></p>
                        <p className="text-sm"><strong className="text-zinc-300">Schedule:</strong> <span className="text-zinc-500">{club.meetingInfo}</span></p>
                        <p className="text-sm line-clamp-2"><strong className="text-zinc-300">Bio:</strong> <span className="text-zinc-500">{club.bio}</span></p>
                      </div>

                      <div className="flex gap-3">
                        <form action={approveClub.bind(null, club.id)} className="flex-1">
                          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Approve
                          </button>
                        </form>
                        <form action={deleteClub.bind(null, club.id)}>
                          <button type="submit" className="bg-zinc-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Approved Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Active Clubs
                  <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">{approvedClubs.length}</span>
                </h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>

              {approvedClubs.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                  No active clubs on the map yet.
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-950/50 text-zinc-400">
                        <tr>
                          <th className="px-6 py-4 font-medium">Club Name</th>
                          <th className="px-6 py-4 font-medium">School</th>
                          <th className="px-6 py-4 font-medium">Address</th>
                          <th className="px-6 py-4 font-medium">Members</th>
                          <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {approvedClubs.map(club => (
                          <tr key={club.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-white">{club.name}</td>
                            <td className="px-6 py-4 text-zinc-400">{club.schoolName}</td>
                            <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">{club.address}</td>
                            <td className="px-6 py-4 text-zinc-400">{club.memberCount}</td>
                            <td className="px-6 py-4 text-right">
                              <form action={deleteClub.bind(null, club.id)}>
                                <button type="submit" className="text-red-500 hover:text-red-400 font-bold px-3 py-1 rounded hover:bg-red-500/10 transition-colors">
                                  Revoke
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
