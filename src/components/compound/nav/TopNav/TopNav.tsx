"use client";

import styles from "./TopNav.module.css";
import { Bell } from "lucide-react";
import { SearchInput } from "../SearchInput/SearchInput";
import { NavUser } from "../NavUser/NavUser";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export function TopNav() {
  return (
    <header className={styles.topNav}>
      <div className={styles.left}></div>

      <div className={styles.center}>
        <SearchInput />
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton}>
          <Bell size={18} />
        </button>
        <ThemeToggle />
        <NavUser />
      </div>
    </header>
  );
}
