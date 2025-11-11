import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function ToggleFavorite({ game }) {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [busy, setBusy] = useState(false);


    const [msgAdd, setMsgAdd] = useState("");
    const [msgRemove, setMsgRemove] = useState("");
    const [msgLogin, setMsgLogin] = useState("");
    const [msgError, setMsgError] = useState("");

    const fav = isFavorite(game.id);

    const clearMessages = () => {
        setMsgAdd("");
        setMsgRemove("");
        setMsgLogin("");
        setMsgError("");
    };

    const onClick = async () => {
        clearMessages();

        if (!user) {
            setMsgLogin("Devi essere loggato per usare i preferiti.");
            return;
        }

        setBusy(true);

        const { error } = await toggleFavorite(game);

        if (error) {
            setMsgError(error.message || "Operazione non riuscita.");
        } else {
            if (fav) {
                setMsgRemove("❌ Rimosso dai preferiti!");
                setTimeout(() => setMsgRemove(""), 1500);
            } else {
                setMsgAdd("⭐ Aggiunto ai preferiti!");
                setTimeout(() => setMsgAdd(""), 1500);
            }
        }

        setBusy(false);
    };

    return (
        <div className="grid gap-2 justify-items-center">
            <button
                onClick={onClick}
                disabled={busy}
                className={`px-3 py-2 rounded text-sm transition-all duration-200 ${fav
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } ${busy ? "opacity-60 cursor-wait" : ""}`}
            >
                {busy
                    ? "..."
                    : fav
                        ? "★ Rimuovi dai preferiti"
                        : "☆ Aggiungi ai preferiti"}
            </button>


            {msgAdd && <p className="text-xs text-yellow-300">{msgAdd}</p>}
            {msgRemove && <p className="text-xs text-red-600">{msgRemove}</p>}
            {msgLogin && <p className="text-xs text-red-500">{msgLogin}</p>}
            {msgError && <p className="text-xs text-red-500">{msgError}</p>}
        </div>
    );
}