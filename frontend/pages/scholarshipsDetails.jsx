import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFavorites } from "../context/favouritesContext.jsx";
import api from "../utils/api.js";

export default function ScholarshipDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;

    async function fetchScholarship() {
      try {
        setLoading(true);
        const data = await api.getScholarship(id);
        if (data.success && data.scholarship) {
          // Map backend data to frontend format
          const mapped = {
            id: data.scholarship.id || data.scholarship.scholarship_id,
            name: data.scholarship.title || data.scholarship.name,
            amount: data.scholarship.amount || "N/A",
            deadline: data.scholarship.deadline,
            description: data.scholarship.description || "",
            eligibility: data.scholarship.eligibility || "",
            essayRequired: data.scholarship.essay_required || false,
            link: data.scholarship.link || "#",
            matchScore: data.scholarship.match_score || 0
          };
          setScholarship(mapped);
        } else {
          setError("Scholarship not found");
        }
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("Failed to load scholarship");
      } finally {
        setLoading(false);
      }
    }

    fetchScholarship();
  }, [id]);

  if (!id) return <p>Loading...</p>;
  if (loading) return <p>Loading scholarship details...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!scholarship) return <p>Scholarship not found</p>;

  const isFavorited = favorites.some(f => f.id === scholarship.id);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{scholarship.name}</h1>

      {scholarship.amount && (
        <p className="text-lg mb-2">Amount: ${scholarship.amount}</p>
      )}
      {scholarship.deadline && (
        <p className="text-lg mb-2">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
      )}
      {scholarship.matchScore > 0 && (
        <p className="text-lg mb-4">Match Score: {scholarship.matchScore}%</p>
      )}

      {scholarship.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{scholarship.description}</p>
        </div>
      )}

      {scholarship.eligibility && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
          <p>{scholarship.eligibility}</p>
        </div>
      )}

      <div className="flex gap-4">
        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Now
        </a>

        <button
          onClick={() => toggleFavorite(scholarship.id)}
          className={`border px-4 py-2 rounded ${
            isFavorited
              ? "border-red-600 text-red-600 hover:bg-red-50"
              : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          {isFavorited ? "Remove Favorite" : "Add to Favorites"}
        </button>
      </div>
    </div>
  );
}
