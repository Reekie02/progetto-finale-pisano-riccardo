import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function ChatRealtimeByGame({ gameId, gameTitle }) {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);

    // helper: scroll in basso
    const scrollDown = () =>
        requestAnimationFrame(() => {
            listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
        });

    useEffect(() => {
        if (authLoading || !user) return;          // solo loggati
        const gid = Number(gameId);
        if (!Number.isFinite(gid)) {               // gameId valido?
            console.warn("gameId non numerico:", gameId);
            setMessages([]);
            setLoading(false);
            return;
        }

        let ignore = false;

        const load = async () => {
            setLoading(true);

            // 1) prendo i messaggi (senza join)
            const { data: rows, error } = await supabase
                .from("messages")
                .select("id,user_id,content,created_at,game_id")
                .eq("game_id", gid)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Load messages error:", error);
                if (!ignore) {
                    setMessages([]);
                    setLoading(false);
                }
                return;
            }

            // 2) mappa user_id -> username (con in())
            let enriched = rows || [];
            const ids = [...new Set(enriched.map(r => r.user_id).filter(Boolean))];

            let userMap = {};
            if (ids.length) {
                const { data: profs, error: perr } = await supabase
                    .from("profiles")
                    .select("id,username")
                    .in("id", ids);
                if (!perr && profs) {
                    userMap = profs.reduce((acc, p) => {
                        acc[p.id] = p.username || null;
                        return acc;
                    }, {});
                }
            }

            enriched = enriched.map(r => ({
                ...r,
                username: userMap[r.user_id] || null,
            }));

            if (!ignore) {
                setMessages(enriched);
                setLoading(false);
                scrollDown();
            }
        };

        load();

        // realtime solo di questo gioco
        const channel = supabase
            .channel(`realtime-chat-${gid}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `game_id=eq.${gid}` },
                async (payload) => {
                    // arricchisco con username (singola query)
                    let username = null;
                    const { data: prof } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("id", payload.new.user_id)
                        .single();

                    if (prof?.username) username = prof.username;

                    setMessages(curr => [...curr, { ...payload.new, username }]);
                    scrollDown();
                }
            )
            .subscribe();

        return () => {
            ignore = true;
            supabase.removeChannel(channel);
        };
    }, [gameId, authLoading, user]);

    const send = async (e) => {
        e.preventDefault();
        if (!user) return;
        const content = text.trim();
        if (!content || sending) return;

        setSending(true);
        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content,
            game_id: Number(gameId),
        });
        if (error) console.error("Insert message error:", error);
        else setText("");
        setSending(false);
    };

    if (!user) {
        return (
            <div className="flex items-start justify-center pt-10 2xl:pt-0">
                <div className="bg-[#242424] text-white rounded-xl shadow p-6 flex flex-col gap-4 w-screen md:w-[800px]">
                    <h2 className="text-lg font-semibold text-center text-green-600">
                        💬 Chat del gioco: <span className="text-green-600">{gameTitle}</span>
                    </h2>
                    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-200 px-3 py-2 text-sm text-center">
                        Devi essere loggato per visualizzare e scrivere nella chat.
                    </div>
                </div>
            </div>
        );
    }






    return (
        <div className="flex items-start justify-center">
            <div className="bg-[#242424] text-white rounded-xl shadow p-6 flex flex-col gap-4 w-screen md:w-[800px]">
                <h2 className="text-lg font-semibold text-center text-green-600">
                    💬 Chat del gioco: <span className="text-green-600">{gameTitle}</span>
                </h2>

                <div ref={listRef} className="h-80 overflow-y-auto rounded border border-white/10 bg-gray-50 p-3">
                    {loading ? (
                        <p className="text-center text-sm text-gray-500">Caricamento…</p>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">Nessun messaggio.</p>
                    ) : (
                        messages.map((m) => {
                            const mine = m.user_id === user?.id;
                            const username = m.username || "Utente sconosciuto";
                            return (
                                <div key={m.id} className="mb-2" style={{
                                    transition: "opacity .25s ease, transform .25s ease",
                                    opacity: 1, transform: "translateY(0)"
                                }}>
                                    <div className={`my-1 p-2 rounded text-sm w-80 ${mine ? "bg-green-100 ml-auto text-right" : "bg-gray-200 mr-auto text-left"}`}>
                                        <div className="text-[10px] text-gray-600 mb-1">
                                            <strong>{mine ? "Tu" : username}</strong> · {new Date(m.created_at).toLocaleString()}
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
                        placeholder="Scrivi un messaggio…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={sending}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send(e);
                            }
                        }}
                    />
                    <button className="rounded-md bg-green-700 hover:bg-green-600 transition px-4 py-2 text-sm font-medium disabled:opacity-60" disabled={!text.trim() || sending}>
                        {sending ? "Invio…" : "Invia"}
                    </button>
                </form>
            </div>
        </div>
    );
}