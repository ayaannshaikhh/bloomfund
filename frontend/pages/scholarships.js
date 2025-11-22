import { useState, useEffect } from "react";
import ScholarshipCard from "../components/scholarshipCard.jsx";
import SortDropdown from "../components/sortDropDown.jsx";
import { useFavorites } from "../context/favouritesContext.jsx";
import api from "../utils/api.js";
import styles from "../styles/scholarships.module.css";


function Scholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("name");

    const { favorites, toggleFavorite } = useFavorites();

    useEffect(() => {
        async function fetchScholarships() {
            try {
                const data = await api.getScholarships();
                // Map backend data structure to frontend expectations
                const mappedScholarships = (data.scholarships || []).map(sch => ({
                    id: sch.id || sch.scholarship_id,
                    name: sch.title || sch.name, // Backend uses 'title', frontend expects 'name'
                    amount: sch.amount || "N/A",
                    dueDate: sch.deadline || sch.dueDate, // Backend uses 'deadline', frontend expects 'dueDate'
                    deadline: sch.deadline,
                    description: sch.description || "",
                    eligibility: sch.eligibility || "",
                    essayRequired: sch.essay_required || false,
                    matchLevel: sch.matchLevel || "Good",
                    matchScore: sch.match_score || sch.matchScore || 0,
                    link: sch.link || "#"
                }));
                setScholarships(mappedScholarships);
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
        if (sortOption === "date") return new Date(a.dueDate || a.deadline) - new Date(b.dueDate || b.deadline);
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
