import { useState, useEffect, useRef, useCallback } from 'react';
import { ChartDataPoint } from '../types';

interface StreamState {
  data: ChartDataPoint[];
  connected: boolean;
  lastUpdate: Date | null;
  totalPoints: number;
  anomalyCount: number;
}

export function useMockStream(active: boolean, intervalMs = 1000) {
  const [stream, setStream] = useState<StreamState>({
    data: [], connected: false, lastUpdate: null, totalPoints: 0, anomalyCount: 0,
  });
  const valueRef = useRef(50);
  const predRef = useRef(50);

  const addPoint = useCallback(() => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const delta = (Math.random() - 0.48) * 9;
    valueRef.current = Math.max(0, Math.min(200, valueRef.current + delta));
    predRef.current = Math.max(0, Math.min(200, predRef.current + (Math.random() - 0.5) * 6));
    const isAnomaly = Math.abs(delta) > 7;
    const value = Number(valueRef.current.toFixed(2));
    const predicted = Number(predRef.current.toFixed(2));

    setStream(prev => ({
      data: [...prev.data, {
        time, value, predicted,
        upper: Number((predicted + 8).toFixed(2)),
        lower: Number((predicted - 8).toFixed(2)),
        isAnomaly,
      }].slice(-80),
      connected: true,
      lastUpdate: now,
      totalPoints: prev.totalPoints + 1,
      anomalyCount: prev.anomalyCount + (isAnomaly ? 1 : 0),
    }));
  }, []);

  useEffect(() => {
    if (!active) {
      setStream(prev => ({ ...prev, connected: false }));
      return;
    }
    setStream(prev => ({ ...prev, connected: true }));
    const id = setInterval(addPoint, intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs, addPoint]);

  const reset = useCallback(() => {
    valueRef.current = 50;
    predRef.current = 50;
    setStream({ data: [], connected: false, lastUpdate: null, totalPoints: 0, anomalyCount: 0 });
  }, []);

  return { ...stream, reset };
}
