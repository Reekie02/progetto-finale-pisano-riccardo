// src/components/ChatRealtimeByGame.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatRealtimeByGame({ gameId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);

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
        // auto scroll in basso
        requestAnimationFrame(() => {
            listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
        });
    };

    // invia messaggio (NO submit nativo)
    const handleSend = async () => {
        if (!user || !newMsg.trim() || sending) return;
        setSending(true);
        const text = newMsg.trim();
        setNewMsg("");

        // optimistic append
        const temp = {
            id: `temp-${Date.now()}`,
            user_id: user.id,
            content: text,
            created_at: new Date().toISOString(),
            game_id: Number(gameId),
        };
        setMessages((prev) => [...prev, temp]);

        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content: text,
            game_id: Number(gameId),
        });

        if (error) {
            // rollback
            setMessages((prev) => prev.filter((m) => m.id !== temp.id));
            setNewMsg(text); // ripristina input
            alert(error.message || "Invio non riuscito");
        }
        setSending(false);
    };

    // blocca submit nativo del form
    const handleForm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSend();
    };

    // invio con Enter (ma senza submit nativo)
    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // realtime: solo messaggi del gioco
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
                    requestAnimationFrame(() => {
                        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
                    });
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameId]);

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-[#242424] shadow rounded flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-center text-green-700">
                💬 Chat del gioco #{gameId}
            </h2>

            <div
                ref={listRef}
                className="h-84 overflow-y-auto border p-2 rounded bg-gray-50"
            >
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
                            className={`my-1 p-2 rounded text-sm w-80 ${msg.user_id === user?.id
                                    ? "bg-green-100 ml-auto text-right"
                                    : "bg-gray-200 mr-auto text-left"
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
                <form
                    onSubmit={handleForm}
                    action="#"
                    noValidate
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 border rounded px-2 py-1 text-sm focus:outline-green-600"
                    />
                    <button
                        type="button"               // ← niente submit nativo
                        onClick={handleSend}
                        disabled={sending}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
                    >
                        {sending ? "..." : "Invia"}
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