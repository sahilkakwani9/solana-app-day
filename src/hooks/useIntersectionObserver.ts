import { useEffect } from "react";

interface UseIntersectionObserverProps {
  target: React.RefObject<Element>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0.8,
  rootMargin = "0px",
}: UseIntersectionObserverProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const element = target.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [target.current, onIntersect, threshold, rootMargin]);
}
