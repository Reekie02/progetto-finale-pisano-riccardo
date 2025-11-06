import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchGameById } from "../services/rawgApi.js";
import { useParams } from "react-router-dom";


export default function ChatRealtimeByGame({ gameId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // carica messaggi del gioco
    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("messages")
            .select("id, user_id, content, created_at, game_id")
            .eq("game_id", Number(gameId))
            .order("created_at", { ascending: true });
        if (!error) setMessages(data || []);
        setLoading(false);
    };

    // invia messaggio per il gioco
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user || !newMsg.trim()) return;
        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content: newMsg.trim(),
            game_id: Number(gameId),
        });
        if (!error) setNewMsg("");
    };

    // realtime: ascolta SOLO i messaggi con quel game_id
    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel(`realtime-chat-${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `game_id=eq.${Number(gameId)}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [gameId]);

    const { id } = useParams(); // RAWG game id
    const [gameName, setGameName] = useState("");

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                const data = await fetchGameById(id);
                if (active) setGameName(data?.name || `Gioco #${id}`);
            } catch {
                if (active) setGameName(`Gioco #${id}`);
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [id]);

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-[#242424] shadow rounded flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-center text-green-700">
                💬 Chat del gioco {gameName}
            </h2>

            <div className="h-84 overflow-y-auto border p-2 pt-0 rounded bg-gray-50">
                {loading ? (
                    <p className="text-center text-sm text-gray-500">Caricamento...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                        Nessun messaggio per questo gioco
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`my-5 p-2 rounded text-sm w-80 ${msg.user_id === user?.id
                                ? "bg-green-100 text-right ml-auto"
                                : "bg-gray-200 text-left mr-auto"
                                }`}
                        >
                            {msg.content}
                            <div className="text-[10px] text-gray-500">
                                {new Date(msg.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 border rounded px-2 py-1 text-sm focus:outline-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Invia
                    </button>
                </form>
            ) : (
                <p className="text-center text-sm text-gray-500">
                    Effettua l'accesso per scrivere nella chat.
                </p>
            )}
        </div>
    );
}