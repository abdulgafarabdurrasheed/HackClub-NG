import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-kicker">Made for the next generation of Nigerian hackers.</p>
          <p className="footer-copy">
            A local guide and outreach effort connected to{" "}
            <a href="https://hackclub.com/" target="_blank" rel="noreferrer">
              Hack Club Global
            </a>
            . Official club applications, approval, and programs remain with Hack Club.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/guides">Guides</Link>
          <Link href="/recommend-school">Recommend a school</Link>
          <a href="https://apply.hackclub.com/" target="_blank" rel="noreferrer">
            Official application ↗
          </a>
          <a href="https://hackclub.com/slack/" target="_blank" rel="noreferrer">
            Hack Club Slack ↗
          </a>
        </div>
        <div className="footer-bottom">
          <span>Hack Club Nigeria · Community support, not an approval authority.</span>
          <span>
            Built with{" "}
            <a href="https://hackclub.com/" target="_blank" rel="noreferrer">
              Hack Club
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
