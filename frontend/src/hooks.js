import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

// Loads data from the API and exposes loading / error / reload for the UI states.
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    api(path)
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: err.message }));
    return () => { cancelled = true; };
  }, [path, tick]);

  return { ...state, reload };
}

export function useDocumentTitle(title) {
  useEffect(() => { document.title = `${title} · UCU Lost and Found`; }, [title]);
}
