import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGameById } from "../services/rawgApi.js";
import ToggleFavorite from "../components/ToggleFavorite.jsx";

export default function GameDetailPage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchGameById(id);
            setGame(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p className="text-center mt-10 text-gray-600">Caricamento gioco...</p>;
    if (!game) return <p className="text-center mt-10 text-red-600">Gioco non trovato.</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-[#242424] shadow rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-3">{game.name}</h1>
                <Link
                    to={`/game/${id}/chat`}
                    className="text-sm px-3 py-2 rounded mb-3 bg-green-600 text-white hover:bg-green-700"
                >
                    Apri chat del gioco 💬
                </Link>
            </div>

            <img
                src={game.background_image}
                alt={game.name}
                className="w-full rounded mb-4"
            />
            <p className="text-[#eee] mb-4">{game.description_raw}</p>

            <div className="flex justify-center">
                <ToggleFavorite game={game} />
            </div>
        </div>
    );
}