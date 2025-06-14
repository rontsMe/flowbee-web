import styles from "./Breadcrumbs.module.css";

export function Breadcrumbs() {
  return (
    <nav className={styles.breadcrumbBar}>
      <span className={styles.link}>Dashboard</span>
      <span className={styles.separator}>/</span>
      <span className={styles.current}>System Overview</span>
    </nav>
  );
}
