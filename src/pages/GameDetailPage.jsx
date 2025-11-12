import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGameById } from "../services/rawgApi.js";
import ToggleFavorite from "../components/ToggleFavorite.jsx";
import GameChatPage from "./GameChatPage.jsx";

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
        <div className=" mx-auto mt-10 p-6 h-screen">


            <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start">
                <div className="max-w-2xl mx-auto">
                    <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full rounded mb-4"
                    />
                    <p className="text-[#eee] my-10">{game.description_raw}</p>

                    <div className="flex justify-center">
                        <ToggleFavorite game={game} />
                    </div>
                </div>
                <GameChatPage gameTitle={game.name} />
            </div>
        </div>
    );
}