export const dynamic = "force-dynamic";

const SearchResultsClient = ({ initialQuery }: { initialQuery: string }) => {
  return (
    <div>
      {/* Minimal inline results component to avoid missing-module error.
          Replace with a separate client component at ./SearchResultsClient when available. */}
      <p className="text-sm text-gray-500">
        Showing results for: {initialQuery || "All"}
      </p>
    </div>
  );
};

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || "";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SearchResultsClient initialQuery={query} />
    </div>
  );
}
