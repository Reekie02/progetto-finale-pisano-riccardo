import { useSearchParams, Link } from "react-router-dom";
import useFetchSolution from "../hooks/useFetchSolution.js";
import CardItem from "../components/CardItem.jsx";

const API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
const BASE_URL = "https://api.rawg.io/api";

export default function SearchPage() {
    const [params] = useSearchParams();
    const query = params.get("query") || "";

    const { data, loading, error } = useFetchSolution(
        query ? `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}` : ""
    );

    const results = Array.isArray(data?.results) ? data.results : [];

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-white">
                Risultati per: <span className="text-green-600">"{query}"</span>
            </h1>
            <div className="max-w-[calc(full-1.5rem)] mx-auto p-4">

                <div>
                    {loading && <p className="text-gray-500">Caricamento risultati…</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {!query && <p className="text-gray-500">Inserisci una parola chiave nella barra di ricerca.</p>}

                    {!loading && !error && results.length > 0 && (
                        // <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex flex-wrap justify-center gap-10">
                            {results.map((game) => (
                                <Link key={game.id} to={`/game/${game.id}`}>
                                    <CardItem
                                        title={game.name}
                                        description={`Rating: ${game.rating ?? "n/d"}`}
                                        imageUrl={game.background_image}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && !error && query && results.length === 0 && (
                        <p className="text-gray-500">Nessun gioco trovato per la tua ricerca.</p>
                    )}
                </div>
            </div>
        </>
    );
}