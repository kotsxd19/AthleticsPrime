import { useState, useEffect, useCallback, useRef } from 'react';

export function useCarousel(total = 4, delay = 4000) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => {
    setIdx(((i % total) + total) % total);
  }, [total]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIdx(prev => (prev + 1) % total),
      delay
    );
  }, [total, delay]);

  const next = useCallback(() => { goTo(idx + 1); resetTimer(); }, [idx, goTo, resetTimer]);
  const prev = useCallback(() => { goTo(idx - 1); resetTimer(); }, [idx, goTo, resetTimer]);
  const jumpTo = useCallback((i) => { goTo(i); resetTimer(); }, [goTo, resetTimer]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  return { idx, next, prev, jumpTo };
}