import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 sm:p-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <header className="flex items-center justify-between mb-10 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={140}
            height={30}
            priority
          />
          <h1 className="text-xl font-bold tracking-tight">Flowbee Dashboard</h1>
        </div>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Deployed on Vercel
        </a>
      </header>

      <main className="grid gap-8">
        <section className="rounded-xl bg-slate-100 dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Recent Workflows</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Video Transcription + Translation</li>
            <li>Metadata Extraction</li>
            <li>Real-Time Performance Tracker</li>
          </ul>
        </section>

        <section className="rounded-xl bg-slate-100 dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <p className="text-sm">All systems operational. No issues reported in the last 24 hours.</p>
        </section>

        <section className="rounded-xl bg-slate-100 dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Next Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create New Workflow</button>
            <button className="border border-slate-300 dark:border-slate-600 px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition">View Analytics</button>
          </div>
        </section>
      </main>

      <footer className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Flowbee — All rights reserved.
      </footer>
    </div>
  );
}
