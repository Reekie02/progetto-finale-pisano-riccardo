import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function ChatRealtimeByGame({ gameId, gameTitle }) {
    const { user, loading: authLoading } = useAuth();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // presence / typing
    const [typingUsers, setTypingUsers] = useState([]); // array di {id, username}
    const presenceRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [selfUsername, setSelfUsername] = useState(null);

    // refs & helpers
    const listRef = useRef(null);
    const gid = useMemo(() => Number(gameId), [gameId]);

    const smoothScrollDown = () => {
        if (!listRef.current) return;
        requestAnimationFrame(() => {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        });
    };

    const colorFromString = (str = "") => {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        const hue = Math.abs(h) % 360;
        return `hsl(${hue} 70% 40%)`;
    };

    const initialsOf = (name = "") => {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "??";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    // “adesso / X minuti fa / ieri HH:mm / dd/mm/yyyy HH:mm”
    const formatRelativeIT = (iso) => {
        const d = new Date(iso);
        const now = new Date();
        const diff = (now - d) / 1000; // sec
        const two = (n) => String(n).padStart(2, "0");
        if (diff < 10) return "adesso";
        if (diff < 60) return `${Math.round(diff)} secondi fa`;
        const m = Math.round(diff / 60);
        if (m < 60) return `${m} minuti fa`;
        const h = Math.round(m / 60);
        const sameDay = d.toDateString() === now.toDateString();
        if (sameDay) return `${h} ore fa`;
        const y = new Date(now); y.setDate(now.getDate() - 1);
        const isYesterday = d.toDateString() === y.toDateString();
        if (isYesterday) return `ieri ${two(d.getHours())}:${two(d.getMinutes())}`;
        return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`;
    };

    // carica username dell'utente loggato (per presence)
    useEffect(() => {
        if (!user || authLoading) return;
        let cancelled = false;
        (async () => {
            const { data } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();
            if (!cancelled) setSelfUsername(data?.username || null);
        })();
        return () => { cancelled = true; };
    }, [user, authLoading]);

    // load messaggi + realtime + presence (solo loggati)
    useEffect(() => {
        if (authLoading || !user) return;
        if (!Number.isFinite(gid)) {
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

            // 2) arricchisco con username via IN
            const ids = [...new Set((rows || []).map(r => r.user_id).filter(Boolean))];
            let userMap = {};
            if (ids.length) {
                const { data: profs } = await supabase
                    .from("profiles")
                    .select("id,username")
                    .in("id", ids);
                if (profs) {
                    userMap = profs.reduce((acc, p) => {
                        acc[p.id] = p.username || null;
                        return acc;
                    }, {});
                }
            }

            const enriched = (rows || []).map(r => ({
                ...r,
                username: userMap[r.user_id] || null,
            }));

            if (!ignore) {
                setMessages(enriched);
                setLoading(false);
                smoothScrollDown();
            }
        };

        load();

        // Realtime messaggi
        const msgChannel = supabase
            .channel(`realtime-chat-${gid}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `game_id=eq.${gid}` },
                async (payload) => {
                    let username = null;
                    const { data: prof } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("id", payload.new.user_id)
                        .single();
                    if (prof?.username) username = prof.username;

                    setMessages(curr => [...curr, { ...payload.new, username }]);
                    smoothScrollDown();
                }
            )
            .subscribe();

        // Presence / typing
        const presenceChannel = supabase.channel(`typing-${gid}`, {
            config: { presence: { key: user.id } },
        });

        presenceChannel
            .on("presence", { event: "sync" }, () => {
                const state = presenceChannel.presenceState();
                // state = { [userId]: [ { username, typing } ] }
                const list = Object.entries(state)
                    .flatMap(([id, metas]) =>
                        metas.map(m => ({ id, username: m.username || "Utente", typing: !!m.typing }))
                    )
                    .filter(p => p.id !== user.id && p.typing);
                setTypingUsers(list);
            });

        presenceChannel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                // primo track (non sta scrivendo)
                await presenceChannel.track({
                    username: selfUsername || user.email?.split("@")[0] || "Utente",
                    typing: false,
                });
            }
        });

        presenceRef.current = presenceChannel;

        return () => {
            ignore = true;
            supabase.removeChannel(msgChannel);
            if (presenceRef.current) supabase.removeChannel(presenceRef.current);
            presenceRef.current = null;
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [gid, authLoading, user, selfUsername, gameId]);

    // invio messaggio
    const send = async (e) => {
        e.preventDefault();
        if (!user) return;
        const content = text.trim();
        if (!content || sending) return;

        setSending(true);
        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content,
            game_id: gid,
        });
        if (!error) setText("");
        else console.error("Insert message error:", error);
        setSending(false);
    };

    // typing update (presence)
    const handleTyping = (val) => {
        setText(val);
        if (!presenceRef.current) return;

        // manda "typing: true", poi auto-false dopo 1.2s di inattività
        presenceRef.current.update({
            username: selfUsername || user.email?.split("@")[0] || "Utente",
            typing: true,
        });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            presenceRef.current?.update({
                username: selfUsername || user.email?.split("@")[0] || "Utente",
                typing: false,
            });
        }, 1200);
    };

    // --- UI ---

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
                            const mine = m.user_id === user.id;
                            const username = m.username || "Utente sconosciuto";
                            return (
                                <div
                                    key={m.id}
                                    className="mb-2"
                                    style={{ transition: "opacity .25s ease, transform .25s ease", opacity: 1, transform: "translateY(0)" }}
                                >
                                    <div className={`my-1 p-2 rounded text-sm w-80 ${mine ? "bg-green-100 ml-auto text-right" : "bg-gray-200 mr-auto text-left"}`}>
                                        <div className={`flex items-center gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                                            {/* avatar con iniziali (solo per gli altri) */}
                                            {!mine && (
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white"
                                                    style={{ backgroundColor: colorFromString(username) }}
                                                    title={username}
                                                >
                                                    {initialsOf(username)}
                                                </div>
                                            )}
                                            <div className="text-[10px] text-gray-600">
                                                <strong>{mine ? "Tu" : username}</strong> · {formatRelativeIT(m.created_at)}
                                            </div>
                                        </div>
                                        <div className={`text-gray-900 ${mine ? "" : "mt-1"}`}>{m.content}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* barra "sta scrivendo..." */}
                {typingUsers.length > 0 && (
                    <div className="text-[11px] text-gray-300">
                        {typingUsers.slice(0, 2).map(t => t.username).join(", ")}
                        {typingUsers.length > 2 ? ` e altri ${typingUsers.length - 2}` : ""} sta{typingUsers.length > 1 ? "nno" : ""} scrivendo…
                    </div>
                )}

                <form onSubmit={send} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-60"
                        placeholder="Scrivi un messaggio…"
                        value={text}
                        onChange={(e) => handleTyping(e.target.value)}
                        disabled={sending}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send(e);
                            }
                        }}
                    />
                    <button
                        className="rounded-md bg-green-700 hover:bg-green-600 transition px-4 py-2 text-sm font-medium disabled:opacity-60"
                        disabled={!text.trim() || sending}
                    >
                        {sending ? "Invio…" : "Invia"}
                    </button>
                </form>
            </div>
        </div>
    );
}