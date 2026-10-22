import Link from "next/link";

const links = [
  ["/account", "Overview"],
  ["/account/schools", "Schools & visits"],
  ["/account/recommendations", "Recommendations"],
  ["/account/team", "Team"],
] as const;

export function AccountNav({ active }: { active: string }) {
  return (
    <nav className="account-nav" aria-label="Outreach workspace">
      {links.map(([href, label]) => (
        <Link href={href} key={href} className={active === href ? "active" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
