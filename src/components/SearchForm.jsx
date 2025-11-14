import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/navbar.css'

export default function SearchForm() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?query=${encodeURIComponent(query)}`);
        setQuery("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                id="search"
                name="search"
                placeholder="Cerca un gioco..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-[#242424] rounded-md rounded-r-none border-r-0 px-3 py-2 h-9 text-sm search"
            />
            <button
                type="submit"
                className="bg-[#242424] text-white px-3.5 py-2 rounded-md rounded-l-none transition text-sm h-9 cursor-pointer"
            >
                <i className="bi bi-search"></i>
            </button>
        </form>
    );
}