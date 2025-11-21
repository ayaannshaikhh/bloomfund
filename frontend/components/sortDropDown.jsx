export default function SortDropdown({ setSortOption }) {
  return (
    <select
      className="border p-2 rounded"
      onChange={(e) => setSortOption(e.target.value)}
    >
      <option value="">Sort by...</option>
      <option value="deadline">Deadline</option>
      <option value="amount">Amount</option>
      <option value="match">Match Strength</option>
    </select>
  );
}
