import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function ChatRealtimeByGame({ gameId, gameTitle }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);

    // 🔹 Carica solo messaggi del gioco corrente
    useEffect(() => {
        let ignore = false;

        async function load() {
            setLoading(true);
            // 👇 join con la tabella profiles per ottenere username
            const { data, error } = await supabase
                .from("messages")
                .select(`
          id,
          user_id,
          content,
          created_at,
          game_id,
          profiles (
            username
          )
        `)
                .eq("game_id", gameId)
                .order("created_at", { ascending: true });

            if (!ignore) {
                if (error) {
                    console.error("Load messages error:", error);
                } else {
                    setMessages(data || []);
                }
                setLoading(false);

                // scroll in basso
                requestAnimationFrame(() => {
                    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
                });
            }
        }

        load();

        // 🔹 Realtime solo per i messaggi di questo gioco
        const channel = supabase
            .channel(`realtime-chat-${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `game_id=eq.${gameId}`,
                },
                async (payload) => {
                    // 👇 Recupera username dell'utente che ha scritto
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("id", payload.new.user_id)
                        .single();

                    setMessages((curr) => [
                        ...curr,
                        { ...payload.new, profiles: profile ? { username: profile.username } : null },
                    ]);

                    requestAnimationFrame(() => {
                        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
                    });
                }
            )
            .subscribe();

        return () => {
            ignore = true;
            supabase.removeChannel(channel);
        };
    }, [gameId]);

    // 🔹 Invio messaggio legato a questo gioco
    const send = async (e) => {
        e.preventDefault();
        if (!user) return;
        const content = text.trim();
        if (!content || sending) return;

        setSending(true);
        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content,
            game_id: gameId,
        });

        if (error) console.error("Insert message error:", error);
        else setText("");
        setSending(false);
    };

    return (
        <div className=" flex items-start justify-center pt-10">
            <div className="bg-[#242424] text-white rounded-xl shadow p-6 flex flex-col gap-4 w-screen md:w-[800px]">
                <h2 className="text-lg font-semibold text-center text-green-600">
                    💬 Chat del gioco:{" "}
                    <span className="text-green-600">{gameTitle}</span>
                </h2>

                {!user && (
                    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-200 px-3 py-2 text-sm">
                        Devi essere loggato per scrivere nella chat.
                    </div>
                )}

                <div
                    ref={listRef}
                    className="h-80 overflow-y-auto rounded border border-white/10 bg-gray-50 p-3"
                >
                    {loading ? (
                        <p className="text-center text-sm text-gray-500">Caricamento…</p>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">
                            Nessun messaggio.
                        </p>
                    ) : (
                        messages.map((m) => {
                            const mine = m.user_id === user?.id;
                            const username =
                                m.profiles?.username || "Utente sconosciuto";

                            return (
                                <div key={m.id} className="mb-2">
                                    <div
                                        className={`my-1 p-2 rounded text-sm w-80 ${mine
                                            ? "bg-green-100 ml-auto text-right"
                                            : "bg-gray-200 mr-auto text-left"
                                            }`}
                                    >
                                        <div className="text-[10px] text-gray-600 mb-1">
                                            <strong>{mine ? "Tu" : username}</strong> ·{" "}
                                            {new Date(m.created_at).toLocaleString()}
                                        </div>
                                        <div className="text-gray-900">{m.content}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <form onSubmit={send} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-60"
                        placeholder={
                            user ? "Scrivi un messaggio…" : "Accedi per scrivere…"
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={!user || sending}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send(e);
                            }
                        }}
                    />
                    <button
                        className="rounded-md bg-green-700 hover:bg-green-600 transition px-4 py-2 text-sm font-medium disabled:opacity-60"
                        disabled={!user || !text.trim() || sending}
                    >
                        {sending ? "Invio…" : "Invia"}
                    </button>
                </form>
            </div>
        </div>
    );
}