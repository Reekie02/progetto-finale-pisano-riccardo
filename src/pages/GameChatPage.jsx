import { Link, useParams } from "react-router-dom";
import ChatRealtimeByGame from "../components/ChatRealtimeByGame.jsx";

export default function GameChatPage({ gameTitle }) {
    const { id } = useParams(); // game id
    return (
        <div className="">
            {/* <div className="max-w-xl mx-auto flex items-center justify-between">
                <Link to={`/game/${id}`} className="text-green-600 hover:underline">
                    ← Torna al gioco
                </Link>
            </div> */}
            <ChatRealtimeByGame gameId={id} gameTitle={gameTitle} />
        </div>
    );
}