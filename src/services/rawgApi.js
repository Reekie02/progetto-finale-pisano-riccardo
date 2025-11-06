const RAWG_API_KEY = "f57a3326e9f24156a37cfb15cdb32be8";
const BASE_URL = "https://api.rawg.io/api";

// Helper generico
async function apiGet(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set("key", RAWG_API_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);
    return res.json();
}

// Generi
export async function fetchGenres() {
    const data = await apiGet("/genres");
    return Array.isArray(data?.results) ? data.results : [];
}

// Giochi (prima pagina, opzionale)
export async function fetchGamesPage(page = 1) {
    const data = await apiGet("/games", { page: String(page) });
    return Array.isArray(data?.results) ? data.results : [];
}


export async function fetchGamesByGenreSlug(slug, page = 1) {
    const data = await apiGet("/games", { genres: slug, page: String(page) });
    return Array.isArray(data?.results) ? data.results : [];
}


export async function fetchGameById(id) {
    const data = await apiGet(`/games/${id}`);
    return data || null;
}