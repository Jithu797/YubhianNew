/** Shown instead of the admin when required settings are missing from the build, so a
 *  misconfigured deployment explains itself instead of rendering a blank page. */
export default function SetupError({ missing }: { missing: string[] }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--navy)" }}>
      <div className="w-full max-w-lg rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>
          Admin portal isn&apos;t configured
        </h1>
        <p className="text-sm mb-4" style={{ color: "var(--gray)" }}>
          This build is missing settings it needs to connect to Firebase and the website. Add them as environment
          variables in the Vercel project (Settings → Environment Variables), then redeploy — Vite reads them at build
          time.
        </p>
        <ul className="rounded-xl p-4 text-sm font-mono flex flex-col gap-1" style={{ background: "var(--navy2)", color: "var(--white)" }}>
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
