// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user, setUsernameOptimistic, signOut } = useAuth();
    const [profile, setProfile] = useState({ username: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            setLoading(true);
            setMessage("");
            setErrorMsg("");

            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (error && error.code !== "PGRST116") {
                console.error("loadProfile error:", error);
                setErrorMsg(error.message || "Errore nel caricamento del profilo.");
            }

            if (data) setProfile({ username: data.username || "" });
            setLoading(false);
        }

        loadProfile();
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMsg("");

        const payload = {
            id: user.id,
            username: profile.username || null,
        };

        const { error } = await supabase.from("profiles").upsert(payload, {
            onConflict: "id",
        });

        if (error) {
            console.error("upsert error:", error);
            setErrorMsg(error.message || "Errore nell'aggiornamento del profilo.");
            return;
        }

        // Aggiorna subito la navbar senza aspettare il realtime
        setUsernameOptimistic(profile.username || "");
        setMessage("Profilo aggiornato con successo!");
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-600">Caricamento profilo...</p>;
    }



    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-[#242424] shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Profilo Utente</h1>

            {message && <p className="text-green-600 mb-3 text-center">{message}</p>}
            {errorMsg && <p className="text-red-600 mb-3 text-center">{errorMsg}</p>}

            <form onSubmit={handleUpdate} className="space-y-7">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Username</label>
                    <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ username: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                        placeholder="Inserisci username"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Salva modifiche
                </button>
            </form>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white cursor-pointer w-30 h-10 flex justify-center items-center text-xl my-5 ml-auto rounded mb-auto gap-2"
            >
                <p>Logout</p><i className="bi bi-box-arrow-right"></i>
            </button>
        </div>
    );
}