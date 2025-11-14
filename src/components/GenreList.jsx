import { Link } from "react-router-dom";
import useFetchSolution from "../hooks/useFetchSolution.js";
import CardItem from "./CardItem.jsx";

const API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
const BASE_URL = "https://api.rawg.io/api";

export default function GenreList() {
    const { data, loading, error } = useFetchSolution(
        `${BASE_URL}/genres?key=${API_KEY}`
    );

    if (loading) return <p className="text-gray-500">Caricamento generi…</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const genres = Array.isArray(data?.results) ? data.results : [];


    return (
        <section className="mt-10">
            <div className="flex flex-wrap gap-10 justify-center max-w-[calc(full-1.5rem)">
                {genres.map((gen) => (
                    <Link key={gen.id} to={`/genre/${encodeURIComponent(gen.slug)}`}>
                        <CardItem
                            title={gen.name}
                            description={`Giochi nel genere ${gen.name}`}
                            imageUrl={gen.image_background}
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}