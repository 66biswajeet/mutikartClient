"use client";

import { useState } from "react";
import styles from "./StickyNote.module.css";

export default function StickyNote() {
  // Do not persist dismissal so the note reappears on page refresh
  const [hidden, setHidden] = useState(false);

  const handleClose = () => {
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className={styles.sticky} aria-hidden={hidden ? "true" : "false"}>
      <button
        className={styles.close}
        onClick={handleClose}
        aria-label="Close promotional note"
      >
        ×
      </button>

      <div className={styles.note} role="note" aria-live="polite">
        <div className={styles.head}>GET UPTO</div>
        <div className={styles.discount}>50%</div>
        <div className={styles.code}>USE COUPON: SAVE50</div>
      </div>
    </div>
  );
}
