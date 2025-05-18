export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            AdJustMoment <span className="text-primary">Research Tool</span>
          </h1>

          <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
            Internal research platform for demo, testing, and data collection
            purposes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-xl">Purpose</h2>
                <p className="text-base-content/80">
                  This tool supports our ongoing research efforts toward
                  academic publication, focusing on adaptive interfaces and
                  temporal interactions.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-xl">Status</h2>
                <p className="text-base-content/80">
                  Currently under active development. This version is for
                  internal use only and not intended for public release.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/experiments" className="btn btn-primary">
                Run Experiments
              </a>
              <a href="/data" className="btn btn-outline">
                View Data
              </a>
            </div>
          </div>

          <div className="mt-12 text-sm text-base-content/60">
            <p>For internal research team use only</p>
            <p className="mt-2">Version 0.1.0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
