// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from "./AuthContext.jsx";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const refreshFavorites = async () => {
        if (!user) {
            setFavorites([]);
            return;
        }
        setLoading(true);
        setErrorMsg("");
        const { data, error } = await supabase
            .from("favorites")
            .select("id, user_id, game_id, game_name, game_image, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            setErrorMsg(error.message || "Errore nel caricamento dei preferiti");
        } else {
            setFavorites(Array.isArray(data) ? data : []);
        }
        setLoading(false);
    };

    const isFavorite = (gameId) =>
        favorites.some((f) => String(f.game_id) === String(gameId));

    // ---- ADD con aggiornamento ottimistico
    const addFavorite = async (game) => {
        if (!user) return { error: { message: "Devi accedere" } };

        // evita duplicati in memoria
        if (isFavorite(game.id)) return { error: null };

        // optimistic: aggiungo subito un record "provvisorio"
        const optimistic = {
            id: `temp-${game.id}`,
            user_id: user.id,
            game_id: game.id,
            game_name: game.name,
            game_image: game.background_image || "",
            created_at: new Date().toISOString(),
        };
        setFavorites((prev) => [optimistic, ...prev]);

        // chiamata reale
        const { error } = await supabase.from("favorites").insert({
            user_id: user.id,
            game_id: game.id,
            game_name: game.name,
            game_image: game.background_image || "",
        });

        if (error) {
            // rollback ottimistico
            setFavorites((prev) =>
                prev.filter((f) => String(f.game_id) !== String(game.id))
            );
            setErrorMsg(error.message || "Errore nell'aggiunta ai preferiti");
            return { error };
        }

        // lasciamo che il realtime/refresh riallinei l'id reale;
        // se vuoi forzare subito, puoi chiamare refreshFavorites() qui.
        return { error: null };
    };

    // ---- REMOVE con aggiornamento ottimistico
    const removeFavorite = async (gameId) => {
        if (!user) return { error: { message: "Devi accedere" } };

        // optimistic: rimuovo subito
        const prevSnapshot = favorites;
        setFavorites((prev) =>
            prev.filter((f) => String(f.game_id) !== String(gameId))
        );

        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("game_id", gameId);

        if (error) {
            // rollback
            setFavorites(prevSnapshot);
            setErrorMsg(error.message || "Errore nella rimozione dai preferiti");
            return { error };
        }

        return { error: null };
    };

    const toggleFavorite = async (game) => {
        return isFavorite(game.id) ? removeFavorite(game.id) : addFavorite(game);
    };

    // carica all'accesso
    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }
        refreshFavorites();
    }, [user]);

    // realtime: riallinea dopo eventi DB (così sistemiamo gli id provvisori)
    useEffect(() => {
        if (!user) return;
        const channel = supabase
            .channel("favorites-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "favorites", filter: `user_id=eq.${user.id}` },
                () => refreshFavorites()
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const value = useMemo(
        () => ({
            favorites,
            loading,
            errorMsg,
            refreshFavorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite,
        }),
        [favorites, loading, errorMsg]
    );

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
    return useContext(FavoritesContext);
}