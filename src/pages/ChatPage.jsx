
import { useParams } from "react-router-dom";
import ChatRealtimeByGame from "../components/ChatRealtimeByGame.jsx";

export default function ChatPage() {

    const { id } = useParams();
    return (
        <div className="p-4">
            <ChatRealtimeByGame gameId={id} />
        </div>
    );
}