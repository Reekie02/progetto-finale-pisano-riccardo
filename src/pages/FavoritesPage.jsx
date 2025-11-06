// src/pages/FavoritesPage.jsx
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function FavoritesPage() {
    const { favorites, loading, errorMsg, removeFavorite } = useFavorites();

    if (loading) return <p className="text-center mt-10 text-gray-600">Caricamento preferiti...</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">I miei preferiti</h1>

            {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
            {favorites.length === 0 ? (
                <p className="text-gray-600">Non hai ancora aggiunto giochi ai preferiti.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="bg-[#242424] shadow rounded-lg overflow-hidden">
                            <Link to={`/game/${fav.game_id}`}>
                                <img
                                    src={fav.game_image || "https://picsum.photos/seed/placeholder/600/400"}
                                    alt={fav.game_name}
                                    className="w-full h-40 object-cover"
                                    loading="lazy"
                                />
                            </Link>
                            <div className="p-3">
                                <h3 className="font-semibold text-[#eee] mb-2 line-clamp-1">{fav.game_name}</h3>
                                <div className="flex justify-between items-center">
                                    <Link
                                        to={`/game/${fav.game_id}`}
                                        className="text-sm text-green-600 hover:underline cursor-pointer"
                                    >
                                        Vai al gioco
                                    </Link>
                                    <button
                                        onClick={() => removeFavorite(fav.game_id)}
                                        className="text-sm px-2 py-1 rounded bg-red-600 text-white cursor-pointer"
                                    >
                                        <i className="bi bi-trash"></i> Rimuovi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}