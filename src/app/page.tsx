import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Minimal header */}
      <header className="landing-header">
        <strong>GoPratle</strong>
        <Link href="/requirements" className="landing-nav-link">
          My Events
        </Link>
      </header>

      {/* Hero section */}
      <main className="landing-hero">
        <p className="landing-tag">Event Planning, Simplified</p>
        <h1 className="landing-title">
          Create <span className="cursive">beautiful</span>
          <br />
          events, <span className="cursive">effortlessly</span>
        </h1>
        <Link href="/create" className="landing-cta">
          Start Creating →
        </Link>
      </main>


    </div>
  );
}
