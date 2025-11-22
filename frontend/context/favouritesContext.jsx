import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import api from "../utils/api.js";

const FavoritesContext = createContext({
  favorites: [],
  toggleFavorite: () => {},
  loading: false,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get user ID on mount
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    }
    getUser();
  }, []);

  // Load favorites from backend when user ID is available
  useEffect(() => {
    if (!userId) return;

    async function loadFavorites() {
      setLoading(true);
      try {
        const data = await api.getFavorites(userId);
        if (data.success && data.favourites) {
          // Map backend favorites to frontend format
          // Backend returns: { scholarship_id: X, scholarships: {...} }
          const mappedFavorites = data.favourites.map(fav => {
            const scholarship = fav.scholarships || {};
            return {
              id: fav.scholarship_id || scholarship.id,
              name: scholarship.title || scholarship.name,
              amount: scholarship.amount || "N/A",
              dueDate: scholarship.deadline,
              deadline: scholarship.deadline,
              description: scholarship.description || "",
              eligibility: scholarship.eligibility || "",
              essayRequired: scholarship.essay_required || false,
              link: scholarship.link || "#",
              ...scholarship // Include all other fields
            };
          });
          setFavorites(mappedFavorites);
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
      setLoading(false);
    }

    loadFavorites();
  }, [userId]);

  const toggleFavorite = async (scholarshipId) => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    const isFavorite = favorites.some(f => f.id === scholarshipId);

    try {
      if (isFavorite) {
        // Remove from favorites
        await api.removeFavorite(userId, scholarshipId);
        setFavorites(prev => prev.filter(f => f.id !== scholarshipId));
      } else {
        // Add to favorites
        await api.saveFavorite(userId, scholarshipId);
        // Optionally fetch the full scholarship data
        try {
          const scholarshipData = await api.getScholarship(scholarshipId);
          if (scholarshipData.success && scholarshipData.scholarship) {
            const mapped = {
              id: scholarshipData.scholarship.id || scholarshipData.scholarship.scholarship_id,
              name: scholarshipData.scholarship.title || scholarshipData.scholarship.name,
              ...scholarshipData.scholarship
            };
            setFavorites(prev => [...prev, mapped]);
          } else {
            // Fallback: just add the ID
            setFavorites(prev => [...prev, { id: scholarshipId }]);
          }
        } catch (err) {
          console.error("Error fetching scholarship:", err);
          // Fallback: just add the ID
          setFavorites(prev => [...prev, { id: scholarshipId }]);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
