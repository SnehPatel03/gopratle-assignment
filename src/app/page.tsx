import Link from "next/link";
import {
  SignInButton,
  UserButton,
  Show,
} from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Header with auth controls */}
      <header className="landing-header">
        <strong>GoPratle</strong>
        <div className="header-actions">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="auth-btn">Sign in with Google</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link href="/requirements" className="landing-nav-link">
              My Events
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Hero section */}
      <main className="landing-hero">
        <p className="landing-tag">Event Planning, Simplified</p>
        <h1 className="landing-title">
          Create <span className="cursive">beautiful</span>
          <br />
          events, <span className="cursive">effortlessly</span>
        </h1>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="landing-cta">Get Started →</button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Link href="/create" className="landing-cta">
            Start Creating →
          </Link>
        </Show>
      </main>
    </div>
  );
}
