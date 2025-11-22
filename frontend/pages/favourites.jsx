import React from "react";
import { useFavorites } from "../context/favouritesContext.jsx";
import EmptyState from "../components/emptyState.jsx";
import ScholarshipCard from "../components/scholarshipCard.jsx";
import styles from "../styles/favourites.module.css";

export default function Favourites() {
  const { favorites, loading } = useFavorites();

  // Map favorites data to match ScholarshipCard expectations
  const mappedFavorites = favorites.map(sch => ({
    id: sch.id,
    name: sch.name || sch.title,
    amount: sch.amount || "N/A",
    dueDate: sch.dueDate || sch.deadline,
    deadline: sch.deadline,
    description: sch.description || "",
    eligibility: sch.eligibility || "",
    essayRequired: sch.essayRequired || sch.essay_required || false,
    matchLevel: sch.matchLevel || "Good",
    matchScore: sch.matchScore || sch.match_score || 0,
    link: sch.link || "#"
  }));

  return (
    <div className="w-full min-h-screen flex justify-center items-start">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Your Favourites</h1>

        {loading && <p>Loading favorites...</p>}

        {!loading && mappedFavorites.length === 0 && (
          <EmptyState message="No favorite scholarships yet." />
        )}

        {!loading && mappedFavorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappedFavorites.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
