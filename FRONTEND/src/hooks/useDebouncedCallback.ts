"use client";

import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debounced = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const fn = (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    };

    return fn as T;
  }, [delayMs]);

  useEffect(() => {
    return () => {
      // Cancel pending debounced calls on unmount.
    };
  }, [debounced]);

  return debounced;
}
