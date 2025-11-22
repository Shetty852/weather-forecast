// src/hooks/useFetch.js
import { useEffect, useState, useRef } from 'react';

// A simple fetch hook that accepts an async fetcher function and deps.
// It supports localStorage fallback cache when `cacheKey` is provided.
export default function useFetch(fetcher, deps = [], { cacheKey } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (!mounted.current) return;
        setData(result);
        if (cacheKey) {
          try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}
        }
      } catch (err) {
        if (!mounted.current) return;
        setError(err.message || err.toString());
        if (cacheKey) {
          try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) setData(JSON.parse(cached));
          } catch (e) {}
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    }
    load();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
