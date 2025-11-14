// src/components/SortMenu.jsx
import { CircleArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SortMenu({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const options = [
        { id: "relevance", label: "Relevance" },
        { id: "added", label: "Date added" },
        { id: "name", label: "Name" },
        { id: "released", label: "Release date" },
        { id: "rating", label: "Average rating" },
    ];

    // chiudi quando clicchi fuori
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="px-4 py-2 bg-[#1e1e1e] text-white rounded-md border border-[#333] hover:bg-[#2a2a2a] transition flex items-center justify-center gap-2"
            >
                <span>
                    {options.find((o) => o.id === value)?.label || "Relevance"}
                </span>
                <span className="text-green-400 relative top-0.5"><CircleArrowDown size={18} /></span>
            </button>

            {open && (
                <div className="absolute -top-3 -right-7 mt-2 w-48 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-lg p-2 z-50">
                    {options.map((o) => (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                                onChange(o.id);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md cursor-pointer text-sm
                                text-white hover:bg-[#2a2a2a]
                                ${value === o.id ? "text-green-400" : ""}`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}