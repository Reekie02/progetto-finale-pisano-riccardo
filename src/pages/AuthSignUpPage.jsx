import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthSignUpPage() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            setLoading(true);
            const { user } = await signUp({ email, password });
            // Se Supabase ha le conferme email attive, user potrebbe essere null finché non confermi
            setMessage("Registrazione completata. Controlla la tua email per confermare l'account.");
            // opzionale: redirect diretto
            navigate("/auth/signin");
        } catch (err) {
            setError(err?.message || "Errore in registrazione");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-[#242424] shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Registrati</h1>

            {message && <p className="text-green-700 mb-3">{message}</p>}
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-7 text-[#eee]">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 caratteri"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white rounded py-2"
                >
                    {loading ? "Registrazione..." : "Crea account"}
                </button>
            </form>

            <p className="text-sm text-center mt-4 text-[#eee]">
                Hai già un account?{" "}
                <Link to="/auth/signin" className="text-green-700 hover:underline">
                    Accedi
                </Link>
            </p>
        </div>
    );
}