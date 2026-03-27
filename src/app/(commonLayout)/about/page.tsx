export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          About TrackNest
        </h1>
        <p className="mt-4 text-base leading-7 text-white/80">
          TrackNest is a comprehensive platform designed to facilitate...
        </p>

        <div className="mt-6 flex flex-wrap gap-2"></div>
      </div>
    </div>
  );
}
