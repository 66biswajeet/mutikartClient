"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

export default function HeroCarousel() {
  const count = 6;
  const slides = Array.from({ length: count });
  const [errored, setErrored] = useState(() => Array(count).fill(false));
  const [multibannerAvailable, setMultibannerAvailable] = useState(false);

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // start autoplay once on mount
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 3500);
    // check if multibanner.jpg exists
    const checkImg = new Image();
    checkImg.onload = () => setMultibannerAvailable(true);
    checkImg.onerror = () => setMultibannerAvailable(false);
    checkImg.src = "/carousel/multibanner.jpg";
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoPlay = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % count);
      }, 3500);
    }
  };

  const goTo = (i) => {
    setIndex(i % count);
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      ref={containerRef}
    >
      <div
        className={styles.track}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((_, i) => (
          <div className={styles.slide} key={i}>
            {!errored[i] ? (
              <img
                src={
                  multibannerAvailable
                    ? "/carousel/multibanner.jpg"
                    : `/carousel/slide-${i + 1}.jpg`
                }
                alt={`slide-${i + 1}`}
                className={styles.image}
                // First image gets priority loading for LCP
                fetchpriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={() => {
                  setErrored((prev) => {
                    const copy = [...prev];
                    copy[i] = true;
                    return copy;
                  });
                }}
              />
            ) : null}

            {errored[i] ? (
              <div className={styles.placeholder}>
                <div className={styles.skeleton} />
                <div className={styles.dimText}>1200 x 400</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
