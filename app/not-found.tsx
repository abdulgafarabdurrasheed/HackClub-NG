import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";

export default function NotFound() {
  return (
    <SiteFrame>
      <main id="main-content" className="page-container">
        <section className="sign-in-card">
          <span className="eyebrow">404 · Not found</span>
          <h1>This page wandered off.</h1>
          <p>Try the guides, or head back to the home page.</p>
          <div className="form-actions" style={{ justifyContent: "center" }}>
            <Link className="button button-green" href="/guides">
              Browse the guides
            </Link>
            <Link className="button button-light" href="/">
              Home
            </Link>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
