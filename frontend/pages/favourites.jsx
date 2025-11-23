import React from "react";
import { useFavorites } from "../context/favouritesContext.jsx";
import EmptyState from "../components/emptyState.jsx";
import ScholarshipCard from "../components/scholarshipCard.jsx";
import styles from "../styles/favourites.module.css"

export default function Favourites() {
  const { favorites } = useFavorites();

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md py-4 px-6 shadow-sm flex justify-between items-center z-50">
            <h1
            className="text-2xl font-semibold tracking-wide"
            style={{ color: "black" }}
            >
            Bloomfund
            </h1>

            <div className="space-x-8 text-lg">
                <a href="/favourites" className="hover:underline" style={{color: "black"}}>
                    Favourites
                </a>
                <a href="/" className="hover:underline" style={{ color: "black" }}>
                    Home
                </a>
                <a href="/signin" className="hover:underline" style={{ color: "black" }}>
                    Get Started
                </a>

            </div>
        </nav>
          <div>
              <div className={styles.container}>
                <h1 className="text-3xl font-bold mb-4">Your Favourites</h1>

                {favorites.length === 0 ? (
                  <EmptyState message="No favourite scholarships yet." />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((sch) => (
                      <ScholarshipCard key={sch.id} scholarship={sch} />
                    ))}
                  </div>
                )}
              </div>
          </div>
    </div>
    
    
  );
}
