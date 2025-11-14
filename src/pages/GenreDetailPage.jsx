// src/pages/GenreDetailPage.jsx
import { Link, useParams } from "react-router-dom";
import useFetchSolution from "../hooks/useFetchSolution.js";
import CardItem from "../components/CardItem.jsx";

const API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
const BASE_URL = "https://api.rawg.io/api";

export default function GenreDetailPage() {
    const { genre } = useParams();
    const { data, loading, error } = useFetchSolution(
        `${BASE_URL}/games?key=${API_KEY}&genres=${encodeURIComponent(genre)}&page=1`
    );

    const games = Array.isArray(data?.results) ? data.results : [];
    console.log(games);


    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    Genere: <br /> <span className="uppercase italic">{genre}</span>
                </h1>
                <Link to="/" className="text-green-600 hover:underline">
                    ← Torna alla Home
                </Link>
            </div>

            {loading && <p className="text-gray-500">Caricamento giochi…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (

                <div className="flex flex-wrap gap-10 justify-center max-w-[calc(full-2.5rem)">

                    {games.map((game) => (
                        <Link key={game.id} to={`/game/${game.id}`}>
                            {/* <CardItem
                                title={game.name}
                                description={`Rating: ${game.rating ?? "n/d"}`}
                                imageUrl={game.background_image}
                            /> */}
                            <CardItem
                                title={game.name}
                                description={game.short_description}
                                imageUrl={game.background_image}
                                rating={game.rating?.toFixed(2)}
                                released={game.released}
                                genres={game.genres?.map((g) => g.name).join(" · ")}
                                extra={game.parent_platforms?.map((p) => p.platform.name).join(" · ")}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}