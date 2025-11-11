import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function AuthSignInPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });


    const validate = () => {
        const next = { email: "", password: "" };

        if (!email.trim()) {
            next.email = "Inserisci la tua email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            next.email = "Inserisci un'email valida.";
        }

        if (!password.trim()) {
            next.password = "Inserisci la password.";
        }

        setFieldErrors(next);
        return !next.email && !next.password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        const isValid = validate();
        if (!isValid) return;

        try {
            setLoading(true);
            await signIn({ email, password });
            const redirectTo = location.state?.from ?? "/";
            navigate(redirectTo, { replace: true });
        } catch (err) {

            if (err?.message?.toLowerCase().includes("invalid login credentials")) {
                setError("Email o password non corretti.");
            } else {
                setError("Errore di accesso. Riprova più tardi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-[#242424] shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-[#eee]">
                Accedi
            </h1>

            {error && (
                <p className="text-red-500 mb-3 text-sm text-center">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6 text-[#eee]">
                {/* EMAIL */}
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        className={`w-full px-3 py-2 text-sm border-b text-green-500
                            ${fieldErrors.email ? "border-red-500" : "border-gray-300"}
                        `}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            if (fieldErrors.email) {
                                setFieldErrors((prev) => ({ ...prev, email: "" }));
                            }
                        }}
                        placeholder="you@example.com"
                    />
                    {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-400">
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-sm mb-1">Password</label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`w-full px-3 py-2 text-sm border-b text-green-500
                            ${fieldErrors.password ? "border-red-500" : "border-gray-300"}
                        `}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (fieldErrors.password) {
                                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                                }
                            }}
                            placeholder="••••••••"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                        >
                            {showPassword ? (
                                <EyeOffIcon size={18} />
                            ) : (
                                <EyeIcon size={18} />
                            )}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <p className="mt-1 text-xs text-red-400">
                            {fieldErrors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded py-2 transition text-sm font-semibold"
                >
                    {loading ? "Accesso in corso..." : "Accedi"}
                </button>
            </form>

            <p className="text-sm text-center mt-4 text-[#eee]">
                Non hai un account?{" "}
                <Link to="/auth/signup" className="text-green-400 hover:underline">
                    Registrati
                </Link>
            </p>
        </div>
    );
}