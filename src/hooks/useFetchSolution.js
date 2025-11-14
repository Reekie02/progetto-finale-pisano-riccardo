import { useEffect, useState } from "react";

export default function useFetchSolution(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let abort = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Errore durante il caricamento dei dati");
        }

        const json = await res.json();
        if (!abort) {
          setData(json);
        }
      } catch (err) {
        if (!abort) {
          setError(err.message || "Errore sconosciuto");
        }
      } finally {
        if (!abort) {
          setLoading(false);
        }
      }
    }

    fetchData();


    return () => {
      abort = true;
    };
  }, [url]);

  return { data, loading, error };
}