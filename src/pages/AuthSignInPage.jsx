import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthSignInPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            await signIn({ email, password });
            const redirectTo = location.state?.from ?? "/";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err?.message || "Errore di accesso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-[#242424] shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Accedi</h1>

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
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white rounded py-2 transition"
                >
                    {loading ? "Accesso in corso..." : "Accedi"}
                </button>
            </form>

            <p className="text-sm text-center mt-4 text-[#eee]">
                Non hai un account?{" "}
                <Link to="/auth/signup" className="text-green-600 hover:underline">
                    Registrati
                </Link>
            </p>
        </div>
    );
}