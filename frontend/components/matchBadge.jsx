export default function MatchBadge({ match }) {
  const colors = {
    strong: "bg-green-500",
    medium: "bg-yellow-500",
    weak: "bg-red-500"
  };

  return (
    <span className={`inline-block text-white text-sm px-2 py-1 rounded ${colors[match]}`}>
      {match.toUpperCase()} MATCH
    </span>
  );
}