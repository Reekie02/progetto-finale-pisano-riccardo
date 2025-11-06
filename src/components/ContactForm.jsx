
import { useState } from "react";

export default function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [sending, setSending] = useState(false);

    const onChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const validate = () => {
        if (!form.name.trim()) return "Inserisci il tuo nome";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            return "Inserisci un'email valida";
        if (!form.subject.trim()) return "Inserisci un oggetto";
        if (!form.message.trim()) return "Scrivi un messaggio";
        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });

        const err = validate();
        if (err) {
            setStatus({ type: "error", msg: err });
            return;
        }

        try {
            setSending(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.error || `HTTP ${res.status}`);
            }

            setStatus({
                type: "success",
                msg: "Messaggio inviato! Ti risponderemo al più presto.",
            });
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error(error);
            setStatus({
                type: "error",
                msg:
                    "Invio non riuscito.",
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-start justify-center p-6">
            <div className="w-full max-w-xl bg-[#242424] text-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-semibold mb-1">Contattaci</h1>
                <p className="text-sm text-gray-300 mb-5">
                    Hai domande o suggerimenti? Compila il form e ti risponderemo.
                </p>

                {status.msg && (
                    <div
                        className={`mb-4 rounded-md px-3 py-2 text-sm ${status.type === "success"
                            ? "bg-green-700/20 text-green-300 border border-green-700/40"
                            : "bg-red-600/20 text-red-300 border border-red-600/40"
                            }`}
                    >
                        {status.msg}
                    </div>
                )}

                <form onSubmit={onSubmit} className="grid gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-green-400 mb-1">
                            Nome
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Il tuo nome"
                            className="w-full rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-green-400 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="esempio@mail.com"
                            className="w-full rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-green-400 mb-1">
                            Oggetto
                        </label>
                        <input
                            name="subject"
                            value={form.subject}
                            onChange={onChange}
                            placeholder="Di cosa si tratta?"
                            className="w-full rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-green-400 mb-1">
                            Messaggio
                        </label>
                        <textarea
                            name="message"
                            rows={5}
                            value={form.message}
                            onChange={onChange}
                            placeholder="Scrivi qui il tuo messaggio..."
                            className="w-full rounded-md bg-[#1a1a1a] border border-green-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="mt-1 inline-flex items-center justify-center rounded-md bg-green-700 hover:bg-green-600 transition px-4 py-2 text-sm font-medium disabled:opacity-60"
                    >
                        {sending ? "Invio..." : "Invia messaggio"}
                    </button>
                </form>
            </div>
        </div>
    );
}