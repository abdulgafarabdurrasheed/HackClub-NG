import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 ? <Link href={hrefForPage(currentPage - 1)}>← Previous</Link> : <span />}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={hrefForPage(currentPage + 1)}>Next →</Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
