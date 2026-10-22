import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Hack Club Nigeria home">
          <Image
            src="/assets/hackClubLogoRed.svg"
            alt="Hack Club"
            width={114}
            height={40}
            priority
          />
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-country">Nigeria</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/guides">Guides</Link>
          <Link href="/recommend-school">Recommend a school</Link>
          <a href="https://hackclub.com/clubs/" target="_blank" rel="noreferrer">
            Hack Club ↗
          </a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {!session?.user?.email && (
            <Link className="button button-small button-dark" href="/account">
              Team account <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
