import Link from "next/link";

export function GuideCard({
  href,
  number,
  title,
  description,
  tag,
}: {
  href: string;
  number: string;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <Link href={href} className="guide-card">
      <span className="guide-number">{number}</span>
      <div>
        <span className="eyebrow">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="card-arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
