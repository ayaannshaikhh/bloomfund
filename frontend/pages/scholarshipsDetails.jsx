import { useParams } from "react-router-dom";
import { useFavorites } from "../context/favouritesContext.jsx";

export default function ScholarshipDetails() {
  const { id } = useParams();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  // In real app → fetch details from backend
  // For now, mock structure:
  const scholarship = {
    id,
    name: "Example Scholarship",
    amount: 2000,
    deadline: "2025-03-12",
    description: "Full detailed description here",
    link: "https://example.com",
    match: "Strong match"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{scholarship.name}</h1>

      <p className="text-lg mb-2">Amount: ${scholarship.amount}</p>
      <p className="text-lg mb-2">Deadline: {scholarship.deadline}</p>
      <p className="text-lg mb-4">{scholarship.match}</p>

      <p className="mb-6">{scholarship.description}</p>

      <div className="flex gap-4">
        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Now
        </a>

        {isFavorited(scholarship.id) ? (
          <button
            onClick={() => removeFavorite(scholarship.id)}
            className="border border-red-600 text-red-600 px-4 py-2 rounded"
          >
            Remove Favorite
          </button>
        ) : (
          <button
            onClick={() => addFavorite(scholarship)}
            className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded"
          >
            Add to Favorites
          </button>
        )}
      </div>
    </div>
  );
}