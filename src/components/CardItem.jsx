import icon from "../assets/favicon-02.png";

export default function CardItem({
    title,
    description,
    imageUrl,
    rating,
    released,
    genres,
    extra,
}) {
    return (
        <article
            className={`
                group
                w-[300px]
                mt-3
                overflow-hidden
                rounded-lg
                bg-[#242424de]
                relative
                ${extra ? "h-[380px]" : "h-[300px]"}
                md:transition-transform duration-300 ease-out
                md:hover:scale-105               
                md:hover:-translate-y-1          
                md:hover:shadow-[0_18px_40px_rgba(0,0,0,0.65)]
            `}
        >
            {/* IMMAGINE */}
            <div className="relative w-full h-52 overflow-hidden">
                <img
                    src={imageUrl || "https://picsum.photos/seed/placeholder/400/300"}
                    alt={title}
                    loading="lazy"
                    className="
                        w-full h-full object-cover
                        md:transition-transform duration-200 ease-out
                        md:group-hover:scale-105
                    "
                />

                {/* overlay soft sopra immagine */}
                <div
                    className="
                        pointer-events-none
                        absolute inset-0
                        {bg-gradient-to-t from-black/70 via-black/20 to-transparent}
                        opacity-70
                        transition-opacity duration-200
                        group-hover:opacity-90
                    "
                />

                {/* logo A-KAI */}
                <img
                    src={icon}
                    alt=""
                    className="absolute right-3 top-3 w-12 h-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                />
            </div>

            {/* CONTENUTO BASE */}
            <div className="p-4 pb-3 flex flex-col gap-1">
                <h3 className="text-xl font-semibold line-clamp-1 text-[#e5e5e5]">
                    {title}
                </h3>

                {description && (
                    <p className="text-[#9ca3af] text-sm line-clamp-2">
                        {description}
                    </p>
                )}

                {/* riga compatta sempre visibile, tipo RAWG (rating) */}
                {rating && (
                    <p className="mt-1 text-lg text-[#9ca3af]">
                        Rating:{" "}
                        <span className="text-green-400 font-semibold">{rating}</span>
                    </p>
                )}
            </div>

            {/* PANNELLO HOVER CON DETTAGLI EXTRA (stile RAWG) */}
            <div
                className={`
                    pointer-events-none
                    absolute inset-x-0 bottom-0
                    px-4 pb-4 pt-3
                    hidden md:block ${extra && "bg-[rgba(21,21,21,0.96)] border-t border-white/5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out text-xs text-[#d1d5db] space-y-1"}
                `}
            >
                {/* [rgba(10,10,10,0.96)] */}
                {released && (
                    <p className="flex justify-between">
                        <span className="text-[#9ca3af]">Data di uscita</span>
                        <span>{released}</span>
                    </p>
                )}

                {genres && (
                    <p className="flex justify-between gap-2">
                        <span className="text-[#9ca3af]">Generi</span>
                        <span className="text-right line-clamp-1">{genres}</span>
                    </p>
                )}

                {extra && (
                    <p className="flex justify-between gap-2">
                        <span className="text-[#9ca3af]">Piattaforme</span>
                        <span className="text-right line-clamp-1">{extra}</span>
                    </p>
                )}
            </div>
        </article>
    );
}