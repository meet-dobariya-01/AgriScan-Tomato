import { useState, useCallback } from "react";

export interface HistoryEntry {
  id: string;
  predicted_disease: string;
  confidence_percentage: number;
  inference_time: number;
  previewUrl: string | null;
  timestamp: string;
}

const STORAGE_KEY = "atliq_scan_history";
const MAX_ENTRIES = 20;

const load = (): HistoryEntry[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (entries: HistoryEntry[]) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
};

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>(load);

  const addEntry = useCallback((
    result: { predicted_disease: string; confidence_percentage: number; inference_time: number },
    previewUrl: string | null
  ) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      predicted_disease: result.predicted_disease,
      confidence_percentage: result.confidence_percentage,
      inference_time: result.inference_time,
      previewUrl,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      save(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, deleteEntry, clearHistory };
};
