import { useEffect, useState } from "react";

//custom hook to fetch data
function useFetchPhotos(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("failed to fetch data. Try again later!");
        }

        const photoData = await res.json();
        setData(photoData);
      } catch (error) {
        if (error.name !== "AbortError") setErr(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [url]);
  return { data, loading, err };
}
export default useFetchPhotos;
