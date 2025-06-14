"use client";

import React from "react";
import styles from "./NavUser.module.css";

interface NavUserProps {
  avatarUrl?: string;
  name?: string;
}

export function NavUser({ avatarUrl, name }: NavUserProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "N";

  return (
    <div className={styles.userContainer}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className={styles.avatarImage} />
      ) : (
        <div className={styles.avatarFallback}>{initials}</div>
      )}
    </div>
  );
}
