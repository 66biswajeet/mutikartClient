"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PopularCategories.module.css";

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const url = `${API}/api/category?type=product&status=1&parent_id=null&limit=20&include_subcategories=true`;

    let mounted = true;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        // Expecting data.categories or data.data depending on backend; try both
        const list = data?.categories || data?.data || data || [];
        setCategories(list.slice(0, 12));
      })
      .catch(() => {
        // fallback nothing
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // start autoplay after categories load
    if (!categories || categories.length === 0) return;

    let idx = 0;
    const next = () => {
      idx = (idx + 1) % categories.length;
      scrollToIndex(idx);
    };

    intervalRef.current = setInterval(next, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const scrollToIndex = (i) => {
    const container = containerRef.current;
    const card = cardRefs.current[i];
    if (!container || !card) return;
    const left =
      card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  };

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (!intervalRef.current && categories.length > 0) {
      intervalRef.current = setInterval(() => {
        // find current centered card and move next
        const container = containerRef.current;
        if (!container) return;
        const scrollLeft = container.scrollLeft + container.clientWidth / 2;
        let nearest = 0;
        let nearestDist = Infinity;
        cardRefs.current.forEach((c, idx) => {
          if (!c) return;
          const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - scrollLeft);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = idx;
          }
        });
        const nextIdx = (nearest + 1) % categories.length;
        scrollToIndex(nextIdx);
      }, 3000);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Popular Categories</h2>
      </div>
      <div
        className={styles.track}
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {categories.map((cat, i) => (
          <a
            key={cat._id || cat.id || i}
            href={`/category/${cat.slug || cat.id || i}`}
            className={styles.card}
            ref={(el) => (cardRefs.current[i] = el)}
          >
            <div className={styles.imgWrap}>
              {/* Use provided icon/image if available; otherwise use the default mobiles.webp */}
              <img
                src={
                  cat.icon
                    ? cat.icon
                    : cat.image
                    ? cat.image
                    : "/category/mobiles.webp"
                }
                alt={cat.name}
              />
            </div>
            <h3 className={styles.name}>{cat.name}</h3>
            <p className={styles.count}>
              {cat.total_products || cat.count || ""}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
