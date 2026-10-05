import { db } from "@/lib/db";
import { clubs, clubMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { approveMember, rejectMember } from "./actions";
// import { getServerSession } from "next-auth/next";

export const dynamic = "force-dynamic";

export default async function LeaderDashboard() {
  // const session = await getServerSession();
  // const userId = session?.user?.id;
  
  // For MVP/Demo purposes, assuming the first club's leader is logged in
  let myClub;
  let members: any[] = [];
  
  try {
    const allClubs = await db.select().from(clubs).limit(1);
    myClub = allClubs[0];

    if (myClub) {
      // Perform a JOIN to get the user details of the members requesting to join
      const results = await db
        .select({
          memberRecordId: clubMembers.id,
          status: clubMembers.status,
          joinedAt: clubMembers.joinedAt,
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
        })
        .from(clubMembers)
        .innerJoin(users, eq(clubMembers.userId, users.id))
        .where(eq(clubMembers.clubId, myClub.id));
        
      members = results;
    }
  } catch (error) {
    console.error("Dashboard DB error:", error);
  }

  const pendingMembers = members.filter(m => m.status === 'pending');
  const approvedMembers = members.filter(m => m.status === 'approved');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
                Club <span className="text-[#ec3750]">Dashboard</span>
              </h1>
              <p className="text-zinc-400">
                {myClub ? `Managing ${myClub.name}` : "You haven't registered a club yet."}
              </p>
            </div>
            {myClub && (
              <div className="text-center bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl">
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-1">Official Members</p>
                <p className="text-3xl font-black text-[#ec3750]">{myClub.memberCount}</p>
              </div>
            )}
          </div>

          {!myClub ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
              <h2 className="text-xl font-bold mb-4">No Club Found</h2>
              <p className="text-zinc-400 mb-6">You need to register your club on the Nigerian map first.</p>
              <a href="/register" className="bg-[#ec3750] text-white px-6 py-3 rounded-lg font-bold">Register your club</a>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Pending Join Requests */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Pending Requests
                    {pendingMembers.length > 0 && (
                      <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">{pendingMembers.length}</span>
                    )}
                  </h2>
                  <div className="h-px bg-zinc-800 flex-1"></div>
                </div>

                {pendingMembers.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8 text-center text-zinc-500">
                    No new students are trying to join your club right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pendingMembers.map(member => (
                      <div key={member.memberRecordId} className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-lg">{member.userName}</p>
                          <p className="text-sm text-zinc-400">{member.userEmail}</p>
                        </div>
                        <div className="flex gap-2">
                          {/* @ts-ignore */}
                          <form action={async () => { "use server"; await approveMember(member.memberRecordId, myClub.id); }}>
                            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg" title="Approve">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                          </form>
                          {/* @ts-ignore */}
                          <form action={async () => { "use server"; await rejectMember(member.memberRecordId); }}>
                            <button type="submit" className="bg-zinc-800 hover:bg-red-600 text-white p-2 rounded-lg" title="Reject">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Approved Roster */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Official Roster
                  </h2>
                  <div className="h-px bg-zinc-800 flex-1"></div>
                </div>

                {approvedMembers.length === 0 ? (
                   <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8 text-center text-zinc-500">
                     Your club roster is empty.
                   </div>
                ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-950/50 text-zinc-400">
                        <tr>
                          <th className="px-6 py-4 font-medium">Student Name</th>
                          <th className="px-6 py-4 font-medium">Email</th>
                          <th className="px-6 py-4 font-medium">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {approvedMembers.map(member => (
                          <tr key={member.memberRecordId} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                                {member.userName.charAt(0)}
                              </div>
                              {member.userName}
                            </td>
                            <td className="px-6 py-4 text-zinc-400">{member.userEmail}</td>
                            <td className="px-6 py-4 text-zinc-500">
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
