// src/components/ToggleFavorite.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function ToggleFavorite({ game }) {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const fav = isFavorite(game.id);

    const onClick = async () => {
        if (!user) {
            setMsg("Devi essere loggato per usare i preferiti.");
            return;
        }
        setBusy(true);
        setMsg("");
        const { error } = await toggleFavorite(game);
        if (error) {
            setMsg(error.message || "Operazione non riuscita");
        } else {
            setMsg(fav ? "Rimosso dai preferiti" : "Aggiunto ai preferiti");
            setTimeout(() => setMsg(""), 1000);
        }
        setBusy(false);
    };

    return (
        <div className="grid gap-2 justify-items-center">
            <button
                onClick={onClick}
                disabled={busy}
                className={`px-3 py-2 rounded text-sm transition-colors ${fav ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
            >
                {busy ? "..." : fav ? "★ Rimuovi dai preferiti" : "☆ Aggiungi ai preferiti"}
            </button>
            {msg && <p className="text-xs text-gray-600">{msg}</p>}
        </div>
    );
}