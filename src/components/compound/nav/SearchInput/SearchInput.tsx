"use client";

import React from "react";
import styles from "./SearchInput.module.css";
import { useKBar } from "kbar";

export function SearchInput() {
  const { query } = useKBar();

  const handleClick = () => {
    query.toggle();
  };

  return (
    <div className={styles.searchContainer} role="button" tabIndex={0} onClick={handleClick}>
      <input
        type="text"
        placeholder="Search..."
        readOnly
        className={styles.searchInput}
      />
      <kbd className={styles.shortcut}>⌘K</kbd>
    </div>
  );
}
