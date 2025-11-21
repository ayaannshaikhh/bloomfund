import { Link } from "react-router-dom";
import Link from "next/link";
import Tag from "./tag.jsx";

export default function ScholarshipCard({ scholarship, isFavorite, onFavorite }) {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">{scholarship.name}</h2>
            <p className="text-gray-600 mb-2">${scholarship.amount}</p>

            <div className="flex flex-wrap gap-2 my-3">
                <Tag label={scholarship.matchLevel} />
                <Tag label={scholarship.essayRequired ? "Essay Required" : "No Essay"} />
                <Tag label={`Due: ${scholarship.dueDate}`} />
            </div>

            <div className="flex justify-between items-center mt-4">
                <Link 
                    to={`/scholarships/${scholarship.id}`}
                    className="text-blue-600 underline"
                >
                    View Details
                </Link>

                <button 
                    onClick={onFavorite}
                    className="text-xl"
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>
        </div>
    );
}
