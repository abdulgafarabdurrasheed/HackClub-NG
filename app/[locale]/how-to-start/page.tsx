import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HowToStartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              How to start a <span className="text-[#ec3750]">Hack Club</span>
            </h1>
            <p className="text-lg text-zinc-400">
              Bring the world's best coding community to your school in Nigeria.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex gap-6">
              <div className="text-4xl font-black text-zinc-700">1</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Apply officially via HQ</h3>
                <p className="text-zinc-400 mb-4">
                  All Nigerian Hack Clubs are officially recognized by Hack Club HQ. First, you need to read the global guidelines and submit your application.
                </p>
                <a href="https://apply.hackclub.com" target="_blank" className="inline-block bg-[#ec3750] hover:bg-[#d02c42] text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Go to apply.hackclub.com
                </a>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex gap-6">
              <div className="text-4xl font-black text-zinc-700">2</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Get onboarded & receive your stickers</h3>
                <p className="text-zinc-400">
                  Once HQ approves you, you will be invited to the global Slack with 50,000+ other teenagers, and they'll mail you a box of stickers to hand out at your first meeting.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex gap-6">
              <div className="text-4xl font-black text-zinc-700">3</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Register on the Nigerian Directory</h3>
                <p className="text-zinc-400 mb-4">
                  Once you are officially approved and have your Slack account, come back here to put your club on the Nigerian map!
                </p>
                <a href="/register" className="inline-block bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-zinc-200 transition-colors">
                  Register on the Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
