// // src/pages/GenreDetailPage.jsx
// import { Link, useParams } from "react-router-dom";
// import useFetchSolution from "../hooks/useFetchSolution.js";
// import CardItem from "../components/CardItem.jsx";
// import { useState } from "react";
// import SortMenu from "../components/SortMenu.jsx";

// const API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
// const BASE_URL = "https://api.rawg.io/api";

// export default function GenreDetailPage() {
//     const [sort, setSort] = useState("relevance");
//     const { genre } = useParams();
//     const { data, loading, error } = useFetchSolution(
//         `${BASE_URL}/games?key=${API_KEY}&genres=${encodeURIComponent(genre)}&page=1`
//     );

//     const games = Array.isArray(data?.results) ? data.results : [];
//     console.log(games);


//     return (
//         <>
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-3xl font-bold">
//                     Genere: <br /> <span className="uppercase italic">{genre}</span>
//                 </h1>
//                 <Link to="/" className="text-green-600 hover:underline">
//                     ← Torna alla Home
//                 </Link>
//             </div>

//             <div className=" text-center">
//                 <SortMenu value={sort} onChange={setSort} />
//             </div>

//             {loading && <p className="text-gray-500">Caricamento giochi…</p>}
//             {error && <p className="text-red-600">{error}</p>}

//             {!loading && !error && (

//                 <div className="flex flex-wrap gap-10 justify-center max-w-[calc(full-2.5rem) mt-22">

//                     {games.map((game) => (
//                         <Link key={game.id} to={`/game/${game.id}`}>
//                             {/* <CardItem
//                                 title={game.name}
//                                 description={`Rating: ${game.rating ?? "n/d"}`}
//                                 imageUrl={game.background_image}
//                             /> */}
//                             <CardItem
//                                 title={game.name}
//                                 description={game.short_description}
//                                 imageUrl={game.background_image}
//                                 rating={game.rating?.toFixed(2)}
//                                 released={game.released}
//                                 genres={game.genres?.map((g) => g.name).join(" · ")}
//                                 extra={game.parent_platforms?.map((p) => p.platform.name).join(" · ")}
//                             />
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </>
//     );
// }




// src/pages/GenreDetailPage.jsx
import { Link, useParams } from "react-router-dom";
import useFetchSolution from "../hooks/useFetchSolution.js";
import CardItem from "../components/CardItem.jsx";
import { useState, useMemo } from "react";
import SortMenu from "../components/SortMenu.jsx";

const API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
const BASE_URL = "https://api.rawg.io/api";

export default function GenreDetailPage() {
    const [sort, setSort] = useState("relevance");
    const { genre } = useParams();

    const { data, loading, error } = useFetchSolution(
        `${BASE_URL}/games?key=${API_KEY}&genres=${encodeURIComponent(
            genre
        )}&page=1`
    );

    const games = Array.isArray(data?.results) ? data.results : [];

    const sortedGames = useMemo(() => {
        const arr = [...games];

        return arr.sort((a, b) => {
            switch (sort) {
                case "name":
                    return a.name.localeCompare(b.name);

                case "released": {
                    const ra = a.released || "";
                    const rb = b.released || "";
                    return rb.localeCompare(ra);
                }

                case "rating": {
                    const ra = a.rating || 0;
                    const rb = b.rating || 0;
                    return rb - ra;
                }

                case "added": {
                    const aa = a.added || 0;
                    const ab = b.added || 0;
                    return ab - aa;
                }

                case "relevance":
                default:
                    return 0;
            }
        });
    }, [games, sort]);

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-green-500 flex flex-col md:flex-row md:gap-3">
                    Genere:
                    <span className="uppercase italic text-green-500">
                        {genre}
                    </span>
                </h1>
                <Link
                    to="/"
                    className="text-green-500 hover:text-green-400 hover:underline"
                >
                    ← Home
                </Link>
            </div>

            {/* SORT MENU */}
            <div className="text-center mb-6">
                <SortMenu value={sort} onChange={setSort} />
            </div>

            {loading && (
                <p className="text-gray-400 text-center">
                    Caricamento giochi…
                </p>
            )}
            {error && (
                <p className="text-red-500 text-center">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <div className="flex flex-wrap gap-10 justify-center mt-4">
                    {sortedGames.map((game) => (
                        <Link key={game.id} to={`/game/${game.id}`}>
                            <CardItem
                                title={game.name}
                                description={game.short_description}
                                imageUrl={game.background_image}
                                rating={game.rating?.toFixed(2)}
                                released={game.released}
                                genres={game.genres
                                    ?.map((g) => g.name)
                                    .join(" · ")}
                                extra={game.parent_platforms
                                    ?.map((p) => p.platform.name)
                                    .join(" · ")}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}