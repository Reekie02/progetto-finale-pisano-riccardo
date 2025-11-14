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
        <div className=" mx-auto mt-10 p-6 2xl:h-screen">

            <div className="flex justify-center">
                <h2 className="text-3xl text-green-500 py-5 italic font-bold 2xl:hidden">{game.name}</h2>
            </div>


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

                <div className="md:w-[800px]">
                    <GameChatPage gameTitle={game.name} />
                    {/* INFO EXTRA */}
                    <div className="my-8 space-y-6 bg-[#242424c7] p-6 rounded-lg">

                        {/* GENERI */}
                        {game.genres?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-green-500 mb-2">🎮 Generi</h3>
                                <div className="flex flex-wrap gap-2">
                                    {game.genres.map((g) => (
                                        <span
                                            key={g.id}
                                            className="px-3 py-1 bg-[#1e1e1e] text-green-400 text-sm rounded-md border border-green-700/40"
                                        >
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PIATTAFORME */}
                        {game.platforms?.length > 0 && (
                            <div className="">
                                <h3 className="text-xl font-semibold text-green-500 mb-2">🕹️ Piattaforme</h3>
                                <div className="flex flex-wrap gap-2">
                                    {game.platforms.map((p) => (
                                        <span
                                            key={p.platform.id}
                                            className="px-3 py-1 bg-[#1e1e1e] text-green-400 text-sm rounded-md border border-green-700/40"
                                        >
                                            {p.platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>




            </div>
        </div>
    );
}