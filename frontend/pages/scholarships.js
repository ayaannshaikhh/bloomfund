import { useState, useEffect } from "react";
import ScholarshipCard from "../components/scholarshipCard.jsx";
import SortDropdown from "../components/sortDropDown.jsx";
import { useFavorites } from "../context/favouritesContext.jsx";
import "./scholarships.css";


function Scholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("name");

    const { favorites, toggleFavorite } = useFavorites();

    useEffect(() => {
        async function fetchScholarships() {
            try {
                const res = await fetch("http://localhost:8000/scholarships");
                const data = await res.json();
                setScholarships(data.scholarships || []);
            } catch (err) {
                console.error("Error fetching scholarships:", err);
            }
            setLoading(false);
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
        return 0;
    });

    return (
        <div className="container">
            <h2>Scholarships For You</h2>
            <SortDropdown onSort={handleSort} />

            {loading && <p>Loading scholarships...</p>}

            {!loading && scholarships.length === 0 && (
                <p>No scholarships found. Try updating your profile.</p>
            )}

            {scholarships.length > 0 && (
                <div className="return-box">
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
    );
}

export default Scholarships;
