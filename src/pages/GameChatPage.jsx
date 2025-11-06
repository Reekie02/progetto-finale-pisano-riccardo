import { Link, useParams } from "react-router-dom";
import ChatRealtimeByGame from "../components/ChatRealtimeByGame.jsx";

export default function GameChatPage() {
    const { id } = useParams(); // game id
    return (
        <div className="p-4">
            <div className="max-w-xl mx-auto flex items-center justify-between">
                <Link to={`/game/${id}`} className="text-green-600 hover:underline">
                    ← Torna al gioco
                </Link>
            </div>
            <ChatRealtimeByGame gameId={id} />
        </div>
    );
}