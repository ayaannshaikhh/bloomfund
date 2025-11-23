import { useState, useEffect } from "react";
import ScholarshipCard from "../components/scholarshipCard.jsx";
import SortDropdown from "../components/sortDropDown.jsx";
import { useFavorites } from "../context/favouritesContext.jsx";
import styles from "../styles/scholarships.module.css";

function Scholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("name");

    const { favorites, toggleFavorite } = useFavorites();

useEffect(() => {
  async function fetchScholarships() {
    try {
      const res = await fetch("http://localhost:5000/scholarships");
      const data = await res.json();
      setScholarships(data.scholarships || []);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchScholarships();
}, []);



    const handleSort = (type) => {
        setSortOption(type);
    };

    const sortedScholarships = [...scholarships].sort((a, b) => {
        if (sortOption === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortOption === "date") return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortOption === "match") return (b.matchScore || 0) - (a.matchScore || 0);
        // if (sortOption === "essay")
        return 0;
    });

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
                    <a href="/main" className="hover:underline" style={{color: "black"}}>
                        Upload
                    </a>
                    <a href="/" className="hover:underline" style={{ color: "black" }}>
                        Home
                    </a>
                    <a href="/signin" className="hover:underline" style={{ color: "black" }}>
                        Get Started
                    </a>

                </div>
            </nav>
            <div className={styles.container}>
                    <h2 className="text-3xl font-semibold tracking-wide">Scholarships For You</h2>
                    <SortDropdown onSort={handleSort} />

                    {loading && <p>Loading scholarships...</p>}

                    {!loading && scholarships.length === 0 && (
                        <p>No scholarships found. Try updating your profile.</p>
                    )}

                    {scholarships.length > 0 && (
                        <div className={styles.return-box}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Your Matches</h2>

                                <SortDropdown setSortOption={setSortOption} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sortedScholarships.map((sch) => (
                                    <ScholarshipCard
                                        key={sch.id}
                                        scholarship={sch}
                                        isFavorite={favorites.includes(sch.id)}
                                        onFavorite={() => toggleFavorite(sch.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </div>
        
    );
}

export default Scholarships;
