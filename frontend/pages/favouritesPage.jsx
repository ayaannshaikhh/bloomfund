import React from "react";
import { useFavorites } from "../context/favouritesContext.jsx";
import EmptyState from "../components/emptyState.jsx";
import ScholarshipCard from "../components/scholarshipCard.jsx";

export default function FavoritesPage() {
  let favorites = [];

  try {
    const ctx = useFavorites();
    favorites = ctx?.favorites || [];
  } catch (e) {
    // hook not available or threw — fall back to empty list
    console.error("useFavorites error:", e);
    favorites = [];
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Your Favourites</h1>

        {favorites.length === 0 ? (
          <EmptyState message="No favorite scholarships yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}