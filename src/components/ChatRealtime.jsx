// import { useEffect, useState } from "react";
// import { supabase } from "../supabase/supabaseClient.js";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function ChatRealtime() {
//     const { user } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [newMsg, setNewMsg] = useState("");
//     const [loading, setLoading] = useState(true);

//     // carica messaggi iniziali
//     const fetchMessages = async () => {
//         setLoading(true);
//         const { data, error } = await supabase
//             .from("messages")
//             .select("id, user_id, content, created_at")
//             .order("created_at", { ascending: true });
//         if (!error) setMessages(data || []);
//         setLoading(false);
//     };

//     // invia messaggio
//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!user || !newMsg.trim()) return;
//         const { error } = await supabase.from("messages").insert({
//             user_id: user.id,
//             content: newMsg.trim(),
//         });
//         if (!error) setNewMsg("");
//     };

//     // realtime
//     useEffect(() => {
//         fetchMessages();
//         const channel = supabase
//             .channel("realtime-chat")
//             .on(
//                 "postgres_changes",
//                 { event: "INSERT", schema: "public", table: "messages" },
//                 (payload) => {
//                     setMessages((prev) => [...prev, payload.new]);
//                 }
//             )
//             .subscribe();
//         return () => supabase.removeChannel(channel);
//     }, []);

//     return (
//         <div className="max-w-xl mx-auto mt-10 p-4 bg-[#242424] shadow rounded flex flex-col gap-4">
//             <h2 className="text-lg font-semibold text-center text-green-700">💬 Realtime Chat</h2>

//             <div className="h-84 overflow-y-auto border p-2 rounded bg-gray-50">
//                 {loading ? (
//                     <p className="text-center text-sm text-gray-500">Caricamento...</p>
//                 ) : messages.length === 0 ? (
//                     <p className="text-center text-sm text-gray-500">Nessun messaggio ancora</p>
//                 ) : (
//                     messages.map((msg) => (
//                         <div
//                             key={msg.id}
//                             className={`my-1 p-2 rounded text-sm ${msg.user_id === user?.id
//                                 ? "bg-green-100 text-right"
//                                 : "bg-gray-200 text-left"
//                                 }`}
//                         >
//                             {msg.content}
//                             <div className="text-[10px] text-gray-500">
//                                 {new Date(msg.created_at).toLocaleTimeString()}
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {user ? (
//                 <form onSubmit={sendMessage} className="flex gap-2">
//                     <input
//                         type="text"
//                         value={newMsg}
//                         onChange={(e) => setNewMsg(e.target.value)}
//                         placeholder="Scrivi un messaggio..."
//                         className="flex-1 border rounded px-2 py-1 text-sm focus:outline-blue-500"
//                     />
//                     <button
//                         type="submit"
//                         className="bg-green-600 text-white px-3 py-1 rounded text-sm"
//                     >
//                         Invia
//                     </button>
//                 </form>
//             ) : (
//                 <p className="text-center text-sm text-gray-500">
//                     Effettua l'accesso per scrivere nella chat.
//                 </p>
//             )}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatRealtime({ gameId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // 1) Carica solo i messaggi del gioco corrente
    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("messages")
            .select("id, user_id, content, created_at, game_id")
            .eq("game_id", gameId)
            .order("created_at", { ascending: true });

        if (!error) setMessages(data || []);
        setLoading(false);
    };

    // 2) Invia messaggio (associato a questo gioco)
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user || !newMsg.trim()) return;

        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content: newMsg.trim(),
            game_id: gameId, // 👈 uso game_id invece di game_slug
        });

        if (!error) setNewMsg("");
    };

    // 3) Listener realtime solo per i messaggi di questo gioco
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
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [gameId]);

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-[#242424] shadow rounded flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-center text-green-700">
                💬 Chat gioco #{gameId}
            </h2>

            <div className="h-84 overflow-y-auto border p-2 rounded bg-gray-50">
                {loading ? (
                    <p className="text-center text-sm text-gray-500">
                        Caricamento...
                    </p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                        Nessun messaggio ancora
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`my-1 p-2 rounded text-sm ${msg.user_id === user?.id
                                    ? "bg-green-100 text-right"
                                    : "bg-gray-200 text-left"
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