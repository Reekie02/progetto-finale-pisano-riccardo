
import { useCallback, useEffect, useState } from "react";


export default function useFetchSolution(initialUrl = "") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [url, setUrl] = useState(initialUrl);

    const doFetch = useCallback(async (currentUrl) => {
        if (!currentUrl) return;
        try {
            setLoading(true);
            setError("");
            const res = await fetch(currentUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            setError(e?.message || "Errore di rete");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        doFetch(url);
    }, [url, doFetch]);

    return { data, loading, error, url, setUrl, refetch: () => doFetch(url) };
}